/**
 * Source-of-truth safety strings. Mirror of docs/safety-copy.md.
 * If you change any string here, also update the doc; both are reviewed
 * together.
 */

export const ACKNOWLEDGMENT_VERSION = 1;

export const SAFETY_COPY = {
  appTagline: 'Open-source bilateral-stimulation tool for licensed clinicians.',

  disclaimerHeadline:
    'OpenBLS is a tool, not therapy. It does not diagnose, treat, cure, or prevent any condition. It is not a substitute for evaluation or care from a licensed mental-health professional.',

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
    'Some people experience seizures triggered by flashing or moving visual patterns. If you have ever had such a seizure, do not use the visual mode. If during use you experience nausea, dizziness, disorientation, headache, or any unusual sensation, stop immediately.',

  audioModeCaution:
    'If you have severe hyperacusis, misophonia, recent acoustic trauma, or tinnitus that is meaningfully exacerbated by intermittent tones, the audio mode may not be appropriate. Start at a low volume.',

  acknowledgmentAffirmation:
    'I have read and understood the items above and I am clearing this tool for use within my clinical judgment.',

  nonClinicianRouting:
    'OpenBLS is built for use by licensed clinicians inside their practices. If you are not working with a clinician, this tool is not the right starting point — bilateral stimulation outside a structured clinical relationship can surface intense emotional content without containment. The EMDRIA directory at emdria.org lists trained clinicians in the US; EMDR Europe and other regional associations cover the rest of the world.',

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
  emdrEuropeUrl: 'https://emdr-europe.org/'
} as const;
