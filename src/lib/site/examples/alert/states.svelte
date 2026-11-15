<script lang="ts" module>
  export const meta = {
    title: "Focusable, for an error summary",
    intro:
      "With tabindex={-1}, a form can move focus to the alert after a failed submit. The destructive alerts on this page pass role={null} because they are here at load; a destructive alert keeps role alert when it is inserted after a failed submit.",
  };
</script>

<script lang="ts">
  import * as Alert from "#lib/registry/ui/alert";
</script>

<Alert.Root
  variant="destructive"
  tabindex={-1}
  role={null}
  class="w-full max-w-xl"
>
  <Alert.Title>Fix 2 errors to continue</Alert.Title>
  <Alert.Description>
    <a href="/components/alert/#variants">Email address</a> and
    <a href="/components/alert/#variants">password</a> need attention.
  </Alert.Description>
</Alert.Root>
