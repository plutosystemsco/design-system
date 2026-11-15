/**
 * The workbench's specimens: eighteen programs, one per language, written so
 * the palette can be judged on real code. Each is idiomatic and reads as part
 * of one mission-operations codebase. Together they put every text slot on
 * screen (the unit suite counts it); each program shows a comment, a keyword,
 * a string and a function at least.
 *
 * The code is data for the page. Inside these template literals a backtick is
 * written \`, an interpolation \${ and a backslash \\.
 */

export type Specimen = {
  id: string;
  title: string;
  /** The language id the highlighter knows. */
  language: string;
  /** A file name, for the pane header. */
  file: string;
  /** The roles it is written to show. */
  about: string;
  code: string;
};

export const SPECIMENS: Specimen[] = [
  {
    id: "typescript",
    title: "TypeScript",
    language: "typescript",
    file: "decoder.ts",
    about:
      "An enum, an interface, a decorator, a private field, a regular expression, a template literal",
    code: `// Telemetry frames from the probe, decoded and kept in order.
import { EventEmitter } from "node:events";

export enum Channel {
  Power = 0x01,
  Thermal = 0x02,
  Attitude = 0x04,
}

export interface Frame<T = number> {
  readonly seq: number;
  channel: Channel;
  value: T;
  receivedAt?: Date;
}

const FRAME_PATTERN = /^(?<seq>\\d{6}):(?<channel>[0-9a-f]{2}):(?<value>-?\\d+(\\.\\d+)?)$/i;
const MAX_GAP_MS = 2_500;

function logged(target: unknown, key: string, descriptor: PropertyDescriptor) {
  const inner = descriptor.value;
  descriptor.value = function (this: Decoder, ...args: unknown[]) {
    console.debug(\`[\${key}] \${args.length} argument(s)\\n\`);
    return inner.apply(this, args);
  };
}

export class Decoder extends EventEmitter {
  #frames = new Map<number, Frame>();

  constructor(private readonly label: string) {
    super();
  }

  @logged
  decode(line: string): Frame | null {
    const match = FRAME_PATTERN.exec(line.trim());
    if (match?.groups === undefined) return null;
    const frame: Frame = {
      seq: Number.parseInt(match.groups.seq, 10),
      channel: parseInt(match.groups.channel, 16) as Channel,
      value: parseFloat(match.groups.value),
      receivedAt: new Date(),
    };
    const last = Math.max(...this.#frames.keys(), 0);
    if (frame.seq - last > MAX_GAP_MS) this.emit("gap", { from: last, to: frame.seq });
    this.#frames.set(frame.seq, frame);
    return frame;
  }

  get size(): number {
    return this.#frames.size;
  }
}`,
  },
  {
    id: "tsx",
    title: "TSX",
    language: "tsx",
    file: "subsystem-row.tsx",
    about:
      "Components as tags, props as attributes, a union type, an expression in braces",
    code: `// A subsystem row: typed props, local state and a disclosure.
import { useMemo, useState, type ReactNode } from "react";

type Health = "ok" | "warn" | "fault";

interface RowProps {
  name: string;
  health: Health;
  children?: ReactNode;
}

export function SubsystemRow({ name, health, children }: RowProps) {
  const [open, setOpen] = useState(false);
  const label = useMemo(() => \`\${name}: \${health.toUpperCase()}\`, [name, health]);

  return (
    <li className={\`row row--\${health}\`} data-open={open}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {label}
      </button>
      {open && <div role="region">{children ?? <em>No detail yet</em>}</div>}
    </li>
  );
}`,
  },
  {
    id: "python",
    title: "Python",
    language: "python",
    file: "bodies.py",
    about:
      "A docstring, a frozen dataclass, an enum, decorators, self and cls, an f-string, built-ins",
    code: `"""Orbit bookkeeping: a frozen dataclass, an enum, async I/O and f-strings."""
from __future__ import annotations

import asyncio
import re
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import ClassVar, Iterator

AU_KM: float = 149_597_870.7
PATTERN = re.compile(r"^(?P<name>\\w+)\\s+(?P<a>[\\d.]+)$")


class Kind(Enum):
    PLANET = auto()
    DWARF = auto()


@dataclass(frozen=True, order=True)
class Body:
    name: str
    semi_major_au: float
    kind: Kind = Kind.DWARF
    moons: tuple[str, ...] = field(default_factory=tuple)
    registry: ClassVar[dict[str, Body]] = {}

    @property
    def period_years(self) -> float:
        return self.semi_major_au ** 1.5  # Kepler, the third law

    @classmethod
    def parse(cls, line: str) -> Body | None:
        if (match := PATTERN.match(line)) is None:
            return None
        return cls(match["name"], float(match["a"]))

    def __str__(self) -> str:
        return f"{self.name:<8} {self.period_years:>7.2f} yr\\t{len(self.moons)} moons"


async def survey(lines: list[str]) -> Iterator[Body]:
    await asyncio.sleep(0)
    return iter(sorted(filter(None, map(Body.parse, lines))))


pluto = Body("Pluto", 39.48, moons=("Charon", "Nix", "Hydra", "Kerberos", "Styx"))
print(pluto, isinstance(pluto, Body), None, True, 0x2A, 1e-3, 3j)`,
  },
  {
    id: "rust",
    title: "Rust",
    language: "rust",
    file: "window.rs",
    about:
      "Attributes, an enum with data, a trait, lifetimes, a match, a macro, self",
    code: `//! A ring buffer for sensor samples, with a trait and lifetimes.
use std::collections::VecDeque;
use std::fmt;

/// The most samples a window keeps.
pub const CAPACITY: usize = 1 << 10;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Reading {
    Temperature(f32),
    Voltage { millivolts: u16 },
    Missing,
}

pub trait Summary {
    fn mean(&self) -> Option<f64>;
}

pub struct Window<'a> {
    label: &'a str,
    samples: VecDeque<Reading>,
}

impl<'a> Window<'a> {
    pub fn new(label: &'a str) -> Self {
        Self { label, samples: VecDeque::with_capacity(CAPACITY) }
    }

    pub fn push(&mut self, reading: Reading) {
        if self.samples.len() == CAPACITY {
            self.samples.pop_front();
        }
        self.samples.push_back(reading);
    }
}

impl Summary for Window<'_> {
    fn mean(&self) -> Option<f64> {
        let values: Vec<f64> = self
            .samples
            .iter()
            .filter_map(|r| match r {
                Reading::Temperature(t) => Some(f64::from(*t)),
                Reading::Voltage { millivolts } => Some(*millivolts as f64 / 1_000.0),
                Reading::Missing => None,
            })
            .collect();
        (!values.is_empty()).then(|| values.iter().sum::<f64>() / values.len() as f64)
    }
}

impl fmt::Display for Window<'_> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}: {} samples\\n", self.label, self.samples.len())
    }
}`,
  },
  {
    id: "go",
    title: "Go",
    language: "go",
    file: "uplink.go",
    about:
      "A package, struct tags, iota constants, a method receiver, a channel select, error wrapping",
    code: `// Package uplink queues commands for the next contact window.
package uplink

import (
	"context"
	"errors"
	"fmt"
	"time"
)

type Priority int

const (
	Routine Priority = iota
	Urgent
	Critical
)

// ErrWindowClosed is returned once the antenna has set.
var ErrWindowClosed = errors.New("uplink: window closed")

type Command struct {
	ID       string        \`json:"id"\`
	Priority Priority      \`json:"priority"\`
	Timeout  time.Duration \`json:"timeout,omitempty"\`
}

type Queue struct {
	pending chan Command
	sent    map[string]time.Time
}

func NewQueue(size int) *Queue {
	return &Queue{pending: make(chan Command, size), sent: map[string]time.Time{}}
}

func (q *Queue) Send(ctx context.Context, cmd Command) error {
	select {
	case q.pending <- cmd:
		q.sent[cmd.ID] = time.Now()
		return nil
	case <-ctx.Done():
		return fmt.Errorf("send %q (priority %d): %w\\n", cmd.ID, cmd.Priority, ErrWindowClosed)
	}
}

func (q *Queue) Len() int { return len(q.pending) }

var _ = Critical > Routine && true || false`,
  },
  {
    id: "java",
    title: "Java",
    language: "java",
    file: "Planner.java",
    about:
      "A sealed interface, records, annotations, a switch with patterns, this",
    code: `package systems.pluto.mission;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/** A burn plan: a sealed hierarchy, records and a switch expression. */
public final class Planner {

    public static final double DELTA_V_LIMIT = 12.5e3;

    public sealed interface Manoeuvre permits Burn, Coast {
        Duration duration();
    }

    public record Burn(String engine, double deltaV, Duration duration) implements Manoeuvre {
        public Burn {
            if (deltaV > DELTA_V_LIMIT) {
                throw new IllegalArgumentException("burn over the limit: %.1f m/s%n".formatted(deltaV));
            }
        }
    }

    public record Coast(Duration duration) implements Manoeuvre {}

    private final List<Manoeuvre> plan = new ArrayList<>();

    public Planner add(Manoeuvre step) {
        this.plan.add(step);
        return this;
    }

    @Override
    public String toString() {
        return String.join("\\n", plan.stream().map(Planner::describe).toList());
    }

    static String describe(Manoeuvre m) {
        return switch (m) {
            case Burn b when b.deltaV() == 0 -> "idle burn";
            case Burn b -> "burn on " + b.engine() + "\\t" + b.deltaV() + " m/s";
            case Coast c -> "coast for " + c.duration().toMinutes() + " min";
        };
    }

    @SuppressWarnings("unused")
    Optional<Manoeuvre> longest() {
        return plan.isEmpty() ? Optional.empty() : plan.stream().max((a, b) -> a.duration().compareTo(b.duration()));
    }
}`,
  },
  {
    id: "csharp",
    title: "C#",
    language: "csharp",
    file: "Schedule.cs",
    about:
      "Attributes, a record, async streams, LINQ, an interpolated string with a format",
    code: `using System.Text.Json.Serialization;

namespace Pluto.Ground;

/// <summary>A pass of the ground station over the probe.</summary>
[Serializable]
public sealed record Pass(string Station, DateTimeOffset Start, TimeSpan Length)
{
    public const int MinElevation = 10;

    [JsonIgnore]
    public DateTimeOffset End => Start + Length;

    public bool Overlaps(Pass other) => Start < other.End && other.Start < End;
}

public class Schedule
{
    private readonly List<Pass> _passes = new();

    // Passes that overlap one already held are skipped.
    public async Task<int> LoadAsync(IAsyncEnumerable<Pass> source, CancellationToken token = default)
    {
        await foreach (var pass in source.WithCancellation(token))
        {
            if (_passes.Any(p => p.Overlaps(pass))) continue;
            this._passes.Add(pass);
        }
        return _passes.Count;
    }

    public override string ToString()
    {
        var next = _passes.MinBy(p => p.Start);
        return next is null ? "no passes" : $"{_passes.Count} passes, next at {next.Start:HH:mm}\\n";
    }
}`,
  },
  {
    id: "ruby",
    title: "Ruby",
    language: "ruby",
    file: "housekeeping.rb",
    about:
      "A module, a Struct, symbols, a regular expression, interpolation, blocks, self",
    code: `# frozen_string_literal: true

require "json"

# Turns the raw housekeeping log into tidy rows.
module Housekeeping
  VERSION = "2.4.0"
  Row = Struct.new(:stamp, :subsystem, :value, keyword_init: true)

  class Parser
    attr_reader :rows

    LINE = /\\A(?<stamp>\\d+)\\s+(?<subsystem>[A-Z]{3})\\s+(?<value>-?\\d+\\.\\d+)\\z/

    def initialize(source)
      @source = source
      @rows = []
    end

    def parse!
      @source.each_line(chomp: true) do |line|
        next if line.empty? || line.start_with?("#")

        match = LINE.match(line) or raise ArgumentError, "bad line: #{line.inspect}\\n"
        @rows << Row.new(stamp: match[:stamp].to_i, subsystem: match[:subsystem].to_sym, value: Float(match[:value]))
      end
      self
    end

    def self.call(source) = new(source).parse!.rows

    def to_json(*) = { version: VERSION, count: rows.size, last: rows.last&.to_h }.to_json
  end
end

puts Housekeeping::Parser.call("1200 PWR 28.40\\n1201 THM -12.75").map(&:subsystem).inspect, nil.inspect`,
  },
  {
    id: "svelte",
    title: "Svelte",
    language: "svelte",
    file: "countdown.svelte",
    about:
      "A script with runes, markup blocks, attributes, an event handler, a style block",
    code: `<script lang="ts">
  // A contact countdown: runes, a derived value and a cleanup.
  import { onDestroy } from "svelte";

  interface Props {
    station: string;
    opensAt: Date;
  }

  let { station, opensAt }: Props = $props();
  let now = $state(Date.now());
  const seconds = $derived(Math.max(0, Math.round((opensAt.getTime() - now) / 1000)));
  const open = $derived(seconds === 0);

  const timer = setInterval(() => (now = Date.now()), 1_000);
  onDestroy(() => clearInterval(timer));
</script>

<section class="countdown" aria-live="polite" data-open={open}>
  <h2>{station}</h2>
  {#if open}
    <p class="status">Window open &mdash; transmit.</p>
  {:else}
    <p>Opens in <time datetime="PT{seconds}S">{seconds}s</time></p>
  {/if}
  <button type="button" onclick={() => (now = Date.now())} disabled={open}>Refresh</button>
</section>

<style>
  .countdown {
    display: grid;
    gap: 0.5rem;
  }
  .status {
    font-weight: 600;
  }
</style>`,
  },
  {
    id: "html",
    title: "HTML",
    language: "html",
    file: "status.html",
    about:
      "Tags, attributes, entities, a comment, an inline script, and one bare < the grammar flags",
    code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mission status &middot; Pluto Systems</title>
    <link rel="stylesheet" href="/styles/status.css" />
    <script type="module">
      import { start } from "/status.js";
      start({ every: 30_000, board: document.getElementById("board") });
    </script>
  </head>
  <body>
    <!-- The status board: one row per subsystem. -->
    <main id="board" class="board" data-refresh="30">
      <table>
        <caption>Subsystems at 14:02 UTC</caption>
        <tr><th scope="col">Name</th><th scope="col">State</th></tr>
        <tr><td>Power</td><td class="ok">Nominal &check;</td></tr>
        <tr><td>Thermal</td><td class="warn">Margin &lt; 5&#37;</td></tr>
      </table>
      <p>A bare < is a mistake, and the grammar flags it as invalid.</p>
      <a href="https://example.com/status?view=board&amp;theme=dark">Open the full board</a>
    </main>
  </body>
</html>`,
  },
  {
    id: "css",
    title: "CSS",
    language: "css",
    file: "status.css",
    about:
      "Selectors, custom properties, functions, units, an escape, at-rules",
    code: `/* The status board, on custom properties and a container query. */
@import url("/fonts/mono.css") layer(base);

:root {
  --board-gap: 0.75rem;
  --board-ok: oklch(0.62 0.15 155);
  --board-warn: #c4581b;
}

.board > table {
  inline-size: min(100%, 48rem);
  border-collapse: collapse;
  font: 500 0.875rem/1.6 "JetBrains Mono", monospace;
}

#board td.ok::before,
#board td.warn::before {
  content: "\\25CF\\00A0";
  color: var(--board-ok);
}

.board tr:nth-child(even):not(:hover) {
  background: rgb(0 0 0 / 4%);
}

@container (width > 40rem) {
  .board {
    padding: calc(var(--board-gap) * 2) !important;
  }
}

@keyframes pulse {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.4;
  }
}`,
  },
  {
    id: "sql",
    title: "SQL",
    language: "sql",
    file: "contacts.sql",
    about:
      "Types and constraints, a common table expression, aggregates, a window function",
    code: `-- Contacts per station, ranked, over the last thirty days.
