import { useEffect, useState } from 'react';

function SearchBar({
  onSearch,
  loading,
  searchTerm,
  suggestions,
  suggestionsLoading
}) {
  const [query, setQuery] = useState(searchTerm || '');

  useEffect(() => {
    setQuery(searchTerm || '');
  }, [searchTerm]);

  function handleSubmit(event) {
    event.preventDefault();

    const searchText = query.trim();

    if (!searchText) {
      return;
    }

    onSearch(searchText);
  }

  function handleSuggestionClick(suggestion) {
    setQuery(suggestion);
    onSearch(suggestion);
  }

  return (
    <div className="search-panel">
      <div className="search-panel__header">
        <span>Catalog lookup</span>
        <span>Tickets / API</span>
      </div>
      <form className="search-bar" onSubmit={handleSubmit}>
        <label htmlFor="anime-search">Search anime titles</label>
        <div className="search-bar__controls">
          <input
            id="anime-search"
            type="text"
            value={query}
            placeholder="Type an anime name..."
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" disabled={loading || !query.trim()}>
            {loading ? 'Loading' : 'Find'}
          </button>
        </div>
      </form>

      <p className="quick-searches__label">
        {suggestionsLoading
          ? 'Loading anime suggestions'
          : `Select an anime (${suggestions.length})`}
      </p>
      <div className="quick-searches" aria-label="Quick searches">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={loading}
            >
              {suggestion}
            </button>
          ))
        ) : (
          <span className="quick-searches__empty">
            Suggestions will appear here from the Jikan API.
          </span>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
