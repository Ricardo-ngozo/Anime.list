import { useCallback, useEffect, useState } from 'react';
import { fetchAnime } from '../lib/animeSearch.js';
import { sampleTitles, suggestedTitles } from '../data/animeSamples.js';

function useAnime(searchTerm) {
  const [state, setState] = useState({ anime: [], loading: true, error: '', source: 'live' });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt(value => value + 1), []);

  useEffect(() => {
    const query = searchTerm.trim();
    const controller = new AbortController();
    if (!query) {
      setState({ anime: [], loading: false, error: '', source: 'live' });
      return () => controller.abort();
    }
    setState({ anime: [], loading: true, error: '', source: 'live' });
    fetchAnime(query, { signal: controller.signal })
      .then(({ anime, provider }) => {
        if (!controller.signal.aborted) setState({ anime, provider, loading: false, error: '', source: 'live' });
      })
      .catch(error => {
        // An old search must not overwrite a new query or update after navigation.
        if (!controller.signal.aborted) {
          setState({ anime: sampleTitles(query), loading: false, error: error.message, source: 'sample' });
        }
      });
    return () => controller.abort();
  }, [searchTerm, attempt]);

  return { ...state, retry, suggestions: suggestedTitles, suggestionsLoading: false };
}

export default useAnime;
