<script lang="ts">
  import Page from "#lib/site/brand/page.svelte";
  import Section from "#lib/site/brand/section.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const fill = (n: number) => data.fields[n - 1].light.fill;

  // The grounds each colourway is for, as fixed colours: a file's colours
  // do not change with the page's theme.
  const grounds = $derived({
    colour: [
      { name: "the canvas", colour: data.canvas },
      { name: "white", colour: data.white },
    ],
    paper: [
      { name: "the blue field", colour: fill(1) },
      { name: "the red field", colour: fill(2) },
      { name: "the green field", colour: fill(4) },
      { name: "graphite", colour: data.graphite },
    ],
    ink: [
      { name: "the yellow field", colour: fill(3) },
      { name: "the canvas, printed in one colour", colour: data.canvas },
    ],
  });
  const kinds = [
    { id: "mark", title: "The mark" },
    { id: "lockup", title: "The lockup" },
  ] as const;
</script>

<Page path="/brand/downloads/">
  <Section id="files" title="Six files">
    <!-- source: 017 decision 4; decisions.md, "The design site: its name, downloads and the exhibit" -->
    <p data-claim="settled">
      The mark and the lockup, each in three colourways: in colour for light
      grounds, in the brand's paper, {data.canvas}, for the colour fields and
      dark grounds, and in ink for the yellow field and one-colour print. Each
      file is drawn from the token file when this site is built.
    </p>
    <!-- source: 017 decision 4, no clearspace padding in the files; 001 decision 16 -->
    <p data-claim="settled">
      Each file is cut tight to the drawing. Leave the clear space around it
      that the mark page asks for: one dot-pair height.
    </p>
  </Section>

  {#each kinds as k (k.id)}
    <Section id={k.id} title={k.title}>
      <ul class="grid gap-8">
        {#each data.downloads.filter((d) => d.kind === k.id) as d (d.file)}
          <!-- source: 017 decision 4, each file for the grounds it suits -->
          <li data-claim="settled" class="grid gap-3">
            <div class="grid gap-2 sm:grid-cols-2">
              {#each grounds[d.colourway] as g (g.name)}
                <div
                  class="grid place-items-center rounded border border-border p-8"
                  style:background-color={g.colour}
                >
                  <img
                    src="/brand/downloads/{d.file}"
                    alt="The {k.id}, in {d.colourway}, on {g.name}"
                    class={k.id === "mark" ? "h-12" : "h-14"}
                  />
                </div>
              {/each}
            </div>
            <span>{d.for}</span>
            <a
              href="/brand/downloads/{d.file}"
              download
              data-slot="download-link"
              class="justify-self-start font-mono text-sm text-primary underline underline-offset-4"
              >{d.file}</a
            >
          </li>
        {/each}
      </ul>
    </Section>
  {/each}

  <Section id="licence" title="The typeface">
    <!-- source: 017, risks, the font licence -->
    <p data-claim="settled" class="pb-16">
      The lockup's word is IBM Plex Sans at weight 700, outlined, under the SIL
      Open Font License.
    </p>
  </Section>
</Page>
