<script lang="ts" module>
  export const meta = {
    kind: "dont",
    pair: "words",
    title: "Don't: a paragraph",
    caption: "A 45-word toast in two paragraphs.",
    breaks: "Too long to read in the time, and too long to hear.",
  };
</script>

<script lang="ts">
  import { Toast } from "#lib/registry/ui/toast";
</script>

<div inert>
  <ol class="grid max-w-sm gap-2">
    <Toast
      kind="info"
      title="We have finished preparing the export you asked for earlier today"
      description="It holds every run from the last quarter, with their logs and the crew's notes, and it stays in Downloads for thirty days. After that, make another from the Runs page whenever you need one."
    />
  </ol>
</div>
