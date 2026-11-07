<script lang="ts">
  import type { Look } from "../look.ts";

  // M3, people at work: a photography direction, not photographs. Each frame
  // is drawn as a composition guide (thirds, subject, light), with its shot
  // list and lighting notes. No stock, no hotlinked images.
  let { look, label }: { look: Look; label: string } = $props();
  const p = $derived(look.palette);

  const SHOTS = [
    {
      title: "The handover",
      ratio: "4 / 5",
      crop: "4:5 portrait",
      shot: "Two colleagues at one desk. One turns a laptop toward the other, mid-sentence. Hands and screen sharp; faces soft.",
      light:
        "Window light from camera left, late morning, about 5200 K. No fill: let the far side fall off a stop.",
      lens: "35 mm, f/2.8, seated eye height.",
      from: "left",
    },
    {
      title: "Found it",
      ratio: "3 / 2",
      crop: "3:2 landscape",
      shot: "One person alone at the end of a long day, the moment a search returns the right file. Shoulders drop. No smile to camera.",
      light:
        "Practical lamp only, warm, 3200 K, from behind the screen. The screen is the key light on the face.",
      lens: "50 mm, f/2, over the shoulder.",
      from: "right",
    },
    {
      title: "The table",
      ratio: "1 / 1",
      crop: "1:1 square",
      shot: "From above: a working table with paper, a phone and a laptop showing Pluto Sheets. Two hands, one pointing at a cell.",
      light:
        "Overcast skylight, soft and even, 6000 K. A white card opposite the window lifts the shadows.",
      lens: "28 mm, f/5.6, straight down.",
      from: "top",
    },
  ];

  const RULES = [
    "Real people, in their own workplaces, with their written consent.",
    "Nobody looks at the camera. Nobody poses.",
    "Screens show the real product, captured on the day, never composited.",
    "The four colours appear only where they already are in the room.",
    "No stock photography, ever.",
  ];
</script>

<figure
  class="m3"
  aria-label={label}
  style="--paper:{p.paper};--raised:{p.raised};--ink:{p.ink};--soft:{p.inkSoft};--fd:{look
    .type.display};--fb:{look.type.body};--fm:{look.type.mono};--dw:{look.type
    .displayWeight}"
