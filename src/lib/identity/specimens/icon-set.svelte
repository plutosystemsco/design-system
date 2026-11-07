<script lang="ts">
  import { TODAY, TYPE } from "../look.ts";
  import IconApp from "./icon-app.svelte";
  import { APPS } from "./icon-glyphs.ts";

  // One style of question G as people meet it: an app launcher of eight
  // icons at 64 px with their names, a dock at 32 px and a tab strip at
  // 16 px. Sits inside a Ground, whose colours it inherits.
  let {
    variant,
    ground = "paper",
  }: {
    variant: "G1" | "G2" | "G3" | "G4";
    ground?: "paper" | "stage";
  } = $props();

  const p = TODAY;
  const dark = $derived(ground === "stage");
  const panel = $derived(dark ? p.stageRaised : p.raised);
  const panelEdge = $derived(dark ? p.stageLineStrong : "#14161C1A");
</script>

<div
  class="set"
  style="--panel:{panel};--panel-edge:{panelEdge};--body:{TYPE.D5
    .body};--mono:{TYPE.D5.mono}"
>
  <section class="launcher" aria-label="Launcher, 64 px, {variant} on {ground}">
    <p class="label">launcher · 64 px</p>
    <ul class="grid">
      {#each APPS as app (app.id)}
        <li>
          <IconApp {app} {variant} {ground} size={64} />
          <span class="name">{app.name}</span>
        </li>
      {/each}
    </ul>
  </section>

  <div class="rows">
    <section aria-label="Dock, 32 px, {variant} on {ground}">
      <p class="label">dock · 32 px</p>
      <ul class="dock">
        {#each APPS as app (app.id)}
          <li>
            <IconApp {app} {variant} {ground} size={32} label={app.name} />
          </li>
        {/each}
      </ul>
    </section>
    <section aria-label="Tab strip, 16 px, {variant} on {ground}">
      <p class="label">tabs · 16 px</p>
      <ul class="tabs">
        {#each APPS.slice(0, 4) as app (app.id)}
          <li>
            <IconApp {app} {variant} {ground} size={16} />
            <span>{app.name}</span>
          </li>
        {/each}
      </ul>
      <ul class="strip">
        {#each APPS as app (app.id)}
          <li>
            <IconApp {app} {variant} {ground} size={16} label={app.name} />
          </li>
        {/each}
      </ul>
    </section>
  </div>
</div>

<style>
  .set {
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding: 28px;
    font-family: var(--body);
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
    color: var(--g-muted);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px 8px;
    padding: 24px 12px 20px;
    background: var(--panel);
    border: 1px solid var(--panel-edge);
    border-radius: 16px;
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
    color: var(--g-text);
  }
  .rows {
    display: grid;
    gap: 24px;
  }
  .dock {
    display: inline-flex;
    flex-wrap: wrap;
    gap: clamp(4px, 1.4vw, 10px);
    padding: 8px;
    background: var(--panel);
    border: 1px solid var(--panel-edge);
    border-radius: 14px;
  }
  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--g-line);
  }
  .tabs li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px 9px;
    font-size: 13px;
    color: var(--g-muted);
    border-right: 1px solid var(--g-line);
  }
  .tabs li:first-child {
    color: var(--g-text);
    background: var(--panel);
    border-radius: 8px 8px 0 0;
  }
  .strip {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  @media (max-width: 480px) {
    .set {
      padding: 16px;
    }
    .grid {
      padding: 18px 4px 16px;
      gap: 16px 2px;
    }
    .dock {
      gap: 4px;
      padding: 6px;
    }
    .tabs li:nth-child(n + 4) {
      display: none;
    }
  }
</style>
