/**
 * The benchmark's targets: the eight systems the scorecard compares, and
 * where each one's pages live. Read by `site.ts`, `depth.ts` and
 * `breadth.ts`. See `context/research/benchmark-scorecard.md`.
 *
 * The reference sites move their pages. When a URL 404s or a selector finds
 * nothing, fix it here, note the date in the scorecard's run log, and re-run.
 *
 * `KUIPER` is the placeholder origin for this repository's own site. The
 * scripts swap it for a static server over `build/` (gzipped, as the perf
 * suite serves it), so Kuiper is measured as built, not as the dev server.
 */

export const KUIPER = "kuiper:";

export type Target = {
  /** Short id, used in output rows. */
  id: string;
  name: string;
  /** The Button page (the page every system has), at 1440 and 390. */
  button: string;
  /**
   * A Playwright locator for where the first live example's pixels start on
   * the Button page: the stage or preview, not the card around it. `null` when the page has no live example (pictures only); the
   * scorecard then reads the first picture of the part from the screenshot.
   */
  example: string | null;
  /**
   * Every page of the Button docs (tabs are separate URLs on some sites),
   * and the same for one overlay component, for the depth scan.
   */
  depth: { button: string[]; overlay: string[] };
  /** The component index, and the pattern a component link matches. */
  index: { url: string; slug: RegExp; drop?: RegExp } | null;
};

const p = (path: string) => KUIPER + path;

export const TARGETS: Target[] = [
  {
    id: "kuiper",
    name: "Kuiper 0.13",
    button: p("/components/button/"),
    example: '[data-slot="frame-stage"]',
    depth: {
      button: [p("/components/button/")],
      overlay: [p("/components/dialog/")],
    },
    index: null, // read from registry.json by breadth.ts
  },
  {
    id: "carbon",
    name: "Carbon",
    button:
      "https://carbondesignsystem.com/building-blocks/core/components/button/guidelines",
    example: "iframe.carbon-mdx-components--iframe",
    depth: {
      button: [
        "https://carbondesignsystem.com/building-blocks/core/components/button/guidelines",
        "https://carbondesignsystem.com/building-blocks/core/components/button/style",
        "https://carbondesignsystem.com/building-blocks/core/components/button/code",
        "https://carbondesignsystem.com/building-blocks/core/components/button/accessibility",
      ],
      overlay: [
        "https://carbondesignsystem.com/building-blocks/core/components/modal/guidelines",
        "https://carbondesignsystem.com/building-blocks/core/components/modal/style",
        "https://carbondesignsystem.com/building-blocks/core/components/modal/code",
        "https://carbondesignsystem.com/building-blocks/core/components/modal/accessibility",
      ],
    },
    index: {
      url: "https://carbondesignsystem.com/building-blocks/core/components/overview/components",
      slug: /\/building-blocks\/core\/components\/([a-z0-9-]+)\/?$/,
      drop: /^overview$/,
    },
  },
  {
    id: "material",
    name: "Material 3",
    button: "https://m3.material.io/components/buttons/overview",
    example: null,
    depth: {
      button: [
        "https://m3.material.io/components/buttons/overview",
        "https://m3.material.io/components/buttons/specs",
        "https://m3.material.io/components/buttons/guidelines",
        "https://m3.material.io/components/buttons/accessibility",
      ],
      overlay: [
        "https://m3.material.io/components/dialogs/overview",
        "https://m3.material.io/components/dialogs/specs",
        "https://m3.material.io/components/dialogs/guidelines",
        "https://m3.material.io/components/dialogs/accessibility",
      ],
    },
    index: {
      url: "https://m3.material.io/components",
      slug: /\/components\/([a-z0-9-]+)(?:\/overview)?\/?$/,
    },
  },
  {
    id: "spectrum",
    name: "Spectrum 2",
    button: "https://spectrum.adobe.com/web/rsp/components/button",
    example: ".playground",
    depth: {
      button: ["https://spectrum.adobe.com/web/rsp/components/button"],
      overlay: [
        "https://spectrum.adobe.com/web/rsp/components/standard-dialog",
      ],
    },
    index: {
      url: "https://spectrum.adobe.com/web/rsp/components/button",
      slug: /\/web\/(?:rsp|design-only)\/components\/([a-z0-9-]+)\/?$/,
    },
  },
  {
    id: "atlassian",
    name: "Atlassian",
    button: "https://atlassian.design/components/button/examples",
    example: 'button:has-text("Default button")',
    depth: {
      button: [
        "https://atlassian.design/components/button/examples",
        "https://atlassian.design/components/button/code",
        "https://atlassian.design/components/button/usage",
        "https://atlassian.design/components/button/changelog",
      ],
      overlay: [
        "https://atlassian.design/components/modal-dialog/examples",
        "https://atlassian.design/components/modal-dialog/code",
        "https://atlassian.design/components/modal-dialog/usage",
        "https://atlassian.design/components/modal-dialog/changelog",
      ],
    },
    index: {
      url: "https://atlassian.design/components",
      slug: /\/components\/([a-z0-9-]+)\/?$/,
      // Packages and tooling listed beside the components.
      drop: /^(eslint-plugin-.*|stylelint-.*|storybook-addon-.*|css|css-reset|tokens|entry-points|app-provider|motion|popper|portal|pragmatic-drag-and-drop|primitives|visually-hidden|focus-ring|grid|page|page-layout|logo|icon|image|object)$/,
    },
  },
  {
    id: "primer",
    name: "Primer",
    button: "https://primer.style/product/components/button/",
    example: '[class*="ComponentExample__preview"]',
    depth: {
      button: [
        "https://primer.style/product/components/button/",
        "https://primer.style/product/components/button/guidelines/",
        "https://primer.style/product/components/button/accessibility/",
      ],
      overlay: [
        "https://primer.style/product/components/dialog/",
        "https://primer.style/product/components/dialog/guidelines/",
        "https://primer.style/product/components/dialog/accessibility/",
      ],
    },
    index: {
      url: "https://primer.style/product/components/",
      slug: /\/product\/components\/([a-z0-9-]+)\/?$/,
    },
  },
  {
    id: "radix",
    name: "Radix Themes",
    button: "https://www.radix-ui.com/themes/docs/components/button",
    example: '[class*="CodeBlockLivePreview"]',
    depth: {
      button: ["https://www.radix-ui.com/themes/docs/components/button"],
      overlay: ["https://www.radix-ui.com/themes/docs/components/dialog"],
    },
    index: {
      url: "https://www.radix-ui.com/themes/docs/components/button",
      slug: /\/themes\/docs\/components\/([a-z0-9-]+)\/?$/,
    },
  },
  {
    id: "govuk",
    name: "GOV.UK",
    button: "https://design-system.service.gov.uk/components/button/",
    example: ".app-example__frame",
    depth: {
      button: [
        "https://design-system.service.gov.uk/components/button/",
        "https://design-system.service.gov.uk/components/button/nunjucks/",
        "https://design-system.service.gov.uk/components/button/history/",
      ],
      // GOV.UK has no dialog; its error summary is its most stateful part.
      overlay: [
        "https://design-system.service.gov.uk/components/error-summary/",
        "https://design-system.service.gov.uk/components/error-summary/nunjucks/",
        "https://design-system.service.gov.uk/components/error-summary/history/",
      ],
    },
    index: {
      url: "https://design-system.service.gov.uk/components/",
      slug: /\/components\/([a-z0-9-]+)\/?$/,
    },
  },
];

