import { useState } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import AnimeList from '../components/AnimeList.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import useAnime from '../hooks/useAnime.js';

function Anime() {
  const [searchTerm, setSearchTerm] = useState('Naruto');
  const { anime, loading, suggestions, suggestionsLoading, error } =
    useAnime(searchTerm);

  const searchHasText = searchTerm.trim() !== '';
  const hasAnime = anime.length > 0;
  const showResults = !loading && !error && hasAnime;
  const showNoResults = searchHasText && !loading && !error && !hasAnime;

  const resultsTitle = searchHasText ? searchTerm : 'Popular anime';
  const resultsLabel = searchHasText ? 'Showing results for' : 'Showing';
  const titleCloud = suggestions.slice(0, 5);

  return (
    <main className="app">
      <section className="hero">
        <nav className="poster-nav" aria-label="Poster navigation">
          <span className="poster-plus">+</span>
          <span className="poster-brand">Anime</span>
          <span className="poster-ticket">Search</span>
        </nav>

        <div className="hero__content">
          <p className="eyebrow">Jikan collection</p>
          <h1>Anime Finder</h1>
          <div className="name-cloud" aria-hidden="true">
            {titleCloud.map((title) => (
              <span key={title}>{title}</span>
            ))}
          </div>
          <p className="hero__text">
            Browse titles as if they were pieces in a bold poster exhibition.
            Search by name, jump through curated picks, and inspect each anime
            card with clean gallery-style details.
          </p>

          <SearchBar
            onSearch={setSearchTerm}
            loading={loading}
            searchTerm={searchTerm}
            suggestions={suggestions}
            suggestionsLoading={suggestionsLoading}
          />
        </div>

        <img
          className="poster-portrait"
          src="/poster-portrait.png"
          alt=""
          aria-hidden="true"
        />
      </section>

      <section className="results-section" aria-live="polite">
        {showResults && (
          <div className="results-header">
            <p>{resultsLabel}</p>
            <h2>{resultsTitle}</h2>
          </div>
        )}

        {loading && <Spinner />}

        {error && <ErrorMessage message={error} />}

        {showNoResults && (
          <div className="empty-state">
            <h2>No anime found</h2>
            <p>Try another search.</p>
          </div>
        )}

        {showResults && <AnimeList anime={anime} />}

        {!searchHasText && !loading && !hasAnime && (
          <div className="empty-state empty-state--welcome">
            <h2>Start with a title you love.</h2>
            <p>Try Cyberpunk, Jujutsu Kaisen, One Piece, or Frieren.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Anime;
