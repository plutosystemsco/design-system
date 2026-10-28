<script lang="ts">
  import SettingsDelete from "#lib/registry/components/settings-delete.svelte";
  import SettingsForm, {
    type SettingsField,
    type SettingsResult,
    type SettingsValues,
  } from "#lib/registry/components/settings-form.svelte";
  import { titleFor } from "#lib/registry/ui/error-summary";

  const values: SettingsValues = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    timeZone: "Europe/London",
    notifyFailures: true,
    notifySummary: false,
    theme: "system",
  };

  let errors = $state<Partial<Record<SettingsField, string>>>({});
  let formError = $state<string>();
  const failed = $derived(
    Object.values(errors).some(Boolean) || Boolean(formError),
  );

  // A stand-in for your server. Replace it.
  // Your app applies the chosen theme; this block only stores the value.
  async function saveSettings(next: SettingsValues): Promise<SettingsResult> {
    void next;
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { ok: true };
  }

  // A stand-in for your server. Replace it, and pass SettingsDelete your own
  // `requested` line in place of "Account deletion requested.", saying what
  // your app does next.
  async function deleteAccount(): Promise<void> {}
</script>

<svelte:head><title>{titleFor("Settings", failed)}</title></svelte:head>

<div class="mx-auto flex max-w-2xl flex-col gap-12 px-6 py-16">
  <div class="flex flex-col gap-2">
    <h1
      class="font-heading text-2xl font-bold tracking-section text-foreground sm:text-5xl sm:tracking-display"
    >
      Settings
    </h1>
    <p class="text-muted-foreground">Your changes apply when you save them.</p>
  </div>
  <SettingsForm {values} onsave={saveSettings} bind:errors bind:formError />
  <SettingsDelete ondelete={deleteAccount} class="groove pt-12" />
</div>