CREATE TABLE IF NOT EXISTS contact (
  id          BIGSERIAL PRIMARY KEY,
  station     VARCHAR(16) NOT NULL,
  started_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  minutes     NUMERIC(6, 2) CHECK (minutes > 0),
  notes       TEXT DEFAULT NULL
);

WITH recent AS (
  SELECT station, minutes, started_at
  FROM contact
  WHERE started_at >= CURRENT_DATE - INTERVAL '30 days'
    AND notes IS DISTINCT FROM 'test pass'
)
SELECT
  station,
  COUNT(*) AS passes,
  ROUND(AVG(minutes), 1) AS mean_minutes,
  RANK() OVER (ORDER BY SUM(minutes) DESC) AS standing
FROM recent
GROUP BY station
HAVING COUNT(*) > 3
ORDER BY standing
LIMIT 10;`,
  },
  {
    id: "bash",
    title: "Bash",
    language: "bash",
    file: "sync-telemetry.sh",
    about:
      "Variables and expansions, a function, an array, a case, command substitution, special parameters",
    code: `#!/usr/bin/env bash
# Fetches the latest telemetry archive and verifies it.
set -euo pipefail

readonly ARCHIVE_URL="\${ARCHIVE_URL:-https://example.com/telemetry}"
readonly DEST="$HOME/telemetry/$(date -u +%Y-%m-%d)"
declare -a failed=()

