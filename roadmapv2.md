# JEST + JAM Combined Roadmap — Topic by Topic (v2)
**Rule used below:** if a topic is tested in both JAM and JEST → study it to full JEST depth now, before JAM (no point doing it twice). If a topic is JEST-only (not in JAM), it's deferred to after JAM so you're not spending Aug–Jan time on things JAM won't ask.

Tags used: **[JAM+JEST]** = do now, full depth. **[JEST-only]** = defer to after JAM. **[JAM-partial]** = a lighter version is JAM-testable now; the harder JEST-level part is deferred.

*Note: JAM's official syllabus wording varies slightly by year — double-check against the current jam.iitm.ac.in PDF if a classification below looks off for your year.*

## What's different in v2 (why this got rewritten)
1. **Hard cutoff moved up.** You want PYQs-only after Jan 20 — so the entire JAM-overlap syllabus (Topics 1–20 below) has to be *fully done* by Jan 20, not "early Feb" like v1 said. Jan 20 → JAM exam day is pure PYQ, zero new content, no exceptions.
2. **JEST's date isn't reliably April.** JEST's pattern/scheduling has shifted across cycles before, so treat April as the optimistic case and March as the planning case. Whichever it turns out to be, you still need a minimum **10-day pure-PYQ lockdown** immediately before it. That means Phase B can't be a flat 17-topic list you attempt in order and hope you finish — it's a **ranked list**, so a compressed March timeline still gets you the highest-value stuff, and only the low-ROI tail gets cut.
3. **Two syllabus corrections**, made by cross-checking the old JAM-vs-JEST split against actual JEST weightage/frequency data: small oscillations, full special relativity, and basic Solid State + Atomic/Nuclear physics are closer to "high-value, do early" than "pure JEST-only, defer completely." Flagged inline below, and pulled into a new bonus tier.
4. **Two subjects were missing entirely.** Solid State Physics and Atomic/Molecular/Nuclear/Particle Physics together are roughly 11–18% of the JEST paper and had zero entries in v1. Added as Topics 19–20 (core parts) with the advanced parts folded into Phase B.
5. **New "Phase A-Bonus" tier.** Topics 1–20 almost certainly won't fill all of Aug→Jan 20 — you're right that this leaves slack. That slack now has a designated use: the highest ROI JEST-only topics (ranked by how frequently they're tested and how much they're worth), not open-ended revision. This is where full contour integration, angular momentum addition, matrix QM, and calculator-free numerical/error-analysis work live — the "edge" topics you mentioned.

