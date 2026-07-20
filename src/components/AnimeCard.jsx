function AnimeCard({ anime }) {
  const imageUrl = anime.images?.jpg?.image_url;
  const title = anime.title || anime.title_english || 'Untitled anime';
  const type = anime.type || 'Unknown type';
  const status = anime.status || 'Unknown status';
  const episodes = anime.episodes ?? 'Unknown';
  const score = anime.score ?? 'N/A';
  const rating = anime.rating || 'Not rated';
  const genres = anime.genres?.length ? anime.genres : [];

  return (
    <article className="anime-card">
      <div className="anime-card__image-wrap">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="anime-card__image" />
        ) : (
          <div className="anime-card__placeholder">No image</div>
        )}
      </div>

      <div className="anime-card__content">
        <h2>{title}</h2>

        <dl className="anime-card__details">
          <div>
            <dt>Type</dt>
            <dd>{type}</dd>
          </div>
          <div>
            <dt>Score</dt>
            <dd>{score}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{status}</dd>
          </div>
          <div>
            <dt>Episodes</dt>
            <dd>{episodes}</dd>
          </div>
        </dl>

        <p className="anime-card__rating">{rating}</p>

        <div className="anime-card__genres" aria-label="Genres">
          {genres.length > 0 ? (
            genres.slice(0, 4).map((genre) => (
              <span key={genre.mal_id || genre.name}>{genre.name}</span>
            ))
          ) : (
            <span>No genres listed</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default AnimeCard;
