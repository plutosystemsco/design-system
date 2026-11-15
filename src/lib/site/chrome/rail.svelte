<script lang="ts">
  import { onMount } from "svelte";

  let {
    sections = [],
    scan = false,
    others,
  }: {
    /** The page's sections: an id and a title each. */
    sections?: { id: string; title: string }[];
    /** Read the sections from the page's h2s once it is in the browser. */
    scan?: boolean;
    /** A second list: a heading and its links, the current one marked. */
    others?: {
      title: string;
      links: { label: string; href: string; current?: boolean }[];
    };
  } = $props();

  let found = $state<{ id: string; title: string }[]>([]);
  onMount(() => {
    if (!scan) return;
    found = [...document.querySelectorAll("main h2[id]")].map((h) => ({
      id: h.id,
      title: (h.textContent ?? "").trim(),
    }));
  });
  const list = $derived(sections.length ? sections : found);
</script>

<!-- The rail: the page's sections, then its neighbours. Not in the Markdown twin. -->
<aside
  data-slot="site-rail"
  data-md="skip"
  aria-label="On this page"
  class="hidden text-sm lg:sticky lg:top-[calc(var(--site-bar-room)+var(--spacing)*6)] lg:block lg:self-start"
>
  {#if list.length}
    <h2 class="font-sans text-sm font-medium">On this page</h2>
    <ul class="groove-s mt-3 mb-8 grid gap-2">
      {#each list as s (s.id)}
        <li>
          <a
            href="#{s.id}"
            class="block ps-3 text-muted-foreground hover:text-foreground"
            >{s.title}</a
          >
        </li>
      {/each}
    </ul>
  {/if}
  {#if others}
    <h2 class="font-sans text-sm font-medium">{others.title}</h2>
    <ul class="groove-s mt-3 grid gap-2">
      {#each others.links as link (link.href)}
        <li>
          <a
            href={link.href}
            aria-current={link.current ? "page" : undefined}
            class="block ps-3 text-muted-foreground hover:text-foreground"
            >{link.label}</a
          >
        </li>
      {/each}
    </ul>
  {/if}
</aside>
