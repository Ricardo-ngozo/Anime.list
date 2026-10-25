export async function fetchAnime(query, {
  signal,
  request = globalThis.fetch,
  timeoutMs = 11000,
} = {}) {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  if (signal?.aborted) throw new DOMException('Search cancelled', 'AbortError');
  signal?.addEventListener('abort', cancel, { once: true });
  const timer = setTimeout(cancel, timeoutMs);
  try {
    const response = await request(`/api/anime?q=${encodeURIComponent(query.trim())}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error || 'Live search is temporarily unavailable.');
    if (!Array.isArray(payload?.data)) throw new Error('Live search returned an unreadable response.');
    return { anime: payload.data, provider: payload.provider || 'Jikan' };
  } catch (error) {
    if (signal?.aborted) throw new DOMException('Search cancelled', 'AbortError');
    if (controller.signal.aborted) throw new Error('Live search took too long. Please retry.');
    if (error instanceof TypeError || error instanceof SyntaxError) {
      throw new Error('Live search could not connect. Please retry, or explore the sample titles below.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
  }
}
