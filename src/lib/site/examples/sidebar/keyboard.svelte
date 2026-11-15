<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "Three stops: the trigger, then the two rows. Enter on the trigger collapses the sidebar and makes it inert; Enter again restores it. At 360 px, Enter opens the sheet with focus on its first link, and Escape returns focus to the trigger.",
    frameMinHeight: 480,
  };
</script>

<script lang="ts">
  import House from "phosphor-svelte/lib/House";
  import Play from "phosphor-svelte/lib/Play";
  import * as Sidebar from "#lib/registry/ui/sidebar";
</script>

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
                      <a {...props} href="/components/sidebar/">
                        <House aria-hidden="true" />
                        <span>Overview</span>
                      </a>
                    {/snippet}
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton>
                    {#snippet child({ props })}
                      <a {...props} href="/components/sidebar/">
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
      <Sidebar.Inset element="div" label="Keyboard example content" class="p-6">
        <p class="max-w-prose text-sm text-muted-foreground">
          The page beside the sidebar.
        </p>
      </Sidebar.Inset>
    </div>
  </Sidebar.Provider>
</div>
