<script lang="ts">
  import * as Avatar from "#lib/registry/ui/avatar";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

  const sizes = ["sm", "default", "lg"] as const;
</script>

<ItemHeader name="avatar" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="A person's image, or their initials on the muted inset, at the 8 px case radius. Only the mark and the radio are round."
>
  <div class="flex flex-wrap items-end gap-8">
    {#each sizes as size (size)}
      <Specimen caption={size}>
        <Avatar.Root {size}>
          <Avatar.Fallback>CG</Avatar.Fallback>
        </Avatar.Root>
      </Specimen>
    {/each}
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <Specimen caption="a group with a count">
    <Avatar.Group>
      <Avatar.Root><Avatar.Fallback>CG</Avatar.Fallback></Avatar.Root>
      <Avatar.Root><Avatar.Fallback>AL</Avatar.Fallback></Avatar.Root>
      <Avatar.Root><Avatar.Fallback>MK</Avatar.Fallback></Avatar.Root>
      <Avatar.GroupCount>+4</Avatar.GroupCount>
    </Avatar.Group>
  </Specimen>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>The image needs <code>alt</code> from the app.</li>
    <li>
      The fallback's initials are text. This page shows no image, because the
      preview ships no image file.
    </li>
  </ul>
</PreviewSection>
