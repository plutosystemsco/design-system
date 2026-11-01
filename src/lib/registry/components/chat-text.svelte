<script lang="ts" module>
  /** A run of prose, or one fenced block of code. */
  export type ChatSegment =
    | { kind: "prose"; text: string }
    | { kind: "code"; language: string; code: string };

  /**
   * Splits text on fence lines. An opener is three backticks and any info
   * string without a backtick (`python`, `c++`, `shell-session`,
   * `python title=x`); its first word is the language. A closer is three
   * backticks alone, with trailing whitespace allowed; a "```lang" line
   * inside an open block is content. A `\r` at a line's end is dropped, so
   * CRLF text yields clean code. An open fence runs to the end of the
   * string, so a streaming reply shows its block from the first fence line.
   * No other markdown is read.
   */
  export function splitFences(text: string): ChatSegment[] {
    const segments: ChatSegment[] = [];
    let prose: string[] = [];
    let code: string[] | null = null;
    let language = "";
    for (const raw of text.split("\n")) {
      const line = raw.replace(/\r$/, "");
      if (code === null) {
        const opener = /^```([^`]*)$/.exec(line);
        if (opener) {
          if (prose.join("\n").trim())
            segments.push({ kind: "prose", text: prose.join("\n") });
          prose = [];
          code = [];
          language = opener[1]!.trim().split(/\s+/)[0] ?? "";
          continue;
        }
      } else if (/^```\s*$/.test(line)) {
        segments.push({ kind: "code", language, code: code.join("\n") });
        code = null;
        continue;
      }
      (code ?? prose).push(line);
    }
    if (code !== null)
      segments.push({ kind: "code", language, code: code.join("\n") });
    else if (prose.join("\n").trim())
      segments.push({ kind: "prose", text: prose.join("\n") });
    return segments;
  }

  /** Prose into paragraphs, split on blank lines. */
  export function paragraphs(text: string): string[] {
    return text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
</script>

<script lang="ts">
  import * as CodeBlock from "#lib/registry/ui/code-block";

  let { text }: { text: string } = $props();

  const segments = $derived(splitFences(text));
</script>

<!--
  A turn's text: prose as paragraphs, each fenced block as a small code block
  with its language (or "code") and a copy button, highlighted incrementally
  as it streams. Headings are never rendered: text is prose, so no reply can
  carry an h1. Markdown beyond a fence is the app's.
-->
{#each segments as segment, i (i)}
  {#if segment.kind === "prose"}
    {#each paragraphs(segment.text) as paragraph, j (j)}
      <p class="whitespace-pre-wrap">{paragraph}</p>
    {/each}
  {:else}
    <CodeBlock.Root size="sm" data-chat="code">
      <CodeBlock.Header>
        <CodeBlock.Title>{segment.language || "code"}</CodeBlock.Title>
        <CodeBlock.Actions>
          <CodeBlock.CopyButton code={segment.code} />
        </CodeBlock.Actions>
      </CodeBlock.Header>
      <CodeBlock.Content
        code={segment.code}
        language={segment.language || undefined}
        lineNumbers={false}
      />
    </CodeBlock.Root>
  {/if}
{/each}
