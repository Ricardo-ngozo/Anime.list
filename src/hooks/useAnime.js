import { useEffect, useState } from 'react';

const API_BASE_URL = 'https://api.jikan.moe/v4/anime';
const TOP_ANIME_URL = 'https://api.jikan.moe/v4/top/anime';

function useAnime(searchTerm) {
  const [anime, setAnime] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSuggestions() {
      try {
        setSuggestionsLoading(true);

        const suggestionParams = new URLSearchParams({
          limit: '24',
          sfw: 'true'
        });

        const response = await fetch(`${TOP_ANIME_URL}?${suggestionParams}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error('Unable to load suggestions.');
        }

        const data = await response.json();

        if (!Array.isArray(data?.data)) {
          throw new Error('Invalid suggestion response.');
        }

        const animeTitles = data.data
          .map((animeItem) => animeItem.title_english || animeItem.title)
          .filter(Boolean);

        setSuggestions([...new Set(animeTitles)]);
      } catch (suggestionError) {
        if (suggestionError.name !== 'AbortError') {
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSuggestionsLoading(false);
        }
      }
    }

    fetchSuggestions();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const trimmedSearch = searchTerm.trim();

    const controller = new AbortController();

    async function fetchAnime() {
      try {
        setLoading(true);
        setError('');
        setAnime([]);

        const response = trimmedSearch
          ? await fetch(
              `${API_BASE_URL}?q=${encodeURIComponent(trimmedSearch)}&limit=24&sfw=true`,
              { signal: controller.signal }
            )
          : await fetch(`${TOP_ANIME_URL}?limit=24&sfw=true`, {
              signal: controller.signal
            });

        if (!response.ok) {
          throw new Error('Unable to load anime.');
        }

        const data = await response.json();

        if (!Array.isArray(data?.data)) {
          throw new Error('Something went wrong.');
        }

        setAnime(data.data);
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          return;
        }

        setAnime([]);
        setError(
          fetchError.message ||
            'Please check your internet connection and try again.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchAnime();

    return () => {
      controller.abort();
    };
  }, [searchTerm]);

  return {
    anime,
    loading,
    suggestions,
    suggestionsLoading,
    error
  };
}

export default useAnime;
