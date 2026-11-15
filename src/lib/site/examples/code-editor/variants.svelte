<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "CodeMirror 6 on the code ground the code block shares, edged by the same hairline, every colour and size from the tokens. Its colour comes from the highlighter, the same tree-sitter session a code block streams through, so the editor colours code exactly as the block does. It grows with its document, scrolls long lines sideways, and binds no Tab. The code is in the page before any script runs, as a plain pre that the editor replaces on mount. It opens on a decorated class: a docstring, annotations, a property, self, an f-string and built-ins.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { CodeEditor, pythonSetup } from "#lib/registry/ui/code-editor";
  import * as Field from "#lib/registry/ui/field";
  import * as Kbd from "#lib/registry/ui/kbd";
  import * as NativeSelect from "#lib/registry/ui/native-select";
  import { Status } from "#lib/registry/ui/status";
  import { EDGE, LONG, PYTHON_CLASS } from "./example";

  // One preset, made once: the component reconfigures when it changes.
  const python = pythonSetup();

  // The class sample; a long file, whose tail is parsed in idle time;
  // Python's edge cases (a shebang, a def-line comment, keyword arguments
  // named like built-ins). Chosen through reset(), as an app loads a file.
  const examples: Record<string, { title: string; code: string }> = {
    class: { title: "A decorated class", code: PYTHON_CLASS },
    long: { title: "A long file, 40 lines of 180 characters", code: LONG },
    edge: { title: "Python's edge cases", code: EDGE },
  };
  let example = $state("class");

  let value = $state(PYTHON_CLASS);
  let editor: CodeEditor | undefined = $state();
  let runs = $state(0);
  const ran = $derived(runs === 1 ? "Ran 1 time" : `Ran ${runs} times`);
  const lines = $derived(value.split("\n"));
</script>

<div class="grid max-w-2xl gap-3" data-testid="editor-main">
  <Field.Field class="max-w-xs">
    <Field.Label>Example</Field.Label>
    <NativeSelect.Root
      bind:value={example}
      data-testid="example-select"
      onchange={() => editor?.reset(examples[example].code)}
    >
      {#each Object.entries(examples) as [id, entry] (id)}
        <NativeSelect.Option value={id}>{entry.title}</NativeSelect.Option>
      {/each}
    </NativeSelect.Root>
  </Field.Field>
  <CodeEditor
    bind:this={editor}
    bind:value
    label="Python example"
    describedby="editor-hint"
    extensions={python}
    onrun={() => runs++}
  />
  <div class="flex flex-wrap items-center gap-3">
    <Button size="sm" onclick={() => runs++}>Run</Button>
    <Button
      size="sm"
      variant="secondary"
      onclick={() => editor?.reset(examples[example].code)}>Reset</Button
    >
    <Kbd.Group><Kbd.Root>Ctrl</Kbd.Root><Kbd.Root>Enter</Kbd.Root></Kbd.Group>
    <Status
      visible
      data-testid="run-count"
      class="text-sm text-muted-foreground"
      text={ran}
    />
  </div>
  <p id="editor-hint" class="text-sm text-muted-foreground">
    Ctrl Enter runs the example. Tab leaves the editor.
  </p>
  <p data-testid="bound-value" class="font-mono text-xs text-muted-foreground">
    the bound value has {lines.length} lines; its last line is
    <code class="text-foreground">{lines[lines.length - 1]}</code>
  </p>
</div>
