<script lang="ts">
  import type { Palette, TypeStack } from "../look.ts";
  import Mark from "./mark.svelte";

  // One candidate type stack, set on paper: a display line, a section heading,
  // a body paragraph at 16/1.6, a mono label row and a code line, then the
  // dotted glyphs large, beside the mark, so their roundness can be compared.
  let {
    type,
    palette,
    label,
    standIn,
    brief,
  }: {
    type: TypeStack;
    palette: Palette;
    label: string;
    /** Set when the face shown stands in for one not yet drawn. */
    standIn?: string;
    /** The brief for a commissioned face, shown beside the specimen. */
    brief?: string[];
  } = $props();

  /** The first family in a CSS stack, without quotes or "Variable". */
  function family(stack: string) {
    return stack
      .split(",")[0]
      .replaceAll('"', "")
      .replace(" Variable", "")
      .trim();
  }

  const p = $derived(palette);
</script>

<figure
  class="spec"
  aria-label={label}
  style="
    --paper:{p.paper};--raised:{p.raised};--ink:{p.ink};--soft:{p.inkSoft};
    --fd:{type.display};--fb:{type.body};--fm:{type.mono};
    --dw:{type.displayWeight};--dt:{type.displayTracking}em;--dl:{type.displayLeading};
    --kw:{p.blueText};--str:{p.greenText};--fn:{p.yellowText};--num:{p.redText};
  "
>
  <header class="meta">
    <dl>
      <div>
        <dt>display</dt>
        <dd style="font-family:var(--fd)">
          {family(type.display)}
          {type.displayWeight}
        </dd>
      </div>
      <div>
        <dt>text</dt>
        <dd style="font-family:var(--fb)">{family(type.body)} 400</dd>
      </div>
      <div>
        <dt>code</dt>
        <dd style="font-family:var(--fm)">{family(type.mono)}</dd>
      </div>
    </dl>
    {#if standIn}<p class="standin">{standIn}</p>{/if}
  </header>

  <p class="display">Work runs on data.</p>

  <div class="cols">
    <div>
      <h3 class="section">One kernel decides who sees what.</h3>
      <p class="body">
        Docs, sheets, mail and search share one governed data layer. When an
        agent searches your files, it sees exactly what you would see, and
        nothing more. Permissions are checked once, in the kernel, for every
        product and every request.
      </p>
    </div>
    <div class="mono-col">
      <ul class="labels" aria-label="Label row">
        <li>glob</li>
        <li>grep</li>
        <li>glean</li>
        <li>graph</li>
        <li class="tag">v0.8.0</li>
      </ul>
      <pre class="code"><code
          >hits = <span class="k">await</span> ws.<span class="f">grep</span
          >(<span class="s">"renewal"</span>, limit=<span class="n">3</span
          >)</code
        ></pre>
      <p class="figures">
        <span>0123456789</span><span>1,284 files · 37 ms · 99.98%</span>
      </p>
    </div>
  </div>

  <div class="glyph-row">
    <p class="glyphs" aria-label="Dotted glyphs: i j ! ? . : ;">
      <span>i</span><span>j</span><span>!</span><span>?</span><span>.</span
      ><span>:</span><span>;</span>
    </p>
    <div class="beside">
      <Mark colours={[p.blue, p.red, p.yellow, p.green]} class="ref-mark" />
      <span>the dots, beside the mark's</span>
    </div>
  </div>

  {#if brief}
    <aside class="brief" aria-label="Brief for Pluto Sans">
      <p class="brief-title">The brief, for a foundry</p>
      <ul>
        {#each brief as item, i (item)}<li>
            <span
              aria-hidden="true"
              style="background:{[p.blue, p.red, p.yellow, p.green][i % 4]}"
            ></span>{item}
          </li>{/each}
      </ul>
    </aside>
  {/if}
</figure>

<style>
  .spec {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: clamp(28px, 4vw, 48px);
    background: var(--paper);
    color: var(--ink);
    border: 1px solid #14161c1a;
    border-radius: 12px;
    padding: clamp(20px, 4vw, 48px);
    font-family: var(--fb);
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid #14161c1a;
  }
  .meta dl {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 32px;
  }
  .meta div {
    display: flex;
    gap: 10px;
    align-items: baseline;
  }
  .meta dt {
    font-family: var(--fm);
    font-size: 12px;
    color: var(--soft);
  }
  .meta dd {
    font-size: 15px;
    font-weight: 500;
  }
  .standin {
    padding: 4px 12px;
    border-radius: 999px;
    border: 1px dashed var(--ink);
    font-family: var(--fm);
    font-size: 12px;
  }
  .display {
    font-family: var(--fd);
    font-weight: var(--dw);
    font-size: clamp(44px, 7.4vw, 104px);
    line-height: var(--dl);
    letter-spacing: var(--dt);
    text-wrap: balance;
  }
  .cols {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: clamp(24px, 5vw, 72px);
  }
  @media (max-width: 820px) {
    .cols {
      grid-template-columns: 1fr;
    }
  }
  .section {
    font-family: var(--fd);
    font-weight: var(--dw);
    font-size: clamp(26px, 2.8vw, 36px);
    line-height: 1.1;
    letter-spacing: calc(var(--dt) * 0.6);
    text-wrap: balance;
  }
  .body {
    margin-top: 16px;
    max-width: 36rem;
    font-size: 16px;
    line-height: 1.6;
    color: var(--ink);
  }
  .mono-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
  }
  .labels {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-family: var(--fm);
    font-size: 13px;
  }
  .labels li {
    padding: 4px 10px;
    border: 1px solid #14161c24;
    border-radius: 6px;
    background: var(--raised);
  }
  .labels .tag {
    color: var(--kw);
    border-color: color-mix(in oklab, var(--kw) 40%, transparent);
  }
  .code {
    margin: 0;
    padding: 14px 16px;
    border-radius: 8px;
    background: var(--raised);
    border: 1px solid #14161c1a;
    font-family: var(--fm);
    font-size: 14px;
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
  .figures {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 4px 16px;
    font-family: var(--fb);
    font-size: 20px;
    font-variant-numeric: tabular-nums;
    color: var(--soft);
  }
  .glyph-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px 32px;
    padding-top: 24px;
    border-top: 1px solid #14161c1a;
  }
  .glyphs {
    display: flex;
    flex-wrap: wrap;
    gap: 0 clamp(14px, 3vw, 44px);
    font-family: var(--fd);
    font-weight: var(--dw);
    font-size: clamp(64px, 11vw, 160px);
    line-height: 1;
  }
  .beside {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 0.6em;
    font-family: var(--fm);
    font-size: 12px;
    color: var(--soft);
  }
  .beside :global(.ref-mark) {
    font-size: 56px;
  }
  .brief {
    padding: 24px;
    border-radius: 10px;
    background: var(--raised);
    border: 1px solid #14161c1a;
  }
  .brief-title {
    font-family: var(--fd);
    font-weight: var(--dw);
    font-size: 20px;
    letter-spacing: calc(var(--dt) * 0.4);
  }
  .brief ul {
    margin-top: 16px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px 32px;
  }
  .brief li {
    display: flex;
    gap: 12px;
    font-size: 15px;
    line-height: 1.5;
  }
  .brief li span {
    flex: none;
    width: 10px;
    height: 10px;
    margin-top: 0.45em;
    border-radius: 50%;
  }
</style>
