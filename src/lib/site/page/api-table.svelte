<script lang="ts">
  import type { ApiTable } from "../api.server.ts";
  import { typePieces } from "../type-pieces.ts";

  let { tables }: { tables: ApiTable[] } = $props();

  // 018 decision 7: a table whose rows have no description leaves the
  // column out, header and cells. 023: a row's default sits under its
  // description, in the same cell, so three columns fit the text column
  // at every width; the column shows when any row has either.
  const described = (t: ApiTable) =>
    t.rows.some((r) => r.doc.trim() || r.default);

  // Inline code in a doc comment, as the reader sees it.
  // An element named bare, such as <time>, reads as code too.
  const parts = (text: string) =>
    text
      .split(/(`[^`]+`|<[a-z][a-z0-9-]*>)/)
      .filter(Boolean)
      .map((p) => (p.startsWith("<") ? `\`${p}\`` : p));

  // An element's name, such as `<button>`, is one word: it never breaks.
  const pieces = (text: string) =>
    /^<[a-z][a-z0-9-]*>$/.test(text) ? [text] : typePieces(text);
</script>

<!-- 023a: code that may break only at its punctuation (type-pieces.ts).
     Each piece is text, so the Markdown twin and a copy are unchanged. The
     <wbr> is hidden, so Chromium's accessible name gains no space at it. -->
{#snippet code(text: string)}<code
    >{#each pieces(text) as p, i (i)}{#if i}<wbr
          aria-hidden="true"
        />{/if}{p}{/each}</code
  >{/snippet}

{#snippet prose(
  text: string,
)}{#each parts(text) as p, i (i)}{#if p.startsWith("`")}{@render code(
        p.slice(1, -1),
      )}{:else}{p}{/if}{/each}{/snippet}

{#if tables.length === 0}
  <p class="max-w-(--site-measure) text-muted-foreground">
    This item takes no props and exports nothing to call: you use it by adding
    it.
  </p>
{/if}
<div class="grid gap-8">
  {#each tables as table (table.file + table.part)}
    <!-- A table scrolls inside itself; on a phone each row stacks. -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div
      data-slot="site-scroll"
      role="region"
      aria-label="{table.part}, {table.kind === 'module' ? 'exports' : 'API'}"
      tabindex="0"
      class="min-w-0 overflow-x-auto rounded border border-border"
    >
      <!-- Each cell is styled from the table, so a row's markup stays small. -->
      <table
        class="w-full border-collapse text-sm [&_tbody_tr]:groove-b [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_th]:px-4 [&_th]:py-3 [&_th]:text-start [&_th]:font-medium max-md:[&_tbody_tr]:grid max-md:[&_tbody_tr]:grid-cols-[auto_minmax(0,1fr)] max-md:[&_tbody_tr]:gap-x-3 max-md:[&_tbody_tr]:gap-y-1 max-md:[&_tbody_tr]:px-4 max-md:[&_tbody_tr]:py-3 max-md:[&_td]:p-0 max-md:[&_td:nth-child(n+3)]:col-span-2"
      >
        <caption
          class="groove-b bg-card px-4 py-3 text-start font-mono font-semibold"
          >{table.part}</caption
        >
        <thead class="max-md:sr-only">
          <tr class="groove-b text-muted-foreground">
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            {#if described(table)}<th scope="col">What it does</th>{/if}
          </tr>
        </thead>
        <tbody>
          {#each table.rows as row (row.name)}
            <tr>
              <td><code>{row.name}</code></td>
              <td class="break-words"
                >{#if row.type}{@render code(row.type)}{:else}<span
                    class="text-muted-foreground">inherited</span
                  >{/if}</td
              >
              {#if described(table)}<td
                  >{@render prose(row.doc)}{#if row.default}{" "}<span
                      class="mt-1 block text-muted-foreground"
                      >Default <code>{row.default}</code></span
                    >{/if}</td
                >{/if}
            </tr>
          {/each}
          {#if table.inherits}
            <tr>
              <td colspan={described(table) ? 3 : 2}
                >{@render prose(table.inherits)}</td
              >
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  {/each}
</div>
