import React, { useState, useEffect } from "react";

// --- Sub-components ---

const PhoneMockup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "home" | "history" | "players" | "insights"
  >("home");

  return (
    <div className="relative w-[180px] h-[360px] md:w-[300px] md:h-[600px] bg-black rounded-[28px] md:rounded-[40px] border-[3px] md:border-4 border-[#3a3a3a] shadow-[0_0_0_2px_#111,0_10px_40px_rgba(0,0,0,0.5),0_0_80px_rgba(59,130,246,0.3)] flex flex-col z-10 animate-float">
      {/* Side Buttons */}
      <div className="absolute -right-[6px] top-[100px] w-[3px] h-[60px] bg-[#2a2a2a] rounded-r-[2px] -z-10"></div>
      <div className="absolute -left-[6px] top-[90px] -z-10">
        <div className="w-[3px] h-[40px] bg-[#2a2a2a] rounded-l-[2px] mb-[10px]"></div>
        <div className="w-[3px] h-[40px] bg-[#2a2a2a] rounded-l-[2px]"></div>
      </div>

      <div className="w-full h-full bg-black flex flex-col relative rounded-[24px] md:rounded-[36px] overflow-hidden">
        {/* Dynamic Island */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[80px] h-[22px] bg-black rounded-[20px] z-[100]"></div>

        {/* Status Bar */}
        <div className="pt-[14px] px-6 flex justify-between text-[11px] font-bold text-white z-10">
          <span>9:41</span>
        </div>

        {/* App Header */}
        <div className="p-5 pb-2.5 flex justify-between items-end">
          <span className="text-xl font-extrabold text-white leading-[1.1] max-w-[65%]">
            Padel Companion
          </span>
        </div>

        {/* Home Content */}
        {activeTab === "home" && (
          <div className="flex-1 px-4 overflow-hidden flex flex-col gap-3">
            <h4 className="text-[0.9rem] font-bold text-white mb-1">
              Add New Match
            </h4>
            <div className="bg-gradient-to-br from-[#007aff] to-[#0056b3] rounded-[18px] p-3.5 flex items-center gap-3 text-white relative overflow-hidden transition-transform hover:scale-[1.02] min-h-[72px]">
              <div className="text-[1.6rem] w-8 text-center">🎾</div>
              <div className="flex-1 flex flex-col justify-center overflow-hidden">
                <span className="text-base font-bold leading-[1.2] whitespace-nowrap">
                  Match
                </span>
                <span className="text-[0.7rem] opacity-90 whitespace-nowrap overflow-hidden text-ellipsis">
                  Standard match with sets
                </span>
              </div>
              <div className="text-xl opacity-60">›</div>
            </div>
            <div className="bg-gradient-to-br from-[#ff9500] to-[#e08200] rounded-[18px] p-3.5 flex items-center gap-3 text-white relative overflow-hidden transition-transform hover:scale-[1.02] min-h-[72px]">
              <div className="text-[1.6rem] w-8 text-center">👥</div>
              <div className="flex-1 flex flex-col justify-center overflow-hidden">
                <span className="text-base font-bold leading-[1.2] whitespace-nowrap">
                  Mexicano
                </span>
                <span className="text-[0.7rem] opacity-90 whitespace-nowrap overflow-hidden text-ellipsis">
                  Rotating partners format
                </span>
              </div>
              <div className="text-xl opacity-60">›</div>
            </div>
            <div className="bg-gradient-to-br from-[#af52de] to-[#8e2db2] rounded-[18px] p-3.5 flex items-center gap-3 text-white relative overflow-hidden transition-transform hover:scale-[1.02] min-h-[72px]">
              <div className="text-[1.6rem] w-8 text-center">🏆</div>
              <div className="flex-1 flex flex-col justify-center overflow-hidden">
                <span className="text-base font-bold leading-[1.2] whitespace-nowrap">
                  Winner's Court
                </span>
                <span className="text-[0.7rem] opacity-90 whitespace-nowrap overflow-hidden text-ellipsis">
                  King of the hill format
                </span>
              </div>
              <div className="text-xl opacity-60">›</div>
            </div>
            <div className="flex gap-2.5 mt-1">
              <div className="flex-1 bg-[#1c1c1e] rounded-[14px] p-2.5 flex flex-col gap-0.5">
                <span className="text-[0.65rem] text-[#8e8e93] uppercase tracking-wider">
                  Activity
                </span>
                <span className="text-[1.4rem] font-bold text-white leading-none">
                  4
                </span>
              </div>
              <div className="flex-1 bg-[#1c1c1e] rounded-[14px] p-2.5 flex flex-col gap-0.5">
                <span className="text-[0.65rem] text-[#8e8e93] uppercase tracking-wider">
                  Active streak
                </span>
                <span className="text-[1.4rem] font-bold text-white leading-none">
                  -
                </span>
              </div>
            </div>
          </div>
        )}

        {/* History Content */}
        {activeTab === "history" && (
          <div className="flex-1 px-4 overflow-hidden flex flex-col gap-3">
            <h4 className="text-[0.9rem] font-bold text-white mb-1">
              21 Dec 2025
            </h4>
            <div className="bg-[#1c1c1e] rounded-2xl p-4 flex flex-col gap-2 border border-white/5 border-l-4 border-l-white/5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#8e8e93]">18:56</span>
                <span className="text-[0.7rem] font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-500">
                  DRAW
                </span>
              </div>
              <div className="text-2xl font-bold text-white flex items-baseline gap-1.5">
                12-12{" "}
                <span className="text-[0.9rem] text-[#8e8e93] font-normal">
                  Points
                </span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="bg-white/10 px-2 py-0.5 rounded-[10px] text-white">
                  Mexicano
                </span>
                <span className="flex items-center gap-1 bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-[12px] font-semibold before:content-['☁️'] before:text-[0.7rem]">
                  Synced
                </span>
              </div>
            </div>
            <div className="bg-[#1c1c1e] rounded-2xl p-4 flex flex-col gap-2 border border-white/5 border-l-4 border-l-emerald-500">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#8e8e93]">17:30</span>
                <span className="text-[0.7rem] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500">
                  WIN
                </span>
              </div>
              <div className="text-2xl font-bold text-white flex items-baseline gap-1.5">
                2-1{" "}
                <span className="text-[0.9rem] text-[#8e8e93] font-normal">
                  Sets
                </span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="bg-white/10 px-2 py-0.5 rounded-[10px] text-white">
                  Match
                </span>
                <span className="flex items-center gap-1 bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-[12px] font-semibold before:content-['☁️'] before:text-[0.7rem]">
                  Synced
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Players Content */}
        {activeTab === "players" && (
          <div className="flex-1 px-4 overflow-hidden flex flex-col gap-3">
            <h4 className="text-[0.9rem] font-bold text-white mb-1">
              Your Friends
            </h4>
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
          <div className="flex-1 px-4 overflow-hidden flex flex-col gap-3">
            <h4 className="text-[0.9rem] font-bold text-white mb-1">
              Stats This Month
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#1c1c1e] rounded-[14px] p-3 text-center border border-white/5">
                <span className="block text-xl font-extrabold text-accent-light">
                  72%
                </span>
                <span className="text-[0.65rem] text-[#8e8e93] uppercase tracking-wider">
                  Win Rate
                </span>
              </div>
              <div className="bg-[#1c1c1e] rounded-[14px] p-3 text-center border border-white/5">
                <span className="block text-xl font-extrabold text-accent-light">
                  14
                </span>
                <span className="text-[0.65rem] text-[#8e8e93] uppercase tracking-wider">
                  Matches
                </span>
              </div>
            </div>
            <div className="h-20 flex items-end justify-between gap-1.5 p-2.5 bg-white/[0.03] rounded-[14px] mt-1">
              <div
                className="flex-1 bg-gradient-primary rounded-t min-h-[10%] transition-[height] duration-500"
                style={{ height: "40%" }}
              ></div>
              <div
                className="flex-1 bg-gradient-primary rounded-t min-h-[10%] transition-[height] duration-500"
                style={{ height: "70%" }}
              ></div>
              <div
                className="flex-1 bg-gradient-primary rounded-t min-h-[10%] transition-[height] duration-500"
                style={{ height: "55%" }}
              ></div>
              <div
                className="flex-1 bg-gradient-primary rounded-t min-h-[10%] transition-[height] duration-500"
                style={{ height: "90%" }}
              ></div>
              <div
                className="flex-1 bg-gradient-primary rounded-t min-h-[10%] transition-[height] duration-500"
                style={{ height: "65%" }}
              ></div>
            </div>
          </div>
        )}

        {/* Bottom Nav */}
        <div className="h-[60px] bg-[#1c1c1e]/95 backdrop-blur-xl flex justify-around items-center border-t border-white/10 pb-1 z-10">
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
  <div
    className={`nav-item flex flex-col items-center justify-center w-full h-full cursor-pointer transition-all duration-200 ${
      active
        ? "opacity-100 text-[#007aff]"
        : "opacity-50 text-[#8e8e93] hover:opacity-80"
    }`}
    onClick={onClick}
  >
    <span className="text-[1.1rem] mb-0.5">{icon}</span>
    <span className="text-[0.6rem] font-medium">{label}</span>
  </div>
);

const PlayerMockupCard: React.FC<{
  name: string;
  avatar: string;
  stat: string;
}> = ({ name, avatar, stat }) => (
  <div className="bg-[#1c1c1e] rounded-[14px] p-2.5 px-3.5 flex items-center gap-3 border border-white/5 mb-2">
    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-[0.8rem] font-bold text-white">
      {avatar}
    </div>
    <div className="flex flex-col">
      <span className="text-[0.9rem] font-semibold text-white">{name}</span>
      <span className="text-[0.7rem] text-[#8e8e93]">{stat}</span>
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
    <div className="hidden md:flex w-[180px] h-[220px] lg:w-[230px] lg:h-[280px] bg-[#1a1a1a] rounded-[44px] lg:rounded-[56px] border-[3px] lg:border-4 border-[#3a3a3a] shadow-[0_0_0_2px_#111,0_10px_40px_rgba(0,0,0,0.5),0_0_40px_rgba(59,130,246,0.2)] flex-col self-center relative z-10 animate-float animation-delay-500">
      {/* Crown */}
      <div className="absolute -right-[10px] lg:-right-[12px] top-[45px] lg:top-[58px] w-[11px] lg:w-[14px] h-[35px] lg:h-[44px] bg-gradient-to-r from-[#2a2a2a] via-[#444] to-[#2a2a2a] rounded-[4px_6px_6px_4px] lg:rounded-[5px_7px_7px_5px] border border-[#111] shadow-sm -z-10 bg-[repeating-linear-gradient(to_bottom,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)]"></div>

      {/* Button */}
      <div className="absolute -right-[7px] lg:-right-[9px] top-[95px] lg:top-[120px] w-[7px] lg:w-[10px] h-[50px] lg:h-[64px] bg-[#2a2a2a] rounded-[2px_4px_4px_2px] lg:rounded-[3px_5px_5px_3px] border border-[#111] shadow-sm -z-10"></div>

      {/* Screen */}
      <div className="flex-1 flex flex-col overflow-hidden rounded-[38px] lg:rounded-[48px] m-[4px] lg:m-[5px] bg-black relative">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-10"></div>

        <div
          className="flex-1 flex items-center justify-center relative p-2 cursor-pointer transition-all active:brightness-90 bg-gradient-to-br from-[#e85d04] to-[#dc2f02]"
          onClick={() => handleScore("orange")}
        >
          <div className="absolute top-1 right-2 text-[0.7rem] font-semibold text-white/80">
            9:41
          </div>
          <div className="text-[2.2rem] lg:text-[2.5rem] font-extrabold text-white drop-shadow-md">
            {orangeScore}
          </div>
          <div className="absolute left-2.5 w-7 h-7 bg-black/40 rounded-full flex items-center justify-center text-[0.8rem] font-bold text-white">
            R
          </div>
        </div>

        <div className="flex justify-between items-center px-2.5 py-1 bg-gradient-to-r from-[#e85d04] to-[#0077b6] z-[5]">
          <div className="text-[0.65rem] font-semibold text-white bg-white/20 px-1.5 py-0.5 rounded-lg">
            00:42:15
          </div>
          <div className="flex items-center gap-[3px]">
            {gameWinners.map((winner, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  winner === "orange"
                    ? "bg-[#e85d04]"
                    : winner === "blue"
                    ? "bg-[#0096c7]"
                    : "bg-white/30"
                }`}
              ></span>
            ))}
          </div>
        </div>

        <div
          className="flex-1 flex items-center justify-center relative p-2 cursor-pointer transition-all active:brightness-90 bg-gradient-to-br from-[#0077b6] to-[#0096c7]"
          onClick={() => handleScore("blue")}
        >
          <div className="text-[2.2rem] lg:text-[2.5rem] font-extrabold text-white drop-shadow-md">
            {blueScore}
          </div>
          <div className="absolute left-2.5 w-7 h-7 bg-black/40 rounded-full flex items-center justify-center text-[0.8rem] font-bold text-white">
            ↩
          </div>
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
    <div className="min-h-screen bg-bg-primary overflow-x-hidden">
      {/* Hero Section */}
      <section
        className="min-h-screen flex items-center bg-hero-gradient relative overflow-hidden px-4"
        id="hero"
      >
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,var(--color-accent-glow)_0%,transparent_70%)] opacity-30 pointer-events-none"></div>

        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center relative z-10 text-center md:text-left">
            <div className="max-w-xl mx-auto md:mx-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
                Track Scores.
                <span className="bg-gradient-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] block md:inline md:ml-2">
                  Win More.
                </span>
              </h1>
              <p className="text-xl text-text-secondary mb-12 animate-fade-in-up animation-delay-200">
                Coming soon to iOS and Android. Join our beta program to get
                early access and help shape the future of Padel Companion.
              </p>

              <div className="animate-fade-in-up animation-delay-300">
                <form
                  className="flex flex-col md:flex-row items-stretch md:items-center gap-2 bg-bg-secondary p-1.5 rounded-2xl border border-border-color shadow-lg hover:border-accent hover:-translate-y-0.5 transition-all duration-300 w-full md:w-[520px] mx-auto md:mx-0"
                  id="betaForm"
                  onSubmit={handleSubmit}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-[2] min-w-[160px] bg-transparent border-b md:border-none border-border-color px-4 py-3 md:py-0 text-text-primary text-[0.95rem] outline-none h-12 placeholder:text-text-muted text-center md:text-left"
                  />
                  <select
                    className="flex-none bg-transparent border-b md:border-l md:border-b-0 border-border-color text-text-secondary text-[0.9rem] px-4 md:pl-4 md:pr-7 outline-none cursor-pointer h-12 w-full md:w-auto text-center appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-no-repeat bg-[right_16px_center]"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    required
                  >
                    <option value="" disabled className="bg-bg-secondary">
                      Platform
                    </option>
                    <option value="iOS" className="bg-bg-secondary">
                      iOS
                    </option>
                    <option value="Android" className="bg-bg-secondary">
                      Android
                    </option>
                  </select>
                  <button
                    type="submit"
                    className="flex-shrink-0 bg-accent hover:bg-accent-light text-white px-6 h-12 rounded-xl text-[0.95rem] font-medium transition-colors w-full md:w-auto"
                    disabled={loading}
                  >
                    {loading ? "Opening Email..." : "Join Beta"}
                  </button>
                </form>
                {error && (
                  <div className="text-sm text-error bg-error/10 border border-error/30 rounded-md px-4 py-2 mt-2 text-center animate-fade-in">
                    {error}
                  </div>
                )}
                <p className="text-sm text-text-muted opacity-80 mt-4 ml-4 text-center md:text-left">
                  Get notified when we launch.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-8 relative animate-fade-in-up animation-delay-400 mt-12 md:mt-0">
              <PhoneMockup />
              <div className="hidden md:block">
                <WatchMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24" id="features">
        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              Everything You Need <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                On & Off The Court
              </span>
            </h2>
            <p className="text-text-secondary text-lg animate-fade-in-up animation-delay-100">
              Designed by padel players, for padel players. Simple yet powerful
              features to enhance your game.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🎯"
              title="Easy Score Tracking"
              description="Tap to score with our intuitive interface. Works great even with sweaty fingers during intense rallies."
              delay="200"
            />
            <FeatureCard
              icon="📊"
              title="Detailed Statistics"
              description="Track your progress over time. See your win rate, recent form, favorite partners, and much more."
              delay="200"
            />
            <FeatureCard
              icon="🏆"
              title="Tournament Modes"
              description="Organize Americano, Mexicano, and Team tournaments. Automatic scheduling and leaderboards."
              delay="300"
            />
            <FeatureCard
              icon="⌚"
              title="Smartwatch Support"
              description="Keep score directly from your wrist. Seamless support for both Apple Watch and Wear OS."
              delay="300"
            />
            <FeatureCard
              icon="👥"
              title="Social Features"
              description="Add friends, share matches, and see how you stack up against your padel buddies."
              delay="400"
            />
            <FeatureCard
              icon="🌐"
              title="Cloud Sync"
              description="Your data syncs automatically across all your devices. Never lose a match again."
              delay="400"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center bg-bg-secondary border border-border-color rounded-3xl p-8 shadow-lg transition-all hover:border-accent hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
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
      <section className="py-24" id="partners">
        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
  <div
    className={`bg-bg-secondary border border-border-color rounded-3xl p-8 shadow-lg transition-all hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] animate-fade-in-up animation-delay-${delay}`}
  >
    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-2xl mb-6">
      <span>{icon}</span>
    </div>
    <div className="feature-content">
      <h4 className="text-xl font-bold text-text-primary mb-2">{title}</h4>
      <p className="text-text-secondary leading-relaxed text-sm md:text-base">
        {description}
      </p>
    </div>
  </div>
);

const StatItem: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="flex flex-col items-center">
    <h3 className="text-2xl font-bold text-accent-light mb-1">{title}</h3>
    <p className="text-sm text-text-muted">{description}</p>
  </div>
);

const SponsorSlot: React.FC = () => (
  <a
    href="mailto:wiklund.labs@gmail.com"
    className="h-[100px] bg-bg-secondary/50 border border-dashed border-border-color rounded-2xl flex items-center justify-center text-text-muted/50 text-sm hover:text-text-primary hover:border-text-muted/50 transition-colors"
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
    <div className="fixed bottom-4 left-4 right-4 md:bottom-8 md:right-8 md:left-auto md:w-[400px] bg-bg-card border border-border-color rounded-2xl shadow-[0_0_60px_rgba(59,130,246,0.4)] z-[900] animate-fade-in-up">
      <div className="p-6">
        <h4 className="text-lg font-bold mb-2">🍪 Cookies & Privacy</h4>
        <p className="text-text-secondary text-sm mb-4">
          We use local storage to save your preferences. We use privacy-friendly
          analytics that do not track you.
        </p>
        <div className="flex justify-end">
          <button
            className="bg-accent hover:bg-accent-light text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={handleAccept}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
