<script lang="ts" module>
  export const meta = {
    title: "Display, motion and press",
    intro:
      "The expressive mode's display steps, its durations and curves, and the press. Press and hold the button: action-press scales it on --motion-press.",
  };
</script>

<script lang="ts">
  import type { ThemeData } from "./data.server";

  let { data }: { data: ThemeData } = $props();

  const MOTION = ["press", "slide", "busy", "reveal", "fill"] as const;
</script>

<ul class="grid gap-1 text-sm">
  {#each Object.entries(data.expressive.steps) as [step, value] (step)}
    <li>
      <code>type-{step}</code>: {value.minPx} to {value.maxPx} px at {value.vw}vw,
      line {value.lineHeight}, tracking {value.tracking} em, weight {value.weight}{value.tabular
        ? ", tabular figures"
        : ""}
    </li>
  {/each}
</ul>
<dl class="mt-4 grid gap-1 text-sm">
  {#each MOTION as name (name)}
    <div class="flex flex-wrap gap-2">
      <dt><code>--motion-{name}</code></dt>
      <dd>{data.expressive.motion[name]} ms</dd>
    </div>
  {/each}
  <div class="flex flex-wrap gap-2">
    <dt><code>--ease-standard</code></dt>
    <dd>cubic-bezier({data.expressive.motion.easeStandard.join(", ")})</dd>
  </div>
  <div class="flex flex-wrap gap-2">
    <dt><code>--motion-light</code></dt>
    <dd>{data.expressive.motion.light} ms</dd>
  </div>
  <div class="flex flex-wrap gap-2">
    <dt><code>--ease-spring</code></dt>
    <dd>
      a damped spring, ζ {data.expressive.motion.spring.dampingRatio}, as
      <code>linear()</code>
    </dd>
  </div>
  <div class="flex flex-wrap gap-2">
    <dt><code>--press-scale</code></dt>
    <dd>{data.expressive.motion.pressScale}, 1 under reduced motion</dd>
  </div>
</dl>
<button
  type="button"
  data-testid="press"
  class="action-press mt-4 rounded border border-input bg-card px-4 py-2 text-sm"
>
  Press and hold
</button>
