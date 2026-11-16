<script lang="ts">
  import * as buttons from "#lib/site/examples/pagination/buttons.svelte";
  import * as doSteps from "#lib/site/examples/pagination/do-steps.svelte";
  import * as doUrls from "#lib/site/examples/pagination/do-urls.svelte";
  import * as dontSteps from "#lib/site/examples/pagination/dont-steps.svelte";
  import * as dontUrls from "#lib/site/examples/pagination/dont-urls.svelte";
  import * as ends from "#lib/site/examples/pagination/ends.svelte";
  import * as inAFooter from "#lib/site/examples/pagination/in-a-footer.svelte";
  import * as links from "#lib/site/examples/pagination/links.svelte";
  import * as narrow from "#lib/site/examples/pagination/narrow.svelte";
  import * as small from "#lib/site/examples/pagination/small.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component
  name="pagination"
  examples={{
    links,
    buttons,
    "in-a-footer": inAFooter,
    ends,
    narrow,
    small,
  }}
>
  {#snippet when()}
    <p>
      Use pagination for a long list or table split into pages that a person
      moves between. Give each page a URL when it has one, and every page is a
      link. Not for a form's steps, which move on with the form's Continue, and
      not for a feed read to its end, which loads more in place.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Pass <code>href</code> whenever a page has a URL. {doUrls.meta.caption}
      <div
        data-pair="urls"
        data-pair-kind="do"
        class="mt-2 rounded bg-card p-4"
      >
        <doUrls.default />
      </div>
    </li>
    <li>
      Use it for pages of results. {doSteps.meta.caption}
      <div
        data-pair="steps"
        data-pair-kind="do"
        class="mt-2 rounded bg-card p-4"
      >
        <doSteps.default />
      </div>
    </li>
    <li>
      In a row beside other content, such as a table footer's count, give the
      pager the remaining width with <code>flex-1</code>. It measures its own
      width to choose between the page list and "Page 5 of 12".
    </li>
  {/snippet}
  {#snippet donts()}
    <li>
      Page with buttons when the pages have URLs. {dontUrls.meta.breaks}
      <div
        data-pair="urls"
        data-pair-kind="dont"
        inert
        class="mt-2 rounded bg-card p-4"
      >
        <dontUrls.default />
      </div>
    </li>
    <li>
      Use it for a form's steps. {dontSteps.meta.breaks}
      <div
        data-pair="steps"
        data-pair-kind="dont"
        inert
        class="mt-2 rounded bg-card p-4"
      >
        <dontSteps.default />
      </div>
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      <strong>What Kuiper provides.</strong>
      <ul class="mt-2 grid list-disc gap-1 ps-5">
        <li>
          A <code>nav</code> named "Pagination", holding links (Previous with
          <code>rel="prev"</code>, Next with <code>rel="next"</code>) or
          buttons.
        </li>
        <li>
          The current page has <code>aria-current="page"</code>, a border and a
          bold weight, so it is marked by shape as well as colour. Each page is
          named "Page N", and the ends "Previous page" and "Next page".
        </li>
        <li>
          Tab reaches Previous, each page and Next; there are no arrow keys. The
          ellipsis and the omitted ends are not stops, and are never spoken.
        </li>
        <li>
          In button mode, focus stays on the page you pressed. If the control
          you pressed is gone, at the first or last page, focus moves to the
          current page, or, when narrow, to the other end control.
        </li>
        <li>
          In button mode, a hidden status says "Page 6 of 12" after each press,
          since focus does not move.
        </li>
      </ul>
    </li>
    <li>
      <strong>Your part.</strong>
      <ul class="mt-2 grid list-disc gap-1 ps-5">
        <li>
          In link mode, put the page number in the page's title, so the new page
          says where you are.
        </li>
        <li>Give each page a URL when it has one: pass <code>href</code>.</li>
        <li>
          In a row beside other content, give the pager the remaining width (<code
            >flex-1</code
          >).
        </li>
        <li>
          If you replace <code>strings</code>, check the row at your widths:
          longer words may need more room than the English row.
        </li>
        <li>
          With more than one pager on a page, name each with
          <code>aria-label</code>.
        </li>
        <li>
          If your app replaces the list or table with the new page, move focus
          to it.
        </li>
      </ul>
    </li>
  {/snippet}
</Component>
