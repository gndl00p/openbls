# Comprehensive Research Brief on Bilateral Stimulation (BLS) Evidence for OpenBLS

## TL;DR

- **Tactile BLS should ship in v1 if technically feasible (web-haptics + optional companion app driving consumer-grade vibration), or be a clearly-roadmapped v1.x feature, because (a) it is the *only* viable modality for several clinically common populations (eyes-closed/dissociation-prone clients, photosensitive epilepsy, low-vision, hyperacusis, young children using the Butterfly Hug), and (b) every credible commercial competitor — Neurotek, EMDR Kit, Bi-Tapp, bilateralstimulation.io, Bilateral Base, remotEMDR — offers all three modalities. Shipping visual+audio only is a defensible MVP but excludes ~10–20% of the clinical population a clinician would route through the tool.**
- **The "all three modalities are equivalent" claim is a clinical convention, not a settled empirical fact.** Visual eye-movement BLS has by far the strongest evidence base (≥30 RCTs, dismantling studies, Lee & Cuijpers 2013 meta-analysis: d ≈ 0.41 in clinical trials, d ≈ 0.74 in lab studies for the additive effect of eye movements over no-eye-movement EMDR). Auditory tones have *negative* dismantling evidence at the working-memory level (van den Hout 2011: beeps did not slow RTs to visual cues, suggesting weaker WM taxation). Tactile BLS has essentially *no* dismantling RCT comparing it head-to-head with no-BLS or with eye movements; its evidence rests on physiological studies and clinical convention, not on outcome trials demonstrating modality-specific incremental benefit.
- **OpenBLS, by being a tool that delivers BLS (not a therapy product), can stay outside FDA SaMD and EU MDR Rule 11 if it makes no medical claims.** Trademark exposure is real but manageable: "EMDR" is registered to the EMDR Institute (Reg. 1808113, 1986652); "EMDRIA" is registered to the EMDR International Association; the generic terms "bilateral stimulation," "BLS," "dual attention stimulus," "DAS," "alternating tones," and "alternating taps" are not trademarked. The single largest legal/safety risk is *not* trademark — it is the photosensitive-epilepsy class action surface created by full-screen flashing visual content at 0.5–2 Hz with high luminance contrast. Build to WCAG 2.1 §2.3 from day one.

---

## Key Findings

1. **Modality evidence is asymmetric.** The strongest data are for eye movements; auditory beeps and tactile taps were imported into the protocol on clinical/anatomical reasoning, not on head-to-head outcome data. The most cited paper directly comparing modalities at a mechanism level — van den Hout et al. (2011) — found eye movements *superior* to bilateral beeps in taxing working memory. There is no comparable study showing taps are equivalent to eye movements on outcome.

2. **The component-analysis debate is unresolved but has shifted.** Davidson & Parker (2001, peer-reviewed meta-analysis, *J Consult Clin Psychol*) concluded eye movements are "unnecessary." Lee & Cuijpers (2013, peer-reviewed meta-analysis, *J Behav Ther Exp Psychiatry*) re-ran the analysis with newer trials and found a moderate, significant additive effect of eye movements (d = 0.41 in therapy studies; d = 0.74 in lab studies). Sack et al. (2016, RCT, n=139) found *no* difference between EMDR with eye movements, EMDR with central fixation only, and exposure-only — but did find eye-fixation EMDR superior to no fixation, supporting a *dual-attention* (not specifically bilateral) mechanism. The honest summary: BLS adds something beyond exposure for vividness/emotionality of memory, but whether the "something" is bilaterality, working-memory taxation, or an orienting response is still contested.

3. **The working-memory hypothesis is the dominant theoretical model and it predicts modality-specific findings.** van den Hout & Engelhard (2012) explicitly disproved the bilaterality assumption (vertical eye movements work; non-bilateral dual tasks work). The relevant variable is *taxation*, and not all sensory channels tax equally. Matthijssen et al. (2017) showed modality-specific loading: visual intrusions are reduced more by visual taxing tasks; auditory intrusions more by auditory tasks. **For OpenBLS this matters concretely**: a fast, smoothly-tracked visual target at the right speed is doing something measurable to working memory. A slow, rhythmic tactile pulse at 1 Hz may not be — even if both feel "bilateral."

4. **Tactile is preferred or *only viable* in specific, common clinical scenarios.** Eyes-closed processing for dissociation-prone clients (Choice Point Psychological; Van der Hart et al., 2014, *J EMDR Pract Res*); photosensitive epilepsy (≈3–5% of people with epilepsy, ICTAL guidelines apply); visual-tracking impairments (TBI, certain post-stroke populations; Vancouver EMDR Therapy clinical guide); pediatric populations under ~12 where the Butterfly Hug is the EMDRIA-recommended self-administered modality (Jarero & Artigas, 2024, EMDRIA Creative Innovation Award method); hyperacusis and misophonia where audio is contraindicated; group protocols (EMDR-IGTP) that explicitly script tactile-only Butterfly Hug.

5. **Telehealth practice patterns favor visual but tactile is rising.** EMDRIA's 2020 Virtual Therapy Task Group guidelines and the bilateralstimulation.io / remotEMDR / Bi-Tapp commercial ecosystem document a clear pattern: clinicians default to a shared-screen visual target, fall back to audio when bandwidth or visual fatigue is an issue, and route to tactile (Bi-Tapp wireless buzzers, $159–$299) when the client dissociates, has visual-processing issues, or is a child. The Butterfly Hug remains the universal no-hardware fallback.

