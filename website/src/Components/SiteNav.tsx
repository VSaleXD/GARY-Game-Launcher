import { Link } from "react-router-dom";
import logo from "../Assets/Images/gary_logo.png";

export default function SiteNav() {
  return (
    <nav className="site-nav">
      <Link className="brand-button" to="/">
        <img src="/Assets/Images/gary_logo.png" alt="GARY" />
        <span>GARY</span>
      </Link>
      <div className="nav-links">
        <Link className="nav-link" to="/game-hub">Game Hub</Link>
        <Link className="nav-link" to="/materi">Materi</Link>
        <Link className="nav-link" to="/dokumentasi">Dokumentasi</Link>
      </div>
    </nav>
  );
}
