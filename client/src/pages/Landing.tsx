import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Shield,
  Zap,
  GraduationCap,
  ArrowRight,
  Briefcase,
  Sparkles,
} from "lucide-react";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-root">
      {/* NAVBAR */}
      <nav className="landing-nav">
        <div className="landing-brand">
          <div className="landing-brand-icon">
            <Sparkles size={20} />
          </div>
          TalentScreen
        </div>
        <div className="landing-nav-actions">
          <button
            className="landing-signin"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
          <button
            className="btn landing-cta"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="landing-hero">
        {/* Subtle Grid Pattern */}
        <div className="landing-hero-grid" aria-hidden="true" />

        <div className="landing-hero-inner">
          <div>
            <div className="landing-badge">
              <span className="landing-badge-dot" />
              Official AAUA Recruitment Platform
            </div>

            <h1 className="landing-heading">
              Smart Hiring for <br />
              <span className="landing-heading-gradient">Top Talent.</span>
            </h1>

            <p className="landing-subheading">
              Connecting Adekunle Ajasin University students and graduates with
              verified employers through a fair, transparent screening engine.
            </p>

            <div className="landing-hero-actions">
              <button
                className="btn landing-hero-cta"
                onClick={() => navigate("/register")}
              >
                Find a Job <ArrowRight size={20} />
              </button>
              <button
                className="btn btn-outline landing-hero-cta-secondary"
                onClick={() => navigate("/register")}
              >
                Post a Vacancy
              </button>
            </div>
          </div>

          {/* Right side floating UI mockup */}
          <div className="landing-mockup-wrap">
            <div className="landing-mockup-card">
              <div className="landing-mockup-head">
                <div className="landing-mockup-icon">
                  <Briefcase size={28} />
                </div>
                <div>
                  <h3 className="landing-mockup-title">Frontend Developer</h3>
                  <p className="landing-mockup-sub">
                    TechNova Solutions • Remote
                  </p>
                </div>
              </div>

              <div className="landing-mockup-score">
                <div className="landing-mockup-score-row">
                  <span>Match Score</span>
                  <span className="landing-mockup-score-value">85%</span>
                </div>
                <div className="landing-mockup-bar">
                  <div
                    className="landing-mockup-bar-fill"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>

              <div className="landing-mockup-tags">
                <span className="badge badge-submitted">React</span>
                <span className="badge badge-submitted">TypeScript</span>
                <span className="badge badge-submitted">CSS</span>
              </div>
            </div>

            {/* Floating Element 1 */}
            <div className="landing-float landing-float-top">
              <div className="landing-float-icon landing-float-icon-success">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="landing-float-title">Shortlisted</p>
                <p className="landing-float-sub">Just now</p>
              </div>
            </div>

            {/* Floating Element 2 */}
            <div className="landing-float landing-float-bottom">
              <div className="landing-float-icon landing-float-icon-warning">
                <Zap size={20} />
              </div>
              <div>
                <p className="landing-float-title">Screening Complete</p>
                <p className="landing-float-sub">12 applicants ranked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="landing-features">
        <div className="landing-features-head">
          <h2 className="landing-features-title">Why Choose TalentScreen?</h2>
          <p className="landing-features-sub">
            Built specifically for the AAUA community to streamline recruitment
            and internship placements.
          </p>
        </div>

        <div className="landing-features-grid">
          <div className="card landing-feature-card">
            <div className="landing-feature-icon">
              <Zap size={32} />
            </div>
            <h3 className="landing-feature-title">Automated Screening</h3>
            <p className="landing-feature-text">
              Our rule-based engine ranks applicants objectively based on
              skills, experience, and qualifications.
            </p>
          </div>

          <div className="card landing-feature-card">
            <div className="landing-feature-icon">
              <Shield size={32} />
            </div>
            <h3 className="landing-feature-title">Secure Tracking</h3>
            <p className="landing-feature-text">
              Applicants can track their application status in real-time with
              full transparency.
            </p>
          </div>

          <div className="card landing-feature-card">
            <div className="landing-feature-icon">
              <GraduationCap size={32} />
            </div>
            <h3 className="landing-feature-title">Internship Portal</h3>
            <p className="landing-feature-text">
              A dedicated portal for SIWES and graduate internships, separate
              from the main job board.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="landing-footer">
        © 2026 TalentScreen.
      </div>
    </div>
  );
}