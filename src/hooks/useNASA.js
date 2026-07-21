import { useEffect, useState } from 'react';

const NASA_API_KEY = 'DEMO_KEY';

function useNASA() {
  const [apod, setApod] = useState(null);
  const [marsPhotos, setMarsPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchNASAData() {
      try {
        setLoading(true);
        setError('');

        const apodUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
        const marsUrl =
          `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=1&api_key=${NASA_API_KEY}`;

        const [apodResponse, marsResponse] = await Promise.all([
          fetch(apodUrl, { signal: controller.signal }),
          fetch(marsUrl, { signal: controller.signal }),
        ]);

        if (!apodResponse.ok) {
          throw new Error('Unable to load NASA picture of the day.');
        }

        const apodData = await apodResponse.json();
        setApod(apodData);

        if (marsResponse.ok) {
          const marsData = await marsResponse.json();
          setMarsPhotos((marsData.photos ?? []).slice(0, 6));
        } else {
          setMarsPhotos([]);
        }
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'NASA data is unavailable.');
          setApod(null);
          setMarsPhotos([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchNASAData();

    return () => controller.abort();
  }, []);

  return { apod, marsPhotos, loading, error };
}

export default useNASA;
