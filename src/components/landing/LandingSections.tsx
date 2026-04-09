import React from "react";
import { motion } from "framer-motion";

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
