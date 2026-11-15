<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import * as Card from "#lib/registry/ui/card";
  import { Input } from "#lib/registry/ui/input";
  import { Label } from "#lib/registry/ui/label";
  import Page from "#lib/site/brand/page.svelte";
  import Section from "#lib/site/brand/section.svelte";
</script>

<Page path="/brand/imagery/">
  <Section id="kinds" title="Four kinds of picture">
    <!-- source: decisions.md, "The identity: the owner's first answers", M1 to M4 -->
    <p data-claim="settled">
      Pluto shows four kinds of picture: the product as it is, figures, people
      at work, and abstract data. Each page picks the one that fits its job.
    </p>
  </Section>

  <Section id="product" title="The product as it is">
    <!-- source: decisions.md, M1, product truth; the identity options, M1: real screens, nothing staged -->
    <p data-claim="settled">
      For showing what a product does: real screens and real output. Crop them,
      zoom in or annotate them, but never stage them.
    </p>
    <figure class="grid gap-3">
      <Card.Root class="max-w-sm">
        <Card.Content class="grid gap-3">
          <Label for="imagery-search">Search the workspace</Label>
          <Input id="imagery-search" value="quarterly plan" readonly />
          <Button class="justify-self-start">Search</Button>
        </Card.Content>
      </Card.Root>
      <figcaption data-claim="none" class="text-sm text-muted-foreground">
        This system's own search card, as it renders: a card, a label, a field
        and a button, with nothing painted on.
      </figcaption>
    </figure>
  </Section>

  <Section id="figures" title="Figures">
    <!-- source: decisions.md, M2, figures; the identity options, M2: exact figures of data, permissions and flows -->
    <p data-claim="settled">
      For explaining how something works: an exact figure of data, permissions
      or a flow, such as products resting on one data layer.
    </p>
    <div
      class="grid max-w-md gap-2"
      aria-label="Products on one data layer"
      role="img"
    >
      <div class="grid grid-cols-3 gap-2 text-sm font-medium">
        <span class="rounded border border-border bg-card p-3">Docs</span>
        <span class="rounded border border-border bg-card p-3">Sheets</span>
        <span class="rounded border border-border bg-card p-3">Search</span>
      </div>
      <span
        class="rounded bg-primary p-3 text-sm font-medium text-primary-foreground"
        >One data layer</span
      >
    </div>
  </Section>

  <Section id="people" title="People at work">
    <!-- source: decisions.md, M3, people at work; the identity options, M3: real people mid-task, no posing; 017 decision 7, no photographs yet -->
    <p data-claim="settled">
      For showing the work people finish: real people mid-task, never posed.
      Pluto has no photographs yet, so this page shows none.
    </p>
  </Section>

  <Section id="data" title="Abstract data">
    <!-- source: decisions.md, M4, abstract data; the identity options, M4: large abstract images for campaigns -->
    <p data-claim="settled" class="pb-16">
      For a campaign: large abstract images made from data. Pluto has none drawn
      yet, so this page shows none.
    </p>
  </Section>
</Page>
