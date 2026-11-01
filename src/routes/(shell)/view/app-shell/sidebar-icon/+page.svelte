<script lang="ts">
  import AppShellView from "#lib/preview/app-shell-view.svelte";
</script>

<AppShellView
  sidebar="icon"
  sidebarOpen={false}
  user={{ name: "Ada Lovelace", email: "ada@example.com" }}
/>
