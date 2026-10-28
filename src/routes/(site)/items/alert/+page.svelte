<script lang="ts">
  import CheckCircle from "phosphor-svelte/lib/CheckCircle";
  import Info from "phosphor-svelte/lib/Info";
  import Warning from "phosphor-svelte/lib/Warning";
  import WarningCircle from "phosphor-svelte/lib/WarningCircle";
  import * as Alert from "#lib/registry/ui/alert";
  import { Button } from "#lib/registry/ui/button";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

  let inserted = $state(false);
</script>

<ItemHeader name="alert" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="Each title names the state in words. Destructive and success sit on their tints; caution is a card with an amber bar. An alert is never placed inside an inset."
>
  <div class="grid max-w-xl gap-6">
    <Specimen caption="default · no role" class="w-full">
      <Alert.Root class="w-full">
        <Info aria-hidden="true" />
        <Alert.Title>Maintenance on Sunday</Alert.Title>
        <Alert.Description
          >Runs pause from 02:00 to 03:00 UTC.</Alert.Description
        >
      </Alert.Root>
    </Specimen>
    <Specimen caption="destructive · role alert when inserted" class="w-full">
      <Alert.Root variant="destructive" class="w-full" role={null}>
        <WarningCircle aria-hidden="true" />
        <Alert.Title>Error: the run failed</Alert.Title>
        <Alert.Description
          >3 tests failed in tests/test_wasi.py.</Alert.Description
        >
        <Alert.Action
          ><Button size="sm" variant="secondary">View logs</Button
          ></Alert.Action
        >
      </Alert.Root>
    </Specimen>
    <Specimen caption="success · role status" class="w-full">
      <Alert.Root variant="success" class="w-full">
        <CheckCircle aria-hidden="true" />
        <Alert.Title>Saved</Alert.Title>
        <Alert.Description
          >Your settings apply to the next run.</Alert.Description
        >
      </Alert.Root>
    </Specimen>
    <Specimen caption="caution · role status" class="w-full">
      <Alert.Root variant="caution" class="w-full">
        <Warning aria-hidden="true" />
        <Alert.Title>Caution: this run is flaky</Alert.Title>
        <Alert.Description>It passed on retry 2 of 3.</Alert.Description>
      </Alert.Root>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="The destructive specimens on this page pass role={'{null}'} because they are here at load; a destructive alert keeps role alert when it is inserted after a failed submit."
>
  <Specimen caption="focusable, for an error summary" class="w-full max-w-xl">
    <Alert.Root variant="destructive" tabindex={-1} role={null} class="w-full">
      <Alert.Title>Fix 2 errors to continue</Alert.Title>
      <Alert.Description>
        <a href="/items/alert/#variants">Email address</a> and
        <a href="/items/alert/#variants">password</a> need attention.
      </Alert.Description>
    </Alert.Root>
  </Specimen>
</PreviewSection>

<PreviewSection
  id="roles"
  title="Roles"
  intro="Inserted after the page loads, as an app inserts them: default takes no role, destructive alert, success and caution status, and role={'{null}'} none."
>
  <Button
    variant="secondary"
    size="sm"
    data-testid="insert-alerts"
    onclick={() => (inserted = true)}>Insert the alerts</Button
  >
  <div data-testid="inserted-alerts" class="mt-6 grid max-w-xl gap-4">
    {#if inserted}
      <Alert.Root><Alert.Title>Default: no role</Alert.Title></Alert.Root>
      <Alert.Root variant="destructive"
        ><Alert.Title>Error: role alert</Alert.Title></Alert.Root
      >
      <Alert.Root variant="success"
        ><Alert.Title>Saved: role status</Alert.Title></Alert.Root
      >
      <Alert.Root variant="caution"
        ><Alert.Title>Caution: role status</Alert.Title></Alert.Root
      >
      <Alert.Root variant="destructive" role={null}
        ><Alert.Title>Error, with role null: no role</Alert.Title></Alert.Root
      >
    {/if}
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      Destructive renders <code>role="alert"</code>, announced when inserted;
      success and caution render <code>role="status"</code>; default renders
      none. Pass another <code>role</code>, or <code>role={"{null}"}</code> for none.
    </li>
    <li>
      It takes <code>tabindex</code> and binds <code>ref</code>, so an error
      summary can receive focus after a failed submit.
    </li>
    <li>The title says the state in words; colour and icon are second cues.</li>
  </ul>
</PreviewSection>
