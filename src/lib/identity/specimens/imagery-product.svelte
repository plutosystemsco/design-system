<script lang="ts">
  import type { Look } from "../look.ts";
  import Mark from "./mark.svelte";

  // M1, product truth: a cropped, annotated product screen. The screen is
  // drawn in HTML for this board; a real capture replaces it.
  let { look, label }: { look: Look; label: string } = $props();
  const p = $derived(look.palette);

  const RESULTS = [
    {
      app: "Docs",
      colour: "blue",
      path: "/contracts/acme-2026.pdf",
      before: "…the agreement ",
      hit: "renews",
      after: " on 1 March unless either party gives 60 days' notice…",
      seen: "Legal · 3 people, 1 agent",
    },
    {
      app: "Sheets",
      colour: "green",
      path: "/contracts/renewals-2026.sheet",
      before: "Row 14: Northwind, ",
      hit: "renewal",
      after: " due 30 June, owner J. Kim",
      seen: "Sales ops · 12 people",
    },
    {
      app: "Mail",
      colour: "red",
      path: "Re: Northwind MSA terms",
      before: "…happy to agree the ",
      hit: "renewal",
      after: " terms if the cap stays at CPI…",
      seen: "You and 2 others",
    },
  ] as const;
</script>

<figure
  class="m1"
  aria-label={label}
  style="
    --paper:{p.paper};--raised:{p.raised};--ink:{p.ink};--soft:{p.inkSoft};
    --blue:{p.blueText};--red:{p.redText};--green:{p.greenText};--hl:{p.yellow}40;
    --fd:{look.type.display};--fb:{look.type.body};--fm:{look.type
    .mono};--dw:{look.type.displayWeight};
  "
