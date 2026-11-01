<script lang="ts" module>
  /** One primary link: its visible label and its href. */
  export type AppShellLink = { label: string; href: string };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { cn } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    links,
    current,
    label = "Primary",
    vertical = false,
    class: className,
    ...restProps
  }: HTMLAttributes<HTMLElement> & {
    links: AppShellLink[];
    /** The current page's href, from `page.url`: it gets `aria-current="page"` and the underline. */
    current?: string;
    /** The landmark's name. */
    label?: string;
    /** A column, for the phone's sheet. */
    vertical?: boolean;
  } = $props();
</script>

<!--
  A navigation landmark of text links, 48 px tall with no side padding, in
  the foreground colour. The current page is told by aria-current and an
  underline, so the state is shape, not colour. The bracketed variant:
  Tailwind's aria-current: matches only aria-current="true".
-->
<nav
  data-slot="app-shell-nav"
  aria-label={label}
  class={cn(className)}
  {...restProps}
>
  <ul
    class={cn("flex", vertical ? "flex-col items-start" : "items-center gap-6")}
  >
    {#each links as link (link.href)}
      <li>
        <Button
          variant="link"
          href={link.href}
          aria-current={current === link.href ? "page" : undefined}
          class="text-foreground no-underline aria-[current=page]:underline"
        >
          {link.label}
        </Button>
      </li>
    {/each}
  </ul>
</nav>
