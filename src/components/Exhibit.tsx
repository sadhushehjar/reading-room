"use client";

import { useEffect, useRef, useState } from "react";
import { byId, LINK_LABEL, type Depth, type Paper } from "@/lib/collection";
import PaperVisual, { asset } from "./PaperVisual";

/**
 * The reading desk.
 *
 * Objects hang on a dark wall; when you take one down to read it, it lands on
 * paper under a lamp. The depth control is the audio-guide dial: thirty seconds,
 * two minutes, or the whole label.
 */

const DEPTHS: { id: Depth; label: string; time: string }[] = [
  { id: "glance", label: "Glance", time: "30 sec" },
  { id: "brief", label: "Brief", time: "2 min" },
  { id: "full", label: "Full", time: "5–7 min" },
];

function StatTile({
  value,
  label,
  note,
  large = false,
}: {
  value: string;
  label: string;
  note?: string;
  large?: boolean;
}) {
  return (
    <div className="border-t border-line-paper pt-3">
      <div
        className={`u-num font-600 leading-none text-ink ${
          large ? "text-[clamp(2rem,5vw,3.2rem)]" : "text-[1.55rem]"
        }`}
      >
        {value}
      </div>
      <div className="mt-2 font-display text-[0.86rem] font-600 leading-snug text-ink">
        {label}
      </div>
      {note && (
        <p className="mt-1.5 text-[0.92rem] leading-[1.55] text-ink-3">{note}</p>
      )}
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line-paper pt-7">
      <h3 className="u-label-ink mb-4">{label}</h3>
      {children}
    </section>
  );
}

