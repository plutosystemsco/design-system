# The component inventory: what Kuiper has, what the references have, and what to add next

- **Status:** complete
- **Date:** 2026-11-15
- **Author:** a researcher, at the design lead's request
- **Question:** Which components should Kuiper add, and in what order, to approach the breadth of the reference systems?
- **What it blocks:** nothing. It proposes an order. Each specification it leads to still names the application that needs it (constitution §4.2).

## How to read this memo

- **READ:** a file or page says so. Clone paths are under `context/prior_art/`, at the commits in its `README.md`, read on 2026-11-15. Web pages were read on 2026-11-15.
- **EXECUTED:** we ran a read-only command, such as `ls`, a Python count over `registry.json`, or `curl` of a sitemap, and saw the result.
- **INFERRED:** our reasoning. Every score and batch is INFERRED.

Two terms. A **reference** is one of the seven systems studied: Carbon, Material 3, Spectrum 2, Atlassian, Primer, Radix Themes and GOV.UK. A **base** is a headless primitive in bits-ui, or a stock item in shadcn-svelte, that a Kuiper item can restyle instead of writing behaviour from nothing.

Polaris's licence lets its rights serve only Shopify apps (`prior_art/README.md`). So Polaris appears below by component name only. It is shown in the matrix and not counted in any score.

## Summary

- **Kuiper has 75 registry items. About 45 are general-purpose components.** The rest are the theme, fonts, libraries, hooks, brand compositions and blocks (EXECUTED).
- **Kuiper already covers the references' core.** Button, inputs, checkbox, radio, switch, tabs, dialog, sheet, popover, tooltip, menu, alert, badge, avatar, card, table, spinner and skeleton are in at least four references each, and Kuiper has them all (EXECUTED, the matrix).
- **The gaps are in four areas.** Choosing from lists (custom select, combobox, multi-select). Data pages (data table, pagination, page header, toolbar). Dates and time. Small feedback pieces (progress bar, banner, count badge, removable tag) (INFERRED).
- **bits-ui is under-used.** Kuiper imports 17 of its primitives. Twenty-three more ship unused, among them Select, Combobox, Slider, Progress, Pagination, Calendar, DatePicker, TimeField, Toolbar, ContextMenu, Command and Menubar (EXECUTED). Each makes its Kuiper item cheaper.
- **Three batches first.** A: cheap and everywhere. B: choosing from lists. C: data pages. Two more follow: D, dates and time; E, workspace and developer tools, which wait for a stated need.
- **The toast stays a question.** Four references serve one. Kuiper declined it in `005` decision 14, for reasons that still hold. A question for the owner is at the end.

## 1. What Kuiper has

EXECUTED: a Python count over `registry.json` gives 75 items. Grouped by `meta.group`, in `src/lib/site/sitemap.ts`'s `GROUPS` order:

| Group | Count | Items |
|---|---|---|
| Foundation | 9 | pluto-theme, font-geist, font-heading-ibm-plex-sans, font-jetbrains-mono, utils, four-dot, theme, read-token, liquid-glass |
| Actions | 5 | button, tooltip, kbd, toggle, toggle-group |
| Surfaces | 9 | card, separator, item, table, tabs, collapsible, avatar, popover, accordion |
| Feedback | 8 | alert, alert-dialog, badge, empty, skeleton, spinner, status, error-summary |
| Forms | 10 | label, field, input, textarea, input-group, native-select, checkbox, radio-group, switch, input-otp |
| Code | 5 | code-block, code-editor, highlighter, use-highlighted-code, code-languages |
| Data | 2 | chart, meter |
| Navigation | 6 | dropdown-menu, sheet, dialog, breadcrumb, sidebar, is-mobile |
| Chat | 4 | message-log, message, marker, composer |
| Compositions | 9 | stage, stage-card, marketing-bar, stage-hero, proof-band, live-console, name-strip, cta-band, marketing-footer |
| Blocks | 8 | hero, sign-in, sign-up, page-states, settings, app-shell, chat, product-home |

