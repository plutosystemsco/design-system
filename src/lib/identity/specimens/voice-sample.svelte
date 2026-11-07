<script lang="ts" module>
  export type VoiceSample = {
    empty: { title: string; body: string; action: string };
    error: { title: string; body: string; action: string };
    launch: string;
    taglines: [string, string, string];
  };
</script>

<script lang="ts">
  import type { Look } from "../look.ts";
  import Mark from "./mark.svelte";

  // One voice, writing the same three messages: an empty folder, a refused
  // file and a launch post, then three taglines around the thesis. The
  // panel follows the page's theme, as product screens will.
  let {
    voice,
    look,
    label,
  }: { voice: VoiceSample; look: Look; label: string } = $props();

  const p = $derived(look.palette);
  const chars = $derived(voice.launch.replaceAll("`", "").length);

  /** Text with `code` spans, split so the code can be set in mono. */
  function parts(text: string) {
    return text.split("`").map((t, i) => ({ t, code: i % 2 === 1 }));
  }
</script>

{#snippet rich(
  text: string,
)}{#each parts(text) as part, i (i)}{#if part.code}<code>{part.t}</code
      >{:else}{part.t}{/if}{/each}{/snippet}

<section
  class="voice"
  aria-label={label}
  style="--fd:{look.type.display};--fb:{look.type.body};--fm:{look.type
    .mono};--dw:{look.type.displayWeight};--ra:{look.shape.action};--rc:{look
    .shape.card}"
>
  <div class="msgs">
    <figure class="msg">
      <figcaption class="cap">empty state</figcaption>
      <div class="pane empty">
        <span class="slot" aria-hidden="true">
          <Mark
            colours={[
              "var(--border)",
              "var(--border)",
              "var(--border)",
              "var(--border)",
            ]}
            dot={0.3}
            gap={0.08}
          />
        </span>
        <p class="title">{voice.empty.title}</p>
        <p class="body">{@render rich(voice.empty.body)}</p>
        <button type="button" class="btn primary">{voice.empty.action}</button>
      </div>
    </figure>

    <figure class="msg">
      <figcaption class="cap">error</figcaption>
      <div class="pane error" role="group" aria-label="Error sample">
        <div class="error-head">
          <svg viewBox="0 0 20 20" aria-hidden="true"
            ><rect x="4" y="9" width="12" height="8" rx="2" /><path
              d="M7 9V6.5a3 3 0 0 1 6 0V9"
            /></svg
          >
          <p class="title">{voice.error.title}</p>
        </div>
        <p class="body">{@render rich(voice.error.body)}</p>
        <div class="row">
          <button type="button" class="btn primary">{voice.error.action}</button
          >
          <button type="button" class="btn ghost">Close</button>
        </div>
      </div>
    </figure>

    <figure class="msg">
      <figcaption class="cap">launch post · {chars} characters</figcaption>
      <div class="pane post">
        <div class="post-head">
          <span class="avatar" aria-hidden="true"
            ><Mark
              colours={[
                p.blueLifted,
                p.redLifted,
                p.yellowLifted,
                p.greenLifted,
              ]}
            /></span
          >
          <span><strong>Pluto</strong><span class="handle">@pluto</span></span>
        </div>
        <p class="post-body">{@render rich(voice.launch)}</p>
      </div>
    </figure>
  </div>

  <div class="taglines">
    <p class="cap">three taglines</p>
    <ul>
      {#each voice.taglines as line (line)}<li>{line}</li>{/each}
    </ul>
  </div>
</section>

<style>
  .voice {
    display: flex;
    flex-direction: column;
    gap: 40px;
    font-family: var(--fb);
    color: var(--foreground);
  }
  .msgs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }
  @media (max-width: 960px) {
    .msgs {
      grid-template-columns: 1fr;
    }
  }
  .msg {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .cap {
    font-family: var(--fm);
    font-size: 12px;
    color: var(--muted-foreground);
  }
  .pane {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 24px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--rc);
  }
  .title {
    font-family: var(--fd);
    font-weight: var(--dw);
    font-size: 20px;
    line-height: 1.25;
    letter-spacing: -0.015em;
  }
  .body {
    font-size: 15px;
    line-height: 1.6;
    color: var(--muted-foreground);
  }
  .empty {
    align-items: center;
    text-align: center;
    justify-content: center;
    padding-block: 36px;
  }
  .slot {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    margin-bottom: 4px;
    border-radius: 50%;
    border: 1px dashed var(--border);
    font-size: 26px;
  }
  .error {
    border-top: 3px solid var(--destructive);
  }
  .error-head {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  .error-head svg {
    flex: none;
    width: 22px;
    height: 22px;
    margin-top: 1px;
    fill: none;
    stroke: var(--destructive);
    stroke-width: 1.6;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: auto;
    padding-top: 4px;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    height: 38px;
    padding: 0 16px;
    border-radius: var(--ra);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    max-width: 100%;
  }
  .empty .btn {
    margin-top: 8px;
  }
  .primary {
    background: var(--primary);
    color: var(--primary-foreground);
  }
  .ghost {
    color: var(--foreground);
  }
  .ghost:hover {
    background: var(--accent);
  }
  .btn:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
  code {
    font-family: var(--fm);
    font-size: 0.86em;
    padding: 0 3px;
    border-radius: 4px;
    background: var(--muted);
    color: var(--foreground);
    overflow-wrap: anywhere;
  }
  .post-head {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 15px;
  }
  .avatar {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #050608;
    font-size: 20px;
  }
  .handle {
    margin-left: 8px;
    color: var(--muted-foreground);
  }
  .post-body {
    font-size: 16px;
    line-height: 1.55;
    white-space: pre-line;
  }
  .taglines ul {
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }
  @media (max-width: 960px) {
    .taglines ul {
      grid-template-columns: 1fr;
    }
  }
  .taglines li {
    padding-top: 16px;
    border-top: 1px solid var(--border);
    font-family: var(--fd);
    font-weight: var(--dw);
    font-size: clamp(24px, 2.4vw, 32px);
    line-height: 1.12;
    letter-spacing: -0.03em;
    text-wrap: balance;
  }
</style>