log() {
  printf '[%s] %s\\n' "$(date -u +%H:%M:%S)" "$*" >&2
}

fetch() {
  local name=$1
  curl --fail --silent --show-error --output "$DEST/$name" "$ARCHIVE_URL/$name" || failed+=("$name")
}

# The ground tools, from each package manager.
pip install plutosystems
npm install plutosystems
cargo install plutosystems

mkdir -p "$DEST"
for file in frames.bin events.log checksums.txt; do
  fetch "$file"
done

case "\${#failed[@]}" in
  0) log "fetched every file into $DEST" ;;
  *) log "failed: \${failed[*]}"; exit 1 ;;
esac

cd "$DEST" && sha256sum --check --quiet checksums.txt
echo "exit status $? from $0 with $# arguments"`,
  },
  {
    id: "yaml",
    title: "YAML",
    language: "yaml",
    file: "ci.yml",
    about: "Keys, anchors and aliases, booleans, numbers, null, a block scalar",
    code: `# The ground segment CI: lint, test and a gated release.
name: ground-segment
on:
  push:
    branches: [main]
  schedule:
    - cron: "0 6 * * 1-5"

defaults: &defaults
  runs-on: ubuntu-24.04
  timeout-minutes: 20

jobs:
  test:
    <<: *defaults
    strategy:
      fail-fast: false
      matrix:
        bun: ["1.3.14"]
        shard: [1, 2, 3]
    steps:
      - uses: actions/checkout@v4
      - run: bun install --frozen-lockfile
      - run: bun test --shard \${{ matrix.shard }}/3
        env:
          TZ: UTC
          RETRIES: 2
          VERBOSE: true
          PROXY: null
  release:
    needs: test
    if: github.ref == 'refs/heads/main'
    <<: *defaults
    steps:
      - run: |
          echo "Releasing $GITHUB_SHA"
          bun run build`,
  },
  {
    id: "json",
    title: "JSON",
    language: "json",
    file: "station.json",
    about: "Keys, strings with escapes, numbers, booleans, null, nesting",
    code: `{
  "$schema": "https://example.com/schemas/station.json",
  "station": "Canberra DSS-43",
  "location": { "lat": -35.4014, "lon": 148.9817, "altitudeM": 688 },
  "bands": ["S", "X", "Ka"],
  "dishMeters": 70,
  "active": true,
  "retiredAt": null,
  "motd": "Maintenance:\\tSaturday 02:00\\u201304:00 UTC\\n",
  "limits": {
    "maxElevationDeg": 90.0,
    "minElevationDeg": 6.5e0,
    "slewRateDegPerSec": 0.25
  }
}`,
  },
  {
    id: "toml",
    title: "TOML",
    language: "toml",
    file: "Cargo.toml",
    about: "Tables, keys, inline tables, arrays, booleans, a date-time",
    code: `# The flight software manifest.
