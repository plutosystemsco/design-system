/** The code-editor page's example: 20 lines of Python, with a call, a string, a comment and a number. */
export const PI = `# Estimate pi by throwing darts at a square.
import random

def estimate_pi(darts: int) -> float:
    """Count the darts that land inside the unit circle."""
    inside = 0
    for _ in range(darts):
        x = random.random()
        y = random.random()
        if x * x + y * y <= 1.0:
            inside += 1
    return 4 * inside / darts

random.seed(7)
for darts in (1_000, 10_000, 100_000):
    estimate = estimate_pi(darts)
    error = abs(estimate - 3.141592653589793)
    print(f"{darts:>7} darts: pi = {estimate:.4f}, error {error:.4f}")

print("Done.")`;

/** A short example for the states and the keyboard fixture. */
export const SHORT = `greeting = "hello"
print(greeting.upper())`;
