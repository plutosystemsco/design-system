<script lang="ts">
  import { DARK, FACES, LIGHT } from "../round-two.ts";
  import IconKey, {
    KEY_APPS,
    type KeySize,
    type KeyVariant,
  } from "./icon-key.svelte";

  // One round-two style of question G as people meet it: the eight apps at
  // 64 px in a launcher of two rows of four, one app at each of the four
  // sizes, then 16 px in a browser's tabs and a dock strip. Drawn on round
  // two's warm canvas or warm graphite (round-two.ts); it sits inside a
  // Ground whose colours the page sets to match.
  let {
    variant,
    theme = "light",
    mono = false,
    focus = "docs",
  }: {
    variant: KeyVariant;
    theme?: "light" | "dark";
    /** G8's mono form, drawn in place of the colour keys. */
    mono?: boolean;
    /** The app shown at every size. */
    focus?: string;
  } = $props();

  const dark = $derived(theme === "dark");
  const one = $derived(KEY_APPS.find((a) => a.id === focus) ?? KEY_APPS[0]);
  const SIZES: KeySize[] = [64, 48, 32, 16];
  const form = $derived(mono ? `${variant} mono` : variant);

  const tab = $derived(dark ? DARK.raised : LIGHT.raised);
  const bar = $derived(dark ? DARK.sunk : LIGHT.sunk);
  const line = $derived(dark ? DARK.hairline : LIGHT.hairline);
  const text = $derived(dark ? DARK.text : LIGHT.ink);
  const muted = $derived(dark ? DARK.muted : LIGHT.inkSoft);
</script>

<div
  class="set"
  style="--tab:{tab};--bar:{bar};--line:{line};--text:{text};--muted:{muted};--body:{FACES.body};--mono:{FACES.mono}"
>
  <section aria-label="Launcher, 64 px, {form} on {theme}">
    <p class="label">launcher · 64 px</p>
    <ul class="grid">
      {#each KEY_APPS as app (app.id)}
        <li>
          <IconKey {app} {variant} {theme} {mono} size={64} />
          <span class="name" aria-hidden="true">{app.name}</span>
        </li>
      {/each}
    </ul>
  </section>

  <section aria-label="{one.name} at four sizes, {form} on {theme}">
    <p class="label">{one.name.toLowerCase()} · 64 · 48 · 32 · 16</p>
    <ul class="sizes">
      {#each SIZES as size (size)}
        <li>
          <IconKey app={one} {variant} {theme} {mono} {size} />
          <span class="px" aria-hidden="true">{size}</span>
        </li>
      {/each}
    </ul>
  </section>

  <section aria-label="Tabs and dock, 16 px, {form} on {theme}">
    <p class="label">tabs and dock · 16 px</p>
    <ul class="tabs">
      {#each KEY_APPS.slice(0, 4) as app, i (app.id)}
        <li class:active={i === 0}>
          <IconKey {app} {variant} {theme} {mono} size={16} />
          <span aria-hidden="true">{app.name}</span>
        </li>
      {/each}
    </ul>
    <ul class="strip">
      {#each KEY_APPS as app (app.id)}
        <li><IconKey {app} {variant} {theme} {mono} size={16} /></li>
      {/each}
    </ul>
  </section>
</div>

<style>
  .set {
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding: 28px;
    font-family: var(--body);
    color: var(--text);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .label {
    margin: 0 0 12px;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--muted);
  }
  /* The launcher sits straight on the canvas: the keys meet the ground the
     brief names, not a white panel. */
  .grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px 8px;
    padding: 4px 0;
  }
  .grid li {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }
  .name {
    font-size: 13px;
    line-height: 1.2;
  }
  .sizes {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 24px;
  }
  .sizes li {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .px {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
  }
  /* A browser's tab strip: the active tab is raised, the rest sit on the
     sunk bar. */
  .tabs {
    display: flex;
    gap: 2px;
    padding: 6px 6px 0;
    margin-bottom: 14px;
    overflow: hidden;
    background: var(--bar);
    border: 1px solid var(--line);
    border-radius: 8px;
  }
  .tabs li {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    padding: 7px 14px 9px 10px;
    font-size: 13px;
    color: var(--muted);
    border-radius: 6px 6px 0 0;
  }
  .tabs li.active {
    color: var(--text);
    background: var(--tab);
  }
  .strip {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 8px 10px;
    background: var(--bar);
    border: 1px solid var(--line);
    border-radius: 8px;
  }
  @media (max-width: 480px) {
    .set {
      padding: 16px;
    }
    .grid {
      gap: 16px 2px;
    }
    .sizes {
      gap: 16px;
    }
    .tabs li {
      padding: 7px 10px 9px 8px;
    }
    .tabs li:nth-child(n + 4) {
      display: none;
    }
  }
</style>
