/**
 * The ink surface example's code: the editor starts from it, the block shows
 * it, and the page's data highlights it at prerender.
 */
export const SURFACE_CODE = `import random

def estimate_pi(darts: int) -> float:
    inside = sum(random.random() ** 2 + random.random() ** 2 <= 1.0 for _ in range(darts))
    return 4 * inside / darts

print(f"pi is about {estimate_pi(10_000):.3f}")`;
