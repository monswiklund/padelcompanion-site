import React, { useState, useEffect } from "react";

// --- Sub-components ---

const PhoneMockup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "home" | "history" | "players" | "insights"
  >("home");

  return (
    <div className="phone-mockup">
      <div className="phone-side-button"></div>
      <div className="phone-volume-buttons">
        <div className="phone-volume-up"></div>
        <div className="phone-volume-down"></div>
      </div>
      <div className="mockup-screen">
        <div className="dynamic-island"></div>
        <div className="mockup-status-bar">
          <span>9:41</span>
        </div>

        <div className="mockup-app-header">
          <span className="mockup-app-title">Padel Companion</span>
        </div>

        {/* Home Content */}
        {activeTab === "home" && (
          <div className="mockup-content" id="mockup-home">
            <h4 className="mockup-section-label">Add New Match</h4>
            <div className="mockup-card card-blue">
              <div className="mockup-card-icon">🎾</div>
              <div className="mockup-card-info">
                <span className="card-title">Match</span>
                <span className="card-subtitle">Standard match with sets</span>
              </div>
              <div className="mockup-arrow">›</div>
            </div>
            <div className="mockup-card card-orange">
              <div className="mockup-card-icon">👥</div>
              <div className="mockup-card-info">
                <span className="card-title">Mexicano</span>
                <span className="card-subtitle">Rotating partners format</span>
              </div>
              <div className="mockup-arrow">›</div>
            </div>
            <div className="mockup-card card-purple">
              <div className="mockup-card-icon">🏆</div>
              <div className="mockup-card-info">
                <span className="card-title">Winner's Court</span>
                <span className="card-subtitle">King of the hill format</span>
              </div>
              <div className="mockup-arrow">›</div>
            </div>
            <div className="mockup-row">
              <div className="mockup-mini-card">
                <span className="mini-label">Activity</span>
                <span className="mini-value">4</span>
              </div>
              <div className="mockup-mini-card">
                <span className="mini-label">Active streak</span>
                <span className="mini-value">-</span>
              </div>
            </div>
          </div>
        )}

        {/* History Content */}
        {activeTab === "history" && (
          <div className="mockup-content" id="mockup-history">
            <h4 className="mockup-section-label">21 Dec 2025</h4>
            <div className="history-card">
              <div className="history-header">
                <span className="history-time">18:56</span>
                <span className="history-tag tag-draw">DRAW</span>
              </div>
              <div className="history-score">
                12-12 <span className="history-unit">Points</span>
              </div>
              <div className="history-meta">
                <span className="history-mode">Mexicano</span>
                <span className="history-status">Synced</span>
              </div>
            </div>
            <div className="history-card history-win">
              <div className="history-header">
                <span className="history-time">17:30</span>
                <span className="history-tag tag-win">WIN</span>
              </div>
              <div className="history-score">
                2-1 <span className="history-unit">Sets</span>
              </div>
              <div className="history-meta">
                <span className="history-mode">Match</span>
                <span className="history-status">Synced</span>
              </div>
            </div>
          </div>
        )}

        {/* Players Content */}
        {activeTab === "players" && (
          <div className="mockup-content" id="mockup-players">
            <h4 className="mockup-section-label">Your Friends</h4>
            <PlayerMockupCard
              name="Marcus"
              avatar="M"
              stat="Level 5.0 · 412 Wins"
            />
            <PlayerMockupCard
              name="Anna"
              avatar="A"
              stat="Level 4.5 · 285 Wins"
            />
            <PlayerMockupCard
              name="David"
              avatar="D"
              stat="Level 4.0 · 156 Wins"
            />
          </div>
        )}

        {/* Insights Content */}
        {activeTab === "insights" && (
          <div className="mockup-content" id="mockup-insights">
            <h4 className="mockup-section-label">Stats This Month</h4>
            <div className="insight-grid">
              <div className="insight-stat-card">
                <span className="insight-val">72%</span>
                <span className="insight-lbl">Win Rate</span>
              </div>
              <div className="insight-stat-card">
                <span className="insight-val">14</span>
                <span className="insight-lbl">Matches</span>
              </div>
            </div>
            <div className="mini-chart">
              <div className="bar" style={{ height: "40%" }}></div>
              <div className="bar" style={{ height: "70%" }}></div>
              <div className="bar" style={{ height: "55%" }}></div>
              <div className="bar" style={{ height: "90%" }}></div>
              <div className="bar" style={{ height: "65%" }}></div>
            </div>
          </div>
        )}

        <div className="mockup-bottom-nav">
          <NavItem
            active={activeTab === "home"}
            icon="🏠"
            label="Home"
            onClick={() => setActiveTab("home")}
          />
          <NavItem
            active={activeTab === "history"}
            icon="📅"
            label="History"
            onClick={() => setActiveTab("history")}
          />
          <NavItem
            active={activeTab === "players"}
            icon="👥"
            label="Players"
            onClick={() => setActiveTab("players")}
          />
          <NavItem
            active={activeTab === "insights"}
            icon="📈"
            label="Insights"
            onClick={() => setActiveTab("insights")}
          />
        </div>
      </div>
    </div>
  );
};

