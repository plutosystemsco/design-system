<script lang="ts">
  import type { Component } from "svelte";
  import { onMount } from "svelte";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import CaretRight from "phosphor-svelte/lib/CaretRight";
  import { theme } from "#lib/registry/ui/theme/theme.svelte.js";
  import type { ExampleData } from "../component-data.server.ts";
  import ThemeSwitch from "./theme-switch.svelte";

  let {
    item,
    example,
    view,
    data,
    open = false,
  }: {
    item: string;
    example: ExampleData;
    /** The example's component, rendered inline in the page's theme. */
    view: Component<any>;
    /** The page's data, which an example may read. */
    data?: unknown;
    /** Show the code open: the page's first example does. */
    open?: boolean;
  } = $props();

  const View = $derived(view);

  // The code as text, for the copy button: the tokens joined, or the code
  // itself when it has none.
  const text = $derived(
    example.lines
      ? example.lines
          .map((l) =>
            typeof l === "string" ? l : l.map((t) => t.content).join(""),
          )
          .join("\n")
      : example.code,
  );

  // The switch starts on the page's theme and follows it until the visitor
  // picks; then it holds the pick, even once the page's theme comes to
  // match it.
  let mounted = $state(false);
  let picked = $state<"light" | "dark" | null>(null);
  onMount(() => (mounted = true));
  const page = $derived(mounted ? theme.resolved : undefined);
  const shown = $derived(picked ?? page);
  const framed = $derived(mounted && picked !== null && picked !== page);

  let iframe: HTMLIFrameElement | undefined = $state();
  let ready = $state(false);
  let height = $state(0);

  // The other theme is the example's own document: its theme travels in the
  // address, read by the frame's head script before paint.
  const src = $derived(`/example/${item}/${example.id}/?theme=${picked}`);

  $effect(() => {
    if (!framed || !iframe) return;
    ready = false;
    const frame = iframe;
    let observer: ResizeObserver | undefined;
    let raf = 0;
    const onLoad = () => {
      const body = frame.contentDocument?.body;
      if (!body) return;
      const fit = () =>
        (height = Math.max(body.scrollHeight, example.frameMinHeight ?? 0));
      observer = new ResizeObserver(fit);
      observer.observe(body);
      fit();
      const check = () => {
        if (body.hasAttribute("data-view-ready")) ready = true;
        else raf = requestAnimationFrame(check);
      };
      check();
    };
    frame.addEventListener("load", onLoad);
    return () => {
      frame.removeEventListener("load", onLoad);
      observer?.disconnect();
      cancelAnimationFrame(raf);
    };
  });

  /**
   * The stage scrolls sideways when its example is wider than the page; it
   * is then a named region a keyboard can reach, and only then.
   */
  function scroller(label: string) {
    return (el: HTMLElement) => {
      const fit = () => {
        const scrolls = el.scrollWidth > el.clientWidth + 1;
        if (scrolls) {
          el.tabIndex = 0;
          el.setAttribute("role", "region");
          el.setAttribute("aria-label", label);
        } else {
          el.removeAttribute("tabindex");
          el.removeAttribute("role");
          el.removeAttribute("aria-label");
        }
      };
      const observer = new ResizeObserver(fit);
      observer.observe(el);
      fit();
      return () => observer.disconnect();
    };
  }

  const code = $derived(
    `${example.lineCount} line${example.lineCount === 1 ? "" : "s"}`,
  );
</script>

{#snippet source()}
  <CodeBlock.Root class="rounded-none border-x-0 border-b-0">
    <CodeBlock.Header>
      <CodeBlock.Title>{example.id}.svelte</CodeBlock.Title>
      <CodeBlock.Actions>
        <CodeBlock.CopyButton code={text} />
      </CodeBlock.Actions>
    </CodeBlock.Header>
    <CodeBlock.Content
      lines={example.lines ?? undefined}
      code={example.lines ? undefined : example.code}
      data-language="svelte"
      role="region"
      aria-label="{example.title}, source"
      class="max-h-[calc(var(--spacing)*120)]"
    />
  </CodeBlock.Root>
{/snippet}

<!--
  One example: its title and one sentence, its own Light | Dark switch, the
  example live in the page's theme (or, in the other, in a frame of its own
  document), then its code, as an app writes it.
-->
<section
  data-slot="frame"
  data-example={example.id}
  id={example.id}
  aria-labelledby="example-{example.id}"
  class="min-w-0 rounded border border-border bg-card"
>
  <div
    class="flex flex-wrap items-start justify-between gap-3 px-5 py-4 groove-b"
  >
    <div class="min-w-0">
      <h3 id="example-{example.id}" class="font-sans text-base font-semibold">
        {example.title}
      </h3>
      <p class="mt-1 max-w-prose text-sm text-muted-foreground">
        {example.intro}
      </p>
    </div>
    {#if example.switch}
      <ThemeSwitch
        value={shown}
        label="{example.title}: theme"
        onpick={(t) => (picked = t)}
      />
    {/if}
  </div>
  {#if example.live !== false}
    {#if !example.switch}
      <p data-slot="frame-note" class="px-5 pt-4 text-sm text-muted-foreground">
        This example changes the page's theme, so it shows in the page's theme.
        Use the theme switch in the bar to see the other.
      </p>
    {/if}
    <div
      data-slot="frame-stage"
      data-md="skip"
      {@attach scroller(`${example.title}, example`)}
      class="min-w-0 overflow-x-auto bg-background {framed ? '' : 'p-6 md:p-8'}"
    >
      {#if framed}
        <iframe
          bind:this={iframe}
          {src}
          title="{example.title}, {picked} theme"
          class="block w-full border-0 {ready ? 'visible' : 'invisible'}"
          style:height="{Math.max(height, example.frameMinHeight ?? 0)}px"
        ></iframe>
      {:else}
        <View {data} />
      {/if}
    </div>
  {/if}
  <div data-slot="frame-code">
    {#if open || example.live === false}
      {@render source()}
    {:else}
      <!-- A details element: the code stays in the page, for find-in-page and the Markdown twin. -->
      <details class="group/code">
        <summary
          data-md="skip"
          class="groove flex cursor-pointer list-none items-center gap-2 px-5 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden"
        >
          <CaretRight
            aria-hidden="true"
            class="size-4 transition-transform group-open/code:rotate-90"
          />Show code, {code}
        </summary>
        {@render source()}
      </details>
    {/if}
  </div>
  {#if example.samples.length}
    <p class="groove px-5 py-2 text-xs text-muted-foreground">
      It imports {#each example.samples as s, i (s)}{i ? " and " : ""}<code
          >{s}</code
        >{/each}, this site's sample data. Your app supplies its own.
    </p>
  {/if}
</section>
