<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "Two stops: the first link and the ellipsis menu's trigger. The current page is not a stop.",
    frameMinHeight: 320,
  };
</script>

<script lang="ts">
  import * as Breadcrumb from "#lib/registry/ui/breadcrumb";
  import * as DropdownMenu from "#lib/registry/ui/dropdown-menu";

  const hidden = [
    ["Projects", "/components/sidebar/"],
    ["Archive", "/components/sidebar/"],
  ];
</script>

<div data-testid="keyboard-fixture">
  <Breadcrumb.Root label="Keyboard breadcrumb">
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
</div>
