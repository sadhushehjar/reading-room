"use client";

import { useMemo, useState } from "react";

/**
 * Touchable exhibit 1 — constraint.
 *
 * Constraint is the number that keeps reappearing across this collection, and
 * it is hard to hold in your head from a definition. It is much easier to
 * understand by dragging it: watch a person's social world close in, and read
 * off what the papers found happened to people in that shape of network.
 *
 * The anchor values are real. Slow arrivers in the 2019 stroke cohort averaged
 * a network of 5 at constraint 61; fast arrivers averaged 8 at constraint 40.
 * The blood-pressure numbers are the 2025 trial's subgroup analysis. Everything
 * between the anchors is interpolated, and the exhibit says so.
 */

const MIN = 25;
const MAX = 95;

function useNetwork(constraint: number) {
  return useMemo(() => {
    const t = (constraint - MIN) / (MAX - MIN); // 0 = open, 1 = closed

    const n = Math.round(9 - 5 * t); // 9 contacts when open, 4 when closed
    const density = 0.22 + 0.72 * t;
    const strongShare = 0.28 + 0.62 * t;

    const nodes = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const rad = 62 - t * 12; // closed networks also draw in tighter
      return { x: 100 + Math.cos(a) * rad, y: 100 + Math.sin(a) * rad };
    });

    // candidate alter-alter pairs, nearest neighbours first so the graph fills
    // in the way a real close-knit circle does rather than at random
    const pairs: [number, number][] = [];
    for (let gap = 1; gap <= Math.floor(n / 2); gap++) {
      for (let i = 0; i < n; i++) {
        const j = (i + gap) % n;
        if (i < j) pairs.push([i, j]);
      }
    }
    const want = Math.round((density * n * (n - 1)) / 2);
    const alterTies = pairs.slice(0, Math.min(want, pairs.length));

    const total = alterTies.length + n;
    const strongCount = Math.round(total * strongShare);

    const effectiveSize = Math.max(1, +(n * (1 - density)).toFixed(1));

    return { n, density, nodes, alterTies, strongCount, effectiveSize, t };
  }, [constraint]);
}

