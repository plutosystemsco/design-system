<script lang="ts">
  import Page from "#lib/site/brand/page.svelte";
  import Section from "#lib/site/brand/section.svelte";

  // Each rule, with when to say more and when to say less.
  const RULES = [
    {
      rule: "Say what happens.",
      more: "Name an action in active words: “Save the draft”, not “Submit”.",
      less: "Leave out filler and selling: “Save”, not “Click here to save your work”.",
    },
    {
      rule: "Keep one name through a flow.",
      more: "If the first screen says “workspace”, every screen after it says “workspace”.",
      less: "When the action is done, the same word says so: “Stop” becomes “Stopped”.",
    },
    {
      rule: "Errors direct.",
      more: "Say what went wrong and what to do next: “The file is over 10 MB. Choose a smaller one.”",
      less: "Leave out what the reader cannot act on, such as a server's error detail.",
    },
    {
      rule: "Empty states invite.",
      more: "Say what will be here, and offer the first step.",
      less: "A line and a first step are enough: “No messages yet. Write a message below to start.”",
    },
    {
      rule: "Furniture carries information.",
      more: "Furniture is what sits around the words: an eyebrow, a divider, a number. Each appears only where it means something: a mono row holds data, a number marks a sequence.",
      less: "None of the generic kit: no all-caps labels, no eyebrow over every heading, no meta strings joined with middle dots, no arrow after link text, no identical cards with one shadow.",
    },
  ];
</script>

<Page path="/brand/voice/">
  <Section id="warm" title="Warm and human">
    <!-- source: decisions.md, "The identity: the owner's first answers", L3; the identity options, L3: the work, not the tool; what you finish, what you get back -->
    <p data-claim="settled">
      Pluto writes warmly, to people, about what they care about. It talks about
      the reader's work, not about the tool: what they finish, and what they get
      back.
    </p>
    <!-- source: decisions.md, L3, warm and human; "The identity is commissioned", the tagline -->
    <p data-claim="settled">Its line is four words: “Work runs on data.”</p>
  </Section>

  <Section id="rules" title="The writing rules">
    <!-- source: decisions.md, "Two writing and furniture rules join the checklist", R23 and R24 -->
    <p data-claim="settled">
      Five rules hold every screen, page and message. For each, there is a time
      to say more and a time to say less.
    </p>
    <ul class="grid gap-6 pb-16">
      {#each RULES as r (r.rule)}
        <!-- source: decisions.md, "Two writing and furniture rules join the checklist", R23 and R24; 002 decision 9, R23 and R24 in full; 015 decision 17; 006, the chat pane's error and empty state -->
        <li data-claim="settled" class="grid gap-1">
          <strong class="font-semibold">{r.rule}</strong>
          <span><span class="font-medium">More:</span> {r.more}</span>
          <span><span class="font-medium">Less:</span> {r.less}</span>
        </li>
      {/each}
    </ul>
  </Section>
</Page>
