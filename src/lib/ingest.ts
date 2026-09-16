/**
 * Reading a folder of PDFs in the browser.
 *
 * Nothing is uploaded. The files are opened with pdf.js in the page, the text
 * and layout are pulled out, and the structure is inferred from it. That is a
 * real extraction, and it is also the honest limit of what a static page can
 * do: it finds what a paper *contains*. It does not write the summary — the
 * written labels in this collection were made by reading the papers.
 *
 * The heuristics below are ordinary paper-shaped assumptions: the title is the
 * largest type on the first page, the abstract sits between the words
 * "Abstract" and "Introduction", cohort sizes look like "n = 153".
 */

export type Extracted = {
  file: string;
  sizeMB: number;
  pages: number;
  words: number;
  minutes: number;
  title: string;
  authors?: string;
  year?: number;
  doi?: string;
  venue?: string;
  abstract?: string;
  sections: string[];
  figures: number;
  tables: number;
  cohorts: string[];
  claims: string[];
  keywords: string[];
  failed?: string;
};

type TextItem = {
  str: string;
  transform: number[];
  width: number;
  height: number;
};

const STOP = new Set(
  `the of and to in a is that for on with as are was were by this we our it be
   at from an or which have has not can but their they these those our using
   used study when than then also more most between into such other about its
   may been will there each both been all any one two per how within across
   during after before while under over based upon there here them him her his
   she he i you your what who whom whose if so no nor only own same too very
   s t don should now`.split(/\s+/),
);

function clean(s: string) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&amp;/g, "&")
    // icon fonts (ORCID badges, envelope marks) arrive as private-use glyphs
    .replace(/[\p{Co}\p{Cf}]/gu, " ")
    .replace(/\s+/g, " ")
    .replace(/\u00ad/g, "")
    .trim();
}

/**
 * Group text items into visual lines, keeping the dominant font size.
 *
 * Most papers are set in two columns, so a single baseline often carries text
 * from both. Joining them produced "References Methodol. 9, 204–237" as a
 * heading and body text as an author list. A row is therefore split wherever
 * the horizontal gap between neighbours is wider than a column gutter.
 */
