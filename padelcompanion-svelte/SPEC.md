# §G
Bits UI design system ∀ surfaces (tournament setup, active views, landing, support). Replace custom primitives, fix a11y, preserve glassmorphism.

# §C
- Svelte 5 runes
- Tailwind CSS v4
- Preserve existing glassmorphism design
- bits-ui headless primitives

# §I
- bits-ui
- motion
- npm

# §V
V1: ∀ modal → bits-ui Dialog/AlertDialog
V2: ∀ select → bits-ui Select
V3: ∀ tab → bits-ui ToggleGroup
V4: ∀ component → preserve current visual styles exactly
V5: ∀ toggle switch → bits-ui Switch
V6: ∀ primary CTA button → shared Button primitive w/ token class
V7: ∀ native <select> (incl /support, bracket Score) → bits-ui Select
V8: ∀ role="dialog" → Dialog.Root (closes V1 gap)

# §T
id|status|task|cites
T1|x|install bits-ui & motion|I
T2|x|port modals.ts to AlertDialog|V1
T3|x|port FullScheduleModal to Dialog|V1
T4|x|port HelpButton & PlayerMatchHistory to Dialog|V1
T5|x|port TournamentConfig selects to Select|V2
T6|x|port PreferredPartners selects to Select|V2
T7|x|port leaderboard & list tabs to ToggleGroup|V3
T8|x|port settings dropdown to Popover|.
T9|x|port zoom slider to Slider|.
T10|x|port config tooltips to Tooltip|.
T11|x|backprop: HistorySection open-by-code modal → Dialog|V1,V8
T12|x|backprop: PlayerList import modal → Dialog|V1,V8
T13|x|TournamentConfig toggle buttons (TeamMex, StrictStrategy) → Switch|V5
T14|x|/support form selects → Select|V7
T15|x|bracket setup Score <select> → Select (vacuous; no native select in repo)|V7
T16|x|landing hero CTAs → Button primitive|V6
T17|x|"Zero setup" Start Web Tournament CTA → Button (vacuous; CTA not in current code)|V6
T18|x|fix state_referenced_locally warnings (PlayerList:49, TournamentIdentity:20,21)|.
T19|x|fix self-closing div warnings (+page.svelte, TournamentActiveView, PlayoffStandings)|.
T20|x|fix /layout autofocus + /support label-control a11y|.

# §B
id|date|cause|fix
B1|2026-05-19|HistorySection modal raw div role=dialog, V1 not enforced|V8
B2|2026-05-19|PlayerList import modal raw div role=dialog, V1 not enforced|V8
