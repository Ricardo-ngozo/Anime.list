import { useEffect, useState } from 'react';

const API_BASE_URL = 'https://api.jikan.moe/v4/anime';
const TOP_ANIME_URL = 'https://api.jikan.moe/v4/top/anime';
const RESULT_LIMIT = 24;

function getAnimeTitles(animeList) {
  const titles = animeList
    .map((anime) => anime.title_english || anime.title)
    .filter(Boolean);

  return [...new Set(titles)];
}

function useAnime(searchTerm) {
  const [anime, setAnime] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [error, setError] = useState('');

  // Load anime cards whenever the user submits a new search.
  useEffect(() => {
    const trimmedSearch = searchTerm.trim();
    const controller = new AbortController();

    async function fetchAnime() {
      try {
        setLoading(true);
        setError('');
        setAnime([]);

        let url = `${TOP_ANIME_URL}?limit=${RESULT_LIMIT}&sfw=true`;
        setSuggestionsLoading(!trimmedSearch && suggestions.length === 0);

        if (trimmedSearch) {
          url = `${API_BASE_URL}?q=${encodeURIComponent(
            trimmedSearch
          )}&limit=${RESULT_LIMIT}&sfw=true`;
        }

        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Jikan is busy. Please wait a few seconds and search again.');
          }

          throw new Error('Unable to load anime.');
        }

        const data = await response.json();

        if (!Array.isArray(data?.data)) {
          throw new Error('Something went wrong.');
        }

        setAnime(data.data);

        if (!trimmedSearch) {
          setSuggestions(getAnimeTitles(data.data));
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }

        setAnime([]);
        setError(
          error.message || 'Please check your internet connection and try again.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setSuggestionsLoading(false);
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
