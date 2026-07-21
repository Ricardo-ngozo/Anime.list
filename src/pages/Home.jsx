import FeatureCard from '../components/FeatureCard.jsx';

// Edit this text to personalize your home page.
const homeText = {
  smallTitle: 'First API project (wish me luck)',
  title: 'The Zone',
  description:
    'Connects Anime list and Live weather forecast. Actually whats the weather in Shibuya japan.',
};

const features = [
  {
    title: 'Anime Vault',
    description:
      'Search titles, scan cards and explore your anime universe .',
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
        <img
          className="page-art page-art--home-left"
          src="/painting-tragedy.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="page-art page-art--home-right"
          src="/painting-girl-pearl.png"
          alt=""
          aria-hidden="true"
        />
        <div className="nexus-hero__copy">
          <p className="nexus-kicker">{homeText.smallTitle}</p>
          <h1>{homeText.title}</h1>
          <p>{homeText.description}</p>
        </div>
      </section>

      <section className="feature-grid" aria-label="The Zone features">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </section>
    </main>
  );
}

export default Home;
