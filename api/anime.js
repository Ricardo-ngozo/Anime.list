export function createAnimeHandler({ fetchImpl = globalThis.fetch, timeoutMs = 8000 } = {}) {
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
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      // Fixed upstream and bounded query: this is not an arbitrary URL proxy.
      const url = new URL('https://api.jikan.moe/v4/anime');
      url.searchParams.set('q', query);
      url.searchParams.set('limit', '20');
      const response = await fetchImpl(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      if (response.status === 429) {
        res.setHeader('Retry-After', '30');
        return send(429, { error: 'Live search is busy. Please wait a moment and retry.' });
      }
      if (!response.ok) throw new Error('Upstream unavailable');
      const payload = await response.json();
      if (!Array.isArray(payload?.data)) throw new Error('Invalid response');
      return send(200, { data: payload.data });
    } catch {
      return send(502, { error: controller.signal.aborted
        ? 'Live search took too long. You can retry or explore the sample titles below.'
        : 'Live search is temporarily unavailable. You can retry or explore the sample titles below.' });
    } finally {
      clearTimeout(timer);
    }
  };
}

export default createAnimeHandler();
