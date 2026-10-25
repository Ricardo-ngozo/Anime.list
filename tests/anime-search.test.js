import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchAnime } from '../src/lib/animeSearch.js';
import { createAnimeHandler } from '../api/anime.js';
import { sampleTitles } from '../src/data/animeSamples.js';

const json = (body, status = 200) => new Response(JSON.stringify(body), { status });
const abortableRequest = (_, { signal }) => new Promise((resolve, reject) => {
  signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
});

async function callHandler({ url = '/api/anime?q=Naruto', method = 'GET', fetchImpl, timeoutMs } = {}) {
  const headers = {};
  let body;
  const res = {
    setHeader(name, value) { headers[name] = value; },
    end(value) { body = JSON.parse(value); },
  };
  await createAnimeHandler({ fetchImpl, timeoutMs })({ url, method }, res);
  return { status: res.statusCode, headers, body };
}

test('search encodes the title and uses the same-origin endpoint', async () => {
  let path;
  const items = [{ mal_id: 20, title: 'Naruto' }];
  assert.deepEqual(await fetchAnime(' A & B ', { request: async url => {
    path = url;
    return json({ data: items });
  } }), { anime: items, provider: 'Jikan' });
  assert.equal(path, '/api/anime?q=A%20%26%20B');
});

test('repeat requests for the same title are sent again', async () => {
  let calls = 0;
  const request = async () => { calls++; return json({ data: [] }); };
  await fetchAnime('Naruto', { request });
  await fetchAnime('Naruto', { request });
  assert.equal(calls, 2);
});

test('an empty live result stays empty rather than becoming sample results', async () => {
  assert.deepEqual(await fetchAnime('unmatched', { request: async () => json({ data: [] }) }), { anime: [], provider: 'Jikan' });
});

test('malformed API data is an error', async () => {
  await assert.rejects(fetchAnime('Naruto', { request: async () => json({ data: null }) }), /unreadable/);
});

test('HTML routing errors become a useful connection error', async () => {
  await assert.rejects(fetchAnime('Naruto', { request: async () => new Response('<html>404</html>') }), /could not connect/);
});

test('rate-limit messages are preserved', async () => {
  await assert.rejects(fetchAnime('Naruto', { request: async () => json({ error: 'Please wait and retry.' }, 429) }), /wait and retry/);
});

test('network errors become a recovery message', async () => {
  await assert.rejects(fetchAnime('Naruto', { request: async () => { throw new TypeError('Failed to fetch'); } }), /retry/);
});

test('a stalled request times out', async () => {
  await assert.rejects(fetchAnime('Naruto', { request: abortableRequest, timeoutMs: 5 }), /too long/);
});

test('a superseded request remains cancellation rather than an outage', async () => {
  const controller = new AbortController();
  const pending = fetchAnime('Naruto', { request: abortableRequest, signal: controller.signal });
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
});

test('an already cancelled search sends no request', async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(fetchAnime('Naruto', { signal: controller.signal, request: () => assert.fail('No request expected') }), { name: 'AbortError' });
});

test('proxy rejects missing and oversized queries before calling upstream', async () => {
  for (const url of ['/api/anime', '/api/anime?q=' + 'a'.repeat(101)]) {
    const res = await callHandler({ url, fetchImpl: () => assert.fail('No upstream expected') });
    assert.equal(res.status, 400);
  }
});

test('proxy rejects writes', async () => {
  const res = await callHandler({ method: 'POST', fetchImpl: () => assert.fail('No upstream expected') });
  assert.equal(res.status, 405);
  assert.equal(res.headers.Allow, 'GET');
});

test('proxy forwards search to a fixed host with a bounded result count', async () => {
  let upstream;
  const res = await callHandler({ url: '/api/anime?q=One%20Piece', fetchImpl: async url => {
    upstream = url;
    return json({ data: [{ mal_id: 21, title: 'One Piece' }] });
  } });
  assert.equal(upstream.origin, 'https://api.jikan.moe');
  assert.equal(upstream.searchParams.get('q'), 'One Piece');
  assert.equal(upstream.searchParams.get('limit'), '20');
  assert.equal(res.status, 200);
  assert.match(res.headers['Cache-Control'], /s-maxage=300/);
});

test('proxy does not cache an outage', async () => {
  const res = await callHandler({ fetchImpl: async () => json({}, 503) });
  assert.equal(res.status, 502);
  assert.equal(res.headers['Cache-Control'], 'no-store');
  assert.match(res.body.error, /temporarily unavailable/);
});

test('proxy returns a rate limit with a retry interval', async () => {
  const res = await callHandler({ fetchImpl: async () => json({}, 429) });
  assert.equal(res.status, 429);
  assert.equal(res.headers['Retry-After'], '30');
});

test('proxy handles invalid upstream JSON and missing data', async () => {
  for (const response of [new Response('<html>Error</html>'), json({})]) {
    const res = await callHandler({ fetchImpl: async () => response });
    assert.equal(res.status, 502);
  }
});

test('proxy ends a stalled upstream request', async () => {
  const res = await callHandler({ fetchImpl: abortableRequest, timeoutMs: 5 });
  assert.equal(res.status, 502);
  assert.match(res.body.error, /too long/);
});

test('samples are clearly flagged, matched locally and contain no invented live details', () => {
  const [sample] = sampleTitles('nARuTo');
  assert.equal(sample.title, 'Naruto');
  assert.equal(sample.isSample, true);
  assert.equal(sample.score, undefined);
  assert.equal(sample.episodes, undefined);
  assert.deepEqual(sampleTitles('not-a-saved-title'), []);
});

test('backup returns attributed live results when Jikan fails', async () => {
  const calls = [];
  const res = await callHandler({ fetchImpl: async (url, options) => {
    calls.push(String(url));
    if (String(url).includes('jikan')) return json({}, 503);
    assert.equal(options.method, 'POST');
    assert.equal(JSON.parse(options.body).variables.search, 'Naruto');
    return json({ data: { Page: { media: [{ id: 1735, idMal: 1735, title: { romaji: 'Naruto: Shippuuden' }, averageScore: 79, episodes: 500, genres: ['Action'] }] } } });
  } });
  assert.equal(calls.length, 2);
  assert.equal(res.status, 200);
  assert.equal(res.body.provider, 'AniList');
  assert.equal(res.body.data[0].score, 7.9);
  assert.equal(res.body.data[0].title, 'Naruto: Shippuuden');
});

test('empty primary results do not trigger a different provider', async () => {
  let calls = 0;
  const res = await callHandler({ fetchImpl: async () => { calls++; return json({ data: [] }); } });
  assert.equal(calls, 1);
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.data, []);
});
