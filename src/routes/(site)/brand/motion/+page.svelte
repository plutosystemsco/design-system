<script lang="ts">
  import Page from "#lib/site/brand/page.svelte";
  import Replay from "#lib/site/brand/replay.svelte";
  import Section from "#lib/site/brand/section.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<Page path="/brand/motion/">
  <Section id="answers" title="Motion answers the reader">
    <!-- source: decisions.md, "The identity: the owner's first answers", J2 -->
    <p data-claim="settled">
      After a page's one entrance, nothing moves on its own. A thing moves
      because the reader did something: pressed it, opened it, pointed at it.
      The motion shows what changed, and then it stops.
    </p>
    <!-- source: 017 decision 7, specimens rest until Replay -->
    <p data-claim="none">
      So every specimen on this page is at rest until you press its Replay
      button.
    </p>
  </Section>

  <Section id="entrance" title="One entrance, with springs for the dots">
    <!-- source: decisions.md, "One system, many products", one 900 ms entrance per page; J4; 015 decision 8, the bar's lockup plays it once per full load -->
    <p data-claim="settled">
      A page has one entrance: the mark's four dots dock into place as it loads,
      over {data.entrance} ms. On this page it is the lockup in the bar, once per
      full load; moving from page to page plays none. Nothing else on a page makes
      an entrance.
    </p>
    <!-- source: decisions.md, "The identity: the owner's first answers", J4; 011 decision 10, colour and light never bounce -->
    <p data-claim="settled">
      The dots may spring as they land. Springs belong to the dots alone, and to
      anything made of them. Colour and light never bounce.
    </p>
    <Replay kind="entrance" label="Replay the entrance" />
  </Section>

  <Section id="reveal" title="A response, at most 200 ms">
    <!-- source: decisions.md, "One system, many products", the hover reveal is a response -->
    <p data-claim="settled">
      A response to the reader is quick. When a reader points at a product's
      endorsement line, the four dots appear beside it, the last in place at
      {data.micro} ms. It follows the entrance's path, at a response's speed.
    </p>
    <Replay kind="reveal" label="Replay the reveal" />
  </Section>

  <Section id="reduced" title="When a reader asks for less">
    <!-- source: 011 decision 10; tokens/pluto.tokens.json, motion -->
    <p data-claim="settled">
      Under reduced motion, nothing moves. The mark is composed from the first
      frame, and Replay shows the end state at once.
    </p>
    <div class="pb-16"></div>
  </Section>
</Page>
