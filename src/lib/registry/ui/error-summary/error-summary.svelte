<script lang="ts" module>
  /** "Error: " and the title while a summary is shown, else the title. */
  export function titleFor(title: string, failed: boolean): string {
    return failed ? `Error: ${title}` : title;
  }
</script>

<script lang="ts">
  import { Alert } from "#lib/registry/ui/alert";
  import { cn, type WithElementRef } from "#lib/utils";
  import WarningCircle from "phosphor-svelte/lib/WarningCircle";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    errors = [],
    message,
    title = "There is a problem",
    level = 2,
    announce = true,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    /** A link per invalid field, in field order: the field's id and its inline error. */
    errors?: { id: string; message: string }[];
    /** The form-level message, such as a credential failure. */
    message?: string;
    /** Default "There is a problem". */
    title?: string;
    /** The title's heading level. Default 2. */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    /** Default true: role="alert". False when rendered from initial props. */
    announce?: boolean;
  } = $props();

  // The fragment moves the scroll position but may not focus an input, so
  // the link focuses its field itself; the browser scrolls it into view.
  function focusField(event: MouseEvent, id: string) {
    const field = document.getElementById(id);
    if (!field) return;
    event.preventDefault();
    field.focus();
  }
</script>

<!--
  The box a failed submit puts at the top of a form. The form inserts it with
  announce, so role="alert" is never on content present at load, and moves
  focus to it after every failed submit. An app that renders errors from its
  server passes announce={false} and moves focus here itself.
-->
{#if errors.length > 0 || message}
  <Alert
    bind:ref
    variant="destructive"
    data-slot="error-summary"
    role={announce ? "alert" : null}
    tabindex={-1}
    class={cn(className)}
    {...restProps}
  >
    <WarningCircle aria-hidden="true" />
    <svelte:element
      this={`h${level}`}
      data-slot="error-summary-title"
      class="col-start-2 font-heading text-base font-bold"
    >
      {title}
    </svelte:element>
    <div class="col-start-2 grid gap-2">
      {#if message}
        <p>{message}</p>
      {/if}
      {#if errors.length > 0}
        <ul class="grid gap-1">
          {#each errors as error (error.id)}
            <li>
              <a
                href="#{error.id}"
                class="inline-flex min-h-6 items-center underline underline-offset-4"
                onclick={(event) => focusField(event, error.id)}
                >{error.message}</a
              >
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </Alert>
{/if}
