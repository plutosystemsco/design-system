<script lang="ts">
  import * as Sidebar from "#lib/components/ui/sidebar";
</script>

<Sidebar.Provider>
  <Sidebar.Root label="Main">
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton isActive>Overview</Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar.Content>
  </Sidebar.Root>
  <Sidebar.Inset>
    <Sidebar.Trigger />
  </Sidebar.Inset>
</Sidebar.Provider>
