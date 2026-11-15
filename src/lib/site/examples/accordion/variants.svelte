<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "Headings that each open a section, divided by grooves: single opens one section at a time, multiple opens several. One caret points right when a section is closed and down when it is open. No tint on the open item and no animation: the content appears at once.",
  };
</script>

<script lang="ts">
  import * as Accordion from "#lib/registry/ui/accordion";

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

  // What a run reports, for the multiple accordion. Each region on the page
  // has a name of its own: regions are landmarks, and landmarks must be unique.
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
</script>

<div class="grid gap-8">
  <Accordion.Root type="single" value="sandbox" class="max-w-md">
    {#each claims as claim (claim.value)}
      <Accordion.Item value={claim.value}>
        <Accordion.Trigger>{claim.title}</Accordion.Trigger>
        <Accordion.Content>{claim.body}</Accordion.Content>
      </Accordion.Item>
    {/each}
  </Accordion.Root>
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
</div>
