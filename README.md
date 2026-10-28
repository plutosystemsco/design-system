# Pluto Systems design system

The tokens, styles and Svelte components of Pluto Systems applications, served as a [shadcn-svelte](https://shadcn-svelte.com) registry. An app installs a component and owns its source.

## What is here

- `tokens/pluto.tokens.json`: the one source of every colour and size, light and dark.
- `registry.json` and `src/lib/registry/`: the registry's items. Today 39, in six groups: foundation (`pluto-theme`, three font items, `utils`, `four-dot`), actions, surfaces, feedback, forms, and blocks. A block is a whole page or section (sign in, sign up, a hero, page states, a settings form) that installs as a route plus its components. Every colour and size in them comes from the token file.
- `src/routes/`: a preview app, one page per item, in both themes. A block's page embeds it live at phone, tablet and desktop widths; the chrome-less `/view/<block>/` routes are what the frame shows. It is not a website.
- `context/`: the research, specifications, reviews and decisions this code is built from. Read [`context/README.md`](context/README.md) first.

## Running it

Everything runs under [Bun](https://bun.sh) 1.3.14.

```
bun install --frozen-lockfile
bunx --bun playwright install chromium   # once, for the browser tests
bun run dev        # builds the tokens and the registry, then serves both at http://localhost:5173
bun run test       # unit, browser and smoke tests
bun run check      # svelte-check
bun run lint       # prettier
```

With `bun run dev` running, an app installs an item from this machine:

```
REGISTRY_URL=http://localhost:5173/r bunx --bun shadcn-svelte@1.7.1 add four-dot -y -o
REGISTRY_URL=http://localhost:5173/r bunx --bun shadcn-svelte@1.7.1 add button field alert-dialog -y
REGISTRY_URL=http://localhost:5173/r bunx --bun shadcn-svelte@1.7.1 add sign-in -y
```

The first `add` brings the theme and the fonts with it. An item's dependencies, such as `field`'s `label` and `separator`, come from this registry too; nothing is fetched from shadcn-svelte's own. Leave out `-o` after the first install: without it the CLI lists the files that already exist and asks before it overwrites any, which matters for a block, since it lands a route and up to a dozen primitives you may have changed.

The registry is not published yet. `wrangler.jsonc` is ready for an assets-only Cloudflare Worker; the owner runs the deploy.