*(Weightage, PYQ-frequency, and JAM/JEST-overlap classifications used to build the corrections and rankings below are drawn from the chapter-wise tables in your JEST 2027 Master Blueprint — not the blueprint's own month-by-month timeline or video/resource picks, which are intentionally not reused here.)*

---

## Metadata block format (for the app / for Codex — not part of the roadmap content itself)

Every numbered topic in Phase A (1–20) now carries a `> **Metadata:**` blockquote directly
under its heading, in this exact shape:

```
> **Metadata (draft — tune as you actually work through it):** Difficulty: <Easy|Moderate|Hard> · Importance: <Low|Medium|High|Critical> · Priority: <Low|Medium|High> · Est. Study Time: <N hr> · Est. Problem-Solving Time: <N hr>
> **Prerequisites:** <free text, or "None">
> **Typical Question Style:** <free text>
```

These values are a **first-pass draft**, inferred from this file's own rationale text (the
JAM/JEST tags, the "why full depth now" notes, chapter breadth, and — for Phase A-Bonus/B —
the explicit weightage/frequency language already in each item's description) — not measured
data. Treat them as a starting point to correct as you actually study each topic, the same
way you'd correct a difficulty rating after your first real problem set.

Coverage: Phase A (Topics 1-20), Phase A-Bonus (all 11 items), and Phase B Tiers 1-3 (all 11
items) now have metadata blocks — 42 items total. Final Lockdown does not (it's a pure-PYQ
window, not a set of topics with their own difficulty/priority to rate). Phase A-Bonus/B
items don't have a numbered Topic ID the way Phase A does — their "Prerequisites" field
references the Phase A topic number they extend instead (e.g. "extends Topic 13"), which is
the same linkage already used in their heading text.

**Parser contract for Codex:** read the three fields into `roadmap.json`'s topic record as
`difficulty`, `importance`, `priority`, `estimatedStudyMinutes`, `estimatedProblemSolvingMinutes`,
`prerequisites`, `typicalQuestionStyle` — replacing the current hardcoded `priority: 'High'`,
`difficulty: 'Moderate'` fallbacks in `src/engine/dailyStudyService.js`'s
`buildTasksForTopic` (see Phase 1 edits, item 2) and the "Not specified in the blueprint"
placeholders in the Syllabus topic-detail page. `Book:`/`Video:` lines stay exactly as they
are — those already parse into resource links; only the three new blockquote lines are new
surface area. **Books' Author/Pages/Status and Videos' Source/Priority in the syllabus page
come from `books.json` and the video-links source respectively, not from this file** — that
data still needs the books/videos reassignment from Phase 2, this file only supplies the
topic-level fields that have nowhere else to live.

---

# PHASE A — Aug 2026 to Jan 20, 2027 (hard stop)
*Study these fully at JEST depth. This is also your entire JAM prep. Topics 1–20 must be done — not "mostly done" — by Jan 20, because nothing new gets learned after that date until JEST-prep resumes post-JAM.*

## 1. Vector algebra, vector calculus, linear algebra `[JAM+JEST]`
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: Critical · Priority: High · Est. Study Time: 8 hr · Est. Problem-Solving Time: 4 hr
> **Prerequisites:** None — this is the starting topic.
> **Typical Question Style:** JAM: direct diagonalization/eigenvalue NAT & MCQ, vector identity proofs. JEST: same tools embedded inside mechanics/EM/QM problems rather than asked standalone.

- **Book:** Boas Ch. 3, Ch. 6 — do all end-of-chapter problems, not a sample. This is asked directly in JAM and used constantly after.
- **Video:** Pravegaa Mathematical Physics — https://youtube.com/playlist?list=PL_yoT1uNIKb5612J2UBJOZ5Q2RwFQ8Bkm
  **Depth:** Watch every video under this playlist's Linear Algebra + Vector Calculus sub-section (use the playlist's own video titles to find them — it's organized by sub-topic, not chronological upload order). Skip any video titled as a PYQ-solution walkthrough for now — come back to those after you've done the concept videos.
- **Why full depth now:** Eigenvalues/diagonalization and vector calculus identities are used everywhere afterward — mechanics, EM, QM. No shortcut version exists.
- **Correction from v1:** Small oscillations & normal modes was previously deferred as JEST-only. It's actually grouped with core mechanics in JAM/JEST overlap and rated high-yield (uses the same eigenvalue machinery from Topic 1) — see it under **Phase A-Bonus #7** below, do it right after this topic if you're on pace.

## 2. Linear differential equations `[JAM+JEST]`
> **Metadata (draft — tune as you actually work through it):** Difficulty: Easy · Importance: High · Priority: High · Est. Study Time: 4 hr · Est. Problem-Solving Time: 3 hr
> **Prerequisites:** Topic 1 (basic calculus/algebra).
> **Typical Question Style:** JAM/JEST: solve a given ODE, classify its type, apply the initial condition.

- **Book:** Boas Ch. 8 — full chapter (JAM asks first-order + constant-coefficient second-order; JEST's syllabus doesn't demand much beyond this).
- **Video:** Pravegaa Mathematical Physics — https://youtube.com/playlist?list=PL_yoT1uNIKb5612J2UBJOZ5Q2RwFQ8Bkm
  **Depth:** Just the ODE-technique videos (separable, linear, exact, constant-coefficient 2nd order). No need for series-solution videos yet — that comes with special functions later (Phase B).

## 3. Complex analysis — basic part only `[JAM-partial]`
> **Metadata (draft — tune as you actually work through it):** Difficulty: Easy · Importance: Medium · Priority: Medium · Est. Study Time: 3 hr · Est. Problem-Solving Time: 2 hr
> **Prerequisites:** Topic 1.
> **Typical Question Style:** JAM/JEST (basic level only): complex algebra, polar form, basic function evaluation MCQ/NAT. Residues deferred to Phase A-Bonus #4.

- **Book:** Boas Ch. 14, sections 1–4 only (complex number algebra, polar form, basic functions). **Stop before residues/contour integration** — that's JEST-only, deferred to Phase B.
- **Video:** Pravegaa Mathematical Physics — https://youtube.com/playlist?list=PL_yoT1uNIKb5612J2UBJOZ5Q2RwFQ8Bkm
  **Depth:** Watch only the intro complex-numbers video(s), skip the residue/contour-integration videos for now.
- **Why partial:** JAM only tests complex number algebra. Full residue calculus is JEST-specific — doing it now would be premature since you won't use it before Feb anyway.

## 4. Fourier series `[JAM+JEST]` (Fourier/Laplace *transforms* are `[JEST-only]` — see Phase B)
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: High · Priority: High · Est. Study Time: 4 hr · Est. Problem-Solving Time: 3 hr
> **Prerequisites:** Topics 1, 2.
> **Typical Question Style:** JAM/JEST: expand a given periodic function, find a specific coefficient, use even/odd symmetry shortcuts.

- **Book:** Boas Ch. 7, Fourier series sections only.
- **Video:** Pravegaa Mathematical Physics — https://youtube.com/playlist?list=PL_yoT1uNIKb5612J2UBJOZ5Q2RwFQ8Bkm
  **Depth:** Watch the Fourier *series* videos only (periodic function expansions, even/odd). Skip the Fourier *transform* and Laplace transform videos — defer those.

## 5. Newton's laws, conservation, collisions `[JAM+JEST]`
> **Metadata (draft — tune as you actually work through it):** Difficulty: Easy · Importance: High · Priority: High · Est. Study Time: 5 hr · Est. Problem-Solving Time: 4 hr
> **Prerequisites:** None — independent of the Topic 1–4 math track.
> **Typical Question Style:** JAM: standard collision/conservation numericals. JEST: same, sometimes with a constraint or non-inertial twist.

- **Book:** Kleppner & Kolenkow, full relevant chapters.
- **Video:** Balakrishnan, Classical Physics (NPTEL) — https://www.youtube.com/playlist?list=PL5E4E56893588CBA8
  **Depth:** Roughly lectures 1–10 of this 38-lecture series cover Newtonian mechanics, conservation laws, and collisions. You do **not** need to watch all 38 — this playlist also covers heat/waves/stat mech later, which you'll come back to separately (see Topic 12 below).

## 6. Generalized coordinates, Lagrangian and Hamiltonian formulations `[JAM+JEST]`
> **Metadata (draft — tune as you actually work through it):** Difficulty: Hard · Importance: Critical · Priority: High · Est. Study Time: 8 hr · Est. Problem-Solving Time: 5 hr
> **Prerequisites:** Topic 5.
> **Typical Question Style:** JAM: set up the Lagrangian for a given constrained system, derive the EOM. JEST: same, plus Hamiltonian/canonical-momentum questions.

- **Book:** Goldstein, Ch. 1–2 (Lagrangian) + Ch. 8 (Hamiltonian, up to Hamilton's equations — skip Hamilton-Jacobi theory, that's grad-level beyond both JAM and JEST).
- **Video:** Balakrishnan, Classical Physics (NPTEL) — https://www.youtube.com/playlist?list=PL5E4E56893588CBA8
  **Depth:** Roughly lectures 11–19 cover this. Watch these fully — this is the conceptual core of the subject.

## 7. Central force problem, Kepler problem `[JAM+JEST]`
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: High · Priority: High · Est. Study Time: 5 hr · Est. Problem-Solving Time: 4 hr
> **Prerequisites:** Topic 6.
> **Typical Question Style:** JAM/JEST: derive the orbit equation, effective potential, Kepler's laws from the Lagrangian.

- **Book:** Goldstein, central force chapter.
- **Video:** Balakrishnan, Classical Physics (NPTEL) — https://www.youtube.com/playlist?list=PL5E4E56893588CBA8 (within the same 11–19 lecture range, or nearby)
  **Depth:** Full — Kepler's laws derivation from the Lagrangian is a near-guaranteed problem type in both exams.

## 8. Special relativity — basic part `[JAM-partial]`
> **Metadata (draft — tune as you actually work through it):** Difficulty: Easy · Importance: Medium · Priority: Medium · Est. Study Time: 3 hr · Est. Problem-Solving Time: 2 hr
> **Prerequisites:** None.
> **Typical Question Style:** JAM: time dilation / length contraction / E=mc² numericals. Full 4-vector treatment deferred to Phase A-Bonus #6.

- **Book:** Any standard "Modern Physics" chapter covering postulates, time dilation, length contraction, mass-energy equivalence (this is JAM-level; you likely already have a book for this from general M.Sc-entrance prep).
- **Video:** Search within Balakrishnan's playlist or Pravegaa's Modern Physics section for the SR basics.
  **Depth:** Just the postulates + kinematics + E=mc² level. The 4-vector / Lagrangian-in-relativity treatment JEST wants is deferred to Phase B.
- **Correction from v1:** the blueprint's chapter data flags SR (mechanics) as "frequently tested," not a rare add-on — so the full treatment is now a Phase A-Bonus candidate (**#6** below) rather than sitting untouched in Phase B until March/April.

## 9. Electrostatics, magnetostatics — basic part `[JAM-partial]`
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: High · Priority: High · Est. Study Time: 6 hr · Est. Problem-Solving Time: 4 hr
> **Prerequisites:** Topic 1 (vector calculus).
> **Typical Question Style:** JAM: Gauss's/Ampere's law applications, field calculations for standard geometries. Boundary value problems deferred to Phase A-Bonus #3.

- **Book:** Griffiths Ch. 2–3 (electrostatics), Ch. 5 (magnetostatics) — read for concepts and Gauss's/Ampere's law applications. **Skip boundary value problems (Laplace's equation, method of images) and multipole expansion for now** — JEST-only, Phase B.
- **Video:** Pravegaa Electromagnetic Theory — https://youtube.com/playlist?list=PL_yoT1uNIKb5iALlayczJMl_SHkd8TcX8
  **Depth:** Watch the electrostatics/magnetostatics fundamentals videos only.
- **Note:** boundary value problems + method of images + multipole expansion is the single highest-rated chapter in the whole EM section by frequency and weightage — see **Phase A-Bonus #3**. Do it as soon as this topic is done, before it's forgotten.

## 10. Faraday's law, time-varying fields, displacement current, Maxwell's equations `[JAM+JEST]`
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: Critical · Priority: High · Est. Study Time: 5 hr · Est. Problem-Solving Time: 4 hr
> **Prerequisites:** Topic 9.
> **Typical Question Style:** JAM/JEST: apply/derive Maxwell's equations in integral and differential form, induced-EMF problems.

- **Book:** Griffiths Ch. 7 (up to Maxwell's equations — full form, differential and integral).
- **Video:** Pravegaa Electromagnetic Theory — https://youtube.com/playlist?list=PL_yoT1uNIKb5iALlayczJMl_SHkd8TcX8
  **Depth:** Full — this is core to both exams.

## 11. Plane EM wave propagation, reflection, refraction `[JAM+JEST]`
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: High · Priority: High · Est. Study Time: 4 hr · Est. Problem-Solving Time: 3 hr
> **Prerequisites:** Topic 10.
> **Typical Question Style:** JAM/JEST: derive the wave equation from Maxwell's equations, normal-incidence reflection/transmission coefficients.

- **Book:** Griffiths Ch. 9 (up through reflection/transmission at normal incidence — skip oblique incidence and dispersive/conducting media derivations for now).
- **Video:** Pravegaa Electromagnetic Theory — https://youtube.com/playlist?list=PL_yoT1uNIKb5iALlayczJMl_SHkd8TcX8
  **Depth:** Watch the plane-wave and basic reflection/refraction videos.

## 12. Diffraction, interference, polarization `[JAM+JEST]`
> **Metadata (draft — tune as you actually work through it):** Difficulty: Easy · Importance: High · Priority: High · Est. Study Time: 4 hr · Est. Problem-Solving Time: 3 hr
> **Prerequisites:** Topic 11.
> **Typical Question Style:** JAM/JEST: slit-pattern numericals, Malus's law, standard interference-condition problems.

- **Book:** Griffiths' brief optics coverage + any standard optics chapter (Hecht, if you want more problems) — single/double slit, basic polarization (Malus's law), interference conditions.
- **Video:** Pravegaa Electromagnetic Theory (optics section) — https://youtube.com/playlist?list=PL_yoT1uNIKb5iALlayczJMl_SHkd8TcX8
  **Depth:** Full — this is standard UG-level optics, asked in both exams at similar depth.

## 13. Uncertainty principle, Schrödinger equation, central potentials, hydrogen atom `[JAM+JEST]`
> **Metadata (draft — tune as you actually work through it):** Difficulty: Hard · Importance: Critical · Priority: High · Est. Study Time: 10 hr · Est. Problem-Solving Time: 6 hr
> **Prerequisites:** Topic 1 (linear algebra), Topic 2.
> **Typical Question Style:** JAM: particle-in-a-box / harmonic-oscillator eigenvalue problems. JEST: same, plus the hydrogen-atom radial equation and angular-momentum basics.

- **Book:** Griffiths QM, Ch. 1–2 (Schrödinger eq., particle in a box, harmonic oscillator), Ch. 4 (hydrogen atom, angular momentum basics up to the radial equation).
- **Video:** Pravegaa Quantum Mechanics — https://youtube.com/playlist?list=PL_yoT1uNIKb7vY46rDudNBXJDrMMPM5iV
  **Depth:** Watch fully through the hydrogen atom lectures. This is the single highest-value QM block for JAM and the entry point for JEST's deeper QM (Phase B).

## 14. Laws of thermodynamics, thermodynamic potentials, kinetic theory, Maxwell's relations `[JAM+JEST]`
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: High · Priority: High · Est. Study Time: 6 hr · Est. Problem-Solving Time: 4 hr
> **Prerequisites:** None.
> **Typical Question Style:** JAM/JEST: derive/apply a Maxwell relation, kinetic-theory numericals, thermodynamic-potential problems.

- **Book:** Garg, Bansal, Ghosh, *Thermal Physics* — thermodynamics + kinetic theory chapters, full.
- **Video:** Pravegaa Thermodynamics & Statistical Mechanics — https://youtube.com/playlist?list=PL_yoT1uNIKb5ECZhofT0WNdLYyw9gEhNA
  **Depth:** Full — this section is tested almost identically in both exams.

## 15. Classical and quantum statistics — basic definitions `[JAM-partial]`
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: Medium · Priority: Medium · Est. Study Time: 3 hr · Est. Problem-Solving Time: 2 hr
> **Prerequisites:** Topic 14.
> **Typical Question Style:** JAM: identify/apply the correct distribution for a given system. Full partition-function derivations deferred to Phase A-Bonus #5.

- **Book:** Garg, Bansal, Ghosh — Maxwell-Boltzmann, Fermi-Dirac, Bose-Einstein distribution *definitions and basic properties* (skip full partition-function derivations and deep Fermi/Bose gas applications for now).
- **Video:** Pravegaa Thermodynamics & Statistical Mechanics — https://youtube.com/playlist?list=PL_yoT1uNIKb5ECZhofT0WNdLYyw9gEhNA
  **Depth:** The intro distributions videos only.

## 16. Black body radiation `[JAM+JEST]`
> **Metadata (draft — tune as you actually work through it):** Difficulty: Easy · Importance: Medium · Priority: Medium · Est. Study Time: 2 hr · Est. Problem-Solving Time: 2 hr
> **Prerequisites:** Topic 14.
> **Typical Question Style:** JAM/JEST: Planck's-law limiting cases, Wien's/Stefan-Boltzmann numericals.

- **Book:** Garg, Bansal, Ghosh or any Modern Physics chapter — Planck's law derivation, Wien's/Stefan-Boltzmann laws.
- **Video:** Pravegaa Thermodynamics & Statistical Mechanics — https://youtube.com/playlist?list=PL_yoT1uNIKb5ECZhofT0WNdLYyw9gEhNA
  **Depth:** Full — standard derivation, asked in both.

## 17. Semiconductor basics, p-n junctions, diodes, transistors `[JAM+JEST]`
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: Medium · Priority: Medium · Est. Study Time: 5 hr · Est. Problem-Solving Time: 3 hr
> **Prerequisites:** None.
> **Typical Question Style:** JAM/JEST: diode/BJT characteristic-curve reading, basic device-physics MCQs.

- **Book:** Millman & Halkias — semiconductor physics, diode, and BJT chapters.
- **Video:** Pravegaa Electronics & Experimental Methods — https://youtube.com/playlist?list=PL_yoT1uNIKb5E9MThE7H010wXXqZCrRPl
  **Depth:** Full — JAM's electronics section overlaps closely with this.

## 18. LCR circuits, rectifiers, amplifiers, OPAMPs, digital electronics — basic level `[JAM+JEST]`
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: Medium · Priority: Medium · Est. Study Time: 5 hr · Est. Problem-Solving Time: 4 hr
> **Prerequisites:** Topic 17.
> **Typical Question Style:** JAM/JEST: circuit-analysis numericals, op-amp configuration identification, logic-gate truth tables.

- **Book:** Millman & Halkias — circuits, rectifier, and basic op-amp chapters; any standard digital logic chapter for gates.
- **Video:** Pravegaa Electronics & Experimental Methods — https://youtube.com/playlist?list=PL_yoT1uNIKb5E9MThE7H010wXXqZCrRPl
  **Depth:** Full for rectifiers, basic amplifiers, standard op-amp configurations (inverting/non-inverting/summing), and logic gates. **Skip active filters and oscillator design derivations for now** — those get more JEST-specific attention in Phase B.

## 19. Crystal structure, reciprocal lattice, basic band theory `[JAM+JEST]` — NEW, corrects a gap in v1
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: Medium · Priority: Medium · Est. Study Time: 4 hr · Est. Problem-Solving Time: 2 hr
> **Prerequisites:** Topic 1 (vectors, for reciprocal lattice).
> **Typical Question Style:** JAM/JEST: Bragg-condition NATs, "why does a gap open at the zone boundary" conceptual MCQs.

- **Why this is here:** Solid State Physics was entirely absent from v1, but it's a real chunk of the JEST paper (crystal structure and basic band theory specifically sit in the JAM+JEST overlap zone, not the JEST-exclusive tail). Skipping it wasn't a deliberate deferral, it was a blind spot.
- **Book:** Kittel, *Introduction to Solid State Physics* — crystal structure, reciprocal lattice/Bragg condition, and an intro pass at band theory (free electron model, origin of band gaps). Stop before phonon dispersion and deep band-structure derivations — those are Phase B.
- **Video:** pick whichever NPTEL Solid State Physics playlist matches your current book's chapter order; skip straight to crystal structure + free-electron/band-basics lectures.
- **Depth:** Enough to comfortably answer a Bragg-condition NAT or a "why does a gap open at the zone boundary" conceptual MCQ.

## 20. Basic atomic structure, nuclear models, radioactivity `[JAM+JEST]` — NEW, corrects a gap in v1
> **Metadata (draft — tune as you actually work through it):** Difficulty: Easy · Importance: Medium · Priority: Medium · Est. Study Time: 3 hr · Est. Problem-Solving Time: 2 hr
> **Prerequisites:** None.
> **Typical Question Style:** JAM/JEST: Bohr-model numericals, half-life/decay-law NATs, basic term-symbol MCQs.

- **Why this is here:** same issue as above — Atomic/Molecular/Nuclear/Particle Physics is a real ~6–10% weightage subject that had zero entries in v1. The basic-structure and nuclear-models part overlaps with JAM; particle physics proper is JEST-only and deferred (Phase B, low priority).
- **Book:** Arthur Beiser, *Concepts of Modern Physics* — Bohr model and its limitations, basic term symbols/selection rules (light touch, full depth deferred), nuclear models (liquid drop, shell model basics), radioactive decay law.
- **Video:** any standard Modern Physics playlist covering the same chapters — no need for a dedicated series here, this is a short, book-driven topic.
- **Depth:** Enough for a half-life NAT and a basic term-symbol MCQ. Fine structure detail and full atomic spectra depth are deferred (Phase B).

---

# JAM EXAM — mid February
Everything from Jan 20 to JAM exam day is pure PYQ (2012–onward papers, timed), mistake logs, and formula-sheet drilling across Topics 1–20 plus whatever Phase A-Bonus items you got to. **No new syllabus in this window, full stop** — that's the whole point of the Jan 20 cutoff.

---

# PHASE A-BONUS — use only if Topics 1–20 are genuinely done ahead of Jan 20
*Do these in this order. This is the "extra edge" slack-time list — ranked by how often the topic actually shows up and how much it's worth, not by what's easiest. If you're not sure whether you're ahead, you're not ahead — go do more PYQ-style problems on Topics 1–20 instead of starting a new bonus topic.*

**1. Angular momentum & spin — addition of angular momenta, Clebsch-Gordan (extends Topic 13)**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Hard · Importance: Critical · Priority: High · Est. Study Time: 6 hr · Est. Problem-Solving Time: 4 hr
> **Prerequisites:** Topic 13, Topic 1.
> **Typical Question Style:** JEST: addition-of-angular-momenta and Clebsch-Gordan coefficient problems, spin-operator algebra.

Highest-rated combined chapter in the whole syllabus by frequency and weightage. Directly extends the hydrogen-atom work you just did.

**2. Matrix formulation of QM — operators, Hermitian/unitary transformations (extends Topic 13)**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: High · Priority: High · Est. Study Time: 3 hr · Est. Problem-Solving Time: 2 hr
> **Prerequisites:** Topic 13, Topic 1.
> **Typical Question Style:** JEST: operator matrix-representation problems, Hermitian/unitary proof-style questions.

Frequently tested, top-rated, and short once you've done Topic 13 and Topic 1 (linear algebra).

**3. Electrostatics — boundary value problems, method of images, multipole expansion (extends Topic 9)**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Hard · Importance: Critical · Priority: High · Est. Study Time: 6 hr · Est. Problem-Solving Time: 4 hr
> **Prerequisites:** Topic 9.
> **Typical Question Style:** JEST: Laplace's-equation boundary-value problems, method-of-images setups, multipole-expansion numericals.

The single highest-rated EM chapter. You already have Griffiths Ch. 2–3 fresh; go straight into Ch. 3's remainder rather than letting it go cold until Phase B.

**4. Complex analysis — full residue calculus, contour integration (extends Topic 3)**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: High · Priority: High · Est. Study Time: 5 hr · Est. Problem-Solving Time: 4 hr
> **Prerequisites:** Topic 3.
> **Typical Question Style:** JEST: contour integration via the residue theorem — usually appears embedded inside QM/EM/stat-mech problems rather than asked standalone.

Not a standalone exam chapter so much as a tool that recurs inside QM, EM, and stat mech problems. This is probably the best "solves problems elsewhere" pickup on the list — closest to what you meant by an edge topic.

**5. Statistical ensembles — full partition-function derivation, Fermi/Bose gas applications, paramagnetism (extends Topics 14–15)**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Hard · Importance: High · Priority: High · Est. Study Time: 6 hr · Est. Problem-Solving Time: 4 hr
> **Prerequisites:** Topics 14, 15.
> **Typical Question Style:** JEST: partition-function derivation, Fermi/Bose-gas application numericals, paramagnetism (Curie's law) problems.

High weightage, frequently tested, strong JAM+JEST overlap on the underlying concepts even though the deeper derivations go beyond JAM.

**6. Special relativity — full treatment: 4-vectors, relativistic Lagrangian (extends Topic 8)**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: Medium · Priority: Medium · Est. Study Time: 4 hr · Est. Problem-Solving Time: 3 hr
> **Prerequisites:** Topic 8.
> **Typical Question Style:** JEST: 4-vector formalism problems, relativistic-Lagrangian derivation questions.

Flagged "frequently tested" independent of exam depth — worth doing properly rather than leaving at JAM-level.

**7. Small oscillations & normal modes (extends Topic 6)**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: Medium · Priority: Medium · Est. Study Time: 3 hr · Est. Problem-Solving Time: 2 hr
> **Prerequisites:** Topics 1, 6.
> **Typical Question Style:** JEST: normal-mode frequency/eigenvector numericals for coupled-oscillator systems.

Same eigenvalue toolkit as Topic 1 and Topic 6; cheap to add once those are solid, and rated high-yield.

**8. Sturm–Liouville theory + special functions — Legendre, Bessel, Hermite**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Hard · Importance: Low · Priority: Low · Est. Study Time: 4 hr · Est. Problem-Solving Time: 2 hr
> **Prerequisites:** Topics 1, 13.
> **Typical Question Style:** JEST: Legendre/Bessel/Hermite property identification, orthogonality-based problems.

Lower weightage on its own, but it's the missing tool behind a fully rigorous Topic 13 (hydrogen atom) and #1 above (angular momentum). Do it if you want those two to feel complete rather than half-derived.

**9. Fourier & Laplace transforms (extends Topic 4)**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: Medium · Priority: Medium · Est. Study Time: 3 hr · Est. Problem-Solving Time: 2 hr
> **Prerequisites:** Topic 4.
> **Typical Question Style:** JEST: transform-pair identification, Laplace-transform solution of a given ODE.

Frequently tested, moderate weightage — natural continuation of the Fourier series work.

**10. Perturbation theory (intro) + variational principle (extends Topic 13)**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Hard · Importance: Medium · Priority: Medium · Est. Study Time: 5 hr · Est. Problem-Solving Time: 3 hr
> **Prerequisites:** Topic 13.
> **Typical Question Style:** JEST: first-order perturbation energy-correction numericals, variational trial-function problems.

Frequently tested, high dual relevance — worth a first pass now even if the full treatment (Zettili-level, time-dependent PT) waits for Phase B.

**11. Probability, error analysis, and calculator-free numerical fluency**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Easy · Importance: Medium · Priority: Medium · Est. Study Time: 2 hr initial, then ongoing · Est. Problem-Solving Time: ongoing — folded into other topics' PYQ practice
> **Prerequisites:** None.
> **Typical Question Style:** JEST: calculator-free estimation, propagation-of-error, significant-figures-under-time-pressure — not a one-sitting topic, build it into every other topic's PYQ practice from here on.

Lower weightage on paper, but JEST doesn't allow calculators at all — every numerical answer has to be computed by hand under time pressure. Building that fluency now, rather than discovering the gap in April, is the actual "numerical methods edge" — build it into your PYQ practice from here on rather than treating it as a one-off topic.

*If you run out of slack partway down this list, stop — everything below your stopping point either gets picked up in Phase B (items 3, 6, 7, 9, 10 have Phase B duplicates listed as already-done-if-you-got-here) or waits until it's actually needed.*

---

# PHASE B — Post-JAM exam → (JEST date minus 10 days)
*This window's length is genuinely unknown right now. If JEST lands in April, you get ~9 weeks. If it lands in March, you get more like 4–5 weeks. **Don't plan around a guessed date — plan around a ranked list**, and whichever week the real notification forces a stop, you stop and go straight to the Final Lockdown (below) having done the highest-value stuff first. Anything from Phase A-Bonus you didn't finish carries over here at the same priority it had there.*

## Tier 1 — do these first, non-negotiable if any Phase B time exists at all

**Advanced Solid State: band theory depth, phonon/lattice dispersion (extends Topic 19)**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Hard · Importance: Medium · Priority: High · Est. Study Time: 5 hr · Est. Problem-Solving Time: 3 hr
> **Prerequisites:** Topic 19.
> **Typical Question Style:** JEST: phonon-dispersion-relation numericals, band-structure-beyond-free-electron-model conceptual questions.

Occasionally tested but high-difficulty — one of the few chapters that meaningfully separates a strong JEST rank from an average one.
- **Book:** Kittel, remaining chapters (band structure beyond free-electron model, phonon dispersion, acoustic/optical branches).

**Energy and momentum of EM fields `[JEST-only]`**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: Medium · Priority: High · Est. Study Time: 3 hr · Est. Problem-Solving Time: 2 hr
> **Prerequisites:** Topics 10, 11.
> **Typical Question Style:** JEST: Poynting-vector flux numericals, Maxwell-stress-tensor problems.

- **Book:** Griffiths Ch. 8 (Poynting vector, Maxwell stress tensor).
- **Video:** Pravegaa Electromagnetic Theory — https://youtube.com/playlist?list=PL_yoT1uNIKb5iALlayczJMl_SHkd8TcX8

**EM waves in dispersive and conducting media (extends Topic 11) `[JEST-only]`**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: Medium · Priority: High · Est. Study Time: 3 hr · Est. Problem-Solving Time: 2 hr
> **Prerequisites:** Topic 11.
> **Typical Question Style:** JEST: oblique-incidence Fresnel-type numericals, skin-depth-in-conductors problems.

- **Book:** Griffiths Ch. 9 remaining sections — oblique incidence, dispersion, conductors.
- **Video:** Pravegaa Electromagnetic Theory — https://youtube.com/playlist?list=PL_yoT1uNIKb5iALlayczJMl_SHkd8TcX8

**Atomic spectra, fine structure, selection rules (extends Topic 20)**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: Medium · Priority: High · Est. Study Time: 3 hr · Est. Problem-Solving Time: 2 hr
> **Prerequisites:** Topic 20.
> **Typical Question Style:** JEST: term-symbol derivation, selection-rule identification for a given transition.

- **Book:** Beiser or a standard Atomic Physics chapter — term symbols, fine structure, selection rules in more depth than the Phase A pass.

## Tier 2 — do if Tier 1 is finished with time to spare

**Tensors, curvilinear coordinate systems**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: Low · Priority: Medium · Est. Study Time: 4 hr · Est. Problem-Solving Time: 2 hr
> **Prerequisites:** Topic 1.
> **Typical Question Style:** JEST: coordinate-transformation and tensor-index numericals.

- **Book:** Boas Ch. 10 + Arfken Ch. 2–3.
- **Video:** Balakrishnan, Selected Topics in Mathematical Physics (NPTEL) — https://www.youtube.com/playlist?list=PLiUVvsKxTUr66oLF6Pzirc1EgSstMbRZR

**Active filters, oscillators — deeper electronics**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: Medium · Priority: Medium · Est. Study Time: 4 hr · Est. Problem-Solving Time: 3 hr
> **Prerequisites:** Topic 18.
> **Typical Question Style:** JEST: filter cutoff-frequency numericals, oscillator start-up-condition problems.

Moderate frequency, moderate difficulty, but a steady/reliable scorer once you're there — good use of time if the core subjects feel solid.
- **Book:** Millman & Halkias, remaining circuit-design sections.
- **Video:** Pravegaa Electronics & Experimental Methods — https://youtube.com/playlist?list=PL_yoT1uNIKb5E9MThE7H010wXXqZCrRPl

**Elementary properties of discrete groups**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Easy · Importance: Low · Priority: Medium · Est. Study Time: 2 hr · Est. Problem-Solving Time: 1 hr
> **Prerequisites:** None.
> **Typical Question Style:** JEST: group-axiom verification, identifying cyclic/dihedral group order and cosets.

- **Book/Notes:** Arfken Ch. 4 or a concise notes/PDF summary — no dedicated video needed.
- **Depth:** Group axioms, cyclic/dihedral groups, order, cosets. Shortest topic in the whole syllabus — a couple of hours. Slot it into any spare afternoon, don't wait for "Tier 2 time" specifically.

**Nuclear models depth, decay chains (extends Topic 20)**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Moderate · Importance: Low · Priority: Medium · Est. Study Time: 3 hr · Est. Problem-Solving Time: 2 hr
> **Prerequisites:** Topic 20.
> **Typical Question Style:** JEST: decay-chain and half-life numericals beyond the Phase A introductory level.

- **Book:** Beiser, remaining nuclear physics sections.

## Tier 3 — cut first if the March-case hits; only attempt if genuinely ahead

**Scattering theory — Born approximation, partial waves**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Hard · Importance: Low · Priority: Low · Est. Study Time: 5 hr · Est. Problem-Solving Time: 3 hr
> **Prerequisites:** Topic 13.
> **Typical Question Style:** JEST: Born-approximation cross-section numericals, partial-wave phase-shift problems.

Rare but difficult — a real differentiator if you get there, but the lowest-frequency, highest-effort item on this list.
- **Book:** Griffiths QM or Zettili, scattering chapter.

**Phase transitions and critical phenomena**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Hard · Importance: Low · Priority: Low · Est. Study Time: 4 hr · Est. Problem-Solving Time: 2 hr
> **Prerequisites:** Topics 14, 15.
> **Typical Question Style:** JEST: critical-exponent and order-parameter conceptual questions.

Rare but difficult, JEST-exclusive, low return relative to time invested unless everything else is already secure.
- **Book:** Garg, Bansal, Ghosh or Pathria (Statistical Mechanics), phase transitions chapter.

**Particle physics basics — conservation laws, basic Standard Model concepts**
> **Metadata (draft — tune as you actually work through it):** Difficulty: Easy · Importance: Low · Priority: Low · Est. Study Time: 2 hr · Est. Problem-Solving Time: 1 hr
> **Prerequisites:** None.
> **Typical Question Style:** JEST: conservation-law application to a given particle decay/reaction, basic Standard Model classification MCQs.

Lowest priority on the whole list. Attempt this last, and only if you've genuinely run out of higher-value material.
- **Book:** Beiser's particle physics chapter, or a concise notes summary.

---

# FINAL LOCKDOWN — JEST minus 10 days → exam day
Pure PYQ (2012–2026 sets), timed mocks run under the actual marking scheme (Part A: +1/−1/3 MCQ; Part B: +3/−1 MCQ, the real rank-determinant; Part C: +3/0 NAT, zero risk — attempt every NAT with any partial method before worrying about Part B time), mistake logs, formula sheets. No new content gets started here regardless of what's still sitting in Tier 2/3 — if it's not done by this point, it's not getting done before the exam, and that's fine; Tier 1 + Phase A-Bonus was designed to be the stuff that actually moves your score.

---

## Practical pace-check (so "ahead" or "behind" isn't a guess)
- **By early Oct:** Topics 1–7 (all of math methods + mechanics core) should be done.
- **By mid-Dec, before the semester-exam buffer:** Topics 1–14 done.
- **By Jan 20 (hard stop):** Topics 1–20 fully done, plus whatever Phase A-Bonus slack allowed. Everything else is PYQ until JAM.
- If you're behind any of these checkpoints, the answer is always the same: stop chasing bonus/edge topics and get Topics 1–20 solid. A clean JAM-overlap syllabus beats a half-finished bonus list every time — the bonus tier only exists because you specifically expect slack, not to create new pressure if that slack doesn't materialize.

---

## How to use the video links practically
- None of these playlists should be watched start-to-finish blindly — NPTEL series especially (Balakrishnan's Classical Physics alone is 38 lectures covering mechanics AND heat/waves/stat mech). Use the playlist's own video titles/numbers to jump to the lecture range for the specific topic you're on, per the lecture-range notes above.
- Pravegaa's playlists are already organized by sub-topic within each subject — treat each sub-section as its own mini-playlist rather than watching the whole thing in upload order.
- If a lecture-range estimate above turns out to be off (playlists get renumbered/edited occasionally), skim the video titles for 30 seconds to locate the right block rather than watching sequentially from lecture 1.
