<script lang="ts">
  import * as RadioGroup from "#lib/components/ui/radio-group";
</script>

<RadioGroup.Root value="hobby" aria-label="Plan">
  <RadioGroup.Item value="hobby" aria-label="Hobby" />
  <RadioGroup.Item value="pro" aria-label="Pro" data-cost="target" />
</RadioGroup.Root>
