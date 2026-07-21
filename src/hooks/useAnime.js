import { useEffect, useState } from 'react';

const defaultSuggestions = [
  'Naruto',
  'One Piece',
  'Bleach',
  'Death Note',
  'Dragon Ball',
  'Chainsaw Man',
  'Tokyo Ghoul',
  'Fullmetal Alchemist',
  'Vinland Saga',
];

function useAnime(searchTerm) {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load anime cards whenever the user submits a new search.
  useEffect(() => {
    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) {
      setAnime([]);
      setLoading(false);
      setError('');
      return;
    }

    async function fetchAnime() {
      try {
        setLoading(true);
        setError('');
        setAnime([]);

        const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
          trimmedSearch
        )}&limit=20`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Unable to load anime.');
        }

        const data = await response.json();

        if (!Array.isArray(data?.data)) {
          throw new Error('Something went wrong.');
        }

        setAnime(data.data);
      } catch (error) {
        setAnime([]);
        setError(
          error.message || 'Please check your internet connection and try again.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAnime();
  }, [searchTerm]);

  return {
    anime,
    loading,
    suggestions: defaultSuggestions,
    suggestionsLoading: false,
    error
  };
}

export default useAnime;
