import { useState } from 'react';
import SearchBar from './components/SearchBar.jsx';
import AnimeList from './components/AnimeList.jsx';
import Spinner from './components/Spinner.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import useAnime from './hooks/useAnime.js';

const quickSearches = [
  'Cyberpunk',
  'Jujutsu Kaisen',
  'Demon Slayer',
  'Attack on Titan',
  'One Piece',
  'Bleach',
  'Death Note',
  'Solo Leveling'
];

function App() {
  const [searchTerm, setSearchTerm] = useState('Cyberpunk');
  const { anime, loading, error } = useAnime(searchTerm);

  const hasSearched = searchTerm.trim().length > 0;
  const showNoResults = hasSearched && !loading && !error && anime.length === 0;

  return (
    <main className="app">
      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow">Neon database online</p>
          <h1>Anime Finder</h1>
          <p className="hero__text">
            Search MyAnimeList titles through the Jikan API and scan type,
            score, episodes, status, and genres in a cyber-anime card grid.
          </p>

          <SearchBar
            onSearch={setSearchTerm}
            loading={loading}
            searchTerm={searchTerm}
            suggestions={quickSearches}
          />
        </div>

        <div className="hero__art" aria-hidden="true">
          <img src="/cyber-anime.png" alt="" />
        </div>
      </section>

      <section className="results-section" aria-live="polite">
        {hasSearched && !error && (
          <div className="results-header">
            <p>Showing results for</p>
            <h2>{searchTerm}</h2>
          </div>
        )}

        {loading && <Spinner />}

        {error && <ErrorMessage message={error} />}

        {showNoResults && (
          <div className="empty-state">
            <h2>No anime found.</h2>
            <p>Try another search.</p>
          </div>
        )}

        {!loading && !error && anime.length > 0 && <AnimeList anime={anime} />}

        {!hasSearched && !loading && (
          <div className="empty-state empty-state--welcome">
            <h2>Start with a title you love.</h2>
            <p>Try Cyberpunk, Jujutsu Kaisen, One Piece, or Frieren.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