function toLines(items: TextItem[]) {
  type Seg = { x: number; end: number; size: number; str: string };
  const dominant = (sizes: Map<number, number>) =>
    [...sizes.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const rows = new Map<number, Seg[]>();
  for (const it of items) {
    if (!it.str.trim()) continue;
    const y = Math.round(it.transform[5]);
    const x = it.transform[4];
    const size = Math.abs(it.transform[3]) || it.height || 0;
    // 4.5pt of slack keeps superscript affiliation marks on their author line;
    // body lines sit at least twice that far apart
    const key = [...rows.keys()].find((k) => Math.abs(k - y) <= 4.5) ?? y;
    const row = rows.get(key) ?? [];
    row.push({ x, end: x + (it.width || 0), size, str: it.str });
    rows.set(key, row);
  }

  const lines: { y: number; x: number; size: number; text: string }[] = [];
  for (const [y, segs] of rows) {
    segs.sort((a, b) => a.x - b.x);
    const start = (seg: Seg) => ({
      x: seg.x,
      end: seg.end,
      sizes: new Map([[Math.round(seg.size * 2) / 2, seg.str.trim().length]]),
      parts: [seg.str],
    });
    let cur = start(segs[0]);
    const flush = () =>
      lines.push({ y, x: cur.x, size: dominant(cur.sizes), text: clean(cur.parts.join(" ")) });
    for (const seg of segs.slice(1)) {
      const gutter = Math.max(dominant(cur.sizes) * 1.8, 12);
      if (seg.x - cur.end > gutter) {
        flush();
        cur = start(seg);
      } else {
        const k = Math.round(seg.size * 2) / 2;
        cur.parts.push(seg.str);
        cur.end = Math.max(cur.end, seg.end);
        cur.sizes.set(k, (cur.sizes.get(k) ?? 0) + seg.str.trim().length);
      }
    }
    flush();
  }

  // page coordinates run bottom-up; within a row, left column first
  return lines
    .filter((l) => l.text.length > 0)
    .sort((a, b) => b.y - a.y || a.x - b.x);
}

/** The largest run of type near the top of page one, minus the journal
 *  furniture that is often set even larger. */
function guessTitle(lines: ReturnType<typeof toLines>, fallback: string) {
  const body = lines.filter(
    (l) =>
      l.text.length > 8 &&
      l.text.length < 250 &&
      !/^(article|opinion|perspectives?|open access|protocol|original research|review|www\.|https?:|doi|received|accepted|published)/i.test(
        l.text,
      ) &&
      !/^\d+$/.test(l.text),
  );
  if (!body.length) return fallback;

  const max = Math.max(...body.map((l) => l.size));
  const big = body.filter((l) => l.size >= max - 0.6);
  // a title usually runs over two or three consecutive lines at that size
  const title = big.slice(0, 4).map((l) => l.text).join(" ");
  return clean(title).slice(0, 220) || fallback;
}

const PARTICLES = /^(and|&|de|del|della|van|von|der|den|da|di|du|la|le|dos|das|el|al|bin|ibn)$/;

/** Strip affiliation marks and degrees, and normalise the commas between names. */
function tidyAuthors(t: string) {
  return clean(
    t
      .replace(/[\d*†‡§¶✉#]+/g, " ")
      .replace(
        /\b(?:MD|PhD|DPhil|MPH|MSc?|MMSc|MBBS|MA|BA|BSc?|RN|ScD|DrPH|FAAN|FAHA|FRCP|FANPA)\b\.?/g,
        " ",
      )
      // superscript affiliation letters: a lone lowercase letter after a name
      .replace(/(?<=[A-Za-z]{2})\s+[a-h](?:\s*,\s*[a-h])*(?=\s*(?:,|$))/g, " "),
  )
    .replace(/\s*,\s*/g, ", ")
    .replace(/(?:,\s*)+/g, ", ")
    .replace(/^,\s*|,\s*$/g, "")
    .replace(/\s+(and|&)\s*,/g, " $1");
}

/** Every word is a capitalised name part or a name particle. */
function isNameList(t: string) {
  const words = tidyAuthors(t).replace(/,/g, " ").split(/\s+/).filter(Boolean);
  return (
    words.length >= 2 &&
    words.every((w) => /^[A-Z][\p{L}'’.-]*$/u.test(w) || PARTICLES.test(w))
  );
}

function guessAuthors(lines: ReturnType<typeof toLines>, title: string) {
  const inTitle = (t: string) => t.length > 3 && title.includes(t);
  let last = -1;
  lines.forEach((l, i) => {
    if (inTitle(l.text) && (last === -1 || i - last <= 3)) last = i;
  });

  const banned = (t: string) =>
    VENUES.some(([re]) => re.test(t)) ||
    /10\.\d{4}\/|abstract|introduction|university|department|hospital|institute|school|\bemail\b|@|©|journal|www\./i.test(
      t,
    );

  const window = lines.slice(last + 1, last + 12);
  const hit = window.find(
    (l) =>
      (l.text.includes(",") || /\band\b|&/.test(l.text)) &&
      l.text.length > 8 &&
      l.text.length < 400 &&
      !inTitle(l.text) &&
      !banned(l.text) &&
      isNameList(l.text),
  );
  if (!hit) return undefined;

  // a row can be cut into pieces by ORCID icons between names; gather the
  // pieces set at the same size, then any following rows that are also names
  const sameSize = (l: { size: number }) => Math.abs(l.size - hit.size) < 0.6;
  const rows = new Map<number, typeof lines>();
  for (const l of lines) {
    if (!sameSize(l) || banned(l.text) || !isNameList(l.text)) continue;
    const key = [...rows.keys()].find((k) => Math.abs(k - l.y) < 1) ?? l.y;
    rows.set(key, [...(rows.get(key) ?? []), l]);
  }
  const ys = [...rows.keys()].sort((a, b) => b - a);
  const out: string[] = [];
  let prev: number | undefined;
  for (const y of ys.slice(ys.indexOf(ys.find((k) => Math.abs(k - hit.y) < 1)!))) {
    if (prev !== undefined && prev - y > hit.size * 2.6) break; // a gap ends the list
    out.push(rows.get(y)!.sort((a, b) => a.x - b.x).map((l) => l.text).join(", "));
    prev = y;
    if (out.length >= 5) break;
  }
  const names = tidyAuthors(out.join(", "));
  return names.length > 3 ? names : undefined;
}

const VENUES: [RegExp, string][] = [
  [/nature\s+reviews\s*\|?\s*neurology|nat\.?\s+rev\.?\s+neurol/i, "Nature Reviews Neurology"],
  [/nature\s+communications|nat\.?\s+commun\b/i, "Nature Communications"],
  [/scientific\s+reports|sci\.?\s+rep\b/i, "Scientific Reports"],
  [/bmj\s+open/i, "BMJ Open"],
  [/social\s+science\s*&\s*medicine|soc\.?\s+sci\.?\s+med\b/i, "Social Science & Medicine"],
  [/seminars\s+in\s+neurology|semin\.?\s+neurol\b/i, "Seminars in Neurology"],
  [/neurorehabilitation\s+and\s+neural\s+repair|neurorehabil\.?\s+neural\s+repair/i, "Neurorehabilitation and Neural Repair"],
  [/\bsensors\s+\d{4},\s*\d+/i, "Sensors"],
  [/\bplos\s+one\b/i, "PLOS ONE"],
  [/\bthe\s+lancet\b/i, "The Lancet"],
  [/\bjama\s+(?:neurology|network\s+open)\b/i, "JAMA"],
  [/\bieee\s+(?:transactions|journal|access)\b[^.\n]{0,60}/i, "IEEE"],
  [/proceedings\s+of\s+the\s+[^.\n]{6,80}/i, ""],
];

/** The journal a paper was published in is named on its first page, usually
 *  in the running head. Reference lists name dozens of others, so page one is
 *  searched first and the earliest mention wins. */
function guessVenue(firstPage: string, rest: string) {
  for (const text of [firstPage, rest.slice(0, 20000)]) {
    let best: { at: number; name: string } | undefined;
    for (const [re, name] of VENUES) {
      const m = re.exec(text);
      if (m && (!best || m.index < best.at)) {
        best = { at: m.index, name: name || clean(m[0]) };
      }
    }
    if (best) return best.name;
  }
  return undefined;
}

const DOI_RE = /10\.\d{4,9}\/[-._;()/:A-Z0-9]+/gi;

/** The paper's own DOI sits on page one and recurs in running heads;
 *  references each appear once. Text glued on by extraction is trimmed. */
function guessDoi(firstPage: string, all: string) {
  const tidy = (d: string) =>
    d.replace(/(\d)([A-Z][a-z]{3,}.*)$/, "$1").replace(/[.,;)]+$/, "");
  const onFirst = firstPage.match(DOI_RE);
  if (onFirst) return tidy(onFirst[0]);
  const freq = new Map<string, number>();
  for (const m of all.match(DOI_RE) ?? []) {
    const d = tidy(m).toLowerCase();
    freq.set(d, (freq.get(d) ?? 0) + 1);
  }
  return [...freq.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}

export async function extractPdf(file: File): Promise<Extracted> {
  const base: Extracted = {
    file: file.name,
    sizeMB: +(file.size / 1e6).toFixed(1),
    pages: 0,
    words: 0,
    minutes: 0,
    title: file.name.replace(/\.pdf$/i, "").replace(/[_-]+/g, " "),
    sections: [],
    figures: 0,
    tables: 0,
    cohorts: [],
    claims: [],
    keywords: [],
  };

  try {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = `${
      process.env.NEXT_PUBLIC_BASE_PATH ?? ""
    }/pdf.worker.min.mjs`;

    const buf = await file.arrayBuffer();
    const doc = await pdfjs.getDocument({ data: buf }).promise;
    base.pages = doc.numPages;

    // page one carries the identity; the rest carry the content
    const firstPage = await doc.getPage(1);
    const firstLines = toLines(
      (await firstPage.getTextContent()).items as TextItem[],
    );

    base.title = guessTitle(firstLines, base.title);
    base.authors = guessAuthors(firstLines, base.title);
    const firstText = firstLines.map((l) => l.text).join(" ");

    // read enough pages for structure without stalling on a 40-page appendix
    const readTo = Math.min(doc.numPages, 14);
    let text = firstLines.map((l) => l.text).join("\n");
    const headings: string[] = [];

    for (let p = 2; p <= readTo; p++) {
      const page = await doc.getPage(p);
      const lines = toLines((await page.getTextContent()).items as TextItem[]);
      text += "\n" + lines.map((l) => l.text).join("\n");
      for (const l of lines) {
        if (
          l.text.length < 46 &&
          // a heading starts with a capital and has no citation furniture in it
          /^(\d+[.)]?\s*)?[A-Z]/.test(l.text) &&
          !/[;(]|\d{2,}|,$/.test(l.text.replace(/^\d+[.)]?\s*/, "")) &&
          /^(abstract|introduction|background|related work|methods?|methodology|materials and methods|study design|participants|procedure|results?|findings|discussion|limitations?|conclusions?|future work|acknowledg|references|data availability|ethics|statistical analysis|analysis)\b/i.test(
            l.text,
          )
        ) {
          const h = clean(l.text.replace(/^\d+[.)]?\s*/, ""));
          if (!headings.some((x) => x.toLowerCase() === h.toLowerCase()))
            headings.push(h);
        }
      }
    }

    const flat = text.replace(/\n/g, " ");
    base.words = flat.split(/\s+/).filter(Boolean).length;
    base.minutes = Math.max(1, Math.round(base.words / 220));
    base.sections = headings.slice(0, 12);

    // metadata, only when it is better than the guess
    try {
      const meta = await doc.getMetadata();
      const info = meta.info as { Title?: string; Author?: string } | undefined;
      const t = info?.Title?.trim();
      if (t && t.length > 12 && !/^untitled|^microsoft word|\.(pdf|docx?)$/i.test(t)) {
        base.title = clean(t);
      }
      // metadata often lists only the first author, so the page wins when it
      // found anything at all
      const a = info?.Author?.trim();
      if (!base.authors && a && a.length > 4 && a.length < 300) base.authors = clean(a);
    } catch {
      /* many papers ship no usable metadata; the page-one guess stands */
    }


    base.doi = guessDoi(firstText, flat);
    base.venue = guessVenue(firstText, flat);

    const yearsIn = (t: string) =>
      [...t
        .replace(/downloaded\s+from[^\n]{0,160}?\b(?:19|20)\d{2}/gi, "")
        .replace(/\b(?:19|20)\d{2}\s+by\s+guest\b/gi, "")
        .replace(/accessed[^\n]{0,40}?\b(?:19|20)\d{2}/gi, "")
        .matchAll(/\b(19[5-9]\d|20[0-4]\d)\b/g)]
        .map((m) => +m[1])
        .filter((y) => y <= new Date().getFullYear() + 1);
    const onFirst = yearsIn(firstText);
    const doiYear = base.doi?.match(/[-./](19[5-9]\d|20[0-4]\d)[-./]/)?.[1];
    if (doiYear) {
      base.year = +doiYear;
    } else if (onFirst.length) {
      base.year = Math.max(...onFirst);
    } else {
      const freq = new Map<number, number>();
      yearsIn(flat).forEach((y) => freq.set(y, (freq.get(y) ?? 0) + 1));
      base.year = [...freq.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0]?.[0];
    }

    const abs = flat.match(
      /\bAbstract\b[\s:.—-]*(.{120,1400}?)(?=\s(?:Keywords|Key words|Introduction|1\s+Introduction|Background)\b)/i,
    );
    if (abs) base.abstract = clean(abs[1]);

    base.figures = new Set(
      [...flat.matchAll(/\bFig(?:ure)?\.?\s*(\d{1,2})\b/gi)].map((m) => m[1]),
    ).size;
    base.tables = new Set(
      [...flat.matchAll(/\bTable\s*(\d{1,2})\b/gi)].map((m) => m[1]),
    ).size;

    // cohort sizes. The real cohort is repeated throughout a paper; a stray
    // "n = 999" in a supplementary table is not — so rank by recurrence first
    const counts = new Map<number, number>();
    const add = (raw: string) => {
      const v = +raw.replace(/,/g, "");
      if (v >= 10 && v < 5_000_000) counts.set(v, (counts.get(v) ?? 0) + 1);
    };
    for (const m of flat.matchAll(/\b[nN]\s*=\s*(\d[\d,]{0,8})\b/g)) add(m[1]);
    for (const m of flat.matchAll(
      /\b(\d{1,3}(?:,\d{3})+|\d{2,7})\s+(?:[A-Za-z-]+\s+){0,2}(?:patients|participants|persons|people|individuals|subjects|survivors|adults|children|inpatients)\b/gi,
    )) {
      const v = +m[1].replace(/,/g, "");
      // a bare four-digit number in this range is far more likely a year
      if (!(m[1].length === 4 && v >= 1950 && v <= 2035)) add(m[1]);
    }
    base.cohorts = [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || b[0] - a[0])
      .slice(0, 3)
      .map(([v]) => `n = ${v.toLocaleString()}`);

    // headline numbers a reader would want lifted out of the results
    const claims = new Set<string>();
    for (const re of [
      /\bAUC\s*(?:of|=|:)?\s*(0?\.\d{2,3})/gi,
      /\b(?:sensitivity|specificity|accuracy|precision|recall|F1)\s*(?:of|=|:)?\s*(0?\.\d{2,3}|\d{1,3}(?:\.\d+)?%)/gi,
      /\b[pP]\s*[=<]\s*(0?\.\d+|\d(?:\.\d+)?\s*[×x]\s*10\s*[−-]?\s*\d+)/g,
      /\b(?:95%\s*CI|hazard ratio|odds ratio)\s*[=:,]?\s*([\-−]?\d+(?:\.\d+)?(?:\s*(?:to|–|-)\s*[\-−]?\d+(?:\.\d+)?)?)/gi,
      // the abbreviations are case-sensitive and need an explicit value
      /\b(?:HR|OR|RR)\s*[=:]\s*\d+(?:\.\d+)?/g,
    ]) {
      for (const m of flat.matchAll(re)) {
        claims.add(clean(m[0]).slice(0, 44));
        if (claims.size >= 8) break;
      }
    }
    base.claims = [...claims];

    // topic words: frequent, long, not boilerplate
    const freq = new Map<string, number>();
    for (const w of flat.toLowerCase().match(/[a-z][a-z-]{4,}/g) ?? []) {
      if (STOP.has(w)) continue;
      freq.set(w, (freq.get(w) ?? 0) + 1);
    }
    base.keywords = [...freq.entries()]
      .filter(([, c]) => c >= 4)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([w]) => w);

    await doc.destroy();
  } catch (err) {
    base.failed =
      err instanceof Error ? err.message : "This file could not be opened.";
  }

  return base;
}

/** Pull every PDF out of a drop, walking into folders where the browser
 *  exposes the entry API. */
export async function pdfsFromDataTransfer(dt: DataTransfer): Promise<File[]> {
  const out: File[] = [];

  const walk = async (entry: FileSystemEntry): Promise<void> => {
    if (entry.isFile) {
      const f = await new Promise<File>((res, rej) =>
        (entry as FileSystemFileEntry).file(res, rej),
      );
      if (/\.pdf$/i.test(f.name)) out.push(f);
      return;
    }
    const reader = (entry as FileSystemDirectoryEntry).createReader();
    // readEntries returns at most 100 at a time, so keep asking
    for (;;) {
      const batch = await new Promise<FileSystemEntry[]>((res, rej) =>
        reader.readEntries(res, rej),
      );
      if (!batch.length) break;
      for (const e of batch) await walk(e);
    }
  };

  const entries = [...dt.items]
    .map((i) => i.webkitGetAsEntry?.())
    .filter(Boolean) as FileSystemEntry[];

  if (entries.length) {
    for (const e of entries) await walk(e);
  } else {
    for (const f of dt.files) if (/\.pdf$/i.test(f.name)) out.push(f);
  }
  return out;
}
