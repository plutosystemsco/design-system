<script lang="ts">
  import * as Table from "#lib/registry/ui/table";
  import { inlines, type Inline } from "#lib/site/changelog";
  import Leaf from "#lib/site/page/leaf.svelte";
  import Snippet from "#lib/site/page/snippet.svelte";
  import { sitePage } from "#lib/site/sitemap";
  import {
    BEFORE,
    GUIDE_PATH,
    SECTIONS,
    UNCHANGED,
    UNTIL,
    WHO,
  } from "#lib/site/upgrade/0.13.0";
  import type { Rename } from "#lib/site/upgrade/renames";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const page = sitePage(GUIDE_PATH)!;
  const link = "text-primary underline underline-offset-4";
  const h2 = "text-2xl font-semibold tracking-section";

  // 020 decision 12: the five parts, in order; each later specification's
  // section joins the third.
  const sections = [
    { id: "who", title: "Who this is for" },
    { id: "before", title: "Before you start" },
    ...SECTIONS.map((s) => ({ id: s.id, title: s.title })),
    { id: "until-0-14-0", title: `What keeps working until ${UNTIL.release}` },
    { id: "unchanged", title: "What did not change" },
  ];

  /** When the old name stops working. */
  const until = (r: Rename) =>
    r.alias !== "none"
      ? r.alias
      : r.kind === "site page"
        ? "Redirects, always"
        : "Now";

  const commands = (id: string) =>
    data.sections.find((s) => s.id === id)?.steps ?? [];
</script>

{#snippet text(source: string)}
  {#each inlines(source) as x, i (i)}{@render inline(x)}{/each}
{/snippet}

{#snippet inline(x: Inline)}
  {#if x.kind === "code"}<code>{x.text}</code
    >{:else if x.kind === "strong"}<strong>{x.text}</strong
    >{:else if x.kind === "href"}<a href={x.href} class={link}>{x.text}</a
    >{:else}{x.text}{/if}
{/snippet}

<Leaf door={null} title={page.title} summary={page.summary} {sections}>
  <div class="grid gap-4">
    <p>
      0.13.0 renames the system's code names to Kuiper. This page says what to
      change in an app that installed an earlier release, in the order to do it.
      The <a href="/changelog/#v0-13-0" class={link}>changelog</a> lists the same
      changes, part by part.
    </p>
  </div>

  <section
    aria-labelledby="who"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="who" class={h2}>Who this is for</h2>
    {#each WHO as p, i (i)}<p>{@render text(p)}</p>{/each}
  </section>

  <section
    aria-labelledby="before"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="before" class={h2}>Before you start</h2>
    <p>{@render text(BEFORE.text)}</p>
    {#if data.before}
      <Snippet
        code={data.before.code}
        lines={data.before.lines}
        label="This release's registry"
        language="bash"
      />
    {/if}
  </section>

  {#each SECTIONS as section (section.id)}
    <section
      aria-labelledby={section.id}
      data-section={section.id}
      class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
    >
      <h2 id={section.id} class={h2}>{section.title}</h2>
      <p>{@render text(section.summary)}</p>
      {#if section.renames.length}
        <Table.Root label="Renamed names">
          <Table.Header>
            <Table.Row>
              <Table.Head>Old name</Table.Head>
              <Table.Head>New name</Table.Head>
              <Table.Head>Who sees it</Table.Head>
              <Table.Head>What to do</Table.Head>
              <Table.Head>Old name works until</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each section.renames as r (`${r.kind} ${r.old}`)}
              <Table.Row>
                <Table.Cell class="align-top"><code>{r.old}</code></Table.Cell>
                <Table.Cell class="align-top"><code>{r.new}</code></Table.Cell>
                <Table.Cell class="min-w-48 align-top whitespace-normal"
                  >{r.kind}. {@render text(r.seenBy)}</Table.Cell
                >
                <Table.Cell class="min-w-48 align-top whitespace-normal"
                  >{@render text(r.todo)}</Table.Cell
                >
                <Table.Cell class="align-top">{until(r)}</Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      {/if}
      <h3 class="site-h3 mt-4">The steps, in order</h3>
      <ol class="grid list-decimal gap-6 ps-6">
        {#each section.steps as step, i (i)}
          {@const command = commands(section.id)[i]}
          <li data-step={i + 1} class="grid grid-cols-[minmax(0,1fr)] gap-3">
            <p>{@render text(step.text)}</p>
            {#if command}
              <div data-command>
                <Snippet
                  code={command.code}
                  lines={command.lines}
                  label={`Step ${i + 1}`}
                  name={`${section.title}, step ${i + 1}`}
                  language={step.language ?? "bash"}
                />
              </div>
            {/if}
          </li>
        {/each}
      </ol>
    </section>
  {/each}

  <section
    aria-labelledby="until-0-14-0"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="until-0-14-0" class={h2}>
      What keeps working until {UNTIL.release}
    </h2>
    <p>
      These old names still work in 0.13.0. Each goes in {UNTIL.release}, so
      replace them before you update to it.
    </p>
    <ul class="grid list-disc gap-2 ps-6">
      {#each UNTIL.keeps as k, i (i)}<li>{@render text(k)}</li>{/each}
    </ul>
    <p>
      <strong>What does not keep working.</strong>
      {@render text(UNTIL.stops)}
    </p>
  </section>

  <section
    aria-labelledby="unchanged"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="unchanged" class={h2}>What did not change</h2>
    <p>{@render text(UNCHANGED.names)}</p>
    <p>
      Five exported constants keep their names and change their values. Code
      that compares against one, or stores it, reads the new value:
    </p>
    <ul class="grid list-disc gap-2 ps-6">
      {#each UNCHANGED.values as [name, value] (name)}
        <li><code>{name}</code>: {@render text(value)}</li>
      {/each}
    </ul>
  </section>
</Leaf>
