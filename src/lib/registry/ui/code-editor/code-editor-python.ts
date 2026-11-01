import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { pythonLanguage } from "@codemirror/lang-python";
import {
  bracketMatching,
  indentOnInput,
  syntaxTree,
} from "@codemirror/language";
import { Prec, RangeSetBuilder, type Extension } from "@codemirror/state";
import {
  Decoration,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
  ViewPlugin,
  type DecorationSet,
  type ViewUpdate,
} from "@codemirror/view";
import { styleTags, tags } from "@lezer/highlight";
import { codeHighlight } from "./code-editor-theme";

/**
 * Python's grammar, taught the four roles it lacks: a
 * decorator's name, an annotation, a parameter and an f-string's braces.
 * `styleTags` matches a node by its ancestry, and the rules combine with the
 * grammar's own, so a call's or a definition's name keeps its tag and a brace
 * outside an f-string stays a brace. An app that opens Python through
 * `code-languages` gets this language too.
 */
export const pythonLanguageConfigured = pythonLanguage.configure({
  props: [
    styleTags({
      "Decorator/VariableName": tags.annotation,
      "Decorator/MemberExpression/PropertyName": tags.annotation,
      "TypeDef/VariableName": tags.typeName,
      "TypeDef/MemberExpression/PropertyName": tags.typeName,
      "ParamList/VariableName": tags.local(tags.variableName),
      "FormatReplacement/{ FormatReplacement/}": tags.special(tags.brace),
    }),
  ],
});

/**
 * The 71 names of Python 3.13's `builtins` module that are functions or
 * types (the "Built-in Functions" table of the 3.13 library reference),
 * sorted. Exceptions and constants are not here: `None`, `True` and `False`
 * are the grammar's own nodes.
 */
const PYTHON_BUILTINS = new Set([
  "__import__",
  "abs",
  "aiter",
  "all",
  "anext",
  "any",
  "ascii",
  "bin",
  "bool",
  "breakpoint",
  "bytearray",
  "bytes",
  "callable",
  "chr",
  "classmethod",
  "compile",
  "complex",
  "delattr",
  "dict",
  "dir",
  "divmod",
  "enumerate",
  "eval",
  "exec",
  "filter",
  "float",
  "format",
  "frozenset",
  "getattr",
  "globals",
  "hasattr",
  "hash",
  "help",
  "hex",
  "id",
  "input",
  "int",
  "isinstance",
  "issubclass",
  "iter",
  "len",
  "list",
  "locals",
  "map",
  "max",
  "memoryview",
  "min",
  "next",
  "object",
  "oct",
  "open",
  "ord",
  "pow",
  "print",
  "property",
  "range",
  "repr",
  "reversed",
  "round",
  "set",
  "setattr",
  "slice",
  "sorted",
  "staticmethod",
  "str",
  "sum",
  "super",
  "tuple",
  "type",
  "vars",
  "zip",
]);

// The three utilities already exist, so the editor and the block paint one
// colour from one place; the literals here put the classes in Tailwind's scan.
const selfMark = Decoration.mark({ class: "text-code-self" });
const builtinMark = Decoration.mark({ class: "text-code-builtin" });
const docstringMark = Decoration.mark({ class: "text-code-comment" });

/** A name the grammar tags another way: a parameter, an annotation, a decorator. */
const TAGGED_PARENTS = new Set(["ParamList", "TypeDef", "Decorator"]);

/**
 * The roles plugin: marks what no tag can name. `self` and
 * `cls`, callee or bare, take `text-code-self`; a built-in's name, callee or
 * bare, `text-code-builtin`; a string that is the first statement of the
 * script, a class body or a function body is a docstring and reads as a
 * comment. A `VariableName` has no node of its own for these, and
 * `styleTags` matches ancestry, not text or position, so the tree is walked
 * over the visible ranges instead.
 */
