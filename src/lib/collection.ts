/**
 * The SocialBit collection.
 *
 * Eight papers by Amar Dhand and collaborators, published between 2016 and
 * 2026. This file is the exhibit label, so it holds to one rule: a statement
 * about a paper is something the paper says. Numbers are quoted from the
 * paper they belong to, limitations are the authors' own unless a paper has
 * none (and then the label says so), and every connection between two papers
 * is a checkable fact — a citation, a shared survey tool or measure, shared
 * authors, or a gap one paper named and another addressed.
 *
 * `license` decides whether a figure from the paper can be shown on this site.
 * CC BY and CC BY-NC allow it with attribution; "closed" papers are represented
 * only by drawings made from their reported numbers.
 */

export type Depth = "glance" | "brief" | "full";

export type PaperKind =
  | "Framework"
  | "Instrument"
  | "Cohort study"
  | "Review"
  | "Protocol"
  | "Trial"
  | "Validation";

export type Stat = {
  value: string;
  label: string;
  /** what the number actually means */
  note?: string;
};

export type Figure = {
  src: string;
  alt: string;
  /** what a reader should take away in one look */
  reading: string;
  credit: string;
};

/** Every kind is a fact that can be checked against the two papers. */
export type LinkKind =
  | "cites"
  | "cited-by"
  | "same-tool"
  | "same-measure"
  | "shared-authors"
  | "protocol-for"
  | "results-of"
  | "gap-named"
  | "gap-addressed";

export type Connection = {
  to: string;
  kind: LinkKind;
  /** written from the perspective of the paper that owns the connection */
  why: string;
};

export type ReadNext = {
  to: string;
  why: string;
};

export type Paper = {
  id: string;
  /** position in publication order, 1-8 */
  step: number;
  year: number;
  kind: PaperKind;
  /** the job this paper does in the collection, two or three words */
  role: string;
  title: string;
  authors: string;
  /** first author + et al, for tight spaces */
  shortAuthors: string;
  venue: string;
  doi: string;
  url: string;
  license: "cc-by" | "cc-by-nc" | "cc-by-nc-nd" | "closed";
  /** page count of the published PDF */
  pages: number;
  /** minutes to read this exhibit at full depth */
  minutes: number;

  /** GLANCE — one or two sentences you could say out loud in a lab meeting */
  glance: string;
  /** the single number that carries the paper */
  headline: Stat;

  /** BRIEF — the four questions everybody actually asks */
  question: string;
  method: string;
  finding: string;
  caveat: string;

  /** FULL */
  stats: Stat[];
  /** how the study was actually run, as discrete steps */
  procedure: { label: string; detail: string }[];
  limitations: string[];
  soWhat: string;

  figures: Figure[];
  connections: Connection[];
  readNext: ReadNext[];
  tags: string[];
};

