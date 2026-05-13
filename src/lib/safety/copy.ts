/**
 * Source-of-truth safety strings. Mirror of docs/safety-copy.md.
 * If you change any string here, also update the doc; both are reviewed
 * together.
 */

export const ACKNOWLEDGMENT_VERSION = 1;

export const SAFETY_COPY = {
  appTagline: 'Free, open-source bilateral stimulation for licensed clinicians.',

  audienceGate:
    'OpenBLS is for licensed mental-health clinicians and qualified research personnel only. It is not for self-administered or consumer use. If you are not a clinician or researcher, please close this tool and find a trained provider.',

  disclaimerHeadline:
    'OpenBLS is a tool, not therapy. It does not diagnose, treat, cure, or prevent any condition, and it is not a substitute for care from a licensed mental-health professional.',

  contraindications: [
    'Active psychosis or recent psychotic episode',
    'Active mania',
    'Severe dissociative disorder without therapist support',
    'Acute suicidality, self-harm, or psychiatric crisis',
    'Current intoxication',
    'A history of seizures triggered by flashing or moving visual patterns (relevant to the visual mode)',
    'Pregnancy with medical instructions to limit stress activation',
    'Recent head injury with ongoing visual or balance symptoms',
    'Ongoing active interpersonal violence in the user’s living situation'
  ],

  visualModeCaution:
    'Some people have seizures triggered by flashing or moving visual patterns. If that has ever happened to you, do not use the visual mode. If you feel nausea, dizziness, disorientation, headache, or anything unusual during use, stop immediately.',

  audioModeCaution:
    'If you have hyperacusis, misophonia, recent acoustic trauma, or tinnitus that gets worse with intermittent tones, the audio mode may not be a fit. Start at a low volume.',

  acknowledgmentAffirmation:
    'I am a licensed mental-health clinician or qualified research personnel. I have read and understood the items above and am clearing this tool for use within my professional judgment.',

  nonClinicianRouting:
    'OpenBLS is built for licensed clinicians using it in their practice. If you are not working with a clinician, this is not the right starting point. Bilateral stimulation outside a structured clinical relationship can surface intense emotional content without containment. The EMDRIA directory at emdria.org lists trained clinicians in the US. EMDR Europe and other regional associations cover the rest of the world.',

  crisis: {
    headline: 'If you are in crisis or thinking about harming yourself, please get help now:',
    lines: [
      { region: 'United States', text: 'Call or text 988 (Suicide and Crisis Lifeline).' },
      { region: 'United Kingdom & Ireland', text: 'Call Samaritans on 116 123.' },
      { region: 'European Union', text: 'Call 112.' },
      { region: 'Other countries', text: 'See findahelpline.com.' }
    ],
    findAHelplineUrl: 'https://findahelpline.com'
  },

  emdriaDirectoryUrl: 'https://www.emdria.org/find-an-emdr-therapist/',
  emdrEuropeUrl: 'https://emdr-europe.org/',

  dedication: {
    headline: 'For veterans and the clinicians who serve them.',
    body:
      "We're losing veterans to suicide. The clinicians who can help shouldn't have to pay subscription fees for the basic tools of their craft. OpenBLS is free, and will stay free. To clinicians using this with veterans: thank you. To veterans reading this: trained clinicians exist in every region. Find one.",
    veteransCrisisLine: 'Veterans Crisis Line. Dial 988 then press 1, or text 838255. Confidential, free, 24/7.'
  }
} as const;
