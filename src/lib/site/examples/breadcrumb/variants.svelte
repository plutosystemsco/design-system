<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "The path to the current page as a list of links in the muted ink, the current page in the foreground and not a link. A caret divides the steps; an app may pass its own mark. From the top: three levels, a slash separator, and hidden pages behind the ellipsis, in a menu.",
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

<div class="grid gap-8">
  <Breadcrumb.Root data-testid="breadcrumb-basic">
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/components/sidebar/">Projects</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Dart throws</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
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
        <Breadcrumb.Link href="/components/sidebar/">Projects</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator>/</Breadcrumb.Separator>
      <Breadcrumb.Item>
        <Breadcrumb.Page>Dart throws</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <Breadcrumb.Root
    label="Breadcrumb with hidden pages"
    data-testid="breadcrumb-ellipsis"
  >
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
