# 022i — The matrix workflow's two missing steps

- **Status:** built 2026-11-16; reviewed (`reviews/022ij-the-matrix-workflow-and-the-run-keys-pr-2026-11-16.md`, land), its findings answered there. Lane E.
- **Date:** 2026-11-16
- **Author:** the design lead
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency, in one file, `.github/workflows/matrix.yml`). No research memo and no spec review. Its check is the next `matrix` push run. The built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `022`.
- **Found by:** the first `matrix` run, groups 10 and 11 (`research/2026-11-16-the-first-matrix-run.md`).

## The defects

1. **The smoke test has no site to read.** `checks` runs `bun run test:smoke`, and `tests/smoke/site-add.test.ts` reads `build/` (l. 75). The job neither builds the site nor downloads the `site` artifact, so the test fails in its `beforeAll`: "build/ is missing". Every other smoke test passed (141).
2. **VoiceOver's setup has no ffmpeg.** Every job installs with `bun install --frozen-lockfile --ignore-scripts`. That skips `ffmpeg-static`'s install script, which downloads its binary. `voiceover` then runs `guidepup setup --ci --macos-record`, whose recording needs the binary: `spawn …/ffmpeg-static/ffmpeg ENOENT`. No VoiceOver test ran.

## The fix

1. `checks` takes `needs: build` and, before `test:smoke`, the same three steps the browser jobs use: download the `site` artifact, unpack it, and test that `build/index.html` and the server manifest exist. The site is built once, by `build`, as `022` decision 6 intends.
2. `voiceover`, after its install, runs `ffmpeg-static`'s own install script alone: `cd node_modules/ffmpeg-static && bun install.js`. Every other package's scripts stay off. EXECUTED in this session: with the binary moved aside, `bun install.js` downloaded it again. The next step checks the binary's SHA-256 against the darwin-arm64 file of the pinned release (`a90e3db6…`, EXECUTED by the review), so a replaced release asset fails there (the review's finding 7).

This replaces `022`'s "`checks` … needs no build" (`022-the-test-matrix.md`, l. 703). `checks` now waits for `build`, and a failed build skips it. The gate already fails on a skipped job. At most 29 jobs are ready at once, not 30.

## The check

1. Two unit tests in `tests/unit/workflow.test.ts`: `checks` needs `build` and unpacks the site before `test:smoke`; `voiceover` runs the install script, then the hash check, then `sr:setup`. Seen failing first on `e24a04b`'s workflow (2 fail, 19 pass), passing after (34 pass with `release-check.test.ts`).
2. The next `matrix` push run: `checks` passes `test:smoke` with 151 pass, 0 fail (run 1's 141, and `site-add`'s 10). Both `voiceover` jobs pass `sr:setup` and reach `test:sr`. Their failures, if any, are the screen-reader suite's, not the setup's. If the recording itself fails on `macos-26`, `@guidepup/record` says "ffmpeg recording failed", a different error, and a new small change drops `--macos-record`.

## Landing notes

- **The scorecard:** no row moves (the run log's row for `022i`, `022j` and `022k`).
