# Pluto Systems design system

The tokens, styles and Svelte components of Pluto Systems applications, served as a [shadcn-svelte](https://shadcn-svelte.com) registry. An app installs a component and owns its source.

## What is here

- `tokens/pluto.tokens.json`: the one source of every colour and size, light and dark.
- `registry.json` and `src/lib/registry/`: the registry's items. Today 32, in five groups: foundation (`pluto-theme`, three font items, `utils`, `four-dot`), actions, surfaces, feedback and forms. Every colour and size in them comes from the token file.
- `src/routes/`: a preview app, one page per item, in both themes. It is not a website.
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
```

The first `add` brings the theme and the fonts with it. An item's dependencies, such as `field`'s `label` and `separator`, come from this registry too; nothing is fetched from shadcn-svelte's own.

The registry is not published yet. `wrangler.jsonc` is ready for an assets-only Cloudflare Worker; the owner runs the deploy.
