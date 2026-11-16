/**
 * The toast queue: kinds, timing, pauses, steps aside, waiting,
 * de-duplication, navigation, modal holds and the announcers' one schedule.
 * Plain TypeScript: no runes and no DOM. Its clock and its frame scheduler
 * are passed in, so a test can drive time; `toast.ts` binds the real ones.
 * The toaster draws its snapshots and writes its speech.
 */
import {
  channelOf,
  countWords,
  DEFAULT_STRINGS,
  spokenText,
  type ToasterStrings,
} from "./toast-words.js";

/** The five kinds. `info` and `success` time out; the rest wait to be dismissed. */
export type ToastKind = "info" | "success" | "caution" | "error" | "loading";

/** Why a toast closed, as its `onclose` is told. */
export type ToastCloseReason =
  | "dismiss"
  | "timeout"
  | "action"
  | "navigation"
  | "api"
  | "replaced"
  | "unmount";

/** A toast's one action, such as Undo. A toast with an action never times out. */
export type ToastAction = {
  /** The button's text, such as "Undo". */
  label: string;
  /** Called when the button is pressed. The toast then closes. */
  onclick: () => void;
};

/** What a toast may carry besides its title. */
export type ToastOptions = {
  /** One short sentence under the title. Text only. */
  description?: string;
  /** One button, such as Undo. The toast then waits to be dismissed; offer the same action on the page too. */
  action?: ToastAction;
  /** Raise with the id of a toast that is showing or waiting to update it in place. */
  id?: string;
  /** Milliseconds. Lengthens a timed toast, never shortens it; `Infinity` keeps it until dismissed. */
  duration?: number;
  /** Runs once when the toast closes, with the reason. An update that passes a new one runs the old as `"replaced"`. */
  onclose?: (reason: ToastCloseReason) => void;
};

/** `toast.promise`'s messages: a string, or a function of the value or the error. */
export type PromiseMessages<T> = {
  /** The title while the promise runs. */
  loading: string;
  /** The title once it resolves: text, or made from its value. */
  success: string | ((value: T) => string);
  /** The title once it rejects: text, or made from its error. */
  error: string | ((error: unknown) => string);
};

/** A reason the timers stop. Each is counted on its own. */
export type PauseCause = "hover" | "focus" | "blur" | "hidden" | "modal";

/** One toast as the toaster draws it. */
export type ToastView = {
  /** The toast's id. */
  id: string;
  /**
   * The toast's kind, which sets its icon, its colour and how long it stays.
   */
  kind: ToastKind;
  /** The toast's one line of text. */
  title: string;
  /** The sentence under the title, if any. */
  description?: string;
  /** The toast's one button, if any. */
  action?: ToastAction;
  /** Hidden from view, because its box would cover the keyboard focus. */
  aside: boolean;
};

/** What the toaster draws: the showing toasts, newest first, and two counts. */
export type Snapshot = {
  /** The toasts on screen, newest first. */
  showing: ToastView[];
  /** How many wait behind a full stack. */
  waiting: number;
  /** How many showing toasts stepped aside. */
  aside: number;
};

/** One write to an announcer. An empty `text` clears it. */
export type Speech = {
  /**
   * `assertive` for an error, which interrupts; `polite` for the rest, which
   * wait their turn.
   */
  channel: "polite" | "assertive";
  /** What the announcer says. */
  text: string;
};

/** The least time a timed toast shows, in ms. */
export const TOAST_MIN_MS = 6000;
/** The time each word adds, in ms: 200 words a minute. */
export const TOAST_MS_PER_WORD = 300;
/** A promise that settles within this many ms shows no loading toast. */
export const TOAST_PROMISE_GRACE_MS = 400;
/** After a navigation, an error's speech waits this long, so the page's title is heard first. */
export const TOAST_ROUTE_HOLD_MS = 1500;
/** After a modal closes, speech waits this long, so the focus change does not drop it. */
export const TOAST_MODAL_HOLD_MS = 1000;

/** A timed toast's time before its words count. */
const BASE_MS = 2000;
/** How long a message stays in its announcer before it is cleared. */
const SPEECH_MS = 1000;
/** A navigation hold with no `navigated()` releases itself after this. */
const NAV_RELEASE_MS = 3000;
/** The longest delay a 32-bit timer holds; above it a toast is kept. */
const MAX_DELAY = 2 ** 31 - 1;

