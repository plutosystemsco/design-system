<script lang="ts">
  import CaretRight from "phosphor-svelte/lib/CaretRight";
  import ChartBar from "phosphor-svelte/lib/ChartBar";
  import DotsThree from "phosphor-svelte/lib/DotsThree";
  import Folder from "phosphor-svelte/lib/Folder";
  import Gauge from "phosphor-svelte/lib/Gauge";
  import House from "phosphor-svelte/lib/House";
  import Play from "phosphor-svelte/lib/Play";
  import User from "phosphor-svelte/lib/User";
  import * as Breadcrumb from "#lib/registry/ui/breadcrumb";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import * as Collapsible from "#lib/registry/ui/collapsible";
  import * as Field from "#lib/registry/ui/field";
  import { FourDot } from "#lib/registry/ui/four-dot";
  import * as Sidebar from "#lib/registry/ui/sidebar";
  import { Textarea } from "#lib/registry/ui/textarea";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";

  const platform = [
    { name: "Overview", icon: House, current: true },
    { name: "Runs", icon: Play, badge: "12" },
    { name: "Projects", icon: Folder, action: true },
    { name: "Usage", icon: ChartBar },
    { name: "Fuel", icon: Gauge },
  ];
  const projects = ["Dart throws", "Primes", "Sudoku", "Word count"];
  const recent = Array.from({ length: 8 }, (_, i) => `Run ${i + 1}`);

  const serverLoad = `import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ cookies }) => ({
  sidebarOpen: cookies.get("sidebar_state") !== "false",
});`;
  const layout = `<Sidebar.Provider open={data.sidebarOpen}>`;
</script>

<ItemHeader name="sidebar" />

