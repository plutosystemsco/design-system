<script lang="ts">
  import { onMount } from "svelte";
  import type { Look } from "../look.ts";

  // The proof band: three numbers at the look's proof size. They count up
  // once, the first time the band is seen, and stand still under reduced
  // motion. The server renders the final numbers, so nothing depends on JS.
  let {
    look,
    ground = "paper",
    label = "Proof",
  }: { look: Look; ground?: "paper" | "stage"; label?: string } = $props();

  const p = $derived(look.palette);
  const onStage = $derived(ground === "stage");
  const max = $derived(look.scale.proofMax);
  const size = $derived(
    `clamp(${Math.round(max * 0.56)}px, ${(max / 14.4).toFixed(2)}vw, ${max}px)`,
  );

  // svelte-ignore state_referenced_locally
  let shown = $state(look.copy.proof.map((x) => x.value));
  let band: HTMLElement;

  onMount(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = look.copy.proof.map((x) => x.value);
    const box = band.getBoundingClientRect();
    // Already on screen when the page loads: leave the numbers composed.
    if (box.top < window.innerHeight && box.bottom > 0) return;
    shown = targets.map(() => 0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / 900);
          const e = 1 - Math.pow(1 - t, 3);
          shown = targets.map((v) => Math.round(v * e));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(band);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  });
</script>

<section
  bind:this={band}
  class="band"
  aria-label={label}
  style="
    --g:{onStage ? p.stage : p.paper};--t:{onStage
    ? p.stageText
    : p.ink};--m:{onStage ? p.stageMuted : p.inkSoft};
    --l:{onStage ? p.stageLine : '#14161C1A'};--size:{size};
    --fd:{look.type.display};--fb:{look.type.body};--fm:{look.type
    .mono};--dw:{look.type.displayWeight};
  "
>
  <ul class="proofs">
    {#each look.copy.proof as proof, i (proof.label)}
      <li>
        <p class="value" aria-label="{proof.value}{proof.suffix}">
          <span class="num" aria-hidden="true">{shown[i]}</span><span
            class="suffix"
            class:tight={!proof.suffix.startsWith(" ")}
            aria-hidden="true">{proof.suffix.trim()}</span
          >
        </p>
        <p class="label">{proof.label}</p>
      </li>
    {/each}
  </ul>
</section>

<style>
  .band {
    background: var(--g);
    color: var(--t);
    font-family: var(--fb);
    padding: clamp(48px, 7vw, 96px) clamp(16px, 4vw, 56px);
    border-top: 1px solid var(--l);
  }
  .proofs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px clamp(24px, 4vw, 56px);
  }
  @media (max-width: 860px) {
    .proofs {
      grid-template-columns: 1fr;
    }
  }
  li {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 20px;
    border-top: 1px solid var(--l);
    min-width: 0;
  }
  .value {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0 0.14em;
    font-family: var(--fd);
    font-weight: var(--dw);
    font-size: var(--size);
    line-height: 0.95;
    letter-spacing: -0.04em;
    font-variant-numeric: tabular-nums;
  }
  .suffix {
    font-size: 0.42em;
    letter-spacing: -0.02em;
  }
  .suffix.tight {
    margin-left: -0.14em;
    font-size: 0.62em;
  }
  .label {
    max-width: 22rem;
    font-size: 16px;
    line-height: 1.5;
    color: var(--m);
  }
</style>
