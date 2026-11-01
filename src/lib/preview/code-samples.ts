/**
 * The twenty-six samples of the highlighter page's gallery (007 decision 9):
 * one per language the highlighter lists, nine to fifteen lines each, written
 * for the preview. Each exercises the roles its grammar has: a definition, a
 * call, a type, a decorator or attribute where the language has one, a string
 * with an escape or an interpolation, a number, a constant, a comment, and
 * keys or attributes where the language is data or markup. They are data for
 * the page, outside the lint.
 */

export type CodeSample = {
  /** The language id the highlighter knows. */
  language: string;
  /** The language's name, as the gallery titles it. */
  title: string;
  code: string;
};

/** The class sample: a docstring, a decorated dataclass with annotated fields, a property, `self`, an f-string, built-ins. */
export const PYTHON_CLASS = `"""A fuel ledger: a decorated class, annotations and an f-string."""
from dataclasses import dataclass, field

@dataclass(order=True)
class Run:
    name: str
    fuel: float = 0.0
    steps: int = field(default=1)
    @property
    def per_step(self) -> float:
        return self.fuel / self.steps  # fuel per instruction
    def __str__(self) -> str:
        return f"{self.name!r}: {self.per_step:.2f}"
runs = [Run("darts", 4.81, 100), Run("sudoku", 0.3, 25)]
print(sorted(runs)[0], len(runs), None, True)`;

