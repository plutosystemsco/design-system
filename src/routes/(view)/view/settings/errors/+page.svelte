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

  async function saveSettings(): Promise<SettingsResult> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { ok: true };
  }
  async function deleteAccount(): Promise<void> {}
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
  <SettingsForm
    {values}
    onsave={saveSettings}
    draft={{ ...values, name: "", email: "ada@" }}
    errors={{ name: MESSAGES.nameEmpty, email: MESSAGES.emailFormat }}
  />
  <SettingsDelete ondelete={deleteAccount} class="groove pt-12" />
</div>
