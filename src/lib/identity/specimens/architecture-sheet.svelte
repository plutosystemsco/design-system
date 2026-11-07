<script lang="ts">
  import { TODAY } from "../look.ts";
  import Ground from "./ground.svelte";
  import Mark from "./mark.svelte";

  // One architecture option, as names meet people: the app launcher, the
  // header line of an app, a browser tab and the footer line, plus the name
  // said in a sentence. Icons are placeholders (initials); question G
  // decides them.
  let { id }: { id: "A1" | "A2" | "A3" | "A4" } = $props();

  const p = TODAY;
  const brand: [string, string, string, string] = [
    p.blue,
    p.red,
    p.yellow,
    p.green,
  ];

  type App = {
    name: string;
    letter: string;
    colour: string;
    /** An own logo: the product's colour as a filled shape, not the family tile. */
    own?: "circle" | "square" | "diamond";
    mono?: boolean;
  };
  type Sheet = {
    launcherTitle: string;
    apps: App[];
    /** Products named outside the launcher's main group. */
    outside?: { label: string; apps: App[] };
    header: { brand: string; trail?: string; ownApp?: App; markLed: boolean };
    tabs: { title: string; app: App; dev?: boolean }[];
    url: string;
    footer: { line: string; endorse?: boolean };
    sentences: string[];
    note?: string;
  };

  const blue = p.blueText;
  const green = p.greenText;
  const red = p.redText;
  const yellow = p.yellowText;
  const ink = p.ink;

  const app = (
    name: string,
    letter: string,
    colour: string,
    extra: Partial<App> = {},
  ): App => ({
    name,
    letter,
    colour,
    ...extra,
  });

  const SHEETS: Record<string, Sheet> = {
    A1: {
      launcherTitle: "Pluto",
      apps: [
        app("Pluto Docs", "D", blue),
        app("Pluto Sheets", "S", green),
        app("Pluto Mail", "M", red),
        app("Pluto Search", "S", yellow),
        app("Pluto Agents", "A", blue),
        app("Pluto Kernel", "K", ink),
      ],
      outside: {
        label: "Platform",
        apps: [app("Pluto Data", "D", ink, { mono: true })],
      },
      header: { brand: "Pluto Docs", markLed: true },
      tabs: [
        { title: "Q3 plan · Pluto Docs", app: app("Pluto Docs", "D", blue) },
        {
          title: "Pluto Data · Reference",
          app: app("Pluto Data", "D", ink, { mono: true }),
          dev: true,
        },
      ],
      url: "docs.pluto.systems",
      footer: {
        line: "Pluto Docs · Pluto Data · Pluto Kernel · © Pluto Systems",
      },
      sentences: [
        "Write it in Pluto Docs; find it with Pluto Search.",
        "Pluto Data is open source. Pluto Kernel checks every read.",
      ],
    },
    A2: {
      launcherTitle: "Pluto Workspace",
      apps: [
        app("Docs", "D", blue),
        app("Sheets", "S", green),
        app("Mail", "M", red),
        app("Search", "S", yellow),
        app("Agents", "A", blue),
        app("Kernel", "K", ink),
      ],
      outside: {
        label: "Outside the suite",
        apps: [app("Pluto Data", "D", ink, { mono: true })],
      },
      header: { brand: "Pluto Workspace", trail: "Docs", markLed: true },
      tabs: [
        {
          title: "Q3 plan · Docs · Pluto Workspace",
          app: app("Docs", "D", blue),
        },
        {
          title: "Pluto Data · Reference",
          app: app("Pluto Data", "D", ink, { mono: true }),
          dev: true,
        },
      ],
      url: "workspace.pluto.systems/docs",
      footer: { line: "Docs is part of Pluto Workspace · © Pluto Systems" },
      sentences: [
        "Pluto Workspace comes with Docs, Sheets and Mail.",
        "Outside the suite: “Try Pluto Workspace Docs.”",
      ],
      note: "A2 does not name the platform; Pluto Data is assumed here.",
    },
    A3: {
      launcherTitle: "Your products",
      apps: [
        app("Inkwell", "I", p.blue, { own: "square" }),
        app("Abacus", "A", p.green, { own: "circle" }),
        app("Courier", "C", p.red, { own: "diamond" }),
        app("Lantern", "L", p.yellowText, { own: "circle" }),
        app("Ferry", "F", "#5A3FD0", { own: "square" }),
        app("Gatehouse", "G", ink, { own: "diamond" }),
      ],
      outside: {
        label: "Platform",
        apps: [app("Strata", "S", "#0E7490", { own: "square" })],
      },
      header: {
        brand: "Inkwell",
        ownApp: app("Inkwell", "I", p.blue, { own: "square" }),
        markLed: false,
      },
      tabs: [
        {
          title: "Q3 plan · Inkwell",
          app: app("Inkwell", "I", p.blue, { own: "square" }),
        },
        {
          title: "Strata · Reference",
          app: app("Strata", "S", "#0E7490", { own: "square" }),
          dev: true,
        },
      ],
      url: "inkwell.app",
      footer: { line: "A Pluto Systems product", endorse: true },
      sentences: [
        "Write it in Inkwell; find it with Lantern.",
        "Inkwell, a Pluto Systems product.",
      ],
      note: "Product names invented for this board (Docs → Inkwell, Sheets → Abacus, Mail → Courier, Search → Lantern, Agents → Ferry, Kernel → Gatehouse, platform → Strata). None is cleared.",
    },
    A4: {
      launcherTitle: "Pluto",
      apps: [
        app("Pluto Docs", "D", blue),
        app("Pluto Sheets", "S", green),
        app("Pluto Mail", "M", red),
        app("Pluto Search", "S", yellow),
        app("Pluto Agents", "A", blue),
        app("Pluto Kernel", "K", ink),
      ],
      outside: {
        label: "Open platform",
        apps: [app("vfs", "vfs", ink, { mono: true })],
      },
      header: { brand: "Pluto Docs", markLed: true },
      tabs: [
        { title: "Q3 plan · Pluto Docs", app: app("Pluto Docs", "D", blue) },
        {
          title: "vfs · the open data layer",
          app: app("vfs", "vfs", ink, { mono: true }),
          dev: true,
        },
      ],
      url: "docs.pluto.systems",
      footer: {
        line: "Pluto Docs runs on vfs, the open data layer · © Pluto Systems",
      },
      sentences: [
        "Write it in Pluto Docs; find it with Pluto Search.",
        "Developers build on vfs; Pluto Search runs on vfs.",
      ],
    },
  };

  const s = $derived(SHEETS[id]);
