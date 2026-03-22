/**
 * Shared constants for the tournament system
 */

export const DIVISION_COLORS = [
  /* 0: A - Ljusblå */   { bg: "bg-sky-500/10", border: "border-sky-500/20", text: "text-sky-600 dark:text-sky-400", badge: "bg-sky-500", headerBg: "bg-sky-500/5", glow: "shadow-sky-500/20" },
  /* 1: B - Ljusgrön */  { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-500", headerBg: "bg-emerald-500/5", glow: "shadow-emerald-500/20" },
  /* 2: C - Gul */       { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-600 dark:text-yellow-400", badge: "bg-yellow-500", headerBg: "bg-yellow-500/5", glow: "shadow-yellow-500/20" },
  /* 3: D - Rosa */      { bg: "bg-pink-500/10", border: "border-pink-500/20", text: "text-pink-600 dark:text-pink-400", badge: "bg-pink-500", headerBg: "bg-pink-500/5", glow: "shadow-pink-500/20" },
  /* 4: E - Röd */       { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-600 dark:text-red-500", badge: "bg-red-500", headerBg: "bg-red-500/5", glow: "shadow-red-500/20" },
  /* 5: f - Mörkblå */   { bg: "bg-blue-700/10", border: "border-blue-700/20", text: "text-blue-700 dark:text-blue-400", badge: "bg-blue-700", headerBg: "bg-blue-700/5", glow: "shadow-blue-700/20" },
  /* 6: G - Mörkgrön */  { bg: "bg-emerald-800/10", border: "border-emerald-800/20", text: "text-emerald-700 dark:text-emerald-500", badge: "bg-emerald-800", headerBg: "bg-emerald-800/5", glow: "shadow-emerald-800/20" },
  /* 7: H - Orange */    { bg: "bg-orange-600/10", border: "border-orange-600/20", text: "text-orange-600 dark:text-orange-400", badge: "bg-orange-600", headerBg: "bg-orange-600/5", glow: "shadow-orange-600/20" },
  /* 8: I - Lila */      { bg: "bg-purple-600/10", border: "border-purple-600/20", text: "text-purple-600 dark:text-purple-400", badge: "bg-purple-600", headerBg: "bg-purple-600/5", glow: "shadow-purple-600/20" },
];

export const getDivisionColor = (divisions: any[], divisionIdOrName: string | null | undefined) => {
  if (!divisionIdOrName || !divisions) return DIVISION_COLORS[0];
  
  // Try finding by ID first, then by name
  let index = divisions.findIndex(d => d.id === divisionIdOrName);
  if (index === -1) {
    index = divisions.findIndex(d => d.name === divisionIdOrName);
  }
  
  if (index === -1) return DIVISION_COLORS[0];
  return DIVISION_COLORS[index % DIVISION_COLORS.length];
};
