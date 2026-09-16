"use client";

import { useState } from "react";

/**
 * Touchable exhibit 2 — where the sensor strains.
 *
 * The validation paper breaks its accuracy down across eleven dimensions, in
 * three dense tables. That is the most useful part of the paper and the least
 * readable. Here each condition is one thing you can touch.
 *
 * Every number is quoted from Tables 2, 3, 4 and 5 of Dhand et al., Scientific
 * Reports 2026. They are marginal results reported separately, so the exhibit
 * never combines two conditions — that would be inventing a number the study
 * never measured.
 */

type Cond = {
  group: string;
  label: string;
  n: number;
  sens: number;
  spec?: number;
  bal?: number;
  auc?: number;
  reading: string;
};

const BASELINE = { sens: 0.87, spec: 0.88, bal: 0.87, auc: 0.94 };

const CONDITIONS: Cond[] = [
  {
    group: "Who is wearing it",
    label: "No aphasia",
    n: 129,
    sens: 0.88, spec: 0.89, bal: 0.88, auc: 0.94,
    reading:
      "The comparison group for aphasia: 129 patients.",
  },
  {
    group: "Who is wearing it",
    label: "Aphasia",
    n: 24,
    sens: 0.82, spec: 0.87, bal: 0.84, auc: 0.93,
    reading:
      "Language impairment costs 6.8% of sensitivity and only 1.1% of AUC, so these patients stay measurable.",
  },
  {
    group: "Who is wearing it",
    label: "Global aphasia",
    n: 7,
    sens: 0.73,
    reading:
      "The lowest sensitivity for any patient group, from 7 patients. The authors suggest patients with aphasia contribute less speech and have briefer interactions.",
  },
  {
    group: "What else is in the room",
    label: "No side conversation",
    n: 9252,
    sens: 0.87, spec: 0.92, bal: 0.90, auc: 0.95,
    reading:
      "The comparison case for side conversations. Specificity is highest here, at 0.92.",
  },
  {
    group: "What else is in the room",
    label: "Side conversation",
    n: 4793,
    sens: 0.86, spec: 0.82, bal: 0.84, auc: 0.92,
    reading:
      "Other people talking nearby. Sensitivity barely moves, but specificity falls to 0.82, so more minutes without interaction are counted as interaction.",
  },
  {
    group: "What else is in the room",
    label: "Television on",
    n: 4907,
    sens: 0.82, spec: 0.89, bal: 0.85, auc: 0.92,
    reading:
      "The paper reports television sound mainly lowers sensitivity, so some real interactions are missed.",
  },
  {
    group: "How deep the conversation is",
    label: "Depth 1, e.g. greetings",
    n: 325,
    sens: 0.55,
    reading:
      "The shallowest exchanges; 45% are missed. The authors note shallow interactions such as greetings were harder to detect.",
  },
  {
    group: "How deep the conversation is",
    label: "Depth 2",
    n: 1393,
    sens: 0.79,
    reading:
      "Sensitivity rises with conversational depth.",
  },
  {
    group: "How deep the conversation is",
    label: "Depth 3",
    n: 3642,
    sens: 0.91,
    reading:
      "The most common depth in the data, with 3,642 samples.",
  },
  {
    group: "How deep the conversation is",
    label: "Depth 4",
    n: 1001,
    sens: 0.96,
    reading:
      "The authors note deeper exchanges produce sustained audio features that help detection.",
  },
  {
    group: "Where and on what",
    label: "Acute hospital",
    n: 12227,
    sens: 0.86, spec: 0.88, bal: 0.87, auc: 0.94,
    reading:
      "Brigham and Women’s Hospital, 12,227 of the 14,045 samples.",
  },
  {
    group: "Where and on what",
    label: "Rehabilitation",
    n: 1818,
    sens: 0.92, spec: 0.88, bal: 0.90, auc: 0.96,
    reading:
      "Spaulding Rehabilitation Hospital, 1,818 samples. Sensitivity, balanced accuracy and AUC are higher than in the acute hospital; specificity is the same.",
  },
  {
    group: "Where and on what",
    label: "TicWatch Pro 3",
    n: 8448,
    sens: 0.87, spec: 0.89, bal: 0.88, auc: 0.94,
    reading:
      "One of two watch models. The paper reports equivalent performance across devices.",
  },
  {
    group: "Where and on what",
    label: "Galaxy Watch5 Pro",
    n: 5597,
    sens: 0.87, spec: 0.87, bal: 0.87, auc: 0.94,
    reading:
      "The other watch model, with near-identical results.",
  },
  {
    group: "Who is talking",
    label: "Phone call",
    n: 907,
    sens: 0.91,
    reading:
      "The highest sensitivity of the three ways of talking, from 907 samples.",
  },
  {
    group: "Who is talking",
    label: "In person",
    n: 5566,
    sens: 0.87,
    reading:
      "The most common way of talking in the data, with 5,566 samples.",
  },
  {
    group: "Who is talking",
    label: "Not in English",
    n: 210,
    sens: 0.89,
    reading:
      "Slightly higher than English, but from only 210 samples. The paper lists mostly-English data as a limitation.",
  },
];

