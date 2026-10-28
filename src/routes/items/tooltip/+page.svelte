<script lang="ts">
  import Copy from "phosphor-svelte/lib/Copy";
  import { Button } from "#lib/registry/ui/button";
  import * as Kbd from "#lib/registry/ui/kbd";
  import * as Tooltip from "#lib/registry/ui/tooltip";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

  // Open at load, and free to close when another tooltip opens.
  let deployOpen = $state(true);
</script>

<ItemHeader name="tooltip" />

<Tooltip.Provider>
  <PreviewSection
    id="variants"
    title="Variants"
    intro="One inverted chip, 4 px from its trigger. It opens on hover and on focus, stays while the pointer moves onto it, and closes on Escape."
  >
    <div class="flex flex-wrap items-end gap-8">
      <Specimen caption="repeats an icon button's name">
        <Tooltip.Root>
          <Tooltip.Trigger>
            {#snippet child({ props })}
              <Button
                {...props}
                size="icon"
                variant="secondary"
                aria-label="Copy"
              >
                <Copy aria-hidden="true" />
              </Button>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content>Copy</Tooltip.Content>
        </Tooltip.Root>
      </Specimen>
      <Specimen caption="shows a shortcut">
        <Tooltip.Root>
          <Tooltip.Trigger>
            {#snippet child({ props })}
              <Button {...props} variant="secondary">Run</Button>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content>
            Run <Kbd.Group
              ><Kbd.Root>Ctrl</Kbd.Root><Kbd.Root>Enter</Kbd.Root></Kbd.Group
            >
          </Tooltip.Content>
        </Tooltip.Root>
      </Specimen>
    </div>
  </PreviewSection>

  <PreviewSection id="states" title="States">
    <Specimen caption="open">
      <div class="pt-12">
        <Tooltip.Provider>
          <Tooltip.Root bind:open={deployOpen}>
            <Tooltip.Trigger>
              {#snippet child({ props })}
                <Button {...props} variant="secondary" size="sm">Deploy</Button>
              {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Content portalProps={{ disabled: true }}
              >Deploys main to production</Tooltip.Content
            >
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </Specimen>
  </PreviewSection>

  <PreviewSection id="accessibility" title="Accessibility">
    <ul class="grid max-w-prose list-disc gap-2 pl-6">
      <li>
        Opens on hover and focus, and becomes the trigger's description through
        <code>aria-describedby</code>; Escape closes it.
      </li>
      <li>
        Never an icon button's only name: the button keeps its
        <code>aria-label</code>, and the tooltip repeats it or adds a shortcut.
      </li>
    </ul>
  </PreviewSection>

  <PreviewSection
    id="keyboard"
    title="Keyboard"
    intro="One stop; focus opens the tooltip and Escape closes it."
  >
    <div data-testid="keyboard-fixture">
      <Tooltip.Root>
        <Tooltip.Trigger>
          {#snippet child({ props })}
            <Button
              {...props}
              size="icon"
              variant="secondary"
              aria-label="Copy"
            >
              <Copy aria-hidden="true" />
            </Button>
          {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Content>Copy</Tooltip.Content>
      </Tooltip.Root>
    </div>
  </PreviewSection>
</Tooltip.Provider>
