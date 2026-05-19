import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { PhoneMockup } from "@/components/landing/PhoneMockup";
import { WatchMockup } from "@/components/landing/WatchMockup";
import { GlassCard } from "@/components/ui/GlassCard";
import { SponsorSlot } from "@/components/landing/LandingSections";
import { cn } from "@/shared/utils";
import { 
  HomeIcon, TrophyIcon, SmartphoneIcon, RocketIcon, 
  BarChartIcon, CrownIcon, SaveIcon, TrendingUpIcon, GlobeIcon 
} from "@/components/ui/Icons";

const SECTIONS = [
  { id: "hero", label: "Start", icon: <HomeIcon className="w-4 h-4" /> },
  { id: "engine", label: "Web Engine", icon: <TrophyIcon className="w-4 h-4" /> },
  { id: "app", label: "The App", icon: <SmartphoneIcon className="w-4 h-4" /> },
  { id: "download", label: "Get Access", icon: <RocketIcon className="w-4 h-4" /> },
];

/**
 * Rock-solid Scroll Spy navigation pill.
 *
 * Three-layer jitter prevention:
 *
 *   Layer 1 — Directional dead zone:
 *     Two trigger lines: 30% from top when scrolling DOWN, 60% when scrolling UP.
 *     The 30% gap is a dead zone where NO switching can happen.
 *
 *   Layer 2 — Temporal debounce:
 *     A candidate must win for 3 consecutive animation frames (~50ms at 60Hz)
 *     before the switch commits. Single-frame glitches are filtered.
 *
 *   Layer 3 — Programmatic scroll lock:
 *     Clicking a nav item immediately sets that section and locks the spy
 *     for 800ms, preventing fight during smooth scrollIntoView.
 *
 *   Edge cases: scroll ≤ 10px → hero; scroll ≥ bottom-10px → last section.
 *
 * Performance: coalesced via requestAnimationFrame (~60Hz max).
 */
const ScrollNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState("hero");

  // Mutable refs shared between the scroll spy effect and click handlers.
  // Using a ref object so the effect closure always sees the latest values.
  const spyState = React.useRef({
    currentActive: "hero",
    lockedUntil: 0,           // timestamp: ignore scroll until this time
    scrollHistory: [] as number[],
    candidate: null as string | null,
    candidateFrames: 0,
  });

  useEffect(() => {
    const TRIGGER_DOWN = 0.30;   // trigger line when scrolling down (30% from top)
    const TRIGGER_UP   = 0.60;   // trigger line when scrolling up (60% from top)
    const REQUIRED_FRAMES = 3;   // candidate must win N consecutive frames
    const HISTORY_SIZE = 5;      // samples for smoothed direction

    const state = spyState.current;
    let rafId: number | null = null;

    const getSmoothedDirection = (scrollY: number): "down" | "up" | "idle" => {
      state.scrollHistory.push(scrollY);
      if (state.scrollHistory.length > HISTORY_SIZE) state.scrollHistory.shift();
      if (state.scrollHistory.length < 2) return "idle";
      const diff = state.scrollHistory[state.scrollHistory.length - 1] - state.scrollHistory[0];
      if (Math.abs(diff) < 3) return "idle"; // sub-3px = idle
      return diff > 0 ? "down" : "up";
    };

    const commit = (id: string) => {
      state.currentActive = id;
      state.candidate = null;
      state.candidateFrames = 0;
      setActiveSection(id);
    };

    const detect = () => {
      rafId = null;

      // Respect programmatic scroll lock
      if (Date.now() < state.lockedUntil) return;

      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // Edge: very top → hero
      if (scrollY <= 10) {
        if (state.currentActive !== "hero") commit("hero");
        return;
      }

      // Edge: very bottom → last section
      const maxScroll = document.documentElement.scrollHeight - vh;
      if (scrollY >= maxScroll - 10) {
        const lastId = SECTIONS[SECTIONS.length - 1].id;
        if (state.currentActive !== lastId) commit(lastId);
        return;
      }

      // Smoothed scroll direction
      const dir = getSmoothedDirection(scrollY);

      // Pick trigger line based on direction.
      // "idle" keeps the more conservative (higher) line to avoid accidental switches.
      const triggerLine = dir === "down"
        ? vh * TRIGGER_DOWN
        : vh * TRIGGER_UP;

      // Find the deepest section whose top has passed above the trigger line
      let newActive = SECTIONS[0].id;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerLine) {
            newActive = SECTIONS[i].id;
            break;
          }
        }
      }

      // Temporal debounce: candidate must hold for REQUIRED_FRAMES
      if (newActive !== state.currentActive) {
        if (newActive === state.candidate) {
          state.candidateFrames++;
          if (state.candidateFrames >= REQUIRED_FRAMES) {
            commit(newActive);
          }
        } else {
          state.candidate = newActive;
          state.candidateFrames = 1;
        }
      } else {
        // Current section still winning — reset candidate
        state.candidate = null;
        state.candidateFrames = 0;
      }
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(detect);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Deferred initial check (two frames for layout to settle)
    requestAnimationFrame(() => requestAnimationFrame(detect));

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Click handler: immediately commit + lock spy during smooth scroll
  const handleNavClick = (sectionId: string) => {
    const state = spyState.current;
    state.currentActive = sectionId;
    state.lockedUntil = Date.now() + 800; // lock for 800ms
    state.candidate = null;
    state.candidateFrames = 0;
    state.scrollHistory = [];
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0, x: "-50%" }}
      animate={{ y: 0, opacity: 1, x: "-50%" }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="fixed bottom-8 left-1/2 z-[600] hidden md:flex items-center p-1.5 bg-background/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      {SECTIONS.map((sec) => (
        <button
          key={sec.id}
          onClick={() => handleNavClick(sec.id)}
          className={cn(
            "relative px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 select-none",
            activeSection === sec.id ? "text-background" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          )}
        >
          {activeSection === sec.id && (
            <motion.div
              layoutId="nav-pill"
              className="absolute inset-0 bg-foreground rounded-full -z-10"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{sec.icon}</span>
          <span className="relative z-10">{sec.label}</span>
        </button>
      ))}
    </motion.div>
  );
};

