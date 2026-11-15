<script lang="ts" module>
  export const meta = {
    title: "Code and scroll",
    intro:
      "Sixteen code roles drive the code block and the editor as text-code and bg-code utilities, in both themes. The scrollbar utility colours a native scroll box; scrollbar-code is the same bar on the code ground.",
  };
</script>

<script lang="ts">
  import type { ThemeData } from "./data.server";

  let { data }: { data: ThemeData } = $props();

  // The two grounds that only code uses, with their values.
  const grounds = $derived(
    data.swatches.filter((s) =>
      ["syntax-ground", "syntax-active-line"].includes(s.name),
    ),
  );
</script>

<dl class="grid gap-2 text-sm" data-testid="code-grounds">
  {#each grounds as swatch (swatch.name)}
    <div class="flex flex-wrap items-center gap-2">
      <dt><code>{swatch.name}</code></dt>
      <dd class="font-mono text-xs text-muted-foreground">
        <span class="dark:hidden">{swatch.light}</span>
        <span class="hidden dark:inline">{swatch.dark}</span>
        {swatch.name === "syntax-ground"
          ? "is the code ground, --code-background"
          : "is the active line, --code-active-line"}
      </dd>
    </div>
  {/each}
</dl>
<div class="mt-6 flex flex-wrap items-start gap-12">
  <div class="flex flex-col items-start gap-2">
    <pre
      class="rounded border border-border bg-code-background px-4 py-3 font-mono text-sm text-code-text"><code
        ><span data-token="text-code-keyword" class="text-code-keyword"
          >def</span
        > <span class="text-code-function">area</span>(r):
<span
          data-token="bg-code-active-line"
          class="block bg-code-active-line">    <span class="text-code-keyword"
            >return</span
          > <span class="text-code-number">3.14159</span> * r ** <span
            class="text-code-number">2</span
          >  <span class="text-code-comment"># a circle</span></span
        ></code
      ></pre>
    <code class="text-xs">text-code-keyword and bg-code-active-line</code>
  </div>
  <div class="flex flex-col items-start gap-2">
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div
      data-token="scrollbar"
      role="region"
      aria-label="A scroll box"
      tabindex="0"
      class="w-64 overflow-auto rounded border border-border bg-card p-3 text-sm whitespace-nowrap scrollbar"
    >
      A native scroll box whose scrollbar takes the input colour on the muted
      track. This line is longer than the box so that it scrolls.
    </div>
    <code class="text-xs">overflow-auto scrollbar</code>
  </div>
  <div class="flex flex-col items-start gap-2">
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div
      data-token="scrollbar-code"
      role="region"
      aria-label="A scroll box on the code ground"
      tabindex="0"
      class="w-64 overflow-auto rounded border border-border bg-code-background p-3 font-mono text-sm whitespace-nowrap text-code-text scrollbar-code"
    >
      A scroll box inside code, whose track is the code ground. This line is
      longer than the box so that it scrolls.
    </div>
    <code class="text-xs">overflow-auto scrollbar-code</code>
  </div>
</div>
