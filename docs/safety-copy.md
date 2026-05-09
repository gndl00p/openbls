# Source-of-truth safety copy

This file is the canonical source for all user-facing safety strings in
OpenBLS. Components in `src/lib/safety/` and `src/lib/i18n/` import the
strings rather than hard-coding them, so changes here propagate everywhere
in one PR.

Edits to this file get a slow, deliberate review. Provide citations in the
PR description for any change to clinical content.

## Acknowledgment-gate version

Bump `ACKNOWLEDGMENT_VERSION` in `src/lib/safety/copy.ts` when the
contraindication list, headline disclaimer, or crisis-resource framing
changes in a way that materially alters what the user is affirming.
Bumping forces existing users to re-acknowledge.

Current version: **1**.

## Strings

### App tagline (one line)

> Open-source bilateral-stimulation tool for licensed clinicians.

### Disclaimer headline

> OpenBLS is a tool, not therapy. It does not diagnose, treat, cure,
> or prevent any condition. It is not a substitute for evaluation or
> care from a licensed mental-health professional.

### Contraindication list

These conditions warrant clinical clearance before using the tool. The
list is composite from research §7a (peer-reviewed and practice-guideline
sources) and is treated as authoritative for the first-launch gate.

- Active psychosis or recent psychotic episode
- Active mania
- Severe dissociative disorder without therapist support
- Acute suicidality, self-harm, or psychiatric crisis
- Current intoxication
- A history of seizures triggered by flashing or moving visual patterns
  (relevant to the visual mode)
- Pregnancy with medical instructions to limit stress activation
- Recent head injury with ongoing visual or balance symptoms
- Ongoing active interpersonal violence in the user's living situation

### Mode-specific cautions

**Visual mode.**
> Some people experience seizures triggered by flashing or moving visual
> patterns. If you have ever had such a seizure, do not use the visual
> mode. If during use you experience nausea, dizziness, disorientation,
> headache, or any unusual sensation, stop immediately.

**Audio mode.**
> If you have severe hyperacusis, misophonia, recent acoustic trauma, or
> tinnitus that is meaningfully exacerbated by intermittent tones, the
> audio mode may not be appropriate. Start at a low volume.

### Crisis resources

> If you are in crisis or thinking about harming yourself, please get
> help now:
>
> - United States — call or text 988 (Suicide and Crisis Lifeline).
> - United Kingdom & Ireland — call Samaritans on 116 123.
> - European Union — call 112.
> - Other countries — see findahelpline.com.

### Acknowledgment-gate affirmation

> I have read and understood the items above and I am clearing this tool
> for use within my clinical judgment.

### Non-clinician routing

Shown in docs and on the About page when a non-clinician self-identifies.

> OpenBLS is built for use by licensed clinicians inside their practices.
> If you are not working with a clinician, this tool is not the right
> starting point — bilateral stimulation outside a structured clinical
> relationship can surface intense emotional content without containment.
> The EMDRIA directory at emdria.org lists trained clinicians in the US;
> EMDR Europe and other regional associations cover the rest of the world.
