<script lang="ts" module>
  export const meta = {
    title: "The cookie",
    intro:
      "The provider writes sidebar_state on every toggle and never reads it. An app's +layout.server.ts reads it and passes open to the provider, so the first paint is right.",
    live: false,
  };
</script>

<script lang="ts">
  // src/routes/+layout.svelte. Beside it, +layout.server.ts reads the cookie:
  //
  //   import type { LayoutServerLoad } from "./$types";
  //
  //   export const load: LayoutServerLoad = ({ cookies }) => ({
  //     sidebarOpen: cookies.get("sidebar_state") !== "false",
  //   });
  import type { Snippet } from "svelte";
  import * as Sidebar from "#lib/registry/ui/sidebar";

  let {
    data,
    children,
  }: { data: { sidebarOpen?: boolean }; children?: Snippet } = $props();
</script>

<Sidebar.Provider open={data.sidebarOpen}>
  {@render children?.()}
</Sidebar.Provider>