[package]
name = "flight-core"
version = "0.14.2"
edition = "2021"
authors = ["Guidance Team <guidance@example.com>"]
publish = false

[dependencies]
serde = { version = "1.0", features = ["derive"] }
heapless = "0.8"

[profile.release]
opt-level = "z"
lto = true
codegen-units = 1

[[bin]]
name = "sequencer"
path = "src/bin/sequencer.rs"

[package.metadata.release]
frozen-since = 2026-11-14T06:00:00Z
watchdog-ms = 2_500`,
  },
  {
    id: "markdown",
    title: "Markdown",
    language: "markdown",
    file: "runbook.md",
    about:
      "Headings, emphasis, lists, inline code, links, a quote, a fenced block, a table",
    code: `# Contact runbook

Use this page during a **scheduled pass**. Times are _UTC_.

## Before acquisition

1. Confirm the antenna reads \`READY\` on the [station board](https://example.com/board).
2. Load the command plan:
   - check the checksum
   - check the date is ~~yesterday~~ today

> If the link drops for more than 30 s, stop and call the flight director.

\`\`\`bash
bun run uplink --plan plans/today.json --dry-run
\`\`\`

| Step | Owner    | Budget |
| ---- | -------- | -----: |
| AOS  | Station  |  2 min |
| Load | Operator |  5 min |

The rest is at <https://example.com/runbooks>.`,
  },
  {
    id: "diff",
    title: "Diff",
    language: "diff",
    file: "uplink.patch",
    about:
      "A unified hunk of added and removed lines, then a context hunk of changed lines",
    code: `diff --git a/uplink/uplink.go b/uplink/uplink.go
index 3f2a1c0..8b9d4e7 100644
--- a/uplink/uplink.go
+++ b/uplink/uplink.go
@@ -41,7 +41,8 @@ func (q *Queue) Send(ctx context.Context, cmd Command) error {
 	select {
 	case q.pending <- cmd:
-		q.sent[cmd.ID] = time.Now()
+		q.sent[cmd.ID] = time.Now().UTC()
+		q.metrics.Inc("sent")
 		return nil
 	case <-ctx.Done():
-		return ErrWindowClosed
+		return fmt.Errorf("send %q: %w", cmd.ID, ErrWindowClosed)
 	}
*** a/config/limits.txt
--- b/config/limits.txt
***************
*** 1,3 ****
  max_gap_ms 2500
! min_elevation 10
  slew_rate 0.25
--- 1,3 ----
  max_gap_ms 2500
! min_elevation 6.5
  slew_rate 0.25`,
  },
];
