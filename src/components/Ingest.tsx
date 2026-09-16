"use client";

import { useCallback, useRef, useState } from "react";
import { extractPdf, pdfsFromDataTransfer, type Extracted } from "@/lib/ingest";
import MinuteStrip from "./MinuteStrip";

/**
 * Your own folder.
 *
 * The demo collection is the finished product; this is the machine that makes
 * a first pass at one. It runs entirely in the page — no upload, no server —
 * and it is careful to claim only what it does: it finds the structure of a
 * paper. Writing the label is still a person's job.
 */

type Status = "idle" | "reading" | "done";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="u-label-ink mb-1">{label}</div>
      <div className="text-[0.95rem] leading-[1.5] text-ink-2">{children}</div>
    </div>
  );
}

function DraftCard({ x }: { x: Extracted }) {
  if (x.failed) {
    return (
      <article className="u-card p-6">
        <div className="u-label-ink">Could not open</div>
        <h4 className="mt-2 font-display text-[1.05rem] font-600 text-ink">
          {x.file}
        </h4>
        <p className="mt-2 border-l-2 border-tie-strong pl-3 text-[0.95rem] leading-[1.5] text-ink-2">
          {x.failed} Scanned PDFs with no text layer need optical character
          recognition before anything can read them.
        </p>
      </article>
    );
  }

  return (
    <article className="u-card flex flex-col p-6">
      <div className="u-label-ink flex items-center justify-between">
        <span className="u-num text-ink">{x.year ?? "year unknown"}</span>
        <span>
          {x.pages} pp · {x.minutes} min
        </span>
      </div>

      <h4 className="mt-3 font-display text-[1.1rem] font-700 leading-[1.15] text-ink">
        {x.title}
      </h4>

      {x.authors && (
        <p className="mt-2 text-[0.9rem] leading-[1.45] text-ink-3">{x.authors}</p>
      )}
      {(x.venue || x.doi) && (
        <p className="u-fine text-ink-3 mt-1.5 ">
          {x.venue}
          {x.venue && x.doi ? " · " : ""}
          {x.doi}
        </p>
      )}

      {x.abstract && (
        <p className="mt-4 line-clamp-4 font-read text-[0.98rem] leading-[1.5] text-ink-2">
          {x.abstract}
        </p>
      )}

      <div className="mt-5 space-y-4 border-t border-line-paper pt-4">
        {x.cohorts.length > 0 && (
          <Field label="Cohort sizes found">
            <span className="u-num">{x.cohorts.join("  ·  ")}</span>
          </Field>
        )}

        {x.claims.length > 0 && (
          <Field label="Numbers worth checking">
            <span className="u-num text-[0.88rem]">
              {x.claims.slice(0, 6).join("  ·  ")}
            </span>
          </Field>
        )}

        {x.sections.length > 0 && (
          <Field label="Structure">{x.sections.join(" → ")}</Field>
        )}

        <Field label="Contents">
          {x.figures} figure{x.figures === 1 ? "" : "s"}, {x.tables} table
          {x.tables === 1 ? "" : "s"}, {x.words.toLocaleString()} words
        </Field>

        {x.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {x.keywords.map((k) => (
              <span
                key={k}
                className="border border-line-paper px-2 py-0.5 font-mono text-[0.68rem] text-ink-3"
              >
                {k}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Ingest() {
  const [status, setStatus] = useState<Status>("idle");
  const [done, setDone] = useState<boolean[]>([]);
  const [results, setResults] = useState<Extracted[]>([]);
  const [current, setCurrent] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const run = useCallback(async (files: File[]) => {
    if (!files.length) return;
    // biggest papers last, so the first cards appear quickly
    const queue = files.slice(0, 60).sort((a, b) => a.size - b.size);

    setStatus("reading");
    setResults([]);
    setDone(new Array(queue.length).fill(false));

    const out: Extracted[] = [];
    for (let i = 0; i < queue.length; i++) {
      setCurrent(queue[i].name);
      const r = await extractPdf(queue[i]);
      out.push(r);
      setResults([...out]);
      setDone((d) => {
        const next = [...d];
        next[i] = true;
        return next;
      });
    }
    setCurrent("");
    setStatus("done");
  }, []);

  const ok = results.filter((r) => !r.failed);
  const totalMin = ok.reduce((n, r) => n + r.minutes, 0);

  return (
    <section id="folder" className="u-shell pb-24 pt-4">
      <div className="u-rail pt-10">
        <div className="grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
          <div>
            <span className="u-label">Your folder</span>
            <h2 className="mt-4 text-[clamp(2rem,4.6vw,3.2rem)] font-700">
              Point it at
              <br />
              your own PDFs.
            </h2>
          </div>
          <p className="max-w-[52ch] self-end text-[1.04rem] leading-[1.62] text-chalk-2">
            Choose a folder and every PDF in it is opened here, in this tab.
            Nothing is uploaded and nothing leaves the machine. What comes back
            is a draft label for each paper: what it is, how long it runs, the
            cohort sizes and the numbers worth checking.
          </p>
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={async (e) => {
          e.preventDefault();
          setDragging(false);
          run(await pdfsFromDataTransfer(e.dataTransfer));
        }}
        className={`mt-10 border border-dashed px-6 py-14 text-center transition-colors ${
          dragging ? "border-brass bg-wall-2" : "border-line-wall-2"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="sr-only"
          // a folder picker in browsers that support one; the rest get multi-select
          {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
          onChange={(e) => {
            const files = [...(e.target.files ?? [])].filter((f) =>
              /\.pdf$/i.test(f.name),
            );
            run(files);
          }}
        />

        {status === "reading" ? (
          <div className="mx-auto max-w-[520px]">
            <MinuteStrip pattern={done} height={30} />
            <p className="u-label mt-4">
              Reading {done.filter(Boolean).length} of {done.length}
            </p>
            <p className="mt-2 truncate font-read text-[1rem] text-chalk-2">
              {current}
            </p>
          </div>
        ) : (
          <>
            <button
              onClick={() => inputRef.current?.click()}
              className="bg-brass px-7 py-3.5 font-display text-[0.95rem] font-600 text-wall transition-colors hover:bg-brass-2"
            >
              Choose a folder
            </button>
            <p className="mt-4 font-read text-[1rem] text-chalk-3">
              or drop PDFs anywhere in this panel
            </p>
            {status === "done" && (
              <p className="u-label mt-4 text-brass">
                {ok.length} paper{ok.length === 1 ? "" : "s"} read ·{" "}
                {totalMin} minutes of reading found
              </p>
            )}
          </>
        )}
      </div>

      {results.length > 0 && (
        <>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((r, i) => (
              <DraftCard key={`${r.file}-${i}`} x={r} />
            ))}
          </div>

          <p className="mt-8 max-w-[64ch] border-l-2 border-brass pl-5 text-[1rem] leading-[1.6] text-chalk-2">
            These are draft labels. The page found the structure of each paper —
            its sections, cohorts, figures and reported numbers. It did not write
            the summaries. Every written label in the collection above came from
            reading the paper, and that is still the part a person does.
          </p>
        </>
      )}
    </section>
  );
}
