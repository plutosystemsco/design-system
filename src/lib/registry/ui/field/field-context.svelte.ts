import { getContext, setContext } from "svelte";

/**
 * The field context. `Field` and `FieldSet` set it in their
 * script, before their children render, so the wiring is in the server HTML.
 *
 * Controls read it by this string key with `getContext`, without importing
 * this file, so a control installs without `field`. The key and the shape are
 * the contract.
 */
export const FIELD_CONTEXT_KEY = "pluto:field";

export type FieldContext = {
  /** The control's id: the container's `id` prop, else an id from `$props.id()`. */
  readonly id: string;
  /** `${id}-description` */
  readonly descriptionId: string;
  /** `${id}-error` */
  readonly errorId: string;
  /** The `invalid` prop, else true exactly when `error` is given. */
  readonly invalid: boolean;
  /** The ids of the description and the error this render contains, space-separated. */
  readonly describedBy: string | undefined;
};

export function setFieldContext(context: FieldContext): FieldContext {
  return setContext(FIELD_CONTEXT_KEY, context);
}

export function getFieldContext(): FieldContext | undefined {
  return getContext<FieldContext | undefined>(FIELD_CONTEXT_KEY);
}

/**
 * `FieldLabel` points `for` at the control of the nearest `Field`. A
 * `FieldSet` names its group with its legend instead, so it clears this key
 * for the labels inside it that sit outside any `Field`.
 */
const LABEL_TARGET_KEY = "pluto:field-label";

export function setLabelTarget(
  target: { readonly id: string } | undefined,
): void {
  setContext(LABEL_TARGET_KEY, target);
}

export function getLabelTarget(): { readonly id: string } | undefined {
  return getContext<{ readonly id: string } | undefined>(LABEL_TARGET_KEY);
}

/** Builds the context from the container's props, read through getters so it follows them. */
export function fieldContext(props: {
  readonly id: string;
  readonly invalid: boolean | undefined;
  readonly hasDescription: boolean;
  readonly hasError: boolean;
}): FieldContext {
  return {
    get id() {
      return props.id;
    },
    get descriptionId() {
      return `${props.id}-description`;
    },
    get errorId() {
      return `${props.id}-error`;
    },
    get invalid() {
      return props.invalid ?? props.hasError;
    },
    get describedBy() {
      const ids = [
        props.hasDescription ? `${props.id}-description` : undefined,
        props.hasError ? `${props.id}-error` : undefined,
      ].filter(Boolean);
      return ids.length ? ids.join(" ") : undefined;
    },
  };
}

/**
 * The set context. A `FieldSet` describes its own `<fieldset>` with its description and error,
 * and gives the same wiring, under this separate key, only to a group control
 * that asks for it: the radio group. A checkbox never reads it, so two
 * checkboxes in a set never share an id. `FieldLegend` records its id here, so
 * the group control can name itself by the legend.
 */
export const FIELD_SET_CONTEXT_KEY = "pluto:field-set";

export type FieldSetContext = FieldContext & {
  /** `${id}-legend`, the id a `FieldLegend` takes unless the app gives one. */
  readonly legendId: string;
  /** The id of the legend this set renders, once a `FieldLegend` has registered. */
  readonly legend: string | undefined;
  /** Called by `FieldLegend` in its script, before the group control renders. */
  registerLegend(id: () => string | undefined): void;
};

export function setFieldSetContext(context: FieldSetContext): FieldSetContext {
  return setContext(FIELD_SET_CONTEXT_KEY, context);
}

export function getFieldSetContext(): FieldSetContext | undefined {
  return getContext<FieldSetContext | undefined>(FIELD_SET_CONTEXT_KEY);
}
