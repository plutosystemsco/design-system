<script lang="ts">
  import { tick } from "svelte";
  import * as AlertDialog from "#lib/registry/ui/alert-dialog";
  import { buttonVariants } from "#lib/registry/ui/button";
  import { ErrorSummary } from "#lib/registry/ui/error-summary";
  import { Status } from "#lib/registry/ui/status";
  import { cn } from "#lib/utils";

  /** When the callback throws or rejects. */
  const FAILED = "We could not delete your account. Try again.";

  let {
    ondelete,
    level = 2,
    requested = "Account deletion requested.",
    class: className,
  }: {
    ondelete: () => Promise<void>;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    /** What the status says once `ondelete` resolves. Say what your app did. */
    requested?: string;
    class?: string;
  } = $props();

  let open = $state(false);
  let text = $state("");
  let message = $state<string>();
  let summary = $state<HTMLElement | null>(null);
  // The summary's title ranks under this section's heading.
  const summaryLevel = $derived(Math.min(level + 1, 6) as 2 | 3 | 4 | 5 | 6);

  async function confirm() {
    open = false;
    message = undefined;
    text = "";
    try {
      await ondelete();
      text = requested;
    } catch {
      message = FAILED;
      text = FAILED;
      await tick();
      summary?.focus();
    }
  }
</script>

<!--
  The destructive section, outside the settings form: it is not a setting
  that Save changes saves. The trigger spends no red; the dialog's confirm
  does, and the dialog starts on the safe choice.
-->
<section
  data-slot="settings-delete"
  class={cn("flex flex-col gap-6", className)}
>
  <div class="flex flex-col gap-2">
    <svelte:element
      this={`h${level}`}
      class="font-heading text-base font-bold text-foreground"
    >
      Delete your account
    </svelte:element>
    <p class="max-w-prose text-muted-foreground">
      This removes your data and settings for good. It cannot be undone.
    </p>
  </div>
  <ErrorSummary bind:ref={summary} {message} level={summaryLevel} />
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
    <AlertDialog.Root bind:open>
      <AlertDialog.Trigger
        class={cn(buttonVariants({ variant: "secondary" }), "w-full sm:w-auto")}
        >Delete account</AlertDialog.Trigger
      >
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Delete your account?</AlertDialog.Title>
          <AlertDialog.Description>
            Your data and settings will be removed for good. You cannot undo
            this.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Keep my account</AlertDialog.Cancel>
          <AlertDialog.Action variant="destructive" onclick={confirm}
            >Delete account</AlertDialog.Action
          >
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
    <Status visible {text} class="text-sm" />
  </div>
</section>