{#snippet menu()}
  <Sidebar.Header>
    <!-- As icons the text is hidden and the mark alone reads, in a 32 px tile; the name stays for a reader. -->
    <h3
      class="flex h-12 items-center gap-2 px-2 font-heading text-base font-bold"
    >
      <span class="flex size-8 shrink-0 items-center justify-center">
        <FourDot class="text-5xl" />
      </span>
      <span class="group-data-[collapsible=icon]:sr-only">Pluto</span>
    </h3>
    <Sidebar.Input placeholder="Search" aria-label="Search" />
  </Sidebar.Header>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each platform as item (item.name)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                isActive={item.current}
                tooltipContent={item.name}
              >
                {#snippet child({ props })}
                  <a {...props} href="/items/sidebar/">
                    <item.icon aria-hidden="true" />
                    <span>{item.name}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
              {#if item.badge}
                <Sidebar.MenuBadge>{item.badge}</Sidebar.MenuBadge>
              {/if}
              {#if item.action}
                <Sidebar.MenuAction aria-label="More for {item.name}">
                  <DotsThree aria-hidden="true" />
                </Sidebar.MenuAction>
              {/if}
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Collapsible.Root open class="group/collapsible">
              <Collapsible.Trigger>
                {#snippet child({ props })}
                  <Sidebar.MenuButton {...props} tooltipContent="Mine">
                    <Folder aria-hidden="true" />
                    <span>Mine</span>
                    <CaretRight
                      aria-hidden="true"
                      class="ms-auto transition group-data-[state=open]/collapsible:rotate-90"
                    />
                  </Sidebar.MenuButton>
                {/snippet}
              </Collapsible.Trigger>
              <Collapsible.Content>
                <Sidebar.MenuSub>
                  {#each projects as project (project)}
                    <Sidebar.MenuSubItem>
                      <Sidebar.MenuSubButton href="/items/sidebar/"
                        ><span>{project}</span></Sidebar.MenuSubButton
                      >
                    </Sidebar.MenuSubItem>
                  {/each}
                </Sidebar.MenuSub>
              </Collapsible.Content>
            </Collapsible.Root>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Recent runs</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each recent as run (run)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton size="sm" tooltipContent={run}>
                {#snippet child({ props })}
                  <a {...props} href="/items/sidebar/">
                    <Play aria-hidden="true" />
                    <span>{run}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
  <Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton tooltipContent="Clay Gendron">
          <User aria-hidden="true" />
          <span>Clay Gendron</span>
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Footer>
{/snippet}

<PreviewSection
  id="variants"
  title="Variants"
  intro="A navigation landmark on the paper ground, set apart by the vertical groove the page beside it owns. It is a sticky, full-height column, never fixed, 256 px wide; off-canvas it is 0 px wide and inert, and below 768 px it is a sheet. This page shows a whole shell inside the site's column; an app's shell wraps the whole page."
>
  <div class="grid gap-8">
    <div class="rounded border border-border">
      <Sidebar.Provider class="min-h-96" data-testid="shell-main">
        <div class="flex h-12 items-center gap-4 px-2">
          <Sidebar.Trigger />
          <Breadcrumb.Root>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/items/sidebar/"
                  >Projects</Breadcrumb.Link
                >
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page>Dart throws</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </div>
        <div class="flex flex-1">
          <Sidebar.Root label="Main">
            {@render menu()}
          </Sidebar.Root>
          <Sidebar.Inset
            element="div"
            label="Main example content"
            class="gap-4 p-6"
          >
            <h3 class="font-heading text-2xl font-bold tracking-section">
              Dart throws
            </h3>
            <p class="max-w-prose text-sm text-muted-foreground">
              Press the trigger, or Ctrl B, to collapse the sidebar off-canvas:
              its rows leave the tab order and the accessibility tree. The
              shortcut yields to a text field.
            </p>
            <Field.Field description="Ctrl B here moves nothing.">
              <Field.Label>Notes</Field.Label>
              <Textarea rows={2} />
            </Field.Field>
          </Sidebar.Inset>
        </div>
      </Sidebar.Provider>
    </div>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="Collapsed to icons, each row is a 32 px icon with its tooltip naming it; sub-items leave the order and the content still scrolls. An app's shell chooses the mode; off-canvas is the default."
>
  <div class="rounded border border-border">
    <Sidebar.Provider open={false} class="min-h-96" data-testid="shell-icon">
      <div class="flex h-12 items-center gap-4 px-2">
        <Sidebar.Trigger />
      </div>
      <div class="flex flex-1">
        <Sidebar.Root label="Icon example" collapsible="icon">
          {@render menu()}
        </Sidebar.Root>
        <Sidebar.Inset
          element="div"
          label="Icon example content"
          class="gap-4 p-6"
        >
          <h3 class="font-heading text-2xl font-bold tracking-section">
            Icons
          </h3>
          <p class="max-w-prose text-sm text-muted-foreground">
            The current row keeps its inset and primary edge as an icon. Press
            the trigger to expand it.
          </p>
        </Sidebar.Inset>
      </div>
    </Sidebar.Provider>
  </div>
</PreviewSection>

<PreviewSection
  id="cookie"
  title="The cookie"
  intro="The provider writes sidebar_state on every toggle and never reads it. An app's +layout.server.ts reads it and passes open to the provider, so the first paint is right."
>
  <div class="grid max-w-2xl gap-8">
    <CodeBlock.Root>
      <CodeBlock.Header>
        <CodeBlock.Title>+layout.server.ts</CodeBlock.Title>
      </CodeBlock.Header>
      <CodeBlock.Content code={serverLoad} lineNumbers />
    </CodeBlock.Root>
    <CodeBlock.Root>
      <CodeBlock.Header>
        <CodeBlock.Title>+layout.svelte</CodeBlock.Title>
      </CodeBlock.Header>
      <CodeBlock.Content code={layout} lineNumbers />
    </CodeBlock.Root>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      The sidebar is a <code>nav</code> landmark named "Main" (pass
      <code>label</code> when a shell has a second nav). The inset is the page's
      <code>main</code>
      with <code>id="main"</code> and
      <code>tabindex="-1"</code>, the skip link's target; on a page that has a
      main already, pass <code>element="div"</code> and a <code>label</code>
      for a region.
    </li>
    <li>
      The trigger is a disclosure: <code>aria-expanded</code> and
      <code>aria-controls</code> naming the nav. On a phone it opens a dialog
      and says so with <code>aria-haspopup="dialog"</code>. Place it before the
      sidebar, in the shell's header.
    </li>
    <li>
      Off-canvas, the collapsed nav is <code>inert</code>: its rows leave the
      tab order and the accessibility tree while the state persists.
    </li>
    <li>
      The current row carries <code>aria-current="page"</code> (set by
      <code>isActive</code>), the accent inset and a primary start edge, so it
      differs from a hovered row by shape.
    </li>
    <li>
      Ctrl B and Cmd B toggle, except inside a text field, an editable region or
      the code editor, and after a handled event.
    </li>
    <li>
      Below 768 px the sidebar is a sheet named "Sidebar" that returns focus to
      the trigger. A page prerenders the desktop tree, hidden below 768 px until
      hydration replaces it; with JavaScript off a phone has no sidebar.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="Three stops: the trigger, then the two rows. Enter on the trigger collapses the sidebar and makes it inert; Enter again restores it. At 360 px, Enter opens the sheet with focus on its first link, and Escape returns focus to the trigger."
>
  <div data-testid="keyboard-fixture" class="rounded border border-border">
    <Sidebar.Provider class="min-h-96">
      <div class="flex h-12 items-center gap-4 px-2">
        <Sidebar.Trigger />
      </div>
      <div class="flex flex-1">
        <Sidebar.Root label="Keyboard example" class="h-96">
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupContent>
                <Sidebar.Menu>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton isActive>
                      {#snippet child({ props })}
                        <a {...props} href="/items/sidebar/">
                          <House aria-hidden="true" />
                          <span>Overview</span>
                        </a>
                      {/snippet}
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton>
                      {#snippet child({ props })}
                        <a {...props} href="/items/sidebar/">
                          <Play aria-hidden="true" />
                          <span>Runs</span>
                        </a>
                      {/snippet}
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                </Sidebar.Menu>
              </Sidebar.GroupContent>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar.Root>
        <Sidebar.Inset
          element="div"
          label="Keyboard example content"
          class="p-6"
        >
          <p class="max-w-prose text-sm text-muted-foreground">
            The page beside the sidebar.
          </p>
        </Sidebar.Inset>
      </div>
    </Sidebar.Provider>
  </div>
</PreviewSection>
