<script lang="ts" module>
  export const meta = {
    title: "States",
    intro:
      "The store holds a preference: light, dark or system. A visitor who never chose follows the system, and a choice can be undone. The toggle writes a choice; a menu built from dropdown-menu and theme.set can offer all three.",
  };
</script>

<script lang="ts">
  import { buttonVariants } from "#lib/registry/ui/button";
  import * as DropdownMenu from "#lib/registry/ui/dropdown-menu";
  import { theme, type ThemePreference } from "#lib/registry/ui/theme";

  const choices: [ThemePreference, string][] = [
    ["light", "Light"],
    ["dark", "Dark"],
    ["system", "System"],
  ];
</script>

<div class="grid justify-items-start gap-6">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      class={buttonVariants({ variant: "secondary", size: "sm" })}
      >Theme</DropdownMenu.Trigger
    >
    <DropdownMenu.Content label="Theme">
      <DropdownMenu.RadioGroup
        bind:value={
          () => theme.preference, (value) => theme.set(value as ThemePreference)
        }
      >
        {#each choices as [value, label] (value)}
          <DropdownMenu.RadioItem {value}>{label}</DropdownMenu.RadioItem>
        {/each}
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
  <p class="max-w-prose text-sm text-muted-foreground">
    Preference <code>{theme.preference}</code>, in force
    <code>{theme.resolved}</code>. The key is <code>pluto-theme</code>: written
    on a choice, removed for system. A change in another tab is followed through
    the storage event.
  </p>
</div>
