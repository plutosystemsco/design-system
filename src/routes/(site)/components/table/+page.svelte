<script lang="ts">
  import * as variants from "#lib/site/examples/table/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="table" examples={{ variants }}>
  {#snippet when()}
    <p>
      Use a table for data a reader compares across rows and columns: runs,
      invoices, members. Give it a caption that says what it holds.
    </p>
    <p>
      A selected row's checkbox tells assistive technology it is selected. On
      screen, the row takes the accent inset, the tinted ground of a hovered
      row, and adds a blue left edge. So selected differs from hovered by shape
      as well as colour. Badges carry no tint, so they read on the accent inset.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Give every table a caption.</li>
    <li>Align numbers and times to the right.</li>
    <li>
      Pass <code>label</code> when the table may be wider than its column, so a keyboard
      can scroll it.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Use a table to lay out a page.</li>
    <li>Mark a selected row with <code>aria-selected</code> alone.</li>
    <li>Tell a row's state by its colour alone.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>Native table semantics, with a caption.</li>
    <li>
      A row that can be selected holds a checkbox cell. Its checked state is the
      selection: <code>aria-selected</code> on a plain table row is not
      announced. Set <code>data-state="selected"</code> on the row for the accent
      inset and the blue left edge.
    </li>
    <li>
      The container scrolls sideways when the table is wider than its column.
      With <code>label</code>, it becomes a named <code>region</code> that keyboard
      users can focus and scroll. Without one, it adds no stop.
    </li>
  {/snippet}
</Component>
