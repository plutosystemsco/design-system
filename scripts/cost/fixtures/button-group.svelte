<!--
  027 decision 15: attached, three buttons. The fixture imports only its own
  item, so the buttons are native: the group styles its direct children.
-->
<script lang="ts">
  import { ButtonGroup } from "#lib/components/ui/button-group";
</script>

<ButtonGroup aria-label="Clipboard">
  <button type="button">Cut</button>
  <button type="button">Copy</button>
  <button type="button">Paste</button>
</ButtonGroup>
