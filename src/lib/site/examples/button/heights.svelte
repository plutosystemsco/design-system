<script lang="ts" module>
  export const meta = {
    title: "Heights",
    intro:
      "Default controls are 48 px tall and small ones 32 px, so a form or a toolbar lines up.",
  };
</script>

<script lang="ts">
  import Copy from "phosphor-svelte/lib/Copy";
  import Plus from "phosphor-svelte/lib/Plus";
  import { Button } from "#lib/registry/ui/button";
  import { Input } from "#lib/registry/ui/input";
  import * as InputGroup from "#lib/registry/ui/input-group";
  import * as InputOTP from "#lib/registry/ui/input-otp";
  import * as NativeSelect from "#lib/registry/ui/native-select";
</script>

<div data-testid="heights" class="flex flex-wrap items-start gap-4">
  <Button data-testid="height-button">Continue</Button>
  <Button
    data-testid="height-icon"
    size="icon"
    variant="secondary"
    aria-label="Copy"
  >
    <Copy aria-hidden="true" />
  </Button>
  <div class="w-48">
    <Input data-testid="height-input" aria-label="Email" placeholder="Email" />
  </div>
  <div class="w-48">
    <NativeSelect.Root data-testid="height-select" aria-label="Region">
      <NativeSelect.Option value="eu">Europe</NativeSelect.Option>
      <NativeSelect.Option value="us">Americas</NativeSelect.Option>
    </NativeSelect.Root>
  </div>
  <div class="w-64">
    <InputGroup.Root data-testid="height-input-group">
      <InputGroup.Input aria-label="Search" placeholder="Search" />
      <InputGroup.Addon align="inline-end">
        <InputGroup.Text>⌘K</InputGroup.Text>
      </InputGroup.Addon>
    </InputGroup.Root>
  </div>
  <div data-testid="height-otp">
    <InputOTP.Root maxlength={6} aria-label="Code">
      {#snippet children({ cells })}
        <InputOTP.Group>
          {#each cells.slice(0, 3) as cell, i (i)}
            <InputOTP.Slot {cell} />
          {/each}
        </InputOTP.Group>
      {/snippet}
    </InputOTP.Root>
  </div>
  <Button data-testid="height-sm" size="sm" variant="secondary">Small</Button>
  <Button
    data-testid="height-icon-sm"
    size="icon-sm"
    variant="ghost"
    aria-label="Add"
  >
    <Plus aria-hidden="true" />
  </Button>
</div>