export default function Exhibit({
  paper,
  onClose,
  onOpen,
}: {
  paper: Paper;
  onClose: () => void;
  onOpen: (id: string) => void;
}) {
  const [depth, setDepth] = useState<Depth>("brief");
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // the page keys this component on the paper id, so a different object always
  // arrives as a fresh mount — depth resets to "brief" on its own and this only
  // has to move the focus
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    document.body.dataset.locked = "true";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      delete document.body.dataset.locked;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const showBrief = depth !== "glance";
  const showFull = depth === "full";

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-center bg-wall/85 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={scrollRef}
        role="dialog"
        aria-modal="true"
        aria-label={paper.title}
        className="u-card my-0 h-full w-full max-w-[980px] overflow-y-auto sm:my-6 sm:h-[calc(100%-3rem)]"
      >
        {/* ---- sticky bar: where you are, how much to read, the way out ---- */}
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line-paper bg-paper/95 px-5 py-3 backdrop-blur sm:px-10">
          <div className="u-label-ink hidden items-center gap-2 md:flex">
            <span className="u-num text-ink">{paper.year}</span>
            <span aria-hidden>·</span>
            <span className="text-ink">{paper.role}</span>
          </div>

          <div
            className="inline-flex overflow-hidden border border-line-paper"
            role="group"
            aria-label="How much to read"
          >
            {DEPTHS.map((d) => (
              <button
                key={d.id}
                onClick={() => setDepth(d.id)}
                aria-pressed={depth === d.id}
                className={`px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.12em] uppercase transition-colors ${
                  depth === d.id ? "bg-ink text-paper" : "text-ink-3 hover:text-ink"
                }`}
              >
                {d.label}
                <span className="ml-1.5 hidden opacity-60 sm:inline">{d.time}</span>
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-4">
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[0.68rem] tracking-[0.12em] text-ink-3 uppercase underline decoration-line-paper underline-offset-4 transition-colors hover:text-ink"
            >
              Paper ↗
            </a>
            <button
              ref={closeRef}
              onClick={onClose}
              className="px-1 py-1 font-mono text-[0.68rem] tracking-[0.16em] text-ink-3 uppercase transition-colors hover:text-ink"
            >
              Close ✕
            </button>
          </div>
        </div>

        {/* ---- body ---- */}
        <div className="space-y-8 px-5 pb-20 pt-8 sm:px-10">
          <div>
            <div className="u-label-ink flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="u-num text-ink">{paper.year}</span>
              <span aria-hidden>·</span>
              <span>{paper.kind}</span>
              <span aria-hidden>·</span>
              <span className="text-ink">{paper.role}</span>
            </div>
            <h2 className="mt-3 max-w-[34ch] text-[clamp(1.5rem,3.4vw,2.25rem)] font-700 text-ink">
              {paper.title}
            </h2>
            <p className="u-fine mt-3 max-w-[80ch] text-ink-3">{paper.authors}</p>
          </div>

          <p className="max-w-[54ch] font-read text-[1.22rem] leading-[1.55] text-ink">
            {paper.glance}
          </p>

          <div className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] sm:items-start">
            <div>
              <StatTile {...paper.headline} large />
              <p className="u-fine mt-5 text-ink-3">
                {paper.venue}
                <br />
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-line-paper underline-offset-4 hover:text-ink"
                >
                  doi:{paper.doi}
                </a>
              </p>
            </div>
            <PaperVisual paperId={paper.id} />
          </div>

          {showBrief && (
            <>
              <Section label="What it asked">
                <p className="max-w-[62ch] text-[1.04rem] leading-[1.62] text-ink-2">
                  {paper.question}
                </p>
              </Section>

              <Section label="How it was run">
                <p className="max-w-[62ch] text-[1.04rem] leading-[1.62] text-ink-2">
                  {paper.method}
                </p>
              </Section>

              <Section label="What it found">
                <p className="max-w-[62ch] text-[1.04rem] leading-[1.62] text-ink-2">
                  {paper.finding}
                </p>
              </Section>

              <Section label="What it does not prove">
                <p className="max-w-[62ch] border-l-2 border-tie-strong pl-4 text-[1.04rem] leading-[1.62] text-ink-2">
                  {paper.caveat}
                </p>
              </Section>
            </>
          )}

          {showFull && (
            <>
              <Section label="The numbers">
                <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  {paper.stats.map((s) => (
                    <StatTile key={s.label} {...s} />
                  ))}
                </div>
              </Section>

              <Section label="Step by step">
                <ol className="grid gap-5 sm:grid-cols-2">
                  {paper.procedure.map((p, i) => (
                    <li key={p.label} className="flex gap-4">
                      <span className="u-num mt-0.5 shrink-0 text-[0.8rem] text-ink-3">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <div className="font-display text-[0.95rem] font-600 text-ink">
                          {p.label}
                        </div>
                        <p className="mt-1 text-[0.98rem] leading-[1.55] text-ink-2">
                          {p.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Section>

              {paper.figures.length > 1 && (
                <Section label="From the paper">
                  <div className="space-y-10">
                    {paper.figures.slice(1).map((f) => (
                      <figure key={f.src}>
                        <div className="bg-white p-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={asset(f.src)}
                            alt={f.alt}
                            loading="lazy"
                            className="w-full"
                          />
                        </div>
                        <figcaption className="mt-3 max-w-[62ch]">
                          <p className="text-[1rem] leading-[1.58] text-ink-2">
                            {f.reading}
                          </p>
                          <p className="u-fine text-ink-3 mt-2 ">
                            {f.credit}
                          </p>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </Section>
              )}

              {paper.figures[0] && (
                <Section label="How to read the figure above">
                  <p className="max-w-[62ch] text-[1.04rem] leading-[1.62] text-ink-2">
                    {paper.figures[0].reading}
                  </p>
                </Section>
              )}

              <Section label="Limitations">
                <ul className="max-w-[68ch] space-y-3">
                  {paper.limitations.map((l) => (
                    <li key={l} className="flex gap-3 text-[1rem] leading-[1.58] text-ink-2">
                      <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-tie-strong" />
                      {l}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section label="Why it matters here">
                <p className="max-w-[62ch] font-read text-[1.12rem] leading-[1.58] text-ink">
                  {paper.soWhat}
                </p>
              </Section>

              <Section label="How it connects">
                <ul className="max-w-[70ch] space-y-4">
                  {paper.connections.map((c) => {
                    const t = byId(c.to);
                    return (
                      <li key={c.to}>
                        <button
                          onClick={() => onOpen(c.to)}
                          className="group text-left"
                        >
                          <span className="u-label-ink">{LINK_LABEL[c.kind]}</span>
                          <span className="mt-1 block font-display text-[1rem] font-600 text-ink underline decoration-line-paper underline-offset-4 group-hover:decoration-ink">
                            {t.year} · {t.title}
                          </span>
                          <span className="mt-1 block max-w-[58ch] text-[0.98rem] leading-[1.55] text-ink-2">
                            {c.why}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Section>
            </>
          )}

          {/* read next is always on — it is the point of the room */}
          <Section label="Read next">
            <div className="grid gap-4 sm:grid-cols-2">
              {paper.readNext.map((r) => {
                const t = byId(r.to);
                return (
                  <button
                    key={r.to}
                    onClick={() => onOpen(r.to)}
                    className="group border border-line-paper p-5 text-left transition-colors hover:border-ink"
                  >
                    <div className="u-label-ink flex items-center justify-between">
                      <span>{t.year} · {t.kind}</span>
                      <span className="u-num">{t.minutes} min</span>
                    </div>
                    <div className="mt-2 font-display text-[1.02rem] font-600 leading-snug text-ink">
                      {t.title}
                    </div>
                    <p className="mt-2 text-[0.96rem] leading-[1.5] text-ink-2">
                      {r.why}
                    </p>
                    <span className="mt-3 inline-block font-mono text-[0.7rem] tracking-[0.14em] text-ink-3 uppercase group-hover:text-ink">
                      Open →
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          {depth !== "full" && (
            <button
              onClick={() => setDepth("full")}
              className="w-full border border-line-paper px-6 py-4 font-display text-[0.95rem] font-600 text-ink transition-colors hover:border-ink"
            >
              Read the full label: numbers, method and limitations
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
