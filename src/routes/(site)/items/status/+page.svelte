<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { Status } from "#lib/registry/ui/status";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

  let text = $state("");
</script>

<ItemHeader name="status" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="Hidden by default, so only a screen reader hears it; visible when the words also belong on screen. Both are empty until the Keyboard section below sets their text."
>
  <div class="flex flex-wrap items-start gap-8" data-testid="status-specimens">
    <Specimen caption="hidden (default)">
      <Status {text} data-testid="status-hidden" />
      <p class="text-sm text-muted-foreground">Nothing to see: it is heard.</p>
    </Specimen>
    <Specimen caption="visible">
      <Status
        {text}
        visible
        class="min-h-6 min-w-48 text-sm"
        data-testid="status-visible"
      />
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="Empty at first render, so the region is in the page before anything changes it. With text, it says that text once. A visible status takes the colour of its context."
>
  <div class="flex flex-wrap items-start gap-8">
    <Specimen caption="empty">
      <Status visible class="min-h-6 min-w-48 rounded border border-border" />
    </Specimen>
    <Specimen caption="with text · text-success">
      <Status visible text="Saved" class="text-sm text-success" />
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      <code>role="status"</code> with <code>aria-live="polite"</code>, which
      some screen readers need although the role implies it, and
      <code>aria-atomic="true"</code>, so a change reads the whole message.
    </li>
    <li>
      Present at mount, empty. A region announces only if it was in the page
      before its text changed: mount it first, then set the text.
    </li>
    <li>
      New text replaces the old and is announced. <code>""</code> clears it silently.
      The same text twice is not announced again, so put a working message, such as
      "Saving…", between two results.
    </li>
    <li>
      Polite only. An error that must interrupt is an error summary or a
      destructive alert.
    </li>
  </ul>
</PreviewSection>

<PreviewSection id="keyboard" title="Keyboard">
  <div class="flex flex-wrap gap-3" data-testid="keyboard-fixture">
    <Button
      variant="secondary"
      onclick={() => (text = "Copied to the clipboard")}>Announce</Button
    >
    <Button variant="secondary" onclick={() => (text = "")}>Clear</Button>
  </div>
</PreviewSection>
