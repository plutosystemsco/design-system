/**
 * A long example: 40 lines of 180 characters, 7,240 in all. A fresh state
 * parses its first 3,000 characters at once and the rest in idle time, so the
 * roles plugin must rebuild when the tree grows (the change review's finding
 * 1). Every line holds a built-in call.
 */
export const LONG = Array.from({ length: 40 }, (_, i) => {
  const head = `print("line ${String(i + 1).padStart(2, "0")}", len(items), sorted(items)[0])  # `;
  const filler =
    "the parser reaches this line in idle time, after the first chunk; ";
  return head + filler.repeat(4).slice(0, 180 - head.length - 1) + ".";
}).join("\n");

/** The edge cases of the roles plugin (the change review's findings 2 and 3). */
export const EDGE = `#!/usr/bin/env python
"""A docstring after a shebang."""

def noted():  # a comment on the def line
    """A docstring after a comment."""
    return f(type="x", id=3)

runs = sorted(items, key=len)`;

/** A short example for the states and the keyboard fixture. */
export const SHORT = `greeting = "hello"
print(greeting.upper())`;