const NavItem: React.FC<{
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}> = ({ active, icon, label, onClick }) => (
  <div className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>
    <span className="nav-icon">{icon}</span>
    <span className="nav-label">{label}</span>
  </div>
);

const PlayerMockupCard: React.FC<{
  name: string;
  avatar: string;
  stat: string;
}> = ({ name, avatar, stat }) => (
  <div className="player-mockup-card">
    <div className="player-avatar">{avatar}</div>
    <div className="player-details">
      <span className="player-name">{name}</span>
      <span className="player-stat">{stat}</span>
    </div>
  </div>
);

const WatchMockup: React.FC = () => {
  const [orangeScore, setOrangeScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);
  const [gameWinners, setGameWinners] = useState<(string | null)[]>(
    Array(5).fill(null)
  );

  const POINTS = ["0", "15", "30", "40"];

  const handleScore = (team: "orange" | "blue") => {
    if (team === "orange") {
      const nextIdx = POINTS.indexOf(orangeScore.toString()) + 1;
      if (nextIdx >= POINTS.length) {
        setOrangeScore(0);
        setBlueScore(0);
        const nextWinners = [...gameWinners];
        const emptyIdx = nextWinners.indexOf(null);
        if (emptyIdx !== -1) nextWinners[emptyIdx] = "orange";
        else {
          nextWinners.fill(null);
          nextWinners[0] = "orange";
        }
        setGameWinners(nextWinners);
      } else {
        setOrangeScore(parseInt(POINTS[nextIdx]));
      }
    } else {
      const nextIdx = POINTS.indexOf(blueScore.toString()) + 1;
      if (nextIdx >= POINTS.length) {
        setOrangeScore(0);
        setBlueScore(0);
        const nextWinners = [...gameWinners];
        const emptyIdx = nextWinners.indexOf(null);
        if (emptyIdx !== -1) nextWinners[emptyIdx] = "blue";
        else {
          nextWinners.fill(null);
          nextWinners[0] = "blue";
        }
        setGameWinners(nextWinners);
      } else {
        setBlueScore(parseInt(POINTS[nextIdx]));
      }
    }
  };

  return (
    <div className="watch-mockup">
      <div className="watch-crown"></div>
      <div className="watch-button"></div>
      <div className="watch-screen">
        <div
          className="watch-team watch-team-orange"
          onClick={() => handleScore("orange")}
        >
          <div className="watch-clock">9:41</div>
          <div className="watch-score">{orangeScore}</div>
          <div className="watch-undo">R</div>
        </div>
        <div className="watch-divider">
          <div className="watch-timer">00:42:15</div>
          <div className="watch-lights">
            {gameWinners.map((winner, idx) => (
              <span key={idx} className={`light-dot ${winner || ""}`}></span>
            ))}
          </div>
        </div>
        <div
          className="watch-team watch-team-blue"
          onClick={() => handleScore("blue")}
        >
          <div className="watch-score">{blueScore}</div>
          <div className="watch-undo">↩</div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!platform) {
      setError("Please select a platform (iOS or Android)");
      return;
    }

    setLoading(true);
    const subject = encodeURIComponent("Beta Testing Signup");
    const body = encodeURIComponent(
      `Hi Team,\n\nI'm excited to join the Padel Companion beta for ${platform}!\n\nMy email is: ${email}\n\nLooking forward to testing it out!`
    );

    window.location.href = `mailto:wiklund.labs@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setLoading(false);
      setEmail("");
      setPlatform("");
    }, 2000);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="animate-fade-in-up animate-delay-1">
                Track Scores.
                <span className="text-gradient text-glow">Win More.</span>
              </h1>
              <p className="animate-fade-in-up animate-delay-2">
                Coming soon to iOS and Android. Join our beta program to get
                early access and help shape the future of Padel Companion.
              </p>
              <div className="hero-actions-wrapper animate-fade-in-up animate-delay-3">
                <form
                  className="beta-form"
                  id="betaForm"
                  onSubmit={handleSubmit}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                  <select
                    className="beta-select"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Platform
                    </option>
                    <option value="iOS">iOS</option>
                    <option value="Android">Android</option>
                  </select>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Opening Email..." : "Join Beta"}
                  </button>
                </form>
                {error && <div className="form-error visible">{error}</div>}
                <p className="form-note">Get notified when we launch.</p>
              </div>
            </div>

            <div className="hero-image animate-fade-in-up animate-delay-4">
              <PhoneMockup />
              <WatchMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="features-header">
            <h2 className="animate-fade-in-up">
              Everything You Need <br />
              <span className="text-gradient text-glow">
                On & Off The Court
              </span>
            </h2>
            <p className="animate-fade-in-up animate-delay-1">
              Designed by padel players, for padel players. Simple yet powerful
              features to enhance your game.
            </p>
          </div>

          <div className="features-grid">
            <FeatureCard
              icon="🎯"
              title="Easy Score Tracking"
              description="Tap to score with our intuitive interface. Works great even with sweaty fingers during intense rallies."
              delay="2"
            />
            <FeatureCard
              icon="📊"
              title="Detailed Statistics"
              description="Track your progress over time. See your win rate, recent form, favorite partners, and much more."
              delay="2"
            />
            <FeatureCard
              icon="🏆"
              title="Tournament Modes"
              description="Organize Americano, Mexicano, and Team tournaments. Automatic scheduling and leaderboards."
              delay="3"
            />
            <FeatureCard
              icon="⌚"
              title="Smartwatch Support"
              description="Keep score directly from your wrist. Seamless support for both Apple Watch and Wear OS."
              delay="3"
            />
            <FeatureCard
              icon="👥"
              title="Social Features"
              description="Add friends, share matches, and see how you stack up against your padel buddies."
              delay="4"
            />
            <FeatureCard
              icon="🌐"
              title="Cloud Sync"
              description="Your data syncs automatically across all your devices. Never lose a match again."
              delay="4"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats section">
        <div className="container">
          <div className="stats-grid">
            <StatItem
              title="Free"
              description="Core features, tracking and tournaments are free forever."
            />
            <StatItem
              title="Insights"
              description="Go Premium for Head 2 Head and Advanced stats after 10 matches."
            />
            <StatItem
              title="Privacy"
              description="Privacy focused and synced across any device."
            />
            <StatItem
              title="Any Device"
              description="Mobile and Web access anywhere."
            />
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners section" id="partners">
        <div className="container">
          <div
            className="partners-grid"
            style={{
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "var(--space-md)",
            }}
          >
            <SponsorSlot />
            <SponsorSlot />
            <SponsorSlot />
          </div>
        </div>
      </section>

      {/* Cookie Banner (Internal logic or global? For now internal) */}
      <CookieBanner />
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  delay: string;
}> = ({ icon, title, description, delay }) => (
  <div className={`feature-card animate-fade-in-up animate-delay-${delay}`}>
    <div className="feature-icon">
      <span>{icon}</span>
    </div>
    <div className="feature-content">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </div>
);

const StatItem: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="stat-item">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const SponsorSlot: React.FC = () => (
  <a
    href="mailto:wiklund.labs@gmail.com"
    className="partner-logo-placeholder"
    style={{ height: "100px" }}
  >
    <span>Your Logo Here</span>
  </a>
);

const CookieBanner: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("padelcompanion-cookies")) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("padelcompanion-cookies", "accepted");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie-banner show">
      <div className="cookie-content">
        <h4>🍪 Cookies & Privacy</h4>
        <p>
          We use local storage to save your preferences. We use privacy-friendly
          analytics that do not track you.
        </p>
        <div className="cookie-actions">
          <button className="btn btn-primary" onClick={handleAccept}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