export const pythonRoles = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    /** The tree the marks were built from: a fresh state parses its first 3,000 characters at once and the rest in idle time, which arrives as a new tree with no document or viewport change. */
    tree: ReturnType<typeof syntaxTree>;

    constructor(view: EditorView) {
      this.tree = syntaxTree(view.state);
      this.decorations = roles(view, this.tree);
    }

    update(update: ViewUpdate) {
      const tree = syntaxTree(update.state);
      if (update.docChanged || update.viewportChanged || tree !== this.tree) {
        this.tree = tree;
        this.decorations = roles(update.view, tree);
      }
    }
  },
  { decorations: (plugin) => plugin.decorations },
);

function roles(
  view: EditorView,
  tree: ReturnType<typeof syntaxTree>,
): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const doc = view.state.doc;
  for (const { from, to } of view.visibleRanges) {
    tree.iterate({
      from,
      to,
      enter: (ref) => {
        if (ref.name === "VariableName") {
          const text = doc.sliceString(ref.from, ref.to);
          // `self` and `cls` wherever they stand, the parameter included.
          if (text === "self" || text === "cls") {
            builder.add(ref.from, ref.to, selfMark);
            return;
          }
          // A built-in's name, unless the grammar's own rule has it (a
          // parameter, an annotation, a decorator) or it is a keyword
          // argument's name, which stays in the body on both engines.
          const node = ref.node;
          const parent = node.parent;
          if (parent && TAGGED_PARENTS.has(parent.name)) return;
          if (
            parent?.name === "ArgList" &&
            node.nextSibling?.name === "AssignOp"
          )
            return;
          if (PYTHON_BUILTINS.has(text))
            builder.add(ref.from, ref.to, builtinMark);
        } else if (ref.name === "String" && isDocstring(ref.node)) {
          builder.add(ref.from, ref.to, docstringMark);
        }
      },
    });
  }
  return builder.finish();
}

/** True for a string that is the first statement of a script, a class body or a function body. */
function isDocstring(node: { parent: SyntaxNodeLike | null }): boolean {
  const statement = node.parent;
  if (!statement || statement.name !== "ExpressionStatement") return false;
  const scope = statement.parent;
  if (!scope) return false;
  if (scope.name === "Body") {
    const owner = scope.parent?.name;
    if (owner !== "ClassDefinition" && owner !== "FunctionDefinition")
      return false;
  } else if (scope.name !== "Script") return false;
  // A body's first child is its colon, and a comment is not a statement: a
  // shebang, a licence comment or a comment on the `def` line comes first.
  let first = scope.firstChild;
  while (first && (first.name === ":" || first.name === "Comment"))
    first = first.nextSibling;
  return first === null
    ? false
    : first.from === statement.from && first.to === statement.to;
}

/** The shape of a syntax node this file reads: its name, its bounds and its neighbours. */
type SyntaxNodeLike = {
  name: string;
  from: number;
  to: number;
  parent: SyntaxNodeLike | null;
  firstChild: SyntaxNodeLike | null;
  nextSibling: SyntaxNodeLike | null;
};

/**
 * The Python preset: line numbers, history, the default
 * keys, the configured language, the roles plugin, bracket closing and
 * matching, indent on input, the active line and the highlight from the code
 * tokens. About 130 KB gzipped with the component.
 *
 * `pythonLanguageConfigured`, not `python()`: completion is off, so its two
 * completion sources would be inert weight. Tab is not bound, so Tab leaves
 * the editor and there is no keyboard trap; `Mod-]` and `Mod-[` indent. The
 * roles plugin is wrapped in `Prec.highest`: the highlighter runs at
 * `Prec.high`, and CodeMirror nests overlapping marks with the highest
 * precedence innermost, where the inherited colour is decided, so at a lower
 * precedence the plugin's span would be the outer one and `print` would read
 * as a call. An app for another language writes its own preset beside this
 * one, or opens one through `code-languages`.
 */
export function pythonSetup(): Extension[] {
  return [
    lineNumbers(),
    history(),
    keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap]),
    pythonLanguageConfigured,
    Prec.highest(pythonRoles),
    closeBrackets(),
    bracketMatching(),
    indentOnInput(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    codeHighlight,
  ];
}
