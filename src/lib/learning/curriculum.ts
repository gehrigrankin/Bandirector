/**
 * The music iceberg curriculum.
 *
 * Six tiers from the surface (things every player touches in week one) down to
 * the trench (lifetime-mastery material), for guitar and piano. Theory topics
 * are shared between the two tracks — learn it once, it counts for both.
 *
 * Topic ids are stored in learning_progress.topic_id — treat them as stable.
 */

export type Track = "guitar" | "piano";

/** Which track(s) a topic belongs to. Theory appears in both. */
export type TopicKind = "guitar" | "piano" | "theory";

export interface Topic {
  id: string;
  kind: TopicKind;
  title: string;
  /** What this topic covers. */
  summary: string;
  /** The checkpoint: what you can do once you know it. */
  goal: string;
}

export interface Tier {
  id: string;
  /** 1 = surface … 6 = the trench. */
  depth: number;
  name: string;
  tagline: string;
  topics: Topic[];
}

export const TRACKS: { id: Track; label: string }[] = [
  { id: "guitar", label: "Guitar" },
  { id: "piano", label: "Piano" },
];

export const ICEBERG: Tier[] = [
  {
    id: "surface",
    depth: 1,
    name: "The Surface",
    tagline: "Everyone starts here — the visible tip.",
    topics: [
      {
        id: "srf-note-names",
        kind: "theory",
        title: "Note names & the musical alphabet",
        summary: "A–G, sharps and flats, octaves, and how the 12 notes repeat.",
        goal: "Name any natural note and find it on your instrument.",
      },
      {
        id: "srf-rhythm-counting",
        kind: "theory",
        title: "Counting rhythm",
        summary: "Beats, bars, quarter and eighth notes, counting out loud.",
        goal: "Clap and count a simple rhythm in 4/4 without losing the pulse.",
      },
      {
        id: "srf-chord-charts",
        kind: "theory",
        title: "Reading chord charts",
        summary: "Chord symbols over lyrics — the format most songs are shared in.",
        goal: "Follow a chord chart for a song you know all the way through.",
      },
      {
        id: "srf-gtr-anatomy",
        kind: "guitar",
        title: "Guitar anatomy & tuning",
        summary: "String names (EADGBE), frets, and tuning with a tuner.",
        goal: "Tune from scratch and name every open string.",
      },
      {
        id: "srf-gtr-fretting",
        kind: "guitar",
        title: "Clean fretting & picking",
        summary: "Finger placement behind the fret, avoiding buzz and muted strings.",
        goal: "Play single notes that ring clearly on every string.",
      },
      {
        id: "srf-gtr-open-chords",
        kind: "guitar",
        title: "First open chords: E, A, D, G, C",
        summary: "The core cowboy-chord shapes that power thousands of songs.",
        goal: "Form each shape from memory with all notes sounding.",
      },
      {
        id: "srf-gtr-strumming",
        kind: "guitar",
        title: "Basic strumming",
        summary: "Down and down-up patterns, keeping the strumming arm moving.",
        goal: "Strum D-DU-UDU through a chord without stopping.",
      },
      {
        id: "srf-pno-geography",
        kind: "piano",
        title: "Keyboard geography",
        summary: "Finding C from the black-key groups, octaves, finger numbers.",
        goal: "Find any white key instantly without counting from middle C.",
      },
      {
        id: "srf-pno-posture",
        kind: "piano",
        title: "Posture & hand position",
        summary: "Bench height, curved fingers, relaxed wrists, five-finger position.",
        goal: "Play a five-finger pattern with a relaxed, rounded hand.",
      },
      {
        id: "srf-pno-triads",
        kind: "piano",
        title: "First triads: C, F, G",
        summary: "Root-position major chords and moving between them.",
        goal: "Switch C → F → G → C in time, hands separately.",
      },
      {
        id: "srf-pno-melody",
        kind: "piano",
        title: "Simple melodies, hands separate",
        summary: "Right-hand melodies over held left-hand notes.",
        goal: "Play a full simple melody with steady rhythm.",
      },
    ],
  },
  {
    id: "shallows",
    depth: 2,
    name: "Shallow Waters",
    tagline: "Where playing starts feeling like music.",
    topics: [
      {
        id: "shw-major-scale",
        kind: "theory",
        title: "The major scale",
        summary: "The whole/half-step formula that everything else is measured against.",
        goal: "Build a major scale from any root on paper and play it in C and G.",
      },
      {
        id: "shw-keys",
        kind: "theory",
        title: "Keys & key signatures",
        summary: "What it means to be 'in a key', sharps/flats that come with each.",
        goal: "Say which notes belong to any key with up to two sharps or flats.",
      },
      {
        id: "shw-intervals",
        kind: "theory",
        title: "Intervals",
        summary: "Naming distances between notes — the atoms of harmony.",
        goal: "Identify major/minor 3rds, 4ths, 5ths, and octaves by name and sound.",
      },
      {
        id: "shw-minor-chords",
        kind: "theory",
        title: "Minor chords & the relative minor",
        summary: "How minor differs from major, and why every key has a sad twin.",
        goal: "Explain and play the difference between C major and A minor.",
      },
      {
        id: "shw-gtr-minor-7th-chords",
        kind: "guitar",
        title: "Full open-chord vocabulary",
        summary: "Am, Em, Dm plus the 7th chords: E7, A7, D7, G7, C7, B7.",
        goal: "Play any common open chord on demand from its symbol.",
      },
      {
        id: "shw-gtr-changes",
        kind: "guitar",
        title: "Chord changes in time",
        summary: "One-minute changes, pivot fingers, switching without pausing.",
        goal: "Change between any two open chords on the beat at 80 bpm.",
      },
      {
        id: "shw-gtr-tab",
        kind: "guitar",
        title: "Reading tablature",
        summary: "Tab lines, fret numbers, and basic rhythm markings.",
        goal: "Learn a riff you've never heard from tab alone.",
      },
      {
        id: "shw-gtr-first-songs",
        kind: "guitar",
        title: "First full songs",
        summary: "Three-and-four-chord songs played start to finish.",
        goal: "Play three complete songs from memory.",
      },
      {
        id: "shw-pno-hands-together",
        kind: "piano",
        title: "Hands together",
        summary: "Coordinating melody and accompaniment between the hands.",
        goal: "Play melody + block chords together at a slow, steady tempo.",
      },
      {
        id: "shw-pno-easy-scales",
        kind: "piano",
        title: "Major scales in easy keys",
        summary: "C, G, D, F — one octave, correct fingering, hands separate.",
        goal: "Play each cleanly with the standard thumb-under fingering.",
      },
      {
        id: "shw-pno-accompaniment",
        kind: "piano",
        title: "Broken chords & accompaniment",
        summary: "Left-hand patterns: broken triads, root–fifth–octave, waltz bass.",
        goal: "Accompany a singer or melody with two different LH patterns.",
      },
      {
        id: "shw-pno-first-songs",
        kind: "piano",
        title: "First full songs",
        summary: "Complete easy arrangements, both hands, start to finish.",
        goal: "Play three complete songs from memory.",
      },
    ],
  },
  {
    id: "below",
    depth: 3,
    name: "Below the Surface",
    tagline: "The machinery under the songs you already play.",
    topics: [
      {
        id: "blw-circle-of-fifths",
        kind: "theory",
        title: "The circle of fifths",
        summary: "The map of keys — how sharps, flats, and related keys connect.",
        goal: "Draw the circle from memory and use it to find a key's chords.",
      },
      {
        id: "blw-diatonic-chords",
        kind: "theory",
        title: "Diatonic chords & Roman numerals",
        summary: "The seven chords in every key: I ii iii IV V vi vii°.",
        goal: "Name the chords of any major key and read a numeral progression.",
      },
      {
        id: "blw-progressions",
        kind: "theory",
        title: "Common progressions",
        summary: "I–V–vi–IV, ii–V–I, the 12-bar blues, and why they work.",
        goal: "Play each in two keys and recognize them in real songs.",
      },
      {
        id: "blw-seventh-chords",
        kind: "theory",
        title: "Seventh chords",
        summary: "maj7, m7, and dominant 7 — the flavors and where they live in a key.",
        goal: "Build and play all three types from any root.",
      },
      {
        id: "blw-ear-basics",
        kind: "theory",
        title: "Ear training basics",
        summary: "Hearing major vs minor, matching pitch, singing intervals.",
        goal: "Identify chord quality and common intervals by ear.",
      },
      {
        id: "blw-gtr-barre",
        kind: "guitar",
        title: "Barre chords",
        summary: "The F chord, and moving E- and A-shapes anywhere on the neck.",
        goal: "Play any major or minor chord as a barre, cleanly, mid-song.",
      },
      {
        id: "blw-gtr-power-chords",
        kind: "guitar",
        title: "Power chords & palm muting",
        summary: "Movable 5th chords, chugging rhythms, dynamic control.",
        goal: "Play a rock rhythm part with tight palm-muted verses.",
      },
      {
        id: "blw-gtr-pentatonic",
        kind: "guitar",
        title: "Minor pentatonic & first solos",
        summary: "Box 1, the blues scale, and phrasing your first lead lines.",
        goal: "Improvise 12 bars over a blues backing track.",
      },
      {
        id: "blw-gtr-legato",
        kind: "guitar",
        title: "Hammer-ons, pull-offs & slides",
        summary: "The connective techniques that make lines sing.",
        goal: "Play a lick using all three, smoothly and in rhythm.",
      },
      {
        id: "blw-pno-inversions",
        kind: "piano",
        title: "Chord inversions & voice leading",
        summary: "Root, 1st, 2nd inversions — moving between chords with minimal motion.",
        goal: "Play I–IV–V–I keeping your hand within a five-note span.",
      },
      {
        id: "blw-pno-pedal",
        kind: "piano",
        title: "The sustain pedal",
        summary: "Legato pedaling — changing the pedal just after each new chord.",
        goal: "Play a chord progression with clean, unblurred pedal changes.",
      },
      {
        id: "blw-pno-arpeggios",
        kind: "piano",
        title: "Arpeggios & left-hand patterns",
        summary: "Flowing broken-chord textures: Alberti bass, 1-5-10 stretches.",
        goal: "Accompany a ballad with a continuous arpeggiated left hand.",
      },
      {
        id: "blw-pno-all-scales",
        kind: "piano",
        title: "All 12 major scales",
        summary: "Every key, correct fingerings, two octaves hands together.",
        goal: "Play any major scale on request without hesitation.",
      },
    ],
  },
  {
    id: "deep",
    depth: 4,
    name: "The Deep",
    tagline: "Fluency — the fretboard and keyboard stop being a mystery.",
    topics: [
      {
        id: "dep-modes",
        kind: "theory",
        title: "Modes of the major scale",
        summary: "Dorian, Mixolydian, Lydian & friends — one scale, seven colors.",
        goal: "Play and describe the character of at least four modes.",
      },
      {
        id: "dep-secondary-dominants",
        kind: "theory",
        title: "Secondary dominants & borrowed chords",
        summary: "V/V, V/vi, and chords borrowed from the parallel minor.",
        goal: "Spot them in songs and add one to your own progression.",
      },
      {
        id: "dep-extensions",
        kind: "theory",
        title: "Chord extensions: 9, 11, 13",
        summary: "Stacking beyond the 7th, and which extensions fit which chords.",
        goal: "Voice a 9th and a 13th chord and use them in a progression.",
      },
      {
        id: "dep-transposition",
        kind: "theory",
        title: "Transposition",
        summary: "Moving songs between keys on the fly — for singers and capos.",
        goal: "Transpose a four-chord song to any key in real time.",
      },
      {
        id: "dep-ear-progressions",
        kind: "theory",
        title: "Hearing progressions & transcription",
        summary: "Working out chords and melodies from recordings by ear.",
        goal: "Transcribe the chords of a simple song without help.",
      },
      {
        id: "dep-improv",
        kind: "theory",
        title: "Improvisation fundamentals",
        summary: "Target tones, phrasing, motifs, playing over changes.",
        goal: "Improvise a solo that follows the chords, not just the key.",
      },
      {
        id: "dep-gtr-caged",
        kind: "guitar",
        title: "The CAGED system",
        summary: "Mapping the whole fretboard with five chord shapes.",
        goal: "Play any chord in five positions and name the notes under your fingers.",
      },
      {
        id: "dep-gtr-scale-positions",
        kind: "guitar",
        title: "Major scale across the neck",
        summary: "All positions, connecting boxes, three-note-per-string.",
        goal: "Play a major scale from any note anywhere on the neck.",
      },
      {
        id: "dep-gtr-fingerstyle",
        kind: "guitar",
        title: "Fingerstyle & Travis picking",
        summary: "Independent thumb bass with melody on top.",
        goal: "Play a Travis-picked accompaniment while the thumb stays steady.",
      },
      {
        id: "dep-gtr-bending",
        kind: "guitar",
        title: "Bending & vibrato",
        summary: "Pitch-accurate bends and controlled vibrato — the voice of lead guitar.",
        goal: "Bend a whole step in tune, verified against the fretted target.",
      },
      {
        id: "dep-gtr-alt-picking",
        kind: "guitar",
        title: "Alternate picking & speed",
        summary: "Strict down-up picking, metronome work, clean acceleration.",
        goal: "Play 16ths at 120 bpm cleanly with relaxed hands.",
      },
      {
        id: "dep-pno-shell-voicings",
        kind: "piano",
        title: "Shell voicings & comping",
        summary: "Root–3–7 voicings and rhythmic comping under a melody or soloist.",
        goal: "Comp through a ii–V–I in several keys with shells.",
      },
      {
        id: "dep-pno-sight-reading",
        kind: "piano",
        title: "Sight reading fluency",
        summary: "Reading both staves in real time without stopping.",
        goal: "Sight-read an easy piece straight through at tempo.",
      },
      {
        id: "dep-pno-technique",
        kind: "piano",
        title: "Advanced technique",
        summary: "Octaves, thirds, trills, minor scales and arpeggios in all keys.",
        goal: "Play harmonic & melodic minor scales and 7th-chord arpeggios fluently.",
      },
    ],
  },
  {
    id: "abyss",
    depth: 5,
    name: "The Abyss",
    tagline: "Where hobbyists become musicians other musicians notice.",
    topics: [
      {
        id: "aby-jazz-harmony",
        kind: "theory",
        title: "Jazz harmony: ii–V–I & altered dominants",
        summary: "Functional jazz progressions, altered tensions (b9, #9, #11, b13).",
        goal: "Play a jazz standard's changes with appropriate tensions.",
      },
      {
        id: "aby-reharm",
        kind: "theory",
        title: "Reharmonization & substitution",
        summary: "Tritone subs, passing diminished, chord-quality swaps.",
        goal: "Reharmonize a simple song so it sounds newly written.",
      },
      {
        id: "aby-rhythm-mastery",
        kind: "theory",
        title: "Rhythm mastery",
        summary: "Swing feel, syncopation, odd meters, basic polyrhythm.",
        goal: "Play comfortably in 3/4, 6/8, and 7/8, and swing convincingly.",
      },
      {
        id: "aby-ear-realtime",
        kind: "theory",
        title: "Real-time ears",
        summary: "Hearing changes as they happen — playing songs on first listen.",
        goal: "Join a jam on an unfamiliar song and find the chords by ear.",
      },
      {
        id: "aby-songwriting",
        kind: "theory",
        title: "Composition & songwriting craft",
        summary: "Form, melody writing, tension and release, arrangement.",
        goal: "Write and arrange a complete original song you're proud of.",
      },
      {
        id: "aby-gtr-chord-melody",
        kind: "guitar",
        title: "Chord melody & solo arranging",
        summary: "Melody, harmony, and bass at once — the whole song on one guitar.",
        goal: "Arrange and perform a tune as a solo chord-melody piece.",
      },
      {
        id: "aby-gtr-advanced-tech",
        kind: "guitar",
        title: "Sweep, tap & hybrid picking",
        summary: "The advanced right-hand vocabulary of modern guitar.",
        goal: "Use each technique musically inside a solo, not just as an exercise.",
      },
      {
        id: "aby-gtr-jazz-vocab",
        kind: "guitar",
        title: "Jazz vocabulary & bebop lines",
        summary: "Enclosures, approach notes, arpeggio-based lines over changes.",
        goal: "Solo through a 12-bar jazz blues outlining every chord.",
      },
      {
        id: "aby-pno-rootless",
        kind: "piano",
        title: "Rootless voicings & upper structures",
        summary: "Bill Evans-style LH voicings, triads over bass notes.",
        goal: "Comp a standard with rootless voicings, no written music.",
      },
      {
        id: "aby-pno-stride",
        kind: "piano",
        title: "Stride & advanced left hand",
        summary: "Bass–chord leaps, walking bass lines, independence at speed.",
        goal: "Play a chorus of stride or walking-bass piano in time.",
      },
      {
        id: "aby-pno-solo-arranging",
        kind: "piano",
        title: "Solo piano arranging",
        summary: "Intros, reharmonized melodies, full solo performances.",
        goal: "Arrange and perform a complete solo piano version of a song.",
      },
    ],
  },
  {
    id: "trench",
    depth: 6,
    name: "The Trench",
    tagline: "Lifetime material. Few go here — none come back bored.",
    topics: [
      {
        id: "trn-counterpoint",
        kind: "theory",
        title: "Counterpoint & advanced voice leading",
        summary: "Independent melodic lines that harmonize — species counterpoint to Bach.",
        goal: "Write a clean two-voice counterpoint over a given melody.",
      },
      {
        id: "trn-negative-harmony",
        kind: "theory",
        title: "Negative harmony & modal interchange deep cuts",
        summary: "Axis inversions, distant borrowings, harmony past function.",
        goal: "Recompose a progression via negative harmony and explain the mapping.",
      },
      {
        id: "trn-microtonality",
        kind: "theory",
        title: "Tuning systems & microtonality",
        summary: "Just intonation, historical temperaments, notes between the notes.",
        goal: "Explain why a keyboard's thirds are 'out of tune' — and hear it.",
      },
      {
        id: "trn-free-improv",
        kind: "theory",
        title: "A personal voice",
        summary: "Free improvisation, style synthesis, sounding like yourself.",
        goal: "Improvise solo for five minutes that only you could have played.",
      },
      {
        id: "trn-gtr-extended",
        kind: "guitar",
        title: "Altered tunings & extended techniques",
        summary: "DADGAD and beyond, harmonics, percussive and prepared guitar.",
        goal: "Perform a piece in an altered tuning using extended techniques.",
      },
      {
        id: "trn-gtr-transcribe-masters",
        kind: "guitar",
        title: "Transcribing the masters",
        summary: "Note-for-note study of great players until their language is yours.",
        goal: "Transcribe and perform a full solo by a player you love, from ear.",
      },
      {
        id: "trn-pno-transcribe-masters",
        kind: "piano",
        title: "Transcribing the masters",
        summary: "Note-for-note study of great pianists until their language is yours.",
        goal: "Transcribe and perform a full solo by a pianist you love, from ear.",
      },
      {
        id: "trn-pno-orchestral",
        kind: "piano",
        title: "The piano as orchestra",
        summary: "Advanced repertoire, orchestral textures, complete stylistic command.",
        goal: "Perform an advanced piece with full dynamic and textural control.",
      },
    ],
  },
];

/** Topics visible in a given track (instrument-specific + shared theory). */
export function topicsForTrack(tier: Tier, track: Track): Topic[] {
  return tier.topics.filter((t) => t.kind === track || t.kind === "theory");
}

export function trackTopicCount(track: Track): number {
  return ICEBERG.reduce((n, tier) => n + topicsForTrack(tier, track).length, 0);
}

const VALID_IDS = new Set(ICEBERG.flatMap((t) => t.topics.map((x) => x.id)));

export function isValidTopicId(id: string): boolean {
  return VALID_IDS.has(id);
}
