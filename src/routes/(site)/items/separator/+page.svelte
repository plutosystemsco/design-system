<script lang="ts">
  import { Separator } from "#lib/registry/ui/separator";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
</script>

<ItemHeader name="separator" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="Horizontal is the groove: a hairline with a 1 px highlight beneath it on paper, a plain hairline on ink. Vertical is a plain hairline."
>
  <div class="grid gap-12">
    <Specimen caption="horizontal" class="w-full">
      <div class="w-full max-w-md">
        <p class="text-sm">Account</p>
        <Separator class="my-4" />
        <p class="text-sm">Billing</p>
      </div>
    </Specimen>
    <Specimen caption="vertical">
      <div class="flex h-8 items-center gap-4 text-sm">
        <span>Runs</span>
        <Separator orientation="vertical" />
        <span>Logs</span>
        <Separator orientation="vertical" />
        <span>Settings</span>
      </div>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <Specimen caption="decorative={false}" class="w-full">
    <div class="w-full max-w-md">
      <p class="text-sm">Before</p>
      <Separator decorative={false} class="my-4" />
      <p class="text-sm">After</p>
    </div>
  </Specimen>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      Decorative by default: <code>role="none"</code>, hidden from assistive
      technology.
    </li>
    <li>
      Pass <code>decorative={"{false}"}</code> for a separator that means
      something; it then renders <code>role="separator"</code> with its orientation.
    </li>
  </ul>
</PreviewSection>
