# Reviews

One file per review. `NNN-<slug>-spec-YYYY-MM-DD.md` reviews specification `NNN` before it is built. `NNN-<slug>-pr-YYYY-MM-DD.md` reviews the built change.

The reviewer did not write what is reviewed. A reviewer gets the specification, its research and the diff, not the author's account. A sub-agent of the author's session writes its Reviewer line as "an agent (Claude), a fresh sub-agent of <session>; not the author".

## The reviewer's checklist

1. Read the specification and the research it stands on.
2. For a built change: run the checks yourself and record the counts.
3. Each acceptance criterion against its evidence, one line each, labelled EXECUTED, READ or INFERRED.
4. The change against the constitution's §4 and §6.
5. Rank the findings. **High** is a wrong answer, an unsafe default, or a component that breaks an app that installed it. **Medium** is a guarantee without evidence. **Low** is a write-in, given with its fix text.
6. Verdict in one sentence. It begins "Lands" (or, for a specification, "Fit to build") when nothing stands. Otherwise "Does not land yet:" and the findings that stand.

## Template

```
# Review of NNN — <title>

- **Date:** YYYY-MM-DD
- **Reviewer:** <session or person; not the author>
- **Reviewed:** <commit or diff range, or "the specification as drafted">
- **Re-ran:** <what was run> → <counts and exit codes seen>

## Acceptance criteria against evidence
1. <criterion> — met / not met: <evidence or gap>

## Findings, most severe first
1. **<title>** (`path:line`) — <the defect in one sentence>.
   Failure: <concrete input or state → wrong output>.
   Fix: <what would close it>.

## Constitution checks
- §4.1 source, not a package: …
- §4.3 tokens are the one source: …

## Verdict
<one sentence>

## Disposition
<after the author answers: each finding fixed, or not fixed and why>
```
