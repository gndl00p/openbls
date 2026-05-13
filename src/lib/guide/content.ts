// Canonical content for the clinicians' guide. Both the inline help popovers
// in ControlsPanel and the long-form /guide page read from this file so the
// two surfaces never drift.

export interface Citation {
  author: string;
  year: number;
  venue: string;
}

export interface GuideEntry {
  /** Stable key — used as anchor id and as the help-popover key. */
  key: string;
  /** Human label as shown in the panel. */
  label: string;
  /** Short popover content — keep terse. */
  short: {
    what: string;
    why: string;
    cite?: string;
  };
  /** Long-form guide page content. */
  long: {
    /** Plain-language description of what the control does. */
    description: string;
    /** "Moving this towards X will ..." — practical effect on the session. */
    moving: string;
    /** Narrative explanation of the research. */
    research: string;
    /** Primary citations. */
    citations: Citation[];
  };
}

export const GUIDE_ENTRIES: GuideEntry[] = [
  {
    key: 'visual',
    label: 'Visual channel',
    short: {
      what: 'Turn the visual channel off.',
      why: 'Photosensitive epilepsy and visual-tracking problems rule out visual BLS.'
    },
    long: {
      description:
        'Turns the moving target on or off. With it off, the canvas stays blank and the session runs on audio alone.',
      moving:
        'Turn it off for clients with photosensitive epilepsy, post-concussive tracking problems, vestibular conditions that flare on smooth-pursuit, or low vision. Visual is the most-studied channel in the literature, so think about why before disabling it.',
      research:
        'The Lee & Cuijpers 2013 meta-analysis found eye-movement BLS added a meaningful effect over no-eye-movement EMDR (d ≈ 0.41 in clinical trials, d ≈ 0.74 in lab studies). Visual is the most-studied modality. About 3 to 5 percent of people with epilepsy have photosensitive epilepsy, and WCAG 2.1 §2.3 caps flashing visual content at three transitions per second. That ceiling is the legal exposure line for any app that flashes the screen.',
      citations: [
        { author: 'Lee & Cuijpers', year: 2013, venue: 'Journal of Behavior Therapy and Experimental Psychiatry' },
        { author: 'Epilepsy Foundation', year: 2024, venue: 'Photosensitivity practice resource' }
      ]
    }
  },
  {
    key: 'audio',
    label: 'Audio channel',
    short: {
      what: 'Turn the audio channel off.',
      why: 'Hyperacusis, misophonia, or tinnitus that reacts to intermittent tones rule out audio BLS.'
    },
    long: {
      description:
        'Turns the alternating left/right tone on or off. With it off, the session is silent.',
      moving:
        'Turn it off for clients with hyperacusis, misophonia, or tinnitus that gets worse with intermittent tones. Autistic clients with auditory hypersensitivity often prefer visual-only sessions.',
      research:
        'Audio BLS has a smaller outcome-evidence base than visual. Van den Hout et al. 2011 measured working-memory taxation by reaction time and reported that eye movements slowed responses to auditory cues but bilateral beeps did not slow responses to visual cues. They concluded, in their own words: "eye movements [are] superior to beeps in taxing working memory and reducing vividness of recollections." Matthijssen et al. 2017 reported modality-specific loading. Bilateral tones reduced vividness of auditory intrusions but did less for visual ones.',
      citations: [
        { author: 'van den Hout et al.', year: 2011, venue: 'Behaviour Research and Therapy' },
        { author: 'Matthijssen et al.', year: 2017, venue: 'Frontiers in Psychology' },
        { author: 'Tyler et al.', year: 2014, venue: 'Hyperacusis prevalence estimate' }
      ]
    }
  },
  {
    key: 'time',
    label: 'Auto-stop time',
    short: {
      what: 'Stop the session after this many running minutes. Pauses do not count.',
      why: 'Bounded sessions are standard clinical practice and support fixed-set protocols.'
    },
    long: {
      description:
        'The session stops on its own after the configured running minutes. Pauses do not add to the total. Off means no auto-stop.',
      moving:
        'Use it to bound a session for protocols that call for a fixed processing block, like 40-sweep fixed sets or time-boxed resourcing. Off lets you end the set yourself with Stop.',
      research:
        'Clinician control of session duration is part of standard EMDR safety practice. Some EMDR-adjacent protocols use fixed-length sets and benefit from a "set length, then auto-stop" workflow.',
      citations: [
        { author: 'Waits, Marumoto & Weaver', year: 2017, venue: 'Current Psychiatry Reports' }
      ]
    }
  },
  {
    key: 'speed',
    label: 'Object speed',
    short: {
      what: 'How fast the target moves left to right, in Hz.',
      why: 'Research links faster eye-movement rates to greater memory-vividness reduction, up to a ceiling. Slower rates (0.4 to 0.6 Hz) come from attachment-focused EMDR.',
      cite: 'van Veen et al. 2015'
    },
    long: {
      description:
        'How many full left-to-right cycles happen per second. The audio scheduler stays in step with the visual sweep.',
      moving:
        'The full 0.4 to 2.0 Hz range is exposed because the literature does not converge on a single optimal value. Faster rates are linked to greater memory-vividness reduction up to a ceiling. Slower rates around 0.4 to 0.6 Hz come from attachment-focused EMDR. The default 1.0 Hz is a common middle setting, not a recommendation. You adjust within the range based on protocol, training, and client response.',
      research:
        'Van Veen et al. 2015 (Frontiers in Psychiatry) reported that faster eye-movement rates correlated with greater reduction in memory vividness than slower rates, up to a ceiling. Parnell\'s attachment-focused EMDR literature describes speeds slower than typical defaults, around 0.4 to 0.6 Hz, which is why the lower bound extends to 0.4. The tool renders the stimulus. The literature describes correlations observed in the modality.',
      citations: [
        { author: 'van Veen et al.', year: 2015, venue: 'Frontiers in Psychiatry' },
        { author: 'Parnell', year: 2013, venue: 'Attachment-Focused EMDR' }
      ]
    }
  },
  {
    key: 'setLength',
    label: 'Set length',
    short: {
      what: 'How many sweeps make up one set.',
      why: 'Standard EMDR varies 20 to 40+. Some adjacent protocols use 40-sweep fixed sets.',
      cite: 'Shapiro 2018'
    },
    long: {
      description:
        'How many sweeps make up one set. The session pauses between sets when the configured set count is reached, or runs continuously if set count is open-ended.',
      moving:
        'Shorter sets (20 to 24) show up in standard EMDR for the early reprocessing phase. Longer fixed sets (40+) show up in some EMDR-adjacent protocols. The setting is here so you can match the protocol you use.',
      research:
        'Standard EMDR protocols vary 20 to 40+ sweeps per set with no single evidence-based number. Clinician calibration to client response is the norm in the literature. Some EMDR-adjacent protocols specify fixed-length sets. Both are configurable here without endorsing either as the right answer.',
      citations: [
        { author: 'Shapiro', year: 2018, venue: 'EMDR Therapy: Basic Principles, Protocols, and Procedures (3rd ed.)' },
        { author: 'Waits, Marumoto & Weaver', year: 2017, venue: 'Current Psychiatry Reports' }
      ]
    }
  },
  {
    key: 'tone',
    label: 'Audio tone',
    short: {
      what: 'The voice of the alternating tone.',
      why: 'Outcome research does not pick a winner past "tone vs click." Choose by client comfort.'
    },
    long: {
      description:
        'The timbre of the alternating audio. Seven options span the continuous tone family (sine, soft, tone, chime) and the percussive family (click, woodblock, pluck).',
      moving:
        'Switch between tone and click families based on client preference. Continuous tones (sine, soft) feel gentler, more like a pad. Percussive voices (click, woodblock) are sharper and easier to anchor to. No specific voice has been shown to outperform another in outcome trials. Comfort is the criterion.',
      research:
        'The distinction between sustained tone and short percussive click is the only audio-voice variable with even informal practitioner-level evidence. The other five voices are tone-family variants offered for client comfort.',
      citations: [
        { author: 'van den Hout et al.', year: 2011, venue: 'Behaviour Research and Therapy' }
      ]
    }
  },
  {
    key: 'frequency',
    label: 'Frequency',
    short: {
      what: 'Pitch of the audio tone, in Hz.',
      why: 'No specific frequency is evidence-backed. Tinnitus reactivity is the main reason to move it.'
    },
    long: {
      description:
        'The pitch, in hertz, of the alternating tone. 440 Hz (A4) is a neutral default.',
      moving:
        'Lower frequencies (200 to 400 Hz) sit in the speech range and feel warmer. Higher frequencies (800 to 1200 Hz) cut through ambient noise but can fatigue or trigger tinnitus reactivity. Match to client preference. Ask before going above 800 Hz if tinnitus is part of the picture.',
      research:
        'No published trial compares specific audio frequencies for BLS outcome. The setting is configurable so you can move away from frequencies that match a client\'s tinnitus tone.',
      citations: []
    }
  },
  {
    key: 'volume',
    label: 'Volume',
    short: {
      what: 'Audio level.',
      why: 'Comfort and usability.'
    },
    long: {
      description:
        'Master volume for the audio channel, as a fraction of system volume.',
      moving:
        'Audible but below startle threshold. Many clinicians run BLS audio at 30 to 50 percent with headphones.',
      research: 'No outcome research ties volume to effect. Comfort control.',
      citations: []
    }
  },
  {
    key: 'panWidth',
    label: 'Pan width',
    short: {
      what: 'How far the tone separates between left and right channels.',
      why: 'Stereo separation is what makes alternating-tone BLS bilateral. Narrow if a client cannot tolerate full separation.'
    },
    long: {
      description:
        'Stereo separation of the alternating tone. 0 percent plays both sounds in the center. 100 percent pans them fully hard-left and hard-right.',
      moving:
        'Wider (closer to 100 percent) gives a stronger bilateral spatial effect, which is the whole point of alternating-tone BLS. Narrow if a client with auditory-processing differences finds the stereo movement uncomfortable. Very narrow panning collapses toward a non-bilateral mono pulse. At that point it is worth asking whether the audio channel is still doing useful work for this client.',
      research:
        'Spatial separation is the active variable of bilateral audio BLS. Outcome research on pan amount itself does not exist. The setting is configurable to serve client tolerance, not a known dose-response curve.',
      citations: []
    }
  },
  {
    key: 'size',
    label: 'Object size',
    short: {
      what: 'Visual target size, in pixels.',
      why: 'No outcome difference. Larger helps low-vision clients track the target.'
    },
    long: {
      description:
        'Diameter of the moving target on screen, in pixels.',
      moving:
        'Larger targets are easier to track for low-vision clients or when the display is far from the client. Smaller targets demand sharper tracking. No published trial ties target size to outcome.',
      research: 'No outcome research ties target size to effect.',
      citations: []
    }
  },
  {
    key: 'shape',
    label: 'Object shape',
    short: {
      what: 'Visual target style.',
      why: 'No outcome difference. Cosmetic.'
    },
    long: {
      description: 'Style of the moving target: dot (small filled), ring (outlined), or circle (large filled).',
      moving: 'Choose by client preference. No outcome difference.',
      research: 'No outcome research ties target shape to effect.',
      citations: []
    }
  },
  {
    key: 'background',
    label: 'Background',
    short: {
      what: 'Backdrop color behind the moving target.',
      why: 'Color is treatment-neutral. Contrast (below) is the safety-relevant control.'
    },
    long: {
      description:
        'Background color rendered behind the target. Dark backgrounds reduce ambient screen glare. Light backgrounds suit daylight clinic rooms.',
      moving:
        'Pick a color that contrasts comfortably with the target. Use the separate Contrast control for the safety-relevant adjustment. Background color alone has no documented outcome effect.',
      research: 'No outcome research ties background color to effect.',
      citations: []
    }
  },
  {
    key: 'contrast',
    label: 'Contrast',
    short: {
      what: 'How much the target stands out against the background.',
      why: 'Reduced contrast is the photosensitive-aware option. Aligns with WCAG 2.1 §2.3.'
    },
    long: {
      description:
        'Three preset levels (high, standard, reduced) that adjust how strongly the target stands out from the background.',
      moving:
        'Use Reduced for photosensitive-aware sessions, or as a precaution when a client has not been screened for photosensitive epilepsy. Standard is the middle setting. High gives the most target visibility and the most photosensitive risk surface.',
      research:
        'WCAG 2.1 §2.3 caps flashing visual content at three transitions per second to avoid triggering seizures in photosensitive individuals. OpenBLS renders smooth motion, not luminance flashes, so it does not breach the threshold at typical speeds. Reducing contrast is an additional safeguard that lines up with industry-standard reduced-motion and reduced-contrast practice.',
      citations: [
        { author: 'W3C', year: 2018, venue: 'WCAG 2.1 §2.3 Three Flashes Threshold' },
        { author: 'Epilepsy Foundation', year: 2024, venue: 'Photosensitivity practice resource' }
      ]
    }
  },
  {
    key: 'targetColor',
    label: 'Object color',
    short: {
      what: 'Color of the moving target.',
      why: 'No outcome difference. Cosmetic.'
    },
    long: {
      description: 'Color of the moving target.',
      moving: 'Pick by client preference. No outcome difference.',
      research: 'No outcome research ties target color to effect.',
      citations: []
    }
  },
  {
    key: 'path',
    label: 'Object path',
    short: {
      what: 'The shape the target traces as it moves.',
      why: 'Horizontal is the canonical EMDR pattern. Non-horizontal paths come from Eye Movement Integration (EMI).'
    },
    long: {
      description:
        'The trajectory the target traces: horizontal, vertical, diagonal, circular, or figure-eight.',
      moving:
        'Horizontal is the trajectory used in nearly all published outcome trials and is the canonical EMDR pattern in the literature. Vertical, diagonal, circular, and figure-eight paths come from Eye Movement Integration (EMI), a less-studied EMDR-adjacent protocol. Van den Hout & Engelhard 2012 reported that vertical eye movements also reduced memory vividness. That suggests the active variable in the literature is central executive load, not bilaterality. Non-horizontal paths are here for clinicians who use protocols that call for them.',
      research:
        'Van den Hout & Engelhard 2012 disproved both the necessity of eye movements specifically and the necessity of bilaterality. Vertical eye movements, mental arithmetic, complex tapping, Tetris, and drawing complex figures all reduce vividness and emotionality of recalled memories. The active variable is central executive load during memory retrieval, not the specific motor pattern. EMI (Beaulieu 2003; Struwig & van Breda 2012) uses patterned non-horizontal trajectories and has limited published research.',
      citations: [
        { author: 'van den Hout & Engelhard', year: 2012, venue: 'Journal of Experimental Psychopathology' },
        { author: 'Beaulieu', year: 2003, venue: 'EMI case series' },
        { author: 'Struwig & van Breda', year: 2012, venue: 'EMI case study' }
      ]
    }
  },
  {
    key: 'saved',
    label: 'Saved settings',
    short: {
      what: 'Built-in and your own saved presets.',
      why: 'One-tap recall of configurations you have tuned.'
    },
    long: {
      description:
        'Built-in presets ship with OpenBLS. Custom presets are configurations you have saved, kept locally on this device.',
      moving:
        'Tap any preset to load it. Edit anything and hit Save to capture the result as a new custom preset. Presets stay on this device and are never sent to a server.',
      research:
        'Built-in presets cover common starting configurations. Customs let you capture your own. This is an interface affordance, not a treatment lever.',
      citations: []
    }
  }
];

export const GUIDE_BY_KEY: Record<string, GuideEntry> = Object.fromEntries(
  GUIDE_ENTRIES.map((e) => [e.key, e])
);