>
  <div class="shots">
    {#each SHOTS as s, i (s.title)}
      {@const vw = i === 0 ? 80 : i === 1 ? 150 : 100}
      <article class="shot">
        <div class="frame" style="aspect-ratio:{s.ratio}" aria-hidden="true">
          <svg viewBox="0 0 {vw} 100">
            <g class="thirds">
              <line x1={vw / 3} y1="0" x2={vw / 3} y2="100" />
              <line x1={(vw * 2) / 3} y1="0" x2={(vw * 2) / 3} y2="100" />
              <line x1="0" y1="33.3" x2={vw} y2="33.3" />
              <line x1="0" y1="66.6" x2={vw} y2="66.6" />
            </g>
            <g class="figure">
              {#if i === 0}
                <!-- two people at one desk; one turns the laptop -->
                <circle cx="24" cy="40" r="7" />
                <path d="M10 70c1-12 7-18 14-18s13 6 14 18" />
                <circle cx="57" cy="37" r="7.5" />
                <path d="M42 70c1-13 7-19 15-19s14 6 15 19" />
                <path d="M30 70l6-12h18l2 12z" class="screen" />
                <line x1="0" y1="70" x2="80" y2="70" />
              {:else if i === 1}
                <!-- over the shoulder, the screen as key light -->
                <rect
                  x="88"
                  y="26"
                  width="44"
                  height="30"
                  rx="2"
                  class="screen"
                />
                <path d="M104 56v8h12v-8" />
                <circle cx="52" cy="50" r="17" />
                <path d="M14 100c2-22 18-32 38-32s36 10 38 32" />
              {:else}
                <!-- from above: laptop, paper, phone, two hands -->
                <rect
                  x="30"
                  y="18"
                  width="40"
                  height="30"
                  rx="2"
                  class="screen"
                />
                <rect x="30" y="48" width="40" height="18" rx="2" />
                <rect
                  x="10"
                  y="58"
                  width="18"
                  height="24"
                  transform="rotate(-8 19 70)"
                />
                <rect x="76" y="62" width="10" height="18" rx="2" />
                <ellipse cx="48" cy="74" rx="6" ry="9" />
                <path d="M47 66l-4-30" />
                <ellipse cx="66" cy="82" rx="7" ry="9" />
              {/if}
            </g>
          </svg>
          <span class="light light-{s.from}"></span>
          <span class="tag">Shot {i + 1} · {s.crop}</span>
        </div>
        <h3 class="title">{s.title}</h3>
        <dl class="notes">
          <div>
            <dt>shot</dt>
            <dd>{s.shot}</dd>
          </div>
          <div>
            <dt>light</dt>
            <dd>{s.light}</dd>
          </div>
          <div>
            <dt>lens</dt>
            <dd>{s.lens}</dd>
          </div>
        </dl>
      </article>
    {/each}
  </div>
  <figcaption class="rules">
    <p class="rules-title">Rules for every shoot</p>
    <ul>
      {#each RULES as r (r)}<li>{r}</li>{/each}
    </ul>
  </figcaption>
</figure>

<style>
  .m3 {
    margin: 0;
    padding: clamp(20px, 4vw, 48px);
    background: var(--paper);
    color: var(--ink);
    border: 1px solid #14161c1a;
    border-radius: 12px;
    font-family: var(--fb);
  }
  .shots {
    display: grid;
    grid-template-columns: 0.9fr 1.3fr 1fr;
    gap: clamp(20px, 3vw, 40px);
    align-items: start;
  }
  @media (max-width: 900px) {
    .shots {
      grid-template-columns: 1fr;
    }
  }
  .frame {
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    background: linear-gradient(160deg, #d9d4ca, #b9b2a5);
    box-shadow: inset 0 0 0 1px #14161c1f;
  }
  .frame svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .tag {
    z-index: 2;
  }
  .thirds line {
    stroke: #ffffffa6;
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
    stroke-dasharray: 3 3;
  }
  .figure {
    fill: #14161c17;
    stroke: #14161c8c;
    stroke-width: 1.25;
    vector-effect: non-scaling-stroke;
    stroke-linejoin: round;
    stroke-linecap: round;
  }
  .figure * {
    vector-effect: non-scaling-stroke;
  }
  .figure .screen {
    fill: #fffdf5d9;
  }
  .light {
    position: absolute;
    pointer-events: none;
  }
  /* Where the key light comes from: a soft wedge, warm. */
  .light-left {
    inset: 0 auto 0 0;
    width: 55%;
    background: linear-gradient(90deg, #fff6e2b3, transparent);
  }
  .light-right {
    inset: 0 0 0 auto;
    width: 60%;
    background: radial-gradient(
      closest-side at 70% 40%,
      #ffd79acc,
      transparent
    );
  }
  .light-top {
    inset: 0 0 auto 0;
    height: 60%;
    background: linear-gradient(180deg, #ffffffa6, transparent);
  }
  .tag {
    position: absolute;
    left: 10px;
    bottom: 10px;
    padding: 3px 8px;
    border-radius: 4px;
    background: #14161ccc;
    color: #f7f7f4;
    font-family: var(--fm);
    font-size: 11px;
  }
  .title {
    margin-top: 16px;
    font-family: var(--fd);
    font-weight: var(--dw);
    font-size: 22px;
    letter-spacing: -0.02em;
  }
  .notes {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .notes div {
    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 8px;
  }
  .notes dt {
    padding-top: 2px;
    font-family: var(--fm);
    font-size: 12px;
    color: var(--soft);
  }
  .notes dd {
    font-size: 14.5px;
    line-height: 1.55;
  }
  .rules {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #14161c1a;
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 12px 32px;
  }
  @media (max-width: 760px) {
    .rules {
      grid-template-columns: 1fr;
    }
  }
  .rules-title {
    font-family: var(--fd);
    font-weight: var(--dw);
    font-size: 18px;
  }
  .rules ul {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 8px 32px;
  }
  .rules li {
    position: relative;
    padding-left: 18px;
    font-size: 15px;
    line-height: 1.5;
  }
  .rules li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.55em;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--ink);
  }
</style>
