/**
 * The SocialBit collection.
 *
 * Eight papers, read in order, tell one story: how a decade of social-network
 * research in neurology turned into a smartwatch that can hear whether a stroke
 * patient is alone. Every number here is quoted from the paper it belongs to —
 * this file is the exhibit label, so it has to be as exact as the wall text in
 * a museum.
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
  /** shown on the back of the tile — what the number actually means */
  note?: string;
};

export type Figure = {
  src: string;
  alt: string;
  /** what a reader should take away in one look */
  reading: string;
  credit: string;
  /** portrait figures get a taller frame in the gallery */
  aspect?: "wide" | "tall";
};

export type LinkKind =
  | "builds-on"
  | "same-instrument"
  | "same-cohort"
  | "answers"
  | "motivates"
  | "tests";

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
  /** position on the spine, 1-8 */
  step: number;
  year: number;
  kind: PaperKind;
  /** the job this paper does in the arc, two or three words */
  role: string;
  title: string;
  authors: string;
  /** first author + et al, for tight spaces */
  shortAuthors: string;
  venue: string;
  doi: string;
  url: string;
  license: "cc-by" | "cc-by-nc" | "cc-by-nc-nd" | "closed";
  /** minutes to read this exhibit at full depth */
  minutes: number;

  /** GLANCE — one sentence you could say out loud in a lab meeting */
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

