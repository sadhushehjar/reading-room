"use client";

import { PAPERS, ROUTES, type Paper } from "@/lib/collection";
import PaperVisual from "./PaperVisual";
import MinuteStrip from "./MinuteStrip";
import { useState } from "react";

/**
 * The wall.
 *
 * One plate per paper, full width, label on the left and the picture on the
 * right — a framed work with its wall text beside it. Uniform width is not
 * only calmer than a mixed grid, it survives the route filters: any subset of
 * the collection tiles without leaving holes.
 */

function Card({
  paper,
  onOpen,
  index,
}: {
  paper: Paper;
  onOpen: (id: string) => void;
  index: number;
}) {
  return (
    <article
      data-reveal
      style={
        { "--reveal-delay": `${Math.min(index, 4) * 60}ms` } as React.CSSProperties
      }
    >
      <button
        onClick={() => onOpen(paper.id)}
        className="u-card group block w-full p-6 text-left transition-transform duration-500 ease-[var(--ease-gallery)] hover:-translate-y-1 sm:p-8"
      >
        <div className="grid gap-7 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] sm:items-center sm:gap-10">
          <div>
            <div className="u-label-ink flex items-center gap-3">
              <span className="u-num text-ink">{paper.year}</span>
              <span aria-hidden>·</span>
              <span>{paper.kind}</span>
              <span aria-hidden>·</span>
              <span className="text-ink">{paper.role}</span>
            </div>

            <h3 className="mt-3 max-w-[26ch] text-[clamp(1.3rem,2.4vw,1.8rem)] font-700 leading-[1.08] text-ink">
              {paper.title}
            </h3>

            <p className="mt-4 max-w-[48ch] font-read text-[1.04rem] leading-[1.55] text-ink-2">
              {paper.glance}
            </p>

            <div className="mt-6 flex items-end justify-between gap-6 border-t border-line-paper pt-4">
              <div>
                <div className="u-num text-[1.6rem] font-600 leading-none text-ink">
                  {paper.headline.value}
                </div>
                <div className="mt-1.5 max-w-[28ch] font-display text-[0.82rem] font-600 leading-snug text-ink-3">
                  {paper.headline.label}
                </div>
              </div>
              <span className="shrink-0 font-mono text-[0.7rem] tracking-[0.14em] text-ink-3 uppercase group-hover:text-ink">
                {paper.minutes} min →
              </span>
            </div>
          </div>

          <PaperVisual paperId={paper.id} showCaption={false} />
        </div>
      </button>
    </article>
  );
}

export default function Gallery({ onOpen }: { onOpen: (id: string) => void }) {
  const [route, setRoute] = useState("full");
  const active = ROUTES.find((r) => r.id === route)!;
  const shown = PAPERS.filter((p) => active.steps.includes(p.id));
  const minutes = shown.reduce((n, p) => n + p.minutes, 0);
  const pages = shown.reduce((n, p) => n + p.pages, 0);

  return (
    <section id="collection" className="u-shell pb-24 pt-16 sm:pt-20">
      <div className="u-rail pt-10">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="u-label">The collection</h2>
            <p className="mt-4 max-w-[56ch] text-[1.04rem] leading-[1.62] text-chalk-2">
              Eight papers by Amar Dhand and collaborators, published between
              2016 and 2026, in publication order. Pick how much time you have.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2">
              {ROUTES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRoute(r.id)}
                  aria-pressed={route === r.id}
                  className={`border px-4 py-2 font-mono text-[0.7rem] tracking-[0.12em] uppercase transition-colors ${
                    route === r.id
                      ? "border-brass bg-brass text-wall"
                      : "border-line-wall-2 text-chalk-2 hover:border-brass hover:text-brass"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <MinuteStrip
                minutes={minutes}
                lit={1}
                seed={3}
                height={14}
                className="w-[140px] shrink-0"
              />
              <span className="font-mono text-[0.74rem] text-chalk-3">
                {active.blurb} · {shown.length} paper
                {shown.length === 1 ? "" : "s"} · {minutes} min here, against{" "}
                {pages} pages in print.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-5">
        {shown.map((p, i) => (
          <Card key={p.id} paper={p} index={i} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}
