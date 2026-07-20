import { useEffect, useState } from 'react';

const API_BASE_URL = 'https://api.jikan.moe/v4/anime';

function useAnime(searchTerm) {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) {
      setAnime([]);
      setLoading(false);
      setError('');
      return;
    }

    const controller = new AbortController();

    async function fetchAnime() {
      try {
        setLoading(true);
        setError('');

        const searchParams = new URLSearchParams({
          q: trimmedSearch,
          limit: '24',
          sfw: 'true'
        });

        const response = await fetch(`${API_BASE_URL}?${searchParams}`, {
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
    error
  };
}

export default useAnime;
