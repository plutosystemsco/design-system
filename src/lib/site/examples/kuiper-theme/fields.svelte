<script lang="ts" module>
  export const meta = {
    title: "Colour fields",
    intro:
      "The four fields side by side: a flat area of one brand colour each, in the mark's order. A heading, a paragraph, a link and the focus ring on a field read its legend; a surface-plain card and glass get the theme's own roles back.",
  };
</script>

<script lang="ts">
  import * as Card from "#lib/registry/ui/card";
  import { pointerLight } from "#lib/registry/ui/liquid-glass";

  // The class names are written out so Tailwind finds them in this file.
  const FIELDS = [
    { n: 1, cls: "field-1", name: "Blue" },
    { n: 2, cls: "field-2", name: "Red" },
    { n: 3, cls: "field-3", name: "Yellow" },
    { n: 4, cls: "field-4", name: "Green" },
  ] as const;
</script>

<div
  data-mode="expressive"
  data-testid="brand"
  class="grid gap-4 md:grid-cols-2"
>
  {#each FIELDS as field (field.n)}
    <section
      data-testid="field-{field.n}"
      aria-labelledby="field-{field.n}-heading"
      class="{field.cls} grid content-start gap-4 rounded p-6"
    >
      <h4
        id="field-{field.n}-heading"
        data-probe="heading"
        class="font-heading text-2xl font-bold text-foreground"
      >
        {field.name}, <code class="text-base">{field.cls}</code>
      </h4>
      <p data-probe="text" class="max-w-prose text-muted-foreground">
        Text on the field takes its legend. A link here is the legend too,
        underlined:
        <a
          data-probe="link"
          href="/components/card/"
          class="text-primary underline">the card a field holds</a
        >.
      </p>
      <Card.Root data-probe="card" class="surface-plain">
        <Card.Header>
          <Card.Title level={5} data-probe="card-title"
            >A card on the field</Card.Title
          >
          <Card.Description data-probe="card-description"
            >Its own ground and the theme's own roles.</Card.Description
          >
        </Card.Header>
        <Card.Content>
          <a
            data-probe="card-link"
            href="/components/card/"
            class="text-sm text-primary underline">Open the card's page</a
          >
        </Card.Content>
      </Card.Root>
      <div
        data-probe="glass"
        class="glass grid gap-1 p-4"
        {@attach pointerLight}
      >
        <p data-probe="glass-title" class="font-heading font-bold">
          Glass on the field
        </p>
        <p data-probe="glass-description" class="text-sm text-muted-foreground">
          Frosted over the colour; its edge lights where the pointer moves.
        </p>
        <a
          data-probe="glass-link"
          href="/components/liquid-glass/"
          class="w-fit text-sm text-primary underline">Open liquid glass</a
        >
      </div>
    </section>
  {/each}
</div>
