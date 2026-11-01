<script lang="ts">
  import { buttonVariants } from "#lib/registry/ui/button";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import * as DropdownMenu from "#lib/registry/ui/dropdown-menu";
  import {
    theme,
    ThemeToggle,
    THEME_SCRIPT,
    type ThemePreference,
  } from "#lib/registry/ui/theme";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

  const choices: [ThemePreference, string][] = [
    ["light", "Light"],
    ["dark", "Dark"],
    ["system", "System"],
  ];

  const layout = `<script lang="ts">
  import { ThemeScript } from "$lib/registry/ui/theme";
<\/script>

<ThemeScript />
{@render children()}`;
</script>

<ItemHeader name="theme" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="A pressed button named Dark theme, at 48 or 32 px, that chooses the opposite of what is in force. Every toggle on a page reads one store, so they agree. The header's toggle above is this item."
>
  <div class="flex flex-wrap items-start gap-8">
    <Specimen caption="icon, 48 px">
      <ThemeToggle data-testid="theme-toggle-icon" />
    </Specimen>
    <Specimen caption="icon-sm, 32 px">
      <ThemeToggle size="icon-sm" data-testid="theme-toggle-icon-sm" />
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="The store holds a preference: light, dark, or system. A visitor who never chose follows the system, and a choice can be undone. The toggle writes a choice; a menu can offer all three."
>
  <div class="grid gap-8">
    <Specimen caption="a three-way menu from dropdown-menu and theme.set">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          class={buttonVariants({ variant: "secondary", size: "sm" })}
          >Theme</DropdownMenu.Trigger
        >
        <DropdownMenu.Content label="Theme">
          <DropdownMenu.RadioGroup
            bind:value={
              () => theme.preference,
              (value) => theme.set(value as ThemePreference)
            }
          >
            {#each choices as [value, label] (value)}
              <DropdownMenu.RadioItem {value}>{label}</DropdownMenu.RadioItem>
            {/each}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Specimen>
    <p class="max-w-prose text-sm text-muted-foreground">
      Preference <code>{theme.preference}</code>, in force
      <code>{theme.resolved}</code>. The key is <code>pluto-theme</code>:
      written on a choice, removed for system. A change in another tab is
      followed through the storage event.
    </p>
  </div>
</PreviewSection>

<PreviewSection
  id="script"
  title="The head script"
  intro="ThemeScript renders this inline script into the head of every page, so the class is set before first paint and prerendering keeps it. Render it once, in the root layout. An app with a Content Security Policy passes nonce."
>
  <div class="grid max-w-2xl gap-8">
    <Specimen caption="the script, as rendered" class="w-full">
      <CodeBlock.Root>
        <CodeBlock.Content code={THEME_SCRIPT} lineNumbers />
      </CodeBlock.Root>
    </Specimen>
    <Specimen caption="the root layout" class="w-full">
      <CodeBlock.Root>
        <CodeBlock.Content code={layout} lineNumbers />
      </CodeBlock.Root>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      One control, one state: a button named "Dark theme" with
      <code>aria-pressed</code>, pressed when dark is in force. Space and Enter
      flip it.
    </li>
    <li>
      Before hydration the button states no pressed value, since the server
      cannot know the theme the head script chose; it is set at mount, with
      <code>data-ready</code>.
    </li>
    <li>
      The icons are hidden from assistive technology; the name is the label.
    </li>
    <li>
      The class is set before first paint, so a page never flashes the wrong
      theme on load.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="One stop: the toggle. Space flips aria-pressed and the dark class; Space again restores both."
>
  <div data-testid="keyboard-fixture"><ThemeToggle size="icon-sm" /></div>
</PreviewSection>
