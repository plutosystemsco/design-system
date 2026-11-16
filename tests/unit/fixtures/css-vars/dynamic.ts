// 023 test 6: a dynamic name with no declared prefix.
export const nope = (x: string) => "var(--nope-" + x + ")";
