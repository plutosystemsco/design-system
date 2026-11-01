/**
 * The ink surface's example (007 decision 9). It lives beside
 * `+page.server.ts`, which SvelteKit allows to export only its load options.
 */
export const SURFACE_CODE = `import random

def estimate_pi(darts: int) -> float:
    inside = sum(random.random() ** 2 + random.random() ** 2 <= 1.0 for _ in range(darts))
    return 4 * inside / darts

print(f"pi is about {estimate_pi(10_000):.3f}")`;
