<script lang="ts">
  import type { Look } from "../look.ts";
  import Mark from "./mark.svelte";
  import Wordmark, { type WordmarkVariant } from "./wordmark.svelte";

  // The reference hero the owner chose (the product-site memo): a stage, a
  // large headline on the left, two code cards on the right, light behind
  // them that answers a run, pill actions and a strip of names. Every value
  // comes from the look, so one component shows every option.
  let {
    look,
    wordmark = "E1",
    compact = false,
    label = "Reference hero",
    invite = false,
    onrun,
  }: {
    look: Look;
    wordmark?: WordmarkVariant;
    /** A shorter hero for side-by-side boards. */
    compact?: boolean;
    label?: string;
    /** Say, beside the cards, that Run makes the light answer. */
    invite?: boolean;
    /** Called when the visitor presses Run. */
    onrun?: () => void;
  } = $props();

  const p = $derived(look.palette);
  const onPaper = $derived(look.behaviour === "paper");
  const onField = $derived(look.behaviour === "fields");
  /** Four-colour moments: the mark's four together, in a few owned places. */
  const moments = $derived(
    look.behaviour === "moments" || look.behaviour === "fields",
  );
  const ground = $derived(onPaper ? p.paper : onField ? p.blue : p.stage);
  const text = $derived(onPaper ? p.ink : p.stageText);
  const muted = $derived(
    onPaper ? p.inkSoft : onField ? p.paper : p.stageMuted,
  );
  const line = $derived(
    onPaper ? "#14161C1A" : onField ? "#F7F7F433" : p.stageLine,
  );
  const card = $derived(onPaper ? p.raised : p.stageRaised);
  const cardText = $derived(onPaper ? p.ink : p.stageText);
  const cardMuted = $derived(onPaper ? p.inkSoft : p.stageMuted);
  const cardLine = $derived(onPaper ? "#14161C1A" : p.stageLine);
  const action = $derived(
    onPaper ? p.blueText : onField ? p.paper : p.blueLifted,
  );
  const actionText = $derived(onPaper ? p.raised : onField ? p.blue : p.ink);
  const markColours = $derived<[string, string, string, string]>(
    onPaper
      ? [p.blue, p.red, p.yellow, p.green]
      : [p.blueLifted, p.redLifted, p.yellowLifted, p.greenLifted],
  );
  const light = $derived(onPaper ? "flat" : look.light);
  /** A poster ceiling sets the headline across the whole width. */
  const poster = $derived(!compact && look.scale.displayMax >= 120);
  const vw = $derived(look.scale.displayMax / 14.4);
  const display = $derived(
    `clamp(${look.scale.displayMin * (compact ? 0.75 : 1)}px, ${vw * (compact ? 0.62 : 1)}vw, ${look.scale.displayMax * (compact ? 0.62 : 1)}px)`,
  );

  /** The strip: who spends colour there depends on the behaviour. */
  function stripColours(): [string, string, string, string] {
    if (moments) return markColours;
    if (look.behaviour === "paper") return [p.blue, line, line, line];
    // The stage keeps colour as light only: the strip is quiet.
    return [muted, line, line, line];
  }

  const STEPS = ["connect", "policy", "grep", "print"];

  let running = $state(false);
  let ran = $state(false);
  let copied = $state<string | null>(null);
  let timer: ReturnType<typeof setTimeout> | undefined;

  const SHELL = 'pluto search "renewal terms" --in /contracts';

  function run() {
    clearTimeout(timer);
    running = true;
    ran = false;
    onrun?.();
    timer = setTimeout(() => {
      running = false;
      ran = true;
    }, 900);
  }

  async function copy(what: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // A preview without clipboard access still shows the response.
    }
    copied = what;
    setTimeout(() => (copied = null), 1400);
  }
</script>

<section
  aria-label={label}
  class="hero light-{light}"
  class:compact
  class:poster
  class:running
  class:ran
  class:copied={copied !== null}
  class:moments
  style="
    --g:{ground};--t:{text};--m:{muted};--l:{line};--ls:{onPaper
    ? '#14161C24'
    : onField
      ? '#F7F7F466'
      : p.stageLineStrong};
    --c:{card};--ct:{cardText};--cm:{cardMuted};--cl:{cardLine};--a:{action};--at:{actionText};
    --b1:{markColours[0]};--b2:{markColours[1]};--b3:{markColours[2]};--b4:{markColours[3]};
    --display:{display};--fd:{look.type.display};--fb:{look.type
    .body};--fm:{look.type.mono};
    --dw:{look.type.displayWeight};--dt:{look.type.displayTracking}em;--dl:{look
    .type.displayLeading};
    --r-action:{look.shape.action};--r-card:{look.shape.card};--r-input:{look
    .shape.input};
    --kw:{onPaper ? p.blueText : p.blueLifted};--str:{onPaper
    ? p.greenText
    : p.greenLifted};
    --fn:{onPaper ? p.yellowText : p.yellowLifted};--num:{onPaper
    ? p.redText
    : p.redLifted};
  "