export const COLLECTION_TITLE = "SocialBit";
export const COLLECTION_SUB =
  "How ten years of social-network research in neurology became a watch that can hear whether you are alone.";

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
    minutes: 4,
    glance:
      "Neurology treats the patient as a solitary figure. This paper argues the patient is a node in a network, and hands the field the vocabulary to measure it.",
    headline: {
      value: "≈ smoking",
      label: "how much social isolation raises health risk",
      note: "Isolation sits alongside high blood pressure, high cholesterol and physical inactivity as a determinant of poor health.",
    },
    question:
      "Clinicians already talk to a patient's family every day, but nothing about that social world is recorded or acted on. Could it be measured the way blood pressure is?",
    method:
      "A conceptual framework rather than a study. It imports personal-network analysis from sociology and defines the survey that produces it: a name generator, a name inter-relater and a name interpreter.",
    finding:
      "Two patients with the same diagnosis can sit in opposite social structures. One is ringed by four strongly tied relatives; the other has five loosely connected contacts. Density, constraint and effective size make that difference a number.",
    caveat:
      "It proposes an agenda; it does not test one. Everything downstream in this collection exists because this paper had no data of its own.",
    stats: [
      { value: "3", label: "survey sections", note: "Name generator lists the people. Name inter-relater asks how they know each other. Name interpreter asks who they are and how they live." },
      { value: "5", label: "pathways from network to health", note: "Person-to-person contact, social engagement, social influence, access to resources, and social support." },
      { value: "1.0 vs 0.6", label: "density, patient 1 vs patient 2", note: "Density is observed ties divided by all possible ties. A value of 1.0 means everyone around the patient knows everyone else." },
    ],
    procedure: [
      { label: "Borrow", detail: "Personal-network (egocentric) analysis is taken from graph theory and sociology, where the patient is the ego and each contact is an alter." },
      { label: "Define", detail: "Structure is measured by size, density, constraint and effective size. Composition is measured by who the alters are and what habits they keep." },
      { label: "Instrument", detail: "Questions are adapted from the General Social Survey so answers can be compared to population norms." },
      { label: "Propose", detail: "An agenda: map networks across neurological disorders, test whether they predict outcomes, then try to change them." },
    ],
    limitations: [
      "No cohort, no outcome data — the framework is argued, not demonstrated.",
      "The survey is long enough to be impractical at the bedside without a tool to carry it.",
      "It assumes patients can self-report their own social world, which excludes exactly the patients most likely to be isolated.",
    ],
    soWhat:
      "Every later paper in this collection is either building the instrument this one specified, or working around the self-report assumption it took for granted.",
    figures: [],
    connections: [
      { to: "instrument-2018", kind: "motivates", why: "The survey specified here is what gets built into a scalable web tool two years later." },
      { to: "gaps-2022", kind: "motivates", why: "The research agenda proposed here is audited and updated in the 2022 review." },
    ],
    readNext: [
      { to: "instrument-2018", why: "See the survey turned into something 1,493 people could actually complete." },
      { to: "gaps-2022", why: "Skip ahead if you want the mechanism — why the brain is sensitive to the social environment at all." },
    ],
    tags: ["personal networks", "constraint", "framework", "stroke"],
  },

  {
    id: "instrument-2018",
    step: 2,
    year: 2018,
    kind: "Instrument",
    role: "Builds the ruler",
    title:
      "A scalable online tool for quantitative social network assessment reveals potentially modifiable social environmental risks",
    authors:
      "Amar Dhand, Charles C. White, Catherine Johnson, Zongqi Xia, Philip L. De Jager",
    shortAuthors: "Dhand et al.",
    venue: "Nature Communications 9:3930",
    doi: "10.1038/s41467-018-06408-6",
    url: "https://doi.org/10.1038/s41467-018-06408-6",
    license: "cc-by",
    minutes: 5,
    glance:
      "The survey becomes a web tool, and 1,493 people fill it in. The surprise: who surrounds you predicts your disability better than how they are arranged.",
    headline: {
      value: "1,493",
      label: "personal networks mapped",
      note: "Participants in the GEMS cohort, all first-degree relatives of someone with multiple sclerosis.",
    },
    question:
      "Can a full personal-network survey be run at clinical-trial scale, and if it can, does anything in the resulting network actually track with how disabled a person is?",
    method:
      "A 48-question adaptive survey on REDCap, HIPAA-compliant, about 10 to 15 minutes to finish. It was sent to the GEMS cohort of people at elevated risk of multiple sclerosis. Disability was self-reported on the MSRS-R.",
    finding:
      "Composition beat structure. The percentage of a person's contacts who skip their own doctor's appointments was strongly associated with that person's disability. Network size and density were not.",
    caveat:
      "Cross-sectional. Whether unhealthy contacts make you worse, or being worse changes who stays around you, this design cannot say.",
    stats: [
      { value: "7.4 × 10⁻⁸", label: "p, contacts who skip the doctor", note: "The strongest single variable against MSRS-R disability. False discovery rate 9.6 × 10⁻⁷." },
      { value: "p = 0.066", label: "network structure, combined", note: "Size, density, constraint and effective size together did not reach significance. Composition did, at p < 0.0001." },
      { value: "8", label: "people in an average network", note: "And they were densely connected — 67% of all possible ties between them were present." },
      { value: "44%", label: "of contacts were family", note: "38% were named as supportive. Sex diversity was 0.89, close to an even mix. Race diversity was 0." },
      { value: "10–15 min", label: "to complete", note: "48 questions, adapting to the answers given. Short enough to bolt onto a clinical study." },
    ],
    procedure: [
      { label: "Generate names", detail: "Three prompts — who did you discuss important matters with, socialise with, and get support from in the last three months. No cap on how many people could be named." },
      { label: "Relate names", detail: "For the first ten people named, every pair is rated a stranger, a weak tie or a strong tie." },
      { label: "Interpret names", detail: "For each of those ten: demographics, relationship type, and four health habits — smoking, exercise, medication adherence, attending appointments." },
      { label: "Analyse", detail: "Structure and composition metrics are regressed against MSRS-R disability, with a permutation-based omnibus test across each category." },
    ],
    limitations: [
      "Cross-sectional, so causality and direction are both out of reach.",
      "MSRS-R scores clustered low because most of the cohort was asymptomatic, which risks a floor effect.",
      "Only 115 participants had an MS diagnosis, likely underpowering the comparison against the 1,378 asymptomatic ones.",
      "Networks were self-reported, and the cohort was recruited through advocacy groups and social media, so it may not generalise.",
    ],
    soWhat:
      "It moved the target. If the health habits of the people around you matter more than the shape of the network, then a network intervention should be aimed at the people, not the wiring.",
    figures: [
      {
        src: "figures/montage-1493.png",
        alt: "A grid of 1,493 small network diagrams, each a black dot for the participant ringed by white dots for their contacts, joined by red strong ties and blue weak ties, arranged from smallest network at top left to largest at bottom right.",
        reading:
          "Every small shape is one person's entire social world. Read left to right, top to bottom: networks grow from a single tie to dense knots of twenty. Red lines are strong ties, blue are weak.",
        credit: "Dhand et al., Nature Communications 2018, Fig. 2. CC BY 4.0.",
        aspect: "wide",
      },
    ],
    connections: [
      { to: "theory-2016", kind: "builds-on", why: "Implements the three-part survey the framework paper specified." },
      { to: "arrival-2019", kind: "same-instrument", why: "The same tool is turned on stroke patients to study how fast they reached hospital." },
      { to: "recovery-2019", kind: "same-instrument", why: "And again, longitudinally, to follow recovery over six months." },
    ],
    readNext: [
      { to: "arrival-2019", why: "The same instrument, now with a hard outcome: did the patient get to hospital in time." },
      { to: "trial-2025", why: "Jump to the trial that tried to change network composition, and what happened." },
    ],
    tags: ["REDCap", "multiple sclerosis", "composition", "GEMS"],
  },

  {
    id: "arrival-2019",
    step: 3,
    year: 2019,
    kind: "Cohort study",
    role: "Finds the mechanism",
    title: "Social networks and risk of delayed hospital arrival after acute stroke",
    authors:
      "Amar Dhand, Douglas Luke, Catherine Lang, Michael Tsiaklides, Steven Feske, Jin-Moo Lee",
    shortAuthors: "Dhand et al.",
    venue: "Nature Communications 10:1206",
    doi: "10.1038/s41467-019-09073-5",
    url: "https://doi.org/10.1038/s41467-019-09073-5",
    license: "cc-by",
    minutes: 5,
    glance:
      "Patients surrounded by a small, tight circle of people who all know each other arrived at hospital late — and none of them got the clot-busting drug.",
    headline: {
      value: "0% vs 50%",
      label: "received clot-dissolving treatment",
      note: "None of the 67 slow arrivers were given tissue plasminogen activator. Half the 108 fast arrivers were. The drug is only given within 4.5 hours.",
    },
    question:
      "In cardiac emergencies, being surrounded by family paradoxically slows you down. Does the same hold in stroke, and if so, what is the mechanism?",
    method:
      "175 patients with acute ischaemic stroke were split by arrival time — 108 within 6 hours, 67 after. Their personal networks were mapped with the 2018 tool and compared on Burt's social capital measures.",
    finding:
      "Slow arrivers had smaller networks, averaging 5 people against 8, and much higher constraint, 61 against 40. A closed circle of people who all know each other produces no outside opinion, so the group elects to watch and wait.",
    caveat:
      "The cohort was 88% mild stroke, chosen because mild symptoms are themselves a risk for delay. Whether network structure still matters in severe stroke is untested.",
    stats: [
      { value: "5 vs 8", label: "network size, slow vs fast", note: "Median 5 (IQR 4–8) for slow arrivers against 8 (IQR 6–10) for fast. p < 0.0001." },
      { value: "61 vs 40", label: "constraint, slow vs fast", note: "Constraint measures how far the patient's contacts are tied to each other. Higher means a more closed, redundant circle. p < 0.0001." },
      { value: "175", label: "patients enrolled", note: "108 arrived within 6 hours of symptom onset, 67 after." },
      { value: "80%", label: "of strokes happen in front of someone", note: "And bystanders place roughly 96% of stroke emergency calls, which is why arrival is a group decision, not an individual one." },
    ],
    procedure: [
      { label: "Split", detail: "Arrival within 6 hours of symptom onset counted as fast; anything later, slow." },
      { label: "Map", detail: "Each patient's personal network was elicited during hospitalisation with the same three-part survey." },
      { label: "Measure", detail: "Burt's measures — size, constraint, effective size and mean degree — quantify whether the circle is closed or radial." },
      { label: "Adjust", detail: "Multivariable regression controlled for demographic, clinical and socioeconomic factors." },
    ],
    limitations: [
      "Unmeasured confounders could still explain the difference in arrival time.",
      "Almost everyone had mild stroke, so the finding may not transfer to moderate or severe presentations.",
      "Patients who could not do the interview — non-English speakers, severe stroke, aphasia — were excluded, which is a selection bias in a study about who gets help.",
      "Knowledge of stroke symptoms was never measured, and it could be either a confounder or the mechanism itself.",
    ],
    soWhat:
      "It gives constraint a clinical meaning. A closed network is not merely a description; it is a measurable risk factor for missing the treatment window.",
    figures: [
      {
        src: "figures/montage-slow.png",
        alt: "Sixty-seven small network diagrams for patients who arrived at hospital late, arranged from high constraint at the top to low constraint at the bottom.",
        reading:
          "Slow arrivers, sorted by constraint. Look at the top rows: triangles and squares, drawn almost entirely in red strong ties. Small circles where everyone already knows everyone.",
        credit: "Dhand et al., Nature Communications 2019, Fig. 2a. CC BY 4.0.",
      },
      {
        src: "figures/montage-fast.png",
        alt: "One hundred and eight small network diagrams for patients who arrived at hospital within six hours, showing larger and more open networks with more blue weak ties.",
        reading:
          "Fast arrivers, same scale. The grid runs deeper and the shapes get bigger and spikier, with far more blue weak ties reaching outward. Someone in these networks was a stranger to the others — and said go.",
        credit: "Dhand et al., Nature Communications 2019, Fig. 2b. CC BY 4.0.",
      },
    ],
    connections: [
      { to: "instrument-2018", kind: "same-instrument", why: "Uses the web-based network survey built in the 2018 paper." },
      { to: "trial-2025", kind: "motivates", why: "Constraint turns out to be the variable that predicts who responds to a network intervention." },
    ],
    readNext: [
      { to: "recovery-2019", why: "Same year, same instrument, but following what happens to the network after the stroke." },
      { to: "trial-2025", why: "Constraint reappears here as the one thing that predicted who the intervention helped." },
    ],
    tags: ["stroke", "constraint", "tPA", "time to treatment"],
  },

  {
    id: "recovery-2019",
    step: 4,
    year: 2019,
    kind: "Cohort study",
    role: "Follows the change",
    title: "Social Network Mapping and Functional Recovery Within 6 Months of Ischemic Stroke",
    authors:
      "Amar Dhand, Catherine E. Lang, Douglas A. Luke, Angela Kim, Karen Li, Liam McCafferty, Yi Mu, Bernard Rosner, Steven K. Feske, Jin-Moo Lee",
    shortAuthors: "Dhand et al.",
    venue: "Neurorehabilitation and Neural Repair 33(11):922–932",
    doi: "10.1177/1545968319872994",
    url: "https://doi.org/10.1177/1545968319872994",
    license: "closed",
    minutes: 4,
    glance:
      "In the six months after a stroke, networks shrink and close around family — but they also get healthier. Only the size you started with predicted physical function.",
    headline: {
      value: "−1.25 people",
      label: "average network change over 6 months",
      note: "Networks contracted, grew denser and became more family-oriented. They also shed contacts who smoked or did not exercise.",
    },
    question:
      "Social networks change after a major illness. Does that change help or hurt physical recovery, and which part of the network matters?",
    method:
      "172 patients with mostly mild ischaemic stroke were mapped at baseline and followed to 3 and 6 months, with 149 and 139 retained. Physical function was measured on the PROMIS Physical Function scale.",
    finding:
      "Baseline network size — not density, not the health habits inside the network — was independently associated with physical function at both 3 and 6 months. Patients in small kin-based networks reported more negative social interactions.",
    caveat:
      "Patients with aphasia were excluded, because the study depended on self-report. That is precisely the group most at risk of social network decay.",
    stats: [
      { value: "172", label: "patients mapped at baseline", note: "149 retained at 3 months and 139 at 6 months. Median NIH Stroke Scale of 2 — mostly mild, motor-predominant stroke." },
      { value: "size", label: "the only independent predictor", note: "Baseline network size held against demographics, socioeconomic status, clinical characteristics, comorbidities, cognition and depression. Density and network health habits did not." },
      { value: "healthier", label: "what the network became", note: "Ties to people who smoked or did not exercise were pruned over the six months, even as the network shrank." },
    ],
    procedure: [
      { label: "Enrol", detail: "Patients with ischaemic stroke, mapped during hospitalisation with the quantitative network tool." },
      { label: "Follow", detail: "Networks re-mapped at 3 and 6 months, so change within a person could be measured rather than inferred." },
      { label: "Model", detail: "Mixed-effects models for network change over time; multivariable models for the association with PROMIS physical function." },
      { label: "Adjust", detail: "Controlled for demographics, socioeconomic status, stroke severity, comorbidity, cognition and depression." },
    ],
    limitations: [
      "Limited to mild ischaemic stroke; moderate, severe, haemorrhagic and recurrent stroke were not studied.",
      "Aphasia was excluded outright because the design relied on patients reporting their own networks.",
      "Non-English speakers were not included.",
      "Attrition was non-random in principle, and missing data in a longitudinal analysis is a validity threat even though completers and non-completers looked alike.",
    ],
    soWhat:
      "This is the paper that names the blind spot. A self-report instrument cannot see the patients who cannot speak — and it says so, suggesting caregiver proxies or social sensors as the way out.",
    figures: [],
    connections: [
      { to: "instrument-2018", kind: "same-instrument", why: "The same network survey, run longitudinally instead of once." },
      { to: "protocol-2023", kind: "motivates", why: "Its exclusion of aphasia is the explicit gap the SocialBit study sets out to close." },
      { to: "validation-2026", kind: "motivates", why: "The call for 'social sensors independent of self-report' is answered here." },
    ],
    readNext: [
      { to: "gaps-2022", why: "The review that takes this gap seriously and starts assembling a sensing team." },
      { to: "validation-2026", why: "Go straight to the sensor that measures the patients this study had to exclude." },
    ],
    tags: ["stroke recovery", "PROMIS", "aphasia gap", "longitudinal"],
  },

  {
    id: "gaps-2022",
    step: 5,
    year: 2022,
    kind: "Review",
    role: "Assembles the team",
    title: "Leveraging Social Networks for the Assessment and Management of Neurological Patients",
    authors:
      "Amar Dhand, Archana Podury, Niteesh Choudhry, Shrikanth Narayanan, Min Shin, Matthias R. Mehl",
    shortAuthors: "Dhand et al.",
    venue: "Seminars in Neurology 42:136–148",
    doi: "10.1055/s-0042-1744532",
    url: "https://doi.org/10.1055/s-0042-1744532",
    license: "cc-by-nc-nd",
    minutes: 5,
    glance:
      "The review that turns a neurology problem into an engineering one. Read the author list: a signal processing lab, a computer vision lab and a psychology lab have joined.",
    headline: {
      value: "81% vs 3%",
      label: "social factors vs clinical care, in shaping health outcomes",
      note: "In one nation-wide study, socioeconomic factors and health behaviours accounted for 81% of health outcomes. Clinical care accounted for 3%.",
    },
    question:
      "Why is the brain so sensitive to the social environment, and what would it take to measure social connection at the scale and frequency clinical care actually needs?",
    method:
      "A review across three layers: the neurobiology and psychology of social connection, the assessment methods available including new wearable sensors, and the design of network interventions.",
    finding:
      "Social networks are the one social determinant of health a clinician can actually reach. But surveys are burdensome, episodic and blind to anyone who cannot answer them — which points to passive sensing.",
    caveat:
      "A review synthesises; it does not test. The sensing methods it surveys were, at the time of writing, largely unvalidated in patients.",
    stats: [
      { value: "+32%", label: "stroke risk with poor social relationships", note: "The same body of evidence puts the increased risk of developing dementia at 50%." },
      { value: "3", label: "layers of definition", note: "Social networks are the people. Social interactions are the synchronous exchanges. Social connection covers the structural, functional and qualitative sides of both." },
      { value: "6", label: "authors, four disciplines", note: "Neurology, health policy, electrical engineering, computer science and psychology. This is the SocialBit team forming." },
    ],
    procedure: [
      { label: "Biology", detail: "Reviews how the social environment shapes brain development and how isolation raises stress response and allostatic load." },
      { label: "Psychology", detail: "Sets out the social baseline — the idea that wellbeing is calibrated to expected social contact." },
      { label: "Assessment", detail: "Compares survey instruments against emerging mobile and acoustic sensing, including the electronically activated recorder tradition Mehl built." },
      { label: "Intervention", detail: "Lays out how network interventions could be designed, and why prior social support trials mostly failed." },
    ],
    limitations: [
      "Narrative rather than systematic, so selection of evidence is a judgement call.",
      "The sensing approaches reviewed had not been validated in patients with neurological deficits.",
      "It argues that networks are modifiable without yet having a positive trial to point to.",
    ],
    soWhat:
      "This is the hinge of the collection. Everything before it measures networks by asking. Everything after it measures them by listening.",
    figures: [],
    connections: [
      { to: "theory-2016", kind: "builds-on", why: "Revisits and updates the agenda set out six years earlier." },
      { to: "protocol-2023", kind: "motivates", why: "The sensing case made here becomes a funded validation study." },
      { to: "trial-2025", kind: "motivates", why: "Its intervention design section is what TEAMS-BP goes on to test." },
    ],
    readNext: [
      { to: "protocol-2023", why: "The sensor stops being a proposal and becomes a study design." },
      { to: "trial-2025", why: "Or follow the intervention thread instead, into a randomised trial." },
    ],
    tags: ["review", "social sensing", "neurobiology", "team"],
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
    minutes: 3,
    glance:
      "The plan, published before the answer was known. A watch listens, human coders watch a video livestream, and the two are compared minute by minute.",
    headline: {
      value: "8 days",
      label: "of continuous observation per patient",
      note: "Across hospitalisation and rehabilitation, with a target of 200 patients at Brigham and Women's and Spaulding.",
    },
    question:
      "Can a smartwatch detect social interaction accurately in stroke survivors whose speech, cognition and movement are impaired — the people every survey-based study has had to exclude?",
    method:
      "A prospective observational validation study. Patients wear a SocialBit-equipped smartwatch during normal hospital days while human observers tally their interactions over a video livestream. The human tally is the ground truth.",
    finding:
      "Pre-registered, so there is no finding yet. What matters is the design commitment: ground truth is minute-level human observation, not patient recall.",
    caveat:
      "The authors flag it themselves. A hospital is not a home, and refusing to store raw audio makes the machine learning harder, not easier.",
    stats: [
      { value: "200", label: "patients targeted", note: "Recruited at Brigham and Women's Hospital and Spaulding Rehabilitation Hospital in Boston." },
      { value: "0", label: "seconds of raw audio stored", note: "Only derived acoustic features are kept, which is what makes continuous recording in a hospital room defensible." },
      { value: "1", label: "person has to wear a device", note: "Earlier interaction sensors needed every party in the conversation to be instrumented. This one does not." },
    ],
    procedure: [
      { label: "Recruit", detail: "Consecutive inpatients with acute ischaemic stroke, including those with aphasia and cognitive impairment." },
      { label: "Wear", detail: "A commercial smartwatch runs SocialBit through the patient's ordinary day, up to 8 days across acute and rehabilitation settings." },
      { label: "Observe", detail: "Human coders score each minute as interaction or not, watching a video livestream of the room." },
      { label: "Compare", detail: "Algorithm output is scored against the human tally, and interaction time is related to stroke characteristics and outcomes." },
    ],
    limitations: [
      "Conducted in hospital, so accuracy in a home or community setting stays unknown.",
      "Privacy protection removes raw audio, which deprives the model of the richest possible input.",
      "Ground-truth coding by video livestream is expensive, which caps how much data can exist.",
    ],
    soWhat:
      "Publishing the protocol first is what makes the 2026 numbers credible. The bar was set before anyone knew whether the algorithm could clear it.",
    figures: [],
    connections: [
      { to: "recovery-2019", kind: "answers", why: "Directly targets the aphasia exclusion that limited the recovery study." },
      { to: "gaps-2022", kind: "builds-on", why: "Turns the review's case for social sensing into a registered study." },
      { to: "validation-2026", kind: "tests", why: "This is the plan; the 2026 paper is the result." },
    ],
    readNext: [
      { to: "validation-2026", why: "Read the answer to the question this protocol asks." },
    ],
    tags: ["protocol", "ground truth", "privacy", "aphasia"],
  },

  {
    id: "trial-2025",
    step: 7,
    year: 2025,
    kind: "Trial",
    role: "Tries to intervene",
    title:
      "Social network intervention to improve blood pressure control after stroke: The TEAMS-BP randomized clinical trial",
    authors:
      "Amar Dhand, Katherine Crum, Kaitlin E. Hanken, Gauri Bhatkhande, Melinda Luo, Ian M. Corbin, George Usmanov, Zachary Rothfeld-Wehrwein, Vrushali Dhongade, David Lin, Chloe Slocum, Nancy Haff, Niteesh K. Choudhry",
    shortAuthors: "Dhand et al.",
    venue: "Social Science & Medicine 380:118231",
    doi: "10.1016/j.socscimed.2025.118231",
    url: "https://doi.org/10.1016/j.socscimed.2025.118231",
    license: "closed",
    minutes: 5,
    glance:
      "The trial missed its primary endpoint. But split the patients by constraint and the effect flips sign — tight networks gained 12 mmHg, open networks lost 16.",
    headline: {
      value: "−12.4 vs +16.1",
      label: "mmHg change, high vs low constraint",
      note: "The same intervention lowered blood pressure in patients with closed networks and raised it in patients with open ones. p = 0.03.",
    },
    question:
      "Networks predict outcomes. Can changing them change a hard clinical number — systolic blood pressure after stroke?",
    method:
      "A randomised controlled trial. 45 stroke survivors recruited over two years, 24 assigned to network counselling that brought their contacts into the sessions, 21 to individual counselling. Three months of follow-up. Registered as NCT05258890.",
    finding:
      "No significant difference overall: −5.2 mmHg, 95% CI −14.8 to 4.5, p = 0.29. The pre-specified subgroup told a different story, and constraint was the variable that split it.",
    caveat:
      "The dropout is severe enough to shape the conclusion. Two thirds of the intervention arm withdrew or were lost, and engagement among those who stayed varied widely.",
    stats: [
      { value: "−5.2 mmHg", label: "primary outcome, adjusted", note: "95% CI −14.8 to 4.5, p = 0.29. Numerically lower in the intervention arm, but not significant." },
      { value: "16 of 24", label: "intervention patients lost", note: "In the control arm, 10 of 21 withdrew or were lost to follow-up. The trial ran for two years to recruit 45 people." },
      { value: "24%", label: "attended network sessions alone", note: "58% brought one other person; 18% brought three or more. A network intervention that no network attends is individual counselling." },
    ],
    procedure: [
      { label: "Randomise", detail: "Stroke survivors assigned to network counselling or individual counselling for three months." },
      { label: "Activate", detail: "The network arm invited the patient's own contacts into sessions built around teamwork on blood pressure control." },
      { label: "Measure", detail: "Absolute systolic blood pressure difference over three months, as the primary outcome." },
      { label: "Split", detail: "Pre-specified subgroups by constraint, network size, age, sex, baseline blood pressure and the share of contacts with hypertension." },
    ],
    limitations: [
      "High dropout in both arms, worse in the intervention arm, which the authors put first among the limitations.",
      "Engagement varied so much that the intervention was not consistently delivered.",
      "45 participants is small for a subgroup analysis, so the constraint finding is a hypothesis, not a result.",
      "Patients described real barriers: discomfort asking family for help, contacts who could not find time, and withdrawal from embarrassment about new disability.",
    ],
    soWhat:
      "A null trial that earns its keep. It says network interventions are not for everyone — they are for people whose networks are already closed, which is exactly the group the 2019 arrival study flagged.",
    figures: [],
    connections: [
      { to: "arrival-2019", kind: "builds-on", why: "Constraint, the variable that predicted delayed arrival, is what predicts who responds here." },
      { to: "gaps-2022", kind: "tests", why: "Puts the review's intervention design into a randomised trial." },
      { to: "validation-2026", kind: "motivates", why: "Poor engagement and coarse outcomes are the case for a passive, continuous measure." },
    ],
    readNext: [
      { to: "arrival-2019", why: "Go back for what constraint means, and why closed networks behave differently." },
      { to: "validation-2026", why: "The measurement problem this trial ran into, solved." },
    ],
    tags: ["randomised trial", "blood pressure", "constraint", "null result"],
  },

  {
    id: "validation-2026",
    step: 8,
    year: 2026,
    kind: "Validation",
    role: "Delivers the sensor",
    title:
      "Validation of SocialBit as a smartwatch algorithm for social interaction detection in a clinical population",
    authors:
      "Amar Dhand, Samuel Tate, Cade Mack, Sofia Carozza, David Farynyk, Mehdi Bourahla, Oluwamayomikun Adeboye, Grace Cooke, Olivia Berglund, Riya Dahima, Melinda Luo, Vrushali Dhongade, George S. Usmanov, Kelly White, Amanda M. Bernal, Ross Zafonte, Shrikanth Narayanan, Minwoo Lee, Matthias R. Mehl, Min Shin",
    shortAuthors: "Dhand et al.",
    venue: "Scientific Reports 16:4529",
    doi: "10.1038/s41598-026-37746-x",
    url: "https://doi.org/10.1038/s41598-026-37746-x",
    license: "cc-by",
    minutes: 7,
    glance:
      "88,918 minutes of hospital life, coded by hand, against a watch that never stores a word. The watch agrees with the humans 87% of the time — including in patients who cannot speak.",
    headline: {
      value: "0.94",
      label: "area under the curve",
      note: "Sensitivity 0.87, specificity 0.88, balanced accuracy 0.87. Benchmarked against minute-by-minute human coding of a video livestream.",
    },
    question:
      "Does the sensor work — in real hospital rooms, with televisions on and side conversations running, in patients with aphasia, on more than one brand of watch?",
    method:
      "153 hospitalised stroke patients wore a smartwatch from 9am to 5pm for up to 8 days between June 2021 and March 2025. YAMNet extracts 1,024-dimensional audio embeddings on the watch; a fine-tuned Transformer classifies each minute. Human coders scored 88,918 minutes as ground truth.",
    finding:
      "0.87 sensitivity and 0.88 specificity overall, holding at 0.93 AUC in patients with aphasia. Patients with more severe strokes interacted less, and the watch detected that relationship at nearly the same strength the human coders did.",
    caveat:
      "It detects that an interaction happened, not what kind. Depth, tone and quality — the things that make an interaction matter — are still invisible to it.",
    stats: [
      { value: "88,918", label: "minutes coded by humans", note: "About 1,482 hours across 325 hospital days. SocialBit itself contributed 14,045 minutes, sampling one minute in every five to protect battery." },
      { value: "0.87 / 0.88", label: "sensitivity / specificity", note: "The Transformer version. It beat the AudioSet Speech benchmark by 6.1% in balanced accuracy and AudioSet Conversation by 20%." },
      { value: "0.93", label: "AUC in patients with aphasia", note: "24 patients, including 7 with global aphasia. Only 1.1% below patients without aphasia." },
      { value: "−0.9%", label: "interaction time per NIHSS point", note: "Each 1-point rise in stroke severity cut SocialBit-measured interaction time by 0.9%. Human coders measured 1.1%. r = −0.19, p = 0.029." },
      { value: "0.51 vs 0.50", label: "share of time interacting, humans vs watch", note: "Mean proportions almost identical, both with SD 0.20, despite the watch sampling a fifth as often." },
      { value: "3.7M", label: "parameters in the on-watch model", note: "YAMNet is built on MobileNet v1 and processes 0.96-second windows in real time without flattening the battery." },
    ],
    procedure: [
      { label: "Listen", detail: "The watch captures ambient audio for one minute in every five, from 9am to 5pm." },
      { label: "Abstract", detail: "YAMNet converts each 0.96-second window into a 1,024-dimensional embedding on the device. Raw audio is never stored, and no language processing runs, so words and speaker identity are gone before anything leaves the watch." },
      { label: "Classify", detail: "A fine-tuned Transformer — two units, six-head attention, 768 dimensions — labels each one-minute segment as interaction or not. An LSTM version was trained alongside it and scored slightly lower." },
      { label: "Check", detail: "Five-fold cross-validation against the human coding, then broken out by aphasia subtype, conversational depth, tone, speakers, partner, language, modality, television noise, side conversations, care setting and watch model." },
    ],
    limitations: [
      "All data came from hospital and rehabilitation settings; home and community use will need retuning.",
      "Most interactions were in English, with only 210 non-English samples.",
      "Severe stroke and aphasia were represented but thinly — 24 patients with aphasia, 7 of them global.",
      "The model classifies whether an interaction happened, not its depth, tone or quality.",
      "Feature extraction ran on the watch but training and inference ran off-device; fully on-watch inference is still future work.",
      "Making this routine would need changes in clinical culture, reimbursement and regulation, not just accuracy.",
    ],
    soWhat:
      "Ten years after the framework paper asked for a way to measure the social world of a patient, there is one — and it works on the patients who could never fill in the survey.",
    figures: [
      {
        src: "figures/roc-socialbit.png",
        alt: "Receiver operating characteristic curves for four models. The SocialBit Transformer curve rises most steeply, reaching an area under the curve of 0.94.",
        reading:
          "Four models, one chart. The higher and further left a curve bends, the better. SocialBit's Transformer (dark red, AUC 0.94) clears both off-the-shelf AudioSet classifiers, and the gap over AudioSet Conversation (green, 0.73) is the whole reason a custom model was needed.",
        credit: "Dhand et al., Scientific Reports 2026, Fig. 3. CC BY 4.0.",
      },
      {
        src: "figures/severity-effect.png",
        alt: "Scatter plot of proportion of time spent interacting against NIH Stroke Scale score, with near-identical downward regression lines for SocialBit and human coders.",
        reading:
          "The clinical proof. Sicker patients interact less — and the watch's line (red) sits almost on top of the human coders' line (blue). The watch is not just accurate against humans, it recovers the same clinical relationship they do.",
        credit: "Dhand et al., Scientific Reports 2026, Fig. 5. CC BY 4.0.",
      },
      {
        src: "figures/aphasia-sensitivity.png",
        alt: "Bar chart of SocialBit sensitivity across aphasia subtypes: global 0.73, Wernicke's 0.93, Broca's 0.82, mixed 0.90, unknown 0.86.",
        reading:
          "Where it strains. Global aphasia — the patients who speak least — is the one bar that drops, to 0.73 from 7 patients. Detection depends on someone producing speech, so the least verbal patients are the hardest to see.",
        credit: "Dhand et al., Scientific Reports 2026, Fig. 4. CC BY 4.0.",
      },
    ],
    connections: [
      { to: "protocol-2023", kind: "tests", why: "Reports the study the protocol registered, at 153 patients against a 200 target." },
      { to: "recovery-2019", kind: "answers", why: "Measures the aphasia patients the recovery study had to exclude." },
      { to: "theory-2016", kind: "answers", why: "Delivers the measurement the original framework called for, without asking the patient anything." },
    ],
    readNext: [
      { to: "theory-2016", why: "Close the loop. Read the 2016 agenda again knowing what it turned into." },
      { to: "trial-2025", why: "The obvious next question: could this measure have rescued the trial's endpoint?" },
    ],
    tags: ["smartwatch", "YAMNet", "transformer", "aphasia", "digital biomarker"],
  },
];

