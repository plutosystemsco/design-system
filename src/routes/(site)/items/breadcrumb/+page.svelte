<script lang="ts">
  import * as Breadcrumb from "#lib/registry/ui/breadcrumb";
  import * as DropdownMenu from "#lib/registry/ui/dropdown-menu";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

  const hidden = [
    ["Projects", "/items/sidebar/"],
    ["Archive", "/items/sidebar/"],
  ];
</script>

<ItemHeader name="breadcrumb" />

{#snippet withHidden(label: string, testid: string | undefined)}
  <Breadcrumb.Root {label} data-testid={testid}>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            aria-label="Show hidden pages"
            class="inline-flex size-8 items-center justify-center rounded hover:bg-accent hover:text-accent-foreground"
          >
            <Breadcrumb.Ellipsis />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content label="Hidden pages">
            {#each hidden as [name, href] (name)}
              <DropdownMenu.Item>
                {#snippet child({ props })}
                  <a {...props} {href}>{name}</a>
                {/snippet}
              </DropdownMenu.Item>
            {/each}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Dart throws</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
{/snippet}

<PreviewSection
  id="variants"
  title="Variants"
  intro="The path to the current page as a list of links in the muted ink, the current page in the foreground and not a link. A caret divides the steps; an app may pass its own mark."
>
  <div class="grid gap-8">
    <Specimen caption="three levels" class="w-full">
      <Breadcrumb.Root data-testid="breadcrumb-basic">
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/items/sidebar/">Projects</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Dart throws</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </Specimen>
    <Specimen caption="a slash separator" class="w-full">
      <Breadcrumb.Root
        label="Breadcrumb with a slash"
        data-testid="breadcrumb-slash"
      >
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator>/</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/items/sidebar/">Projects</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator>/</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Dart throws</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </Specimen>
    <Specimen
      caption="hidden pages behind the ellipsis, in a menu"
      class="w-full"
    >
      {@render withHidden(
        "Breadcrumb with hidden pages",
        "breadcrumb-ellipsis",
      )}
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="A link lifts to the foreground on hover. The current page is a span with aria-current and no role: never a disabled link."
>
  <p class="max-w-prose text-sm text-muted-foreground">
    The ellipsis is decoration. When pages are left out of the path, wrap it in
    a <code>DropdownMenu.Trigger</code> named "Show hidden pages", 32 px, with a menu
    of those pages, as above.
  </p>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      A <code>nav</code> landmark named "Breadcrumb" (pass <code>label</code>
      when a page has two) holding an ordered list.
    </li>
    <li>
      The current page carries <code>aria-current="page"</code>. It is not a
      link, so it is not a stop.
    </li>
    <li>
      Separators are <code>aria-hidden</code> and out of the tree; a screen reader
      hears the links alone.
    </li>
    <li>
      <code>Breadcrumb.Link</code> takes a <code>child</code> snippet for a framework
      link.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="Two stops: the first link and the ellipsis menu's trigger. The current page is not a stop."
>
  <div data-testid="keyboard-fixture">
    {@render withHidden("Keyboard breadcrumb", undefined)}
  </div>
</PreviewSection>
