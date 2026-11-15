<script lang="ts">
  import * as keyboard from "#lib/site/examples/dropdown-menu/keyboard.svelte";
  import * as variants from "#lib/site/examples/dropdown-menu/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="dropdown-menu" examples={{ variants, keyboard }}>
  {#snippet when()}
    <p>
      Use a dropdown menu for a list of actions or settings behind one button:
      an account menu, an overflow of row actions. To choose a value in a form,
      use a native select. To show a few actions, show them as buttons.
    </p>
    <p>
      Hover and keyboard focus are one state, the accent inset; the focused item
      also carries the global ring, so a keyboard user can tell focus from the
      pointer. A checked item shows its check at the start. A destructive item
      is red text on the same inset, with no tint.
    </p>
    <ul class="grid list-disc gap-2 ps-6">
      <li>
        A destructive item carries an icon or a telling word ("Delete project",
        never a lone "Delete"): red text alone tells the state by colour.
      </li>
      <li>
        The shortcut is words ("Shift Cmd P"), hidden from the item's name, and
        binds nothing. An app that shows one binds the key itself and sets
        <code>aria-keyshortcuts</code> on the item.
      </li>
      <li>
        A disabled item is <code>aria-disabled</code> and the arrow keys skip it.
      </li>
    </ul>
  {/snippet}
  {#snippet dos()}
    <li>Name every menu, by a group heading or by <code>label</code>.</li>
    <li>Group related items, with a heading for each group.</li>
    <li>Put something after the trigger, so Tab can close the menu.</li>
  {/snippet}
  {#snippet donts()}
    <li>
      Hide the action most people came for in a menu. Show it as a button.
    </li>
    <li>Write a lone "Delete" in red. Say what it deletes.</li>
    <li>Show a shortcut the app does not bind.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The trigger promises a menu (<code>aria-haspopup="menu"</code>) and says
      whether it is open (<code>aria-expanded</code>); the content is
      <code>role="menu"</code> with <code>menuitem</code>,
      <code>menuitemcheckbox</code>, <code>menuitemradio</code> and
      <code>separator</code> items.
    </li>
    <li>
      <strong>A menu is named.</strong> A <code>GroupHeading</code> inside a
      <code>Group</code> names the group, and the menu is named by its trigger;
      a menu with no heading passes <code>label</code> to its content. There is no
      Label part: a loose line of text names nothing.
    </li>
    <li>
      Enter, Space and ArrowDown open the menu with focus on the first item; the
      arrows loop; Home and End jump; Right opens a submenu and Left closes it;
      Escape closes and returns focus to the trigger; Tab closes and moves on.
    </li>
    <li>Icons are hidden from assistive technology; the text is the name.</li>
  {/snippet}
</Component>
