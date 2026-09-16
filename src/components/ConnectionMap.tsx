"use client";

import { useState } from "react";
import { PAPERS, LINK_LABEL, byId } from "@/lib/collection";

/**
 * How the papers hold together.
 *
 * The collection is not a list, it is two threads that converge. One thread is
 * about measurement — build a survey, then replace it with a sensor. The other
 * is about clinical evidence — show networks predict outcomes, then try to move
 * one. The 2016 framework starts both and the 2022 review is where they meet.
 *
 * Position on this map is meaningful: left to right is time, and the lane a
 * paper sits in is the thread it belongs to.
 */

type Pos = { x: number; y: number; lane: "measure" | "clinical" | "spine" };

const POS: Record<string, Pos> = {
  "theory-2016": { x: 74, y: 214, lane: "spine" },
  "instrument-2018": { x: 246, y: 96, lane: "measure" },
  "arrival-2019": { x: 292, y: 330, lane: "clinical" },
  "recovery-2019": { x: 488, y: 330, lane: "clinical" },
  "gaps-2022": { x: 540, y: 214, lane: "spine" },
  "protocol-2023": { x: 676, y: 96, lane: "measure" },
  "trial-2025": { x: 740, y: 330, lane: "clinical" },
  "validation-2026": { x: 896, y: 214, lane: "spine" },
};

const LANE_COLOR = {
  measure: "var(--color-brass)",
  clinical: "var(--color-tie-weak)",
  spine: "var(--color-chalk)",
};

/** A curve that leaves the source sideways and arrives sideways, so edges read
 *  as flow rather than as a web of straight lines. */
function edgePath(a: Pos, b: Pos) {
  // capped, or a long edge bows out past the lanes and the map turns to soup
  const dx = Math.min(Math.max(Math.abs(b.x - a.x) * 0.42, 40), 95);
  return `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`;
}

const EDGES = PAPERS.flatMap((p) =>
  p.connections.map((c) => ({ from: p.id, to: c.to, kind: c.kind, why: c.why })),
);

export default function ConnectionMap({
  onOpen,
}: {
  onOpen: (id: string) => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const shown = active ? byId(active) : null;

  const isLit = (id: string) => !active || active === id;
  const edgeLit = (from: string, to: string) =>
    !active || from === active || to === active;

  return (
    <section id="map" className="u-shell pb-24 pt-4">
      <div className="u-rail pt-10">
        <div className="grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
          <div>
            <span className="u-label">The map</span>
            <h2 className="mt-4 text-[clamp(2rem,4.6vw,3.2rem)] font-700">
              Two threads,
              <br />
              one convergence.
            </h2>
          </div>
          <p className="max-w-[52ch] self-end text-[1.04rem] leading-[1.62] text-chalk-2">
            One thread builds the measurement and ends in a sensor. The other
            gathers clinical evidence and ends in a trial. They cross at the 2022
            review, where a neurologist, a signal processing lab and a psychology
            lab start working together. Touch a paper to see what it holds onto.
          </p>
        </div>
      </div>

      <div className="mt-12 overflow-x-auto pb-2">
        <svg
          viewBox="0 0 980 430"
          className="w-full min-w-[760px]"
          role="group"
          aria-label="Map of how the eight papers connect"
        >
          {/* lane rules */}
          <line x1={40} y1={96} x2={940} y2={96} stroke="var(--color-line-wall)" />
          <line x1={40} y1={330} x2={940} y2={330} stroke="var(--color-line-wall)" />
          <text x={40} y={72} className="u-num" fontSize="11" fill="var(--color-brass)" fontFamily="var(--font-mono)">
            MEASUREMENT
          </text>
          <text x={40} y={368} fontSize="11" fill="var(--color-tie-weak)" fontFamily="var(--font-mono)">
            CLINICAL EVIDENCE
          </text>

          {/* edges */}
          {EDGES.map((e, i) => {
            const a = POS[e.from];
            const b = POS[e.to];
            if (!a || !b) return null;
            const lit = edgeLit(e.from, e.to);
            return (
              <path
                key={i}
                d={edgePath(a, b)}
                fill="none"
                stroke={
                  lit && active
                    ? "var(--color-brass)"
                    : "var(--color-line-wall-2)"
                }
                strokeWidth={lit && active ? 1.8 : 1}
                strokeDasharray={e.kind === "shared-authors" || e.kind === "same-measure" ? "4 4" : undefined}
                opacity={lit ? 1 : 0.18}
                style={{ transition: "opacity 300ms, stroke 300ms" }}
              />
            );
          })}

          {/* nodes */}
          {PAPERS.map((p) => {
            const pos = POS[p.id];
            const lit = isLit(p.id);
            return (
              <g
                key={p.id}
                transform={`translate(${pos.x},${pos.y})`}
                opacity={lit ? 1 : 0.28}
                style={{ transition: "opacity 300ms", cursor: "pointer" }}
                onMouseEnter={() => setActive(p.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(p.id)}
                onBlur={() => setActive(null)}
                onClick={() => onOpen(p.id)}
                tabIndex={0}
                role="button"
                aria-label={`${p.year}, ${p.title}. Open exhibit.`}
              >
                <circle
                  r={active === p.id ? 13 : 9}
                  fill={active === p.id ? LANE_COLOR[pos.lane] : "var(--color-wall)"}
                  stroke={LANE_COLOR[pos.lane]}
                  strokeWidth={2}
                  style={{ transition: "r 220ms" }}
                />
                <text
                  y={pos.lane === "clinical" ? 34 : -22}
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily="var(--font-mono)"
                  fill="var(--color-chalk-2)"
                >
                  {p.year}
                </text>
                <text
                  y={pos.lane === "clinical" ? 50 : -38}
                  textAnchor="middle"
                  fontSize="13"
                  fontFamily="var(--font-display)"
                  fontWeight="600"
                  fill="var(--color-chalk)"
                >
                  {p.role}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* the label under the map changes with whatever is being touched */}
      <div className="u-panel mt-6 min-h-[140px] p-6 sm:p-8">
        {shown ? (
          <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <div>
              <div className="u-label">{shown.year} · {shown.kind}</div>
              <h3 className="mt-2 max-w-[26ch] text-[1.15rem] font-600 text-chalk">
                {shown.title}
              </h3>
              <button
                onClick={() => onOpen(shown.id)}
                className="mt-4 font-mono text-[0.7rem] tracking-[0.14em] text-brass uppercase underline underline-offset-4"
              >
                Open exhibit →
              </button>
            </div>
            <ul className="space-y-3">
              {shown.connections.map((c) => (
                <li key={c.to} className="text-[0.98rem] leading-[1.5] text-chalk-2">
                  <span className="u-label mr-2 text-brass">
                    {LINK_LABEL[c.kind]}
                  </span>
                  <span className="text-chalk">{byId(c.to).year}</span> — {c.why}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="max-w-[56ch] text-[1.02rem] leading-[1.6] text-chalk-3">
            Hover or tap any point on the map. Solid lines are citations, shared tools and gaps one paper addressed for another. Dashed lines are shared authors or a shared measure.
          </p>
        )}
      </div>
    </section>
  );
}
