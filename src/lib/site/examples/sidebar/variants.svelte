<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A navigation landmark on the paper ground, set apart by the vertical groove the page beside it owns. It is a sticky, full-height column, never fixed, 256 px wide; off-canvas it is 0 px wide and inert, and below 768 px it is a sheet. This example shows a whole shell inside the page's column; an app's shell wraps the whole page.",
    frameMinHeight: 480,
  };
</script>

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
  import * as Collapsible from "#lib/registry/ui/collapsible";
  import * as Field from "#lib/registry/ui/field";
  import { FourDot } from "#lib/registry/ui/four-dot";
  import * as Sidebar from "#lib/registry/ui/sidebar";
  import { Textarea } from "#lib/registry/ui/textarea";

  const platform = [
    { name: "Overview", icon: House, current: true },
    { name: "Runs", icon: Play, badge: "12" },
    { name: "Projects", icon: Folder, action: true },
    { name: "Usage", icon: ChartBar },
    { name: "Fuel", icon: Gauge },
  ];
  const projects = ["Dart throws", "Primes", "Sudoku", "Word count"];
  const recent = Array.from({ length: 8 }, (_, i) => `Run ${i + 1}`);
</script>

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
                  <a {...props} href="/components/sidebar/">
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
                      <Sidebar.MenuSubButton href="/components/sidebar/"
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
                  <a {...props} href="/components/sidebar/">
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
        <Sidebar.MenuButton tooltipContent="Ada Lovelace">
          <User aria-hidden="true" />
          <span>Ada Lovelace</span>
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Footer>
{/snippet}

<div class="rounded border border-border">
  <Sidebar.Provider class="min-h-96" data-testid="shell-main">
    <div class="flex h-12 items-center gap-4 px-2">
      <Sidebar.Trigger />
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/components/sidebar/"
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
          Press the trigger, or Ctrl B, to collapse the sidebar off-canvas: its
          rows leave the tab order and the accessibility tree. The shortcut
          yields to a text field.
        </p>
        <Field.Field description="Ctrl B here moves nothing.">
          <Field.Label>Notes</Field.Label>
          <Textarea rows={2} />
        </Field.Field>
      </Sidebar.Inset>
    </div>
  </Sidebar.Provider>
</div>
