"use client";

import MinuteStrip from "./MinuteStrip";
import { PAPERS } from "@/lib/collection";

export default function Hero() {
  const years = `${PAPERS[0].year}–${PAPERS[PAPERS.length - 1].year}`;

  return (
    <header className="relative overflow-hidden pb-16 pt-6 sm:pb-24">
      <div className="u-shell">
        {/* the institution line, and what is currently on view */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-6">
          <span className="font-display text-[0.95rem] font-700 tracking-[0.14em] text-chalk uppercase">
            Reading&nbsp;Room
          </span>
          <span className="u-label">
            On view · SocialBit · {PAPERS.length} papers · {years}
          </span>
        </div>

        <div className="u-rail" />

        <div className="grid gap-x-14 gap-y-10 pt-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.85fr)] lg:pt-20">
          <div>
            <h1 className="text-[clamp(2.6rem,7.2vw,5.1rem)] font-700">
              Your folder has forty
              <br />
              papers in it.
              <br />
              <span className="text-chalk-2">You remember six.</span>
            </h1>
          </div>

          <div className="flex flex-col justify-end gap-7 pb-2">
            <p className="max-w-[46ch] text-[1.08rem] leading-[1.66] text-chalk-2">
              Point this at the folder and every paper comes back as an exhibit:
              what it asked, how it was actually run, the numbers that carry it,
              and what it does not prove. Read a decade in the time an abstract
              takes.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#collection"
                className="bg-brass px-6 py-3 font-display text-[0.92rem] font-600 tracking-tight text-wall transition-colors hover:bg-brass-2"
              >
                Walk the collection
              </a>
              <a
                href="#folder"
                className="border border-line-wall-2 px-6 py-3 font-display text-[0.92rem] font-600 tracking-tight text-chalk transition-colors hover:border-brass hover:text-brass"
              >
                Open your own folder
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* the first exhibit is the measurement itself */}
      <div className="u-shell pt-16 sm:pt-24">
        <div className="u-rail pt-8">
          <MinuteStrip
            minutes={240}
            lit={0.51}
            seed={41}
            height={54}
            animate
            title="A hospital day scored minute by minute. Lit ticks are minutes in which conversation was detected."
          />
          <div className="mt-3 flex items-baseline justify-between">
            <span className="u-label">09:00</span>
            <span className="u-label">17:00</span>
          </div>
          <p className="mt-6 max-w-[62ch] font-read text-[1.02rem] leading-[1.6] text-chalk-2">
            One stroke patient, one hospital day. Every lit tick is a minute a
            smartwatch heard conversation; every dark one is a minute alone.
            Across 153 patients this comes to{" "}
            <span className="u-num text-brass">88,918</span> minutes — the
            evidence the last paper in this collection is built from.
          </p>
        </div>
      </div>
    </header>
  );
}
