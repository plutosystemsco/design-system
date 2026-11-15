<script lang="ts" module>
  export const meta = {
    title: "States",
    intro:
      "Read-only keeps the stop and the selection and says aria-readonly: the state while a run is in flight, so focus does not jump when the result arrives. Disabled is not editable and leaves the tab order. In a card, the editor is told by the hairline.",
  };
</script>

<script lang="ts">
  import * as Card from "#lib/registry/ui/card";
  import { CodeEditor, pythonSetup } from "#lib/registry/ui/code-editor";
  import { SHORT } from "./example";

  const python = pythonSetup();
</script>

<div class="grid max-w-2xl gap-8">
  <Card.Root class="w-full">
    <Card.Content>
      <div class="w-full" data-testid="editor-readonly">
        <CodeEditor
          value={SHORT}
          label="Read-only example"
          extensions={python}
          readonly
        />
      </div>
    </Card.Content>
  </Card.Root>
  <div class="w-full" data-testid="editor-disabled">
    <CodeEditor
      value={SHORT}
      label="Disabled example"
      extensions={python}
      disabled
    />
  </div>
</div>
