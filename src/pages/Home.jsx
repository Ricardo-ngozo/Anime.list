import FeatureCard from '../components/FeatureCard.jsx';

// Edit this text to personalize your home page.
const homeText = {
  smallTitle: 'API collection',
  title: 'API Nexus',
  description:
    'A simple React project that connects my Anime List page with a live weather dashboard.',
};

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
];

function Home() {
  return (
    <main className="nexus-page">
      <section className="nexus-hero">
        <div className="nexus-hero__copy">
          <p className="nexus-kicker">{homeText.smallTitle}</p>
          <h1>{homeText.title}</h1>
          <p>{homeText.description}</p>
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
