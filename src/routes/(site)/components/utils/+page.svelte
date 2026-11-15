<script lang="ts">
  import * as calls from "#lib/site/examples/utils/calls.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="utils" examples={{ calls }}>
  {#snippet when()}
    <p>
      <code>cn</code> merges class names the way Tailwind reads them: a later
      class of the same kind wins. Use it wherever a component takes a
      <code>class</code> prop and merges it with its own.
    </p>
    <p>
      The file also exports the prop-type helpers stock components import:
      <code>WithoutChild</code>, <code>WithoutChildren</code>,
      <code>WithoutChildrenOrChild</code>
      and
      <code>WithElementRef</code>.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Put the component's own classes first and the caller's last, so the
      caller's win.
    </li>
    <li>
      Pass a condition as <code>flag &amp;&amp; "class"</code>; a false value is
      dropped.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>
      Join class strings by hand. Two classes of one kind would both stay.
    </li>
    <li>
      Build a class name from parts, such as <code>"bg-" + tone</code>. Tailwind
      cannot find it.
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      <code>cn</code> renders nothing: it returns a class string, so it has no role,
      no name and no keyboard behaviour.
    </li>
    <li>
      It can drop a class you meant to keep, such as a focus ring, when a later
      class of the same kind follows. Check the merged string when a state stops
      showing.
    </li>
  {/snippet}
</Component>
