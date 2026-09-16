"use client";

import { useState } from "react";
import { PAPERS, COHORTS } from "@/lib/collection";

/**
 * The whole collection, read across instead of down.
 *
 * Two views, because two questions come up in every lab meeting: what is this
 * built on, and what does it still not show. The second one is deliberately not
 * hidden behind a click on each paper — a collection that only surfaces its
 * findings is a sales brochure.
 */

const VIEWS = [
  { id: "evidence", label: "What it rests on" },
  { id: "caveats", label: "What none of it proves" },
] as const;

export default function Synthesis({ onOpen }: { onOpen: (id: string) => void }) {
  const [view, setView] = useState<(typeof VIEWS)[number]["id"]>("evidence");

  const totalLimits = PAPERS.reduce((n, p) => n + p.limitations.length, 0);

  return (
    <section id="across" className="u-shell pb-24 pt-4">
      <div className="u-rail pt-10">
        <div className="grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
          <div>
            <span className="u-label">Across the collection</span>
            <h2 className="mt-4 text-[clamp(2rem,4.6vw,3.2rem)] font-700">
              Read it
              <br />
              sideways.
            </h2>
          </div>
          <div className="flex flex-col justify-end gap-5">
            <p className="max-w-[52ch] text-[1.04rem] leading-[1.62] text-chalk-2">
              Ten years of work rests on four cohorts and one review. Reading
              across the columns shows the load each one carries — and the{" "}
              <span className="u-num text-chalk">{totalLimits}</span> caveats
              the authors put in print themselves.
            </p>
            <div className="flex flex-wrap gap-2">
              {VIEWS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  aria-pressed={view === v.id}
                  className={`border px-4 py-2 font-mono text-[0.7rem] tracking-[0.12em] uppercase transition-colors ${
                    view === v.id
                      ? "border-brass bg-brass text-wall"
                      : "border-line-wall-2 text-chalk-2 hover:border-brass hover:text-brass"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {view === "evidence" ? (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line-wall-2">
                {["Year", "Role", "People", "Design", "Setting", "The finding"].map(
                  (h) => (
                    <th key={h} className="u-label pb-3 pr-6 align-bottom font-normal">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {PAPERS.map((p) => {
                const c = COHORTS[p.id];
                return (
                  <tr
                    key={p.id}
                    onClick={() => onOpen(p.id)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && onOpen(p.id)}
                    className="cursor-pointer border-b border-line-wall align-top transition-colors hover:bg-wall-2"
                  >
                    <td className="u-num py-4 pr-6 text-chalk">{p.year}</td>
                    <td className="py-4 pr-6 font-display text-[0.95rem] font-600 text-chalk">
                      {p.role}
                    </td>
                    <td className="u-num py-4 pr-6 text-brass">{c.n}</td>
                    <td className="py-4 pr-6 text-[0.94rem] text-chalk-2">
                      {c.design}
                    </td>
                    <td className="py-4 pr-6 text-[0.94rem] text-chalk-3">
                      {c.setting}
                    </td>
                    <td className="max-w-[34ch] py-4 text-[0.94rem] leading-[1.5] text-chalk-2">
                      {p.finding}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {PAPERS.map((p) => (
            <div key={p.id} className="u-panel p-6">
              <button
                onClick={() => onOpen(p.id)}
                className="u-label text-left hover:text-brass"
              >
                {p.year} · {p.role} ↗
              </button>
              <ul className="mt-4 space-y-2.5">
                {p.limitations.map((l) => (
                  <li
                    key={l}
                    className="flex gap-3 text-[0.96rem] leading-[1.5] text-chalk-2"
                  >
                    <span
                      aria-hidden
                      className="mt-2.5 h-px w-3.5 shrink-0 bg-tie-strong"
                    />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
