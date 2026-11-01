<script lang="ts">
  import { IsMobile } from "#lib/registry/hooks/is-mobile.svelte.js";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";

  const mobile = new IsMobile();
  const source = `import { MediaQuery } from "svelte/reactivity";

const DEFAULT_MOBILE_BREAKPOINT = 768;

export class IsMobile extends MediaQuery {
  constructor(breakpoint: number = DEFAULT_MOBILE_BREAKPOINT) {
    super(\`max-width: \${breakpoint - 1}px\`);
  }
}`;
</script>

<ItemHeader name="is-mobile" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="A media-query store: true below 768 px, false from 768 up, and false on the server, where no width is known. Resize the window to see it change."
>
  <p class="text-sm">
    This window is
    <strong>{mobile.current ? "below" : "at or above"} 768 px wide</strong>.
  </p>
  <div class="mt-6 max-w-2xl">
    <CodeBlock.Root>
      <CodeBlock.Header>
        <CodeBlock.Title>is-mobile.svelte.ts</CodeBlock.Title>
      </CodeBlock.Header>
      <CodeBlock.Content code={source} lineNumbers />
    </CodeBlock.Root>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="The sidebar reads it to choose which tree exists: a sheet below 768 px, a sticky column above. CSS alone cannot turn a panel into a dialog."
>
  <p class="max-w-prose text-sm text-muted-foreground">
    A page prerenders the desktop tree, hidden below 768 px by a class until
    hydration replaces it with the sheet, so nothing flashes. With JavaScript
    off a phone has no sidebar and no way to open one; a desktop has the
    sidebar, expanded, with its trigger dead.
  </p>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      It decides behaviour, not appearance: hide and show by a class where a
      class will do, and reach for the store only where the component tree must
      differ.
    </li>
    <li>
      Its server value is <code>false</code>, so a prerendered page is the
      desktop page and a phone sees it only after hydration.
    </li>
  </ul>
</PreviewSection>
