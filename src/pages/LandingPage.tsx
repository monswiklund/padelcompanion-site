import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { PhoneMockup } from "@/components/landing/PhoneMockup";
import { WatchMockup } from "@/components/landing/WatchMockup";
import { GlassCard } from "@/components/ui/GlassCard";
import { SponsorSlot } from "@/components/landing/LandingSections";

// Live Leaderboard micro-interaction component for the Bento Box
const LiveLeaderboardDemo = () => {
  const [players, setPlayers] = useState([
    { name: "John", pts: 145, trend: "same" as const },
    { name: "Jane", pts: 141, trend: "same" as const },
    { name: "Alice", pts: 137, trend: "same" as const },
    { name: "Bob", pts: 130, trend: "same" as const }
  ]);
  const [round, setRound] = useState(4);
  const [phase, setPhase] = useState<"leaderboard" | "match">("leaderboard");
  const [currentMatch, setCurrentMatch] = useState<{t1: string[], t2: string[], s1: number, s2: number} | null>(null);

  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      if (tick % 2 !== 0) {
        // Phase: MATCH - Show the upcoming matches based on current standings
        setPlayers(prev => {
           const sorted = [...prev].sort((a, b) => b.pts - a.pts);
           // Generate random score for the upcoming match
           const m1Points = Math.floor(Math.random() * 9) + 8; // 8 to 16
           setCurrentMatch({
             t1: [sorted[0].name, sorted[2].name], // 1 & 3
             t2: [sorted[1].name, sorted[3].name], // 2 & 4
             s1: m1Points,
             s2: 24 - m1Points
           });
           return prev;
        });
        setPhase("match");
      } else {
        // Phase: LEADERBOARD - Apply points and show updated standings
        setPlayers(prev => {
          const sorted = [...prev].sort((a, b) => b.pts - a.pts);
          let m1 = 12;
          let m2 = 12;
          
          setCurrentMatch(match => {
            if (match) { m1 = match.s1; m2 = match.s2; }
            return match;
          });

          const updated = sorted.map((p, i) => {
            let gained = 0;
            if (i === 0 || i === 2) gained = m1;
            if (i === 1 || i === 3) gained = m2;
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
      <div className="relative h-[190px]">
         <AnimatePresence mode="wait">
            {phase === 'match' && currentMatch ? (
               <motion.div
                 key="match-view"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 transition={{ duration: 0.3 }}
                 className="flex flex-col items-center justify-center h-full gap-5 pb-4"
               >
                  <div className="w-full bg-white/[0.02] p-4 rounded-xl border border-white/5 flex flex-col items-center shadow-inner">
                     <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-black mb-2">Mexicano Matchup</span>
                     <div className="text-sm font-bold text-foreground text-center flex items-center gap-2">
                       <span className="opacity-50 text-[10px]">#1</span> {currentMatch.t1[0]} <span className="opacity-50 text-[10px]">&</span> {currentMatch.t1[1]} <span className="opacity-50 text-[10px]">#3</span>
                     </div>
                     <div className="text-[10px] text-muted-foreground/50 font-black my-1">VS</div>
                     <div className="text-sm font-bold text-foreground text-center flex items-center gap-2">
                       <span className="opacity-50 text-[10px]">#2</span> {currentMatch.t2[0]} <span className="opacity-50 text-[10px]">&</span> {currentMatch.t2[1]} <span className="opacity-50 text-[10px]">#4</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 text-3xl font-black">
                     <div className="flex flex-col items-center">
                       <span className="text-foreground">{currentMatch.s1}</span>
                       <span className="text-[10px] text-success uppercase tracking-widest mt-1">+ {currentMatch.s1} pts</span>
                     </div>
                     <span className="text-muted-foreground/30 mb-5">-</span>
                     <div className="flex flex-col items-center">
                       <span className="text-foreground">{currentMatch.s2}</span>
                       <span className="text-[10px] text-success uppercase tracking-widest mt-1">+ {currentMatch.s2} pts</span>
                     </div>
                  </div>
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

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0, 0.2], [15, 0]);
  const phoneY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const watchY = useTransform(scrollYProgress, [0, 0.2], [50, -20]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/beta-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong. Please try again.');
      }

      setSuccess(true);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Failed to sign up.");
    } finally {
      setLoading(false);
    }
  };

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
            <span className="inline-block py-1 px-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-8">
              Padel Companion 2.0
            </span>
            <h1 className="text-6xl md:text-[8rem] font-black leading-[0.9] tracking-tighter mb-8">
              The ultimate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-dark">
                padel engine.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed mb-12">
              Organize perfect tournaments in your browser. Track your daily matches on your wrist. Build your legacy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/tournament/generator"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-flex items-center justify-center bg-foreground text-background hover:bg-foreground/90 px-8 py-4 rounded-full text-lg font-bold transition-transform shadow-lg hover:scale-105 active:scale-95"
              >
                Start Free Tournament
              </Link>
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center bg-transparent border border-border hover:bg-white/5 text-foreground px-8 py-4 rounded-full text-lg font-bold transition-transform hover:scale-105 active:scale-95"
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
              <span className="inline-block py-1 px-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-6">
                For the Organizer
              </span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-6">
                The Web Engine
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Run Americano, Mexicano, Brackets, and Winner's Court straight from your browser. 
                No sign-ups required. Instantly share live leaderboards with everyone at the club.
              </p>
            </div>
            <Link
              to="/tournament/generator"
              onClick={() => window.scrollTo(0, 0)}
              className="shrink-0 inline-flex items-center justify-center bg-transparent border border-border hover:bg-white/5 text-foreground px-6 py-3 rounded-full text-sm font-bold transition-transform hover:scale-105 active:scale-95"
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
                   <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-2xl mb-6 text-accent">🏆</div>
                   <h3 className="text-3xl font-black mb-4 tracking-tight">Perfect Matchmaking</h3>
                   <p className="text-muted-foreground leading-relaxed">
                     Our algorithms handle the complex rotations to ensure perfectly balanced games, no matter the format. You just focus on playing.
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
                      <div className="text-8xl">📊</div>
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
                      <div className="text-8xl">👑</div>
                   </div>
                   <div className="relative z-10">
                      <h3 className="text-2xl font-black mb-2 tracking-tight">Winner's Court</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        The ultimate king of the hill experience. Win and move up towards the center court, lose and drop down.
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
                   <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-2xl mb-6 text-primary">📈</div>
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
                <div className="relative z-10 flex-1 flex justify-center items-center pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
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
                   <div className="text-8xl">🌐</div>
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
                <div className="text-4xl mb-6">🍎</div>
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
                <div className="text-4xl mb-6">🤖</div>
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
              <form
                className="flex flex-col gap-3"
                onSubmit={handleSubmit}
              >
                {success ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-success/10 text-success border border-success/20 px-6 py-4 rounded-2xl text-center font-bold"
                  >
                    You're on the list! Keep an eye on your inbox.
                  </motion.div>
                ) : (
                  <>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-white/[0.03] rounded-2xl px-6 py-4 text-foreground outline-none border border-white/5 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                      required
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-foreground text-background hover:bg-foreground/90 px-8 py-4 rounded-full text-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      disabled={loading}
                      type="submit"
                    >
                      {loading ? "Sending..." : "Become a Tester"}
                    </motion.button>
                  </>
                )}
                {error && <p className="text-error text-sm mt-2 text-center font-medium">{error}</p>}
              </form>
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