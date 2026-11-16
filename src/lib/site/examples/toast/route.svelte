<script lang="ts" module>
  export const meta = {
    title: "Route",
    intro:
      "Create a project: its toast is raised before the navigation and spoken after the next page's title. It closes on the navigation after that.",
  };
</script>

<script lang="ts">
  import { afterNavigate, beforeNavigate, goto } from "$app/navigation";
  import { page } from "$app/state";
  import { Button } from "#lib/registry/ui/button";
  import { toast } from "#lib/registry/ui/toast";

  // The two lines your root layout adds if it is not app-shell's.
  beforeNavigate(() => toast.navigating());
  afterNavigate(() => toast.navigated());

  let created = $state(false);

  async function create() {
    toast.success("Project created");
    created = true;
    await goto(page.url.pathname + page.url.search, { reset: false });
  }

  async function back() {
    created = false;
    await goto(page.url.pathname + page.url.search, { reset: false });
  }
</script>

{#if created}
  <div class="grid justify-items-start gap-3">
    <p class="text-sm">pluto-sandbox, created just now.</p>
    <Button variant="secondary" onclick={back}>Back to projects</Button>
  </div>
{:else}
  <Button onclick={create}>Create project</Button>
{/if}
