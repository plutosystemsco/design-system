/**
 * 023a: where a TypeScript type may break across lines in the API table.
 * The table puts a hidden <wbr> between the pieces, so a long type wraps
 * at its punctuation and never inside a name.
 *
 * A break goes:
 * - after `|`, `<`, `,`, `&` and `=>`;
 * - after `(`, unless `)` follows, so `()` stays whole;
 * - after a `.` that starts a name (`Tooltip.`/`Content`), but not in a
 *   number (`0.5`) or a spread (`...rest`);
 * - before `[`, unless `]` follows or white space precedes it, so `[]`
 *   stays whole and no piece is only white space.
 *
 * Nothing inside a string literal (`"a.b"`) is split.
 */
const BREAK =
  /(?<=[|<,&]|=>|\((?!\)))|(?<=(?<!\.)\.)(?=[A-Za-z_$])|(?<!\s)(?=\[(?!\]))/;

/** A string literal: double, single or back quotes, with escapes. */
const LITERAL = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/;

/** The type's pieces, in order; joined, they are the type again. */
export function typePieces(type: string): string[] {
  const out: string[] = [];
  type.split(LITERAL).forEach((part, i) => {
    // Odd parts are literals: each joins the piece before it, whole.
    const parts = i % 2 ? [part] : part.split(BREAK);
    parts.forEach((p, k) => {
      if (k === 0 && out.length) out[out.length - 1] += p;
      else out.push(p);
    });
  });
  return out.filter((p, k) => p !== "" || k === 0);
}
