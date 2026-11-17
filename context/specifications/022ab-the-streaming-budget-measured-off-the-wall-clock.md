# 022ab — The streaming budget measured off the wall clock

- **Status:** built 2026-11-17; reviewed (`reviews/032c-022ab-022aa-three-harness-fixes-pr-2026-11-17.md`); finding 1 fixed by the design lead's ruling, findings 2 and 3 taken; waits for the review's re-check. Lane E (tests only).
- **Date:** 2026-11-17
- **Author:** a lane-E builder
- **Kind:** small change (`context/README.md`: a fix with no interface change, no new token or dependency). It changes how two unit tests time `013` decision 20's budgets, and no budget and no item. No research memo of its own and no spec review. Its checks are seen failing first, and the built change is reviewed by someone who did not write it (constitution §5).
- **Depends on:** `013`, `019` (the change review's finding 6, the best of three).
- **Found by:** [the fifth matrix run](../research/2026-11-17-the-fifth-matrix-run.md), §9.1: run 6's `checks` job failed "the streaming budget (decision 20)" on the code that passed in run 5. The same two timings fail full unit runs on shared machines in `019`, `022d`, `022m`, `022q`, `022w`, `022x`, `024e`, `026` and `027`'s notes.

Terms. A _chunk_ is one append of the 50 in the stream. _Load_ here is CPU work by other processes.

## The defect

1. **The stream** (`highlight-session.test.ts`): 50 chunks, timed on the wall clock; the best of three streams' p95s is held to 4 ms. A loaded machine pauses the process at random moments, and a pause lands inside some chunk of every stream. So the best p95 rises with the load, not with the code.
2. **The 18 specimens** (`highlight.test.ts`, `tests/helpers/timings.ts`): one first pass, held to 1.5 s, and one warm pass, held to 50 ms, each a single wall-clock sample. Under load either misses.

## The fix

1. **The stream: the best of 5 to 15 whole streams.** Five timed streams run after the warm-up, each with its own p95 per chunk. The best stream's p95 is held to 4 ms. While the best is over 4 ms, more streams run, up to 15: load slows some streams, and one clean stream is enough. A stall that moves from stream to stream raises every stream's p95, so it still fails. The test prints the best p95 and each stream's, so CI's `checks` log carries the figure. Still the wall clock: see *Why not CPU time*. (As first built, each chunk kept its fastest time across streams; the change review's finding 1 showed that hides a moving stall, and the design lead ruled for whole streams.)
2. **The specimens: the main thread's CPU time.** Each pass is timed by `process.threadCpuUsage()`, which a waiting process does not advance. The warm figure is the best of five warm passes. The first pass also has a loose wall-clock ceiling, 4.5 s (3 × 1.5 s), so a regression that only waits, for a file or a compile on another thread, still fails; load does not reach it (the change review, finding 3). The warm wall time is printed, not judged.

*Why not CPU time for the stream.* `process.cpuUsage()` counts every thread: JavaScriptCore's compiler and collector threads run beside the main one, so a chunk's p95 read 4.4 to 7.0 ms at rest, over the budget with no regression. `process.threadCpuUsage()` counts the main thread alone, but on this kernel it ticks in 4 ms steps (`CONFIG_TICK_CPU_ACCOUNTING`, `HZ=250`): chunks read 0, 4 or 8 ms. A 3 ms chunk cannot be timed with it. A 0.8 s first pass can: one tick is 0.3% of its budget. A precise thread clock, `clock_gettime(CLOCK_THREAD_CPUTIME_ID)`, is reachable through `bun:ffi` (the change review, finding 4); the design lead ruled it out, so the stream stays on the wall clock.

*Why not the perf job.* Its runner is shared too, so the noise would move with the test. It would also change `matrix.yml` and `workflow.test.ts`, and `perf` fails today on CLS alone (the memo, §9.2), which would hide this test's result.

*Why not retries for the specimens.* A retry repeats the same sample. Under steady load every attempt fails alike: the first draft of (2), the best of up to three fresh processes on the wall clock, passed 0 of 10 at load average 12 to 16.

Nothing in `src/` or `static/` changes.

## The check

Each test is shown failing under load first. Then a busy loop planted in each chunk, and in each specimen, is shown failing. Then each test passes 10 of 10 with two busy `yes > /dev/null` processes beside it. After the change review: the reviewer's moving stall, 8 ms in every 7th update, is shown failing, and a planted wait is shown failing the first pass's wall ceiling.

## Landing notes

Run in this worktree on `7ec5488`, Bun 1.4.4, 4 cores. Other agents shared the machine (load average 1 to 16). Each test was run alone with `-t`.

**Failing first (EXECUTED).**

- The stream, as it was, two busy loops: 3 of 10 passed (best p95 3.26 to 5.41 ms); an earlier batch, run by mistake from the main checkout at the same commit, 0 of 10 (4.05 to 4.93). Alone: 3 of 3 passed (3.10 to 3.86).
- The specimens, as they were, two busy loops at load average 2.5: 9 of 10 passed; the miss was warm, 51.4 ms (warm 18.0 to 51.4 ms). At load average 12 to 16, first passes read 1.67 to 3.40 s on the wall clock.
- A chunk's cost grows with the document: 0.7 ms at chunk 1, 3.9 ms at chunk 50 (each chunk's best of five). So the p95 is the cost of the last chunks.

**After, as first built (EXECUTED).** The stream's figures here are the first build's statistic, each chunk's best; see *After the change review* for the ruled one.

- The stream, two busy loops: 10 of 10 passed, each chunk's best of 5, p95 3.12 to 4.00 ms; a first batch with five streams fixed, 10 of 10 (3.10 to 3.87). The single streams' p95s in those runs read up to 14.4 ms.
- The stream, a busy loop planted in each chunk: 1 ms, best of 15, p95 4.60, failed; 2 ms, 5.54, failed. (0.5 ms passed at 3.82, with five streams.)
- The specimens, two busy loops at load average 10: 10 of 10 passed; first pass 0.74 to 0.80 s and warm 10.9 to 15.5 ms of CPU time; wall 0.86 to 0.94 s and 11.7 to 21.9 ms.
- The specimens, planted: 3 ms in each specimen, warm 62.7 ms, failed; 60 ms in each specimen of the first pass only, first pass 1.74 s, failed.
- Every planted loop was removed.

**Notes.**

- On this machine the stream's own cost is 3.1 to 3.9 ms against 4 ms; `013` measured 2.6 ms at landing, and `013`'s own source reads 3.54 to 3.78 ms here (the change review), so the code has not slowed. The budget is not this change's to move: see the design lead's ruling on finding 2, below.
- CPU time leaves out time the main thread waits, for a file or a compile on another thread. Under two busy loops the first pass read 0.74 to 0.80 s of CPU against 0.86 to 0.94 s of wall time; alone, earlier, its wall time read 0.78 to 0.89 s. A regression that only waits longer would not show in (2)'s CPU figures; the wall ceiling added after the change review catches a gross one.

**The gate** (shared with `032c` and `022aa`, after all three): `bun run check`, 2434 files, 0 errors; `bun run lint`, clean; `bun test ./tests/unit`, 1950 pass, 2 skip, 0 fail, at load average 8 (stream 3.70 ms, specimens 0.77 s and 11.1 ms), and again with two busy loops added (3.84 ms; 0.76 s and 14.0 ms); `tests/e2e/upgrade.spec.ts` in `chromium-light`, 16 of 16; the dry speech run, 87 of 87 in `chromium` and in `webkit`. Nothing under `src/` or `static/` changed.

**The scorecard:** no row moves; confirmed by the change review (`benchmark-scorecard.md`, rows 3 and 8).

**After the change review (EXECUTED).** The same worktree, uncommitted, at load averages of 2 to 13 from other agents.

- **The design lead's rulings (2026-11-17).** Finding 1: judge whole streams, each stream's own p95, the best at most 4 ms, 5 streams and up to 15 while the best is over; no `bun:ffi`. Finding 2: the budget stays 4 ms until CI's `checks` log for the next run prints the figure; **if CI reads 3.5 ms or more, a later change re-sets the stream's budget to 5 ms**, as checkpoint 2 re-set the editor's bar, with the figures, the reason and the new bar in decision 20's table and its landing notes. Finding 3: a loose wall-clock ceiling on the first pass, about 4.5 s.
- **Finding 1, the moving stall.** 8 ms in every 7th update, counted across the process: 3 of 3 failed, best p95 10.43 to 10.61 ms of 15 streams (each chunk's best had passed it 3 of 3 in the review). 1 ms in every chunk: 3 of 3 failed, best 4.36 to 5.14 of 15.
- **Finding 1, under load.** Two busy loops, the machine otherwise quiet (load average 2.7): 10 of 10 passed, best p95 3.06 to 3.94 ms, each within the first 5 streams. An earlier batch, while another agent's WebKit run held about three cores (load average 5.7 to 9.5, plus the two loops), passed 1 of 10 (best of 15, 3.93 to 10.61 ms): whole streams cannot outlast a saturated machine. A probe with a 1 ms idle gap before each chunk did not help (best of 15, 3.78 to 4.66 ms at load average 13).
- **Finding 3, the ceiling.** Seen failing first: a 200 ms wait after each specimen of the first pass read 0.85 s of CPU, under the 1.5 s budget, and 4.90 s of wall time; it failed on the new ceiling ("Expected: <= 4500"). Without the wait: 0.77 s and 1.54 s, passed. Under two busy loops: 10 runs, first pass 0.65 to 0.84 s of CPU and 0.81 to 1.19 s of wall, warm 10.7 to 15.8 ms, each within all three bounds.
- Every planted wait and loop was removed.
- **The gate.** `bun test ./tests/unit`: at rest (load average 2.5), 1951 pass, 2 skip, 0 fail (stream 3.90 ms; specimens 0.77 s and 12.0 ms of CPU, 0.81 s of wall); with two busy loops, 1951 pass, 2 skip, 0 fail (3.33 ms; 0.76 s, 13.2 ms, 0.94 s). `bun run check`, 2434 files, 0 errors. `bun run lint`, clean. The dry speech run, 87 of 87 in `chromium` and in `webkit`.

**After the re-check (EXECUTED).** The re-check passed `022ab`. The same worktree, uncommitted, at load averages of 2 to 6.

- **The design lead's ruling (2026-11-17), option A.** CI already read the stream above the 3.5 ms trigger: with the old test on identical code, run 5's `checks` read 2.91, 2.89 and 2.96 ms, run 6's 4.15, 4.02 and 4.08 ms, neither runner loaded. So the stream's budget is re-set from 4 ms to 5 ms in `highlight-session.test.ts`, and recorded in `013`'s decision 20 table, criterion 19 and Landing notes (Deviations). This supersedes the finding-2 ruling's "stays 4 ms" above.
- **At 5 ms**, planted in each update: the moving stall, 8 ms in every 7th update, failed 3 of 3 (best p95 10.24 to 10.40 ms of 15 streams); 2 ms in every chunk failed 3 of 3 (5.11 to 5.64); 1 ms in every chunk passed 3 of 3 (4.54 to 4.80 ms, of 5 to 11 streams), so on this machine a 1 ms regression is now under the bar. Unplanted: 3.61 to 4.02 ms, of 5 streams. Every planted loop was removed.
- **The specimens' wall ceiling, the re-check's case** (EXECUTED by the reviewer, at rest): a 200 ms wait after each specimen of the first pass passed at 4.44 to 4.48 s of wall time; 250 ms failed at 5.37 s. So at rest the 4.5 s ceiling catches an added wait of about 4.5 s (250 ms a specimen), not 3.6 s (200 ms). The builder's 200 ms case failed at 4.90 s only because the machine was loaded then (that run's unplanted wall time was 1.54 s).