export default function ConstraintDial() {
  const [c, setC] = useState(40);
  const net = useNetwork(c);

  const closed = c >= 61;
  // 2025 trial subgroup: −12.4 mmHg above the median constraint, +16.1 below
  const bp = closed ? -12.4 : 16.1;

  // ego ties are drawn first and take the strong ties first, which is how these
  // networks actually read: you are close to your own contacts before they are
  // close to each other
  let tieIndex = 0;
  const tie = () => (tieIndex++ < net.strongCount ? "strong" : "weak");

  return (
    <div className="u-panel p-6 sm:p-9">
      <span className="u-label">Touch exhibit · one</span>
      <h3 className="mt-3 text-[clamp(1.5rem,3vw,2.1rem)] font-700">
        Close someone&rsquo;s world and watch what happens
      </h3>
      <p className="mt-4 max-w-[58ch] text-[1.02rem] leading-[1.6] text-chalk-2">
        Constraint measures how far the people around you already know each
        other. Drag it up and the circle tightens, the ties turn strong, and
        outside opinion stops arriving. Two studies in this collection measured
        what that does.
      </p>

      <div className="mt-9 grid gap-9 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <svg viewBox="0 0 200 200" className="mx-auto w-full max-w-[300px]">
            {net.nodes.map((p, i) => {
              const k = tie();
              return (
                <line
                  key={`e${i}`}
                  x1={100}
                  y1={100}
                  x2={p.x}
                  y2={p.y}
                  stroke={
                    k === "strong"
                      ? "var(--color-tie-strong)"
                      : "var(--color-tie-weak)"
                  }
                  strokeWidth={k === "strong" ? 1.8 : 1.2}
                  strokeDasharray={k === "weak" ? "3 3" : undefined}
                />
              );
            })}
            {net.alterTies.map(([a, b], i) => {
              const k = tie();
              return (
                <line
                  key={`a${i}`}
                  x1={net.nodes[a].x}
                  y1={net.nodes[a].y}
                  x2={net.nodes[b].x}
                  y2={net.nodes[b].y}
                  stroke={
                    k === "strong"
                      ? "var(--color-tie-strong)"
                      : "var(--color-tie-weak)"
                  }
                  strokeWidth={k === "strong" ? 1.8 : 1.2}
                  strokeDasharray={k === "weak" ? "3 3" : undefined}
                  opacity={0.9}
                />
              );
            })}
            {net.nodes.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={5}
                fill="var(--color-wall)"
                stroke="var(--color-chalk-2)"
                strokeWidth={1.4}
              />
            ))}
            <circle cx={100} cy={100} r={7} fill="var(--color-chalk)" />
          </svg>

          <div className="mt-6">
            <label
              htmlFor="constraint"
              className="u-label mb-2 flex items-baseline justify-between"
            >
              <span>Constraint</span>
              <span className="u-num text-[1.1rem] text-brass">{c}</span>
            </label>
            <input
              id="constraint"
              type="range"
              min={MIN}
              max={MAX}
              value={c}
              onChange={(e) => setC(+e.target.value)}
              className="w-full accent-[var(--color-brass)]"
            />
            <div className="u-label mt-1 flex justify-between">
              <span>Open</span>
              <span>Close-knit</span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              { k: "Contacts", v: String(net.n) },
              { k: "Density", v: net.density.toFixed(2) },
              { k: "Effective size", v: net.effectiveSize.toFixed(1) },
            ].map((s) => (
              <div key={s.k} className="border-t border-line-wall pt-3">
                <div className="u-num text-[1.4rem] font-600 text-chalk">{s.v}</div>
                <div className="u-label mt-1">{s.k}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-line-wall pt-5">
            <div className="u-label mb-2">Getting to hospital · 2019 cohort</div>
            <p className="text-[1rem] leading-[1.55] text-chalk-2">
              {closed ? (
                <>
                  This is the shape of a{" "}
                  <span className="text-tie-strong">slow arriver</span>. In 175
                  stroke patients, those with small close-knit networks waited
                  past six hours — and{" "}
                  <span className="text-chalk">none of them</span> received the
                  clot-dissolving drug.
                </>
              ) : (
                <>
                  This is the shape of a{" "}
                  <span className="text-brass">fast arriver</span>. Someone in a
                  network like this was a stranger to the others, had no stake in
                  waiting, and said go. Half of this group got the clot-dissolving
                  drug.
                </>
              )}
            </p>
          </div>

          <div className="border-t border-line-wall pt-5">
            <div className="u-label mb-2">
              Network counselling · 2025 trial subgroup
            </div>
            <div className="flex items-baseline gap-3">
              <span
                className={`u-num text-[2rem] font-600 ${
                  bp < 0 ? "text-brass" : "text-tie-strong"
                }`}
              >
                {bp > 0 ? `+${bp}` : bp}
              </span>
              <span className="text-[0.98rem] leading-snug text-chalk-2">
                mmHg systolic, over three months
              </span>
            </div>
            <p className="mt-2 text-[0.98rem] leading-[1.5] text-chalk-3">
              {closed
                ? "Bringing this circle into the room worked. There was slack to take up."
                : "Bringing this circle into the room backfired. These patients already had the support the session was trying to build."}
            </p>
          </div>

          <p className="u-fine text-chalk-3 border-t border-line-wall pt-4  text-chalk-3">
            Anchored on real values: slow arrivers averaged 5 contacts at
            constraint 61, fast arrivers 8 at constraint 40. The blood pressure
            figures are the trial&rsquo;s two constraint subgroups, p = 0.03. The
            drawing between those anchors is an illustration, not data.
          </p>
        </div>
      </div>
    </div>
  );
}
