<script lang="ts">
  import type { Look } from "../look.ts";
  import Mark from "./mark.svelte";

  // One shape candidate on paper: actions at 52 and 38 px, a chip row, an
  // input, a card with a title, a toggle and an avatar. Everything is live,
  // so the shape can be felt as well as seen.
  let { look, label }: { look: Look; label: string } = $props();

  const p = $derived(look.palette);
  const s = $derived(look.shape);
  const round = $derived(s.action === "999px");
  const avatar = $derived(round ? "50%" : s.card);
  const knob = $derived(round ? "50%" : `max(1px, calc(${s.action} - 3px))`);

  const CHIPS = ["All", "Docs", "Sheets", "Mail", "Shared with me"];
  let chip = $state("Docs");
  let agents = $state(true);
  let query = $state("renewal terms");
</script>

<figure
  class="set"
  aria-label={label}
  style="
    --paper:{p.paper};--raised:{p.raised};--ink:{p.ink};--soft:{p.inkSoft};
    --blue:{p.blueText};--fill:{p.blue};--green:{p.green};
    --fd:{look.type.display};--fb:{look.type.body};--fm:{look.type
    .mono};--dw:{look.type.displayWeight};
    --ra:{s.action};--rc:{s.card};--ri:{s.input};--rav:{avatar};--rk:{knob};
  "