export const PAPERS: Paper[] = [
  {
    id: "theory-2016",
    step: 1,
    year: 2016,
    kind: "Framework",
    role: "Names the problem",
    title: "Social networks and neurological illness",
    authors: "Amar Dhand, Douglas A. Luke, Catherine E. Lang, Jin-Moo Lee",
    shortAuthors: "Dhand et al.",
    venue: "Nature Reviews Neurology",
    doi: "10.1038/nrneurol.2016.119",
    url: "https://doi.org/10.1038/nrneurol.2016.119",
    license: "closed",
    pages: 8,
    minutes: 4,
    glance:
      "Clinicians are taught to see the patient as a solitary figure. This paper argues every patient sits inside a social network, and sets out how to measure it.",
    headline: {
      value: "≈ smoking",
      label: "how strongly social isolation is tied to poor health",
      note: "The paper puts isolation alongside smoking, high blood pressure, high cholesterol and physical inactivity as a determinant of poor health.",
    },
    question:
      "Neurologists deal with a patient's family and friends all the time, yet the patient's social life is barely screened. Can that social world be mapped and used in research and care?",
    method:
      "A framework rather than a study. It brings personal-network analysis into neurology and describes the survey that produces a network map: a name generator, a name inter-relater and a name interpreter.",
    finding:
      "Two stroke patients can sit in very different social structures. One is surrounded by four closely tied relatives; the other has five contacts, several of whom don't know each other. Density, constraint and effective size turn that difference into numbers.",
    caveat:
      "It proposes an agenda without testing one. The authors also say the network lens should be used alongside traditional clinical and epidemiological approaches, not instead of them.",
    stats: [
      { value: "3", label: "survey sections", note: "The name generator lists the people. The name inter-relater asks how they know each other. The name interpreter asks who they are and what health habits they have." },
      { value: "5", label: "pathways from network to health", note: "Person-to-person contact, social engagement, social influence, access to resources and material goods, and social support." },
      { value: "1.0 vs 0.6", label: "density, patient 1 vs patient 2", note: "Density is the observed ties between contacts divided by all possible ties. At 1.0, everyone around the patient knows everyone else." },
    ],
    procedure: [
      { label: "Borrow", detail: "Personal-network (egocentric) analysis comes from graph theory and sociology. The patient is the ego and each contact is an alter." },
      { label: "Define", detail: "Structure is measured by size, density, constraint and effective size. Composition is measured by who the contacts are and what health habits they have." },
      { label: "Instrument", detail: "Example questions are adapted from validated items in the General Social Survey, a national population survey." },
      { label: "Propose", detail: "An agenda: map networks in neurological disorders, test whether they relate to outcomes, then test network interventions." },
    ],
    limitations: [
      "As a middle-level theory, the network view plays down individual agency — the idea that a person decides and acts regardless of context.",
      "Networks are not enough to model broader social and historical forces such as poverty or racism; those need community- and population-level study.",
      "Networks put human actors ahead of technologies, animals and objects that can also affect health.",
      "Some of these forces are beyond the reach of an individual neurologist.",
      "More research is needed on designing and running network interventions in clinical populations.",
    ],
    soWhat:
      "Later papers build on it directly: the 2018 survey tool, the 2019 arrival study and the 2025 trial all cite it.",
    figures: [],
    connections: [
      { to: "instrument-2018", kind: "cited-by", why: "The 2018 paper cites this framework, and its survey tool follows the same generator, inter-relater and interpreter design." },
      { to: "arrival-2019", kind: "cited-by", why: "The arrival study cites this framework." },
      { to: "trial-2025", kind: "cited-by", why: "The trial cites this paper's social network theory of patients as the basis for its intervention." },
    ],
    readNext: [
      { to: "instrument-2018", why: "See the survey turned into a web tool that 1,493 people completed." },
      { to: "trial-2025", why: "See the network theory put to a randomised test." },
    ],
    tags: ["personal networks", "constraint", "framework", "stroke"],
  },

  {
    id: "instrument-2018",
    step: 2,
    year: 2018,
    kind: "Instrument",
    role: "Builds the survey tool",
    title:
      "A scalable online tool for quantitative social network assessment reveals potentially modifiable social environmental risks",
    authors:
      "Amar Dhand, Charles C. White, Catherine Johnson, Zongqi Xia, Philip L. De Jager",
    shortAuthors: "Dhand et al.",
    venue: "Nature Communications 9:3930",
    doi: "10.1038/s41467-018-06408-6",
    url: "https://doi.org/10.1038/s41467-018-06408-6",
    license: "cc-by",
    pages: 9,
    minutes: 5,
    glance:
      "The survey becomes a web tool that 1,493 people complete. Who surrounds a person was more strongly associated with their disability than how the network was arranged.",
    headline: {
      value: "1,493",
      label: "personal networks mapped",
      note: "Participants in the GEMS cohort, people with a first-degree family history of multiple sclerosis.",
    },
    question:
      "Can a full personal-network survey run at the scale of a clinical study, and does anything in the resulting networks relate to how disabled a person is?",
    method:
      "An adaptive survey of about 48 questions on REDCap, HIPAA-compliant, taking 10 to 15 minutes. It was sent to the GEMS cohort of people at risk of multiple sclerosis. Disability was self-reported on the MSRS-R.",
    finding:
      "Network composition was associated with disability; network structure as a whole was not (p = 0.066). The strongest single variable was the share of a person's contacts who don't go to their doctor's appointments.",
    caveat:
      "The study is cross-sectional, so it cannot show causality or direction.",
    stats: [
      { value: "7.4 × 10⁻⁸", label: "p, contacts who don't go to the doctor", note: "The strongest single variable against MSRS-R disability, with a false discovery rate of 9.6 × 10⁻⁷." },
      { value: "p = 0.066", label: "network structure, combined", note: "Size, density, constraint and related measures together did not reach significance. Composition did, at p < 0.0001." },
      { value: "8", label: "people in an average network", note: "They were densely connected: 67% of all possible ties between them were present." },
      { value: "44%", label: "of contacts were family", note: "38% were supportive of the participant. Sex diversity was 0.89, close to an even mix. Race diversity was 0." },
      { value: "10–15 min", label: "to complete", note: "About 48 questions that adapt to the answers given." },
    ],
    procedure: [
      { label: "Generate names", detail: "Three prompts: who did you discuss important matters with, socialise with, and get support from in the last three months. There was no cap on how many people could be named." },
      { label: "Relate names", detail: "For the first ten people named, each pair is rated as strangers, a weak tie or a strong tie." },
      { label: "Interpret names", detail: "For each of those ten: demographics, relationship, and health habits — smoking, exercise, seeing doctors regularly, and taking prescribed medication." },
      { label: "Analyse", detail: "Structure and composition measures are tested against MSRS-R disability, with a permutation-based omnibus test for each category." },
    ],
    limitations: [
      "The design is cross-sectional, so causality and direction cannot be established.",
      "MSRS-R scores clustered low because most of the cohort had no symptoms, which risks a floor effect.",
      "Only 115 participants had an MS diagnosis, so the comparison with the 1,378 without symptoms may be underpowered.",
      "Unmeasured confounders could affect both network reports and disability.",
      "Networks were self-reported, and participants were recruited through advocacy groups, social media and electronic communications.",
    ],
    soWhat:
      "The authors suggest interventions aimed at network composition — the people around a patient and their habits — rather than network shape alone.",
    figures: [
      {
        src: "figures/montage-1493.png",
        alt: "A grid of 1,493 small network diagrams, each a black dot for the participant ringed by white dots for their contacts, joined by red strong ties and blue weak ties, arranged from smallest network at top left to largest at bottom right.",
        reading:
          "Each small shape is one participant's network. They run from the smallest at top left to the largest at bottom right. Red lines are strong ties and blue lines are weak ties.",
        credit: "Dhand et al., Nature Communications 2018, Fig. 2. CC BY 4.0.",
      },
    ],
    connections: [
      { to: "theory-2016", kind: "cites", why: "Cites the 2016 framework, and follows its generator, inter-relater and interpreter design." },
      { to: "arrival-2019", kind: "cited-by", why: "The arrival study cites this tool." },
      { to: "recovery-2019", kind: "cited-by", why: "The recovery study cites this tool for its network mapping." },
      { to: "trial-2025", kind: "cited-by", why: "The trial cites this tool and reports the same network measures: size, density, constraint and effective size." },
    ],
    readNext: [
      { to: "arrival-2019", why: "Network measures meet a hard outcome: reaching hospital in time for treatment." },
      { to: "recovery-2019", why: "The same kind of mapping, repeated over six months after stroke." },
    ],
    tags: ["REDCap", "multiple sclerosis", "composition", "GEMS"],
  },

  {
    id: "arrival-2019",
    step: 3,
    year: 2019,
    kind: "Cohort study",
    role: "Links networks to delay",
    title: "Social networks and risk of delayed hospital arrival after acute stroke",
    authors:
      "Amar Dhand, Douglas Luke, Catherine Lang, Michael Tsiaklides, Steven Feske, Jin-Moo Lee",
    shortAuthors: "Dhand et al.",
    venue: "Nature Communications 10:1206",
    doi: "10.1038/s41467-019-09073-5",
    url: "https://doi.org/10.1038/s41467-019-09073-5",
    license: "cc-by",
    pages: 8,
    minutes: 5,
    glance:
      "Stroke patients who reached hospital late had smaller, more close-knit networks than those who arrived early — and none of the late arrivers received the clot-dissolving drug.",
    headline: {
      value: "0% vs 50%",
      label: "received clot-dissolving treatment, late vs early arrivers",
      note: "None of the 67 slow arrivers received tissue plasminogen activator; 54 of the 108 fast arrivers did. The drug is given only within 4.5 hours of stroke.",
    },
    question:
      "In heart attacks, being surrounded by spouses or family has been linked to arriving later. Does the social environment play the same role in stroke?",
    method:
      "175 patients with acute ischaemic stroke were split by arrival time: 108 within 6 hours of symptom onset and 67 after. Their personal networks were mapped with a survey adapted from the General Social Survey and compared on Burt's social capital measures.",
    finding:
      "Slow arrivers had smaller networks, 5 people against 8, and higher constraint, 61 against 40, independent of demographic, clinical and socioeconomic factors. The authors conclude that closed networks limited outside perspectives, so patients and close confidants chose to watch and wait.",
    caveat:
      "Most patients had mild stroke. Because severity itself predicts arrival time, the authors note networks may not matter as much in moderate or severe stroke.",
    stats: [
      { value: "5 vs 8", label: "network size, slow vs fast", note: "Slow arrivers averaged 5 (IQR 4–8) and fast arrivers 8 (IQR 6–10). p < 0.0001." },
      { value: "61 vs 40", label: "constraint, slow vs fast", note: "Constraint measures how far a patient's contacts are tied to each other. Higher means a more closed network. p < 0.0001." },
      { value: "175", label: "patients enrolled", note: "108 arrived within 6 hours of symptom onset and 67 after. 88% had mild stroke." },
      { value: "80%", label: "of strokes happen in the presence of others", note: "The paper also cites that caregivers or witnesses place about 96% of stroke emergency calls." },
    ],
    procedure: [
      { label: "Split", detail: "Arrival within 6 hours of symptom onset counted as fast; later than 6 hours, slow." },
      { label: "Map", detail: "Each patient's personal network was surveyed during the hospital stay." },
      { label: "Measure", detail: "Burt's measures — size, constraint, effective size and mean degree — describe whether a network is closed or open." },
      { label: "Adjust", detail: "Multivariable regression accounted for demographic, clinical and socioeconomic factors." },
    ],
    limitations: [
      "Unmeasured confounders could still explain the difference in arrival time.",
      "The cohort was mostly mild stroke, so networks may matter less in moderate or severe stroke.",
      "The authors note possible selection bias from the small number of slow arrivers and from excluding patients who could not do the survey, such as non-English speakers and patients with severe stroke or aphasia.",
      "Knowledge of stroke symptoms was not assessed, though it could be a covariate or a mechanism.",
    ],
    soWhat:
      "In this cohort, a closed network went with arriving too late for treatment.",
    figures: [
      {
        src: "figures/montage-slow.png",
        alt: "Sixty-seven small network diagrams for patients who arrived at hospital late, arranged from high constraint at the top to low constraint at the bottom.",
        reading:
          "Slow arrivers, sorted by constraint from high at the top to low at the bottom. The top rows are small networks drawn mostly in red strong ties.",
        credit: "Dhand et al., Nature Communications 2019, Fig. 2a. CC BY 4.0.",
      },
      {
        src: "figures/montage-fast.png",
        alt: "One hundred and eight small network diagrams for patients who arrived at hospital within six hours, sorted by constraint.",
        reading:
          "Fast arrivers on the same scale. The authors describe these networks as having lower constraint than the slow arrivers' in general.",
        credit: "Dhand et al., Nature Communications 2019, Fig. 2b. CC BY 4.0.",
      },
    ],
    connections: [
      { to: "theory-2016", kind: "cites", why: "Cites the 2016 framework." },
      { to: "instrument-2018", kind: "cites", why: "Cites the 2018 network assessment tool." },
      { to: "trial-2025", kind: "same-measure", why: "Both report constraint, and in both it separates the patients: slow from fast arrivers here, and responders from non-responders in the trial." },
    ],
    readNext: [
      { to: "recovery-2019", why: "Published the same year: what happens to patients' networks in the six months after stroke." },
      { to: "trial-2025", why: "Constraint again, this time splitting the results of a randomised trial." },
    ],
    tags: ["stroke", "constraint", "tPA", "time to treatment"],
  },

  {
    id: "recovery-2019",
    step: 4,
    year: 2019,
    kind: "Cohort study",
    role: "Follows networks over time",
    title: "Social Network Mapping and Functional Recovery Within 6 Months of Ischemic Stroke",
    authors:
      "Amar Dhand, Catherine E. Lang, Douglas A. Luke, Angela Kim, Karen Li, Liam McCafferty, Yi Mu, Bernard Rosner, Steven K. Feske, Jin-Moo Lee",
    shortAuthors: "Dhand et al.",
    venue: "Neurorehabilitation and Neural Repair 33(11):922–932",
    doi: "10.1177/1545968319872994",
    url: "https://doi.org/10.1177/1545968319872994",
    license: "closed",
    pages: 11,
    minutes: 4,
    glance:
      "In the six months after a stroke, networks shrank and became denser and more family-oriented, but also healthier. Of the network measures, only baseline size was independently linked to physical function.",
    headline: {
      value: "−1.25 people",
      label: "average network change over 6 months",
      note: "Networks also became denser and more family-oriented, and shed contacts who smoked or did not exercise.",
    },
    question:
      "How do patients' social networks change after a stroke, and are they related to physical function at 3 and 6 months?",
    method:
      "172 patients with mostly mild ischaemic stroke had their networks mapped with a quantitative network assessment tool, with 149 followed to 3 months and 139 to 6 months. Physical function was measured on the NIH PROMIS Physical Function scale.",
    finding:
      "Baseline network size — not density, and not the health habits in the network — was independently associated with physical function at 3 and 6 months. Patients in small, family-based networks reported more negative social interactions.",
    caveat:
      "Patients with aphasia were excluded because the study relied on self-report. The authors call them a group vulnerable to network decay.",
    stats: [
      { value: "172", label: "patients mapped at baseline", note: "149 retained at 3 months and 139 at 6 months. Median NIH Stroke Scale score of 2: mostly mild, motor-predominant stroke." },
      { value: "size", label: "the network measure that held up", note: "Baseline network size stayed associated with physical function after adjusting for demographics, socioeconomic status, clinical characteristics, comorbidities, cognition and depression. Density and network health habits did not." },
      { value: "healthier", label: "how network composition changed", note: "Ties to people who smoked or did not exercise were pruned over the six months." },
    ],
    procedure: [
      { label: "Enrol", detail: "Patients with ischaemic stroke had their networks mapped with a quantitative network assessment tool." },
      { label: "Follow", detail: "Networks were mapped again at 3 and 6 months, so change could be measured within each person." },
      { label: "Model", detail: "Mixed-effects models for network change over time; multivariable models for the link with PROMIS physical function." },
      { label: "Adjust", detail: "Adjusted for demographics, socioeconomic status, clinical characteristics, comorbidities, cognition and depression." },
    ],
    limitations: [
      "Limited generalisability: the study focused on mild ischaemic stroke, not moderate or severe stroke, haemorrhage or prior stroke.",
      "Patients with aphasia and non-English speakers were not included; the authors suggest caregiver proxies or social sensors independent of self-report for future studies.",
      "Unmeasured confounders may have contributed to the findings.",
      "Non-random missing data is a threat in longitudinal analysis; completers and non-completers looked similar, but attrition bias is possible.",
    ],
    soWhat:
      "It names a gap the SocialBit work later addresses: patients with aphasia can't be measured by self-report, and the authors point to social sensors as one option.",
    figures: [],
    connections: [
      { to: "instrument-2018", kind: "cites", why: "Cites the 2018 network assessment tool." },
      { to: "protocol-2023", kind: "gap-addressed", why: "This study excluded patients with aphasia. The SocialBit protocol is designed for stroke survivors with speech, cognitive and physical deficits." },
      { to: "validation-2026", kind: "gap-addressed", why: "This study suggested social sensors independent of self-report. The 2026 study validates one in 153 patients, 24 of them with aphasia." },
    ],
    readNext: [
      { to: "protocol-2023", why: "The study designed to include the patients this one had to leave out." },
      { to: "validation-2026", why: "The results of that study." },
    ],
    tags: ["stroke recovery", "PROMIS", "aphasia gap", "longitudinal"],
  },

  {
    id: "gaps-2022",
    step: 5,
    year: 2022,
    kind: "Review",
    role: "Makes the case for sensing",
    title: "Leveraging Social Networks for the Assessment and Management of Neurological Patients",
    authors:
      "Amar Dhand, Archana Podury, Niteesh Choudhry, Shrikanth Narayanan, Min Shin, Matthias R. Mehl",
    shortAuthors: "Dhand et al.",
    venue: "Seminars in Neurology 42:136–148",
    doi: "10.1055/s-0042-1744532",
    url: "https://doi.org/10.1055/s-0042-1744532",
    license: "cc-by-nc-nd",
    pages: 13,
    minutes: 5,
    glance:
      "A review of how to measure and use patients' social networks. It notes that many stroke patients can't complete questionnaires and turns to passive sensing. Three of its authors later co-author the SocialBit papers.",
    headline: {
      value: "81% vs 3%",
      label: "share of health outcomes: socioeconomic factors and behaviours vs clinical care",
      note: "From one nation-wide study the review cites: socioeconomic factors and health behaviours contributed 81% to health outcomes, and clinical care 3%.",
    },
    question:
      "Why does the social environment matter so much to neurological health, and how can clinicians measure it and act on it?",
    method:
      "A review in three parts: the biology and psychology of social networks, assessment methods including new social sensors, and the design of network interventions and social therapeutics.",
    finding:
      "Social networks are among the most proximate social determinants of health that clinicians can actually reach. Self-report has clear limits in the clinic, so the review turns to passive observation methods such as the Electronically Activated Recorder and newer wearable sensors.",
    caveat:
      "It is a review, so it reports no new data of its own.",
    stats: [
      { value: "45%", label: "of hospitalised stroke patients can't complete questionnaires", note: "Because of cognitive or language deficits, according to the authors' own work. This is the review's reason for turning to passive sensing." },
      { value: "+32%", label: "stroke risk with poor social relationships", note: "The review also cites a 50% increased risk of developing dementia." },
      { value: "3 of 6", label: "authors later on the SocialBit papers", note: "Shrikanth Narayanan (electrical and computer engineering), Min Shin (computer science) and Matthias Mehl (psychology)." },
    ],
    procedure: [
      { label: "Biology", detail: "Reviews how the social environment shapes brain development and the brain's specialised social systems." },
      { label: "Psychology", detail: "Argues that well-being rests on a social baseline, and reviews evidence linking social connection to well-being and physical health." },
      { label: "Assessment", detail: "Covers survey instruments and newer sensing tools usable in patients with varying deficits, including the Electronically Activated Recorder." },
      { label: "Intervention", detail: "Discusses the design of network interventions and social therapeutics." },
    ],
    limitations: [
      "The review doesn't include a limitations section of its own. As a review, it reports no new data.",
    ],
    soWhat:
      "It is where the collection turns toward sensing. The survey-based studies before it rely on self-report; the SocialBit papers after it measure interaction from audio.",
    figures: [],
    connections: [
      { to: "protocol-2023", kind: "cited-by", why: "The SocialBit protocol cites this review." },
      { to: "validation-2026", kind: "shared-authors", why: "Narayanan, Shin and Mehl, three of this review's authors, are also authors of the SocialBit validation." },
      { to: "trial-2025", kind: "shared-authors", why: "Niteesh Choudhry is an author here and the trial's senior author." },
    ],
    readNext: [
      { to: "protocol-2023", why: "The sensing idea becomes a study design." },
      { to: "trial-2025", why: "Or follow the intervention side into a randomised trial." },
    ],
    tags: ["review", "social sensing", "neurobiology", "EAR"],
  },

  {
    id: "protocol-2023",
    step: 6,
    year: 2023,
    kind: "Protocol",
    role: "Designs the test",
    title:
      "SocialBit: protocol for a prospective observational study to validate a wearable social sensor for stroke survivors with diverse neurological abilities",
    authors:
      "Kelly White, Samuel Tate, Ross Zafonte, Shrikanth Narayanan, Matthias R. Mehl, Min Shin, Amar Dhand",
    shortAuthors: "White et al.",
    venue: "BMJ Open 13:e076297",
    doi: "10.1136/bmjopen-2023-076297",
    url: "https://doi.org/10.1136/bmjopen-2023-076297",
    license: "cc-by-nc",
    pages: 9,
    minutes: 3,
    glance:
      "The study plan, published before the results. Patients wear a smartwatch running SocialBit, human observers tally their interactions over a video livestream, and the two records are compared.",
    headline: {
      value: "Up to 8 days",
      label: "of observation per patient",
      note: "During hospitalisation and rehabilitation, with a target of 200 patients at Brigham and Women's Hospital and Spaulding Rehabilitation Hospital.",
    },
    question:
      "Can a smartwatch detect social interaction accurately in stroke survivors with varying speech, cognitive and physical deficits?",
    method:
      "A prospective observational validation study. Patients wear a SocialBit-equipped smartwatch during ordinary hospital days while human observers tally their interactions over a video livestream. The human tally is the ground truth.",
    finding:
      "A protocol has no results. Its key design choice is the ground truth: human observers watching a livestream, not patient recall.",
    caveat:
      "The authors note two limits: a hospital is not a home, and not recording raw audio makes the machine learning harder.",
    stats: [
      { value: "200", label: "patients targeted", note: "Recruited at Brigham and Women's Hospital and Spaulding Rehabilitation Hospital in Boston." },
      { value: "0", label: "seconds of raw audio stored", note: "The app stores audio features, never the raw audio." },
      { value: "1", label: "person wears a device", note: "Only the patient wears the watch, not their conversation partners." },
    ],
    procedure: [
      { label: "Recruit", detail: "Inpatients with stroke, including those with speech, cognitive and physical deficits." },
      { label: "Wear", detail: "A commercial smartwatch runs SocialBit through the patient's ordinary day, for up to 8 days across hospital and rehabilitation." },
      { label: "Observe", detail: "Human observers tally the patient's interactions by watching a video livestream of the room." },
      { label: "Compare", detail: "SocialBit's output is scored against the human tally, and interaction time is related to stroke characteristics and outcomes." },
    ],
    limitations: [
      "The study runs in hospital; the authors suggest future validation in a more natural home setting.",
      "To protect privacy the algorithm doesn't record raw audio, which the authors note makes the machine learning harder.",
    ],
    soWhat:
      "Because the design was published first, the 2026 results can be read against a plan that was already public.",
    figures: [],
    connections: [
      { to: "gaps-2022", kind: "cites", why: "Cites the 2022 review; three of the review's authors are also authors here." },
      { to: "recovery-2019", kind: "gap-named", why: "Designed for stroke survivors with speech and cognitive deficits, the group the 2019 recovery study had to exclude." },
      { to: "validation-2026", kind: "results-of", why: "The 2026 paper reports this study, citing this protocol for its full design." },
    ],
    readNext: [
      { to: "validation-2026", why: "The results of the study this protocol describes." },
    ],
    tags: ["protocol", "ground truth", "privacy", "aphasia"],
  },

  {
    id: "trial-2025",
    step: 7,
    year: 2025,
    kind: "Trial",
    role: "Tests an intervention",
    title:
      "Social network intervention to improve blood pressure control after stroke: The TEAMS-BP randomized clinical trial",
    authors:
      "Amar Dhand, Katherine Crum, Kaitlin E. Hanken, Gauri Bhatkhande, Melinda Luo, Ian M. Corbin, George Usmanov, Zachary Rothfeld-Wehrwein, Vrushali Dhongade, David Lin, Chloe Slocum, Nancy Haff, Niteesh K. Choudhry",
    shortAuthors: "Dhand et al.",
    venue: "Social Science & Medicine 380:118231",
    doi: "10.1016/j.socscimed.2025.118231",
    url: "https://doi.org/10.1016/j.socscimed.2025.118231",
    license: "closed",
    pages: 8,
    minutes: 5,
    glance:
      "No significant difference in blood pressure overall. In the pre-specified subgroups, network counselling went with 12.4 mmHg lower pressure in close-knit networks and 16.1 mmHg higher in open ones.",
    headline: {
      value: "−12.4 vs +16.1",
      label: "mmHg, high vs low constraint",
      note: "Network counselling compared with individual counselling, by constraint above or below the median. p = 0.03.",
    },
    question:
      "Can a network intervention lower systolic blood pressure after stroke, compared with individual counselling?",
    method:
      "A randomised controlled trial. Over two years, 45 stroke survivors were recruited: 24 to network counselling, which involved their network members, and 21 to individual counselling, for three months. Registered as NCT05258890.",
    finding:
      "No significant difference overall: −5.2 mmHg, 95% CI −14.8 to 4.5, p = 0.29. In pre-specified subgroups, the intervention's effect differed by constraint.",
    caveat:
      "The authors call the findings preliminary because of dropout in both arms and uneven engagement of network members. 16 of 24 in the intervention arm withdrew or were lost to follow-up.",
    stats: [
      { value: "−5.2 mmHg", label: "primary outcome, adjusted", note: "95% CI −14.8 to 4.5, p = 0.29. Lower in the intervention arm, but not significant." },
      { value: "16 of 24", label: "intervention patients lost", note: "In the control arm, 10 of 21 withdrew or were lost to follow-up." },
      { value: "24%", label: "attended network sessions alone", note: "Of those who attended, 58% joined with one other person and 18% with three or more." },
    ],
    procedure: [
      { label: "Randomise", detail: "Stroke survivors assigned to network counselling or individual counselling for three months." },
      { label: "Involve", detail: "The network arm brought the patient's own network members into the counselling." },
      { label: "Measure", detail: "The primary outcome was the absolute difference in systolic blood pressure over three months." },
      { label: "Split", detail: "Pre-specified subgroups by age, sex and baseline blood pressure, with further subgroups by constraint, network size and the share of contacts with high blood pressure." },
    ],
    limitations: [
      "High dropout in both arms, which the authors call the main limitation.",
      "Engagement in the network arm varied widely.",
      "The authors describe barriers: discomfort involving family or friends, network members without time for meetings, and withdrawal after new disability.",
    ],
    soWhat:
      "The subgroup result suggests network interventions may help most where networks are close-knit. The authors frame this as a direction for further research.",
    figures: [],
    connections: [
      { to: "theory-2016", kind: "cites", why: "Cites the 2016 social network theory of patients as the basis for its intervention." },
      { to: "instrument-2018", kind: "cites", why: "Cites the 2018 tool and reports the same network measures." },
      { to: "arrival-2019", kind: "same-measure", why: "Constraint split this trial's results, as it separated slow from fast arrivers in the 2019 study." },
      { to: "gaps-2022", kind: "shared-authors", why: "Niteesh Choudhry, this trial's senior author, is an author of the 2022 review." },
    ],
    readNext: [
      { to: "arrival-2019", why: "Where constraint first separated patients in this collection." },
      { to: "validation-2026", why: "The other recent paper: measuring social interaction itself rather than changing networks." },
    ],
    tags: ["randomised trial", "blood pressure", "constraint", "null result"],
  },

  {
    id: "validation-2026",
    step: 8,
    year: 2026,
    kind: "Validation",
    role: "Validates the sensor",
    title:
      "Validation of SocialBit as a smartwatch algorithm for social interaction detection in a clinical population",
    authors:
      "Amar Dhand, Samuel Tate, Cade Mack, Sofia Carozza, David Farynyk, Mehdi Bourahla, Oluwamayomikun Adeboye, Grace Cooke, Olivia Berglund, Riya Dahima, Melinda Luo, Vrushali Dhongade, George S. Usmanov, Kelly White, Amanda M. Bernal, Ross Zafonte, Shrikanth Narayanan, Minwoo Lee, Matthias R. Mehl, Min Shin",
    shortAuthors: "Dhand et al.",
    venue: "Scientific Reports 16:4529",
    doi: "10.1038/s41598-026-37746-x",
    url: "https://doi.org/10.1038/s41598-026-37746-x",
    license: "cc-by",
    pages: 12,
    minutes: 7,
    glance:
      "88,918 minutes of hospital life coded by humans, compared with a watch that never stores raw audio. SocialBit reached 0.87 sensitivity and 0.88 specificity, and held up in patients with aphasia.",
    headline: {
      value: "0.94",
      label: "area under the curve",
      note: "Sensitivity 0.87, specificity 0.88, balanced accuracy 0.87, compared against minute-by-minute human coding of a video livestream.",
    },
    question:
      "How accurately does SocialBit detect social interaction in hospitalised stroke patients with a wide range of stroke severity, cognition and language ability?",
    method:
      "153 hospitalised stroke patients wore a smartwatch from 9am to 5pm for up to 8 days between June 2021 and March 2025. YAMNet turned audio into 1,024-dimensional features on the watch, and a fine-tuned Transformer, run off the watch, labelled each minute. Human coders scored 88,918 minutes as ground truth.",
    finding:
      "Sensitivity 0.87 and specificity 0.88 overall, with an AUC of 0.93 in patients with aphasia. Patients with more severe strokes interacted less, a relationship SocialBit detected at close to the strength human coders did.",
    caveat:
      "It detects whether an interaction happened, not its depth, tone or quality — features the authors say matter for functional outcomes.",
    stats: [
      { value: "88,918", label: "minutes coded by humans", note: "About 1,482 hours over 325 hospital days. SocialBit produced 14,045 minutes, because it recorded audio features for one minute in every five to save battery." },
      { value: "0.87 / 0.88", label: "sensitivity / specificity", note: "The Transformer version. Its balanced accuracy of 0.87 compares with 0.82 for the AudioSet Speech benchmark and 0.67 for AudioSet Conversation." },
      { value: "0.93", label: "AUC in patients with aphasia", note: "24 patients, 7 of them with global aphasia. Only 1.1% below patients without aphasia." },
      { value: "−0.9%", label: "interaction time per NIHSS point", note: "Each 1-point rise in stroke severity went with 0.9% less interaction time by SocialBit and 1.1% less by human coders. r = −0.19, p = 0.029 for SocialBit." },
      { value: "0.51 vs 0.50", label: "share of time interacting, humans vs SocialBit", note: "Nearly identical means, both with SD 0.20, despite SocialBit sampling one minute in five." },
      { value: "3.7M", label: "parameters in YAMNet, the model on the watch", note: "Built on MobileNet v1, it processes 0.96-second audio windows in real time while preserving battery life. In this study the interaction classifier ran off the watch." },
    ],
    procedure: [
      { label: "Listen", detail: "The watch captures ambient audio for one minute in every five, from 9am to 5pm." },
      { label: "Abstract", detail: "YAMNet turns each 0.96-second window into a 1,024-dimensional feature vector on the watch. Raw audio isn't stored and no language processing runs; the features leave out specific words and speaker identity." },
      { label: "Classify", detail: "A fine-tuned Transformer — two units, six-head attention, 768 dimensions — labels each one-minute segment as interaction or not. An LSTM version was also trained and scored slightly lower." },
      { label: "Check", detail: "Five-fold cross-validation against the human coding, broken down by aphasia, conversation depth, tone, number of speakers, partner, language, modality, television, side conversations, care setting and watch model." },
    ],
    limitations: [
      "Data came from hospital settings; the algorithm may need further tuning for home or community use.",
      "Most interactions were in English.",
      "Patients with severe stroke and aphasia were limited in number.",
      "The model detects whether an interaction happened, not its depth, tone or quality.",
      "Using social sensing in clinical care would need changes in culture, reimbursement and regulation.",
    ],
    soWhat:
      "It gives a validated way to measure social interaction without self-report, including in patients with aphasia whom earlier survey studies had to exclude.",
    figures: [
      {
        src: "figures/roc-socialbit.png",
        alt: "Receiver operating characteristic curves for four models. The SocialBit Transformer curve rises most steeply, reaching an area under the curve of 0.94.",
        reading:
          "Four models on one chart; the closer a curve bends to the top left, the better. SocialBit's Transformer (dark red, AUC 0.94) is above both off-the-shelf AudioSet classifiers, most clearly AudioSet Conversation (green, 0.73).",
        credit: "Dhand et al., Scientific Reports 2026, Fig. 3. CC BY 4.0.",
      },
      {
        src: "figures/severity-effect.png",
        alt: "Scatter plot of proportion of time spent interacting against NIH Stroke Scale score, with similar downward regression lines for SocialBit and human coders.",
        reading:
          "Patients with more severe strokes interacted less. SocialBit's line (red) and the human coders' line (blue) slope down together.",
        credit: "Dhand et al., Scientific Reports 2026, Fig. 5. CC BY 4.0.",
      },
      {
        src: "figures/aphasia-sensitivity.png",
        alt: "Bar chart of SocialBit sensitivity across aphasia subtypes: global 0.73, Wernicke's 0.93, Broca's 0.82, mixed 0.90, unknown 0.86.",
        reading:
          "Sensitivity by aphasia subtype. Global aphasia is lowest, at 0.73 from 7 patients. The authors suggest sensitivity drops in aphasia because these patients contribute less speech and their interactions are briefer.",
        credit: "Dhand et al., Scientific Reports 2026, Fig. 4. CC BY 4.0.",
      },
    ],
    connections: [
      { to: "protocol-2023", kind: "protocol-for", why: "Cites the 2023 protocol for its full design, and reports 153 patients against the protocol's target of 200." },
      { to: "recovery-2019", kind: "gap-named", why: "Includes 24 patients with aphasia, a group the 2019 recovery study had to exclude." },
      { to: "gaps-2022", kind: "shared-authors", why: "Narayanan, Shin and Mehl are authors of both." },
    ],
    readNext: [
      { to: "theory-2016", why: "Go back to where the collection starts, the 2016 framework." },
      { to: "trial-2025", why: "The other recent paper: changing networks rather than measuring interaction." },
    ],
    tags: ["smartwatch", "YAMNet", "transformer", "aphasia", "digital biomarker"],
  },
];

