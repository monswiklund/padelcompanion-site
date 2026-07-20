# Padel Companion Sizing & Spacing Style Guide

This style guide documents the unified design system tokens, utility mappings, and layout scales established for the Padel Companion platform. These standards prevent ad-hoc styling, ensure visual consistency, and preserve the responsive Obsidian aesthetics.

---

## 1. Border Radius Scale (`border-radius`)

We have unified the card and element curves to prevent arbitrary values (such as `rounded-[2.5rem]` or `rounded-[3rem]`).

| Class          | CSS Variable / Value            | Intended Use Case                                                     |
| :------------- | :------------------------------ | :-------------------------------------------------------------------- |
| `rounded-sm`   | `--radius-sm` (4px)             | Badges, micro-indicators, tiny toggles.                               |
| `rounded-md`   | `--radius-md` (8px)             | Small icons, toggle indicators, utility labels.                       |
| `rounded-lg`   | `--radius-lg` (12px)            | Small buttons, small action cards, tags.                              |
| `rounded-xl`   | `--radius-xl` (16px)            | Standard inputs, list items, dropdown lists.                          |
| `rounded-2xl`  | `--radius-2xl` (24px)           | Medium cards, textareas, grid-item containers.                        |
| `rounded-3xl`  | `--radius-3xl` (32px)           | Large components, bento grid subsets.                                 |
| `rounded-card` | `--radius-card` (40px / 2.5rem) | Primary Hero elements, Main Bento cards, and Central dialog wrappers. |

### Svelte Code Reference:

```svelte
<!-- Example of standard GlassCard application -->
<GlassCard size="md">
	<h3 class="text-lg">Premium Bento Card</h3>
</GlassCard>
```

---

## 2. Responsive Container Padding Systems

Instead of hardcoded paddings like `p-10 md:p-12`, cards and sections are mapped dynamically through three primary presets.

| Preset Size       | Padding Utility | Intended Use Case                                    |
| :---------------- | :-------------- | :--------------------------------------------------- |
| **Small (`sm`)**  | `p-4`           | Micro cards, toast indicators, alert boxes.          |
| **Medium (`md`)** | `p-6 md:p-8`    | Primary bento panels, main lists, standard modals.   |
| **Large (`lg`)**  | `p-8 md:p-12`   | Main page banners, hero CTA sections, landing pages. |

---

## 3. Form Input & Button Sizing Precision

To ensure vertical precision and perfect alignments when buttons and inputs are grouped inline, height and padding scales are paired systematically.

### Button Sizes

- **Small (`sm`)**: `px-4 py-2 text-xs` (Height: ~36px) — Used for nested inline actions.
- **Medium (`md`)**: `px-6 py-3 text-sm` (Height: ~42px) — Standard CTA/utility button.
- **Large (`lg`)**: `px-8 py-4 text-base` (Height: ~50px) — Hero & Marketing actions.

### Input Sizing Rule

- Use `py-2.5 px-4 rounded-xl text-sm` for standard inputs.
- This matches the height of our medium (`md`) buttons perfectly, yielding a seamless, double-aligned input row.

---

## 4. Typography Scale

Custom sizing tokens are loaded inside the `@theme` block of `src/routes/layout.css` to prevent raw pixel font-sizes like `text-[0.95rem]` or `text-[1.35rem]`.

| Class               | Equivalent Size | Intended Use Case                               |
| :------------------ | :-------------- | :---------------------------------------------- |
| `text-xs`           | 12px            | Labels, secondary indicators, tips.             |
| `text-sm`           | 14px            | General body text, input values, table headers. |
| `text-base`         | 16px            | Primary interface items, description blocks.    |
| `text-lg`           | 18px            | Sub-headings, active highlights, card titles.   |
| `text-xl`           | 20px            | Section headers, intermediate callouts.         |
| `text-2xl`          | 24px            | Small hero headers, primary card headers.       |
| `text-3xl`          | 30px            | Standard page headers, modal titles.            |
| `text-4xl` to `9xl` | 36px to 128px   | Big stats, massive marketing headings.          |

---

## 5. Icons Scaling Tokens

Standard icons scale systematically using Tailwind v4 custom property variables. Avoid arbitrary `size={x}` values when standard sizes are preferred.

- **Extra Small (`--icon-xs`)**: `0.75rem` (12px)
- **Small (`--icon-sm`)**: `1rem` (16px)
- **Medium (`--icon-md`)**: `1.25rem` (20px)
- **Large (`--icon-lg`)**: `1.5rem` (24px)

---

## 6. Layout Spacing Grid & Gaps

Maintain structural clean-lines using consistent Tailwind layout gaps:

- **Tight Components**: `gap-2` (8px) or `gap-3` (12px) — e.g., badges inside titles.
- **Sibling Elements**: `gap-4` (16px) — e.g., adjacent button groups or cards.
- **Section Grids**: `gap-6` (24px) or `gap-8` (32px) — e.g., main bento grids or responsive grid layouts.

---

## 7. Implementation Best Practices

1. **Avoid Magic Numbers**: Never write `rounded-[1.85rem]`, `p-[1.12rem]`, or `text-[0.95rem]`. Map to the nearest standard class.
2. **Prioritize Svelte Components**: Use standard structural wrappers (such as `<GlassCard>` and `<Button>`) instead of crafting raw HTML nodes with duplicate styling.
3. **Respect Responsive Flow**: Always check visual structure on both small screens (`sm`) and large desktops (`md`/`lg`). Use responsive prefixes (e.g. `p-6 md:p-8`) for all layout containers.
