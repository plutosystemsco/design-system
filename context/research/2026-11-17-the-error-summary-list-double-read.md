# The error summary's list, read twice

- **Status:** complete
- **Date:** 2026-11-17
- **Author:** a researcher
- **Question:** Why does NVDA with Firefox read each error-summary message twice, once as a list item and once as its link? How do other systems render the list? Which markup reads each message once, and what does each option cost?
- **Stands on:** [the fifth matrix run](2026-11-17-the-fifth-matrix-run.md), cited as *run 5's memo*, §3.3 and §7, with the owner's answer at the end of §7; [`019`](../specifications/019-the-error-summary-alert-inside-and-the-label-in-view.md); `022t`, built on the `lane-i-attempt` worktree (`.claude/worktrees/lane-i-attempt/context/specifications/022t-the-error-summary-speaks-again-on-an-unchanged-submit.md`).
- **What it blocks:** [`019b`](../specifications/019b-the-error-summarys-messages-are-read-once.md).

## How to read this memo

- **READ:** a source, linked, read on 2026-11-17. Sources outside this repository were fetched into a scratch folder outside it, by commit:
  - NVDA, `nvaccess/nvda` at `440cea0` (`master`): `source/NVDAObjects/IAccessible/__init__.py`, `source/controlTypes/role.py`.
  - Firefox's accessibility engine, `mozilla/gecko-dev` at `5836a06` (`master`): `accessible/base/RoleMap.h`. This mirror can lag mozilla-central, which this machine's network refuses.
  - GOV.UK Frontend, `alphagov/govuk-frontend` at `f0d6e2f`: `packages/govuk-frontend/src/govuk/components/error-summary/template.njk`. MIT.
  - NHS.UK frontend, `nhsuk/nhsuk-frontend` at `4a49c1d`: `packages/nhsuk-frontend/src/nhsuk/components/error-summary/template.njk`. MIT.
  - Canada.ca's Web Experience Toolkit (WET), `wet-boew/wet-boew` at `001b7ba`: `src/plugins/formvalid/formvalid.js`. MIT.
  - Files of this repository at `b01e754`, and the item as `022t` builds it in the `lane-i-attempt` worktree. The list's markup is the same in both, apart from indentation (EXECUTED, `diff`).
- **EXECUTED:** run in this session's Linux container, by scratch scripts outside the repository. Playwright 1.64.1; Chromium 156.0.8078.4 and WebKit 27.2 from `/opt/pw-browsers`; axe-core 4.14.0 with `019` criterion 9's six tags. Two kinds of page:
  - a static probe page, loaded with `setContent`, holding the summary's structure in seven variants;
  - the main checkout's `build/` (built 2026-11-16 23:34), served by a scratch static server. On `/example/error-summary/keyboard/`, after an empty submit, a script rewrote the summary's list into each variant, keeping the links' classes. Nothing in the repository was written.
- **INFERRED:** our reasoning.
- Nothing here ran a screen reader. No Firefox build is on this machine. WebKit's accessibility tree cannot be read here.

**Terms.**

- An element's **accessible text** is its accessible name: what a reader says for it.
- **Name from subtree:** a role whose element takes its name from the text inside it, as a link does.
- **NVDA's alert walk:** what NVDA does when a browser reports that an alert appeared (its `event_alert`).
- A **wrapper** is an element between the alert and a link that the accessibility tree keeps.

## 1. Why NVDA with Firefox reads a message twice

**The walk.** READ, NVDA's `event_alert` (`IAccessible/__init__.py`, lines 2025–2066):

- NVDA speaks the alert itself.
- It then visits every descendant. It speaks one if it is focusable, or if its role is heading, list or list item. It also speaks static text whose parent is a paragraph.
- If the alert has a description, only focusable descendants are spoken.

So every list item is spoken, and so is every link inside one.

