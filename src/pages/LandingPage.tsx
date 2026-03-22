import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { PhoneMockup } from "@/components/landing/PhoneMockup";
import { WatchMockup } from "@/components/landing/WatchMockup";
import {
  FeatureCard,
  StatItem,
  SponsorSlot,
} from "@/components/landing/LandingSections";
import { GlassCard } from "@/components/ui/GlassCard";

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [0.3, 0]);

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

    setLoading(true);
    const subject = encodeURIComponent("Android Testing Signup");
    const body = encodeURIComponent(
      `Hi Team,\n\nI'm interested in testing Padel Companion on Android.\n\nMy email is: ${email}\n\nLooking forward to trying it out!`,
    );

    window.location.href = `mailto:wiklund.labs@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setLoading(false);
      setEmail("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section
        className="min-h-screen flex items-center relative overflow-hidden px-4 py-20"
        id="hero"
      >
        {/* Animated Background Elements */}
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none -z-10"
        />
        <motion.div
          style={{ y: useTransform(scrollY, [0, 500], [0, -100]), opacity }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-600/10 blur-[100px] rounded-full pointer-events-none -z-10"
        />

        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center relative z-10 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl mx-auto md:mx-0"
            >
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight flex flex-col gap-2">
                <span>Track Scores.</span>
                <span className="text-orange-400 drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                  Run Tournaments.
                </span>
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                  Win More.
                </span>
              </h1>
              <div className="flex flex-col gap-5 text-lg md:text-xl text-muted-foreground mb-6 max-w-lg mx-auto md:mx-0 font-medium text-left">
                <p className="flex items-start gap-4">
                  <span className="text-2xl leading-tight">📱</span>
                  <span className="leading-snug"><strong>The Padel App:</strong> Track your daily matches, analyze personal stats, and score from your Apple Watch.</span>
                </p>
                <p className="flex items-start gap-4">
                  <span className="text-2xl leading-tight">💻</span>
                  <span className="leading-snug"><strong>The Tournament Engine:</strong> Organize instant tournaments directly on the web. Free and no signup required.</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-12 max-w-lg mx-auto md:mx-0">
                <span className="text-sm font-semibold bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-foreground/80">Americano</span>
                <span className="text-sm font-semibold bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-foreground/80">Mexicano</span>
                <span className="text-sm font-semibold bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-foreground/80">Winner's Court</span>
                <span className="text-sm font-semibold bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-foreground/80">Brackets</span>
                <span className="text-sm font-semibold bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-foreground/80">Divisions</span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-4">
                <Link
                  to="/tournament/generator"
                  onClick={() => window.scrollTo(0, 0)}
                  className="inline-flex items-center justify-center bg-orange-400 hover:bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] transform hover:-translate-y-1"
                >
                  Start a Free Tournament
                </Link>
                <a
                  href="#download"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transform hover:-translate-y-1"
                >
                  Download the App
                </a>
              </div>
            </motion.div>

            <motion.div className="flex flex-col md:flex-row justify-center items-center gap-8 relative">
              <PhoneMockup />
              <div className="hidden lg:block absolute -right-20 top-1/2 -translate-y-1/2">
                <WatchMockup />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tournament Engine Showcase Section */}
      <section className="py-24 relative overflow-hidden bg-orange-900/5">
        <div className="container max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Powerful <span className="text-orange-400 drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]">Web Tournaments</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl font-medium">
              Run entirely from your browser. Free, no sign-up required, instantly syncs to all players.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="p-8 border-orange-500/20 shadow-xl hover:border-orange-500/40 transition-colors">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-3">Mexicano</h3>
              <p className="text-muted-foreground">The most popular format. Players are matched dynamically based on current standings for perfectly balanced games.</p>
            </GlassCard>
            <GlassCard className="p-8 border-blue-500/20 shadow-xl hover:border-blue-500/40 transition-colors">
              <div className="text-4xl mb-4">👑</div>
              <h3 className="text-2xl font-bold mb-3">Winner's Court</h3>
              <p className="text-muted-foreground">King of the hill format. Win and move up, lose and move down. Frantic and incredibly fun for larger groups.</p>
            </GlassCard>
            <GlassCard className="p-8 border-green-500/20 shadow-xl hover:border-green-500/40 transition-colors">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold mb-3">Americano</h3>
              <p className="text-muted-foreground">The classic format. Play with and against everyone exactly once. Pure individual performance tracking.</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative" id="features">
        <div className="container max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-24"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              Built for the <br />
              <span className="text-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.3)]">
                Smart Court
              </span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl font-medium">
              Everything you need to improve your game and stay connected with
              your padel community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🏆"
              title="Tournament Engine"
              description="Run Americano, Mexicano, and Brackets with ease. Automatic rotation and live tables."
              delay={3}
            />
            <FeatureCard
              icon="🎯"
              title="Easy Score Tracking"
              description="Intuitive scoring designed for the pace of play. Digital scoreboards on your wrist or phone."
              delay={1}
            />
            <FeatureCard
              icon="📊"
              title="Advanced Analytics"
              description="Understand your strengths and weaknesses. Track win ratios, partner performance and form."
              delay={2}
            />
            <FeatureCard
              icon="🏆"
              title="Tournament Engine"
              description="Run Americano, Mexicano, and Brackets with ease. Automatic rotation and live tables."
              delay={3}
            />
            <FeatureCard
              icon="⌚"
              title="Smartwatch First"
              description="The best standalone watch app for Padel. Score points without ever touching your phone."
              delay={4}
            />
            <FeatureCard
              icon="👥"
              title="Social Network"
              description="Follow friends, share highlights, and find new opponents at your skill level."
              delay={5}
            />
            <FeatureCard
              icon="🌐"
              title="Instant Cloud Sync"
              description="Real-time synchronization across all devices. Your match history is always safe."
              delay={6}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="container max-w-[1200px] mx-auto px-6">
          <GlassCard className="bg-blue-600/[0.03] border-white/5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
              <StatItem
                title="Free"
                description="Core tracking features"
                delay={1}
              />
              <StatItem
                title="Insights"
                description="Deep game analysis"
                delay={2}
              />
              <StatItem
                title="Privacy"
                description="Secured data sync"
                delay={3}
              />
              <StatItem
                title="Global"
                description="Available world-wide"
                delay={4}
              />
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-24 relative overflow-hidden" id="download">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Get the <span className="text-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.3)]">App</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl font-medium">
              Track your regular matches, analyze personal stats, and get smartwatch support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* iOS Card */}
            <GlassCard className="p-8 border-white/5 shadow-2xl flex flex-col justify-between h-full group hover:border-blue-500/30 transition-colors">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-blue-300 font-bold mb-4">
                  iPhone & iPad & WatchOS
                </p>
                <h3 className="text-3xl font-black text-foreground mb-4">
                  Now live on the App Store
                </h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  Beautiful score tracking, deep match analytics, and the best standalone Apple Watch padel app on the market.
                </p>
              </div>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://apps.apple.com/se/app/padel-companion/id6755152442"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-bold transition-colors shadow-lg shadow-blue-600/20"
              >
                Download on App Store
              </motion.a>
            </GlassCard>

            {/* Android Card */}
            <GlassCard className="p-8 border-white/5 shadow-2xl flex flex-col justify-between h-full group hover:border-blue-500/30 transition-colors">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-blue-300 font-bold mb-4">
                  Android & Wear OS
                </p>
                <h3 className="text-3xl font-black text-foreground mb-4">
                  Test the Android Beta
                </h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  We're actively developing the Android and Wear OS versions. Leave your email to get early access and shape the app.
                </p>
              </div>
              <form
                className="flex flex-col gap-3"
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-white/5 rounded-xl px-5 py-4 text-foreground outline-none border border-transparent focus:border-blue-500/50 transition-all placeholder:text-muted-foreground/50"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white/10 hover:bg-white/15 text-white px-8 py-4 rounded-xl text-lg font-bold transition-colors"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Sending..." : "Become a Tester"}
                </motion.button>
                {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
              </form>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24" id="partners">
        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-300 font-bold mb-3">
              Sponsors
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Built with room for great partners
            </h2>
            <p className="text-muted-foreground">
              Reach committed padel players and clubs as Padel Companion grows
              across iOS and Android.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
          className="fixed bottom-4 left-4 right-4 md:bottom-8 md:right-8 md:left-auto md:w-[400px] z-[900]"
        >
          <GlassCard className="shadow-2xl border-blue-500/20">
            <h4 className="text-lg font-bold mb-2">🍪 Cookies & Privacy</h4>
            <p className="text-muted-foreground text-sm mb-6 font-medium">
              We use local storage for your preferences and privacy-friendly
              analytics. No cross-site tracking.
            </p>
            <div className="flex justify-end">
              <button
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors"
                onClick={() => {
                  localStorage.setItem("padelcompanion-cookies", "accepted");
                  setShow(false);
                }}
              >
                Accept
              </button>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LandingPage;