6. **The commercial landscape has no FDA-cleared 510(k) BLS device that I could identify.** Neurotek (since 1991), TheraTapper, Bi-Tapp, EMDR Kit (NL/SE Factory), and the major web tools (bilateralstimulation.io, Bilateral Base, remotEMDR, ActiveEMDR, Easy EMDR, Horizon EMDR, Virtual EMDR, TurboEMDR) market without FDA medical device clearance because they position as wellness/professional tools, not therapeutic devices. This is the same regulatory lane OpenBLS should occupy.

7. **The self-help app market exists, is used, and is poorly studied.** Waterman & Cooper (2020, *BJPsych Open*, peer-reviewed) found exactly *one* primary research study on self-administered EMDR (Spence, Titov & Johnston 2013, n=15, no control group, large pre-post effect sizes but with weekly clinician contact). The same review cites Sander et al. rating self-help EMDR apps at MARS-G mean 2.91 ("poor"). Several apps (Virtual EMDR, TurboEMDR, EMDR 101) market direct-to-consumer trauma processing despite Shapiro's explicit warnings (Shapiro 2018) that EMDR Phase 4 desensitization without trained-therapist screening can have "literally fatal consequences."

8. **Open-source predecessors exist and have not been litigated against.** GitHub hosts at least a dozen active projects (MaxAFriedrich/EMDR — emdr.mfriedrich.win, used clinically; zzukin/emdr-therapy-webapp2; ava-cassiopeia/emdr-clicker; djimelec/EBC-Bilateral-Brain-Stimulator; element14 community open-source EMDR machine). I found no evidence of cease-and-desist letters, takedown notices, or regulatory contact directed at any of them. This is meaningful: the trademark holders have not pursued open-source projects that use the descriptive term "EMDR" in repository names, though prudent practice is still to avoid claiming to *be* EMDR.

---

## Details

### 1. Efficacy of BLS Modalities — Separately, Not Bundled

#### 1a. Visual vs. Auditory vs. Tactile: What the RCT and Meta-Analytic Literature Actually Says

**Visual (eye movements).** This is the only modality with a substantial direct-evidence base. Lee & Cuijpers (2013, peer-reviewed meta-analysis) included 15 clinical trials and 11 laboratory studies comparing EMDR-with-eye-movements to EMDR-without-eye-movements; the additive effect for eye movements in therapy studies was Cohen's d = 0.41 (95% CI roughly 0.21–0.61) and in lab studies d = 0.74; for vividness measures specifically d = 0.91. Treatment fidelity moderated the effect. A subsequent meta-analysis by Houben et al. (2020, peer-reviewed, *Clinical Psychological Science*) replicated the laboratory effect (d ≈ 0.53 for SUDS; d ≈ 0.72 for Validity of Cognition).

The Sack et al. (2016) RCT (n = 139, peer-reviewed) is the most rigorous single dismantling trial: full-protocol EMDR with eye movements vs. EMDR with central visual fixation vs. exposure-only with no visual focus. *No* significant outcome difference between eye movements and central fixation; both superior to exposure-only with no fixation. This is consistent with the working-memory model (the dual-task matters; bilaterality may not) but inconsistent with the orthodox claim that eye movements specifically are the active ingredient.

**Auditory (alternating tones).** Direct outcome RCTs comparing tones-EMDR to no-tones-EMDR are essentially absent. The most informative study is van den Hout et al. (2011, *Behaviour Research and Therapy*, peer-reviewed): using discrimination reaction-time tasks to *measure* working-memory taxation, they found eye movements slowed RTs to auditory cues (i.e., taxed WM) but bilateral beeps did *not* slow RTs to visual cues. Their conclusion, in the article's own words: "eye movements [are] superior to beeps in taxing working memory and reducing vividness of recollections." Matthijssen et al. (2017, *Frontiers in Psychology*, peer-reviewed) extended this: modality-specific loading matters — bilateral tones reduce vividness of *auditory* intrusions but do less for visual ones.

**Tactile (alternating taps).** Outcome evidence is weakest. The cited NIRS study (Amano & Toichi 2016, *PMC5061320*) showed tactile BLS during Resource Development & Installation altered prefrontal oxygenated-hemoglobin patterns and that subjects rated tactile-on conditions as more effective for "increased sensory detail" and "experience of strength of resource" — but this is a within-subjects neurophysiological study, not an outcome RCT. A 2024 PTSD physiology study (PMC12641405) found visual and tactile BLS *both* increased frontal EEG total power and reduced autonomic arousal, with no significant difference between modalities — supporting the clinical "all are roughly equivalent" claim at the physiology level, but not at the symptom-outcome level.

**Bottom line on modality equivalence:** The "all modalities are equivalent" statement is a *clinical convention* that has been formalized in EMDRIA practice guidance and Shapiro's textbooks. It is *not* the conclusion of head-to-head outcome RCTs, because those trials largely do not exist. Matthijssen-style modality-specific findings, plus van den Hout's beep-vs.-EM findings, suggest the convention is at minimum oversimplified.

#### 1b. Component Analysis Debate — Current State

Davidson & Parker (2001, peer-reviewed, *J Consult Clin Psychol*; Tier 1) reviewed 34 trials and concluded eye movements were "unnecessary" and EMDR was no better than other exposure techniques. McNally, Devilly, Herbert, Lilienfeld, Lohr, and others (Herbert et al. 2000, *Clinical Psychology Review*; Devilly 2002, *Scientific Review of Mental Health Practice*; Tier 1) made the stronger claim that EMDR's distinctive features were "purple hat therapy" — repackaged exposure with theatrical elements. Rosen et al. (2023, *Journal of Contemporary Psychotherapy*, peer-reviewed) renewed this critique, arguing that the trademarking of acronyms (EMDR, ART, Brainspotting, Flash, EMI) industrializes a problem where "any clever entrepreneur can claim a new method and trademark a new acronym."

