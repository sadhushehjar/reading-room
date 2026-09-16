"use client";

import { useMemo } from "react";

/**
 * The minute strip.
 *
 * SocialBit scores one minute at a time: was this person in a conversation, or
 * were they alone. 88,918 of those judgements is what the validation paper is
 * made of, and a lit-and-dark tick strip is what that actually looks like.
 *
 * It is the one visual device this room repeats. It is the hero, it is the
 * progress bar while a folder is being read, and it is the reading-time meter
 * on every exhibit card. Lit means "interacting", or more generally "on".
 *
 * Real interaction is bursty — people talk for a stretch, then sit alone for a
 * stretch — so ticks come from a two-state Markov chain rather than independent
 * coin flips. Independent flips produce an even sparkle that looks nothing like
 * a hospital day.
 */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function minutePattern(count: number, lit: number, seed: number) {
  const rand = mulberry32(seed);
  // stay-probabilities tuned so runs average roughly 4–6 minutes either way,
  // which is the texture of the published density plots
  const stayLit = 0.8;
  const stayDark = 1 - (1 - stayLit) * (lit / Math.max(1 - lit, 0.001));
  const out: boolean[] = [];
  let on = rand() < lit;
  for (let i = 0; i < count; i++) {
    out.push(on);
    const stay = on ? stayLit : Math.min(Math.max(stayDark, 0.55), 0.94);
    if (rand() > stay) on = !on;
  }
  return out;
}

type Props = {
  /** how many ticks */
  minutes?: number;
  /** share of ticks that are lit, 0–1 */
  lit?: number;
  seed?: number;
  /** pixel height of a tick */
  height?: number;
  /** override the pattern entirely — used by the ingest progress meter */
  pattern?: boolean[];
  /** stagger the ticks in on first paint */
  animate?: boolean;
  className?: string;
  title?: string;
};

export default function MinuteStrip({
  minutes = 96,
  lit = 0.51,
  seed = 7,
  height = 22,
  pattern,
  animate = false,
  className = "",
  title,
}: Props) {
  const ticks = useMemo(
    () => pattern ?? minutePattern(minutes, lit, seed),
    [pattern, minutes, lit, seed],
  );

  const gap = 0.34; // share of a slot left empty, keeps the strip readable
  const slot = 1;
  const w = ticks.length * slot;

  return (
    <svg
      viewBox={`0 0 ${w} 10`}
      preserveAspectRatio="none"
      className={className}
      style={{ height, width: "100%", display: "block" }}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {ticks.map((on, i) => (
        <rect
          key={i}
          x={i * slot}
          y={0}
          width={slot - gap}
          height={10}
          fill={on ? "var(--color-brass)" : "var(--color-wall-3)"}
          style={
            animate
              ? {
                  animation: `tick-in 320ms var(--ease-gallery) both`,
                  animationDelay: `${Math.round((i * 1800) / ticks.length)}ms`,
                  transformOrigin: "center",
                }
              : undefined
          }
        />
      ))}
    </svg>
  );
}
