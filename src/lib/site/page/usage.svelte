<script lang="ts">
  import type { Snippet } from "svelte";
  import Check from "phosphor-svelte/lib/Check";
  import X from "phosphor-svelte/lib/X";

  let {
    when,
    dos,
    donts,
  }: {
    /** When to use it, in two or three sentences. */
    when: Snippet;
    /** Two to four short items each, as <li>s. */
    dos: Snippet;
    donts: Snippet;
  } = $props();
</script>

<!--
  When to use it, then Do and Don't, each headed by its word and an icon, in
  the foreground colour: red is never the signal here.
-->
<div class="grid max-w-prose gap-4">{@render when()}</div>
<div class="mt-8 grid gap-8 md:grid-cols-2">
  <div>
    <h3
      data-slot="usage-heading"
      class="flex items-center gap-2 border-b-2 border-foreground pb-2 font-sans text-base font-semibold text-foreground"
    >
      <Check aria-hidden="true" class="size-4" />Do
    </h3>
    <ul class="mt-3 grid list-disc gap-2 ps-5">{@render dos()}</ul>
  </div>
  <div>
    <h3
      data-slot="usage-heading"
      class="flex items-center gap-2 border-b-2 border-foreground pb-2 font-sans text-base font-semibold text-foreground"
    >
      <X aria-hidden="true" class="size-4" />Don't
    </h3>
    <ul class="mt-3 grid list-disc gap-2 ps-5">{@render donts()}</ul>
  </div>
</div>
