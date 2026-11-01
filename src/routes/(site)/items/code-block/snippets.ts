/**
 * The code-block page's snippets. They live beside `+page.server.ts`, which
 * SvelteKit allows to export only its load options.
 */
/** An install snippet, in bash. */
export const INSTALL = `# Python 3.13 in a WebAssembly sandbox
pip install pluto-sandbox`;

/** A 25-line sudoku solver. */
export const SUDOKU = `# Solve a sudoku by backtracking (pure Python).
puzzle = "530070000600195000098000060800060003400803001700020006060000280000419005000080079"
cells = [int(c) for c in puzzle]

def ok(i, d):
    r, c = divmod(i, 9)
    box = 27 * (r // 3) + 3 * (c // 3)
    return all(cells[9 * r + k] != d and cells[9 * k + c] != d and
               cells[box + 9 * (k // 3) + k % 3] != d for k in range(9))

def solve():
    if 0 not in cells:
        return True
    i = cells.index(0)
    for d in range(1, 10):
        if ok(i, d):
            cells[i] = d
            if solve():
                return True
    cells[i] = 0
    return False

solve()
for r in range(9):
    print(" ".join(str(d) for d in cells[9 * r:9 * r + 9]))`;

/** A diff: the third line removed, the fourth added. */
export const DIFF = `def ok(i, d):
    r, c = divmod(i, 9)
    box = 27 * (r // 3) + 3 * (c // 3)
    box = 27 * (r // 3) + 3 * (c // 3)  # the first cell of the 3 by 3 box
    return all(cells[9 * r + k] != d for k in range(9))`;

/** A long line, for the wrap state. */
export const LONG = `print(" ".join(str(d) for d in cells[9 * r:9 * r + 9]), " ".join(str(d) for d in cells[9 * (r + 1):9 * (r + 1) + 9]))`;