type Entry = {
  id: string;
  seq: number;
  kind: ToastKind;
  title: string;
  description?: string;
  action?: ToastAction;
  onclose?: (reason: ToastCloseReason) => void;
  /** Callbacks already run, so each runs once. */
  called: Set<(reason: ToastCloseReason) => void>;
  duration?: number;
  timed: boolean;
  /** Ms left, for a timed toast. */
  remaining: number;
  /** When its clock last started, while it runs. */
  started: number | null;
  timer: unknown;
  state: "waiting" | "showing";
  aside: boolean;
  /** Holds keyboard focus. */
  focused: boolean;
  /** Holds the pointer. Two flags, so one leaving does not free the other's hold. */
  pointed: boolean;
  /** Has lived through one navigation. */
  survived: boolean;
  /** Has been spoken since it was raised or last changed. */
  spoken: boolean;
};

/** A toast that holds focus or the pointer never leaves the stack but by closing. */
const held = (e: Entry) => e.focused || e.pointed;

/** One message for an announcer; a rewrite repeats what an error interrupted. */
type Message = { text: string | (() => string); rewrite: boolean };

type Channel = {
  name: "polite" | "assertive";
  /** What the region holds now, or null when it is clear. */
  current: string | null;
  /** The current text is a rewrite, so it is not rewritten again. */
  rewrite: boolean;
  /** Messages to write: their words are built when written, in the strings then. */
  queue: Message[];
  /** Holds end at this time: a navigation's or a modal's. */
  until: number;
  untilTimer: unknown;
};

/** The computed styles that make `position: fixed` relative to an ancestor. */
export type TrapStyle = {
  /** The computed `transform`. */
  transform: string;
  /** The computed `translate`. */
  translate: string;
  /** The computed `rotate`. */
  rotate: string;
  /** The computed `scale`. */
  scale: string;
  /** The computed `filter`. */
  filter: string;
  /** The computed backdrop filter. */
  backdropFilter: string;
  /** The computed `perspective`. */
  perspective: string;
  /** The computed `contain`. */
  contain: string;
  /** The computed `container-type`. */
  containerType: string;
  /** The computed `content-visibility`. */
  contentVisibility: string;
  /** The computed `will-change`. */
  willChange: string;
};

/** The properties `will-change` may name that trap, read in camel case as `TrapStyle` names them. */
const TRAP_WILL_CHANGE = new Set<string>([
  "transform",
  "translate",
  "rotate",
  "scale",
  "filter",
  "backdropFilter",
  "perspective",
  "contain",
]);
const camel = (name: string) =>
  name.trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

/**
 * The nearest ancestor's style, of `chain` (nearest first), that traps a
 * fixed layer inside it, or null. The toaster warns, in development, naming it.
 */
export function findTrap<T extends Partial<TrapStyle>>(chain: T[]): T | null {
  const set = (v: string | undefined) =>
    v !== undefined && v !== "" && v !== "none";
  for (const s of chain) {
    if (
      set(s.transform) ||
      set(s.translate) ||
      set(s.rotate) ||
      set(s.scale) ||
      set(s.filter) ||
      set(s.backdropFilter) ||
      set(s.perspective)
    )
      return s;
    const contain = (s.contain ?? "").split(/\s+/);
    if (
      contain.some((c) => ["paint", "layout", "strict", "content"].includes(c))
    )
      return s;
    if (s.containerType && s.containerType !== "normal") return s;
    if (s.contentVisibility === "auto") return s;
    if (
      (s.willChange ?? "")
        .split(/\s*,\s*/)
        .some((w) => TRAP_WILL_CHANGE.has(camel(w)))
    )
      return s;
  }
  return null;
}

/** What the queue needs from its host: a clock, timers and a frame scheduler. */
export type ToastQueueDeps = {
  /** The time now, in milliseconds. */
  now(): number;
  /**
   * Calls `fn` after `ms` milliseconds. Returns a handle for `clearTimeout`.
   */
  setTimeout(fn: () => void, ms: number): unknown;
  /** Cancels a timer by its handle. */
  clearTimeout(handle: unknown): void;
  /** Calls `fn` before the next paint. */
  frame(fn: () => void): void;
  /** A development warning. */
  warn?(message: string): void;
};