>
  <div class="crop">
    <div class="screen" aria-hidden="true">
      <div class="top">
        <Mark colours={[p.blue, p.red, p.yellow, p.green]} class="app-mark" />
        <span class="app-name">Search</span>
        <div class="query">
          <svg viewBox="0 0 20 20"
            ><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg
          >
          <span>renewal terms</span>
          <span class="scope">in /contracts, mail</span>
          <span class="pin n1">1</span>
        </div>
        <span class="me">CG</span>
      </div>
      <div class="body">
        <nav class="side">
          <span class="on">All results <b>4</b></span>
          <span>Docs <b>1</b></span>
          <span>Sheets <b>1</b></span>
          <span>Mail <b>1</b></span>
          <span>Agents</span>
        </nav>
        <div class="results">
          <p class="summary">3 results in 41 ms · searched as Clay Gendron</p>
          {#each RESULTS as r (r.path)}
            <div class="result">
              <span
                class="badge"
                style="color:var(--{r.colour});border-color:var(--{r.colour})"
                >{r.app}</span
              >
              <div>
                <p class="path">{r.path}</p>
                <p class="snippet">{r.before}<mark>{r.hit}</mark>{r.after}</p>
                <p class="seen">
                  {#if r.app === "Docs"}<span class="pin n2">2</span>{/if}
                  <svg viewBox="0 0 16 16"
                    ><circle cx="8" cy="6" r="2.6" /><path
                      d="M3 13.5c.8-2.4 2.8-3.6 5-3.6s4.2 1.2 5 3.6"
                    /></svg
                  >
                  Visible to {r.seen}
                </p>
              </div>
            </div>
          {/each}
          <div class="result hidden-row">
            <span class="badge lock">
              <svg viewBox="0 0 20 20"
                ><rect x="4" y="9" width="12" height="8" rx="2" /><path
                  d="M7 9V6.5a3 3 0 0 1 6 0V9"
                /></svg
              >
            </span>
            <p>
              1 more file matches. Policy <code>finance-only</code> hides it from
              you.
            </p>
            <span class="pin n3">3</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <figcaption class="notes">
    <ol>
      <li>
        <span>1</span>One query searches docs, sheets and mail, and says whose
        eyes it searched with.
      </li>
      <li><span>2</span>Every result shows who else can see it.</li>
      <li><span>3</span>What policy hides is counted, never shown.</li>
    </ol>
    <p class="credit">
      Pluto Search, cropped at 115%. Drawn for this board; the real screen
      replaces it.
    </p>
  </figcaption>
</figure>

<style>
  .m1 {
    margin: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 280px;
    gap: clamp(24px, 4vw, 48px);
    align-items: center;
    padding: clamp(20px, 4vw, 48px);
    background: var(--paper);
    color: var(--ink);
    border: 1px solid #14161c1a;
    border-radius: 12px;
    font-family: var(--fb);
  }
  @media (max-width: 900px) {
    .m1 {
      grid-template-columns: 1fr;
    }
  }
  .crop {
    position: relative;
    height: 580px;
    overflow: hidden;
    border-radius: 10px;
    background: #e9e9e4;
    mask-image:
      linear-gradient(90deg, black 78%, transparent),
      linear-gradient(black 93%, transparent);
    mask-composite: intersect;
  }
  .screen {
    position: absolute;
    left: 28px;
    top: 28px;
    width: 980px;
    transform: scale(1.15);
    transform-origin: 0 0;
    background: var(--raised);
    border: 1px solid #14161c24;
    border-radius: 10px;
    box-shadow: 0 30px 60px -30px #14161c40;
    font-size: 13px;
  }
  @media (max-width: 640px) {
    .crop {
      height: 470px;
    }
    /* On a phone the crop moves in on the results. */
    .screen {
      left: -150px;
      transform: none;
    }
  }
  .top {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 52px;
    padding: 0 16px;
    border-bottom: 1px solid #14161c1a;
  }
  .top :global(.app-mark) {
    font-size: 15px;
  }
  .app-name {
    font-family: var(--fd);
    font-weight: var(--dw);
    font-size: 16px;
    letter-spacing: -0.02em;
    width: 120px;
  }
  .query {
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    width: 460px;
    height: 34px;
    padding: 0 12px;
    border: 1.5px solid var(--blue);
    border-radius: 999px;
  }
  .query svg,
  .seen svg,
  .lock svg {
    width: 15px;
    height: 15px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linecap: round;
  }
  .query svg {
    color: var(--soft);
  }
  .scope {
    margin-left: auto;
    font-family: var(--fm);
    font-size: 11px;
    color: var(--soft);
  }
  .me {
    margin-left: auto;
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--ink);
    color: var(--paper);
    font-size: 11px;
    font-weight: 600;
  }
  .body {
    display: grid;
    grid-template-columns: 170px 1fr;
  }
  .side {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 16px 12px;
    border-right: 1px solid #14161c1a;
  }
  .side span {
    display: flex;
    justify-content: space-between;
    padding: 6px 10px;
    border-radius: 6px;
    color: var(--soft);
  }
  .side b {
    font-weight: 500;
  }
  .side .on {
    background: #2456e614;
    color: var(--blue);
    font-weight: 500;
  }
  .results {
    padding: 14px 24px 20px;
  }
  .summary {
    font-family: var(--fm);
    font-size: 11px;
    color: var(--soft);
    margin-bottom: 6px;
  }
  .result {
    position: relative;
    display: flex;
    gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid #14161c12;
  }
  .badge {
    flex: none;
    display: grid;
    place-items: center;
    width: 56px;
    height: 22px;
    border: 1px solid;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 500;
  }
  .path {
    font-weight: 600;
    color: var(--ink);
  }
  .snippet {
    margin-top: 2px;
    color: var(--soft);
    max-width: 52ch;
  }
  mark {
    background: var(--hl);
    color: var(--ink);
    border-radius: 2px;
    padding: 0 1px;
  }
  .seen {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    font-size: 11.5px;
    color: var(--green);
  }
  .hidden-row {
    align-items: center;
    color: var(--soft);
    border-bottom: 0;
  }
  .lock {
    border-color: #14161c33;
    color: var(--soft);
  }
  code {
    font-family: var(--fm);
    font-size: 11px;
    padding: 1px 4px;
    background: #14161c0d;
    border-radius: 3px;
  }
  .pin {
    position: absolute;
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: var(--ink);
    color: var(--paper);
    font-family: var(--fm);
    font-size: 12px;
    font-weight: 500;
    box-shadow: 0 0 0 4px #ffffff;
  }
  /* Pins sit beside what they annotate. */
  .n1 {
    left: -13px;
    top: -13px;
  }
  .n2 {
    left: -44px;
    top: -4px;
  }
  .n3 {
    left: -44px;
    top: 12px;
  }
  .notes ol {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .notes li {
    display: flex;
    gap: 12px;
    font-size: 15px;
    line-height: 1.5;
  }
  .notes li span {
    flex: none;
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--ink);
    color: var(--paper);
    font-family: var(--fm);
    font-size: 12px;
  }
  .credit {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #14161c1a;
    font-family: var(--fm);
    font-size: 12px;
    line-height: 1.5;
    color: var(--soft);
  }
</style>
