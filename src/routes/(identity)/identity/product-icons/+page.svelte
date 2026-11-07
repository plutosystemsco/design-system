<script lang="ts">
  import Board from "#lib/identity/board.svelte";
  import Option from "#lib/identity/option.svelte";
  import Ground from "#lib/identity/specimens/ground.svelte";
  import IconSet from "#lib/identity/specimens/icon-set.svelte";
  import IconKeyboard from "#lib/identity/specimens/icon-keyboard.svelte";
  import type { KeyVariant } from "#lib/identity/specimens/icon-key.svelte";
  import { ordered, question } from "#lib/identity/questions";
  import { DARK, LIGHT } from "#lib/identity/round-two";

  const q = question("product-icons");
  type Variant = "G1" | "G2" | "G3" | "G4";

  // Round two draws on its own grounds: the warm canvas and warm graphite
  // (round-two.ts), set on Ground through its colour variables.
  const CANVAS = `--g-bg:${LIGHT.canvas};--g-text:${LIGHT.ink};--g-muted:${LIGHT.inkSoft};--g-line:${LIGHT.hairline}`;
  const GRAPHITE = `--g-bg:${DARK.canvas};--g-text:${DARK.text};--g-muted:${DARK.muted};--g-line:${DARK.hairline}`;

  const NOTE: Record<string, string> = {
    G1: "Dot positions: blue, top left, for Docs and Slides; red, top right, for Mail and Chat; yellow, bottom left, for Calendar and Search; green, bottom right, for Sheets and Files. At 16 px the glyph is about 6 px across and reads as a coloured dot: the two apps that share a colour cannot be told apart there.",
    G2: "The yellow tile carries an ink glyph: white on this yellow is 1.9 : 1, ink is 9.3 : 1. The tiles keep their paper colours on the stage; the lifted colours are too light to hold a white glyph.",
    G3: "Each glyph is cut into four quarters, one per colour, in the mark's order. Drawn with Pluto's own glyphs, not Google's.",
    G5: "The yellow tile carries an ink glyph: white on yellow is 2.18 : 1, ink is 8.81 : 1. The tile keeps its colour on graphite, so the app looks the same in both themes.",
    G6: "The glyph's tone layer, drawn here at full opacity in the app's colour, covers 2.4 % of Docs' box and 45.7 % of Chat's. Above 32 px the line is regular; at 32 and 16 it is bold.",
    G7: "The skirt is 6 units of the 64 master: 5 px at 48, 3 px at 32. At 16 px the skirt goes and a 1 px edge in the app's colour stands in for it.",
    G8: "The skirt is two ramp steps darker than the face; at 16 px it drops and the key becomes a flat tile. On graphite the skirt fades into the page, and the face carries the meaning.",
    G9: "Every key has the same grey skirt, so the family reads as one keyboard. The colour comes only from the tone layer, as in G6.",
    G4: "The tile is paper on paper and ink on the stage. The dot is the app's colour, ringed in the tile's colour so it separates from the glyph.",
  };
</script>

<Board question={q}>
  {#each ordered(q) as option (option.id)}
    <Option {option}>
      {#snippet specimen()}
        {#if option.id === "G3"}
          <p class="warn" role="note">
            <strong>Shown to rule out: reads as Google.</strong>
            Every icon in all four colours is Google's 2020 Workspace approach. Pluto
            should not ship it.
          </p>
        {/if}
        {#if option.round === 2}
          {@const v = option.id as KeyVariant}
          <div class="grounds">
            <Ground
              ground="paper"
              style={CANVAS}
              caption="{option.id} · on the warm canvas"
            >
              <IconKeyboard variant={v} theme="light" />
            </Ground>
            <Ground
              ground="stage"
              style={GRAPHITE}
              caption="{option.id} · on graphite"
            >
              <IconKeyboard variant={v} theme="dark" />
            </Ground>
            {#if v === "G8"}
              <Ground
                ground="paper"
                style={CANVAS}
                caption="G8 mono · on the warm canvas"
              >
                <IconKeyboard variant={v} theme="light" mono />
              </Ground>
              <Ground
                ground="stage"
                style={GRAPHITE}
                caption="G8 mono · on graphite"
              >
                <IconKeyboard variant={v} theme="dark" mono />
              </Ground>
            {/if}
          </div>
        {:else}
          <div class="grounds">
            <Ground ground="paper" caption="{option.id} · on paper">
              <IconSet variant={option.id as Variant} ground="paper" />
            </Ground>
            <Ground ground="stage" caption="{option.id} · on the stage">
              <IconSet variant={option.id as Variant} ground="stage" />
            </Ground>
          </div>
        {/if}
        <p class="note">{NOTE[option.id]}</p>
      {/snippet}
    </Option>
  {/each}
</Board>

<style>
  .grounds {
    display: grid;
    gap: 16px;
  }
  @media (min-width: 1024px) {
    .grounds {
      grid-template-columns: 1fr 1fr;
    }
  }
  .note {
    margin-top: 12px;
    max-width: 72ch;
    font-size: 14px;
    color: var(--muted-foreground);
  }
  .warn {
    margin: 0 0 16px;
    padding: 14px 18px;
    border: 1px solid #c42a1f;
    border-left-width: 4px;
    border-radius: 8px;
    color: var(--foreground);
    background: #c42a1f0f;
  }
  .warn strong {
    color: #c42a1f;
    font-weight: 600;
  }
  :global(.dark) .warn {
    border-color: #ff7d73;
    background: #ff7d7314;
  }
  :global(.dark) .warn strong {
    color: #ff7d73;
  }
</style>
