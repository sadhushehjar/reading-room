"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import ConnectionMap from "@/components/ConnectionMap";
import ConstraintDial from "@/components/ConstraintDial";
import ConditionBoard from "@/components/ConditionBoard";
import Ingest from "@/components/Ingest";
import Synthesis from "@/components/Synthesis";
import Exhibit from "@/components/Exhibit";
import Reveal from "@/components/Reveal";
import { PAPERS } from "@/lib/collection";

export default function Page() {
  const [openId, setOpenId] = useState<string | null>(null);
  const paper = openId ? PAPERS.find((p) => p.id === openId) ?? null : null;

  return (
    <main>
      <Reveal />
      <Hero />
      <Gallery onOpen={setOpenId} />
      <ConnectionMap onOpen={setOpenId} />

      <section id="touch" className="u-shell pb-24 pt-4">
        <div className="u-rail pt-10">
          <div className="grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
            <div>
              <span className="u-label">Touch exhibits</span>
              <h2 className="mt-4 text-[clamp(2rem,4.6vw,3.2rem)] font-700">
                Two things
                <br />
                worth handling.
              </h2>
            </div>
            <p className="max-w-[52ch] self-end text-[1.04rem] leading-[1.62] text-chalk-2">
              Some findings survive being written down. These two do not — they
              are about how a quantity behaves, and the only way to feel that is
              to move it yourself.
            </p>
          </div>
        </div>

        <div className="mt-12 space-y-5">
          <div data-reveal>
            <ConstraintDial />
          </div>
          <div data-reveal>
            <ConditionBoard />
          </div>
        </div>
      </section>

      <Ingest />
      <Synthesis onOpen={setOpenId} />

      <footer className="u-shell pb-20 pt-4">
        <div className="u-rail grid gap-x-14 gap-y-8 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <span className="font-display text-[0.95rem] font-700 tracking-[0.14em] text-chalk uppercase">
              Reading&nbsp;Room
            </span>
            <p className="mt-4 max-w-[46ch] text-[1rem] leading-[1.6] text-chalk-2">
              A prototype for reading a folder of papers you have been meaning to
              get back to. Built for the Dhand lab; on view is the SocialBit arc,
              eight papers published between 2016 and 2026.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <div className="u-label mb-2">Figures</div>
              <p className="max-w-[52ch] text-[0.96rem] leading-[1.6] text-chalk-3">
                Figures from the three open-access papers are reproduced under CC
                BY 4.0 with the credit given on each. The other visuals were drawn
                for this site from numbers the papers report, and say so in their
                captions. Every quoted figure links back to the original.
              </p>
            </div>
            <div>
              <div className="u-label mb-2">Your files</div>
              <p className="max-w-[52ch] text-[0.96rem] leading-[1.6] text-chalk-3">
                PDFs you open here are read in the browser with pdf.js. Nothing is
                uploaded, stored or sent anywhere.
              </p>
            </div>
          </div>
        </div>

        <p className="u-label mt-12">
          {PAPERS.length} papers · {PAPERS.reduce((n, p) => n + p.minutes, 0)}{" "}
          minutes · 2016–2026
        </p>
      </footer>

      {paper && (
        <Exhibit
          key={paper.id}
          paper={paper}
          onClose={() => setOpenId(null)}
          onOpen={setOpenId}
        />
      )}
    </main>
  );
}
