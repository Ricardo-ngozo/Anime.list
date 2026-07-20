import { useEffect, useState } from 'react';

function SearchBar({ onSearch, loading, searchTerm, suggestions }) {
  const [query, setQuery] = useState(searchTerm || '');

  useEffect(() => {
    setQuery(searchTerm || '');
  }, [searchTerm]);

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    onSearch(trimmedQuery);
  }

  function handleSuggestionClick(suggestion) {
    setQuery(suggestion);
    onSearch(suggestion);
  }

  return (
    <div className="search-panel">
      <form className="search-bar" onSubmit={handleSubmit}>
        <label htmlFor="anime-search">Search anime...</label>
        <div className="search-bar__controls">
          <input
            id="anime-search"
            type="text"
            value={query}
            placeholder="Try One Piece, Bleach, Frieren..."
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" disabled={loading || !query.trim()}>
            {loading ? 'Scanning...' : 'Search'}
          </button>
        </div>
      </form>

      <div className="quick-searches" aria-label="Quick searches">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={loading}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
