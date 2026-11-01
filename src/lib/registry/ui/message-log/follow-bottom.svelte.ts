/**
 * Follow-bottom (005 decision 11): a scroll box that keeps its end in view as
 * content arrives, until the reader scrolls away. The rules are the stock
 * scroller's, written fresh: `following` starts true; while following, every
 * resize of the content scrolls to the end (coalesced into one frame); a
 * wheel, a touch move, one of seven keys on the box, or a scrollTop that fell
 * since the last frame releases it; it re-arms when the box comes within 8 px
 * of its end; growth past the end never releases it.
 */

/**
 * The keys that can move the box away from its end: they release the follow.
 * ArrowDown, PageDown, End and Space cannot leave the end; when they do
 * scroll, the scroll handler's fall rule and the 8 px re-arm apply.
 */
const AWAY_KEYS = new Set(["ArrowUp", "PageUp", "Home"]);

/** Within this many pixels of the end, the box counts as at its end. */
const EDGE = 8;

export class FollowBottom {
  /** True while the box keeps its end in view as content arrives. */
  following = $state(true);
  /** True while the box is within 8 px of its end. */
  atEnd = $state(true);

  #box: HTMLElement | null = null;
  #frame = 0;
  #lastTop = 0;
  #observer: ResizeObserver | null = null;

  /** Watches `log` inside `box`; returns the function that stops watching. Opens at the end. */
  attach(box: HTMLElement, log: HTMLElement): () => void {
    this.#box = box;
    this.#lastTop = box.scrollTop;
    this.scrollToEnd("auto");
    this.#measure();
    this.#observer = new ResizeObserver(() => this.#onResize());
    this.#observer.observe(log);
    return () => {
      this.#observer?.disconnect();
      this.#observer = null;
      cancelAnimationFrame(this.#frame);
      this.#box = null;
    };
  }

  /**
   * The reader asked to move away from the end. A gesture that moves nothing
   * (a wheel towards the end while there, a touch at the end) makes no
   * scroll event to re-arm the follow, so it does not release it.
   */
  release(): void {
    this.#measure();
    if (this.atEnd) return;
    this.following = false;
  }

  /** For the box's wheel: only a wheel up can move the box away from its end. */
  onWheel(event: WheelEvent): void {
    if (event.deltaY < 0) this.following = false;
  }

  /** For the box's keydown: ArrowUp, PageUp and Home release the follow. */
  onKeydown(event: KeyboardEvent): void {
    if (AWAY_KEYS.has(event.key)) this.following = false;
  }

  /**
   * For the box's scroll: a fall releases; reaching the end re-arms. A fall
   * never re-arms, even within 8 px of the end: the first frames of an
   * animated scroll up are still near the end, and a re-arm there would let
   * the next resize snap the box back under the reader.
   */
  onScroll(): void {
    const box = this.#box;
    if (!box) return;
    const fell = box.scrollTop < this.#lastTop - 0.5;
    this.#lastTop = box.scrollTop;
    this.#measure();
    if (fell) this.following = false;
    else if (this.atEnd) this.following = true;
  }

  /** Scrolls to the end: smoothly, unless the reader prefers reduced motion. */
  scrollToEnd(behavior?: ScrollBehavior): void {
    const box = this.#box;
    if (!box) return;
    const reduce =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({
      top: box.scrollHeight,
      behavior: behavior ?? (reduce ? "auto" : "smooth"),
    });
  }

  #measure(): void {
    const box = this.#box;
    if (!box) return;
    this.atEnd = box.scrollHeight - box.clientHeight - box.scrollTop <= EDGE;
  }

  // One frame per burst of growth: resizing the observed element during
  // delivery would loop the observer.
  #onResize(): void {
    cancelAnimationFrame(this.#frame);
    this.#frame = requestAnimationFrame(() => {
      if (!this.#box) return;
      if (this.following) {
        this.scrollToEnd("auto");
        this.#lastTop = this.#box.scrollTop;
      }
      this.#measure();
    });
  }
}
