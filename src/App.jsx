import { Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import Anime from './pages/Anime.jsx';
import Home from './pages/Home.jsx';
import Space from './pages/Space.jsx';
import Weather from './pages/Weather.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/space" element={<Space />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
