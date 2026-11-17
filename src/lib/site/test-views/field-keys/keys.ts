/**
 * 020 tests 7 and 8: the old context keys, as a 0.11.0 item set and read
 * them. The view `/view/field-keys/` puts each under or over a 0.13.0 item.
 * A test fixture, never installed; it goes in 0.14.0 with the old keys.
 */
export const OLD = {
  field: "pluto:field",
  fieldSet: "pluto:field-set",
  fieldLabel: "pluto:field-label",
  tooltip: "pluto:tooltip",
  itemGroup: "pluto:item-group",
  accordionItem: "pluto:accordion-item",
} as const;

/** A field context as a 0.11.0 `Field` gave it, invalid, with both ids. */
export function oldField(id: string) {
  return {
    id,
    descriptionId: `${id}-description`,
    errorId: `${id}-error`,
    invalid: true,
    describedBy: `${id}-description ${id}-error`,
  };
}

/** A set context as a 0.11.0 `FieldSet` gave it, with its legend. */
export function oldFieldSet(id: string) {
  return {
    ...oldField(id),
    legendId: `${id}-legend`,
    legend: `${id}-legend`,
    registerLegend() {},
  };
}

/** The readers of test 7, each under an old `field`. */
export const READERS = [
  "input",
  "textarea",
  "checkbox",
  "switch",
  "native-select",
  "input-otp",
  "input-group-password",
] as const;

/** What a reading child writes: the context's id, or "set", or "". */
export const idOf = (c: unknown) =>
  c && typeof c === "object" && "id" in c ? String(c.id) : "";
export const isSet = (c: unknown) =>
  c === undefined || c === null ? "" : c === true ? "true" : "set";
export const triggerIdOf = (c: unknown) =>
  c && typeof c === "object" && "triggerId" in c ? String(c.triggerId) : "";