>
  <div class="col">
    <div class="group">
      <p class="cap">actions · 52 and 38 px</p>
      <div class="row">
        <button type="button" class="btn primary">Share folder</button>
        <button type="button" class="btn secondary">Preview</button>
      </div>
      <div class="row">
        <button type="button" class="btn primary small">Save</button>
        <button type="button" class="btn secondary small">Cancel</button>
        <button type="button" class="btn ghost small">Undo</button>
      </div>
    </div>

    <div class="group">
      <p class="cap">chips</p>
      <div class="row chips" role="group" aria-label="Filter by product">
        {#each CHIPS as c (c)}
          <button
            type="button"
            class="chip"
            aria-pressed={chip === c}
            onclick={() => (chip = c)}>{c}</button
          >
        {/each}
      </div>
    </div>

    <div class="group">
      <label class="cap" for="q-{s.id}">input</label>
      <div class="field">
        <svg viewBox="0 0 20 20" aria-hidden="true"
          ><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg
        >
        <input
          id="q-{s.id}"
          type="search"
          bind:value={query}
          placeholder="Search every file"
        />
        <kbd>/</kbd>
      </div>
    </div>

    <div class="group">
      <p class="cap">toggle</p>
      <button
        type="button"
        class="toggle"
        role="switch"
        aria-checked={agents}
        onclick={() => (agents = !agents)}
      >
        <span class="track"><span class="knob"></span></span>
        Agents may search this folder
      </button>
    </div>
  </div>

  <article class="card">
    <header class="card-head">
      <Mark colours={[p.blue, p.red, p.yellow, p.green]} class="card-mark" />
      <span>Docs · /contracts</span>
    </header>
    <h3 class="card-title">Acme renewal, 2026</h3>
    <p class="card-body">
      Renews on 1 March unless either side gives 60 days' notice. Price rises 4%
      a year, capped at CPI.
    </p>
    <dl class="card-meta">
      <div>
        <dt>Owner</dt>
        <dd>Legal</dd>
      </div>
      <div>
        <dt>Visible to</dt>
        <dd>3 people, 1 agent</dd>
      </div>
    </dl>
    <footer class="card-foot">
      <span class="avatars">
        <span class="avatar" style="background:{p.blue}">AM</span>
        <span class="avatar" style="background:{p.greenText}">JK</span>
        <span class="avatar agent" title="renewals agent">
          <Mark
            colours={[p.raised, p.raised, p.raised, p.raised]}
            dot={0.22}
            gap={0.06}
          />
        </span>
      </span>
      <button type="button" class="btn secondary small">Open</button>
    </footer>
  </article>
</figure>

<style>
  .set {
    margin: 0;
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: clamp(24px, 4vw, 56px);
    align-items: start;
    padding: clamp(20px, 4vw, 48px);
    background: var(--paper);
    color: var(--ink);
    border: 1px solid #14161c1a;
    border-radius: 12px;
    font-family: var(--fb);
  }
  @media (max-width: 860px) {
    .set {
      grid-template-columns: 1fr;
    }
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 28px;
    min-width: 0;
  }
  .group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .cap {
    font-family: var(--fm);
    font-size: 12px;
    color: var(--soft);
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    height: 52px;
    padding: 0 24px;
    border-radius: var(--ra);
    font-family: var(--fb);
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition:
      transform 160ms cubic-bezier(0.2, 0.7, 0.2, 1),
      background-color 160ms;
  }
  .btn:active,
  .chip:active,
  .toggle:active .track {
    transform: scale(0.98);
  }
  .btn.small {
    height: 38px;
    padding: 0 16px;
    font-size: 14px;
  }
  .primary {
    background: var(--blue);
    color: var(--raised);
  }
  .primary:hover {
    background: color-mix(in oklab, var(--blue) 88%, black);
  }
  .secondary {
    background: var(--raised);
    color: var(--ink);
    border: 1px solid #14161c33;
  }
  .secondary:hover,
  .ghost:hover {
    background: #14161c0d;
  }
  .ghost {
    color: var(--ink);
  }
  .chip {
    height: 34px;
    padding: 0 14px;
    border-radius: var(--ra);
    border: 1px solid #14161c33;
    background: var(--raised);
    font-size: 14px;
    color: var(--ink);
    cursor: pointer;
  }
  .chip[aria-pressed="true"] {
    background: var(--ink);
    border-color: var(--ink);
    color: var(--paper);
  }
  .field {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 48px;
    padding: 0 8px 0 14px;
    border: 1px solid #7c808b;
    border-radius: var(--ri);
    background: var(--raised);
    max-width: 28rem;
  }
  .field:focus-within {
    outline: 2px solid var(--blue);
    outline-offset: 1px;
  }
  .field svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: var(--soft);
    stroke-width: 1.6;
    stroke-linecap: round;
  }
  .field input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    font: inherit;
    font-size: 16px;
    color: var(--ink);
  }
  .field input::placeholder {
    color: var(--soft);
  }
  kbd {
    display: grid;
    place-items: center;
    min-width: 26px;
    height: 26px;
    border: 1px solid #14161c24;
    border-radius: min(var(--ri), 6px);
    font-family: var(--fm);
    font-size: 12px;
    color: var(--soft);
  }
  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
    color: var(--ink);
    cursor: pointer;
    align-self: flex-start;
    border-radius: 6px;
  }
  .track {
    position: relative;
    width: 44px;
    height: 26px;
    border-radius: var(--ra);
    background: #14161c33;
    transition:
      background-color 200ms,
      transform 160ms;
  }
  .knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    border-radius: var(--rk);
    background: var(--raised);
    box-shadow: 0 1px 2px #14161c33;
    transition: transform 200ms cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  .toggle[aria-checked="true"] .track {
    background: var(--blue);
  }
  .toggle[aria-checked="true"] .knob {
    transform: translateX(18px);
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 24px;
    background: var(--raised);
    border: 1px solid #14161c1a;
    border-radius: var(--rc);
    box-shadow: 0 1px 0 #14161c0a;
  }
  .card-head {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--fm);
    font-size: 12px;
    color: var(--soft);
  }
  .card-head :global(.card-mark) {
    font-size: 14px;
  }
  .card-title {
    font-family: var(--fd);
    font-weight: var(--dw);
    font-size: 26px;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }
  .card-body {
    font-size: 15px;
    line-height: 1.6;
  }
  .card-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 14px 0;
    border-block: 1px solid #14161c1a;
  }
  .card-meta dt {
    font-family: var(--fm);
    font-size: 12px;
    color: var(--soft);
  }
  .card-meta dd {
    margin-top: 2px;
    font-size: 14px;
    font-weight: 500;
  }
  .card-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .avatars {
    display: flex;
  }
  .avatar {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: var(--rav);
    border: 2px solid var(--raised);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  .avatar + .avatar {
    margin-left: -8px;
  }
  .avatar.agent {
    background: var(--ink);
    font-size: 22px;
  }
  .btn:focus-visible,
  .chip:focus-visible,
  .toggle:focus-visible {
    outline: 2px solid var(--blue);
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    .set * {
      transition: none !important;
    }
  }
</style>
