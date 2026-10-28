<script lang="ts">
  import * as Tabs from "#lib/registry/ui/tabs";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
</script>

<ItemHeader name="tabs" />

{#snippet three(variant: "default" | "line", disabled = false)}
  <Tabs.Root value="overview" class="w-full max-w-md">
    <Tabs.List {variant}>
      <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
      <Tabs.Trigger value="logs">Logs</Tabs.Trigger>
      <Tabs.Trigger value="settings" {disabled}>Settings</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="overview">All 212 tests passed.</Tabs.Content>
    <Tabs.Content value="logs">No warnings in this run.</Tabs.Content>
    <Tabs.Content value="settings">Runs on every push to main.</Tabs.Content>
  </Tabs.Root>
{/snippet}

<PreviewSection
  id="variants"
  title="Variants"
  intro="The pill strip, on the muted inset, and the line variant, underlined in the foreground colour."
>
  <div class="grid gap-12">
    <Specimen caption="default" class="w-full"
      >{@render three("default")}</Specimen
    >
    <Specimen caption="line" class="w-full">{@render three("line")}</Specimen>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <div class="grid gap-12">
    <Specimen caption="a disabled tab" class="w-full"
      >{@render three("default", true)}</Specimen
    >
    <Specimen caption="vertical" class="w-full">
      <Tabs.Root value="general" orientation="vertical" class="w-full max-w-md">
        <Tabs.List>
          <Tabs.Trigger value="general">General</Tabs.Trigger>
          <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="general">Name, region and owner.</Tabs.Content>
        <Tabs.Content value="billing">Plan and invoices.</Tabs.Content>
      </Tabs.Root>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      A <code>tablist</code> of <code>tab</code>s with
      <code>aria-selected</code>, and a <code>tabpanel</code> for each.
    </li>
    <li>
      One stop for the list; Left and Right move between tabs, Home and End
      jump, and selection follows focus. The panel is a stop.
    </li>
    <li>
      The active pill has an input border and darker text, so its state is not
      told by its fill alone.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="Four stops: the pill list's active tab, its panel, the line list's active tab, its panel."
>
  <div data-testid="keyboard-fixture" class="grid gap-8">
    {@render three("default")}
    {@render three("line")}
  </div>
</PreviewSection>
