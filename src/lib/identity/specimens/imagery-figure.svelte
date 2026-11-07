<script lang="ts">
  import type { Look } from "../look.ts";

  // M2, figures: an exact diagram with a number and a caption, in the
  // register of a good textbook. Drawn twice, wide and tall, so its text
  // stays readable on a phone.
  let { look, label }: { look: Look; label: string } = $props();
  const p = $derived(look.palette);

  const ASKERS = $derived([
    { name: "Docs", c: p.blue },
    { name: "Sheets", c: p.red },
    { name: "Mail", c: p.yellow },
    { name: "Agent: renewals", c: p.green },
  ]);
  const FILES = [
    { path: "/contracts/acme-2026.pdf", ok: true },
    { path: "/contracts/northwind-msa.docx", ok: true },
    { path: "/finance/forecast.xlsx", ok: false },
  ];
</script>

{#snippet kernel(x: number, y: number, w: number, h: number)}
  <rect {x} {y} width={w} height={h} rx="10" class="kbox" />
  <g transform="translate({x + 24} {y + 26})">
    <circle cx="7" cy="7" r="7" fill={p.blue} />
    <circle cx="25" cy="7" r="7" fill={p.red} />
    <circle cx="7" cy="25" r="7" fill={p.yellow} />
    <circle cx="25" cy="25" r="7" fill={p.green} />
  </g>
  <text x={x + 72} y={y + 40} class="k-title">Kernel</text>
  <text x={x + 24} y={y + 82} class="small">one policy, checked</text>
  <text x={x + 24} y={y + 100} class="small">on every read</text>
{/snippet}

{#snippet tick(x: number, y: number, ok: boolean)}
  {#if ok}
    <circle cx={x} cy={y} r="9" fill={p.greenText} />
    <path d="M{x - 4} {y}l3 3 5-6" class="mark-ok" />
  {:else}
    <circle cx={x} cy={y} r="9" fill={p.redText} />
    <path d="M{x - 3.5} {y - 3.5}l7 7m0-7l-7 7" class="mark-ok" />
  {/if}
{/snippet}

<figure
  class="m2"
  aria-label={label}
  style="--paper:{p.paper};--raised:{p.raised};--ink:{p.ink};--soft:{p.inkSoft};--red:{p.redText};--fd:{look
    .type.display};--fb:{look.type.body};--fm:{look.type.mono};--dw:{look.type
    .displayWeight}"
>
  <svg class="wide" viewBox="0 0 960 400" role="img" aria-labelledby="fig1-cap">
    <defs>
      <marker
        id="fig1-arrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0 0L10 5L0 10z" fill={p.ink} />
      </marker>
    </defs>
    <text x="40" y="34" class="part">a · requests</text>
    <text x="400" y="34" class="part">b · the check</text>
    <text x="680" y="34" class="part">c · what comes back</text>
    {#each ASKERS as a, i (a.name)}
      {@const y = 64 + i * 80}
      <rect x="40" {y} width="200" height="48" rx="8" class="node" />
      <circle cx="64" cy={y + 24} r="7" fill={a.c} />
      <text x="82" y={y + 29} class="label">{a.name}</text>
      <path
        d="M240 {y + 24} C 320 {y + 24}, 320 200, 396 200"
        class="wire"
        marker-end="url(#fig1-arrow)"
      />
    {/each}
    {@render kernel(400, 140, 200, 120)}
    {#each FILES as f, i (f.path)}
      {@const y = 96 + i * 104}
      <path
        d="M600 200 C 640 200, 640 {y + 24}, {f.ok ? 676 : 652} {y + 24}"
        class="wire"
        class:denied={!f.ok}
        marker-end={f.ok ? "url(#fig1-arrow)" : undefined}
      />
      {#if f.ok}
        <rect x="680" {y} width="240" height="48" rx="8" class="node" />
        <text x="700" y={y + 29} class="mono">{f.path}</text>
        {@render tick(920, y, true)}
      {:else}
        <line x1="656" y1={y + 10} x2="656" y2={y + 38} class="stop" />
        <rect x="680" {y} width="240" height="48" rx="8" class="node ghost" />
        <text x="700" y={y + 29} class="mono faint">{f.path}</text>
        {@render tick(920, y, false)}
        <text x="680" y={y + 72} class="small red"
          >withheld by finance-only; counted, not shown</text
        >
      {/if}
    {/each}
  </svg>

  <svg class="tall" viewBox="0 0 360 640" role="img" aria-labelledby="fig1-cap">
    <defs>
      <marker
        id="fig1-arrow-t"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0 0L10 5L0 10z" fill={p.ink} />
      </marker>
    </defs>
    <text x="12" y="22" class="part">a · requests</text>
    {#each ASKERS as a, i (a.name)}
      {@const x = 12 + (i % 2) * 172}
      {@const y = 36 + Math.floor(i / 2) * 60}
      <rect {x} {y} width="164" height="46" rx="8" class="node" />
      <circle cx={x + 22} cy={y + 23} r="7" fill={a.c} />
      <text x={x + 38} y={y + 28} class="label">{a.name}</text>
      <path
        d="M{x + 82} {y + 46} C {x + 82} 190, 180 180, 180 {218}"
        class="wire"
        marker-end="url(#fig1-arrow-t)"
      />
    {/each}
    <text x="12" y="212" class="part">b · the check</text>
    {@render kernel(80, 222, 200, 120)}
    <text x="12" y="388" class="part">c · what comes back</text>
    {#each FILES as f, i (f.path)}
      {@const y = 404 + i * 66}
      {#if f.ok}
        <rect x="12" {y} width="320" height="48" rx="8" class="node" />
        <text x="30" y={y + 29} class="mono">{f.path}</text>
        {@render tick(332, y, true)}
      {:else}
        <rect x="12" {y} width="320" height="48" rx="8" class="node ghost" />
        <text x="30" y={y + 29} class="mono faint">{f.path}</text>
        {@render tick(332, y, false)}
        <text x="12" y={y + 70} class="small red"
          >withheld by finance-only; counted, not shown</text
        >
      {/if}
    {/each}
  </svg>

  <figcaption id="fig1-cap">
    <p class="fig-title">Fig. 1 — one kernel, every request.</p>
    <p class="fig-text">
      Docs, Sheets, Mail and an agent ask for the same files (a). Each request
      passes the kernel, which applies one policy (b). Two files come back; the
      third is withheld and counted, so the asker knows something was hidden
      (c).
    </p>
  </figcaption>
</figure>

<style>
  .m2 {
    margin: 0;
    padding: clamp(20px, 4vw, 48px);
    background: var(--paper);
    color: var(--ink);
    border: 1px solid #14161c1a;
    border-radius: 12px;
    font-family: var(--fb);
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
  .tall {
    display: none;
    max-width: 420px;
    margin: 0 auto;
  }
  @media (max-width: 640px) {
    .wide {
      display: none;
    }
    .tall {
      display: block;
    }
  }
  .part {
    font-family: var(--fm);
    font-size: 12px;
    fill: var(--soft);
  }
  .node {
    fill: var(--raised);
    stroke: #14161c33;
  }
  .node.ghost {
    fill: none;
    stroke-dasharray: 4 4;
  }
  .kbox {
    fill: var(--ink);
  }
  .k-title {
    font-family: var(--fd);
    font-weight: var(--dw);
    font-size: 24px;
    letter-spacing: -0.02em;
    fill: var(--paper);
  }
  .kbox ~ .small {
    fill: #c9ccd3;
  }
  .label {
    font-size: 15px;
    font-weight: 500;
    fill: var(--ink);
  }
  .mono {
    font-family: var(--fm);
    font-size: 12.5px;
    fill: var(--ink);
  }
  .faint {
    fill: var(--soft);
    text-decoration: line-through;
  }
  .small {
    font-size: 13px;
    fill: var(--soft);
  }
  .small.red {
    fill: var(--red);
  }
  .wire {
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.4;
  }
  .wire.denied {
    stroke-dasharray: 4 4;
    stroke: var(--red);
  }
  .stop {
    stroke: var(--red);
    stroke-width: 3;
    stroke-linecap: round;
  }
  .mark-ok {
    fill: none;
    stroke: #fff;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  figcaption {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 32px;
    margin-top: 32px;
    padding-top: 20px;
    border-top: 1px solid var(--ink);
  }
  @media (max-width: 760px) {
    figcaption {
      grid-template-columns: 1fr;
    }
  }
  .fig-title {
    font-family: var(--fd);
    font-weight: var(--dw);
    font-size: 18px;
    letter-spacing: -0.01em;
  }
  .fig-text {
    max-width: 62ch;
    font-size: 15px;
    line-height: 1.6;
    color: var(--soft);
  }
</style>
