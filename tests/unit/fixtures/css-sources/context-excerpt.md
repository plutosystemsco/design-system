<!-- 020a's fixture: a copy of line 77 of context/reviews/020-the-kuiper-rename-pr-2026-11-15.md. -->

- **Tailwind scans `context/`: confirmed.** EXECUTED: `.bg-fuchsia-950`, `.row-8` and `.row-15` are each in the built site CSS (`build/_app/immutable/assets/0.*.css`). None of the three appears in any file under `src/`. Each appears in two files under `context/`, among them now `020`'s own Landing notes. `src/app.css` has `@import "tailwindcss"` and no `@source` line. See finding 8.
