import { Link } from 'react-router-dom';

function FeatureCard({ title, description, buttonLabel, to }) {
  return (
    <article className="feature-card">
      <div className="feature-card__scanline" aria-hidden="true"></div>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link className="nexus-button" to={to}>
        {buttonLabel}
      </Link>
    </article>
  );
}

export default FeatureCard;
