<script lang="ts" module>
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  export type TagGroupProps = Omit<
    HTMLAttributes<HTMLUListElement>,
    "class" | "children"
  > & {
    /** What the tags are, such as "Filters". Or use `aria-labelledby`. Required: a list of tags needs a name. Without a `fallback`, use `aria-label`: an emptied list shows that name to a screen reader as hidden text. */
    "aria-label"?: string;
    /** Where focus goes when no tag control is left, such as the input that adds tags. Without it, the list itself takes focus, and its name is spoken. */
    fallback?: () => HTMLElement | null;
    /** Classes for the list. */
    class?: string;
    /** The list, bound. */
    ref?: HTMLUListElement | null;
    /** The tags: `Tag`s, each an item of the list. */
    children?: Snippet;
  };

  /** What a `Tag` tells its group, under the key "kuiper:tag-group". */
  export type TagGroupContext = {
    /** Called by a tag before its `onremove`: its control's index among the group's tag controls. */
    removing(index: number): void;
  };

  /** The context key a `TagGroup` sets and a `Tag` reads. */
  export const TAG_GROUP_KEY = "kuiper:tag-group";
</script>

<script lang="ts">
  import { setContext, tick } from "svelte";
  import { cn } from "#lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    fallback,
    children,
    ...restProps
  }: TagGroupProps = $props();

  // One index space: the group's tag controls, remove buttons and
  // pressable tags, in DOM order. Static tags hold none. After the app
  // removes the tag, focus goes to the control now at its index, then the
  // one before, then the fallback, then the list.
  setContext<TagGroupContext>(TAG_GROUP_KEY, {
    removing(index) {
      void tick().then(() => {
        const list = ref;
        if (!list) return;
        const controls =
          list.querySelectorAll<HTMLElement>("[data-tag-control]");
        const next =
          controls[index] ?? controls[index - 1] ?? fallback?.() ?? list;
        next.focus();
      });
    },
  });
</script>

<!--
  A named list of tags that keeps focus when a tag goes. The explicit list
  role keeps its semantics in WebKit, which drops them from an unstyled
  list outside a nav. It takes focus, by script only, when it empties.
  With no element in it, it says its aria-label as hidden generated text,
  not an item: NVDA's browse buffer renders nothing for an empty list, and
  says "blank" (022s). A space between two blocks does not count.
-->
<!-- svelte-ignore a11y_no_redundant_roles -->
<ul
  bind:this={ref}
  data-slot="tag-group"
  role="list"
  tabindex="-1"
  class={cn(
    "flex flex-wrap items-center gap-2 not-has-[>*]:before:sr-only not-has-[>*]:before:content-[attr(aria-label)]",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</ul>
