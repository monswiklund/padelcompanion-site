import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/utils";

import { BallIcon, UsersIcon, TrophyIcon, HomeIcon, CalendarIcon, TrendingUpIcon } from "@/components/ui/Icons";

const NavItem: React.FC<{
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ active, icon, label, onClick }) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center w-full h-full cursor-pointer transition-all duration-300",
      active
        ? "opacity-100 text-[#007aff] scale-110"
        : "opacity-50 text-[#8e8e93] hover:opacity-80 hover:scale-105",
    )}
    onClick={onClick}
  >
    <span className="text-[1.1rem] mb-0.5">{icon}</span>
    <span className="text-[0.6rem] font-medium leading-none">{label}</span>
  </div>
);

const PlayerMockupCard: React.FC<{
  name: string;
  avatar: string;
  stat: string;
}> = ({ name, avatar, stat }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-[#1c1c1e] rounded-[14px] p-2.5 px-3.5 flex items-center gap-3 border border-white/5 mb-2 shadow-sm"
  >
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[0.8rem] font-bold text-white shadow-inner">
      {avatar}
    </div>
    <div className="flex flex-col">
      <span className="text-[0.9rem] font-semibold text-white">{name}</span>
      <span className="text-[0.7rem] text-[#8e8e93] leading-none">{stat}</span>
    </div>
  </motion.div>
);

export const PhoneMockup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "home" | "history" | "players" | "insights"
  >("home");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative w-[180px] h-[360px] md:w-[300px] md:h-[600px] bg-black rounded-[28px] md:rounded-[40px] border-[3px] md:border-4 border-[#3a3a3a] shadow-[0_0_0_2px_#111,0_20px_50px_rgba(0,0,0,0.6),0_0_80px_rgba(59,130,246,0.2)] flex flex-col z-10"
    >
      {/* Side Buttons */}
      <div className="absolute -right-[6px] top-[100px] w-[3px] h-[60px] bg-[#2a2a2a] rounded-r-[2px] -z-10"></div>
      <div className="absolute -left-[6px] top-[90px] -z-10">
        <div className="w-[3px] h-[40px] bg-[#2a2a2a] rounded-l-[2px] mb-[10px]"></div>
        <div className="w-[3px] h-[40px] bg-[#2a2a2a] rounded-l-[2px]"></div>
      </div>

      <div className="w-full h-full bg-black flex flex-col relative rounded-[24px] md:rounded-[36px] overflow-hidden">
        {/* Dynamic Island */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[80px] h-[22px] bg-black rounded-[20px] z-[100] shadow-md border border-white/5"></div>

        {/* Status Bar */}
        <div className="pt-[14px] px-6 flex justify-between text-[11px] font-bold text-white z-10 opacity-80">
          <span>9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-4 h-2 rounded-sm border border-white/30" />
          </div>
        </div>

        {/* App Header */}
        <div className="p-5 pb-2.5 flex justify-between items-end bg-gradient-to-b from-black via-black to-transparent">
          <span className="text-xl font-black text-white leading-[1.1] max-w-[75%] tracking-tight">
            Padel Companion
          </span>
        </div>

        {/* Content Area with Animation */}
        <div className="flex-1 px-4 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, x: 5 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.02, x: -5 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col gap-3 py-1"
            >
              {activeTab === "home" && (
                <>
                  <h4 className="text-[0.9rem] font-bold text-white mb-1">
                    Add New Match
                  </h4>
                  <div className="bg-gradient-to-br from-[#007aff] to-[#0056b3] rounded-[18px] p-3.5 flex items-center gap-3 text-white relative overflow-hidden transition-all hover:brightness-110 active:scale-95 min-h-[72px] shadow-lg">
                    <div className="text-[1.6rem] w-8 text-center drop-shadow-md flex justify-center">
                      <BallIcon className="w-6 h-6" />
                    </div>
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
                  <div className="bg-gradient-to-br from-[#ff9500] to-[#e08200] rounded-[18px] p-3.5 flex items-center gap-3 text-white relative overflow-hidden transition-all hover:brightness-110 active:scale-95 min-h-[72px] shadow-lg">
                    <div className="text-[1.6rem] w-8 text-center drop-shadow-md flex justify-center">
                      <UsersIcon className="w-6 h-6" />
                    </div>
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
                  <div className="bg-gradient-to-br from-[#af52de] to-[#8e2db2] rounded-[18px] p-3.5 flex items-center gap-3 text-white relative overflow-hidden transition-all hover:brightness-110 active:scale-95 min-h-[72px] shadow-lg">
                    <div className="text-[1.6rem] w-8 text-center drop-shadow-md flex justify-center">
                      <TrophyIcon className="w-6 h-6" />
                    </div>
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
                  <div className="grid grid-cols-2 gap-2.5 mt-1">
                    <div className="bg-[#1c1c1e] rounded-[14px] p-2.5 flex flex-col gap-0.5 border border-white/5">
                      <span className="text-[0.65rem] text-[#8e8e93] uppercase tracking-wider font-bold">
                        Activity
                      </span>
                      <span className="text-[1.4rem] font-black text-white leading-none">
                        4
                      </span>
                    </div>
                    <div className="bg-[#1c1c1e] rounded-[14px] p-2.5 flex flex-col gap-0.5 border border-white/5">
                      <span className="text-[0.65rem] text-[#8e8e93] uppercase tracking-wider font-bold">
                        Streak
                      </span>
                      <span className="text-[1.4rem] font-black text-white leading-none">
                        -
                      </span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "history" && (
                <>
                  <h4 className="text-[0.9rem] font-bold text-white mb-1">
                    Recent Matches
                  </h4>
                  <div className="bg-[#1c1c1e] rounded-2xl p-4 flex flex-col gap-2 border border-white/5 border-l-4 border-l-yellow-500/50 shadow-md">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#8e8e93]">18:56</span>
                      <span className="text-[0.7rem] font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-500 border border-yellow-500/10">
                        DRAW
                      </span>
                    </div>
                    <div className="text-2xl font-black text-white flex items-baseline gap-1.5">
                      12-12{" "}
                      <span className="text-[0.9rem] text-[#8e8e93] font-normal">
                        pts
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-white/5 px-2 py-0.5 rounded-full text-[10px] text-white/70 border border-white/5">
                        Mexicano
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#1c1c1e] rounded-2xl p-4 flex flex-col gap-2 border border-white/5 border-l-4 border-l-emerald-500 shadow-md">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#8e8e93]">17:30</span>
                      <span className="text-[0.7rem] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500 border border-emerald-500/10">
                        WIN
                      </span>
                    </div>
                    <div className="text-2xl font-black text-white flex items-baseline gap-1.5">
                      2-1{" "}
                      <span className="text-[0.9rem] text-[#8e8e93] font-normal">
                        sets
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-white/5 px-2 py-0.5 rounded-full text-[10px] text-white/70 border border-white/5">
                        Match
                      </span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "players" && (
                <>
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
                </>
              )}

              {activeTab === "insights" && (
                <>
                  <h4 className="text-[0.9rem] font-bold text-white mb-1">
                    Insights
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-[#1c1c1e] rounded-[14px] p-3 text-center border border-white/5">
                      <span className="block text-xl font-black text-blue-400">
                        72%
                      </span>
                      <span className="text-[0.65rem] text-[#8e8e93] uppercase tracking-wider font-bold">
                        Win Rate
                      </span>
                    </div>
                    <div className="bg-[#1c1c1e] rounded-[14px] p-3 text-center border border-white/5">
                      <span className="block text-xl font-black text-blue-400">
                        14
                      </span>
                      <span className="text-[0.65rem] text-[#8e8e93] uppercase tracking-wider font-bold">
                        Matches
                      </span>
                    </div>
                  </div>
                  <div className="h-20 flex items-end justify-between gap-1.5 p-2.5 bg-white/[0.03] rounded-[14px] mt-2 border border-white/5">
                    {[40, 70, 55, 90, 65].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Nav */}
        <div className="h-[60px] bg-[#1c1c1e]/95 backdrop-blur-xl flex justify-around items-center border-t border-white/10 pb-1 z-10 px-2">
          <NavItem
            active={activeTab === "home"}
            icon={<HomeIcon className="w-[1.1rem] h-[1.1rem]" />}
            label="Home"
            onClick={() => setActiveTab("home")}
          />
          <NavItem
            active={activeTab === "history"}
            icon={<CalendarIcon className="w-[1.1rem] h-[1.1rem]" />}
            label="History"
            onClick={() => setActiveTab("history")}
          />
          <NavItem
            active={activeTab === "players"}
            icon={<UsersIcon className="w-[1.1rem] h-[1.1rem]" />}
            label="Players"
            onClick={() => setActiveTab("players")}
          />
          <NavItem
            active={activeTab === "insights"}
            icon={<TrendingUpIcon className="w-[1.1rem] h-[1.1rem]" />}
            label="Insights"
            onClick={() => setActiveTab("insights")}
          />
        </div>
      </div>
    </motion.div>
  );
};