/**
 * The reference list for breadth: 40 parts most systems name, each with the
 * slugs that count as it. A system covers a part when any slug matches.
 * Kept framework-neutral; changing it changes every score, so date it.
 */
export const REFERENCE_PARTS: [string, RegExp][] = [
  ["accordion", /^(accordion|details|collapsible|disclosure|expandable)/],
  [
    "alert / banner",
    /^(alert|banner|callout|inline-message|section-message|notification|inline-notification|alert-banner|inline-alert|notification-banner)$/,
  ],
  ["avatar", /^avatar/],
  [
    "badge / label",
    /^(badge|badges|lozenge|label|counter-label|state-label|status-light|status|circle-badge)$/,
  ],
  ["breadcrumbs", /^breadcrumbs?$/],
  ["button", /^(button|buttons|all-buttons)$/],
  ["button group", /^(button-groups?|split-button|menu-buttons)$/],
  ["card / tile", /^(cards?|tile|tiles)$/],
  ["checkbox", /^checkbox(es)?$/],
  [
    "combobox / autocomplete",
    /^(combo-?box|autocomplete|text-input-with-tokens)$/,
  ],
  [
    "date picker",
    /^(date-?pickers?|datetime-picker|date-input|calendar|date-field)$/,
  ],
  [
    "dialog / modal",
    /^(dialogs?|modal|modal-dialog|alert-dialog|confirmation-dialog)$/,
  ],
  [
    "drawer / sheet",
    /^(drawer|sheet|side-sheets|bottom-sheets|tray|ui-shell-right-panel)$/,
  ],
  ["menu", /^(menu|menus|dropdown-menu|action-menu|context-menu)$/],
  ["empty state", /^(empty|empty-state|blankslate|illustrated-message)$/],
  ["file upload", /^(file-upload|file-uploader|drop-zone|file-trigger)$/],
  ["form field", /^(field|form|form-control|fieldset|form-field|field-label)$/],
  ["link", /^link$/],
  [
    "list",
    /^(list|lists|item|contained-list|structured-list|data-list|action-list|list-view|summary-list)$/,
  ],
  [
    "spinner / loading",
    /^(spinner|loading|loading-indicator|inline-loading|progress-circle)$/,
  ],
  ["progress / meter", /^(progress-bar|progress-indicators|meter|progress)$/],
  [
    "side navigation",
    /^(sidebar|side-navigation|nav-list|navigation-drawer|navigation-rail|ui-shell-left-panel|side-nav)$/,
  ],
  ["pagination", /^pagination$/],
  [
    "popover",
    /^(popover|popup|inline-dialog|toggletip|hover-card|contextual-help|overlay|anchored-overlay)$/,
  ],
  ["radio", /^(radio|radio-button|radio-group|radios)$/],
  ["search", /^(search|search-input|search-field)$/],
  [
    "segmented control",
    /^(segmented-control|segmented-buttons|content-switcher|toggle-group)$/,
  ],
  ["select", /^(select|native-select|dropdown|picker|simple-select)$/],
  ["separator", /^(separator|divider)$/],
  ["skeleton", /^(skeleton|skeleton-box|skeleton-text)$/],
  ["slider", /^(slider|sliders|range)$/],
  ["number input", /^(number-input|number-field|stepper)$/],
  ["switch", /^(switch|toggle|toggle-switch)$/],
  ["table", /^(table|data-table|dynamic-table|table-view)$/],
  ["tabs", /^(tabs|underline-panels|tab-list)$/],
  [
    "text input",
    /^(input|text-input|textfield|text-field|text-fields|text-input)$/,
  ],
  ["textarea", /^(textarea|text-area)$/],
  ["toast / snackbar", /^(toast|snackbar|flag|toast-container|notification)$/],
  ["tooltip", /^(tooltips?)$/],
  ["tag / chip", /^(tag|tags|chips?|token|tag-group)$/],
];
