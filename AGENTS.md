# AGENTS.md instructions

Comments in code always in english.
SPEC.md Always in english.

## Modern Web Guidance

@./.agents/skills/modern-web-guidance/SKILL.md

ACTIVE for every HTML/CSS/client-side JS task.
Rule: run `npx -y modern-web-guidance@latest search "<query>" --skill-version 2026_05_16-c5e7870` before implementing web UI/layout/client-side behavior, then retrieve relevant guides with `npx -y modern-web-guidance@latest retrieve "<id>"`.
