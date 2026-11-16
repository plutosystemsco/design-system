import { getContext, setContext } from "svelte";

/**
 * The field context. `Field` and `FieldSet` set it in their
 * script, before their children render, so the wiring is in the server HTML.
 *
 * Controls read it by this string key with `getContext`, without importing
 * this file, so a control installs without `field`. The key and the shape are
 * the contract.
 */
export const FIELD_CONTEXT_KEY = "kuiper:field";

/**
 * The 0.12.0 keys. `Field` and `FieldSet` set the context under these too,
 * so a control from before 0.13.0, or an app's own code that reads an old
 * key, still finds its field. They go in 0.14.0.
 */
const OLD_FIELD_CONTEXT_KEY = "pluto:field";
const OLD_FIELD_SET_CONTEXT_KEY = "pluto:field-set";
const OLD_LABEL_TARGET_KEY = "pluto:field-label";

/**
 * What a `Field` gives its control: the ids to wire and whether it is invalid.
 * Read it by the key, not by importing this file.
 */
export type FieldContext = {
  /** The control's id: the container's `id` prop, else an id from `$props.id()`. */
  readonly id: string;
  /** The description's id: `${id}-description`. */
  readonly descriptionId: string;
  /** The error's id: `${id}-error`. */
  readonly errorId: string;
  /** The `invalid` prop, else true exactly when `error` is given. */
  readonly invalid: boolean;
  /** The ids of the description and the error this render contains, space-separated. */
  readonly describedBy: string | undefined;
};

/**
 * Sets the field context, under the key and the old key, for the children about
 * to render. `Field` calls it; an app's own container may too.
 */
export function setFieldContext(context: FieldContext): FieldContext {
  setContext(OLD_FIELD_CONTEXT_KEY, context);
  return setContext(FIELD_CONTEXT_KEY, context);
}

/** The nearest `Field`'s context, or `undefined` outside one. */
export function getFieldContext(): FieldContext | undefined {
  return getContext<FieldContext | undefined>(FIELD_CONTEXT_KEY);
}

/**
 * `FieldLabel` points `for` at the control of the nearest `Field`. A
 * `FieldSet` names its group with its legend instead, so it clears this key
 * for the labels inside it that sit outside any `Field`.
 */
const LABEL_TARGET_KEY = "kuiper:field-label";

/**
 * Sets the control that a `FieldLabel` inside points at. `undefined` clears it,
 * as a `FieldSet` does for its own labels.
 */
export function setLabelTarget(
  target: { readonly id: string } | undefined,
): void {
  setContext(OLD_LABEL_TARGET_KEY, target);
  setContext(LABEL_TARGET_KEY, target);
}

/**
 * The control the nearest `Field` gives its labels, or `undefined` when there
 * is none.
 */
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
export const FIELD_SET_CONTEXT_KEY = "kuiper:field-set";

/**
 * What a `FieldSet` gives a group control: the field context, plus its legend's
 * id.
 */
export type FieldSetContext = FieldContext & {
  /** `${id}-legend`, the id a `FieldLegend` takes unless the app gives one. */
  readonly legendId: string;
  /** The id of the legend this set renders, once a `FieldLegend` has registered. */
  readonly legend: string | undefined;
  /** Called by `FieldLegend` in its script, before the group control renders. */
  registerLegend(id: () => string | undefined): void;
};

/**
 * Sets the set context, under the key and the old key, for the children about
 * to render. `FieldSet` calls it.
 */
export function setFieldSetContext(context: FieldSetContext): FieldSetContext {
  setContext(OLD_FIELD_SET_CONTEXT_KEY, context);
  return setContext(FIELD_SET_CONTEXT_KEY, context);
}

/** The nearest `FieldSet`'s context, or `undefined` outside one. */
export function getFieldSetContext(): FieldSetContext | undefined {
  return getContext<FieldSetContext | undefined>(FIELD_SET_CONTEXT_KEY);
}
