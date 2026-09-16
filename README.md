# Reading Room

A reading room for a folder of research papers. Every paper is shown as an
exhibit: what it asked, how it was run, the numbers that carry it, and what it
does not prove.

**Live:** https://sadhushehjar.github.io/reading-room/

On view is **SocialBit**: eight papers from 2016 to 2026 that trace how
social-network research in neurology became a smartwatch that detects social
interaction after stroke.

## What is in it

- **The collection.** Eight papers, each readable at three depths — Glance,
  Brief and Full — with a picture, key numbers, method steps, limitations,
  how it connects to the other papers, and what to read next.
- **Touch exhibits.** A constraint slider tied to the arrival-time and
  blood-pressure findings, and a panel showing SocialBit's accuracy under each
  reported condition.
- **Your folder.** Choose a folder of PDFs and each one is read in the browser
  with pdf.js. Nothing is uploaded. You get a draft card with the title,
  authors, venue, DOI, year, sample sizes, reported statistics and section
  structure.
- **Across the collection.** Cohorts, designs and caveats side by side.

The written summaries in `src/lib/collection.ts` were written by reading the
papers. The folder reader extracts structure; it does not write summaries.

## Run it

```bash
npm install
npm run dev
```

## Deploy

Pushing to `main` builds a static export and publishes it to GitHub Pages
(`.github/workflows/deploy.yml`). The workflow sets `PAGES_BASE_PATH=/reading-room`
so assets resolve under the project path.

## Figures and sources

Figures in `public/figures/` are reproduced from open-access papers under
CC BY 4.0, with credit shown beside each one:

- Dhand et al., *Nature Communications* 9:3930 (2018), Fig. 2
- Dhand et al., *Nature Communications* 10:1206 (2019), Fig. 2
- Dhand et al., *Scientific Reports* 16:4529 (2026), Figs. 3, 4 and 5

The other visuals are drawn from numbers the papers report, and their captions
say so. Each exhibit links to the original paper by DOI.