Three things Kuiper chose not to serve, by recorded decision:

- **`sonner` and every toast** (READ, `specifications/005-…md` decision 14). Its 4 s timer, a tab stop per toast and a 20 px close button are what the accessibility sources warn against.
- **`scroll-area`** (READ, `specifications/004-code-and-data.md` decision 1). Its hover-only 10 px scrollbar fails the 24 px target rule. The pattern is a native `overflow-auto` box.
- **The sidebar's rail, its floating and inset variants, and a right-hand sidebar** (READ, `005` decisions 5 and 10).

Some parts live inside a block, not as items. The skip link, header, nav and user menu are `src/lib/registry/components/app-shell-*.svelte` (EXECUTED, `ls`). The copy button is `code-block-copy-button.svelte` (EXECUTED).

## 2. The catalogues

Each source, and where its list comes from.

- **Carbon** (READ, `carbon-design-system-carbon/packages/react/src/components/`, 147 entries; `carbon-design-system-carbon-website/src/pages/components/`, 44 entries). The website is the public catalogue. Its Notification page names four kinds: toast, inline, actionable and callout (READ, `components/notification/usage.mdx:18`).
- **Material 3** (EXECUTED, `curl https://m3.material.io/sitemap.xml`, 37 component paths). The web library covers 21 of them (READ, `material-components-material-web/docs/components/`). The guidance is the catalogue; the library lags it.
- **Spectrum 2** (READ, `adobe-spectrum-design-data/packages/design-data/components/`, 97 files, each with a `description`). Some are platform-only, such as `tab-bar-ios`. TableView sorts and selects rows (READ, https://react-spectrum.adobe.com/TableView: "Set the `allowsSorting` prop on a Column").
- **Atlassian** (READ, https://atlassian.design/components). No clone. Its catalogue mixes components with primitives (Box, Stack, XCSS) and tools (ESLint plugin).
- **Primer** (READ, `primer-design/content/components/`, 87 entries). Its saving pattern says "avoid using a toast for now" (READ, `content/ui-patterns/saving.mdx:305`). Dialog covers side sheets (READ, `components/dialog.mdx:309-313`).
- **Radix Themes** (READ, `radix-ui-themes/packages/radix-ui-themes/src/components/`, 54 component files after removing props, primitives and internals).
- **GOV.UK** (READ, `alphagov-govuk-frontend/packages/govuk-frontend/src/govuk/components/`, 39 folders). Its 35 patterns, such as "dates" and "complete multiple tasks", live in `alphagov-govuk-design-system/src/patterns/`.
- **Polaris, names only** (READ, `shopify-polaris/polaris-react/src/components/` folder names).
- **shadcn-svelte** (READ, `shadcn-svelte/docs/content/components/`, 66 pages, at `6149e14`). It adds chat pieces Kuiper does not have: `attachment`, `trace` ("reasoning, tool calls, sources") and `questionnaire`. Its combobox is "a composition of the `<Popover />` and the `<Command />` components" (READ, `combobox.md:20`). Its data table is built on TanStack Table (READ, `data-table.md:41`).
- **bits-ui** (READ, `huntabyte-bits-ui/docs/content/components/`, 41 pages, at 2.21.0). Its date components need `@internationalized/date` as a peer dependency (READ, `packages/bits-ui/package.json`).

**What Kuiper already takes from bits-ui** (EXECUTED, a `grep` of `from "bits-ui"` imports under `src/lib/registry/`): Accordion, AlertDialog, Avatar, Checkbox, Collapsible, Dialog, DropdownMenu, Label, PinInput, Popover, RadioGroup, Separator, Switch, Tabs, Toggle, ToggleGroup, Tooltip. That is 17.

**Unused bits-ui primitives** (EXECUTED, the difference): AspectRatio, Calendar, Combobox, Command, ContextMenu, DateField, DatePicker, DateRangeField, DateRangePicker, LinkPreview, Menubar, Meter, NavigationMenu, Pagination, Progress, RangeCalendar, RatingGroup, ScrollArea, Select, Slider, TimeField, TimeRangeField, Toolbar.

## 3. The matrix

Names are normalised. Several systems use different words for one thing:

- **Combobox** = autocomplete (Primer, Polaris) = searchable Select (Atlassian).
- **Custom select** = Dropdown (Carbon) = Picker (Spectrum) = Select (Material, Radix). A **native select** is the browser's `<select>`.
- **Toast** = snackbar (Material) = flag (Atlassian) = toast notification (Carbon).
- **Hover card** = link preview (bits-ui).
- **Toggletip** (Carbon) = contextual help (Spectrum) = rich tooltip (Material). A popover opened by a click on an info button.
- **Tag / chip** = token (Primer) = chip (Material). Removable or selectable. A **badge** is a static label: Lozenge (Atlassian), Label (Primer), Tag (GOV.UK).
- **Segmented control** = content switcher (Carbon) = segmented buttons (Material).
- **Description list** = summary list (GOV.UK) = data list (Radix) = structured list (Carbon, partly).
- **Stepper** = progress indicator (Carbon) = step list (Spectrum) = progress tracker (Atlassian).
- **Banner** = notification banner (GOV.UK) = alert banner (Spectrum). Page-level, above the content.
- **Empty state** = blankslate (Primer) = illustrated message (Spectrum).

Key: **Y** present. **~** partial, or part of another item. **D** declined by a recorded decision. **·** absent. **n** counts Y across the seven references. Cb Carbon, M3 Material 3, S2 Spectrum 2, At Atlassian, Pr Primer, Rx Radix Themes, UK GOV.UK, Po Polaris (names only), sv shadcn-svelte, bits bits-ui.

| Component | Kuiper | Cb | M3 | S2 | At | Pr | Rx | UK | n | Po | sv | bits |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Actions** | | | | | | | | | | | | |
| Button | Y | Y | Y | Y | Y | Y | Y | Y | 7 | Y | Y | Y |
| Icon button | ~ size | Y | Y | Y | ~ | Y | Y | · | 5 | · | ~ | · |
| Button group | · | Y | Y | Y | · | Y | · | · | 4 | Y | Y | · |
| Split button | · | Y | Y | · | · | · | · | · | 2 | · | · | · |
| Segmented control | ~ toggle-group | Y | Y | Y | · | Y | Y | · | 5 | · | ~ | Y |
| Toolbar / action bar | · | ~ | Y | Y | · | Y | · | · | 3 | Y | · | Y |
| Link | ~ button variant | Y | · | Y | Y | Y | Y | · | 5 | Y | · | · |
| Copy button | ~ in code-block | Y | · | · | · | Y | · | · | 2 | · | · | · |
| Floating action button | · | · | Y | Y | · | · | · | · | 2 | · | · | · |
| Kbd | Y | · | · | · | · | · | Y | · | 1 | Y | Y | · |
| **Forms** | | | | | | | | | | | | |
| Text input | Y | Y | Y | Y | Y | Y | Y | Y | 7 | Y | Y | · |
| Textarea | Y | Y | Y | Y | Y | Y | Y | Y | 7 | Y | Y | · |
| Field (label, hint, error) | Y | Y | · | Y | Y | Y | · | Y | 5 | Y | Y | Y |
| Error summary | Y | · | · | · | · | · | · | Y | 1 | · | · | · |
| Checkbox | Y | Y | Y | Y | Y | Y | Y | Y | 7 | Y | Y | Y |
| Radio group | Y | Y | Y | Y | Y | Y | Y | Y | 7 | Y | Y | Y |
| Switch | Y | Y | Y | Y | Y | Y | Y | · | 6 | · | Y | Y |
| Native select | Y | Y | · | · | · | Y | · | Y | 3 | Y | Y | · |
| Custom select | · | Y | Y | Y | Y | ~ | Y | · | 5 | · | Y | Y |
| Combobox | · | Y | · | Y | Y | Y | · | · | 4 | Y | Y | Y |
| Multi-select / tag input | · | Y | Y | Y | Y | Y | · | · | 5 | ~ | · | Y |
| Search field | ~ input-group | Y | Y | Y | · | · | · | · | 3 | · | · | · |
| Number field | · | Y | · | Y | · | · | · | · | 2 | · | · | · |
| Password input | Y | Y | · | · | · | · | · | Y | 2 | · | · | · |
| One-time code | Y | · | · | Y | · | · | · | · | 1 | · | Y | Y |
| Slider | · | Y | Y | Y | Y | · | Y | · | 5 | Y | Y | Y |
| Date picker / calendar | · | Y | Y | Y | Y | · | · | ~ | 4 | Y | Y | Y |
| Date field (typed) | · | ~ | · | Y | · | · | · | Y | 2 | · | · | Y |
| Time picker / field | · | Y | Y | Y | Y | · | · | · | 4 | · | · | Y |
| File upload / drop zone | · | Y | · | Y | · | · | · | Y | 3 | Y | ~ | · |
| Choice cards | · | Y | · | Y | · | · | Y | · | 3 | ~ | · | · |
| Character count | · | ~ | ~ | · | · | · | · | Y | 1 | · | · | · |
| Rating | · | · | · | Y | · | · | · | · | 1 | · | · | Y |
| Colour picker | · | · | · | Y | · | · | · | · | 1 | Y | · | · |
| **Data display** | | | | | | | | | | | | |
| Table (static) | Y | Y | · | Y | Y | Y | Y | Y | 6 | Y | Y | · |
| Data table (sort, select) | · | Y | · | Y | Y | Y | · | · | 4 | Y | Y | · |
| Pagination | · | Y | · | · | Y | Y | · | Y | 4 | Y | Y | Y |
| List view (selectable rows) | ~ item | Y | Y | Y | · | Y | · | · | 4 | Y | · | · |
| Description list | · | ~ | · | · | · | · | Y | Y | 2 | Y | · | · |
| Tree view | · | Y | · | Y | ~ | Y | · | · | 3 | · | · | · |
| Badge (static label) | Y | Y | Y | Y | Y | Y | Y | Y | 7 | Y | Y | · |
| Tag / chip | · | Y | Y | Y | Y | Y | · | · | 5 | Y | · | · |
| Count badge / dot | ~ sidebar | Y | Y | Y | Y | Y | · | · | 5 | ~ | · | · |
| Status light | ~ badge | ~ | · | Y | Y | Y | · | · | 3 | · | · | · |
| Avatar, avatar group | Y | Y | · | Y | Y | Y | Y | · | 5 | Y | Y | Y |
| Progress bar | · | Y | Y | Y | Y | Y | Y | · | 6 | Y | Y | Y |
| Meter | Y | · | · | Y | · | · | · | · | 1 | · | · | Y |
| Stepper | · | Y | · | Y | Y | · | · | ~ | 3 | · | · | · |
| Relative time | · | · | · | · | Y | Y | · | · | 2 | · | · | · |
| Chart | Y | · | · | · | · | · | · | · | 0 | · | Y | · |
| Code block | Y | Y | · | · | Y | · | ~ | · | 2 | ~ | Y | · |
| **Navigation** | | | | | | | | | | | | |
| Tabs | Y | Y | Y | Y | Y | Y | Y | Y | 7 | Y | Y | Y |
| Tab nav (links) | · | · | ~ | · | · | Y | Y | ~ | 2 | · | · | · |
| Breadcrumb | Y | Y | · | Y | Y | Y | · | Y | 5 | Y | Y | · |
| Side navigation | Y sidebar | Y | Y | Y | Y | Y | · | · | 5 | Y | Y | · |
| Header / top navigation | ~ in app-shell | Y | Y | · | Y | Y | · | Y | 5 | Y | ~ | Y |
| Page header | · | Y | ~ | · | Y | Y | · | · | 3 | Y | · | · |
| Menubar | · | · | · | · | · | · | · | · | 0 | · | Y | Y |
| Skip link | ~ in app-shell | ~ | · | · | · | · | · | Y | 1 | · | · | · |
| Back link | · | · | · | · | · | · | · | Y | 1 | · | · | · |
| **Overlays** | | | | | | | | | | | | |
| Dialog | Y | Y | Y | Y | Y | Y | Y | · | 6 | Y | Y | Y |
| Alert dialog | Y | Y | ~ | Y | ~ | Y | Y | · | 4 | · | Y | Y |
| Sheet / drawer | Y | Y | Y | Y | Y | Y | · | · | 5 | Y | Y | Y |
| Popover | Y | Y | · | Y | Y | Y | Y | · | 5 | Y | Y | Y |
| Tooltip | Y | Y | Y | Y | Y | Y | Y | · | 6 | Y | Y | Y |
| Toggletip | · | Y | Y | Y | ~ | · | · | · | 3 | · | · | · |
| Dropdown menu | Y | Y | Y | Y | Y | Y | Y | · | 6 | Y | Y | Y |
| Context menu | · | Y | · | · | · | · | Y | · | 2 | · | Y | Y |
| Hover card | · | · | · | · | · | · | Y | · | 1 | · | Y | Y |
| Command palette | · | · | · | · | · | · | · | · | 0 | · | Y | Y |
| Coachmark / spotlight | · | Y | · | Y | Y | · | · | · | 3 | · | · | · |
| **Feedback** | | | | | | | | | | | | |
| Alert (inline message) | Y | Y | · | Y | Y | Y | Y | Y | 6 | Y | Y | · |
| Banner (page-level) | ~ alert | ~ | · | Y | Y | Y | · | Y | 4 | Y | · | · |
| Toast | D | Y | Y | Y | Y | · | · | · | 4 | Y | Y | · |
| Spinner | Y | Y | Y | Y | Y | Y | Y | · | 6 | Y | Y | · |
| Skeleton | Y | Y | · | · | Y | Y | Y | · | 4 | Y | Y | · |
| Empty state | Y | ~ | · | Y | Y | Y | · | · | 3 | Y | Y | · |
| Confirmation panel | · | · | · | · | · | · | · | Y | 1 | · | · | · |
| **Surfaces** | | | | | | | | | | | | |
| Card | Y | Y | Y | Y | · | Y | Y | · | 5 | Y | Y | · |
| Accordion | Y | Y | · | Y | · | · | · | Y | 3 | · | Y | Y |
| Collapsible / details | Y | Y | · | · | · | Y | · | Y | 3 | Y | Y | Y |
| Separator / divider | Y | · | Y | Y | · | · | Y | · | 3 | Y | Y | Y |
| Aspect ratio | · | Y | · | · | · | · | Y | · | 2 | · | Y | Y |
| Scroll area | D | · | · | · | · | · | Y | · | 1 | Y | Y | Y |
| Carousel | · | · | Y | · | · | · | · | · | 1 | · | Y | · |
| Resizable panes | · | · | · | ~ | · | · | · | · | 0 | · | Y | · |
| Layout primitives | ~ Tailwind | Y | · | · | Y | Y | Y | · | 4 | Y | · | · |
| **Chat** | | | | | | | | | | | | |
| Message, log, composer | Y | · | · | · | · | · | · | · | 0 | · | Y | · |
| Attachment | · | · | · | · | · | · | · | · | 0 | · | Y | · |
| Trace (reasoning, tool calls) | · | · | · | · | · | · | · | · | 0 | · | Y | · |

The matrix's own limits (INFERRED). "Present" means a named component in the catalogue. A feature inside another component, such as Carbon's text-input counter, is marked ~. GOV.UK serves forms for the public, so its row count is low for menus and overlays by design. Material 3's web library lags its guidance; the guidance is counted.

## 4. The ranked list

### 4.1 The score

Each missing component gets five numbers (all INFERRED, from the matrix and the products):

- **Refs, 0 to 7:** the matrix's n.
- **Need, 0 to 3:** how often a product app needs it. The products are a workspace suite (Pluto Docs, Pluto Sheets), developer tools (`vfs`) and chat (READ, `decisions.md`, "A4, open platform, branded suite", 2026-11-06). Forms, data pages, navigation and feedback weigh most.
- **Base, 0 to 2:** 2 if a bits-ui primitive does the behaviour. 1 if shadcn-svelte composes it from parts Kuiper has. 0 if nothing does.
- **Risk, 0 to 2, subtracted:** accessibility risk. Listbox focus, date grids, trees and drag are 2. Plain markup is 0.
- **Cost, 0 to 2, subtracted:** files, a new dependency, or a new token.

**Score = refs + need + base − risk − cost.** The score sorts. It does not decide; dependencies and stated need do.

### 4.2 The list

| # | Component | Refs | Need | Base | Risk | Cost | Score | Note |
|---|---|---|---|---|---|---|---|---|
| 1 | Progress bar | 6 | 2 | 2 | 0 | 0 | 10 | bits Progress. `role="progressbar"`, unlike `meter`. |
| 2 | Pagination | 4 | 3 | 2 | 0 | 0 | 9 | bits Pagination; sv stock item. |
| 3 | Custom select | 5 | 3 | 2 | 1 | 1 | 8 | bits Select. Kuiper's forms have only `native-select`. |
| 4 | Search field | 3 | 3 | 1 | 0 | 0 | 7 | `input-group` with a search role and a clear button. |
| 5 | Button group | 4 | 2 | 1 | 0 | 0 | 7 | sv `button-group`. |
| 6 | Count badge, dot | 5 | 2 | 0 | 0 | 0 | 7 | Variants of `badge`; the sidebar already has a menu badge. |
| 7 | Slider | 5 | 2 | 2 | 1 | 1 | 7 | bits Slider; a two-thumb range needs care. |
| 8 | Tag / chip | 5 | 2 | 0 | 1 | 0 | 6 | A badge with a remove button, or a pressed toggle. |
| 9 | Link | 5 | 1 | 0 | 0 | 0 | 6 | An inline link today is per-item classes or a button variant. |
| 10 | Banner | 4 | 2 | 0 | 0 | 0 | 6 | `alert` at page level: full width, dismissible, `info` tone. |
| 11 | Combobox | 4 | 3 | 2 | 2 | 1 | 6 | bits Combobox, an input with a listbox. sv's is a button over Command. |
| 12 | Page header | 3 | 3 | 0 | 0 | 0 | 6 | Title, breadcrumb, actions, tabs. Plain markup. |
| 13 | Toggletip | 3 | 2 | 2 | 1 | 0 | 6 | `popover` on an info button. Tooltips do not reach touch. |
| 14 | Choice cards | 3 | 1 | 2 | 0 | 0 | 6 | `radio-group` and `checkbox` as cards. |
| 15 | Toolbar / action bar | 3 | 2 | 2 | 1 | 1 | 5 | bits Toolbar, roving focus. Bulk actions on a table. |
| 16 | Context menu | 2 | 2 | 2 | 1 | 0 | 5 | bits ContextMenu; shares `dropdown-menu`'s styles. |
| 17 | Multi-select | 5 | 2 | 2 | 2 | 2 | 5 | bits Select or Combobox, `type="multiple"`, with tags. |
| 18 | Time field | 4 | 1 | 2 | 1 | 1 | 5 | bits TimeField. Needs `@internationalized/date`. |
| 19 | Data table | 4 | 3 | 1 | 2 | 2 | 4 | sv `data-table` on TanStack Table, a new dependency. |
| 20 | Date picker, calendar | 4 | 2 | 2 | 2 | 2 | 4 | bits Calendar, DatePicker, DateField. A grid of days. |
| 21 | Tab nav | 2 | 2 | 0 | 0 | 0 | 4 | Links styled as tabs, with `aria-current`, not a tablist. |
| 22 | Description list | 2 | 2 | 0 | 0 | 0 | 4 | `dl` markup. Settings and detail pages. |
| 23 | Copy button | 2 | 2 | 0 | 0 | 0 | 4 | Lifted out of `code-block`. |
| 24 | Relative time | 2 | 2 | 0 | 0 | 0 | 4 | `<time>` with `Intl.RelativeTimeFormat`. |
| 25 | Command palette | 0 | 3 | 2 | 1 | 1 | 3 | bits Command. No reference serves it; dev tools and Docs need it. |
| 26 | File upload | 3 | 2 | 0 | 1 | 1 | 3 | A native file input with a drop target. Chat attachments. |
| 27 | Stepper | 3 | 1 | 0 | 1 | 1 | 2 | An ordered list with step states. |
| 28 | Menubar | 0 | 2 | 2 | 1 | 1 | 2 | bits Menubar. Docs and Sheets. |
| 29 | Chat attachment, trace | 0 | 3 | 1 | 1 | 1 | 2 | sv stock items. Only chat needs them. |
| 30 | Hover card | 1 | 1 | 2 | 2 | 0 | 2 | Hover-only content fails touch and keyboard. |
| 31 | Tree view | 3 | 2 | 0 | 2 | 2 | 1 | No base. `vfs` file trees would need it. |
| 32 | Resizable panes | 0 | 2 | 1 | 1 | 1 | 1 | sv `resizable`, a new dependency. Editor beside preview. |
| 33 | Number field | 2 | 1 | 0 | 1 | 1 | 1 | |
| 34 | Coachmark | 3 | 0 | 1 | 2 | 1 | 1 | |

**Not recommended now** (INFERRED):

- **Aspect ratio.** Tailwind's `aspect-*` utilities already do it.
- **Carousel, rating, colour picker, floating action button, split button.** One or two references each, and no named product need.
- **Layout primitives.** Tailwind is Kuiper's layout layer.
- **Scroll area and toast.** Declined by decision. The toast is a question below.

### 4.3 The batches

Each batch is sized for one specification and one builder, at 5 to 8 items. The order follows the score, then dependencies.

**Batch A: cheap and everywhere.** All restyles or plain markup. No new dependency.

1. **Progress bar.** Six references; every upload and long job needs one.
2. **Pagination.** Four references; the data table in batch C needs it.
3. **Search field.** Every list page filters; it reuses `input-group`.
4. **Button group.** Four references; toolbars and split actions sit on it.
5. **Count badge and dot.** Five references; the sidebar's menu badge becomes a general part.
6. **Tag.** Five references; filters and multi-select in batch B reuse it.
7. **Link.** Five references; one inline link, with external and visited states, replaces per-item classes.
8. **Banner.** Four references; a page-level notice with an `info` tone, short of a toast.

**Batch B: choosing from lists.** Listbox behaviour from bits-ui, held to one keyboard contract.

1. **Custom select.** Five references; options with icons and descriptions that a native select cannot show.
2. **Combobox.** Four references; long lists need typing to filter. Prefer bits Combobox, a real input.
3. **Multi-select.** Five references; built last in the batch, from the combobox and batch A's tag.
4. **Slider.** Five references; settings and filters.
5. **Choice cards.** Three references; plan pickers and onboarding, a restyle of `radio-group`.
6. **Toggletip.** Three references; help that works on touch, where a tooltip does not.
7. **Context menu.** Two references; Docs and Sheets need right-click, and it reuses `dropdown-menu`.

**Batch C: data pages.** Needs batch A's pagination and the `checkbox` that exists.

1. **Data table.** Four references; sort, row selection and empty or loading rows. Names TanStack Table as a dependency.
2. **Toolbar and action bar.** Three references; bulk actions for selected rows.
3. **Page header.** Three references; every product page has a title, actions and a breadcrumb.
4. **Description list.** Two references, plus Polaris; detail and settings pages.
5. **Tab nav.** Two references; section links that look like tabs but are links.
6. **Copy button.** Two references; IDs and keys in tables, lifted from `code-block`.
7. **Relative time.** Two references; "updated 3 minutes ago" in rows.

**Batch D: dates and time.** One new peer dependency, `@internationalized/date`. The riskiest grid in the system.

1. **Calendar.** The day grid every date part shares.
2. **Date picker.** Four references; a typed field with a calendar popover.
3. **Date range picker.** Reports and filters in Sheets.
4. **Date field.** Two references; GOV.UK's typed entry is the accessible default.
5. **Time field.** Four references; scheduling.

**Batch E: workspace and developer tools.** Few references. Each waits for an app to say it needs it (§4.2).

1. **Command palette.** No reference; developer tools expect one.
2. **Tree view.** Three references; `vfs` file trees. No base, so it costs the most.
3. **Menubar.** No reference; Docs and Sheets.
4. **Resizable panes.** An editor beside its preview.
5. **File upload.** Three references; chat attachments.
6. **Chat attachment and trace.** shadcn-svelte's newest chat parts.
7. **Stepper.** Three references; multi-step setup.

## 5. Kuiper items thinner than the references

INFERRED from the matrix and the files read. Each is a candidate for an amendment, not a new item.

- **`table` is markup, not a data grid** (READ, `src/lib/registry/ui/table/`: nine parts, no sort, no selection). Carbon's DataTable has sorting, batch actions, expansion and selection. Spectrum's TableView sorts and selects. Batch C answers this.
- **`native-select` is the only select.** Five references serve a custom one. Batch B answers this.
- **`badge` has one axis: tone** (READ, `badge/badge.svelte:10-20`: default, destructive, success, caution). The references add count, dot, removable and selectable forms. Batch A answers this.
- **`alert` has no `info` tone and no page-level form** (READ, `alert/alert.svelte:5-20`: default, destructive, success, caution). Carbon has four notification kinds; Spectrum splits in-line alert from alert banner. Batch A's banner answers this.
- **`meter` is not a progress bar.** `meter` is a gauge of a known range. Task progress is `role="progressbar"`. Six references have the second. Batch A answers this.
- **`tooltip` has no click-opened partner.** Hover tooltips do not reach touch. Carbon, Spectrum and Material each pair the tooltip with a toggletip. Batch B answers this.
- **`tabs` are a tablist only.** There is no link-based tab nav, and no overflow when tabs outgrow the row. Primer's UnderlineNav moves overflow into a menu. Batch C covers the links; overflow is a `tabs` amendment.
- **`item` displays; it does not select.** Spectrum's ListView and Primer's ActionList hold a selection model. A list view is a later amendment.
- **`card` is not interactive.** Carbon's Tile is clickable, selectable and expandable; Radix has checkbox and radio cards. Batch B's choice cards cover selection.
- **`input` and `field` have no counter.** GOV.UK serves a character count; Carbon and Material put a counter in the text field. A `field` amendment.
- **`toggle-group` stands in for a segmented control.** Five references name one. A `segmented` style of `toggle-group` would cost little.
- **The app shell's header, nav and skip link are block parts.** Five references serve a header, and GOV.UK a skip link, as components. Lifting them into items lets an app use them outside the shell.

## 6. A question for the owner

**Should Kuiper serve a page-level notification for outcomes that land off-screen?** Four references serve a toast. `005` decision 14 declined it. Its reasons still hold.

1. **Keep the toast declined. Ship batch A's banner, and revisit when an app names an outcome it cannot show in place.** *(Recommended.)* It keeps the recorded decision and adds the nearest safe piece.
2. **Specify a timer-free notices region on `status`.** Persistent and dismissible, never focused, no auto-dismiss, one live region. It meets the sources' rules at the cost of a new item.
3. **Serve `sonner` restyled.** Most of the library would need removing; this reverses `005` without new evidence.

The answer, once given, goes to `decisions.md`.
