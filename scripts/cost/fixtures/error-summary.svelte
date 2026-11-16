<script lang="ts">
  import { ErrorSummary } from "#lib/components/ui/error-summary";
</script>

<ErrorSummary
  announce={false}
  errors={[{ id: "cost-name", message: "Enter a name" }]}
/>
<label for="cost-name">Name</label>
<input id="cost-name" />
