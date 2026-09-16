"use client";

import MinuteStrip from "./MinuteStrip";
import { PAPERS } from "@/lib/collection";

/** The institution line: the room's name, and what is currently on view. */
export function SiteBar() {
  const years = `${PAPERS[0].year}–${PAPERS[PAPERS.length - 1].year}`;
  return (
    <header className="u-shell pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-6">
        <h1 className="font-display text-[0.95rem] font-700 leading-normal tracking-[0.14em] text-chalk uppercase">
          Reading&nbsp;Room
        </h1>
        <span className="u-label">
          On view · SocialBit · {PAPERS.length} papers · {years}
        </span>
      </div>
    </header>
  );
}

/** The introduction to the collection, placed after the folder section. */
export default function Hero() {
  return (
    <section id="intro" aria-label="Introduction" className="pb-16 pt-4 sm:pb-24">
      <div className="u-shell">
        <div className="u-rail flex flex-col gap-8 pt-12 lg:pt-16">
          <p className="max-w-[40ch] font-read text-[clamp(1.4rem,2.8vw,2rem)] leading-[1.4] text-chalk">
            Point this at the folder and every paper comes back as an exhibit:
            what it asked, how it was actually run, the numbers that carry it,
            and what it does not prove. Glance at all eight papers in about
            four minutes.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#collection"
              className="bg-brass px-6 py-3 font-display text-[0.92rem] font-600 tracking-tight text-wall transition-colors hover:bg-brass-2"
            >
              Walk the collection
            </a>
          </div>
        </div>
      </div>

      {/* the measurement itself, drawn as an illustration */}
      <div className="u-shell pt-14 sm:pt-16">
        <div className="u-rail pt-8">
          <MinuteStrip
            minutes={480}
            lit={0.51}
            seed={41}
            height={54}
            animate
            title="An illustrative hospital day from 9am to 5pm, one tick per minute. Lit ticks are minutes with social interaction."
          />
          <div className="mt-3 flex items-baseline justify-between">
            <span className="u-label">09:00</span>
            <span className="u-label">17:00</span>
          </div>
          <p className="mt-6 max-w-[62ch] font-read text-[1.02rem] leading-[1.6] text-chalk-2">
            An illustration, not patient data: a simulated hospital day, one
            tick per minute, with social interaction in about half of them —
            the average the SocialBit validation study measured. Human coders
            scored <span className="u-num text-brass">88,918</span> real minutes
            this way across 153 stroke patients.
          </p>
        </div>
      </div>
    </section>
  );
}
