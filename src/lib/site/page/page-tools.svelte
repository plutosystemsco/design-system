<script lang="ts">
  import { onDestroy } from "svelte";
  import Check from "phosphor-svelte/lib/Check";
  import Copy from "phosphor-svelte/lib/Copy";
  import FileText from "phosphor-svelte/lib/FileText";
  import { Button } from "#lib/registry/ui/button";
  import { Status } from "#lib/registry/ui/status";
  import { copyText, twinText } from "../copy-page.ts";

  let {
    path,
  }: { /** The page's path; its twin is `<path>index.md`. */ path: string } =
    $props();

  const href = $derived(`${path}index.md`);
  let state: "idle" | "copied" | "failed" = $state("idle");
  let timeout: ReturnType<typeof setTimeout> | undefined;

  async function copy() {
    try {
      await copyText(twinText(href), {
        ClipboardItem: globalThis.ClipboardItem,
        clipboard: navigator.clipboard,
      });
      state = "copied";
      clearTimeout(timeout);
      timeout = setTimeout(() => (state = "idle"), 2000);
    } catch {
      state = "failed";
    }
  }
  // Fetched as the pointer or the focus arrives, so the copy is ready at once.
  const prefetch = () => void twinText(href).catch(() => {});
  onDestroy(() => clearTimeout(timeout));
</script>

<!--
  The page tools (018 decision 6): copy the page's Markdown twin, or open
  it. Not in the twin itself.
-->
<div
  data-slot="page-tools"
  data-md="skip"
  class="flex flex-wrap items-center gap-1 [&>*]:text-muted-foreground [&>*:hover]:text-foreground"
>
  <Button
    variant="ghost"
    size="sm"
    onclick={copy}
    onpointerenter={prefetch}
    onfocus={prefetch}
    >{#if state === "copied"}<Check aria-hidden="true" />{:else}<Copy
        aria-hidden="true"
      />{/if}Copy page</Button
  >
  <Button variant="ghost" size="sm" {href}
    ><FileText aria-hidden="true" />View as Markdown</Button
  >
  <Status
    text={state === "copied"
      ? "Copied"
      : state === "failed"
        ? "Couldn't copy. Open the Markdown instead."
        : ""}
  />
</div>
