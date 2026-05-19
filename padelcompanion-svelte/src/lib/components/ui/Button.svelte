<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "$lib/shared/utils";

  type Variant = "primary" | "secondary" | "accent" | "ghost";
  type Size = "sm" | "md" | "lg";

  interface Props {
    href?: string;
    variant?: Variant;
    size?: Size;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    onclick?: (e: MouseEvent) => void;
    class?: string;
    children: Snippet;
    target?: string;
    rel?: string;
  }

  let {
    href,
    variant = "primary",
    size = "md",
    type = "button",
    disabled = false,
    onclick,
    class: klass = "",
    children,
    target,
    rel,
  }: Props = $props();

  const base = "inline-flex items-center justify-center rounded-full font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<Variant, string> = {
    primary: "bg-foreground text-background hover:bg-foreground/90 shadow-lg hover-glow",
    secondary: "bg-card hover:bg-popover border border-border text-foreground shadow-md",
    accent: "bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20",
    ghost: "bg-transparent hover:bg-white/5 text-foreground",
  };

  const sizes: Record<Size, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  let cls = $derived(cn(base, variants[variant], sizes[size], klass));
</script>

{#if href}
  <a {href} class={cls} {target} {rel}>{@render children()}</a>
{:else}
  <button {type} {disabled} {onclick} class={cls}>{@render children()}</button>
{/if}