**The list item's text.** READ, Firefox's `RoleMap.h`, line 319: `LISTITEM` carries `eNameFromSubtreeRule`. A list item's name is the text inside it. Kuiper's list item holds one link and nothing else (`error-summary.svelte`, lines 171–178 in `022t`'s build). So the list item's accessible text equals its only link's.

**What NVDA says for each.** READ, `role.py`, lines 538–550: `LISTITEM` is one of the roles NVDA does not name when it speaks an object for focus. So it speaks the list item's name and its place, "Enter a project name, 1 of 3". Then it speaks the link, "Enter a project name, link, same page". That is run 5's phrase, word for word (*run 5's memo* §3.3).

**Why Chromium reads it once.**

- EXECUTED, Chromium's tree (`Accessibility.getFullAXTree`): under the alert, each `listitem` has no name. The `link` under it has the message.
- READ, *run 5's memo* §3.3: NVDA with Chromium says "list item, 1 of 3. Enter a project name, link, same page".
- INFERRED: with no name to speak, NVDA says the role instead. This was not read in NVDA's source.

**Why GOV.UK's tests would not meet it.** INFERRED. NVDA's walk runs on an alert event. GOV.UK's summary is in the page at load, with its alert, and takes focus there (`019` decision 1). A role present at load is generally not announced as an alert. Kuiper inserts its summary by script, so the walk runs.

**The cause, in one line.** Firefox names each list item with its link's text, and NVDA's alert walk speaks list items and links. The item can stop it only by not putting each link alone in a list item.

## 2. VoiceOver doubles it too

- **READ,** *run 5's memo* §3.3, VoiceOver with Chromium, error-summary's first submit: "There is a problem Enter a project name Enter a project name …". No phrase of VoiceOver with WebKit was printed: its tests passed.
- **INFERRED, from the order.** The title is said once, and each message twice in its place. A second reading of the whole summary would say the title again. So the double is per message, as under NVDA.
- **INFERRED, the cause.** VoiceOver reads the alert's elements one by one. A list item reaches macOS as a group, and the group's text is its link's. So VoiceOver says the group, then the link. This was not read in Chromium's or VoiceOver's source.
- **What can be seen here.** EXECUTED: Chromium's tree keeps one wrapper per link in today's markup (`listitem`), and in two of the options below (`paragraph`, `generic`). It keeps none in two others. INFERRED: a markup with no wrapper gives VoiceOver nothing to read before the link.

## 3. How other systems render the list

Studied, not copied. Each is described in our own words.

- **GOV.UK** (READ, `template.njk`): the alert is on a child of the summary, as in Kuiper. The body holds an optional paragraph, then a bulleted list styled without bullets. Each entry is a list item holding a link, or plain text when an error has no link. The summary is rendered with the page and focused on load.
- **NHS.UK** (READ, `template.njk`): the same structure, from the same lineage. The alert is on a child; each error is a list item holding a link.
- **Canada.ca's WET** (READ, `formvalid.js`, lines 218–357): script builds the summary after a failed submit. It is a section that takes focus, with no alert role. Its heading says the form was not sent and how many errors were found. Each link's text begins with a visible "Error" and its number. The links sit in list items.
- **A search for a reported double read** (READ, a web search on 2026-11-17, "error summary NVDA Firefox list item link read twice role alert govuk-frontend"): no GOV.UK or NHS.UK issue reports it. The results' summaries name two Firefox bugs about NVDA and list items in other widgets (Bugzilla 1568453, list items reported twice; 1754680, a link inside a list item). Neither bug page was read.

INFERRED, what this says:

- All three put each link in a list item. None avoids the list item's text.
- Two of the three meet no alert walk: their summaries are focused, not announced on insertion. Kuiper's summary is both, which is what `019` chose.
- WET keeps the count in words, in the heading and the links. It does not rely on the list to say "1 of 3".

## 4. The options

Seven markups were probed. The links keep their classes (`inline-flex min-h-6 items-center underline underline-offset-4`) in each.

| # | Markup under the body | Chromium's tree under the alert (EXECUTED) | axe, 6 tags (EXECUTED) | `019`'s raw-HTML check (READ) |
|---|---|---|---|---|
| 1 | today: `ul > li > a` | list, then a nameless `listitem` per link | 0 | holds |
| 2 | `p > a`, no list | a `paragraph` per link | 0 | holds |
| 3 | `div > a`, no list | a `generic` per link | 0 | holds |
| 4 | `ul > li[role=none] > a` | list, links straight in it | **`list`** | fails |
| 5 | `ul[role=list] > li[role=none] > a` | list, links straight in it | **`aria-required-children`** | fails |
| 6 | `ul[role=none] > li[role=none] > a` | links straight under the alert | 0 | fails |
| 7 | the links straight in the `grid gap-1` box, no list | links straight under the alert | 0 | holds |

- **axe.** Options 1, 2, 3, 6 and 7 were run on the built page, in Chromium and WebKit: 0 violations each. Options 4 and 5 were run on the static probe only. Their `list` and `aria-required-children` violations are structural. The probe's `target-size` flags came from the probe's own links, which lacked `min-h-6`, and do not count.
- **The raw-HTML check** is `019`'s test "the raw prerendered HTML: the 3 specimens hold 0 elements with a role" (`error-summary.spec.ts`). Options 4, 5 and 6 add `role` attributes, so it fails on them. It would have to learn that `none` is not a live role.
- **Playwright's snapshot** (EXECUTED, `ariaSnapshot()`, the same in both engines): options 3, 6 and 7 give `alert > heading, link, link, link`; option 2 adds a `paragraph` per link. `019` criterion 1's snapshot (`list > listitem > link`) changes for every option but 1.
- **The look** (EXECUTED, the built keyboard example at 1440 × 900, both engines): for options 2, 3, 6 and 7, the summary is 135.59 px tall, the links' tops are 42.59, 70.59 and 98.59 px below the root's top, and each is 24 px tall. These are today's figures.
  - **One trap, option 7.** A grid stretches its children. With the links straight in the box, each link was 322 px wide, the whole row, in both engines. With `justify-items-start` on the box, each kept today's width: 128, 198 and 200 px in Chromium, 128.1, 197.1 and 198.1 in WebKit. The focus ring and the click target follow the width, so the box needs `justify-items-start`.

**What each does to each reader.** INFERRED, from §1 and §2, unless marked.

| # | NVDA with Firefox | NVDA with Chromium | VoiceOver | JAWS | "1 of 3" |
|---|---|---|---|---|---|
| 1 | twice (READ, run 5) | once, with "list item, 1 of 3" (READ, run 5) | twice in Chromium (READ, run 5); WebKit unseen | not tested | kept |
| 2 | once: a paragraph is not spoken, and the link's text belongs to the link | once | at risk: a wrapper per link remains | not tested | lost |
| 3 | once | once | at risk: a wrapper per link remains | not tested | lost |
| 4, 5 | once, with "list" said and no place | once | likely once | not tested | lost; axe fails |
| 6 | once | once | likely once: no wrapper in Chromium | not tested | lost |
| 7 | once | once | likely once: no wrapper in Chromium | not tested | lost |

- **JAWS.** Not run anywhere in this project. INFERRED: JAWS reads an alert as its text, so a list item adds no words there. Every option says the same words.
- **The count.** NVDA says "1 of 3" today, as the list item's place. Every option that reads each message once loses it, because only a list item has a place. In browse mode a reader also loses "list, 3 items". The count is useful: it says how much is left to fix. It can be kept only in words, as WET does: a count in the title, or a number in each link. Either changes text the app writes or sees, so it is a question for the owner, not part of the fix.
- **Not an option:** a name on the list item (`aria-label`). Firefox would then speak that name, and Chromium would start to. It adds words, and the double read becomes a different read.

## 5. Recommendation

**Option 7: the links straight in the body's `grid gap-1` box, with `justify-items-start`, no list.**

- It reads each message once under NVDA in both browsers (§1).
- It leaves no wrapper between the alert and a link in Chromium's tree (EXECUTED). So it is the option most likely to read once under VoiceOver (§2).
- It adds no role attribute, so `019`'s raw-HTML check holds. axe finds nothing.
- It looks the same, to the hundredth of a pixel, once the box keeps each link at its own width.
- It costs the count, "1 of 3", which only a list item gives. The owner is asked whether to say it in words later.

Option 6 gives the same tree, but adds two `role="none"` attributes and breaks the raw-HTML check. Options 2 and 3 keep a wrapper that VoiceOver may still read. Options 4 and 5 fail axe.

## 6. What this memo did not see

- Any reader's speech. Every claim about what a reader says is READ from run 5's logs or INFERRED.
- Firefox's tree, and WebKit's. Firefox's list-item rule is READ from a mirror of its source.
- VoiceOver with WebKit's phrase for today's summary.
- JAWS.
