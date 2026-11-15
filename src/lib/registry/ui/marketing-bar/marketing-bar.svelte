<script lang="ts" module>
  /** A link or a link-styled action: its visible label and its href. */
  export type MarketingLink = { label: string; href: string };
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import List from "phosphor-svelte/lib/List";
  import { Button } from "#lib/registry/ui/button";
  import { pointerLight } from "#lib/registry/ui/liquid-glass";
  import * as Sheet from "#lib/registry/ui/sheet";
  import { cn } from "#lib/utils";

  let {
    logo,
    homeLabel,
    links = [],
    secondary,
    primary,
    label = "Main",
    overlay = false,
    class: className,
  }: {
    /** The product's logo; it renders here for "header", as the app shell's logo snippet does. */
    logo: Snippet<[place: "header" | "footer"]>;
    /** The home link's accessible name. It contains any words the logo shows. */
    homeLabel: string;
    links?: MarketingLink[];
    /** The quieter action, beside the primary from md; in the sheet below it. */
    secondary?: MarketingLink;
    /** The one filled action, at every width. */
    primary?: MarketingLink;
    /** The navigation landmark's name. */
    label?: string;
    /** Floats the bar over the section below it, a stage whose hero sets `underBar`. */
    overlay?: boolean;
    class?: string;
  } = $props();

  let menuOpen = $state(false);
  // Its text is the foreground and the primary only: the bar floats over the
  // whole page, images included, where muted text would not hold.
  const link =
    "inline-flex min-h-12 items-center text-sm font-medium text-foreground hover:text-primary";
</script>

<!--
  The banner, at the page's top level so it stays stuck for the whole page:
  a floating glass panel, capped at the wide measure, lit
  where the pointer moves. It follows the page's theme and
  never carries `.dark`. Its actions keep the case radius. It marks itself
  with data-sticky-bar, so the page keeps a focused element clear of it. The
  skip link comes first and shows on focus. Below md the links and the
  secondary action fold into a sheet opened by "Menu". With `overlay`, its
  own height is taken back below it, so the first stage runs under it from
  the top of the page.
-->
<header
  data-slot="marketing-bar"
  data-sticky-bar
  data-mode="expressive"
  class={cn(
    "sticky top-0 z-10 h-(--size-bar)",
    overlay && "-mb-(--size-bar)",
    className,
  )}
>
  <a
    href="#main"
    data-slot="marketing-bar-skip-link"
    class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:rounded focus:bg-card focus:px-4 focus:py-2 focus:text-sm"
  >
    Skip to content
  </a>
  <div class="mx-auto h-full max-w-7xl px-(--gutter-stage) py-2">
    <div
      data-slot="marketing-bar-panel"
      class="glass flex h-full items-center gap-6 px-4"
      {@attach pointerLight}
    >
      <a
        href="/"
        aria-label={homeLabel}
        class="inline-flex min-h-12 shrink-0 items-center"
      >
        {@render logo("header")}
      </a>
      {#if links.length}
        <nav aria-label={label} class="hidden md:block">
          <ul class="flex items-center gap-6">
            {#each links as item, index (index)}
              <li><a href={item.href} class={link}>{item.label}</a></li>
            {/each}
          </ul>
        </nav>
      {/if}
      <div class="ms-auto flex items-center gap-2">
        {#if secondary}
          <Button
            href={secondary.href}
            variant="secondary"
            size="sm"
            class="hidden h-(--size-action-small) px-4 md:inline-flex"
            >{secondary.label}</Button
          >
        {/if}
        {#if primary}
          <Button
            href={primary.href}
            size="sm"
            class="h-(--size-action-small) px-4">{primary.label}</Button
          >
        {/if}
        {#if links.length || secondary}
          <Sheet.Root bind:open={menuOpen}>
            <Sheet.Trigger>
              {#snippet child({ props })}
                <Button
                  {...props}
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Menu"
                  class="md:hidden"
                >
                  <List aria-hidden="true" />
                </Button>
              {/snippet}
            </Sheet.Trigger>
            <Sheet.Content side="end">
              <Sheet.Header class="sr-only">
                <Sheet.Title>{homeLabel}</Sheet.Title>
              </Sheet.Header>
              {#if links.length}
                <nav aria-label={label}>
                  <ul class="flex flex-col items-start">
                    {#each links as item, index (index)}
                      <li>
                        <a
                          href={item.href}
                          class="inline-flex min-h-12 items-center text-foreground"
                          onclick={() => (menuOpen = false)}>{item.label}</a
                        >
                      </li>
                    {/each}
                  </ul>
                </nav>
              {/if}
              {#if secondary}
                <Button
                  href={secondary.href}
                  variant="secondary"
                  class="self-start"
                  onclick={() => (menuOpen = false)}>{secondary.label}</Button
                >
              {/if}
            </Sheet.Content>
          </Sheet.Root>
        {/if}
      </div>
    </div>
  </div>
</header>
