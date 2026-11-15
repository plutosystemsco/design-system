<script lang="ts">
  let {
    value,
    theme,
    size = "chip",
    on,
    surface,
    ratio,
  }: {
    /** The colour, from the token file. */
    value: string;
    /** Which theme the value is, said on a phone where the header is hidden. */
    theme?: "light" | "dark";
    /** A 16 px chip beside the value, or a 56 px swatch above it. */
    size?: "chip" | "specimen";
    /** A text role's surface value: the swatch shows "Aa" in `value` on it. */
    on?: string;
    /** The surface's role name, said beside the ratio. */
    surface?: string;
    /** The pair's measured ratio, from `contrastTable`. */
    ratio?: number;
  } = $props();
</script>

<!--
  A colour from the token file. Every swatch is data, like an image: it
  keeps its colour and its hairline edge in forced colours (018 decision 15).
-->
{#snippet label()}
  {#if theme}<span data-md="skip" class="text-muted-foreground md:hidden"
      >{theme === "light" ? "Light" : "Dark"}
    </span>{/if}
{/snippet}

{#if size === "chip"}
  <span class="inline-flex items-center gap-2 whitespace-nowrap">
    <span
      data-slot="swatch"
      data-value={value}
      aria-hidden="true"
      class="inline-block size-4 shrink-0 rounded-full border border-border forced-color-adjust-none"
      style:background-color={value}
    ></span>
    {@render label()}<code>{value}</code>
  </span>
{:else}
  <span class="inline-grid justify-items-start gap-2">
    {@render label()}
    <span class="flex items-center gap-3">
      <span
        data-slot="swatch"
        data-value={on ?? value}
        data-md="skip"
        aria-hidden="true"
        class="grid size-14 shrink-0 place-items-center rounded border border-border text-2xl font-semibold forced-color-adjust-none"
        style:background-color={on ?? value}
        style:color={on ? value : undefined}
        >{#if on}Aa{/if}</span
      >
      {#if ratio !== undefined}
        <span data-ratio class="text-sm whitespace-nowrap tabular-nums"
          >{ratio.toFixed(2)}:1{#if surface}
            on <code>{surface}</code>{/if}</span
        >
      {/if}
    </span>
    <code>{value}</code>
  </span>
{/if}
