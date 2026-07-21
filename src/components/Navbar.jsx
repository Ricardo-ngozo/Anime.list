import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/anime', label: 'Anime' },
  { to: '/weather', label: 'Weather' },
];

function Navbar() {
  return (
    <header className="nexus-nav">
      <NavLink className="nexus-nav__brand" to="/">
        API Nexus
      </NavLink>
      <nav className="nexus-nav__links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) =>
              isActive ? 'nexus-nav__link nexus-nav__link--active' : 'nexus-nav__link'
            }
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
