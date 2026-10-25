import { useState } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import AnimeList from '../components/AnimeList.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import useAnime from '../hooks/useAnime.js';

function Anime() {
  const [searchTerm, setSearchTerm] = useState('Naruto');
  const { anime, loading, suggestions, suggestionsLoading, error, retry, source, provider } =
    useAnime(searchTerm);

  const searchHasText = searchTerm.trim() !== '';
  const hasAnime = anime.length > 0;
  const showResults = !loading && hasAnime;
  const showNoResults = searchHasText && !loading && !error && !hasAnime;

  const resultsTitle = searchHasText ? searchTerm : 'Popular anime';
  const titleCloud = suggestions.slice(0, 5);

  function search(nextTerm) {
    if (nextTerm.trim() === searchTerm.trim()) retry();
    else setSearchTerm(nextTerm.trim());
  }

  return (
    <main className="app">
      <section className="hero">
        <nav className="poster-nav" aria-label="Poster navigation">
          <span className="poster-brand">Anime</span>

        </nav>

        <div className="hero__content">
          <p className="eyebrow">Anime discovery · live title search</p>
          <h1>The Zone Anime Finder</h1>
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
            onSearch={search}
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
        <img
          className="page-art page-art--anime"
          src="/painting-silence.png"
          alt=""
          aria-hidden="true"
        />
      </section>

      <section className="results-section" aria-live="polite" aria-busy={loading}>
        {error && <ErrorMessage message={error} onRetry={retry} />}
        {source === 'sample' && !loading && (
          <div className="sample-notice" role="status">
            <strong>Sample mode — these are not live search results.</strong>
            <p>Saved example titles keep the demo usable while live search is unavailable. Select another suggested title or retry live search.</p>
          </div>
        )}
        {showResults && (
          <div className="results-header">
            <p>{source === 'sample' ? 'Saved examples matching' : `Live results from ${provider}`}</p>
            <h2>{resultsTitle}</h2>
          </div>
        )}

        {loading && <Spinner />}

        {showNoResults && (
          <div className="empty-state">
            <h2>No anime found</h2>
            <p>Try another search.</p>
          </div>
        )}

        {showResults && <AnimeList anime={anime} />}

        {source === 'sample' && !loading && !hasAnime && (
          <div className="empty-state">
            <h2>No saved sample matches “{searchTerm}”.</h2>
            <p>Live search is unavailable. Try one of the suggested titles above to explore an example.</p>
          </div>
        )}

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
