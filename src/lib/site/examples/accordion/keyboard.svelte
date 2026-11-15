<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "Three stops: the three triggers. ArrowDown moves focus; Enter opens the section and shows the region its aria-controls names.",
  };
</script>

<script lang="ts">
  import * as Accordion from "#lib/registry/ui/accordion";

  // How a run works. Each region on the page has a name of its own: regions
  // are landmarks, and landmarks must be unique.
  const steps = [
    {
      value: "send",
      title: "Your code is sent to the sandbox",
      body: "The editor's text goes to a fresh WebAssembly instance.",
    },
    {
      value: "run",
      title: "The sandbox runs it",
      body: "Python 3.13 runs the code with no network and no file system.",
    },
    {
      value: "report",
      title: "The result comes back",
      body: "Output, errors and the fuel spent are shown under the editor.",
    },
  ];
</script>

<div data-testid="keyboard-fixture">
  <Accordion.Root type="single" value="send" class="max-w-md">
    {#each steps as step (step.value)}
      <Accordion.Item value={step.value}>
        <Accordion.Trigger>{step.title}</Accordion.Trigger>
        <Accordion.Content>{step.body}</Accordion.Content>
      </Accordion.Item>
    {/each}
  </Accordion.Root>
</div>
