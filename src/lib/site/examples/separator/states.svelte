<script lang="ts" module>
  export const meta = {
    title: "A separator that means something",
    intro:
      "With decorative={false}, the separator is announced as a separator, with its orientation. It looks the same.",
  };
</script>

<script lang="ts">
  import { Separator } from "#lib/registry/ui/separator";
</script>

<div class="w-full max-w-md">
  <p class="text-sm">Before</p>
  <Separator decorative={false} class="my-4" />
  <p class="text-sm">After</p>
</div>
