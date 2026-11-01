<script lang="ts">
  import Plus from "phosphor-svelte/lib/Plus";
  import ChatTurn from "#lib/registry/components/chat-turn.svelte";
  import type {
    ChatMessage,
    ChatStatus,
  } from "#lib/registry/components/chat-types";
  import * as Alert from "#lib/registry/ui/alert";
  import { Button } from "#lib/registry/ui/button";
  import { Composer } from "#lib/registry/ui/composer";
  import * as Empty from "#lib/registry/ui/empty";
  import * as Marker from "#lib/registry/ui/marker";
  import { MessageLog } from "#lib/registry/ui/message-log";
  import { cn } from "#lib/utils";

  let {
    messages,
    status = "ready",
    newReply = false,
    title = "New conversation",
    level = 2,
    fill = "screen",
    names,
    value = $bindable(""),
    onsend,
    onstop,
    onnew,
    onretry,
    class: className,
  }: {
    messages: ChatMessage[];
    status?: ChatStatus;
    /** True once a reply has finished, until the next send: shows "Latest reply". */
    newReply?: boolean;
    title?: string;
    /** The title's heading level; the turns are level 3, so 2 keeps the ranks in order. */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    /** `screen`: the viewport's height; `parent`: the height of a box the app sizes. */
    fill?: "screen" | "parent";
    names?: { user: string; assistant: string };
    /** The composer's draft. */
    value?: string;
    onsend?: (text: string) => void;
    onstop?: () => void;
    onnew?: () => void;
    onretry?: () => void;
    class?: string;
  } = $props();

  let column: HTMLElement | null = $state(null);

  /** Moves the reader to the last reply's heading; the view follows focus. */
  function focusLatest(): void {
    const headings = column?.querySelectorAll<HTMLElement>(
      '[data-role="assistant"] [data-slot="message-header"]',
    );
    headings?.[headings.length - 1]?.focus();
  }
</script>

<!--
  A conversation: a 64 px header with the title and New chat; the log, which
  fills the column and scrolls, following new replies; "Latest reply", shown
  once a reply has finished, which moves the reader to it (the log's own
  button moves the view); and the composer on the card ground behind a
  groove, pinned at the bottom. Tokens stream silently (the log announces
  nodes, not text); the composer's status says the three words; "Responding"
  is a static line at the end of the log while a reply is awaited; an error
  is an alert with Retry inside the log, with no server detail. A fixed
  height, not a minimum: the log must overflow to scroll. The "Latest reply"
  row keeps its 48 px while the button is hidden, so the log holds its height
  when a reply ends.
-->
<div
  data-slot="chat-pane"
  data-status={status}
  class={cn(
    "flex flex-col bg-background",
    fill === "screen" ? "h-dvh" : "h-full",
    className,
  )}
>
  <div class="flex h-16 shrink-0 items-center justify-between gap-4 px-6">
    <svelte:element
      this={`h${level}`}
      data-slot="chat-title"
      class="font-heading text-base font-bold"
    >
      {title}
    </svelte:element>
    <Button variant="secondary" size="sm" onclick={() => onnew?.()}>
      <Plus aria-hidden="true" />
      New chat
    </Button>
  </div>

  <!-- The log's wrapper (over which its button pins) is this row's flex child; the region fills it. -->
  <div class="flex min-h-0 flex-1 flex-col *:min-h-0 *:flex-1">
    <MessageLog label="Messages" busy={status === "streaming"} class="h-full">
      <div
        bind:this={column}
        data-slot="chat-column"
        class="mx-auto flex w-full max-w-prose flex-col gap-4 px-6 py-4"
      >
        {#if messages.length === 0}
          <Empty.Root>
            <Empty.Header>
              <Empty.Title level={3}>No messages yet</Empty.Title>
              <Empty.Description
                >Write a message below to start.</Empty.Description
              >
            </Empty.Header>
          </Empty.Root>
        {:else}
          {#each messages as message (message.id)}
            <ChatTurn {message} {names} />
          {/each}
        {/if}
        {#if status === "submitted"}
          <Marker.Root data-chat="responding">
            <Marker.Content>Responding</Marker.Content>
          </Marker.Root>
        {/if}
        {#if status === "error"}
          <Alert.Root variant="destructive" role={null} data-chat="error">
            <Alert.Title>The reply could not be finished</Alert.Title>
            <Alert.Description>
              Try again, or write a new message.
            </Alert.Description>
            <Button
              variant="secondary"
              size="sm"
              class="mt-2 justify-self-start"
              onclick={() => onretry?.()}
            >
              Retry
            </Button>
          </Alert.Root>
        {/if}
      </div>
    </MessageLog>
  </div>

  <!-- The row is always there at its height, so the log does not resize when the button appears. -->
  <div
    class="mx-auto flex min-h-12 w-full max-w-prose shrink-0 items-center px-6"
  >
    <Button
      variant="secondary"
      size="sm"
      class={cn(!newReply && "hidden")}
      onclick={focusLatest}
    >
      Latest reply
    </Button>
  </div>

  <div class="groove shrink-0 bg-card px-6 py-4">
    <Composer
      bind:value
      {status}
      {onsend}
      {onstop}
      class="mx-auto max-w-prose"
    />
  </div>
</div>