The counter-evidence: Lee & Cuijpers (2013) re-meta-analyzed with newer, higher-fidelity trials and found a robust additive effect (above). De Jongh et al. (2024, *Journal of Traumatic Stress*, peer-reviewed) summarize the post-2013 RCT and dismantling literature as supporting differential effectiveness of EMDR with vs. without eye movements, while acknowledging the active mechanism remains under-specified. The ISTSS, NICE, WHO, and APA all currently recommend EMDR for PTSD; the APA Division 12 lists it as "strong research support."

**Has any modality shown *independent* incremental benefit?** Yes for visual (Lee & Cuijpers 2013, Sack 2016, Schubert et al. 2016). Equivocal/negative for auditory (van den Hout 2011 negative on WM taxation; no outcome dismantling RCT found). Essentially absent for tactile (no published dismantling RCT comparing tactile BLS to no-BLS or to eye movements on PTSD outcome). This asymmetry is invisible in clinical training, where the three are presented as interchangeable.

#### 1c. Working-Memory Taxation Hypothesis

van den Hout & Engelhard (2012, *Journal of Experimental Psychopathology*, peer-reviewed) explicitly disproved both (a) the necessity of eye movements specifically, and (b) the necessity of bilaterality. Vertical eye movements, mental arithmetic, complex tapping (Andrade, Kavanagh & Baddeley 1997), Tetris (Engelhard et al.), drawing complex figures (Gunter & Bodner 2008) all reduce vividness and emotionality of recalled memories. The active variable is *central executive load during memory retrieval*.

This has direct product implications for OpenBLS:

- **Speed matters.** van Veen et al. (2015, *Frontiers in Psychiatry*, peer-reviewed) showed faster eye movements produce greater memory blurring than slower ones, up to a ceiling. Default speed should not be slow; clinicians should be able to adjust.
- **Taxation matters more than bilaterality.** A wide-amplitude smooth-pursuit visual target, alternating panned audio with carefully-timed tones, or alternating haptic pulses with sufficient amplitude *and* unpredictability all should work in principle. A monotonous, predictable, low-amplitude tactile buzz may not tax WM at all.
- **Modality-specificity is real.** For predominantly visual flashbacks, visual BLS is theoretically indicated; for predominantly auditory intrusions, auditory may be better. Most clinicians do not know this.

**Bottom line on visual BLS:** *Strong evidence.* Visual eye movements are the most empirically validated BLS modality, with a moderate additive effect over exposure-only EMDR (d ≈ 0.41 clinical, d ≈ 0.74 lab). Preferred when the client can track comfortably, when working-memory taxation is the goal, and when the client has predominantly visual intrusion symptoms. Risks: visual fatigue; photosensitive seizure for the small minority with photosensitive epilepsy; dissociation in clients who cannot maintain dual awareness; and motion-sickness-like effects from full-screen tracking on small displays.