</script>

{#snippet icon(a: App, size: number)}
  {@const r =
    a.own === "circle"
      ? size / 2
      : a.own === "diamond"
        ? size * 0.18
        : size * 0.24}
  <span
    class="icon"
    class:own={a.own}
    class:mono={a.mono}
    class:diamond={a.own === "diamond"}
    style="--s:{size}px;--c:{a.colour};--r:{r}px;font-size:{a.letter.length > 1
      ? size * 0.3
      : size * 0.46}px"
    aria-hidden="true"><span>{a.letter}</span></span
  >
{/snippet}

<Ground caption="{id} · how the names read in use">
  <div class="sheet">
    <!-- The launcher -->
    <section class="launcher" aria-label="App launcher">
      <p class="label">launcher · initials stand in for icons</p>
      <div class="panel">
        <p class="panel-title">
          {#if s.header.markLed}<Mark
              colours={brand}
              style="font-size:20px"
            />{/if}
          {s.launcherTitle}
        </p>
        <ul class="apps">
          {#each s.apps as a (a.name)}
            <li>{@render icon(a, 44)}<span class="app-name">{a.name}</span></li>
          {/each}
        </ul>
        {#if s.outside}
          <p class="outside">{s.outside.label}</p>
          <ul class="apps">
            {#each s.outside.apps as a (a.name)}
              <li>
                {@render icon(a, 44)}<span
                  class="app-name"
                  class:code={a.name === "vfs"}>{a.name}</span
                >
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </section>

    <div class="lines">
      <!-- The header line -->
      <section aria-label="App header">
        <p class="label">app header</p>
        <div class="header">
          <svg class="apps-btn" viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M3 5.5h14M3 10h14M3 14.5h14"
              stroke={ink}
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
          {#if s.header.markLed}
            <span class="h-brand">
              <Mark colours={brand} style="font-size:26px" />
              <span>{s.header.brand}</span>
            </span>
            {#if s.header.trail}
              <span class="h-sep" aria-hidden="true">›</span>
              <span class="h-trail">{s.header.trail}</span>
            {/if}
          {:else if s.header.ownApp}
            <span class="h-brand">
              {@render icon(s.header.ownApp, 26)}
              <span>{s.header.brand}</span>
            </span>
          {/if}
          <span class="h-div" aria-hidden="true"></span>
          <span class="h-doc">Q3 plan</span>
          <span class="h-avatar" aria-hidden="true">CG</span>
        </div>
      </section>

      <!-- The browser tabs -->
      <section aria-label="Browser tabs">
        <p class="label">browser tab and title</p>
        <div class="browser">
          <div class="tabs">
            {#each s.tabs as t, i (t.title)}
              <span class="tab" class:active={i === 0}>
                {@render icon(t.app, 16)}
                <span class="tab-title">{t.title}</span>
              </span>
            {/each}
          </div>
          <div class="address"><span>{s.url}</span></div>
        </div>
      </section>

      <!-- The footer line -->
      <section aria-label="Footer">
        <p class="label">footer and endorsement</p>
        <div class="footer">
          {#if s.footer.endorse}
            <span class="endorse">
              <span>{s.footer.line}</span>
              <Mark colours={brand} style="font-size:18px" />
            </span>
            <span class="f-small">© Pluto Systems, PBC</span>
          {:else}
            <span class="f-line">{s.footer.line}</span>
          {/if}
        </div>
      </section>

      <section aria-label="In a sentence">
        <p class="label">said in a sentence</p>
        <div class="sentences">
          {#each s.sentences as line (line)}<p>{line}</p>{/each}
        </div>
      </section>
    </div>
  </div>
  {#if s.note}<p class="note">{s.note}</p>{/if}
</Ground>

<style>
  .sheet {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
    padding: 28px;
    font-family: "Geist Variable", system-ui, sans-serif;
  }
  @media (min-width: 900px) {
    .sheet {
      grid-template-columns: 340px minmax(0, 1fr);
      gap: 40px;
      padding: 36px;
    }
  }
  @media (max-width: 480px) {
    .sheet {
      padding: 20px 16px;
    }
  }
  .label {
    margin: 0 0 10px;
    font-family: "JetBrains Mono Variable", ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--g-muted);
  }
  .lines {
    display: flex;
    flex-direction: column;
    gap: 28px;
    min-width: 0;
  }

  /* launcher */
  .panel {
    background: #ffffff;
    border-radius: 16px;
    box-shadow:
      0 0 0 1px #14161c14,
      0 12px 32px -12px #14161c33;
    padding: 18px 16px 20px;
  }
  .panel-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 4px 16px;
    font-family: "IBM Plex Sans Variable", system-ui, sans-serif;
    font-weight: 600;
    font-size: 16px;
    letter-spacing: -0.01em;
  }
  .apps {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px 6px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .apps li {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-width: 0;
    text-align: center;
  }
  .app-name {
    font-size: 12.5px;
    line-height: 1.25;
    color: #14161c;
  }
  .app-name.code {
    font-family: "JetBrains Mono Variable", ui-monospace, monospace;
  }
  .outside {
    margin: 18px 4px 12px;
    padding-top: 14px;
    border-top: 1px solid #14161c14;
    font-family: "JetBrains Mono Variable", ui-monospace, monospace;
    font-size: 10.5px;
    letter-spacing: 0.08em;
    text-transform: lowercase;
    color: #4a4f5c;
  }

  /* icon placeholder */
  .icon {
    display: grid;
    place-items: center;
    flex: none;
    width: var(--s);
    height: var(--s);
    border-radius: var(--r);
    background: #ffffff;
    box-shadow: inset 0 0 0 1px #14161c24;
    color: var(--c);
    font-family: "IBM Plex Sans Variable", system-ui, sans-serif;
    font-weight: 700;
    line-height: 1;
  }
  .icon.mono {
    background: #14161c;
    box-shadow: none;
    color: #f7f7f4;
    font-family: "JetBrains Mono Variable", ui-monospace, monospace;
    font-weight: 600;
  }
  .icon.own {
    background: var(--c);
    box-shadow: none;
    color: #ffffff;
  }
  .icon.diamond {
    transform: rotate(45deg) scale(0.8);
  }
  .icon.diamond > span {
    transform: rotate(-45deg) scale(1.25);
  }

  /* header */
  .header {
    display: flex;
    align-items: center;
    gap: 14px;
    height: 60px;
    padding: 0 16px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: inset 0 0 0 1px #14161c1f;
    min-width: 0;
    overflow: hidden;
  }
  .apps-btn {
    width: 20px;
    height: 20px;
    flex: none;
  }
  .h-brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex: none;
    font-family: "IBM Plex Sans Variable", system-ui, sans-serif;
    font-weight: 600;
    font-size: 18px;
    letter-spacing: -0.015em;
  }
  .h-sep {
    color: #4a4f5c;
    font-size: 18px;
  }
  .h-trail {
    flex: none;
    font-family: "IBM Plex Sans Variable", system-ui, sans-serif;
    font-size: 18px;
    font-weight: 500;
  }
  .h-div {
    width: 1px;
    height: 24px;
    background: #14161c24;
    flex: none;
  }
  .h-doc {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 15px;
    color: #4a4f5c;
  }
  .h-avatar {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    flex: none;
    border-radius: 50%;
    background: #e3e5e0;
    font-size: 11px;
    font-weight: 600;
    color: #14161c;
  }
  @media (max-width: 560px) {
    .h-div,
    .h-doc,
    .apps-btn {
      display: none;
    }
    .header {
      justify-content: space-between;
    }
  }

  /* browser */
  .browser {
    border-radius: 10px;
    overflow: hidden;
    background: #e3e5e0;
    box-shadow: inset 0 0 0 1px #14161c1f;
    font-family: system-ui, sans-serif;
    font-size: 12.5px;
    color: #14161c;
  }
  .tabs {
    display: flex;
    gap: 2px;
    padding: 8px 8px 0;
  }
  .tab {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 0 1 260px;
    height: 34px;
    padding: 0 12px;
    border-radius: 8px 8px 0 0;
    color: #4a4f5c;
  }
  .tab.active {
    background: #ffffff;
    color: #14161c;
  }
  .tab-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .address {
    background: #ffffff;
    padding: 8px;
  }
  .address span {
    display: block;
    padding: 7px 14px;
    border-radius: 999px;
    background: #f1f2ef;
    color: #4a4f5c;
  }

  /* footer */
  .footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px 24px;
    padding: 16px 0 0;
    border-top: 1px solid #14161c24;
    font-size: 13.5px;
    color: #4a4f5c;
  }
  .endorse {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: #14161c;
    font-weight: 500;
  }
  .f-small {
    font-size: 12.5px;
  }

  /* sentences */
  .sentences {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .sentences p {
    margin: 0;
    font-family: "IBM Plex Sans Variable", system-ui, sans-serif;
    font-size: 20px;
    line-height: 1.35;
    letter-spacing: -0.015em;
    color: #14161c;
  }
  .note {
    margin: 0;
    padding: 14px 28px 18px;
    border-top: 1px solid var(--g-line);
    font-size: 13px;
    line-height: 1.5;
    color: var(--g-muted);
  }
</style>
