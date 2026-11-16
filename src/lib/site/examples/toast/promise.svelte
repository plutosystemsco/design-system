<script lang="ts" module>
  export const meta = {
    title: "Promise",
    intro:
      "A save that takes over 400 ms shows Saving… first, then its result in the same place. A quick one shows only its result.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { toast } from "#lib/registry/ui/toast";

  // A stand-in for your app's request.
  const save = (ms: number, fail = false) =>
    new Promise<void>((resolve, reject) =>
      setTimeout(() => (fail ? reject(new Error("offline")) : resolve()), ms),
    );

  const messages = {
    loading: "Saving…",
    success: "Saved",
    error: "Couldn't save",
  };
</script>

<div class="flex flex-wrap gap-3">
  <Button onclick={() => toast.promise(save(1500), messages)}
    >Save slowly</Button
  >
  <Button variant="secondary" onclick={() => toast.promise(save(200), messages)}
    >Save quickly</Button
  >
  <Button
    variant="secondary"
    onclick={() => toast.promise(save(1500, true), messages)}
    >Save with an error</Button
  >
</div>
