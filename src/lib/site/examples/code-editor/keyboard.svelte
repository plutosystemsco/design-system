<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "Three stops: a button, the editor, a button. Tab enters and leaves the editor with the document unchanged; Ctrl Enter runs it and inserts no line.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { CodeEditor, pythonSetup } from "#lib/registry/ui/code-editor";
  import { Status } from "#lib/registry/ui/status";
  import { SHORT } from "./example";

  const python = pythonSetup();

  let runs = $state(0);
  const ran = $derived(runs === 1 ? "Ran 1 time" : `Ran ${runs} times`);
</script>

<div class="grid max-w-2xl gap-3" data-testid="keyboard-fixture">
  <div class="flex flex-wrap items-center gap-3">
    <Button size="sm" variant="secondary">Before</Button>
    <Status
      visible
      data-testid="kb-run-count"
      class="text-sm text-muted-foreground"
      text={ran}
    />
  </div>
  <CodeEditor
    value={SHORT}
    label="Keyboard example"
    extensions={python}
    onrun={() => runs++}
  />
  <div><Button size="sm" variant="secondary">After</Button></div>
</div>