export const byId = (id: string) => PAPERS.find((p) => p.id === id)!;

/**
 * What each paper is actually built on, side by side.
 *
 * Kept apart from the exhibits because it only exists to be compared — reading
 * down these columns is the fastest way to see that the collection rests on
 * four cohorts, one of which never reached its recruitment target.
 */
export const COHORTS: Record<
  string,
  { n: string; design: string; setting: string }
> = {
  "theory-2016": { n: "—", design: "Framework", setting: "No cohort" },
  "instrument-2018": { n: "1,493", design: "Cross-sectional survey", setting: "GEMS cohort, nationwide, USA" },
  "arrival-2019": { n: "175", design: "Observational, two groups", setting: "Stroke admissions" },
  "recovery-2019": { n: "172", design: "Prospective, 6 months", setting: "Mild ischaemic stroke" },
  "gaps-2022": { n: "—", design: "Narrative review", setting: "No cohort" },
  "protocol-2023": { n: "200 target", design: "Observational validation", setting: "Two Boston hospitals" },
  "trial-2025": { n: "45", design: "Randomised controlled trial", setting: "Stroke survivors, 3 months" },
  "validation-2026": { n: "153", design: "Prospective validation", setting: "Inpatient and rehabilitation" },
};

/** Relationship labels, written to read naturally on an edge in the map. */
export const LINK_LABEL: Record<LinkKind, string> = {
  "builds-on": "builds on",
  "same-instrument": "same instrument",
  "same-cohort": "same cohort",
  answers: "answers",
  motivates: "motivates",
  tests: "tests",
};

/** Curated routes through the collection, for readers with different budgets. */
export const ROUTES = [
  {
    id: "ten",
    label: "10 minutes",
    blurb: "The shortest path from the idea to the working sensor.",
    steps: ["theory-2016", "validation-2026"],
  },
  {
    id: "method",
    label: "How it was measured",
    blurb: "Follow the instrument: survey, then sensor.",
    steps: ["instrument-2018", "protocol-2023", "validation-2026"],
  },
  {
    id: "clinical",
    label: "What it means for patients",
    blurb: "The findings with a bedside consequence.",
    steps: ["arrival-2019", "recovery-2019", "trial-2025"],
  },
  {
    id: "full",
    label: "The whole arc",
    blurb: "All eight, in the order they were written.",
    steps: PAPERS.map((p) => p.id),
  },
];
