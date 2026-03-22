import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

export const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  delay?: number;
}> = ({ icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay: delay * 0.1 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="h-full"
  >
    <GlassCard className="h-full group hover:border-accent/40 transition-colors shadow-xl">
      <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-accent/20 transition-all">
        <span>{icon}</span>
      </div>
      <h4 className="text-xl font-bold text-foreground mb-3">{title}</h4>
      <p className="text-muted-foreground leading-relaxed text-sm md:text-base opacity-90">
        {description}
      </p>
    </GlassCard>
  </motion.div>
);

export const StatItem: React.FC<{
  title: string;
  description: string;
  delay?: number;
}> = ({ title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
    className="flex flex-col items-center p-4"
  >
    <h3 className="text-2xl md:text-3xl font-black text-blue-400 mb-2 drop-shadow-sm">
      {title}
    </h3>
    <p className="text-sm text-muted-foreground font-medium leading-snug">
      {description}
    </p>
  </motion.div>
);

export const SponsorSlot: React.FC = () => (
  <motion.a
    href="mailto:wiklund.labs@gmail.com"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="h-[100px] bg-white/[0.02] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center px-4 hover:text-muted-foreground hover:border-white/20 transition-all"
  >
    <span className="text-sm font-bold text-foreground/80">Become a launch partner</span>
    <span className="mt-1 text-xs text-muted-foreground/60">
      Sponsor Padel Companion
    </span>
  </motion.a>
);
