<script lang="ts">
  let {
    since,
    updated,
    modes,
    stock,
  }: {
    since: string;
    /** The newest release whose changelog bullet names the item, else since (018 decision 4). */
    updated: string;
    modes: string[];
    /** The shadcn-svelte item this one is based on, when there is one. */
    stock?: string;
  } = $props();
</script>

<!--
  The facts line (018 decision 3): one row of terms, in text-sm. It keeps
  room for one more entry without a change of layout.
-->
<dl
  data-slot="facts"
  class="flex flex-wrap gap-x-4 gap-y-1 text-sm [&_dt]:text-muted-foreground [&>div]:flex [&>div]:gap-2"
>
  <div>
    <dt>Since</dt>
    <dd>{since}</dd>
  </div>
  <div>
    <dt>Updated</dt>
    <dd>
      <a
        href="/changelog/#v{updated.replaceAll('.', '-')}"
        class="text-primary underline underline-offset-4">{updated}</a
      >
    </dd>
  </div>
  <div>
    <dt>Modes</dt>
    <dd>{modes.join(", ")}</dd>
  </div>
  {#if stock}
    <div>
      <dt>Based on</dt>
      <dd>shadcn-svelte's <code>{stock}</code></dd>
    </div>
  {/if}
</dl>
