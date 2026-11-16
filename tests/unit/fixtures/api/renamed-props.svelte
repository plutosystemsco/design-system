<script lang="ts" module>
  // 023 test 2's mutation: `$props` renamed, so the parser finds no props.
  export function propz(): { label?: string } {
    return {};
  }
</script>

<script lang="ts">
  let { label }: { label?: string } = propz();
</script>

<p>{label}</p>
