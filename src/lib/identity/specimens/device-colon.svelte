<script lang="ts">
  import { TODAY, TYPE } from "../look.ts";
  import Ground from "./ground.svelte";
  import Mark from "./mark.svelte";

  // F5, the colon: the mark set as punctuation. Loud in a headline, quiet
  // (one tone) in breadcrumbs, lists and section numbers. Set at a colon's
  // size, centred on the x-height, with the gap opened so it reads "::".
  const p = TODAY;
  const four: [string, string, string, string] = [
    p.blueLifted,
    p.redLifted,
    p.yellowLifted,
    p.greenLifted,
  ];
  const quiet: [string, string, string, string] = [
    p.stageMuted,
    p.stageMuted,
    p.stageMuted,
    p.stageMuted,
  ];
  const DOT = 0.2;
  const GAP = 0.12;
  const FACTS = [
    ["owner", "Finance"],
    ["shared with", "12 people, 2 agents"],
    ["last read", "by an agent, 2 min ago"],
  ];
</script>

<Ground ground="stage" caption="f5 · the colon · headline, crumbs, lists">
  <div
    class="f5"
    style="--display:{TYPE.D5.display};--body:{TYPE.D5.body};--mono:{TYPE.D5
      .mono};--t:{p.stageText};--m:{p.stageMuted}"
  >
    <p class="eyebrow">
      <span>02</span><Mark
        colours={quiet}
        dot={DOT}
        gap={GAP}
        class="colon"
      /><span class="sr-only">: </span><span>the platform</span>
    </p>
    <p class="headline">
      Work<Mark colours={four} dot={DOT} gap={GAP} class="colon" /><span
        class="sr-only"
      >
      </span>runs on data.
    </p>

    <div class="uses">
      <div class="use">
        <p class="label">breadcrumbs</p>
        <nav aria-label="Breadcrumb (sample)" class="crumbs">
          <span>Docs</span><Mark
            colours={quiet}
            dot={DOT}
            gap={GAP}
            class="colon"
          /><span class="sr-only"> / </span><span>Contracts</span><Mark
            colours={quiet}
            dot={DOT}
            gap={GAP}
            class="colon"
          /><span class="sr-only"> / </span><span
            class="here"
            aria-current="page">Renewal terms</span
          >
        </nav>
      </div>
      <div class="use">
        <p class="label">a list of facts</p>
        <ul class="facts">
          {#each FACTS as [k, v] (k)}
            <li>
              <span class="k">{k}</span><Mark
                colours={quiet}
                dot={DOT}
                gap={GAP}
                class="colon"
              /><span class="sr-only">: </span><span>{v}</span>
            </li>
          {/each}
        </ul>
      </div>
      <div class="use">
        <p class="label">in running text</p>
        <p class="running">
          Three files match<Mark
            colours={quiet}
            dot={DOT}
            gap={GAP}
            class="colon tight"
          /><span class="sr-only">: </span>two contracts and one note. One more
          is withheld by permission.
        </p>
      </div>
    </div>
  </div>
</Ground>

<style>
  .f5 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 440px;
    padding: 32px clamp(20px, 4vw, 48px);
    color: var(--t);
    font-family: var(--body);
  }
  .f5 :global(.colon) {
    vertical-align: middle;
    margin: 0 0.24em;
    position: relative;
    top: -0.04em;
  }
  .f5 :global(.colon.tight) {
    margin: 0 0.3em 0 0.14em;
  }
  .eyebrow {
    margin: 0;
    font-family: var(--mono);
    font-size: 13px;
    letter-spacing: 0.06em;
    color: var(--m);
  }
  .headline {
    margin: 14px 0 0;
    font-family: var(--display);
    font-size: clamp(40px, 6.4vw, 84px);
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.045em;
  }
  .uses {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px 40px;
    margin-top: 48px;
    padding-top: 24px;
    border-top: 1px solid #f7f7f41a;
  }
  .use {
    min-width: 0;
  }
  .label {
    margin: 0 0 12px;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--m);
  }
  .crumbs {
    font-size: 15px;
    color: var(--m);
  }
  .here {
    color: var(--t);
    font-weight: 500;
  }
  .facts {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 15px;
  }
  .facts li {
    padding: 3px 0;
  }
  .facts .k {
    color: var(--m);
  }
  .running {
    margin: 0;
    font-size: 15px;
    line-height: 1.55;
  }
  @media (max-width: 860px) {
    .uses {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
