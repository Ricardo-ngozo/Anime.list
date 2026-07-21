import ErrorMessage from '../components/ErrorMessage.jsx';
import Loader from '../components/Loader.jsx';
import useNASA from '../hooks/useNASA.js';

function Space() {
  const { apod, marsPhotos, loading, error } = useNASA();
  const isImage = apod?.media_type === 'image';

  return (
    <main className="nexus-page data-page">
      <section className="data-header">
        <p className="nexus-kicker">NASA open data stream</p>
        <h1>Space Explorer</h1>
      </section>

      {loading && <Loader label="Receiving NASA signal..." />}
      {error && <ErrorMessage title="Unable to load space data." message={error} />}

      {apod && !loading && !error && (
        <>
          <section className="space-apod">
            <div className="space-apod__media">
              {isImage ? (
                <img src={apod.url} alt={apod.title} />
              ) : (
                <iframe src={apod.url} title={apod.title} allowFullScreen></iframe>
              )}
            </div>
            <article className="space-apod__content">
              <span>{apod.date}</span>
              <h2>{apod.title}</h2>
              <p>{apod.explanation}</p>
            </article>
          </section>

          {marsPhotos.length > 0 && (
            <section className="mars-section">
              <div className="section-heading">
                <p className="nexus-kicker">Curiosity rover</p>
                <h2>Recent Mars Rover Images</h2>
              </div>
              <div className="mars-grid">
                {marsPhotos.map((photo) => (
                  <article className="mars-card" key={photo.id}>
                    <img src={photo.img_src} alt={`${photo.rover.name} rover capture`} />
                    <div>
                      <strong>{photo.camera.full_name}</strong>
                      <span>{photo.earth_date}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default Space;
