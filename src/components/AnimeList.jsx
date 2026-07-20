import AnimeCard from './AnimeCard.jsx';

function AnimeList({ anime }) {
  return (
    <div className="anime-grid">
      {anime.map((animeItem) => (
        <AnimeCard key={animeItem.mal_id} anime={animeItem} />
      ))}
    </div>
  );
}

export default AnimeList;