export const byId = (id: string) => PAPERS.find((p) => p.id === id)!;

/**
 * What each paper brings of its own. Five report their own participants; the
 * framework, the review and the protocol don't.
 */
export const COHORTS: Record<
  string,
  { n: string; design: string; setting: string }
> = {
  "theory-2016": { n: "—", design: "Framework", setting: "No participants" },
  "instrument-2018": { n: "1,493", design: "Cross-sectional survey", setting: "GEMS cohort, United States" },
  "arrival-2019": { n: "175", design: "Observational, two groups", setting: "Acute ischaemic stroke" },
  "recovery-2019": { n: "172", design: "Prospective, 6 months", setting: "Mostly mild ischaemic stroke" },
  "gaps-2022": { n: "—", design: "Review", setting: "No participants" },
  "protocol-2023": { n: "200 planned", design: "Observational validation", setting: "Two Boston hospitals" },
  "trial-2025": { n: "45", design: "Randomised controlled trial", setting: "Stroke survivors, 3 months" },
  "validation-2026": { n: "153", design: "Prospective validation", setting: "Hospital and rehabilitation" },
};

/** How each link kind reads beside the paper it points to. */
export const LINK_LABEL: Record<LinkKind, string> = {
  cites: "cites",
  "cited-by": "cited by",
  "same-tool": "same survey tool",
  "same-measure": "same measure",
  "shared-authors": "shared authors",
  "protocol-for": "protocol",
  "results-of": "results",
  "gap-named": "gap it addresses",
  "gap-addressed": "gap addressed by",
};

/** Routes through the collection, for readers with different amounts of time. */
export const ROUTES = [
  {
    id: "short",
    label: "Shortest route",
    blurb: "The 2016 framework and the 2026 sensor validation.",
    steps: ["theory-2016", "validation-2026"],
  },
  {
    id: "method",
    label: "How it was measured",
    blurb: "The survey tool, then the sensor study's protocol and results.",
    steps: ["instrument-2018", "protocol-2023", "validation-2026"],
  },
  {
    id: "clinical",
    label: "Patient outcomes",
    blurb: "Arrival time, physical function and blood pressure.",
    steps: ["arrival-2019", "recovery-2019", "trial-2025"],
  },
  {
    id: "full",
    label: "All eight",
    blurb: "In publication order.",
    steps: PAPERS.map((p) => p.id),
  },
];
