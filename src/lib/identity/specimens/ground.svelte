<script lang="ts">
  import type { Snippet } from "svelte";
  import { TODAY } from "../look.ts";

  // A specimen's ground: a fixed paper or stage panel that looks the same in
  // either page theme, so the owner judges the mark on the ground it will
  // meet, not on the exhibit's own. A caption names what is shown.
  let {
    ground = "paper",
    caption,
    class: className = "",
    style = "",
    children,
  }: {
    ground?: "paper" | "stage";
    caption?: string;
    class?: string;
    style?: string;
    children: Snippet;
  } = $props();

  const p = TODAY;
</script>

<figure
  class="ground ground-{ground} {className}"
  style="--g-bg:{ground === 'paper' ? p.paper : p.stage};--g-text:{ground ===
  'paper'
    ? p.ink
    : p.stageText};--g-muted:{ground === 'paper'
    ? p.inkSoft
    : p.stageMuted};--g-line:{ground === 'paper'
    ? '#14161C1A'
    : p.stageLine};{style}"
>
  {#if caption}
    <figcaption class="cap">{caption}</figcaption>
  {/if}
  <div class="body">{@render children()}</div>
</figure>

<style>
  .ground {
    margin: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: var(--g-bg);
    color: var(--g-text);
    border: 1px solid var(--g-line);
    border-radius: 8px;
    overflow: hidden;
  }
  /* On the dark page a stage panel needs its own edge to read as a panel. */
  .ground-stage {
    border-color: #f7f7f424;
  }
  .ground-paper {
    border-color: #14161c24;
  }
  .cap {
    padding: 12px 16px;
    border-bottom: 1px solid var(--g-line);
    font-family: "JetBrains Mono Variable", ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: lowercase;
    color: var(--g-muted);
  }
  .body {
    flex: 1;
    min-width: 0;
  }
</style>
