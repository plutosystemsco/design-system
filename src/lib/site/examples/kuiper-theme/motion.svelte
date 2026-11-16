<script lang="ts" module>
  export const meta = {
    title: "Motion",
    intro:
      "Two durations and one curve: the entrance, the micro-feedback and the entrance curve. Under reduced motion every duration reads 0.",
  };
</script>

<script lang="ts">
  import type { ThemeData } from "./data.server";

  let { data }: { data: ThemeData } = $props();
</script>

<dl class="grid gap-2 text-sm">
  <div class="flex flex-wrap gap-2">
    <dt class="text-muted-foreground">Entrance</dt>
    <dd><code>--motion-entrance</code>, {data.motion.entranceMs} ms</dd>
  </div>
  <div class="flex flex-wrap gap-2">
    <dt class="text-muted-foreground">Micro-feedback</dt>
    <dd><code>--motion-micro</code>, {data.motion.microMs} ms</dd>
  </div>
  <div class="flex flex-wrap gap-2">
    <dt class="text-muted-foreground">Entrance curve</dt>
    <dd>
      <code>ease-entrance</code>, cubic-bezier({data.motion.easeEntrance.join(
        ", ",
      )})
    </dd>
  </div>
</dl>
<p
  data-token="transition"
  class="mt-6 inline-block rounded border border-input bg-card px-3 py-2 text-sm transition hover:bg-accent"
>
  A transition at the micro budget.
</p>
