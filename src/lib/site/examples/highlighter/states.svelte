<script lang="ts" module>
  export const meta = {
    title: "Roles",
    intro:
      "Meridian's roles: colour carries meaning, not syntax. Fourteen text roles and the two grounds, each a semantic colour, so the theme switch carries through. A token renders as its role's class; a token in the body carries no class at all.",
  };
</script>

<script lang="ts">
  import { CODE_ROLES, roleClasses } from "#lib/registry/lib/highlighter";

  // The code map's sixteen entries as swatches, in the token file's order:
  // fourteen text roles and the two grounds. The class names are written out
  // so Tailwind finds them in this file.
  const roles: [role: string, semantic: string, swatch: string][] = [
    ["text", "syntax-ink", "bg-code-text"],
    ["comment", "syntax-grey", "bg-code-comment"],
    ["keyword", "syntax-violet", "bg-code-keyword"],
    ["function", "syntax-blue", "bg-code-function"],
    ["type", "syntax-navy", "bg-code-type"],
    ["string", "syntax-green", "bg-code-string"],
    ["number", "syntax-yellow", "bg-code-number"],
    ["constant", "syntax-orange", "bg-code-constant"],
    ["meta", "syntax-plum", "bg-code-meta"],
    ["special", "syntax-red", "bg-code-special"],
    ["link", "syntax-blue", "bg-code-link"],
    ["inserted", "syntax-green", "bg-code-inserted"],
    ["deleted", "syntax-red", "bg-code-deleted"],
    ["changed", "syntax-blue", "bg-code-changed"],
    ["background", "syntax-ground", "bg-code-background"],
    ["active-line", "syntax-active-line", "bg-code-active-line"],
  ];
</script>

<div class="grid gap-8">
  <ul class="grid w-full gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
    {#each roles as [role, semantic, swatch] (role)}
      <li class="flex items-center gap-3">
        <span
          aria-hidden="true"
          class="size-8 shrink-0 rounded border border-input {swatch}"
        ></span>
        <span class="flex flex-col">
          <code class="text-sm">--code-{role}</code>
          <span class="font-mono text-xs text-muted-foreground"
            >var(--{semantic})</span
          >
        </span>
      </li>
    {/each}
  </ul>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div
    role="region"
    aria-label="The role table"
    tabindex="0"
    class="max-w-md overflow-x-auto"
  >
    <table class="w-full text-sm" data-testid="role-table">
      <caption class="pb-2 text-start text-sm text-muted-foreground">
        Each role and the class <code>tokenClass(role)</code> returns.
      </caption>
      <thead>
        <tr class="text-start text-muted-foreground">
          <th scope="col" class="py-2 text-start font-medium">role</th>
          <th scope="col" class="py-2 text-start font-medium">class</th>
        </tr>
      </thead>
      <tbody>
        {#each CODE_ROLES as role (role)}
          <tr class="groove">
            <td class="py-2"><code>{role}</code></td>
            <td class="py-2">
              {#if roleClasses[role]}<code>{roleClasses[role]}</code
                >{:else}<span class="text-muted-foreground">none</span>{/if}
            </td>
          </tr>
        {/each}
        <tr class="groove">
          <td class="py-2"><code>background</code></td>
          <td class="py-2"><code>bg-code-background</code></td>
        </tr>
        <tr class="groove">
          <td class="py-2"><code>active-line</code></td>
          <td class="py-2"><code>bg-code-active-line</code></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
