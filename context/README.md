# /context

The durable memory of this project: what we are building, why, and how. `constitution.md` sets the direction and the hard constraints; every other document here obeys it. Code is a build artifact of this context. When the two disagree, fix the code, unless the context is wrong, in which case fix the context first.

## The pipeline

We work **research → spec → review → tests → code → review**. Each directory holds one stage; tests and code are the code itself.

```
context/
  README.md            # this map
  constitution.md      # the mission, the goal, the hard constraints
  decisions.md         # the owner's decisions, newest first
  handoff.md           # the state of the work, replaced at each release
  prior_art/           # clones of projects we learn from (git-ignored, read-only)
  research/            # dated memos: experiments, measurements, studied sources, placeholders
  specifications/      # numbered work packages, kept as the record once landed
  reviews/             # one record per review, of a specification before build or of a built change
```

**There is no list of open questions.** A specification makes every choice it needs and gives the reason. Something we do not know enough to decide gets a research memo marked *placeholder*. That memo names the question, what would answer it and what it blocks. The specification that needs it waits.

A decision only the owner can make is asked with options and a recommendation, and recorded in `decisions.md` once answered.

## The stages

- **`prior_art/`** holds shallow clones of other people's repositories, ignored by git. We read, grep, cite and describe them. **We never copy their code.** Check each clone's licence right after cloning and record it in `prior_art/README.md`, with the commit studied.
- **`research/`** is append-mostly and date-prefixed (`YYYY-MM-DD-slug.md`). A memo is never edited after the fact; a newer memo supersedes it. A memo comes from new findings: things run, measured or read. Label every claim **EXECUTED** (we ran it and saw it), **READ** (a source says so, linked, with the date read) or **INFERRED** (our reasoning). A memo commits us to nothing. A **placeholder** memo is the one exception: it is completed in place.
- **`specifications/`** are numbered (`NNN-slug.md`), born from research, and small enough for one builder. Each has a header (status, date, author, kind, depends on, research it stands on), an intent paragraph, a **Decisions** section, the design, scope in and out, counted acceptance criteria, and landing notes filled in when it lands. A landed specification is a historical record.
- **`reviews/`** holds one record per review. `NNN-<slug>-spec-YYYY-MM-DD.md` reviews a specification before it is built. `NNN-<slug>-pr-YYYY-MM-DD.md` reviews the built change. `reviews/README.md` holds the template.

## One change, start to finish

1. **Research.** The memos the specification will stand on exist and are labelled.
2. **Spec.** Every choice made, with its reason; acceptance criteria that can be counted.
3. **Review the spec.** A reviewer, given the specification and its research. Findings are fixed in the specification before any code.
4. **Tests.** The checks for the acceptance criteria are written first and seen failing.
5. **Code.** Until the checks pass.
6. **Review the change.** A reviewer, given the specification and the diff. Findings are fixed or answered in writing. The review is cited in the specification's landing notes.

## Conventions

- Plain Markdown.
- Each document opens with a title and a header list: status, date, author.
- The roles (owner, design lead, builder, reviewer) are the constitution's §5. A document names a role, never a person.
- A build has a **checkpoint**: the design lead looks at the half-built change, in the browser, before the builder goes on. The builder's working notes are not kept; a decision made at a checkpoint is recorded in `decisions.md`.
- Cross-reference with relative links.
- Short sentences, one idea each; a term of art is defined the first time it is used.
