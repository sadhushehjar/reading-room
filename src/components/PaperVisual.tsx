"use client";

import { PAPERS } from "@/lib/collection";

/**
 * Every paper gets a picture.
 *
 * Where the paper is open access, the picture is the paper's own figure, shown
 * with attribution. Where it is not, the picture is drawn here from the numbers
 * the paper reports — the same data, redrawn, rather than a decorative stand-in.
 * Nothing in this file is invented; each drawing carries the figures it is
 * built from in its caption.
 *
 * Red is a strong tie and blue is a weak tie throughout, matching the legend
 * used in every network figure in the collection.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (p: string) => `${BASE}/${p.replace(/^\//, "")}`;

const INK = "var(--color-ink)";
const INK3 = "var(--color-ink-3)";
const STRONG = "var(--color-tie-strong)";
const WEAK = "var(--color-tie-weak)";
const BRASS = "#9a6f20"; // brass darkened for contrast on paper

/* ------------------------------------------------------------------ *
 *  shared network drawing
 * ------------------------------------------------------------------ */

type Node = { x: number; y: number; ego?: boolean };
type Tie = [number, number, "strong" | "weak"];

function Net({
  nodes,
  ties,
  r = 5.5,
}: {
  nodes: Node[];
  ties: Tie[];
  r?: number;
}) {
  return (
    <g>
      {ties.map(([a, b, kind], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke={kind === "strong" ? STRONG : WEAK}
          strokeWidth={kind === "strong" ? 1.7 : 1.3}
          strokeDasharray={kind === "weak" ? "3 2.5" : undefined}
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.ego ? r + 1 : r}
          fill={n.ego ? INK : "var(--color-paper)"}
          stroke={INK}
          strokeWidth={1.4}
        />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ *
 *  1 — two patients, same diagnosis, opposite structure
 *  Nature Reviews Neurology 2016, Fig. 4
 * ------------------------------------------------------------------ */

function TwoNetworks() {
  // Patient 1: size 4, density 1.0, constraint 0.77, effective size 1.0
  const p1: Node[] = [
    { x: 60, y: 62, ego: true },
    { x: 24, y: 26 },
    { x: 96, y: 26 },
    { x: 24, y: 98 },
    { x: 96, y: 98 },
  ];
  const p1Ties: Tie[] = [
    [0, 1, "strong"], [0, 2, "strong"], [0, 3, "strong"], [0, 4, "strong"],
    [1, 2, "strong"], [1, 3, "strong"], [1, 4, "strong"],
    [2, 3, "strong"], [2, 4, "strong"], [3, 4, "strong"],
  ];

  // Patient 2: size 5, density 0.6, constraint 0.54, effective size 3.0
  const p2: Node[] = [
    { x: 60, y: 62, ego: true },
    { x: 18, y: 22 },
    { x: 100, y: 18 },
    { x: 112, y: 84 },
    { x: 56, y: 112 },
    { x: 12, y: 78 },
  ];
  const p2Ties: Tie[] = [
    [0, 1, "strong"], [0, 2, "weak"], [0, 3, "weak"], [0, 4, "strong"], [0, 5, "strong"],
    [1, 5, "strong"], [2, 3, "weak"], [3, 4, "weak"], [4, 5, "strong"], [1, 2, "weak"],
  ];

  return (
    <svg viewBox="0 0 322 180" className="w-full">
      <g transform="translate(6,8)">
        <Net nodes={p1} ties={p1Ties} />
      </g>
      <g transform="translate(176,6)">
        <Net nodes={p2} ties={p2Ties} />
      </g>
      <g fontSize="7.5" fontFamily="var(--font-mono)" fill={INK3}>
        <text x="6" y="158">PATIENT 1</text>
        <text x="6" y="170" fill={INK}>density 1.0 · constraint 0.77</text>
        <text x="176" y="158">PATIENT 2</text>
        <text x="176" y="170" fill={INK}>density 0.6 · constraint 0.54</text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 *  4 — the network contracts, and gets healthier
 *  Neurorehabilitation and Neural Repair 2019
 * ------------------------------------------------------------------ */

function Contraction() {
  const ring = (cx: number, n: number, rad: number, unhealthy: number[]): Node[] =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      return { x: cx + Math.cos(a) * rad, y: 62 + Math.sin(a) * rad };
    });

  const before = ring(62, 8, 42, [1, 5]);
  const after = ring(216, 6, 32, []);

  const spokes = (nodes: Node[], ego: Node): Tie[] =>
    nodes.map((_, i) => [i + 1, 0, "strong"] as Tie);

  const ego = { x: 0, y: 62, ego: true };

  const beforeNodes = [{ ...ego, x: 62 }, ...before];
  const afterNodes = [{ ...ego, x: 216 }, ...after];

  return (
    <svg viewBox="0 0 300 168" className="w-full">
      <g>
        <Net
          nodes={beforeNodes}
          ties={[
            ...spokes(before, beforeNodes[0]),
            [1, 2, "weak"], [3, 4, "strong"], [5, 6, "weak"], [7, 8, "strong"],
          ]}
          r={5}
        />
        {/* the two contacts pruned over six months: a smoker and a non-exerciser */}
        {[2, 6].map((i) => (
          <circle
            key={i}
            cx={beforeNodes[i].x}
            cy={beforeNodes[i].y}
            r={9.5}
            fill="none"
            stroke={BRASS}
            strokeWidth={1.4}
            strokeDasharray="2.5 2"
          />
        ))}
      </g>

      <path
        d="M132 62 L166 62"
        stroke={INK3}
        strokeWidth={1.2}
        markerEnd="url(#arrow)"
      />
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={INK3} />
        </marker>
      </defs>

      <Net
        nodes={afterNodes}
        ties={[
          ...spokes(after, afterNodes[0]),
          [1, 2, "strong"], [2, 3, "strong"], [3, 4, "strong"], [4, 5, "strong"], [5, 6, "strong"], [6, 1, "strong"],
        ]}
        r={5}
      />

      <g fontSize="8.5" fontFamily="var(--font-mono)" fill={INK3}>
        <text x="16" y="150">AT STROKE</text>
        <text x="16" y="161" fill={INK}>larger, looser</text>
        <text x="176" y="150">SIX MONTHS ON</text>
        <text x="176" y="161" fill={INK}>−1.25 people, denser, kin</text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 *  5 — what actually decides health outcomes
 *  Seminars in Neurology 2022
 * ------------------------------------------------------------------ */

function Determinants() {
  const rows = [
    { label: "Socioeconomic factors and health behaviours", pct: 81 },
    { label: "Everything else measured", pct: 16 },
    { label: "Clinical care", pct: 3 },
  ];
  return (
    <svg viewBox="0 0 300 168" className="w-full">
      {rows.map((r, i) => {
        const y = 26 + i * 46;
        const w = (r.pct / 100) * 284;
        const lit = r.pct === 81 || r.pct === 3;
        return (
          <g key={r.label}>
            <rect
              x={8}
              y={y}
              width={Math.max(w, 2)}
              height={17}
              fill={r.pct === 81 ? BRASS : r.pct === 3 ? STRONG : "var(--color-paper-2)"}
            />
            <text
              x={8}
              y={y - 6}
              fontSize="9"
              fontFamily="var(--font-mono)"
              fill={lit ? INK : INK3}
            >
              {r.pct}%
            </text>
            <text
              x={8}
              y={y + 31}
              fontSize="9.5"
              fontFamily="var(--font-read)"
              fill={INK3}
            >
              {r.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 *  6 — the validation design: two independent records of the same minute
 *  BMJ Open 2023
 * ------------------------------------------------------------------ */

function Pipeline() {
  const box = (x: number, y: number, w: number, label: string, sub: string, accent?: boolean) => (
    <g key={label}>
      <rect
        x={x}
        y={y}
        width={w}
        height={34}
        fill="none"
        stroke={accent ? BRASS : INK3}
        strokeWidth={accent ? 1.6 : 1}
      />
      <text x={x + 9} y={y + 15} fontSize="9.5" fontFamily="var(--font-display)" fontWeight="600" fill={INK}>
        {label}
      </text>
      <text x={x + 9} y={y + 27} fontSize="8" fontFamily="var(--font-mono)" fill={INK3}>
        {sub}
      </text>
    </g>
  );

  return (
    <svg viewBox="0 0 300 168" className="w-full">
      {/* the watch's record */}
      {box(8, 16, 86, "Watch", "ambient audio")}
      {box(106, 16, 86, "Features", "no raw audio")}
      {box(204, 16, 88, "Minute label", "interaction?", true)}
      <path d="M94 33 L106 33 M192 33 L204 33" stroke={INK3} strokeWidth={1} markerEnd="url(#arrow2)" />

      {/* the human record */}
      {box(8, 106, 86, "Livestream", "video of the room")}
      {box(106, 106, 86, "Human coder", "minute by minute")}
      {box(204, 106, 88, "Ground truth", "88,918 min", true)}
      <path d="M94 123 L106 123 M192 123 L204 123" stroke={INK3} strokeWidth={1} markerEnd="url(#arrow2)" />

      {/* the comparison */}
      <path d="M248 50 L248 106" stroke={BRASS} strokeWidth={1.6} strokeDasharray="3 3" />
      <text x="256" y="82" fontSize="9" fontFamily="var(--font-mono)" fill={BRASS}>
        compare
      </text>

      <defs>
        <marker id="arrow2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={INK3} />
        </marker>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 *  7 — the same intervention, opposite results
 *  Social Science & Medicine 2025, Table 4
 * ------------------------------------------------------------------ */

function SubgroupFlip() {
  const mid = 84; // zero line
  const scale = 2.6; // px per mmHg
  const bars = [
    { label: "Closed networks", sub: "high constraint", v: -12.4, x: 40 },
    { label: "Open networks", sub: "low constraint", v: +16.1, x: 176 },
  ];
  return (
    <svg viewBox="0 0 300 168" className="w-full">
      <line x1={8} y1={mid} x2={292} y2={mid} stroke={INK3} strokeWidth={1} />
      <text x={8} y={mid - 5} fontSize="8" fontFamily="var(--font-mono)" fill={INK3}>
        0 mmHg
      </text>

      {bars.map((b) => {
        const h = Math.abs(b.v) * scale;
        const y = b.v < 0 ? mid : mid - h;
        const good = b.v < 0; // lower blood pressure is the win
        return (
          <g key={b.label}>
            <rect
              x={b.x}
              y={y}
              width={84}
              height={h}
              fill={good ? BRASS : STRONG}
            />
            <text
              x={b.x + 42}
              y={good ? y + h + 15 : y - 7}
              fontSize="12"
              fontFamily="var(--font-mono)"
              fontWeight="600"
              textAnchor="middle"
              fill={good ? BRASS : STRONG}
            >
              {b.v > 0 ? `+${b.v}` : b.v}
            </text>
            <text
              x={b.x + 42}
              y={good ? y + h + 30 : y - 21}
              fontSize="9"
              fontFamily="var(--font-display)"
              fontWeight="600"
              textAnchor="middle"
              fill={INK}
            >
              {b.label}
            </text>
            <text
              x={b.x + 42}
              y={good ? y + h + 41 : y - 32}
              fontSize="8"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
              fill={INK3}
            >
              {b.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */

const DRAWN: Record<string, { node: React.ReactNode; caption: string }> = {
  "theory-2016": {
    node: <TwoNetworks />,
    caption:
      "Two stroke patients with the same diagnosis and opposite social structure. Drawn from the metrics reported in Fig. 4.",
  },
  "recovery-2019": {
    node: <Contraction />,
    caption:
      "What six months after a stroke does to a network. Drawn from the reported change of −1.25 people, rising density and pruned unhealthy ties.",
  },
  "gaps-2022": {
    node: <Determinants />,
    caption:
      "The share of health outcomes attributable to each source, from the nation-wide study the review cites.",
  },
  "protocol-2023": {
    node: <Pipeline />,
    caption:
      "The validation design: two independent records of the same minute, compared against each other.",
  },
  "trial-2025": {
    node: <SubgroupFlip />,
    caption:
      "Systolic blood pressure change by network type, from the subgroup analysis in Table 4. p = 0.03.",
  },
};

export function hasVisual(paperId: string) {
  const p = PAPERS.find((x) => x.id === paperId);
  return Boolean(p?.figures.length || DRAWN[paperId]);
}

/** The lead visual for a paper: its own figure if the licence allows, else a
 *  drawing made from its numbers. */
export default function PaperVisual({
  paperId,
  className = "",
  showCaption = true,
}: {
  paperId: string;
  className?: string;
  showCaption?: boolean;
}) {
  const paper = PAPERS.find((p) => p.id === paperId);
  if (!paper) return null;

  const fig = paper.figures[0];

  if (fig) {
    return (
      <figure className={className}>
        <div className="bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(fig.src)} alt={fig.alt} loading="lazy" className="w-full" />
        </div>
        {showCaption && (
          <figcaption className="u-fine text-ink-3 mt-3 ">
            {fig.credit}
          </figcaption>
        )}
      </figure>
    );
  }

  const drawn = DRAWN[paperId];
  if (!drawn) return null;

  return (
    <figure className={className}>
      <div className="bg-white p-4">{drawn.node}</div>
      {showCaption && (
        <figcaption className="u-fine text-ink-3 mt-3 ">
          Drawn for this exhibit. {drawn.caption}
        </figcaption>
      )}
    </figure>
  );
}