export const CODE_SAMPLES: CodeSample[] = [
  { language: "python", title: "Python", code: PYTHON_CLASS },
  {
    language: "javascript",
    title: "JavaScript",
    code: `// A fuel budget, counted down as a program runs.
const BUDGET = 30_000_000_000;

export class Budget {
  #spent = 0;
  constructor(label) {
    this.label = label;
  }
  spend(amount) {
    this.#spent += amount;
    return this.#spent <= BUDGET ? null : new Error(\`\${this.label}: out of fuel\\n\`);
  }
}

console.log(new Budget("darts").spend(4.81e9), typeof BUDGET, undefined);`,
  },
  {
    language: "typescript",
    title: "TypeScript",
    code: `// A run's result, typed, and a ledger that keeps them.
interface RunResult {
  readonly name: string;
  fuel: number;
  ok: boolean;
}

@sealed
export class Ledger {
  private report: Map<string, RunResult> = new Map();
  record(result: RunResult): void {
    this.report.set(result.name, result);
  }
  summary = (): string => \`\${this.report.size} runs\\t\${[...this.report.values()].filter((r) => r.ok).length} ok\`;
}`,
  },
  {
    language: "tsx",
    title: "TSX",
    code: `import { useState } from "react";

type MeterProps = { value: number; max: number };

// A fuel meter as a component: a typed prop and a state hook.
export function FuelMeter({ value, max }: MeterProps) {
  const [open, setOpen] = useState<boolean>(false);
  const label = \`\${value} of \${max}\`;
  return (
    <div className="meter" onClick={() => setOpen(!open)}>
      <meter value={value} max={max} aria-label={label} />
      {open ? <span>{label}</span> : null}
    </div>
  );
}`,
  },
  {
    language: "jsx",
    title: "JSX",
    code: `import { useState } from "react";
// A copy button: a hook, an event, a conditional child.
export function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button type="button" onClick={copy} aria-live="polite">
      {copied ? "Copied" : "Copy code"} &middot; {code.length} chars
    </button>
  );
}`,
  },
  {
    language: "html",
    title: "HTML",
    code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Fuel &amp; runs</title>
    <!-- One script, deferred by its type. -->
  </head>
  <body class="paper">
    <main id="app" data-runs="2">
      <h1>4.81 billion of 30</h1>
      <meter value="4.81" max="30" aria-label="Fuel"></meter>
    </main>
    <script type="module" src="/app.js"></script>
  </body>
</html>`,
  },
  {
    language: "css",
    title: "CSS",
    code: `/* The meter's track and fill, from the tokens. */
:root {
  --meter-height: 8px;
}

.meter::-webkit-meter-bar {
  background: var(--muted);
  height: var(--meter-height);
}

.meter:hover, #fuel > .label {
  color: rgb(20 22 28 / 80%);
  font: 500 0.875rem/1.6 monospace;
  width: calc(100% - 2rem);
}`,
  },
  {
    language: "json",
    title: "JSON",
    code: `{
  "name": "darts",
  "fuel": 4.81e9,
  "ok": true,
  "error": null,
  "steps": [1000, 10000, 100000],
  "output": "pi = 3.1416\\nDone.",
  "limits": {
    "budget": 30000000000,
    "wall-clock": "30s"
  }
}`,
  },
  {
    language: "yaml",
    title: "YAML",
    code: `# A workflow: keys, scalars, a list, an anchor.
name: Run the examples
on: [push, pull_request]
env:
  FUEL: 30000000000
  VERBOSE: true
jobs:
  test:
    runs-on: &runner ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: bun test --timeout 300000
        name: "Unit \\u0026 smoke"
  lint:
    runs-on: *runner`,
  },
  {
    language: "toml",
    title: "TOML",
    code: `# A project file: tables, keys, an array, a date.
[project]
name = "pluto-sandbox"
version = "0.7.0"
requires-python = ">=3.13"
released = 2026-11-01

[tool.sandbox]
fuel = 30_000_000_000
verbose = false
paths = ["examples", "probes"]

# Per run.
[tool.sandbox.limits]
wall-clock = "30s"`,
  },
  {
    language: "markdown",
    title: "Markdown",
    code: `# Fuel

A run is given a **budget** of instructions. A program that spends it is
_stopped_, and the output so far is kept.

> Nothing a run does outlives it.

- 30 billion instructions by default
- \`fuel\` in the result tells what was spent

See [the sandbox](https://sandbox.example/limits) for the limits.

\`\`\`python
print(run.fuel)
\`\`\``,
  },
  {
    language: "bash",
    title: "Shell",
    code: `#!/usr/bin/env bash
# Run every example and count the ones that pass.
set -euo pipefail

passed=0
for file in examples/*.py; do
  if python "$file" > "/tmp/$(basename "$file").out" 2>&1; then
    passed=$((passed + 1))
  fi
done

export RESULT="$passed of $(ls examples/*.py | wc -l) passed"
echo -e "\\n$RESULT"
[[ $passed -gt 0 ]] && exit 0`,
  },
  {
    language: "sql",
    title: "SQL",
    code: `-- The fuel spent per program, highest first.
CREATE TABLE runs (
  id INTEGER PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  fuel BIGINT DEFAULT 0,
  ok BOOLEAN
);

SELECT name, SUM(fuel) AS spent, COUNT(*) AS n
FROM runs
WHERE ok = TRUE AND name LIKE 'dart%'
GROUP BY name
HAVING SUM(fuel) > 1000000
ORDER BY spent DESC
LIMIT 10;`,
  },
  {
    language: "go",
    title: "Go",
    code: `package main
import "fmt"

// A run and the fuel it spent.
type Run struct {
	Name string
	Fuel uint64
}

const budget uint64 = 30_000_000_000
func (r *Run) Left() uint64 { return budget - r.Fuel }
func main() {
	run := &Run{Name: "darts", Fuel: 4_810_000_000}
	fmt.Printf("%s: %d left\\n", run.Name, run.Left())
}`,
  },
  {
    language: "rust",
    title: "Rust",
    code: `use std::fmt;

/// A run and the fuel it spent.
#[derive(Debug, Default, Clone)]
pub struct Run<'a> {
    name: &'a str,
    fuel: u64,
}
const BUDGET: u64 = 30_000_000_000;

impl<'a> fmt::Display for Run<'a> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}: {} left\\n", self.name, BUDGET - self.fuel)
    }
}`,
  },
  {
    language: "java",
    title: "Java",
    code: `package co.plutosystems.sandbox;

/** A run and the fuel it spent. */
public final class Run {
    private static final long BUDGET = 30_000_000_000L;
    private final String name;
    private long fuel = 0;

    public Run(String name) { this.name = name; }

    @Override
    public String toString() {
        return String.format("%s: %d left%n", name, BUDGET - fuel);
    }
}`,
  },
  {
    language: "c",
    title: "C",
    code: `#include <stdio.h>
#include <stdint.h>
#define BUDGET 30000000000ULL
/* A run and the fuel it spent. */
struct run {
    const char *name;
    uint64_t fuel;
};

static uint64_t left(const struct run *r) { return BUDGET - r->fuel; }
int main(void) {
    struct run darts = { "darts", 4810000000ULL };
    printf("%s: %llu left\\n", darts.name, left(&darts));
    return 0;
}`,
  },
  {
    language: "cpp",
    title: "C++",
    code: `#include <cstdint>
#include <string>
namespace sandbox {
constexpr std::uint64_t kBudget = 30'000'000'000;

// A run and the fuel it spent.
class Run {
 public:
  explicit Run(std::string name) : name_(std::move(name)) {}
  [[nodiscard]] auto left() const -> std::uint64_t { return kBudget - fuel_; }
 private:
  std::string name_;
  std::uint64_t fuel_ = 0;
};
}  // namespace sandbox`,
  },
  {
    language: "csharp",
    title: "C#",
    code: `namespace Sandbox;

/// <summary>A run and the fuel it spent.</summary>
public sealed record Run(string Name, ulong Fuel)
{
    private const ulong Budget = 30_000_000_000;

    [Obsolete("Use Left")]
    public ulong Remaining => Budget - Fuel;
    public ulong Left => Budget - this.Fuel;
    public override string ToString() => $"{Name}: {Left:N0} left\\n";
}

Console.WriteLine(new Run("darts", 4_810_000_000).Left > 0 ? "ok" : null);`,
  },
  {
    language: "ruby",
    title: "Ruby",
    code: `# frozen_string_literal: true
module Sandbox
  BUDGET = 30_000_000_000

  # A run and the fuel it spent.
  class Run
    attr_reader :name, :fuel
    def initialize(name, fuel: 0)
      @name = name
      @fuel = fuel
    end
    def to_s = "#{@name}: #{BUDGET - fuel} left\\n"
  end
end
puts Sandbox::Run.new("darts", fuel: 4_810_000_000), :done, nil`,
  },
  {
    language: "php",
    title: "PHP",
    code: `<?php
declare(strict_types=1);

namespace Sandbox;

/** A run and the fuel it spent. */
#[\\Attribute]
final class Run
{
    public const BUDGET = 30_000_000_000;
    public function __construct(private string $name, private int $fuel = 0) {}
    public function left(): int { return self::BUDGET - $this->fuel; }
}

echo sprintf("%s: %d left\\n", "darts", (new Run("darts", 4810000000))->left()), PHP_EOL;`,
  },
  {
    language: "kotlin",
    title: "Kotlin",
    code: `package co.plutosystems.sandbox

const val BUDGET: Long = 30_000_000_000

// A run and the fuel it spent.
@JvmInline
value class Fuel(val spent: Long)

data class Run(val name: String, val fuel: Fuel = Fuel(0)) {
    fun left(): Long = BUDGET - fuel.spent
    override fun toString(): String = "\${name}: \${left()} left\\n"
}

fun main() = println(Run("darts", Fuel(4_810_000_000)).left() > 0 || false)`,
  },
  {
    language: "swift",
    title: "Swift",
    code: `import Foundation

/// A run and the fuel it spent.
struct Run: CustomStringConvertible {
    static let budget: UInt64 = 30_000_000_000
    let name: String
    var fuel: UInt64 = 0
    var description: String { "\\(name): \\(Self.budget - fuel) left\\n" }

    @available(*, deprecated, message: "use description")
    func summary() -> String { description }
}

let runs = [Run(name: "darts", fuel: 4_810_000_000), Run(name: "sudoku")]
print(runs.map { $0.description }.joined(), runs.count, nil as Int?)`,
  },
  {
    language: "svelte",
    title: "Svelte",
    code: `<script lang="ts">
  import { Meter } from "$lib/ui/meter";

  // A fuel line: a typed prop, a rune, a derived label.
  let { value = 0, max = 30 }: { value?: number; max?: number } = $props();
  const label = $derived(\`\${value} billion of \${max}\`);
  let open = $state(false);
</script>

<div class="fuel" onclick={() => (open = !open)}>
  <Meter {value} {max} aria-label="Fuel" />
  {#if open}
    <span>{label}</span>
  {/if}
</div>`,
  },
  {
    language: "diff",
    title: "diff",
    code: `diff --git a/sudoku.py b/sudoku.py
index 3f2a1c0..9b7d4e2 100644
--- a/sudoku.py
+++ b/sudoku.py
@@ -4,7 +4,7 @@ cells = [int(c) for c in puzzle]
 def ok(i, d):
     r, c = divmod(i, 9)
-    box = 27 * (r // 3) + 3 * (c // 3)
+    box = 27 * (r // 3) + 3 * (c // 3)  # the first cell of the box
     return all(cells[9 * r + k] != d for k in range(9))`,
  },
  {
    language: "docker",
    title: "Dockerfile",
    code: `# The sandbox image: Python 3.13 on a slim base.
FROM python:3.13-slim AS base

ARG FUEL=30000000000
ENV FUEL=\${FUEL} \\
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY examples/ ./examples/
EXPOSE 8080
ENTRYPOINT ["python", "-m", "sandbox"]
CMD ["--verbose"]`,
  },
];
