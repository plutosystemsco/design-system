<script lang="ts" module>
  export const meta = {
    title: "The twenty-six",
    intro:
      "Eighteen languages come with a Lezer grammar (Svelte's from a third-party package, released in 2022), eight as legacy modes: CodeMirror 5 tokenisers with no syntax tree, so no bracket matching or indentation by syntax. Every one takes its colour from the highlighter: tree-sitter for twenty-one, Shiki for five.",
  };
</script>

<script lang="ts">
  import { codeLanguages } from "#lib/registry/lib/code-languages";
  import { highlightLanguages } from "#lib/registry/lib/highlighter";

  const kinds: Record<string, string> = {
    lezer: "Lezer grammar",
    svelte: "Lezer grammar, @replit/codemirror-lang-svelte",
    legacy: "legacy mode",
  };
  // The colour is the highlighter's, by engine.
  const engines = new Map(highlightLanguages.map((l) => [l.id, l.engine]));
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  role="region"
  aria-label="The twenty-six languages"
  tabindex="0"
  class="overflow-x-auto"
>
  <table class="w-full text-sm" data-testid="kinds-table">
    <thead>
      <tr class="text-muted-foreground">
        <th scope="col" class="py-2 text-start font-medium">id</th>
        <th scope="col" class="py-2 text-start font-medium">aliases</th>
        <th scope="col" class="py-2 text-start font-medium">kind</th>
        <th scope="col" class="py-2 text-start font-medium">colour</th>
      </tr>
    </thead>
    <tbody>
      {#each codeLanguages as language (language.id)}
        <tr class="groove align-top">
          <td class="py-2 pe-3"><code>{language.id}</code></td>
          <td class="py-2 pe-3 font-mono text-xs text-muted-foreground"
            >{language.aliases.join(" ") || "none"}</td
          >
          <td class="py-2 pe-3">{kinds[language.kind]}</td>
          <td class="py-2 text-muted-foreground"
            >{engines.get(language.id) ?? "none"}</td
          >
        </tr>
      {/each}
    </tbody>
  </table>
</div>