// Live Leaderboard micro-interaction component for the Bento Box
const LiveLeaderboardDemo = () => {
  const [players, setPlayers] = useState([
    { name: "John", pts: 145, trend: "same" as const },
    { name: "Jane", pts: 141, trend: "same" as const },
    { name: "Alice", pts: 137, trend: "same" as const },
    { name: "Bob", pts: 130, trend: "same" as const },
    { name: "Emma", pts: 125, trend: "same" as const },
    { name: "Liam", pts: 120, trend: "same" as const },
    { name: "Olivia", pts: 115, trend: "same" as const },
    { name: "Noah", pts: 110, trend: "same" as const }
  ]);
  const [round, setRound] = useState(4);
  const [phase, setPhase] = useState<"leaderboard" | "match">("leaderboard");
  const [currentMatches, setCurrentMatches] = useState<Array<{court: number, t1: string[], t2: string[], s1: number, s2: number}>>([]);

  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      if (tick % 2 !== 0) {
        // Phase: MATCH - Show the upcoming matches based on current standings
        setPlayers(prev => {
           const sorted = [...prev].sort((a, b) => b.pts - a.pts);
           // Generate random score for the upcoming matches
           const m1Points = Math.floor(Math.random() * 9) + 8; // 8 to 16
           const m2Points = Math.floor(Math.random() * 9) + 8; // 8 to 16
           setCurrentMatches([
             {
               court: 1,
               t1: [sorted[0].name, sorted[2].name], // 1 & 3
               t2: [sorted[1].name, sorted[3].name], // 2 & 4
               s1: m1Points,
               s2: 24 - m1Points
             },
             {
               court: 2,
               t1: [sorted[4].name, sorted[6].name], // 5 & 7
               t2: [sorted[5].name, sorted[7].name], // 6 & 8
               s1: m2Points,
               s2: 24 - m2Points
             }
           ]);
           return prev;
        });
        setPhase("match");
      } else {
        // Phase: LEADERBOARD - Apply points and show updated standings
        setPlayers(prev => {
          const sorted = [...prev].sort((a, b) => b.pts - a.pts);
          let s1 = 12, s2 = 12, s3 = 12, s4 = 12;
          
          setCurrentMatches(matches => {
            if (matches.length === 2) { 
               s1 = matches[0].s1; s2 = matches[0].s2; 
               s3 = matches[1].s1; s4 = matches[1].s2;
            }
            return matches;
          });

          const updated = sorted.map((p, i) => {
            let gained = 0;
            if (i === 0 || i === 2) gained = s1;
            if (i === 1 || i === 3) gained = s2;
            if (i === 4 || i === 6) gained = s3;
            if (i === 5 || i === 7) gained = s4;
            return { ...p, pts: p.pts + gained };
          });

          return updated.sort((a, b) => b.pts - a.pts).map((p, i) => {
             const oldIdx = prev.findIndex(op => op.name === p.name);
             return { ...p, trend: oldIdx > i ? "up" : oldIdx < i ? "down" : "same" };
          });
        });
        setPhase("leaderboard");
        setRound(r => (r >= 6 ? 1 : r + 1));
      }
    }, 3000); // toggle every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background/90 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-2xl w-full max-w-sm mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-warning to-success" />
      <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> {phase === 'leaderboard' ? 'Live Standings' : 'Live Match'}
         </span>
         <span className="text-[10px] font-bold text-muted-foreground/50">Round {round}/6</span>
      </div>
      <div className="relative h-[385px]">
         <AnimatePresence mode="wait">
            {phase === 'match' && currentMatches.length > 0 ? (
               <motion.div
                 key="match-view"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 transition={{ duration: 0.3 }}
                 className="flex flex-col items-center justify-center h-full gap-4 pb-0"
               >
                 {currentMatches.map((match, idx) => (
                    <div key={idx} className="w-full bg-white/[0.02] p-4 rounded-xl border border-white/5 flex shadow-inner gap-4 items-center justify-between">
                       <div className="flex-1">
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-black mb-1.5 block">Court {match.court}</span>
                          <div className="flex flex-col gap-1.5">
                            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                              <span className="opacity-50 text-[10px]">#{idx * 4 + 1}</span> {match.t1[0]} <span className="opacity-30">&</span> {match.t1[1]} <span className="opacity-50 text-[10px]">#{idx * 4 + 3}</span>
                            </div>
                            <div className="text-[10px] text-muted-foreground/50 font-black pl-1">VS</div>
                            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                              <span className="opacity-50 text-[10px]">#{idx * 4 + 2}</span> {match.t2[0]} <span className="opacity-30">&</span> {match.t2[1]} <span className="opacity-50 text-[10px]">#{idx * 4 + 4}</span>
                            </div>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-3 text-2xl font-black shrink-0">
                         <div className="flex flex-col items-center">
                           <span className="text-foreground">{match.s1}</span>
                           <span className="text-[9px] text-success uppercase tracking-widest mt-0.5">+ {match.s1}</span>
                         </div>
                         <span className="text-muted-foreground/30 mb-4">-</span>
                         <div className="flex flex-col items-center">
                           <span className="text-foreground">{match.s2}</span>
                           <span className="text-[9px] text-success uppercase tracking-widest mt-0.5">+ {match.s2}</span>
                         </div>
                       </div>
                    </div>
                 ))}
               </motion.div>
            ) : (
               <motion.div 
                 key="leaderboard-view" 
                 className="absolute inset-0 w-full h-full"
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.3 }}
               >
                 {players.map((p, i) => (
                    <motion.div 
                      layout 
                      key={p.name} 
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="flex justify-between items-center bg-white/[0.02] p-2.5 rounded-xl border border-white/5 absolute w-full"
                      style={{ top: i * 48 }}
                    >
                       <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-muted-foreground/50 w-3">{i + 1}</span>
                          <span className="text-sm font-bold text-foreground">{p.name}</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold opacity-60">
                             {p.trend === "up" ? <span className="text-success">▲</span> : p.trend === "down" ? <span className="text-error">▼</span> : <span className="text-muted-foreground">-</span>}
                          </span>
                          <span className="text-sm font-black text-accent">{p.pts}</span>
                       </div>
                    </motion.div>
                 ))}
               </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
};


