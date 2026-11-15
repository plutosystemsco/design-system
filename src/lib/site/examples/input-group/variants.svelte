<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "Addons sit inline at the start or end, or as a block above or below. The group takes the input recipe and draws one focus ring around itself.",
  };
</script>

<script lang="ts">
  import ArrowRight from "phosphor-svelte/lib/ArrowRight";
  import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
  import * as InputGroup from "#lib/registry/ui/input-group";
  import { Label } from "#lib/registry/ui/label";
</script>

<div class="grid max-w-md gap-8">
  <div class="grid w-full gap-3">
    <Label for="ig-search">Search runs</Label>
    <InputGroup.Root>
      <InputGroup.Addon>
        <MagnifyingGlass aria-hidden="true" />
      </InputGroup.Addon>
      <InputGroup.Input id="ig-search" placeholder="Run id or branch" />
      <InputGroup.Addon align="inline-end">
        <InputGroup.Button size="icon-sm" aria-label="Search">
          <ArrowRight aria-hidden="true" />
        </InputGroup.Button>
      </InputGroup.Addon>
    </InputGroup.Root>
  </div>
  <div class="grid w-full gap-3">
    <Label for="ig-domain">Subdomain</Label>
    <InputGroup.Root>
      <InputGroup.Input id="ig-domain" value="pluto-sandbox" />
      <InputGroup.Addon align="inline-end">
        <InputGroup.Text>.example.com</InputGroup.Text>
      </InputGroup.Addon>
    </InputGroup.Root>
  </div>
  <div class="grid w-full gap-3">
    <Label for="ig-message">Message</Label>
    <InputGroup.Root>
      <InputGroup.Textarea id="ig-message" placeholder="Ask about this run" />
      <InputGroup.Addon align="block-end">
        <InputGroup.Text>Enter to send</InputGroup.Text>
        <InputGroup.Button variant="default" class="ml-auto"
          >Send</InputGroup.Button
        >
      </InputGroup.Addon>
    </InputGroup.Root>
  </div>
</div>