**Bottom line on auditory BLS:** *Moderate-but-weakly-supported evidence.* Adopted into the protocol on clinical/practical grounds (telehealth-friendly, works with eyes closed, no visual fatigue) but with negative dismantling evidence at the working-memory level (van den Hout 2011: beeps don't tax WM the way eye movements do). Preferred for telehealth, eyes-closed protocols, low-vision clients, and predominantly auditory intrusions. Risks: hyperacusis/misophonia; over-reliance in clients for whom WM is not actually being taxed; headphone availability and stereo-channel correctness on consumer devices.

**Bottom line on tactile BLS:** *Weak direct outcome evidence; strong convention-of-practice support.* No dismantling RCT comparing tactile BLS head-to-head with no-BLS on PTSD outcome was located. Physiological studies show it produces autonomic and cortical effects similar to visual BLS; clinical convention treats the three as equivalent. Preferred when visual and auditory are contraindicated or unavailable: dissociation-prone clients with eyes closed, photosensitive epilepsy, low vision, hyperacusis, young children (Butterfly Hug), pre-verbal clients, group protocols. Risks: fewer than other modalities — primarily that the apparent "doing something" feel can mask the absence of meaningful WM taxation, and that bypassing visual/auditory channels means nothing is constraining whether the client dissociates during the set.

---

### 2. Clinical Scenarios Where Tactile Is Preferred or Only Viable

**2a. Dissociation-prone clients, eyes-closed protocols.** Van der Hart, Nijenhuis & Solomon (2014, *J EMDR Pract Res*, peer-reviewed) and Knipe (2014, "EMDR Toolbox") describe phase-oriented treatment of complex-trauma/dissociative clients in which visual eye movements are *avoided early* because tracking can trigger derealization. Slow tactile BLS, often self-administered as the Butterfly Hug, is the canonical alternative. Choice Point Psychological (clinician blog, Tier 3) and Bay Area CBT Center summarize standard practice: titrated, slower tactile pacing with eyes closed allows dissociative clients to maintain interoceptive contact while still receiving alternating stimulation.

**2b. Visual-processing differences, low vision, photosensitive conditions.** ~3–5% of people with epilepsy have photosensitive epilepsy (Epilepsy Foundation, Tier 2 practice resource); in the general population PSE affects ~1 in 4,000. Low-vision clients (≈4% of US adults, CDC), post-concussive clients with visual-tracking deficits, and those with vestibular disorders that flare with smooth-pursuit tracking all need a non-visual BLS option. WCAG 2.1 §2.3 (Three Flashes Threshold) bounds general flashes to ≤3/sec; this is below typical EMDR set rates (~1–2 Hz), so OpenBLS visual BLS at default speeds is likely *under* WCAG but high luminance contrast still warrants a first-launch warning.

**2c. Children and adolescents.** EMDR-for-children adaptations (Crime Solutions OJP practice profile, Tier 2; Adler-Tapia & Settle protocols) routinely substitute tapping or the Butterfly Hug for tracking, particularly in pre-school and early school-age children whose smooth-pursuit eye control is immature. Standard EMDR protocols can be applied above ~12 years; below that, modifications including tactile BLS are the norm. The Jarero-Artigas Butterfly Hug (1997, formalized 2024 update) was specifically developed for child disaster survivors after Hurricane Paulina and is used in EMDR-IGTP and GTEP group protocols. C-GTEP (Child Group Traumatic Episode Protocol) is tactile-by-default.

**2d. Telehealth / remote EMDR — practice-pattern data.** EMDRIA's 2020 Virtual Training and Therapy Task Group report (Tier 2, organizational guideline) explicitly distinguishes EMDR delivered by a trained clinician via videoconference (endorsed) from "companies, websites, or services which offer EMDR self-therapy without live guidance" (not endorsed). The EMDRIA preparation document (Marchand & Hogg 2020) names specific apps for clinician-supervised remote BLS (Anxiety Release, EMDR Tool Kit, BSDR Player, EMDR Therapy+, EMDR 101). Farrell et al. (2022, *Frontiers in Psychology*, peer-reviewed) — the Virtual Blind 2 Therapist proof-of-concept — demonstrated remote EMDR feasibility with frontline pandemic workers. The dominant remote modality is visual via shared screen; tactile via Bi-Tapp wireless buzzers (USB or Bluetooth) is the rising second-line; audio is third. The Butterfly Hug remains the no-hardware fallback when the client's connection is poor or the clinician needs a quick pivot.

**2e. Sensory profiles where audio is contraindicated.** Hyperacusis (~9% adult prevalence per some estimates; Tyler et al. 2014), misophonia, and significant tinnitus reactivity all argue against alternating-tone BLS. Autistic clients with auditory hypersensitivity often prefer tactile (PMC10808451, EMDR for individuals with neurodevelopmental disorders systematic review). For these clients, visual or tactile is preferred; tactile becomes the first choice if visual is also problematic (e.g., autistic client with sensory hyper-responsivity in both channels, where vibration through a held object is more tolerable than rapid screen motion).

---

### 3. Hardware and Software Currently in Clinical Use

**Neurotek Corporation** (Odessa, FL; founded 1991; Tier 3 vendor source). The original commercial EMDR-equipment company. Sells the Classic TAC Kit (visual lightbar + alternating audio + tactile pulsers; $700–$1,000+ range). No FDA 510(k) clearance located; company markets as professional equipment, not as a medical device. New "Virtual EMDR" web service in development. No incident or recall history found in the FDA MAUDE database via web search (this is consistent with a non-cleared, professional-use device that does not generate adverse-event reporting obligations).

**TheraTapper** (Tier 3 vendor sources): tactile-only handheld pulsers, ~$160–$200. Common in private practice. No FDA clearance located.

**Bi-Tapp** (founded 2017, US patent 2020; Tier 3): wireless tactile buzzers controlled via smartphone app or remotEMDR integration. Designed to feel like tapping rather than vibration. ~$159–$299 depending on bundle. The remotEMDR/Bi-Tapp integration is the current state-of-the-art for telehealth tactile BLS. No FDA clearance located.

**EMDR Kit** (SE Factory, Netherlands; Tier 3): all-in-one hardware (light tubes, wireless pulsators, headphones) + free control app. Operates under EU MDR but I found no public CE-mark Class IIa registration; appears to position as professional equipment. Large US therapist user base.

**Web/Software tools** (Tier 3 vendor pages):
- **bilateralstimulation.io** — claims 40,000 EMDR therapists; free; visual+audio web; tactile via proprietary USB buzzers. The de facto leader.
- **remotEMDR** — paid SaaS; full sync between therapist and client devices; HIPAA BAA available; Bi-Tapp tactile integration.
- **Bilateral Base** — paid; renders BLS directly on client device (avoiding screen-share frame-rate problems).
- **ActiveEMDR**, **Easy EMDR**, **Horizon EMDR**, **CoralEHR's free tool**, **Crown Counseling free tool**, **MaxAFriedrich/EMDR (emdr.mfriedrich.win)** — free clinician-facing tools, visual+audio.
- **Direct-to-consumer apps**: **Virtual EMDR** (~$5/mo billed annually, makes therapeutic claims), **TurboEMDR** (similar positioning, "do EMDR at home without a therapist"), **EMDR Tappers** (emdrtappers.com — web/iOS/Android/Apple Watch), **Anxiety Release based on EMDR**, **EyeMove EMDR**, **EMDR 101**, **Bilateral Base for clients**. These are the apps Sander et al. rated mean MARS-G 2.91 (poor).

**Open-source predecessors** (GitHub topic search; Tier 3):
- MaxAFriedrich/EMDR — clinical lightbar app, MIT-style
- zzukin/emdr-therapy-webapp2 — self-administered web app
- ava-cassiopeia/emdr-clicker — minimal stereo audio
- djimelec/EBC-Bilateral-Brain-Stimulator — hardware schematics
- Element14 community "Open Source EMDR Machine" project (Arduino + companion app, published to Microsoft Store and Google Play)
- ESP32-C6 dual-tactile project (in github topic emdr) — hardware
- Numerous smaller projects under the github topic `emdr`

I located **no** public records of cease-and-desist letters, takedown notices, app-store removals, or regulatory contact directed at any of these. This is the strongest available evidence that the trademark holders have so far tolerated descriptive open-source use.

**Self-administered apps and harms.** Waterman & Cooper (2020, *BJPsych Open*, peer-reviewed Tier 1): single primary study (Spence, Titov & Johnston 2013) with 15 participants, *clinician-supported* iEMDR+iCBT — not pure self-help. Outcomes: reduced PTSD/anxiety/distress at 3-month follow-up; 8 of 11 reported *increased* re-experiencing during treatment; 3 of 15 had overall worsening at end of treatment (recovered by follow-up); 4 of 15 dropped out. No serious adverse events (defined as hospitalization, suicide attempt, substance-misuse onset). The evidence base for unsupervised self-help EMDR is essentially: one quasi-experiment with weekly clinician contact, plus app-store ratings showing poor quality. No published case reports of fatal outcomes from self-help EMDR were located, but Shapiro (2018) explicitly warned the consequences could be "literally fatal" in screened-out populations.

---

### 4. Self-Administered / Unsupervised BLS

**4a. Outcomes.** The single peer-reviewed study (Spence et al. 2013, n=15) is methodologically too weak to draw firm efficacy conclusions. The mobile-app meta-analysis cited in Waterman & Cooper (2020) — Goreis et al. on six studies of PTSD apps including PTSD Coach — found modest pre-post effects but no superiority over waitlist in the two RCTs.

**4b. Reported harms.** Documented in clinician case literature (Tier 3) but not systematically catalogued in peer-reviewed adverse-event registries: dissociative episodes during unsupervised processing, abreactions without containment, retraumatization, sleep disruption, transient suicidality. Jonas, Cusack, Forneris et al. (2013, AHRQ systematic review, Tier 1) noted that adverse-effect reporting in EMDR trials has been chronically inadequate, so the *base rate* of harm even in supervised EMDR is poorly characterized — making attribution to self-help even harder.

**4c. Clinician community position.**
- **EMDRIA** (Tier 2): explicit position via the 2020 Virtual Therapy Task Group — endorses telehealth EMDR delivered by an EMDRIA-trained clinician; does *not* endorse "companies, websites, or services which offer EMDR self-therapy without live guidance."
- **EMDR Institute / Shapiro Estate** (Tier 2): Shapiro's 2018 textbook (3rd ed.) maintains that Phases 4–7 (active processing) require an in-person trained clinician for safety screening; some preparation-phase elements (Calm Place, Container, Butterfly Hug for self-soothing) are appropriate for self-use.
- **APA, NICE, WHO** (Tier 1 guidelines): all EMDR endorsements are for clinician-delivered protocols; none endorse self-administered EMDR.

**4d. Guardrails responsible apps deploy** (composite from market scan):
- First-launch screener for active suicidality, psychosis, dissociative disorders, recent trauma exposure, pregnancy, seizure history.
- Disclaimer that the tool is *not* therapy, does not diagnose or treat any condition, and is not a substitute for professional care.
- Crisis resources surfaced before first session and persistently (988 in US, Samaritans in UK, country-specific equivalents).
- "Window of tolerance" pre-check: 0–10 distress rating before each session, with hard-stop guidance if SUDS ≥8.
- "Container" / "Calm Place" exercises before any processing.
- Time-boxed sessions with mandatory closure routine.
- No claims to "process trauma" — language framed around "self-soothing," "grounding," "stress reduction," "focus."
- Optional clinician-pairing mode where therapist holds session controls.

bilateralstimulation.io and Bilateral Base (clinician-facing) implement most of these structurally by being *clinician-mediated* tools — no client-facing trauma claims, no unsupervised processing flow. Virtual EMDR and TurboEMDR (consumer-facing) implement them weakly or not at all and make explicit therapeutic claims, which is why they are the apps the Waterman & Cooper review flagged as concerning.

---

### 5. Variants and Adjacent Protocols

**Flash Technique** (Manfield et al.; published research at flashtechnique.com — Tier 3 collation of seven studies including Manfield, Engel, Greenwald, Wong). Bilateral stimulation is *optional* in current Flash protocol; Wong & Forman-Patel (2022, *J EMDR Pract Res*, peer-reviewed) demonstrate the technique works without prompted blinking and without BLS, suggesting the active mechanism is brief reflexive memory access, not BLS per se. Konuk et al. (2022, RCT) is the one randomized trial. **Implication for OpenBLS:** Flash compatibility requires no special features; standard slow BLS as a focusing aid is sufficient.

**Accelerated Resolution Therapy (ART)** (Rosenzweig; Waits, Marumoto & Weaver 2017, *Curr Psychiatry Rep* review, Tier 2). Uses 40-eye-movement sets (a fixed protocol element), Voluntary Memory/Image Replacement, and is generally visual-only. **Implication for OpenBLS:** A configurable "set length = 40 sweeps, then auto-stop" would serve ART practitioners. ART is trademarked separately; OpenBLS should not advertise ART support but a "set length" setting exposes this naturally.

**Eye Movement Integration (EMI)** (Andreas — different from Beaulieu's EMIT — Tier 3): uses *patterned* eye movements through visual quadrants rather than horizontal-only. Limited published research (Beaulieu 2003 case series; Struwig & van Breda 2012). **Implication:** A "movement path" setting (horizontal/vertical/diagonal/circular/figure-8) would serve EMI practitioners. This is already standard in commercial tools (bilateralstimulation.io exposes pattern selection).

**Attachment-focused EMDR** (Parnell — Tier 3): same modalities, slower, more frequent interweaves, "loving eyes" imagery work. No tool requirements beyond what standard BLS provides; speed range needs to extend to *slower* than typical defaults (~0.4–0.6 Hz).

**Group EMDR — IGTP and GTEP** (Jarero & Artigas; Shapiro; Tier 2 in EMDRIA materials, Tier 3 in vendor write-ups). IGTP uses Butterfly Hug (self-administered tactile); GTEP uses self-directed hand movements (also tactile). Both protocols intentionally do *not* require centrally-controlled BLS hardware — participants self-stimulate while drawing. **Implication for OpenBLS:** Group protocols are not a feature requirement; if anything, they argue for documenting that the tool is unnecessary for IGTP/GTEP.

---

### 6. Regulatory + Legal Landscape

**6a. FDA and SaMD.** Software that delivers BLS without diagnostic, prognostic, or treatment claims for a specific medical condition does *not* meet the FDA's medical-device definition. The cross-sectional regulatory study by McNamara et al. (2025, PMC12090883, Tier 1 peer-reviewed) catalogues prescription digital therapeutics with explicit prescription-use clearances; no BLS-specific 510(k) clearance was identified in publicly searchable indexes. The relevant FDA guidance documents are:
- "Policy for Device Software Functions and Mobile Medical Applications" (2019, updated 2022) — wellness/general-fitness apps that "encourage healthy lifestyle" are explicitly outside FDA enforcement.
- 21st Century Cures Act §3060 — clinical decision support and certain wellness software exempted from device definition.

**Practical implication:** OpenBLS, marketed as a "tool that delivers visual and auditory bilateral stimulation patterns," *not* as "treatment for PTSD" or "EMDR therapy software," can occupy the same regulatory lane as Neurotek, bilateralstimulation.io, and the rest. The minute the marketing claims "treats PTSD," "delivers EMDR therapy," or "processes trauma," the device definition is triggered. The README, marketing copy, app-store description, and first-launch text all matter for this determination.

**6b. EU MDR.** Stricter than the FDA. Under MDR Rule 11 (Annex VIII) as interpreted by MDCG 2019-11, software that is "intended to provide information used to take decisions for diagnostic or therapeutic purposes" classifies *at minimum* Class IIa, requiring notified-body review. The Johner Institute analysis (Tier 3 regulatory consultancy) and Hardian Health's analysis of UK Digital Mental Health Technologies (Tier 3) both confirm that mental-health software making therapeutic claims is almost certainly Class IIa under EU MDR, even when Class I under UK MDR. **A pure BLS player making no therapeutic claims is more analogous to a metronome than to a therapy app and likely escapes Rule 11**, but this is a fact-specific determination and a cautious project should obtain an EU regulatory opinion before EU launch. The bilateralstimulation.io / Bilateral Base / EMDR Kit ecosystem operates in the EU without notified-body review by adopting this positioning.

**6c. EMDRIA + Shapiro Institute trademarks.**
- **"EMDR"** — Reg. No. 1,808,113 (1993) and 1,986,652 (1995), both held by E.M.D.R. Institute, Inc. (Justia Trademarks).
- **"EMDRIA"** and **"EMDRIA EMDR INTERNATIONAL ASSOCIATION"** — held by EMDR International Association (Trademarkia 78951781; Justia 98324386).
- **"EMDR CERTIFIED THERAPIST"** — Trademarkia 97820125.
- *Not trademarked* (in any registration I could locate): "bilateral stimulation," "BLS," "dual attention stimulus," "DAS," "alternating tones," "alternating taps," "eye movement therapy" (descriptive, generic).

**Litigation history:** I located *no* reported cases of EMDR Institute or EMDRIA suing tool developers, app authors, or open-source projects. The Therapy Cincinnati clinician blog (Tier 3) explicitly notes EMDRIA "do[es] not hold a trademark over the term 'EMDR'" — a misstatement (the Institute does, EMDRIA does not), but factually correct that EMDRIA itself has not pursued naming-convention lawsuits. The Rosen et al. (2023) commentary on trademark proliferation is critical of the practice but does not document litigation.

**Safe naming conventions for OpenBLS:**
- ✅ Safe: "bilateral stimulation," "BLS," "dual attention stimulation," "alternating visual/audio/tactile cues," "open-source BLS tool"
- ⚠️ Use cautiously and only descriptively: "for use with EMDR therapy" (nominative fair use), "EMDR-style," "compatible with EMDR clinicians"
- ❌ Avoid: "OpenEMDR," "EMDR app," "EMDR therapy software," any product name containing "EMDR," "EMDRIA-approved" (false), "EMDR-certified" (false)

The current name "OpenBLS" is well-chosen for trademark exposure: BLS is generic, "Open" is descriptive of the licensing model, and there is no "OpenBLS" registration to conflict with.

**6d. Open-source project contact history.** Per github topic searches and project READMEs reviewed (MaxAFriedrich/EMDR, zzukin, ava-cassiopeia, djimelec, element14): no documented C&D letters, takedown notices, or regulatory contact. The projects that use "EMDR" in repository names have persisted for years. This is permissive evidence — not a guarantee — that descriptive use in OSS has been tolerated.

---

### 7. Safety Messaging and Contraindications

**7a. Standard contraindications surfaced in clinical practice and EMDR-clinician guidance** (synthesized from Aetna CPB 0583 Tier 2 medical policy; Shapiro 2018 textbook Tier 2; Phelps clinician guide Tier 3; ISTSS guidelines Tier 2; Choice Point Psychological Tier 3):

For first-launch warning, the clinically-defensible list:
- Active psychosis or recent psychotic episode (no longer absolute, but requires clinical judgment per Croes et al. and van den Berg studies)
- Active mania
- Severe dissociative disorder (DID, OSDD-1) without therapist support
- Acute suicidality or self-harm crisis
- Active substance intoxication
- Diagnosed photosensitive epilepsy (specifically for *visual* BLS)
- Pregnancy in late stages where stress activation is contraindicated (per Van der Hart et al. 2014)
- Recent traumatic brain injury with unstable visual or vestibular symptoms
- Ongoing active interpersonal violence (must address safety first)
- Children under approximately 7 without adult supervision

For visual BLS specifically:
- Photosensitive epilepsy, history of any photosensitive seizure, ESES/Jeavons syndrome
- Active vertigo, vestibular migraine flare, post-concussive visual-motion intolerance

For audio BLS specifically:
- Severe hyperacusis, misophonia, recent acoustic trauma
- Tinnitus that is meaningfully exacerbated by intermittent tones

**7b. Crisis-resource framing — industry standard composite:**

> "OpenBLS is a tool, not therapy. It cannot diagnose or treat any mental-health condition. If you are in crisis or thinking about harming yourself, please reach out for help: in the US, call or text 988 (Suicide and Crisis Lifeline). In the UK, call Samaritans on 116 123. In the EU, call 112. For other countries, see findahelpline.com. If you are working with a clinician, please use this tool together with them."

This pattern (crisis line + non-clinical disclaimer + clinician-pairing nudge) is what the conservative end of the market (bilateralstimulation.io, EMDRIA-aligned tools) deploys. The aggressive direct-to-consumer end (Virtual EMDR, TurboEMDR) does not, which is one reason they are the apps clinician reviewers (Waterman & Cooper 2020; D'Costa 2026 clinician blog) flag.

**7c. Practitioner-side warnings for client take-home use** — composite from EMDRIA Virtual Therapy Task Group (2020), Marchand & Hogg (2020) EMDRIA preparation document, and Jarero & Artigas (2024) Butterfly Hug guidance:

- **Resourcing-only by default.** Take-home BLS should be framed and used for Calm Place, Container, RDI installation, self-soothing — *not* for desensitization/processing of identified target memories. That is in-session work.
- **Pre-screen for dissociation tendency** before authorizing take-home use (DES-II ≥30 is a common threshold for caution).
- **Provide a written closure routine** the client uses every time they finish a take-home set: orient to the room, name 5 things you see, container any unfinished material.
- **Time limits.** Recommend short sessions (e.g., 5–15 minutes) and explicit upper bounds (e.g., "no more than 30 minutes per day without checking with me").
- **Symptom-monitoring protocol.** Client logs SUDS before and after, notes any new intrusions, reports changes at next session.
- **Crisis plan.** Named on-call person and a 988-equivalent number written into the take-home plan.
- **Stop-conditions.** Clear instructions on when to stop and contact the clinician (rising SUDS, dissociation, new suicidal ideation, new memories surfacing without context).

A clinician-mode for OpenBLS could implement all of this as structured fields the clinician fills in once per client; a self-help mode would have to surface most of it as static text and a self-screen.

---

## Recommendations

**Should tactile ship in v1 or v1.x?**

**Ship tactile in v1.x as a clearly-roadmapped fast-follow, not v1, *unless* a low-cost cross-platform haptic path exists (web Vibration API on Android; Web Bluetooth to consumer haptic devices; native CoreHaptics on iOS).** Rationale:

1. **Visual + audio covers the empirically-strongest modality (visual) and the most common telehealth fallback (audio) for ~80–85% of clinical use cases.** Shipping a *good* visual + audio MVP beats shipping a mediocre three-modality v1 where tactile is unreliable.
2. **The clinical populations that *require* tactile are non-negligible but specific**: dissociation-prone clients, photosensitive epilepsy, low vision, severe hyperacusis, young children, group-protocol facilitators, eyes-closed work. A clinician serving any of these populations will keep using Bi-Tapp or the Butterfly Hug regardless of OpenBLS until tactile arrives. Estimate 10–20% of the addressable clinical user base is excluded without tactile — meaningful, but not catastrophic for an MVP.
3. **The technical surface for tactile is qualitatively harder.** Web Vibration API is Android-only and unreliable; iOS Safari does not expose it; cross-platform tactile through consumer haptics requires Web Bluetooth (also iOS-Safari-restricted) or a native companion app per platform. Doing tactile *well* probably means shipping a separate companion app or supporting specific consumer hardware, both of which are scope expansions.
4. **The competitive frame supports a phased approach.** No major competitor ships pure web-first tactile without proprietary buzzers; bilateralstimulation.io and Bi-Tapp both require their own USB devices. An OpenBLS tactile story that is "use any existing Bi-Tapp/TheraTapper/EMDR Kit hardware via Bluetooth, or use the Butterfly Hug (which we'll teach with an animated guide)" is differentiated and feasible without bespoke hardware.

**Specific staged plan with thresholds for revision:**

- **v1 (now):** Visual (configurable speed, path, color, size, pattern length) + audio (alternating panned tones, configurable frequency, volume, voice/click options). First-launch contraindication screen. Crisis resources surfaced. Name = "OpenBLS." Marketing language: tool, not therapy. **Ship a Butterfly Hug visual guide as the tactile workaround in v1.** This costs days, not weeks, and covers the children/dissociation/eyes-closed cases serviceably.
- **v1.x (3–6 months out):** Tactile via (a) Android Web Vibration API for self-administered mobile use, (b) optional native desktop companion that drives Bluetooth haptic devices using a published, documented protocol so any tactile-hardware vendor can integrate. Document this protocol publicly to encourage Bi-Tapp/TheraTapper/Neurotek interop.
- **v1.y:** Clinician-facing session features (SUDS tracking, set-length presets for ART/Flash, multi-modality sync, optional therapist-controlled remote session).
- **Threshold to accelerate tactile to v1**: if user research with target clinicians shows ≥30% would not adopt without tactile, or if a clean cross-platform haptic path is identified that costs <2 weeks to implement, pull tactile forward.
- **Threshold to stay v1 without tactile**: if target users are predominantly adult-PTSD outpatient clinicians serving non-dissociative clients with telehealth-first practice (the bilateralstimulation.io baseline use case), v1 without tactile is competitive.

**Populations excluded if tactile is not in v1 but Butterfly Hug guide is:**

- Severe hyperacusis clients: minimal exclusion (audio off, visual still works).
- Low-vision clients: meaningfully excluded if also hyperacusis; otherwise covered by audio.
- Photosensitive epilepsy: covered by audio.
- Dissociation-prone with eyes closed: *partially* excluded if they cannot self-administer Butterfly Hug or the clinician judges self-administered tactile insufficient for containment. This is the population that most needs tactile and the most defensible argument for bumping tactile to v1.
- Young children: Butterfly Hug is the clinical standard here anyway; not excluded.
- Group-protocol facilitators (IGTP, GTEP): not excluded; protocols use Butterfly Hug.

**Net:** Without tactile in v1 but with a Butterfly Hug guide, the meaningfully-excluded population is roughly "adult dissociation-prone clients in telehealth where the clinician judges self-tactile insufficient." That is a real exclusion but a manageable one.

**Industry-standard safety and disclaimer language to ship in v1:**

The first-launch screen should contain, near-verbatim:

> **OpenBLS is a tool, not therapy.** It delivers configurable visual and audio bilateral stimulation patterns. It does not diagnose, treat, cure, or prevent any medical or psychological condition. It is not a substitute for evaluation or care from a licensed mental-health professional.
>
> **Do not use OpenBLS if any of the following apply, unless a clinician has cleared you:** active psychosis or recent psychotic episode; active mania; severe dissociative disorder; acute suicidality, self-harm, or psychiatric crisis; current intoxication; a history of seizures triggered by flashing or moving visual patterns (for visual mode); pregnancy with medical instructions to limit stress activation; recent head injury with ongoing visual or balance symptoms; ongoing active interpersonal violence in your living situation.
>
> **For visual mode**, please be aware that some people experience seizures triggered by flashing or moving visual patterns. If you have ever had such a seizure, do not use the visual mode. If during use you experience nausea, dizziness, disorientation, headache, or any unusual sensation, stop immediately.
>
> **If you are in crisis or thinking about harming yourself, please get help now:** US 988 (call or text). UK Samaritans 116 123. EU 112. Other countries: findahelpline.com.
>
> **If you are working with a clinician**, please use this tool together with them. If you are using OpenBLS on your own, we strongly recommend keeping sessions short, using calm/grounding settings (not memory-processing), and stopping immediately if distress rises.

A persistent "Crisis Resources" link in the app chrome, a SUDS pre-check for self-help mode, and an affirmative "I have read and understand the above" gate on first launch are industry standard among the responsible end of the market and should be implemented.

Optionally, a "Clinician Mode" toggle suppresses the self-help warnings and surfaces clinician-side controls (set length, target memory note field, SUDS tracking) — this is the single highest-leverage feature for positioning OpenBLS as a clinical tool rather than a consumer self-help app, and has direct regulatory benefit (clinician-mediated tools are easier to defend as outside SaMD/MDR scope).

---

## Caveats

1. **The literature is biased toward visual BLS.** Tactile BLS has been adopted into clinical practice on physiological and convenience grounds, not on outcome RCTs. The "all modalities are equivalent" line is repeated in clinical training and on EMDRIA-affiliated sites but is not the conclusion of head-to-head outcome trials. Caveat strongly when communicating with clinically-trained users who have absorbed the equivalence claim as settled fact.

2. **Sources skew toward English-language and Western practice.** EMDR has substantial use in Latin America (where the Butterfly Hug originated), East Asia, and post-conflict settings; modality-preference data from those contexts are not well captured in this brief.

3. **Regulatory analysis is non-legal.** The conclusion that a no-claims BLS tool likely escapes FDA SaMD and EU MDR Rule 11 classification is consistent with how the existing market behaves but is not a substitute for a regulatory legal opinion before EU commercial launch. The line between "wellness tool" and "medical device" is increasingly contested under EU MDR.

4. **Trademark non-litigation evidence is permissive, not protective.** I found no record of EMDR Institute or EMDRIA suing tool developers; that does not mean a future suit is impossible if a project explicitly markets "EMDR therapy" or implies institutional endorsement. The "OpenBLS" name is a stronger position than "OpenEMDR" would be.

5. **Self-help harm data are systematically under-collected.** AHRQ has flagged inadequate adverse-event reporting in EMDR trials generally; for self-help apps specifically there is no FDA MAUDE-equivalent surveillance. Absence of documented harms ≠ absence of harms. The clinician case-literature warnings (Phelps, D'Costa, Bay Area CBT) describe categories of harm that would not appear in app-store reviews or peer-reviewed registries.

6. **The component-analysis debate is not resolved.** Reasonable peer-reviewed sources disagree on whether eye movements add anything beyond exposure. OpenBLS should not take a public position; the tool delivers stimulation patterns, the user/clinician decides what to do with them.

7. **Self-help apps cited (Virtual EMDR, TurboEMDR, EMDR 101, etc.) make claims that have not been independently verified.** I report their claims as their own, not as established fact. The single peer-reviewed self-help EMDR study (Spence et al. 2013) is methodologically too weak to support marketing claims of efficacy.

8. **The "tactile is required for X population" claim rests on clinical convention plus mechanism-of-action plausibility, not on RCTs.** A defensible counter-position is that visual BLS at very slow speeds with eyes mostly closed (peripheral motion only), or audio at very low volume with calm tones, can substitute in most cases. The tactile-is-required argument is strongest for photosensitive epilepsy (where visual is genuinely contraindicated) and for the Butterfly Hug as a no-hardware self-administered option.