const ROTATING_WORDS = [
  "Tournaments",
  "Americanos",
  "Mexicanos",
  "Divisions",
  "Brackets",
  "Winner's Courts"
];

const RotatingText = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine width based on the longest word to prevent layout shift
  // Or just let it popLayout and center the text, which we do below.
  return (
    <span className="relative inline-flex flex-col justify-center font-bold text-foreground">
      {/* Invisible placeholder to maintain width based on the longest word */}
      <span className="opacity-0 invisible pointer-events-none px-1 whitespace-nowrap" aria-hidden="true">
        Winner's Courts
      </span>
      <AnimatePresence>
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0, position: "absolute" }}
          animate={{ y: 0, opacity: 1, position: "absolute" }}
          exit={{ y: -20, opacity: 0, position: "absolute" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute inset-0 flex items-center justify-center px-1 whitespace-nowrap"
        >
          {ROTATING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const LandingPage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0, 0.2], [15, 0]);
  const phoneY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const watchY = useTransform(scrollYProgress, [0, 0.2], [50, -20]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden selection:bg-accent selection:text-white">
      {/* Massive Centered Hero Section */}
      <section
        className="min-h-screen flex flex-col items-center justify-start relative overflow-hidden px-6 pt-32 md:pt-40 pb-20"
        id="hero"
      >
        {/* Subtle background noise/gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />
        <div className="absolute top-1/4 left-0 w-full h-[500px] bg-gradient-to-b from-transparent via-primary/5 to-transparent -rotate-12 blur-3xl -z-10 pointer-events-none" />

        <div className="container max-w-[1200px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-block py-1 px-4 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-8">
              Padel Companion
            </span>
            <h1 className="text-6xl md:text-8xl font-bold leading-[0.95] tracking-tighter mb-8 font-display">
              Play. Track. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
                Dominate.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed mb-12">
              Run <RotatingText /> directly in your browser. No sign-ups, no friction. Just padel.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/tournament/generator"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-flex items-center justify-center bg-foreground text-background hover:bg-foreground/90 px-8 py-4 rounded-full text-lg font-bold transition-transform shadow-lg hover:scale-105 active:scale-95 font-display"
              >
                Start Free Tournament
              </Link>
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center bg-transparent border border-border hover:bg-white/5 text-foreground px-8 py-4 rounded-full text-lg font-bold transition-transform hover:scale-105 active:scale-95 font-display"
              >
                Get the App
              </a>
            </div>
          </motion.div>

          <motion.div 
            className="relative w-full max-w-5xl mx-auto mt-24 md:mt-32 flex justify-center items-start h-[400px] md:h-[600px]"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            style={{ perspective: 1200 }}
          >
            <motion.div
              style={{ rotateX: rotateX, y: phoneY }}
              className="absolute z-20 drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            >
               <PhoneMockup />
            </motion.div>
            <motion.div
               style={{ rotateX: rotateX, y: watchY, x: 220 }}
               className="absolute z-30 hidden md:block drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
            >
               <WatchMockup />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Tournament Engine Section */}
      <section className="py-24 px-6 relative" id="engine">
        <div className="container max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 md:mb-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-8"
          >
            <div className="max-w-2xl">
              <span className="inline-block py-1 px-4 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-6">
                For the Organizer
              </span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.1] mb-6 font-display">
                Zero setup. <span className="text-[#f97316]">Just play.</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Start Americano, Mexicano, and Winner's Court in two clicks. Everyone at the court can follow the live leaderboard on their own phone—no app or account required to join.
              </p>
            </div>
            <Link
              to="/tournament/generator"
              onClick={() => window.scrollTo(0, 0)}
              className="shrink-0 inline-flex items-center justify-center bg-[#f97316] text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95 hover:bg-[#f97316]/90 font-display"
            >
              Start Web Tournament →
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Tournament Engine Main Feature */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 md:p-12 flex flex-col overflow-hidden relative group h-full min-h-[500px]"
             >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="relative z-10 max-w-md mb-8">
                   <TrophyIcon className="w-10 h-10 mb-6 text-accent drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
                   <h3 className="text-3xl font-bold mb-4 tracking-tight">Smart Matchmaking</h3>
                   <p className="text-muted-foreground leading-relaxed">
                     No more spreadsheet headaches. Our scheduler calculates balanced rotations automatically. You just key in the scores and play.
                   </p>
                </div>
                <div className="relative z-10 w-full mt-auto">
                   <LiveLeaderboardDemo />
                </div>
             </motion.div>

             <div className="flex flex-col gap-6">
                {/* Format 1 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex-1 bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-center relative overflow-hidden group"
                >
                   <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-white">
                      <div className="w-24 h-24 flex items-center justify-center">
                         <BarChartIcon className="w-full h-full stroke-1" />
                      </div>
                   </div>
                   <div className="relative z-10">
                      <h3 className="text-2xl font-black mb-2 tracking-tight">Divisions & Leagues</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Organize long-running leagues. The engine automatically tracks table standings, game difference, and generates the schedule.
                      </p>
                   </div>
                </motion.div>

                {/* Format 2 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex-1 bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-center relative overflow-hidden group"
                >
                   <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-white">
                      <div className="w-24 h-24 flex items-center justify-center">
                         <CrownIcon className="w-full h-full stroke-1" />
                      </div>
                   </div>
                   <div className="relative z-10">
                      <h3 className="text-2xl font-black mb-2 tracking-tight">Winner's Court</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        The ultimate king of the hill experience. Win and move up towards the center court, lose and drop down.
                      </p>
                   </div>
                </motion.div>

                {/* Format 3 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex-1 bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-center relative overflow-hidden group"
                >
                   <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-white">
                      <div className="w-24 h-24 flex items-center justify-center">
                         <SaveIcon className="w-full h-full stroke-1" />
                      </div>
                   </div>
                   <div className="relative z-10">
                      <h3 className="text-2xl font-black mb-2 tracking-tight">Auto-Save & History</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Never lose a score. The tournament is safely auto-saved locally. Close the tab and resume at any time, or browse through your completed tournaments in the history.
                      </p>
                   </div>
                </motion.div>
             </div>
          </div>
        </div>
      </section>

      {/* The App Section */}
      <section className="py-24 px-6 relative bg-white/[0.02] border-y border-white/5" id="app">
        <div className="container max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 md:mb-24 text-center max-w-3xl mx-auto"
          >
            <div className="flex justify-center mb-8">
              <img src="/assets/app-icon.jpeg" alt="Padel Companion App Icon" className="w-24 h-24 md:w-28 md:h-28 rounded-[1.8rem] shadow-[0_15px_40px_rgba(59,130,246,0.25)] border border-white/10" />
            </div>
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              For the Player
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-6">
              The Companion App
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Available on iOS and Android. Keep track of your daily matches, analyze your personal performance, and score instantly from your smartwatch.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
             {/* App Analytics */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="md:col-span-3 bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative group"
             >
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="relative z-20 flex-1">
                   <TrendingUpIcon className="w-10 h-10 mb-6 text-primary drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
                   <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Deep Personal Analytics</h3>
                   <p className="text-muted-foreground leading-relaxed text-lg">
                     Understand your game. Track win ratios, analyze your form over time, and see who your best partner really is. Find out exactly where you need to improve.
                   </p>
                </div>
                <div className="relative z-10 flex-1 w-full h-full min-h-[200px] flex items-end justify-center gap-3">
                   {[40,70,45,90,65,100,85].map((h,i) => (
                      <motion.div 
                        key={i} 
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="w-12 bg-gradient-to-t from-primary/20 to-primary/80 rounded-t-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                      />
                   ))}
                </div>
             </motion.div>

             {/* Smartwatch */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="md:col-span-2 bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 overflow-hidden relative group"
             >
                <div className="relative z-20 flex-1 max-w-sm">
                   <h3 className="text-3xl font-black mb-4 tracking-tight">Watch First</h3>
                   <p className="text-muted-foreground leading-relaxed text-lg">
                     Standalone Apple Watch and Wear OS support. Leave your phone in the bag. Start matches and score points effortlessly straight from your wrist without breaking a sweat.
                   </p>
                </div>
                <div className="relative z-10 flex-1 flex justify-center items-center drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                   <WatchMockup />
                </div>
             </motion.div>

             {/* Cloud Sync */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden relative group"
             >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:-rotate-12 duration-500 text-white">
                   <div className="w-24 h-24 flex items-center justify-center">
                      <GlobeIcon className="w-full h-full stroke-1" />
                   </div>
                </div>
                <div className="mt-auto relative z-10">
                   <h3 className="text-2xl font-black mb-3 tracking-tight">Always in Sync</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     Your match history, analytics, and active tournaments are backed up in the cloud and instantly synchronized across all your devices in real-time.
                   </p>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Download Section (Beta Signup) */}
      <section className="py-32 relative overflow-hidden" id="download">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-[1.1]">
              Get the App
            </h2>
            <p className="text-muted-foreground text-xl font-medium">
              Join the future of padel tracking today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* iOS Card */}
            <div className="bg-card/40 backdrop-blur-md p-10 border border-white/5 rounded-[2.5rem] shadow-2xl flex flex-col justify-between h-full group hover:border-primary/20 transition-colors">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-10 h-10 mb-6 fill-current text-foreground drop-shadow-[0_4px_12px_rgba(255,255,255,0.1)]"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                <p className="text-xs uppercase tracking-[0.2em] text-accent-light font-bold mb-4">
                  iPhone, iPad & WatchOS
                </p>
                <h3 className="text-3xl font-black text-foreground mb-4 tracking-tight">
                  Available Now
                </h3>
                <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                  Beautiful score tracking, deep match analytics, and the best standalone Apple Watch padel app on the market.
                </p>
              </div>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://apps.apple.com/se/app/padel-companion/id6755152442"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-lg font-bold transition-colors shadow-lg"
              >
                Download on App Store
              </motion.a>
            </div>

            {/* Android Card */}
            <div className="bg-card/40 backdrop-blur-md p-10 border border-white/5 rounded-[2.5rem] shadow-2xl flex flex-col justify-between h-full group hover:border-primary/20 transition-colors">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-10 h-10 mb-6 fill-current text-[#3DDC84] drop-shadow-[0_4px_12px_rgba(61,220,132,0.3)]"><path d="M260.5 46.1l39.1-39.1c4.5-4.5 11.9-4.5 16.4 0s4.5 11.9 0 16.4l-38.3 38.3C328.7 83 368.5 125 376.1 176H71.9c7.6-51 47.4-93 98.5-114.3L132 23.4c-4.5-4.5-4.5-11.9 0-16.4s11.9-4.5 16.4 0l39.1 39.1A196 196 0 0 1 260.4 46.1zM140 120a20 20 0 1 0 0-40 20 20 0 0 0 0 40zm168 0a20 20 0 1 0 0-40 20 20 0 0 0 0 40zM48 200h352v184c0 26.5-21.5 48-48 48H96c-26.5 0-48-21.5-48-48V200zm-8 16H8c-4.4 0-8 3.6-8 8v160c0 4.4 3.6 8 8 8h32v-176zm408 0v176h32c4.4 0 8-3.6 8-8V224c0-4.4-3.6-8-8-8h-32zM128 448h80v48c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16v-48zm112 0h80v48c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16v-48z"/></svg>
                <p className="text-xs uppercase tracking-[0.2em] text-accent-light font-bold mb-4">
                  Android & Wear OS
                </p>
                <h3 className="text-3xl font-black text-foreground mb-4 tracking-tight">
                  Private Beta
                </h3>
                <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                  We're actively developing the Android and Wear OS versions. Leave your email to get early access and shape the app.
                </p>
              </div>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="mailto:wiklund.labs@gmail.com?subject=Android%20Beta%20Access"
                className="w-full inline-flex items-center justify-center bg-foreground text-background hover:bg-foreground/90 px-8 py-4 rounded-full text-lg font-bold transition-colors shadow-lg"
              >
                Become a Tester
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 border-t border-white/5" id="partners">
        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold mb-3">
              Sponsors
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
              Partner with us
            </h2>
            <p className="text-muted-foreground">
              Reach committed padel players and clubs as Padel Companion grows
              across iOS and Android.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
            <SponsorSlot />
            <SponsorSlot />
            <SponsorSlot />
          </div>
        </div>
      </section>

      <ScrollNav />
      <CookieBanner />
    </div>
  );
};

const CookieBanner: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("padelcompanion-cookies")) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:w-[420px] z-[900]"
        >
          <div className="bg-background/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl">
            <h4 className="text-lg font-black mb-2 tracking-tight">🍪 Cookies & Privacy</h4>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              We use local storage for your preferences and privacy-friendly
              analytics. No cross-site tracking.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="bg-foreground text-background hover:bg-foreground/90 px-6 py-2.5 rounded-full text-sm font-bold transition-colors"
                onClick={() => {
                  localStorage.setItem("padelcompanion-cookies", "accepted");
                  setShow(false);
                }}
              >
                Got it
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LandingPage;