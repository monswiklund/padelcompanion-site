import React, { useState, useEffect } from "react";
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
  const [platform, setPlatform] = useState("");
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

    if (!platform) {
      setError("Please select a platform (iOS or Android)");
      return;
    }

    setLoading(true);
    const subject = encodeURIComponent("Beta Testing Signup");
    const body = encodeURIComponent(
      `Hi Team,\n\nI'm excited to join the Padel Companion beta for ${platform}!\n\nMy email is: ${email}\n\nLooking forward to testing it out!`,
    );

    window.location.href = `mailto:wiklund.labs@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setLoading(false);
      setEmail("");
      setPlatform("");
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
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none -z-10"
        />

        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center relative z-10 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl mx-auto md:mx-0"
            >
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
                Track Scores.
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] block">
                  Win More.
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto md:mx-0 font-medium">
                The ultimate companion for Padel players. Track your progress,
                organize tournaments, and sync across platforms.
              </p>

              <div className="relative group">
                <GlassCard className="p-2 border-white/5 shadow-2xl group-hover:border-blue-500/30 transition-colors">
                  <form
                    className="flex flex-col md:flex-row items-stretch md:items-center gap-2"
                    onSubmit={handleSubmit}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-foreground outline-none border border-transparent focus:border-blue-500/50 transition-all placeholder:text-muted-foreground/50"
                    />
                    <select
                      className="bg-white/5 rounded-xl px-4 py-3 text-muted-foreground outline-none border border-transparent focus:border-blue-500/50 transition-all cursor-pointer appearance-none min-w-[120px]"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                    >
                      <option value="" disabled className="bg-slate-900">
                        Platform
                      </option>
                      <option value="iOS" className="bg-slate-900">
                        iOS
                      </option>
                      <option value="Android" className="bg-slate-900">
                        Android
                      </option>
                    </select>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-600/20"
                      disabled={loading}
                    >
                      {loading ? "Joining..." : "Join Beta"}
                    </motion.button>
                  </form>
                </GlassCard>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-10 left-0 right-0 text-sm text-red-400 font-medium text-center md:text-left"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
              <p className="text-sm text-muted-foreground/60 mt-8 font-medium">
                Coming soon to Apple Watch & Wear OS
              </p>
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

      {/* Partners Section */}
      <section className="py-24" id="partners">
        <div className="container max-w-[1200px] mx-auto px-6">
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