/** The queue's interface, as `createToastQueue` returns it. */
export type ToastQueue = ReturnType<typeof createToastQueue>;

/** A new, empty queue. One per document; `toast.ts` creates it. */
export function createToastQueue(deps: ToastQueueDeps) {
  const warn = deps.warn ?? (() => {});
  let showing: Entry[] = [];
  let waiting: Entry[] = [];
  let seq = 0;
  let max = 3;
  let timersOn = true;
  let lang: string | undefined;
  let strings: ToasterStrings = DEFAULT_STRINGS;
  let hotkey = "F8";
  let check: (() => void) | undefined;
  /** No toaster yet, or none now: clocks wait, as nothing is seen. */
  let unmounted = true;
  const causes = new Set<PauseCause>();
  let view: ((s: Snapshot) => void) | null = null;
  let speak: ((s: Speech) => void) | null = null;
  /** The announcers are in the document, two frames after the toaster mounted. */
  let ready = false;
  let navigatingNow = false;
  let navTimer: unknown;
  /** Polite speech waits two frames after a navigation. */
  let politeGate = false;
  let framePending = false;

  const channels: Record<Channel["name"], Channel> = {
    polite: {
      name: "polite",
      current: null,
      rewrite: false,
      queue: [],
      until: 0,
      untilTimer: undefined,
    },
    assertive: {
      name: "assertive",
      current: null,
      rewrite: false,
      queue: [],
      until: 0,
      untilTimer: undefined,
    },
  };

  // Clocks.

  function timeFor(e: Pick<Entry, "title" | "description" | "duration">) {
    const words =
      countWords(e.title, lang) + countWords(e.description ?? "", lang);
    const computed = Math.max(
      TOAST_MIN_MS,
      BASE_MS + TOAST_MS_PER_WORD * words,
    );
    const d = e.duration;
    return d !== undefined && Number.isFinite(d) && d >= 0
      ? Math.max(computed, d)
      : computed;
  }

  function running(e: Entry) {
    return (
      e.timed &&
      e.state === "showing" &&
      !e.aside &&
      timersOn &&
      !unmounted &&
      causes.size === 0
    );
  }

  function stopClock(e: Entry) {
    if (e.started !== null) {
      e.remaining = Math.max(0, e.remaining - (deps.now() - e.started));
      e.started = null;
    }
    if (e.timer !== undefined) deps.clearTimeout(e.timer);
    e.timer = undefined;
  }

  function reclock() {
    for (const e of [...showing, ...waiting]) {
      if (running(e)) {
        if (e.started === null) {
          e.started = deps.now();
          e.timer = deps.setTimeout(() => close(e, "timeout"), e.remaining);
        }
      } else stopClock(e);
    }
  }

  // The stack.

  const byNewest = (a: Entry, b: Entry) => b.seq - a.seq;

  function emit() {
    view?.(snapshot());
  }

  function snapshot(): Snapshot {
    const shown = [...showing].sort(byNewest);
    return {
      showing: shown.map((e) => ({
        id: e.id,
        kind: e.kind,
        title: e.title,
        description: e.description,
        action: e.action,
        aside: e.aside,
      })),
      waiting: waiting.length,
      aside: shown.filter((e) => e.aside).length,
    };
  }

  function show(e: Entry) {
    e.state = "showing";
    showing.push(e);
    if (!e.spoken) say(e);
  }

  /** Returns showing toasts to the queue's head, oldest first, keeping their time. */
  function unshow(list: Entry[]) {
    for (const e of list) {
      stopClock(e);
      e.state = "waiting";
      showing = showing.filter((s) => s !== e);
    }
    const errors = waiting.filter((w) => w.kind === "error");
    const rest = waiting.filter((w) => w.kind !== "error");
    waiting = [...errors, ...list.sort((a, b) => a.seq - b.seq), ...rest];
  }

  /** Fills free places from the queue's head; an error may displace a timed toast. */
  function promote(displace: boolean) {
    if (causes.has("modal")) return;
    while (waiting.length) {
      const head = waiting[0]!;
      if (showing.length < max) {
        waiting.shift();
        show(head);
        continue;
      }
      if (!displace || head.kind !== "error") break;
      const free = showing
        .filter((s) => s.timed && !held(s))
        .sort((a, b) => a.seq - b.seq)[0];
      if (!free) break;
      waiting.shift();
      unshow([free]);
      show(head);
    }
  }

  /** A smaller `max`: the oldest free toasts go back to the queue. */
  function shrink() {
    const over = showing.length - max;
    if (over <= 0) return;
    const free = showing
      .filter((s) => !held(s))
      .sort((a, b) => a.seq - b.seq)
      .slice(0, over);
    unshow(free);
  }

  function enqueue(e: Entry) {
    if (e.kind === "error") {
      const errors = waiting.filter((w) => w.kind === "error").length;
      waiting.splice(errors, 0, e);
    } else waiting.push(e);
  }

  function runClose(e: Entry, reason: ToastCloseReason) {
    const f = e.onclose;
    if (f && !e.called.has(f)) {
      e.called.add(f);
      f(reason);
    }
  }

  function close(e: Entry, reason: ToastCloseReason) {
    if (!showing.includes(e) && !waiting.includes(e)) return;
    stopClock(e);
    showing = showing.filter((s) => s !== e);
    waiting = waiting.filter((w) => w !== e);
    runClose(e, reason);
    promote(false);
    reclock();
    emit();
  }

  function find(id: string) {
    return [...showing, ...waiting].find((e) => e.id === id);
  }

  // Speech.

  function say(e: Entry) {
    e.spoken = true;
    const ch = channels[channelOf(e.kind)];
    // The toast as it is now; the toaster's strings as they are when written.
    const said = {
      kind: e.kind,
      title: e.title,
      description: e.description,
      action: e.action,
    };
    ch.queue.push({
      text: () => spokenText(said, strings, hotkey),
      rewrite: false,
    });
    schedule();
  }

  function schedule() {
    if (framePending) return;
    framePending = true;
    deps.frame(() => {
      framePending = false;
      write();
    });
  }

  function blocked(ch: Channel) {
    return (
      !ready ||
      navigatingNow ||
      (ch.name === "polite" && politeGate) ||
      deps.now() < ch.until
    );
  }

  /** Writes what may be written now. Called within a frame. */
  function write() {
    const polite = channels.polite;
    const assertive = channels.assertive;
    // An error waiting to be written would interrupt a rewrite at once, and
    // a rewrite is written only once: it waits until no error is due.
    const errorDue = !blocked(assertive) && assertive.queue.length > 0;
    // Polite first: an error written in the same frame then interrupts it.
    if (
      !blocked(polite) &&
      polite.current === null &&
      assertive.current === null &&
      polite.queue.length &&
      !(polite.queue[0]!.rewrite && errorDue)
    )
      put(polite, polite.queue.shift()!);
    if (
      !blocked(assertive) &&
      assertive.current === null &&
      assertive.queue.length
    ) {
      // The interruption may flush the polite message: write it again after.
      if (polite.current !== null && !polite.rewrite)
        polite.queue.unshift({ text: polite.current, rewrite: true });
      put(assertive, assertive.queue.shift()!);
    }
  }

  function put(ch: Channel, m: Message) {
    const text = typeof m.text === "function" ? m.text() : m.text;
    ch.current = text;
    ch.rewrite = m.rewrite;
    speak?.({ channel: ch.name, text });
    deps.setTimeout(() => {
      ch.current = null;
      ch.rewrite = false;
      speak?.({ channel: ch.name, text: "" });
      schedule();
    }, SPEECH_MS);
  }

  /** Holds a channel's writes until `at`; the later end wins. */
  function holdUntil(ch: Channel, at: number) {
    if (at <= ch.until) return;
    ch.until = at;
    if (ch.untilTimer !== undefined) deps.clearTimeout(ch.untilTimer);
    ch.untilTimer = deps.setTimeout(() => {
      ch.untilTimer = undefined;
      schedule();
    }, at - deps.now());
  }

  // Raising.

  function persistentKind(kind: ToastKind, action?: ToastAction) {
    return !(kind === "info" || kind === "success") || !!action;
  }

  function cleanDuration(
    kind: ToastKind,
    options: ToastOptions,
  ): { duration?: number; keep: boolean } {
    const d = options.duration;
    if (d === undefined) return { keep: false };
    if (persistentKind(kind, options.action)) {
      warn(
        `toast: duration is ignored on a ${kind} toast${options.action ? " with an action" : ""}, which waits to be dismissed.`,
      );
      return { keep: false };
    }
    if (typeof d !== "number" || Number.isNaN(d) || d < 0) {
      warn(`toast: duration ${d} is not a number of ms from 0; it is ignored.`);
      return { keep: false };
    }
    if (d === Infinity || d > MAX_DELAY) return { keep: true };
    return { duration: d, keep: false };
  }

  function raise(
    kind: ToastKind,
    title: string,
    options: ToastOptions = {},
  ): string {
    check?.();
    const { duration, keep } = cleanDuration(kind, options);
    const timed = !persistentKind(kind, options.action) && !keep;

    // By id: an update in place.
    const same = options.id !== undefined ? find(options.id) : undefined;
    if (same) {
      const wasLoading = same.kind === "loading";
      stopClock(same);
      same.kind = kind;
      same.title = title;
      same.description = options.description;
      same.action = options.action;
      same.duration = duration;
      same.timed = timed;
      same.remaining = timed ? timeFor(same) : 0;
      same.survived = false;
      if (options.onclose && options.onclose !== same.onclose) {
        const old = same.onclose;
        same.onclose = options.onclose;
        if (old && !same.called.has(old)) {
          same.called.add(old);
          old("replaced");
        }
      }
      const silent = wasLoading && kind === "loading";
      if (same.state === "showing") {
        if (!silent) say(same);
      } else if (!silent) same.spoken = false;
      if (kind === "error" && same.state === "waiting") {
        waiting = waiting.filter((w) => w !== same);
        enqueue(same);
        promote(true);
      }
      reclock();
      emit();
      return same.id;
    }

    // By content: a plain repeat refreshes and is spoken again.
    if (
      options.id === undefined &&
      !options.action &&
      !options.onclose &&
      duration === undefined &&
      !keep
    ) {
      const repeat = [...showing, ...waiting].find(
        (e) =>
          e.kind === kind &&
          e.title === title &&
          (e.description ?? "") === (options.description ?? "") &&
          !e.action &&
          !e.onclose,
      );
      if (repeat) {
        stopClock(repeat);
        if (repeat.timed) repeat.remaining = timeFor(repeat);
        if (repeat.state === "showing") say(repeat);
        reclock();
        emit();
        return repeat.id;
      }
    }

    const e: Entry = {
      id: options.id ?? `toast-${++seq}`,
      seq: ++seq,
      kind,
      title,
      description: options.description,
      action: options.action,
      onclose: options.onclose,
      called: new Set(),
      duration,
      timed,
      remaining: 0,
      started: null,
      timer: undefined,
      state: "waiting",
      aside: false,
      focused: false,
      pointed: false,
      survived: false,
      spoken: false,
    };
    if (timed) e.remaining = timeFor(e);
    enqueue(e);
    promote(true);
    reclock();
    emit();
    return e.id;
  }

  function promise<T>(
    p: Promise<T>,
    messages: PromiseMessages<T>,
    options: Omit<ToastOptions, "duration"> = {},
  ): string {
    const id = options.id ?? `toast-${++seq}`;
    let settled = false;
    const grace = deps.setTimeout(() => {
      if (settled) return;
      const { onclose: _, ...rest } = options;
      raise("loading", messages.loading, { ...rest, id });
    }, TOAST_PROMISE_GRACE_MS);
    const done = (kind: "success" | "error", text: string) => {
      settled = true;
      deps.clearTimeout(grace);
      raise(kind, text, { ...options, id });
    };
    p.then(
      (v) =>
        done(
          "success",
          typeof messages.success === "function"
            ? messages.success(v)
            : messages.success,
        ),
      (err) =>
        done(
          "error",
          typeof messages.error === "function"
            ? messages.error(err)
            : messages.error,
        ),
    );
    return id;
  }

  return {
    /** Raises a toast of `kind`, or updates the one with `options.id`. Returns its id. */
    raise,
    /** Shows a loading toast after 400 ms, then the result in its place. Returns its id. */
    promise,
    /** Closes one toast, or every toast with no id. */
    dismiss(id?: string, reason: ToastCloseReason = "api") {
      const list = id === undefined ? [...showing, ...waiting] : [find(id)];
      for (const e of list) if (e) close(e, reason);
    },
    /** Stops every clock for one cause. A modal also holds new toasts. */
    pause(cause: PauseCause) {
      if (causes.has(cause)) return;
      causes.add(cause);
      reclock();
    },
    /** Lifts one cause; clocks run when none holds. A modal's end shows what waited. */
    resume(cause: PauseCause) {
      if (!causes.delete(cause)) return;
      if (cause === "modal") {
        const at = deps.now() + TOAST_MODAL_HOLD_MS;
        holdUntil(channels.polite, at);
        holdUntil(channels.assertive, at);
        promote(true);
      }
      reclock();
      emit();
    },
    /** True while a cause holds. */
    paused(cause: PauseCause) {
      return causes.has(cause);
    },
    /** A toast steps aside from, or returns to, the keyboard focus. */
    aside(id: string, on: boolean) {
      const e = find(id);
      if (!e || e.aside === on) return;
      e.aside = on;
      reclock();
      emit();
    },
    /** Focus or the pointer is in a toast, or has left it. Each holds on its own. */
    hold(id: string, cause: "focus" | "pointer", on: boolean) {
      const e = find(id);
      const flag = cause === "focus" ? "focused" : "pointed";
      if (!e || e[flag] === on) return;
      e[flag] = on;
      if (!held(e)) {
        shrink();
        promote(false);
        reclock();
        emit();
      }
    },
    /** The page's language, for the word count. */
    setLang(value: string | undefined) {
      lang = value || undefined;
    },
    /** Timers on or off. Off, nothing times out. */
    setTimers(on: boolean) {
      timersOn = on;
      reclock();
    },
    /** How many show at once. */
    setMax(n: number) {
      max = Math.max(1, Math.floor(n) || 1);
      shrink();
      promote(false);
      reclock();
      emit();
    },
    /** The toaster's strings and hotkey, for what is said; `check` runs at each raise. */
    configure(c: {
      strings?: ToasterStrings;
      hotkey?: string;
      check?: () => void;
    }) {
      if (c.strings) strings = c.strings;
      if (c.hotkey) hotkey = c.hotkey;
      if (c.check) check = c.check;
    },
    /** Call in `beforeNavigate`: holds speech until `navigated()`, or 3 s. */
    navigating() {
      navigatingNow = true;
      if (navTimer !== undefined) deps.clearTimeout(navTimer);
      navTimer = deps.setTimeout(() => {
        navTimer = undefined;
        navigatingNow = false;
        schedule();
      }, NAV_RELEASE_MS);
    },
    /** Call in `afterNavigate`: releases speech, and closes timed toasts that survived one navigation. */
    navigated() {
      if (navTimer === undefined) return;
      deps.clearTimeout(navTimer);
      navTimer = undefined;
      navigatingNow = false;
      for (const e of [...showing, ...waiting])
        if (e.timed && e.survived) close(e, "navigation");
      for (const e of [...showing, ...waiting]) if (e.timed) e.survived = true;
      holdUntil(channels.assertive, deps.now() + TOAST_ROUTE_HOLD_MS);
      politeGate = true;
      deps.frame(() =>
        deps.frame(() => {
          politeGate = false;
          write();
        }),
      );
      emit();
    },
    /**
     * Draws and speaks through the one toaster. Returns its unsubscribe, or
     * null when another toaster already holds the queue.
     */
    subscribe(
      onview: (s: Snapshot) => void,
      onspeak: (s: Speech) => void,
    ): (() => void) | null {
      if (view) return null;
      view = onview;
      speak = onspeak;
      unmounted = false;
      ready = false;
      deps.frame(() =>
        deps.frame(() => {
          if (view !== onview) return;
          ready = true;
          write();
        }),
      );
      reclock();
      onview(snapshot());
      return () => {
        if (view !== onview) return;
        view = null;
        speak = null;
        unmounted = true;
        ready = false;
        reclock();
      };
    },
    /** The showing and waiting toasts with their time left: for tests and devtools. */
    entries() {
      const info = (e: Entry) => ({
        id: e.id,
        kind: e.kind,
        title: e.title,
        aside: e.aside,
        held: held(e),
        remaining:
          e.started === null
            ? e.remaining
            : Math.max(0, e.remaining - (deps.now() - e.started)),
      });
      return {
        showing: [...showing].sort(byNewest).map(info),
        waiting: waiting.map(info),
      };
    },
  };
}
