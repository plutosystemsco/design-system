<script lang="ts">
  let {
    text,
    class: className = "",
    family,
    size,
    leading,
  }: {
    /** The sample's words. */
    text: string;
    /** The type utility the sample shows, as `text-sm` or `type-display`. */
    class?: string;
    /** A face, as the token file writes it. */
    family?: string;
    /** A size the theme has no utility for, from the token file: px or a clamp. */
    size?: string;
    /** That size's leading, from the token file. */
    leading?: number;
  } = $props();
</script>

<!--
  A line of type set as the token file says (018 decision 12). The sample
  is a picture of the type, so it does not wrap; its row's text says the
  numbers.
-->
<span
  data-slot="specimen"
  class="block whitespace-nowrap {className}"
  style:font-family={family}
  style:font-size={size}
  style:line-height={leading}>{text}</span
>
