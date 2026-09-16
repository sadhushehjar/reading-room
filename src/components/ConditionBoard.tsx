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
      "The reference case. Most patients, most of the time, in an ordinary hospital room.",
  },
  {
    group: "Who is wearing it",
    label: "Aphasia",
    n: 24,
    sens: 0.82, spec: 0.87, bal: 0.84, auc: 0.93,
    reading:
      "The point of the whole project. Language impairment costs 6.8% of sensitivity and almost nothing in discrimination — these patients stay measurable.",
  },
  {
    group: "Who is wearing it",
    label: "Global aphasia",
    n: 7,
    sens: 0.73,
    reading:
      "The hardest case in the study, and the honest floor. When a patient produces almost no speech, there is less for the model to hear.",
  },
  {
    group: "What else is in the room",
    label: "Quiet room",
    n: 9252,
    sens: 0.87, spec: 0.92, bal: 0.90, auc: 0.95,
    reading:
      "No side conversation, no television. This is the model at its best.",
  },
  {
    group: "What else is in the room",
    label: "Side conversation",
    n: 4793,
    sens: 0.86, spec: 0.82, bal: 0.84, auc: 0.92,
    reading:
      "Two nurses talking to each other across the room. Sensitivity barely moves; specificity is what suffers, because the model counts speech that was not aimed at the patient.",
  },
  {
    group: "What else is in the room",
    label: "Television on",
    n: 4907,
    sens: 0.82, spec: 0.89, bal: 0.85, auc: 0.92,
    reading:
      "The opposite failure. A television makes the model cautious, so it misses real conversation rather than inventing it.",
  },
  {
    group: "How deep the conversation is",
    label: "A greeting",
    n: 325,
    sens: 0.55,
    reading:
      "Depth level 1. Nearly half of the briefest exchanges are missed. There is not enough sound in 'good morning' to be sure.",
  },
  {
    group: "How deep the conversation is",
    label: "Small talk",
    n: 1393,
    sens: 0.79,
    reading: "Depth level 2. Detection climbs fast once an exchange has turns in it.",
  },
  {
    group: "How deep the conversation is",
    label: "A real conversation",
    n: 3642,
    sens: 0.91,
    reading:
      "Depth level 3, and the most common kind in the data. Sustained speech is easy to hear.",
  },
  {
    group: "How deep the conversation is",
    label: "A long exchange",
    n: 1001,
    sens: 0.96,
    reading:
      "Depth level 4. Almost nothing at this length gets past the model.",
  },
  {
    group: "Where and on what",
    label: "Acute hospital",
    n: 12227,
    sens: 0.86, spec: 0.88, bal: 0.87, auc: 0.94,
    reading: "Brigham and Women's. The bulk of the dataset.",
  },
  {
    group: "Where and on what",
    label: "Rehabilitation",
    n: 1818,
    sens: 0.92, spec: 0.88, bal: 0.90, auc: 0.96,
    reading:
      "Spaulding. Better than the acute ward on every metric, probably because rehabilitation days contain longer, more deliberate conversation.",
  },
  {
    group: "Where and on what",
    label: "TicWatch Pro 3",
    n: 8448,
    sens: 0.87, spec: 0.89, bal: 0.88, auc: 0.94,
    reading:
      "One of the two watches used. Hardware turns out not to matter, which is what makes the method portable.",
  },
  {
    group: "Where and on what",
    label: "Galaxy Watch5 Pro",
    n: 5597,
    sens: 0.87, spec: 0.87, bal: 0.87, auc: 0.94,
    reading:
      "The other watch, and effectively the same result. Nothing here is tuned to one device.",
  },
  {
    group: "Who is talking",
    label: "Phone call",
    n: 907,
    sens: 0.91,
    reading:
      "The best modality in the study — better than in person. One voice close to the microphone with no competing room.",
  },
  {
    group: "Who is talking",
    label: "In person",
    n: 5566,
    sens: 0.87,
    reading: "The ordinary case, and the one the whole design is built around.",
  },
  {
    group: "Who is talking",
    label: "Not in English",
    n: 210,
    sens: 0.89,
    reading:
      "Slightly better than English, but from only 210 samples. The paper lists language as a limitation, not a strength.",
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
