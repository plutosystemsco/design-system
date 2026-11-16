<script lang="ts">
  import * as kinds from "#lib/site/examples/toast/kinds.svelte";
  import * as raise from "#lib/site/examples/toast/raise.svelte";
  import * as action from "#lib/site/examples/toast/action.svelte";
  import * as promise from "#lib/site/examples/toast/promise.svelte";
  import * as fromADialog from "#lib/site/examples/toast/from-a-dialog.svelte";
  import * as setting from "#lib/site/examples/toast/setting.svelte";
  import * as keyboard from "#lib/site/examples/toast/keyboard.svelte";
  import * as route from "#lib/site/examples/toast/route.svelte";
  import * as doResult from "#lib/site/examples/toast/do-result.svelte";
  import * as dontResult from "#lib/site/examples/toast/dont-result.svelte";
  import * as doWords from "#lib/site/examples/toast/do-words.svelte";
  import * as dontWords from "#lib/site/examples/toast/dont-words.svelte";
  import * as doAction from "#lib/site/examples/toast/do-action.svelte";
  import * as dontAction from "#lib/site/examples/toast/dont-action.svelte";
  import { notifications } from "#lib/site/examples/toast/notifications.svelte.js";
  import { Toaster } from "#lib/registry/ui/toast";
  import Component from "#lib/site/page/component.svelte";

  const DOS = [doResult, doWords, doAction];
  const DONTS = [dontResult, dontWords, dontAction];
</script>

<Component
  name="toast"
  examples={{
    kinds,
    raise,
    action,
    promise,
    "from-a-dialog": fromADialog,
    setting,
    keyboard,
    route,
  }}
>
  {#snippet when()}
    <p>
      Use a toast for a result the person can also see, or does not need to
      keep: saved, sent, copied, a background job done. It sits at the top end,
      leaves on its own if it is a success or info, and never takes focus.
    </p>
    <p>
      Not for a form's errors: use an <a
        href="/components/error-summary/"
        class="text-primary underline">error summary</a
      >. Not for something that must be acted on before going on: use an
      <a href="/components/alert-dialog/" class="text-primary underline"
        >alert dialog</a
      >. Not for something that stays true on the page: use an
      <a href="/components/alert/" class="text-primary underline">alert</a>. Not
      for a dialog's own result while it is open: put it in the dialog.
    </p>
    <p>
      Mount one <code>&lt;Toaster /&gt;</code> in your root layout, then call
      <code>toast("Saved")</code>, <code>toast.success</code>,
      <code>toast.caution</code>, <code>toast.error</code>,
      <code>toast.loading</code> or <code>toast.promise</code> from anywhere.
    </p>
  {/snippet}
  {#snippet dos()}
    {#each DOS as pair (pair.meta.pair)}
      <li data-pair={pair.meta.pair} data-kind="do" class="grid gap-2">
        <span>{pair.meta.caption}</span>
        <pair.default />
      </li>
    {/each}
  {/snippet}
  {#snippet donts()}
    {#each DONTS as pair (pair.meta.pair)}
      <li data-pair={pair.meta.pair} data-kind="dont" class="grid gap-2">
        <span>{pair.meta.caption} {pair.meta.breaks}</span>
        <pair.default />
      </li>
    {/each}
  {/snippet}
  {#snippet accessibility()}
    <li>
      What Kuiper provides: two hidden announcers, present from the first
      render, on one schedule. Errors go to the assertive one and interrupt; the
      rest go to the polite one and wait their turn. The visible stack is never
      live, and the Dismiss button's name is never spoken on arrival.
    </li>
    <li>
      No toast is a tab stop; its buttons are. F8 moves focus to the list, named
      "Newest first", inside the "Notifications" landmark, and back. Tab walks
      each toast's action and Dismiss, newest first. Escape in a toast dismisses
      it, and focus moves to the next toast, or back.
    </li>
    <li>
      A toast never covers the keyboard focus (SC 2.4.11): while a toast's box
      would cover the focused element, it steps aside, hidden and paused, and
      the count line says "1 hidden". A pointer press never hides a toast.
    </li>
    <li>
      Timed toasts pause on hover, on focus, while the window is in the
      background and while a modal is open, and <code>timers="off"</code> turns them
      off; they meet SC 2.2.1 with your part. Errors, cautions, actions and loading
      toasts never time out.
    </li>
    <li>
      Speech waits for the page's title after a navigation, and for a second
      after a modal closes. Under reduced motion nothing moves, and the loading
      spinner turns once.
    </li>
    <li>
      Your part, each a must: mount one <code>&lt;Toaster /&gt;</code> in the
      root layout, outside any element with a <code>transform</code>,
      <code>filter</code>, <code>backdrop-filter</code>,
      <code>perspective</code> or <code>contain</code>.
    </li>
    <li>
      Meet SC 2.2.1: make every timed toast's message also visible on the page,
      or bind <code>timers</code> to a setting the person can reach before the first
      toast.
    </li>
    <li>Offer every action somewhere else on the page too.</li>
    <li>
      Add <code>toast.navigating()</code> in <code>beforeNavigate</code> and
      <code>toast.navigated()</code> in <code>afterNavigate</code> to your root layout.
    </li>
    <li>
      Portal your own modals, or a toast raised under an inline one may show
      beneath it.
    </li>
    <li>Install <code>toast</code> once, at one path.</li>
  {/snippet}
</Component>

<Toaster timers={notifications.keep ? "off" : "on"} />
