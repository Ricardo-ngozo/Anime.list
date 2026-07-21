import FeatureCard from '../components/FeatureCard.jsx';

const features = [
  {
    title: 'Anime Vault',
    description:
      'Search titles, scan gallery-style cards, and keep exploring your anime universe.',
    buttonLabel: 'Explore Anime',
    to: '/anime',
  },
  {
    title: 'Weather Dashboard',
    description:
      'Pull live city forecasts with temperature, wind, humidity, sunrise, and sunset data.',
    buttonLabel: 'View Weather',
    to: '/weather',
  },
  {
    title: 'Space Explorer',
    description:
      'Open a window to NASA imagery, daily astronomy features, and Mars rover captures.',
    buttonLabel: 'Explore Space',
    to: '/space',
  },
];

function Home() {
  return (
    <main className="nexus-page">
      <section className="nexus-hero">
        <div className="nexus-hero__copy">
          <p className="nexus-kicker">Multi-API command center</p>
          <h1>API Nexus</h1>
          <p>
            A cyberpunk React hub that connects your existing Anime List with
            live weather intelligence and NASA space data.
          </p>
        </div>
      </section>

      <section className="feature-grid" aria-label="API Nexus features">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </section>
    </main>
  );
}

export default Home;
