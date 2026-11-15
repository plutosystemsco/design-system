<script lang="ts">
  let {
    value,
    theme,
  }: {
    /** The colour, from the token file. */
    value: string;
    /** Which theme the value is, said on a phone where the header is hidden. */
    theme?: "light" | "dark";
  } = $props();
</script>

<!-- A colour from the token file, as a chip and its value. -->
<span class="inline-flex items-center gap-2 whitespace-nowrap">
  <span
    aria-hidden="true"
    class="inline-block size-4 shrink-0 rounded-full border border-border"
    style:background-color={value}
  ></span>
  {#if theme}<span data-md="skip" class="text-muted-foreground md:hidden"
      >{theme === "light" ? "Light" : "Dark"}
    </span>{/if}<code>{value}</code>
</span>
