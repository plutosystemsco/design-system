<script lang="ts" module>
  /** "Error: " and the title while a summary is shown, else the title. */
  export function titleFor(title: string, failed: boolean): string {
    return failed ? `Error: ${title}` : title;
  }

  const NATIVE = "input:not([type=hidden]),select,textarea,button";

  /** A control focus can land on: an enabled native control, a link, or tabindex 0 or more. */
  function isFocusable(el: Element): boolean {
    if (!(el instanceof HTMLElement)) return false;
    if (el.matches(NATIVE)) return !(el as HTMLInputElement).disabled;
    if (el.matches("a[href]")) return true;
    return el.hasAttribute("tabindex") && el.tabIndex >= 0;
  }

  /**
   * The control a link's target names: the target itself if focusable; a
   * group's current control (its tabindex="0" descendant, such as a radio
   * group's checked radio or its first); else its first focusable
   * descendant; else the target itself if it takes focus by script.
   */
  function controlOf(target: HTMLElement): HTMLElement | null {
    if (isFocusable(target)) return target;
    const current = target.querySelector<HTMLElement>('[tabindex="0"]');
    if (current) return current;
    for (const el of target.querySelectorAll<HTMLElement>("*"))
      if (isFocusable(el)) return el;
    return target.getAttribute("tabindex") === "-1" ? target : null;
  }

  /**
   * The text that asks for the control: for a radio or a checkbox, its
   * fieldset's own legend; else its first label; else the element its
   * aria-labelledby names first; else the control itself.
   */
  function questionOf(control: HTMLElement): HTMLElement {
    const option = control.matches(
      "input[type=radio],input[type=checkbox],[role=radio],[role=checkbox]",
    );
    const legend = option
      ? control.closest("fieldset")?.querySelector(":scope > legend")
      : null;
    if (legend instanceof HTMLElement) return legend;
    const label = (control as HTMLInputElement).labels?.[0];
    if (label) return label;
    const by = control.getAttribute("aria-labelledby")?.split(/\s+/)[0];
    const named = by ? document.getElementById(by) : null;
    return named ?? control;
  }

  /**
   * Inside the visual viewport (for an element taller than it, its top edge
   * is), and the topmost element at its centre is it, inside it or holds
   * it: so nothing, such as a sticky bar, covers it.
   */
  function isClear(el: HTMLElement): boolean {
    const r = el.getBoundingClientRect();
    const vw = window.visualViewport?.width ?? window.innerWidth;
    const vh = window.visualViewport?.height ?? window.innerHeight;
    const tall = r.height > vh;
    if (r.left < 0 || r.right > vw || r.top < 0) return false;
    if (tall ? r.top > vh : r.bottom > vh) return false;
    const y = tall ? r.top + vh / 2 : r.top + r.height / 2;
    const hit = document.elementFromPoint(r.left + r.width / 2, y);
    return !!hit && (hit === el || el.contains(hit) || hit.contains(el));
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
    attempt,
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
    /** Default true: the content carries role="alert". False when rendered from initial props. */
    announce?: boolean;
    /**
     * The count of failed submits. Raise it by one on each, and the content
     * renders anew, so a screen reader announces it again even when nothing
     * changed. Without it, only a new or changed summary is announced.
     */
    attempt?: number;
  } = $props();

  // A fragment moves the scroll position but may not focus an input, so the
  // link focuses its field itself. A field already in view, with its
  // question, stays where it is. Otherwise the question scrolls to the top,
  // below the page's scroll-padding-top, and the field takes focus without a
  // scroll of its own, which under smooth scrolling would race the first. A
  // field still covered, as under a bar the page has not declared, is
  // centred.
  function focusField(event: MouseEvent, id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    const control = controlOf(target);
    if (!control) return;
    event.preventDefault();
    const question = questionOf(control);
    if (isClear(question) && isClear(control)) {
      control.focus({ preventScroll: true });
      return;
    }
    question.scrollIntoView({ block: "start", behavior: "instant" });
    control.focus({ preventScroll: true });
    if (!isClear(control))
      control.scrollIntoView({ block: "center", behavior: "instant" });
  }
</script>

<!--
  The box a failed submit puts at the top of a form. The form inserts it with
  announce and moves focus to its root after every failed submit. The alert
  role is on the content, not on the root that takes focus, so the focus
  move and the announcement do not compete; the heading is read first. An
  app that renders errors from its server passes announce={false} and moves
  focus here itself. The form raises attempt on each failed submit, and each
  new value renders the content anew, so an unchanged submit is announced
  again.
  The links are not in a list, so a reader reads each message once.
-->
{#if errors.length > 0 || message}
  <Alert
    bind:ref
    variant="destructive"
    data-slot="error-summary"
    role={null}
    tabindex={-1}
    class={cn(className)}
    {...restProps}
  >
    <WarningCircle aria-hidden="true" />
    {#key attempt}
      <div
        data-slot="error-summary-content"
        role={announce ? "alert" : null}
        class="col-start-2 row-span-2 grid gap-1"
      >
        <svelte:element
          this={`h${level}`}
          data-slot="error-summary-title"
          class="font-heading text-base font-bold"
        >
          {title}
        </svelte:element>
        <div class="grid gap-2">
          {#if message}
            <p>{message}</p>
          {/if}
          {#if errors.length > 0}
            <div
              data-slot="error-summary-links"
              class="grid justify-items-start gap-1"
            >
              {#each errors as error (error.id)}
                <a
                  href="#{error.id}"
                  class="inline-flex min-h-6 items-center underline underline-offset-4"
                  onclick={(event) => focusField(event, error.id)}
                  >{error.message}</a
                >
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/key}
  </Alert>
{/if}
