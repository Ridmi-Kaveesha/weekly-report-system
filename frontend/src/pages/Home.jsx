import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="landing-page">
      <div className="landing-bg-layer"></div>
      <div className="landing-nav">
        <div className="landing-logo">Weekly Report Generator</div>
        <div className="landing-nav-buttons">
          <Link to="/login" className="btn-outline">
            Login
          </Link>
          <Link to="/register" className="btn-filled">
            Register
          </Link>
        </div>
      </div>

      <div className="landing-hero">
        <h1>Weekly Report Generator</h1>
        <p>
          Effortlessly submit your structured weekly reports and give managers
          a bird's-eye view of the entire team's progress.
        </p>
        <div className="landing-hero-buttons">
          <Link to="/register" className="btn-filled btn-large">
            Get Started
          </Link>
          <Link to="/login" className="btn-outline btn-large">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