>
  <div class="bar">
    <Wordmark
      variant={wordmark}
      font={look.type.display}
      colours={markColours}
      ink={text}
      class="logo"
    />
    <nav aria-label="Products (sample)" class="links">
      <a href="#top" onclick={(e) => e.preventDefault()}>Docs</a>
      <a href="#top" onclick={(e) => e.preventDefault()}>Sheets</a>
      <a href="#top" onclick={(e) => e.preventDefault()}>Mail</a>
      <a href="#top" onclick={(e) => e.preventDefault()}>Search</a>
      <a href="#top" onclick={(e) => e.preventDefault()}>Platform</a>
    </nav>
    <div class="bar-actions">
      <a
        class="btn ghost small signin"
        href="#top"
        onclick={(e) => e.preventDefault()}>Sign in</a
      >
      <a
        class="btn primary small"
        href="#top"
        onclick={(e) => e.preventDefault()}>{look.copy.primary}</a
      >
    </div>
  </div>

  <div class="grid">
    <div class="copy">
      <p class="eyebrow">
        {#if moments}<Mark
            colours={markColours}
            class="eyebrow-mark"
          />{/if}{look.copy.eyebrow}
      </p>
      <h2 class="headline">{look.copy.headline}</h2>
      <p class="sub">{look.copy.sub}</p>
      <div class="actions">
        <a class="btn primary" href="#top" onclick={(e) => e.preventDefault()}
          >{look.copy.primary}</a
        >
        <a class="btn outline" href="#top" onclick={(e) => e.preventDefault()}
          >{look.copy.secondary}</a
        >
      </div>
    </div>

    <div class="cards">
      <div class="lights" aria-hidden="true">
        {#if light === "bloom"}
          <span class="bloom"></span><span class="bloom-core"></span>
        {:else if light === "four"}
          <span class="src s1"></span><span class="src s2"></span><span
            class="src s3"
          ></span><span class="src s4"></span>
        {:else if light === "glass"}
          <span class="orb o1"></span><span class="orb o2"></span><span
            class="orb o3"
          ></span><span class="orb o4"></span>
        {/if}
      </div>
      <figure class="card">
        <figcaption class="card-head">
          <span>shell</span>
          <button
            type="button"
            class="copy-btn"
            onclick={() => copy("shell", SHELL)}
          >
            {copied === "shell" ? "Copied" : "Copy"}
          </button>
        </figcaption>
        <pre><code><span class="dim">$</span> {SHELL}</code></pre>
      </figure>
      <figure class="card agent">
        <figcaption class="card-head">
          <span>agent.py</span>
          <button type="button" class="copy-btn run" class:invite onclick={run}>
            {running ? "Running…" : ran ? "Run again" : "Run"}
          </button>
        </figcaption>
        <pre><code
            ><span class="k">from</span> pluto <span class="k">import</span
            > workspace

ws = workspace.<span class="f">connect</span>(as_agent=<span class="s"
              >"renewals"</span
            >)
hits = <span class="k">await</span> ws.<span class="f">grep</span>(<span
              class="s">"renewal"</span
            >, paths=[<span class="s">"/contracts"</span>])
<span class="k">for</span> hit <span class="k">in</span> hits[:<span class="n"
              >3</span
            >]:
    <span class="f">print</span>(hit.path)</code
          ></pre>
        {#if moments}
          <div class="steps" aria-hidden="true">
            {#each STEPS as step, i (step)}
              <span class="step" style="--sc:var(--b{i + 1});--si:{i}"
                ><i></i>{step}</span
              >
            {/each}
          </div>
        {/if}
        <output class="out" aria-live="polite">
          {#if ran}
            <span>/contracts/acme-2026.pdf</span>
            <span>/contracts/northwind-msa.docx</span>
            <span class="dim">1 file hidden by policy: finance-only</span>
          {/if}
        </output>
      </figure>
      {#if invite}
        <p class="hint">
          Press <strong>Run</strong>. {light === "flat"
            ? "The card answers."
            : "The light answers."}
        </p>
      {/if}
    </div>
  </div>

  <ul class="strip" aria-label="Products (sample)">
    {#each ["Docs", "Sheets", "Mail", "Search", "Agents", "Kernel"] as name (name)}
      <li><Mark colours={stripColours()} dot={0.3} gap={0.08} />{name}</li>
    {/each}
  </ul>
</section>

<style>
  .hero {
    --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
    position: relative;
    overflow: hidden;
    isolation: isolate;
    background: var(--g);
    color: var(--t);
    font-family: var(--fb);
    padding: 0 clamp(16px, 4vw, 56px);
    min-height: clamp(760px, 100svh, 1000px);
    display: flex;
    flex-direction: column;
  }
  .hero.compact {
    min-height: 0;
  }
  .bar {
    display: flex;
    align-items: center;
    gap: 32px;
    height: 72px;
    border-bottom: 1px solid var(--l);
  }
  .bar :global(.logo) {
    font-size: 26px;
  }
  .links {
    display: flex;
    gap: 24px;
    font-size: 14px;
    color: var(--m);
  }
  .links a:hover {
    color: var(--t);
  }
  .bar-actions {
    margin-left: auto;
    display: flex;
    gap: 8px;
  }
  .compact .links {
    display: none;
  }
  .grid {
    flex: 1;
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    gap: clamp(24px, 4vw, 64px);
    align-items: center;
    padding: clamp(40px, 7vw, 96px) 0;
  }
  .compact .grid {
    padding: 48px 0;
  }
  .copy,
  .cards {
    min-width: 0;
  }
  /* The poster ceiling: the headline takes the full width; copy and cards share the row below. */
  .poster .grid {
    grid-template-columns: 1fr 1fr;
    align-items: start;
    row-gap: 0;
  }
  .poster .copy {
    display: contents;
  }
  .poster .eyebrow,
  .poster .headline {
    grid-column: 1 / -1;
  }
  .poster .sub {
    grid-column: 1;
    margin-top: 40px;
  }
  .poster .actions {
    grid-column: 1;
  }
  .poster .cards {
    grid-column: 2;
    grid-row: 3 / span 2;
    margin-top: 40px;
  }
  @media (max-width: 900px) {
    .grid,
    .poster .grid {
      grid-template-columns: 1fr;
    }
    .poster .sub,
    .poster .actions,
    .poster .cards {
      grid-column: 1;
      grid-row: auto;
    }
    .poster .cards {
      margin-top: 48px;
    }
    .links {
      display: none;
    }
  }
  @media (max-width: 480px) {
    .signin {
      display: none;
    }
  }
  .eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--fm);
    font-size: 12px;
    letter-spacing: 0.08em;
    color: var(--m);
  }
  .eyebrow :global(.eyebrow-mark) {
    font-size: 14px;
  }
  .headline {
    margin-top: 16px;
    font-family: var(--fd);
    font-weight: var(--dw);
    font-size: var(--display);
    line-height: var(--dl);
    letter-spacing: var(--dt);
    text-wrap: balance;
  }
  .sub {
    margin-top: 24px;
    max-width: 34rem;
    font-size: 18px;
    line-height: 1.55;
    color: var(--m);
  }
  .compact .sub {
    font-size: 16px;
  }
  .actions {
    margin-top: 32px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    height: 52px;
    padding: 0 24px;
    border-radius: var(--r-action);
    font-weight: 500;
    font-size: 16px;
    white-space: nowrap;
    transition:
      transform 160ms var(--ease),
      background-color 200ms;
  }
  .btn:active,
  .copy-btn:active {
    transform: scale(0.98);
  }
  .btn.small {
    height: 38px;
    padding: 0 16px;
    font-size: 14px;
  }
  .btn.primary {
    background: var(--a);
    color: var(--at);
  }
  .btn.outline {
    border: 1px solid var(--ls);
    color: var(--t);
  }
  .btn.ghost {
    color: var(--t);
  }
  .btn:focus-visible,
  .copy-btn:focus-visible,
  .links a:focus-visible {
    outline: 2px solid var(--a);
    outline-offset: 2px;
  }

  /* The cards and their light. */
  .cards {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .lights {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }
  .lights span {
    position: absolute;
    display: block;
    transition:
      opacity 600ms var(--ease),
      transform 600ms var(--ease);
  }

  /* I2: one cool source behind the object, a lit rim on its edge. */
  .bloom {
    left: 52%;
    top: 44%;
    width: 190%;
    aspect-ratio: 1.35;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      closest-side,
      rgb(200 212 255 / 0.3),
      rgb(140 160 230 / 0.16) 46%,
      rgb(110 130 210 / 0.04) 72%,
      transparent
    );
    opacity: 0.85;
  }
  .bloom-core {
    left: 50%;
    top: 24%;
    width: 80%;
    aspect-ratio: 2.4;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      closest-side,
      rgb(225 233 255 / 0.22),
      transparent
    );
    opacity: 0.6;
  }
  .running .bloom,
  .ran .bloom {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.08);
  }
  .running .bloom-core {
    opacity: 1;
  }
  .ran .bloom-core {
    opacity: 0.8;
  }
  /*
   * The theme's former bloom utility, which this class also received while
   * pluto-theme had one; 012 decision 1 removed it. The rules above win
   * wherever both set a property, as they did over the layered utility
   * (its position among them); these are the rest, so the record renders
   * as before.
   */
  .bloom {
    isolation: isolate;
  }
  .bloom::before {
    content: "";
    position: absolute;
    inset: -25%;
    z-index: -1;
    pointer-events: none;
    background: radial-gradient(
      closest-side,
      #c8d4ff38,
      #6e82d212 60%,
      transparent
    );
    opacity: 0.6;
    transition: opacity var(--motion-reveal) var(--ease-standard);
  }

  /* I3: four separate lights, one at each corner of the group, in the mark's
     order. Each fades out long before it could meet another, so they never
     mix into one gradient. */
  .src {
    width: 46%;
    aspect-ratio: 1.5;
    transform: translate(-50%, -50%);
    opacity: 0.72;
  }
  .s1 {
    left: 7%;
    top: -3%;
    background: radial-gradient(
      closest-side,
      color-mix(in oklab, var(--b1) 62%, transparent),
      color-mix(in oklab, var(--b1) 16%, transparent) 46%,
      transparent
    );
  }
  .s2 {
    left: 93%;
    top: -3%;
    background: radial-gradient(
      closest-side,
      color-mix(in oklab, var(--b2) 56%, transparent),
      color-mix(in oklab, var(--b2) 14%, transparent) 46%,
      transparent
    );
  }
  .s3 {
    left: 7%;
    top: 103%;
    background: radial-gradient(
      closest-side,
      color-mix(in oklab, var(--b3) 50%, transparent),
      color-mix(in oklab, var(--b3) 12%, transparent) 46%,
      transparent
    );
  }
  .s4 {
    left: 93%;
    top: 103%;
    background: radial-gradient(
      closest-side,
      color-mix(in oklab, var(--b4) 56%, transparent),
      color-mix(in oklab, var(--b4) 14%, transparent) 46%,
      transparent
    );
  }
  /* Each light brightens when its kind of work happens: blue acts, green is
     done, red marks what policy held back, yellow answers a copy. */
  .running .s1,
  .ran .s4,
  .copied .s3 {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
  .ran .s2 {
    opacity: 0.85;
  }
  /* Where each light meets the cards, it catches their edge: four short lit
     segments with dark between them, never one blended line. */
  .light-four .card::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    pointer-events: none;
    opacity: 0.7;
    transition: opacity 600ms var(--ease);
  }
  .light-four .card:first-of-type::after {
    top: 0;
    background: linear-gradient(
      90deg,
      var(--b1),
      transparent 28%,
      transparent 72%,
      var(--b2)
    );
  }
  .light-four .agent::after {
    bottom: 0;
    background: linear-gradient(
      90deg,
      var(--b3),
      transparent 28%,
      transparent 72%,
      var(--b4)
    );
  }
  .light-four.ran .agent::after,
  .light-four.running .card:first-of-type::after {
    opacity: 1;
  }

  /* I4: flat discs of colour behind frosted panels. */
  .orb {
    aspect-ratio: 1;
    border-radius: 50%;
    opacity: 0.9;
  }
  .o1 {
    left: 2%;
    top: -9%;
    width: 30%;
    background: var(--b1);
  }
  .o2 {
    right: -3%;
    top: 16%;
    width: 22%;
    background: var(--b2);
  }
  .o3 {
    left: 28%;
    bottom: 12%;
    width: 24%;
    background: var(--b3);
  }
  .o4 {
    right: 10%;
    bottom: 14%;
    width: 17%;
    background: var(--b4);
  }
  .running .o1 {
    transform: translate(14%, 12%);
  }
  .running .o4 {
    transform: translate(-30%, -20%) scale(1.15);
  }
  .ran .o4 {
    transform: scale(1.2);
  }
  .ran .o2 {
    transform: translate(-10%, 0);
  }
  .hint {
    position: relative;
  }

  .card {
    position: relative;
    margin: 0;
    background: var(--c);
    color: var(--ct);
    border: 1px solid var(--cl);
    border-radius: var(--r-card);
    overflow: hidden;
    transition:
      box-shadow 400ms var(--ease),
      border-color 400ms var(--ease);
  }
  .light-bloom .card {
    border-color: rgb(225 233 255 / 0.24);
    box-shadow:
      0 0 40px rgb(200 214 255 / 0.1),
      inset 0 1px 0 rgb(255 255 255 / 0.07);
  }
  .light-four .card {
    border-color: rgb(255 255 255 / 0.14);
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.06);
  }
  .light-glass .card {
    background: rgb(16 18 24 / 0.6);
    /* The prefixed line first, so the minified build keeps both (the 012
       change review's finding 5). */
    -webkit-backdrop-filter: blur(22px) saturate(1.5);
    backdrop-filter: blur(22px) saturate(1.5);
    border-color: rgb(255 255 255 / 0.18);
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.12);
  }
  .light-glass .card::before {
    /* grain */
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    opacity: 0.18;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
    pointer-events: none;
  }
  .light-flat.running .agent {
    border-color: var(--a);
  }
  .light-bloom.running .agent {
    border-color: rgb(225 233 255 / 0.5);
    box-shadow:
      0 0 0 1px rgb(122 155 255 / 0.55),
      0 0 60px rgb(36 86 230 / 0.28),
      inset 0 1px 0 rgb(255 255 255 / 0.1);
  }
  .light-four.running .agent {
    border-color: color-mix(in oklab, var(--b1) 70%, transparent);
    box-shadow: 0 0 48px color-mix(in oklab, var(--b1) 22%, transparent);
  }
  .light-four.ran .agent {
    border-color: color-mix(in oklab, var(--b4) 55%, transparent);
  }
  .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 8px 8px 16px;
    border-bottom: 1px solid var(--cl);
    font-family: var(--fm);
    font-size: 12px;
    color: var(--cm);
  }
  .copy-btn {
    height: 28px;
    padding: 0 12px;
    border-radius: var(--r-action);
    border: 1px solid var(--ls);
    font-family: var(--fb);
    font-size: 12px;
    font-weight: 500;
    color: var(--ct);
    cursor: pointer;
    transition: transform 160ms var(--ease);
  }
  .copy-btn.run {
    background: var(--a);
    color: var(--at);
    border-color: transparent;
    min-width: 56px;
  }
  .copy-btn.run.invite {
    box-shadow: 0 0 0 4px color-mix(in oklab, var(--a) 28%, transparent);
  }
  .ran .copy-btn.run.invite,
  .running .copy-btn.run.invite {
    box-shadow: none;
  }
  pre {
    margin: 0;
    padding: 16px;
    font-family: var(--fm);
    font-size: 13.5px;
    line-height: 1.6;
    overflow-x: auto;
  }
  .k {
    color: var(--kw);
  }
  .s {
    color: var(--str);
  }
  .f {
    color: var(--fn);
  }
  .n {
    color: var(--num);
  }
  .dim {
    color: var(--cm);
  }
  .out {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0 16px;
    font-family: var(--fm);
    font-size: 12.5px;
    min-height: 0;
  }
  .ran .out {
    padding: 0 16px 16px;
  }

  /* The four-colour moment: the run's four steps, in the mark's order. */
  .steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    padding: 0 16px 14px;
    font-family: var(--fm);
    font-size: 11px;
    color: var(--cm);
  }
  .step {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .step i {
    position: relative;
    display: block;
    height: 4px;
    border-radius: 999px;
    background: var(--cl);
    overflow: hidden;
  }
  .step i::after {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--sc);
    transform: scaleX(0);
    transform-origin: left;
    border-radius: inherit;
  }
  .running .step i::after {
    transition: transform 225ms linear calc(var(--si) * 225ms);
    transform: scaleX(1);
  }
  .ran .step i::after {
    transform: scaleX(1);
  }

  .hint {
    margin: -4px 0 0;
    font-family: var(--fm);
    font-size: 12px;
    color: var(--m);
    text-align: right;
  }
  .hint strong {
    color: var(--t);
    font-weight: 500;
  }

  .strip {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 32px;
    padding: 20px 0 28px;
    border-top: 1px solid var(--l);
    font-family: var(--fm);
    font-size: 13px;
    color: var(--m);
  }
  .strip li {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .strip :global(.mark) {
    font-size: 14px;
  }

  @media (prefers-reduced-motion: reduce) {
    .hero *,
    .hero *::after,
    .lights span {
      transition: none !important;
    }
    .btn:active,
    .copy-btn:active {
      transform: none;
    }
  }
</style>
