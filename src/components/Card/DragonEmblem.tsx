/**
 * Tribal dragon emblem — inspired by the tattoo-style reference image.
 * Stroke-based design: thick flowing lines on transparent background.
 * ViewBox 0 0 40 100 (tall/narrow to match the dragon's proportions).
 * Uses `stroke="currentColor"` so color is controlled via Tailwind text-* class.
 */

type Props = {
  className?: string;
};

export default function DragonEmblem({ className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 40 100"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {/* ── Crown of spikes (top-left) ───────────────────────────────────── */}
      <path strokeWidth="1.8" d="M 18 14 L 10 3 L 15 11" />
      <path strokeWidth="1.8" d="M 20 12 L 14 1 L 18 9" />
      <path strokeWidth="1.8" d="M 22 11 L 17 2 L 20 8" />
      <path strokeWidth="1.8" d="M 25 10 L 21 3 L 23 8" />

      {/* ── Head profile (facing right) ───────────────────────────────────── */}
      {/* Upper jaw / skull */}
      <path strokeWidth="2.5"
        d="M 20 12 C 26 10 32 11 36 15 C 38 18 37 22 33 22"
      />
      {/* Brow / eye area notch */}
      <path strokeWidth="1.5" d="M 31 14 L 33 12 L 35 14" />

      {/* Lower jaw with two tooth points */}
      <path strokeWidth="2.2"
        d="M 24 18 C 29 18 35 20 38 24 L 36 26 L 34 24"
      />
      <path strokeWidth="1.5" d="M 34 26 L 37 28 L 35 30 L 32 28" />

      {/* Chin connecting back */}
      <path strokeWidth="2"
        d="M 33 22 C 30 24 26 24 22 22 C 20 20 20 18 22 16"
      />

      {/* ── Neck (flows from head leftward then downward) ─────────────────── */}
      <path strokeWidth="3"
        d="M 22 22 C 18 26 14 32 14 40"
      />
      {/* Outer edge of neck (creates ribbon thickness) */}
      <path strokeWidth="2"
        d="M 26 22 C 22 28 18 36 18 44"
      />

      {/* ── Left wing spikes (extending from upper body) ─────────────────── */}
      <path strokeWidth="2.2" d="M 15 36 C 10 34 4 31 2 28 L 8 34" />
      <path strokeWidth="2"   d="M 15 42 C 9 40 3 39 1 36 L 7 42" />
      <path strokeWidth="1.8" d="M 15 48 C 9 48 4 50 2 48 L 8 52" />

      {/* ── Main body S-curve ribbon (upper to mid section) ──────────────── */}
      {/* Outer edge */}
      <path strokeWidth="2.8"
        d="M 14 42 C 12 52 14 60 20 66 C 26 72 30 78 28 86"
      />
      {/* Inner edge (creates ribbon negative space) */}
      <path strokeWidth="2"
        d="M 18 44 C 16 54 18 62 24 68 C 30 74 32 80 30 88"
      />

      {/* ── Tail loop (infinity / pretzel crossover) ──────────────────────── */}
      {/* Outer loop */}
      <path strokeWidth="2.2"
        d="M 28 86 C 24 90 22 96 26 98 C 30 100 34 96 32 90 C 30 86 24 86 22 92"
      />
      {/* Inner loop (crosses over body above) */}
      <path strokeWidth="2"
        d="M 30 88 C 34 90 36 94 34 97 C 32 100 28 99 28 96"
      />

      {/* ── Tail point (sharp downward spike) ────────────────────────────── */}
      <path strokeWidth="2"
        d="M 26 98 C 27 101 28 104 28 107 L 24 103"
        strokeLinecap="butt"
      />
      <path strokeWidth="2"
        d="M 30 98 C 29 101 28 104 28 107 L 32 103"
        strokeLinecap="butt"
      />

      {/* ── Extra body detail spike (mid-right side of body) ─────────────── */}
      <path strokeWidth="1.8" d="M 20 58 C 24 56 28 54 30 50 L 24 54" />
    </svg>
  );
}
