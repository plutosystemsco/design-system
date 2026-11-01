<script lang="ts">
  import BlockPage from "#lib/preview/block-page.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<BlockPage name="app-shell" files={data.files}>
  {#snippet accessibility()}
    <li>
      A skip link, "Skip to main content", first in <code>body</code>: hidden
      until it has focus, then a box at the top start corner. Enter moves focus
      to <code>main</code>, which has <code>id="main"</code> and
      <code>tabindex="-1"</code>.
    </li>
    <li>
      Landmarks: the header is the <code>banner</code>; the primary links sit in
      a <code>nav</code> named "Primary" (with a sidebar, the sidebar's
      <code>nav</code> "Main" holds them instead); one <code>main</code>; the
      footer is the <code>contentinfo</code>. The shell renders no
      <code>h1</code>: the page does.
    </li>
    <li>
      The lockup plays the page's one entrance, the four dots docking over 900
      ms, once per full document load: SvelteKit keeps the layout's lockup
      across client-side navigation. Under reduced motion the composed mark
      shows before any frame. A page that breaks out of the layout with
      <code>+page@.svelte</code>, a route in another layout group, or a
      <code>{"{#key}"}</code> around the layout's content would replay it.
    </li>
    <li>
      The header's row is 64 px, grooved on its bottom edge; the lockup is the
      home link, named by <code>APP_NAME</code>. Below <code>md</code> the links fold
      into a sheet opened by a 32 px "Menu" button that says it opens a dialog; Escape
      returns focus to it. Not sticky by default; with a sidebar it is sticky, since
      the sidebar beside it is.
    </li>
    <li>
      The account menu is a 24 px avatar in a 32 px button named "Account menu",
      holding the name and email as a heading, then Settings and Sign out as
      links. With a sidebar the account row sits in the sidebar's footer and
      opens the same menu.
    </li>
    <li>
      The footer's rows are mono furniture: <code>commit</code>,
      <code>built</code> (a <code>time</code> with its ISO date),
      <code>doc</code> and <code>source</code>, each only when its value is
      given, so every page carries its build date. The brand line beside the
      lockup is "Work runs on data."; pass <code>tagline=""</code> to show none. The
      lockup here is not a link: the header's is.
    </li>
    <li>
      A doc ID is <code>PS-&lt;series&gt;-&lt;NNNN&gt;</code>: a series is one
      counter with its own short code (<code>DS</code> is this registry's specifications).
      The footer shows the string it is given.
    </li>
    <li>
      The <code>statement</code> prop renders one plain sentence under the rows and
      is empty by default. An app that wants a sentence under the rows, such as "Pluto
      Systems is a public benefit corporation.", passes it.
    </li>
  {/snippet}
  {#snippet setup()}
    <li>
      Move <code>+layout.svelte</code> and <code>+layout.server.ts</code> to
      <code>src/routes/</code>, and first replace <code>LINKS</code> and the
      sidebar's hrefs with your own routes: an anchor such as
      <code>#overview</code> in a root layout fails the prerender of every page that
      has no such id.
    </li>
    <li>
      Edit the constants at the top of the layout: <code>APP_NAME</code>,
      <code>LINKS</code>, <code>SIDEBAR</code> (<code>false</code>,
      <code>"offcanvas"</code> or <code>"icon"</code>), <code>STICKY</code>,
      <code>USER</code> and <code>FOOTER</code>. The server load reads the
      sidebar's cookie, so the first paint is right.
    </li>
    <li>
      The footer's commit and date come from your <code>vite.config.ts</code>,
      guarded so a build without git still passes:
      <pre
        class="mt-2 rounded bg-muted px-4 py-3 font-mono text-xs wrap-anywhere whitespace-pre-wrap text-foreground"><code
          >{`import { execSync } from "node:child_process";

function git(args: string): string | undefined {
  try {
    const out = execSync("git " + args, { stdio: ["ignore", "pipe", "ignore"] });
    return out.toString().trim() || undefined;
  } catch {
    return undefined;
  }
}

const name =
  process.env.WORKERS_CI_COMMIT_SHA?.slice(0, 7) ?? git("rev-parse --short HEAD");
const builtAt = git("log -1 --format=%cI");
if (builtAt) process.env.VITE_BUILT_AT = builtAt;

export default defineConfig({
  plugins: [
    sveltekit({ adapter: adapter(), ...(name ? { version: { name } } : {}) }),
  ],
});`}</code
        ></pre>
      The layout reads<code>version</code> from <code>$app/env</code>
      (SvelteKit 3's module; SvelteKit 2.70 carries it too) and shows it only when
      it is not all digits: without git and without the host's variable the name is
      SvelteKit's default, a timestamp, and the footer shows no commit row and no
      built row. <code>VITE_BUILT_AT</code> is the commit's own date, so a rebuild
      of one commit is byte-identical.
    </li>
    <li>
      With <code>STICKY</code> set, add one line to your <code>app.css</code>
      so an anchor lands below the header:
      <code>{"html { scroll-padding-top: 4rem }"}</code>. The same line applies
      with a sidebar, whose header is always sticky.
    </li>
  {/snippet}
</BlockPage>
