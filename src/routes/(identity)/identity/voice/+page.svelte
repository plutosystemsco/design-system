<script lang="ts">
  import Board from "#lib/identity/board.svelte";
  import Option from "#lib/identity/option.svelte";
  import StageHero from "#lib/identity/specimens/stage-hero.svelte";
  import VoiceSample, {
    type VoiceSample as Sample,
  } from "#lib/identity/specimens/voice-sample.svelte";
  import { COPY, look } from "#lib/identity/look";
  import { question } from "#lib/identity/questions";

  const q = question("voice");

  // The same three messages and the thesis, in each voice.
  const SAMPLES: Record<string, Sample> = {
    L1: {
      empty: {
        title: "This folder has no files.",
        body: "Upload a file or move one here. Everyone with access to the folder, and their agents, will see it.",
        action: "Upload a file",
      },
      error: {
        title: "You don't have access to this file.",
        body: "forecast.xlsx belongs to Finance. Ask its owner, Dana Reyes, for access. She will get your request by mail.",
        action: "Request access",
      },
      launch:
        "Pluto Sheets is available today. Sheets share one data layer with Docs and Mail, under the same permissions. An agent can read a sheet only if its user can. Free for teams of up to ten.",
      taglines: [
        "Work runs on data.",
        "Work runs on data. Keep it in one place.",
        "One data layer for all your work.",
      ],
    },
    L2: {
      empty: {
        title: "Nothing here. Yet.",
        body: "Drop a file in. Put it to work.",
        action: "Add a file",
      },
      error: {
        title: "This file isn't yours to open.",
        body: "Finance owns it. One click asks for access.",
        action: "Ask for access",
      },
      launch:
        "Sheets is here.\nOne layer. Every cell. Every permission.\nYour agents can use it. They can't see past it.",
      taglines: [
        "Work runs on data.",
        "Data in. Work out.",
        "All of your work. One layer.",
      ],
    },
    L3: {
      empty: {
        title: "This folder is ready for its first file.",
        body: "Add a draft, a sheet or a contract. Your team, and the agents you trust, can find it the moment it lands.",
        action: "Add your first file",
      },
      error: {
        title: "You don't have access to this file yet.",
        body: "Dana in Finance looks after it. Ask her, and you'll hear back as soon as she answers.",
        action: "Ask Dana for access",
      },
      launch:
        "Meet Pluto Sheets. Your numbers now live beside your docs and mail, so the answer you need is one search away. Your agents can help too, and they never see more than you do.",
      taglines: [
        "Work runs on data. Let yours work for you.",
        "Find it faster. Finish what matters.",
        "Less looking. More doing.",
      ],
    },
    L4: {
      empty: {
        title: "/projects/q3 is empty.",
        body: "Write to it from the Docs app or with `pluto cp ./brief.md /projects/q3/`. Every write is versioned and checked by the kernel.",
        action: "Open the CLI reference",
      },
      error: {
        title: "403: you don't have access to this file.",
        body: "`/finance/forecast.xlsx` is readable by group `finance`. Agent tokens inherit their user's groups. Run `pluto access request` to ask the owner.",
        action: "Copy the command",
      },
      launch:
        "Pluto Sheets ships today. Every sheet is a file: `glob`, `grep` and `search` it like anything else in vfs. One kernel checks every read. Source is on GitHub.",
      taglines: [
        "Work runs on data. Data runs on one kernel.",
        "glob, grep, search. One kernel decides.",
        "Every file. One permission check.",
      ],
    },
  };
</script>

<Board question={q}>
  {#each q.options as option (option.id)}
    {@const l = look({ copy: COPY[option.id] })}
    <Option {option} bleed>
      {#snippet specimen()}
        <StageHero label="{option.id}: hero in this voice" compact look={l} />
        <div class="mx-auto mt-8 max-w-7xl px-6">
          <VoiceSample
            label="{option.id}: messages in this voice"
            voice={SAMPLES[option.id]}
            look={l}
          />
        </div>
      {/snippet}
    </Option>
  {/each}
</Board>
