const BACKUP_QUERY = `query ($search: String) {
  Page(page: 1, perPage: 20) {
    media(search: $search, type: ANIME) {
      id idMal title { romaji english } coverImage { large }
      episodes averageScore status format genres
    }
  }
}`;

function normalizeBackup(item) {
  return {
    mal_id: item.idMal ?? `anilist-${item.id}`,
    title: item.title?.english || item.title?.romaji || 'Untitled anime',
    images: { jpg: { image_url: item.coverImage?.large } },
    episodes: item.episodes,
    score: typeof item.averageScore === 'number' ? item.averageScore / 10 : null,
    status: item.status?.replaceAll('_', ' ') || 'Unknown status',
    type: item.format?.replaceAll('_', ' ') || 'Unknown type',
    genres: (item.genres || []).map(name => ({ name })),
    rating: 'Age rating not supplied by this source',
  };
}

export function createAnimeHandler({ fetchImpl = globalThis.fetch, timeoutMs = 4000 } = {}) {
  return async function animeHandler(req, res) {
    const send = (status, body) => {
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', status === 200
        ? 'public, s-maxage=300, stale-while-revalidate=600'
        : 'no-store');
      res.end(JSON.stringify(body));
    };
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return send(405, { error: 'Use GET to search anime.' });
    }
    const query = new URL(req.url, 'http://localhost').searchParams.get('q')?.trim();
    if (!query || query.length > 100) {
      return send(400, { error: 'Enter an anime title of up to 100 characters.' });
    }

    async function requestJson(url, options = {}) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetchImpl(url, { ...options, signal: controller.signal });
        if (!response.ok) {
          const error = new Error('Upstream unavailable');
          error.status = response.status;
          throw error;
        }
        return await response.json();
      } finally {
        clearTimeout(timer);
      }
    }

    // Both hosts are fixed; visitors cannot use this as an arbitrary URL proxy.
    let primaryError;
    try {
      const url = new URL('https://api.jikan.moe/v4/anime');
      url.searchParams.set('q', query);
      url.searchParams.set('limit', '20');
      const payload = await requestJson(url, { headers: { Accept: 'application/json' } });
      if (!Array.isArray(payload?.data)) throw new Error('Invalid response');
      return send(200, { data: payload.data, provider: 'Jikan' });
    } catch (error) {
      primaryError = error;
    }

    try {
      const payload = await requestJson('https://graphql.anilist.co', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: BACKUP_QUERY, variables: { search: query } }),
      });
      const media = payload?.data?.Page?.media;
      if (payload.errors?.length || !Array.isArray(media)) throw new Error('Invalid response');
      return send(200, { data: media.map(normalizeBackup), provider: 'AniList' });
    } catch (error) {
      if (primaryError.status === 429 || error.status === 429) {
        res.setHeader('Retry-After', '30');
        return send(429, { error: 'Live search is busy. Please wait a moment and retry.' });
      }
      const timedOut = primaryError.name === 'AbortError' || error.name === 'AbortError';
      return send(502, { error: timedOut
        ? 'Live search took too long. You can retry or explore the sample titles below.'
        : 'Live search is temporarily unavailable. You can retry or explore the sample titles below.' });
    }
  };
}

export default createAnimeHandler();
