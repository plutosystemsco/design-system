<script lang="ts">
  import * as Accordion from "#lib/registry/ui/accordion";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

  // Three claims, for the single accordion.
  const claims = [
    {
      value: "sandbox",
      title: "Runs in a WebAssembly sandbox",
      body: "Your code runs in a WebAssembly instance that is created for the run and thrown away after it. Nothing it does outlives the run.",
    },
    {
      value: "isolation",
      title: "No network and no file system",
      body: "The sandbox is given no sockets and no directories. A program that tries to open either gets an error, not a connection.",
    },
    {
      value: "fuel",
      title: "A fuel budget stops runaway code",
      body: "Every instruction spends fuel. When the budget is spent the run is stopped, and the output so far is kept.",
    },
  ];

  // What a run reports, for the multiple accordion.
  const reports = [
    {
      value: "stdout",
      title: "Standard output",
      body: "Everything the program printed, in order, as plain text.",
    },
    {
      value: "stderr",
      title: "Standard error",
      body: "Warnings and the traceback, if the program raised. Shown as error output.",
    },
    {
      value: "fuel-spent",
      title: "Fuel spent",
      body: "The instructions the run used, against the budget of 30 billion.",
    },
  ];

  // How a run works, for the keyboard fixture. Each region on this page has
  // a name of its own: regions are landmarks, and landmarks must be unique.
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

<ItemHeader name="accordion" />

{#snippet single(
  items: { value: string; title: string; body: string }[],
  open: string,
)}
  <Accordion.Root type="single" value={open} class="max-w-md">
    {#each items as item (item.value)}
      <Accordion.Item value={item.value}>
        <Accordion.Trigger>{item.title}</Accordion.Trigger>
        <Accordion.Content>{item.body}</Accordion.Content>
      </Accordion.Item>
    {/each}
  </Accordion.Root>
{/snippet}

<PreviewSection
  id="variants"
  title="Variants"
  intro="Headings that each open a section, divided by grooves. One caret points right when a section is closed and down when it is open. No tint on the open item and no animation: the content appears at once."
>
  <div class="grid gap-8">
    <Specimen caption="single · one section open at a time" class="w-full">
      {@render single(claims, "sandbox")}
    </Specimen>
    <Specimen caption="multiple · several open" class="w-full">
      <Accordion.Root
        type="multiple"
        value={["stdout", "fuel-spent"]}
        class="max-w-md"
      >
        {#each reports as report (report.value)}
          <Accordion.Item value={report.value}>
            <Accordion.Trigger>{report.title}</Accordion.Trigger>
            <Accordion.Content>{report.body}</Accordion.Content>
          </Accordion.Item>
        {/each}
      </Accordion.Root>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <Specimen caption="a disabled item" class="w-full">
    <Accordion.Root type="single" class="max-w-md">
      <Accordion.Item value="open">
        <Accordion.Trigger>Open to everyone</Accordion.Trigger>
        <Accordion.Content>This section can be opened.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="closed" disabled>
        <Accordion.Trigger>Not available yet</Accordion.Trigger>
        <Accordion.Content>This section is disabled.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </Specimen>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      Each trigger is a button inside a heading (<code>level</code>, default 3)
      with <code>aria-expanded</code> and <code>aria-controls</code> naming its section.
    </li>
    <li>
      Each section is a <code>region</code> labelled by its trigger, so a reader can
      jump from panel to panel. Keep an accordion to six sections or fewer; past that,
      the regions clutter the landmark list.
    </li>
    <li>
      Enter and Space toggle a section; Down, Up, Home and End move among the
      triggers; each trigger is a Tab stop.
    </li>
    <li>
      The caret shows the state by shape, not colour alone, and is hidden from
      assistive technology.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="Three stops: the three triggers. ArrowDown moves focus; Enter opens the section and shows the region its aria-controls names."
>
  <div data-testid="keyboard-fixture">{@render single(steps, "send")}</div>
</PreviewSection>