const GROUPS = Array.from(new Set(CONDITIONS.map((c) => c.group)));

function Bar({
  label,
  value,
  base,
}: {
  label: string;
  value?: number;
  base: number;
}) {
  if (value === undefined) return null;
  const delta = value - base;
  const worse = delta < -0.015;
  return (
    <div>
      <div className="u-label mb-1.5 flex items-baseline justify-between">
        <span>{label}</span>
        <span className="u-num text-[0.95rem] text-chalk">
          {value.toFixed(2)}
        </span>
      </div>
      <div className="relative h-2 bg-wall-3">
        {/* where the model sits overall, for comparison */}
        <div
          className="absolute top-[-3px] h-[14px] w-px bg-chalk-3"
          style={{ left: `${base * 100}%` }}
          aria-hidden
        />
        <div
          className="h-full transition-[width] duration-500 ease-[var(--ease-gallery)]"
          style={{
            width: `${value * 100}%`,
            background: worse ? "var(--color-tie-strong)" : "var(--color-brass)",
          }}
        />
      </div>
    </div>
  );
}

export default function ConditionBoard() {
  const [sel, setSel] = useState(CONDITIONS[1]); // open on aphasia — the point

  return (
    <div className="u-panel p-6 sm:p-9">
      <span className="u-label">Touch exhibit · two</span>
      <h3 className="mt-3 text-[clamp(1.5rem,3vw,2.1rem)] font-700">
        Where the watch strains
      </h3>
      <p className="mt-4 max-w-[58ch] text-[1.02rem] leading-[1.6] text-chalk-2">
        A single accuracy number hides everything worth knowing. The validation
        paper breaks it down across eleven dimensions in three dense tables.
        Pick a condition and read what it costs.
      </p>

      <div className="mt-9 grid gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
        <div className="space-y-6">
          {GROUPS.map((g) => (
            <div key={g}>
              <div className="u-label mb-2.5">{g}</div>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.filter((c) => c.group === g).map((c) => (
                  <button
                    key={c.label}
                    onClick={() => setSel(c)}
                    aria-pressed={sel.label === c.label}
                    className={`border px-3 py-1.5 font-display text-[0.85rem] font-500 transition-colors ${
                      sel.label === c.label
                        ? "border-brass bg-brass text-wall"
                        : "border-line-wall-2 text-chalk-2 hover:border-brass hover:text-brass"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-line-wall pt-6 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0">
          <div className="u-label">
            {sel.group} · n = {sel.n.toLocaleString()}
          </div>
          <h4 className="mt-2 text-[1.4rem] font-700 text-chalk">{sel.label}</h4>

          <div className="mt-6 space-y-4">
            <Bar label="Sensitivity" value={sel.sens} base={BASELINE.sens} />
            <Bar label="Specificity" value={sel.spec} base={BASELINE.spec} />
            <Bar label="Balanced accuracy" value={sel.bal} base={BASELINE.bal} />
            <Bar label="Area under the curve" value={sel.auc} base={BASELINE.auc} />
          </div>

          {sel.spec === undefined && (
            <p className="u-fine text-chalk-3 mt-4  text-chalk-3">
              Only sensitivity is reported for this dimension. Those annotations
              exist for real interactions, so there is no negative case to score
              specificity against.
            </p>
          )}

          <p className="mt-6 border-t border-line-wall pt-5 font-read text-[1.06rem] leading-[1.58] text-chalk-2">
            {sel.reading}
          </p>

          <p className="u-fine text-chalk-3 mt-5 flex items-center gap-2  text-chalk-3">
            <span aria-hidden className="inline-block h-3 w-px bg-chalk-3" />
            The tick on each bar is the model overall: 0.87 sensitivity, 0.88
            specificity, 0.94 AUC.
          </p>
        </div>
      </div>
    </div>
  );
}
