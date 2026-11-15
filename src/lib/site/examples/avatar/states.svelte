<script lang="ts" module>
  export const meta = {
    title: "A group with a count",
    intro: "Avatars in a group overlap; a count says how many more there are.",
  };
</script>

<script lang="ts">
  import * as Avatar from "#lib/registry/ui/avatar";
</script>

<Avatar.Group>
  <Avatar.Root><Avatar.Fallback>AL</Avatar.Fallback></Avatar.Root>
  <Avatar.Root><Avatar.Fallback>GH</Avatar.Fallback></Avatar.Root>
  <Avatar.Root><Avatar.Fallback>MK</Avatar.Fallback></Avatar.Root>
  <Avatar.GroupCount>+4</Avatar.GroupCount>
</Avatar.Group>
