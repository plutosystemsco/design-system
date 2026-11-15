<script lang="ts" module>
  export const meta = {
    title: "The head script",
    intro:
      "ThemeScript renders this inline script into the head of every page, so the class is set before first paint and prerendering keeps it. Render it once, in the root layout. An app with a Content Security Policy passes nonce.",
  };
</script>

<script lang="ts">
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import { THEME_SCRIPT } from "#lib/registry/ui/theme";

  const layout = `<script lang="ts">
  import { ThemeScript } from "#lib/components/ui/theme";
<\/script>

<ThemeScript />
{@render children()}`;
</script>

<div class="grid max-w-2xl gap-6">
  <div class="grid gap-2">
    <p class="text-sm text-muted-foreground">The script, as rendered</p>
    <CodeBlock.Root>
      <CodeBlock.Content
        code={THEME_SCRIPT}
        lineNumbers
        role="region"
        aria-label="The head script, as it is inlined"
      />
    </CodeBlock.Root>
  </div>
  <div class="grid gap-2">
    <p class="text-sm text-muted-foreground">The root layout</p>
    <CodeBlock.Root>
      <CodeBlock.Content
        code={layout}
        lineNumbers
        role="region"
        aria-label="The root layout, with the script"
      />
    </CodeBlock.Root>
  </div>
</div>
