<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { CodeEditor, pythonSetup } from "#lib/registry/ui/code-editor";
  import * as Kbd from "#lib/registry/ui/kbd";
  import { Status } from "#lib/registry/ui/status";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
  import { PI, SHORT } from "./example";

  // One preset, made once: the component reconfigures when it changes.
  const python = pythonSetup();

  let value = $state(PI);
  let editor: CodeEditor | undefined = $state();
  let runs = $state(0);
  const ran = $derived(runs === 1 ? "Ran 1 time" : `Ran ${runs} times`);
  const lines = $derived(value.split("\n"));

  let keyboardRuns = $state(0);
  const keyboardRan = $derived(
    keyboardRuns === 1 ? "Ran 1 time" : `Ran ${keyboardRuns} times`,
  );
</script>

<ItemHeader name="code-editor" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="CodeMirror 6 on the muted ground the code block shares, every colour and size from the tokens. It grows with its document, scrolls long lines sideways, and binds no Tab. The code is in the page before any script runs, as a plain pre that the editor replaces on mount."
>
  <div class="grid max-w-2xl gap-8">
    <Specimen caption="pythonSetup() · bind:value · onrun" class="w-full">
      <div class="grid w-full gap-3" data-testid="editor-main">
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
            onclick={() => editor?.reset(PI)}>Reset</Button
          >
          <Kbd.Group
            ><Kbd.Root>Ctrl</Kbd.Root><Kbd.Root>Enter</Kbd.Root></Kbd.Group
          >
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
        <p
          data-testid="bound-value"
          class="font-mono text-xs text-muted-foreground"
        >
          bound value · {lines.length} lines · last line
          <code class="text-foreground">{lines[lines.length - 1]}</code>
        </p>
      </div>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="Read-only keeps the stop and the selection and says aria-readonly: the state while a run is in flight, so focus does not jump when the result arrives. Disabled is not editable and leaves the tab order."
>
  <div class="grid max-w-2xl gap-8">
    <Specimen caption="readonly" class="w-full">
      <div class="w-full" data-testid="editor-readonly">
        <CodeEditor
          value={SHORT}
          label="Read-only example"
          extensions={python}
          readonly
        />
      </div>
    </Specimen>
    <Specimen caption="disabled" class="w-full">
      <div class="w-full" data-testid="editor-disabled">
        <CodeEditor
          value={SHORT}
          label="Disabled example"
          extensions={python}
          disabled
        />
      </div>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      The content is a <code>textbox</code> with <code>aria-multiline</code>,
      named by the required <code>label</code> prop and described by the visible
      text <code>describedby</code> names. Say the keys there, as this page does.
    </li>
    <li>
      <strong>Tab leaves the editor.</strong> Nothing binds Tab, so there is no
      keyboard trap; <code>Mod-]</code> and <code>Mod-[</code> indent. An app
      that binds Tab owes its users the words "press Escape, then Tab, to leave"
      beside the editor and in <code>aria-describedby</code>.
    </li>
    <li>
      One focus ring, around the whole editor including the gutter, drawn by
      <code>.cm-editor</code> from the focus tokens. The root has no
      <code>overflow-hidden</code>, so the ring is never clipped.
    </li>
    <li>
      Selection and caret are the browser's own, so they stay readable by the
      platform's design. The caret is the browser's own. The editor itself runs
      no animation.
    </li>
    <li>
      Before the script runs, the prerendered <code>pre</code> is a
      <code>group</code> named by the same <code>label</code>: a named group of
      lines until the editor mounts. A bare <code>pre</code> may not carry a name,
      so the role is what lets the name be exposed.
    </li>
    <li>
      <code>Ctrl Enter</code> and <code>Cmd Enter</code> both call
      <code>onrun</code>; the default "insert blank line" is suppressed.
    </li>
    <li>
      The theme reads <code>:root</code> names wherever one exists and five
      <code>@theme inline</code> names (<code>--spacing</code>,
      <code>--text-sm</code>, <code>--text-sm--line-height</code>,
      <code>--font-mono</code>, <code>--font-weight-medium</code>), which
      Tailwind emits because the theme file is among its sources. An app that
      narrows <code>@source</code> keeps the editor's folder in.
    </li>
    <li>
      No height is set: the editor grows with its document. Cap it in the app
      with a class such as <code>max-h-96</code> when an inner scroll is wanted.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="Three stops: a button, the editor, a button. Tab enters and leaves the editor with the document unchanged; Ctrl Enter runs it and inserts no line."
>
  <div class="grid max-w-2xl gap-3" data-testid="keyboard-fixture">
    <div class="flex flex-wrap items-center gap-3">
      <Button size="sm" variant="secondary">Before</Button>
      <Status
        visible
        data-testid="kb-run-count"
        class="text-sm text-muted-foreground"
        text={keyboardRan}
      />
    </div>
    <CodeEditor
      value={SHORT}
      label="Keyboard example"
      extensions={python}
      onrun={() => keyboardRuns++}
    />
    <div><Button size="sm" variant="secondary">After</Button></div>
  </div>
</PreviewSection>
