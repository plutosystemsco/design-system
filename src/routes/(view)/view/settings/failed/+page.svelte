<script lang="ts">
  import SettingsDelete from "#lib/registry/components/settings-delete.svelte";
  import SettingsForm, {
    MESSAGES,
    type SettingsResult,
    type SettingsValues,
  } from "#lib/registry/components/settings-form.svelte";

  const values: SettingsValues = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    timeZone: "Europe/London",
    notifyFailures: true,
    notifySummary: false,
    theme: "system",
  };

  // A server that fails: each callback rejects, as a dropped connection would.
  async function saveSettings(): Promise<SettingsResult> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    throw new Error("The stand-in server failed.");
  }
  async function deleteAccount(): Promise<void> {
    throw new Error("The stand-in server failed.");
  }
</script>

<svelte:head><title>Error: Settings</title></svelte:head>

<div class="mx-auto flex max-w-2xl flex-col gap-12 px-6 py-16">
  <div class="flex flex-col gap-2">
    <h1
      class="font-heading text-2xl font-bold tracking-section text-foreground sm:text-5xl sm:tracking-display"
    >
      Settings
    </h1>
    <p class="text-muted-foreground">Your changes apply when you save them.</p>
  </div>
  <SettingsForm {values} onsave={saveSettings} formError={MESSAGES.failed} />
  <SettingsDelete ondelete={deleteAccount} class="groove pt-12" />
</div>
