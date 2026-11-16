/** The projects the search field's examples filter: three hold "des", twelve "de". */
export const PROJECTS = [
  "Design system",
  "Design review",
  "Designer onboarding",
  "Deploy pipeline",
  "Developer portal",
  "Decision log",
  "Dependency audit",
  "Delivery tracker",
  "Code review",
  "Order history",
  "Video editor",
  "Model registry",
  "Billing",
  "Mobile app",
  "Analytics",
  "Pricing page",
];

/** The projects whose name holds `query`, ignoring case. */
export function matching(query: string): string[] {
  const q = query.trim().toLowerCase();
  return PROJECTS.filter((p) => p.toLowerCase().includes(q));
}

/** A count as a person reads it: "No results", "1 result", "3 results". */
export function countOf(n: number): string {
  return n === 0 ? "No results" : n === 1 ? "1 result" : `${n} results`;
}
