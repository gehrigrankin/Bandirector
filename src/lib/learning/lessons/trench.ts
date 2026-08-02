import type { Lesson } from "./types";

export const TRENCH_LESSONS: Record<string, Lesson> = {
  "trn-counterpoint": {
    intro: [
      "Counterpoint is the discipline of writing two or more melodies that are each worth singing on their own yet sound good together. Every strong arrangement, bass line, and inner voice you have ever admired is applied counterpoint.",
      "Species counterpoint, codified by Fux in 1725, is still the fastest way to internalize it. Bach learned this way. So will you.",
    ],
    sections: [
      {
        heading: "First species: the rules",
        body: [
          "One note against one note. Every vertical interval must be a consonance: unison, 3rd, 5th, 6th, or octave. 4ths, 2nds, and 7ths are dissonant and forbidden in first species.",
          "Begin and end on a perfect consonance (unison, 5th, or octave). Approach the final interval by contrary stepwise motion: if the cantus firmus ends 2-1, your line ends 7-8.",
          "Never move into a perfect 5th or octave in parallel or similar motion. Parallel 5ths and 8ves fuse the two voices into one and destroy independence. This is the cardinal sin.",
        ],
      },
      {
        heading: "Motion types",
        body: [
          "Contrary motion (voices move opposite directions) is your default and strongest choice. Oblique motion (one voice holds) is fine. Similar motion is allowed into imperfect consonances (3rds, 6ths). Prefer mostly stepwise lines with one well-placed leap, recovered by a step in the opposite direction.",
          "Use imperfect consonances (3rds and 6ths) for most of the middle of the exercise; too many perfect intervals sounds hollow, too many parallel 3rds sounds like a duet, not two voices.",
        ],
      },
      {
        heading: "Beyond first species",
        body: [
          "Second species adds two notes per cantus note and introduces the passing tone: a dissonance is allowed on the weak beat if approached and left by step in the same direction. Fourth species adds suspensions: a consonance tied over the barline becomes a dissonance, then resolves down by step (7-6, 4-3, 9-8). Suspensions are the engine of Bach's harmony.",
        ],
      },
    ],
    practice: [
      "Take the cantus firmus D-F-E-D-G-F-A-G-F-E-D and write a first-species line above it. Label every interval.",
      "Check the whole exercise for parallel and hidden 5ths and 8ves. Fix them with contrary motion.",
      "Sing one voice while playing the other. If you cannot sing it, the line is not melodic enough. Rewrite.",
      "Write a second-species line over the same cantus, using at least three passing tones.",
      "Analyze the first eight bars of a Bach two-part invention: mark every suspension and every point of contrary motion.",
    ],
    watchOut:
      "Fixating on the vertical intervals and forgetting the line. A rule-perfect counterpoint with a boring, leap-riddled melody has failed; each voice must be singable on its own.",
  },

  "trn-negative-harmony": {
    intro: [
      "Negative harmony reflects every note of a key across a single axis, turning each chord into a mirror image with the same gravitational pull toward the tonic but a darker color. It gives you a systematic way to generate fresh reharmonizations instead of guessing.",
    ],
    sections: [
      {
        heading: "The axis",
        body: [
          "The axis sits exactly halfway between the tonic and the fifth of the key. In C, that is halfway between C and G: the point between E and E flat. Reflect every pitch across it: C swaps with G, D with F, E with E flat, B with A flat, A with B flat, F sharp with C sharp (i.e. G flat with D flat).",
          "Reflect a chord note by note. G7 (G-B-D-F) becomes G-A flat-F-D read through the mirror: C-A flat-F-D, which is Fm6 (or Dm7b5). That is why Fm6 resolves to C as convincingly as G7 does: it is the negative dominant.",
        ],
      },
      {
        heading: "Mapping I-IV-V",
        body: [
          "In C major: I (C-E-G) maps to itself as C minor (C-E flat-G) in most practical use, since E reflects to E flat. IV (F-A-C) maps to G-B flat-D flat... in practice F major reflects to G minor over the axis (F-A-C to G-B flat-C region), commonly rendered as Gm or B flat. V (G-B-D) maps to Fm.",
          "So the plagal-sounding replacement of C-F-G-C is Cm-Gm-Fm-Cm territory. You rarely use the full mirror literally; the working method is to swap one or two chords, most often V7 for iv6 or bVII9, and keep the rest diatonic.",
        ],
      },
      {
        heading: "Modal interchange deep cuts",
        body: [
          "Beyond the common bVII and iv borrowings, raid the parallel modes deliberately: bII from Phrygian (Db major in C: the Neapolitan), bVImaj7 from Aeolian, IVm7b5 via melodic minor, and the Lydian II (D major in C) for lift. Each borrowed chord carries its source scale for melody: over bVImaj7 in C, play C Aeolian, not C major.",
        ],
      },
    ],
    practice: [
      "Write out the C major axis pairs from memory: C-G, D-F, E-Eb, B-Ab, A-Bb, F#-Db.",
      "Reflect G7 note by note and confirm you get Fm6. Play G7-C, then Fm6-C, on guitar and piano; compare the pull.",
      "Take an 8-bar I-IV-V progression of your own and rewrite it with every chord mirrored. Play both versions back to back.",
      "Recompose a song you know by replacing only its final V-I cadence with the negative version. Keep everything else.",
      "Write one 4-bar phrase using the Neapolitan bII and resolve it convincingly.",
    ],
    watchOut:
      "Mirroring everything mechanically and calling it a day. Negative harmony is a generator of candidates, not a finished arrangement; keep the substitutions that serve the melody and discard the rest.",
  },

  "trn-microtonality": {
    intro: [
      "Every keyboard you have ever played is out of tune on purpose. Understanding why, and by how much, changes how you hear intonation forever, and it explains choir blend, blues bends, and why some synth patches shimmer.",
    ],
    sections: [
      {
        heading: "Just intonation: intervals as ratios",
        body: [
          "Pure intervals are small whole-number frequency ratios: the octave is 2:1, the perfect fifth 3:2, the major third 5:4, the minor third 6:5. When two notes lock into one of these ratios their overtones align and the beating stops. That beatless lock is what a barbershop quartet or a string section tunes to in real time.",
        ],
      },
      {
        heading: "Why 12-TET compromises",
        body: [
          "Stack twelve pure 3:2 fifths and you overshoot seven octaves by about 23.5 cents (the Pythagorean comma), so a fixed 12-note instrument cannot have all pure fifths and pure octaves. Equal temperament splits the octave into twelve identical 100-cent semitones. The cost: the ET fifth is 700 cents versus a pure 701.96, nearly perfect, but the ET major third is 400 cents versus a pure 386.3. Your piano's thirds are 14 cents sharp, and that fast shimmer you hear in a held C-E is the beating.",
        ],
      },
      {
        heading: "Temperaments and beyond twelve",
        body: [
          "Historical meantone temperaments narrowed the fifths to purify the thirds, making some keys sweet and remote keys unusable (the wolf fifth). Well temperaments (Werckmeister and friends) made every key usable but distinct in color, which is the world Bach's Well-Tempered Clavier was written for. Other divisions exist: 24-TET gives quarter tones used in Arabic maqam; 31-TET approximates meantone; guitarists reach just intonation directly with bends and slides, which is half of what makes blues vocabulary work.",
        ],
      },
    ],
    practice: [
      "Load a free tone generator. Play 440 Hz against 660 Hz (pure 3:2 fifth), then 440 against 659.26 (ET fifth). Listen for the slow beating in the second.",
      "Compare a pure major third, 440 against 550 Hz (5:4), with the ET third, 440 against 554.37. The 14-cent gap is unmistakable.",
      "On guitar, tune the open B string as a pure third against open G by ear (eliminate beating), then check a tuner: it will read about 14 cents flat. Retune and understand why.",
      "On piano, hold C-E in the middle register, silently depress, and count the beats per second in the shimmer.",
      "Play one melody with a quarter-tone inflection: bend guitar strings halfway between frets, or find a keyboard patch with pitch-bend range set to 50 cents.",
    ],
    watchOut:
      "Treating just intonation as 'correct' and 12-TET as 'wrong'. Each is a trade-off: JI is beatless but key-locked, ET is uniform but everywhere slightly impure. Master ears move between them by context.",
  },

  "trn-free-improv": {
    intro: [
      "Every skill before this one was about absorbing other people's language. This one is about noticing what is left when you stop quoting: your default rhythms, your intervals, your touch. A personal voice is not invented; it is uncovered and then deliberately sharpened.",
    ],
    sections: [
      {
        heading: "Constraint-based free playing",
        body: [
          "Total freedom produces mush. Free improvisation works when you choose one hard constraint and exhaust it: only two strings, only black keys, no pulse, one dynamic, a single 4-note cell. The constraint silences your habits long enough for something new to surface. Change the constraint, not the honesty.",
        ],
      },
      {
        heading: "Audit your defaults",
        body: [
          "Record yourself improvising freely for ten minutes, then transcribe your own playing as if you were a stranger. List what recurs: favorite intervals, rhythmic tics, register habits, how you end phrases. That list is your current voice. Now decide, item by item: keep and exaggerate, or ban for a month. Style is curation of your own tendencies.",
        ],
      },
      {
        heading: "Synthesis, not imitation",
        body: [
          "Pick the three players who shaped you most and name one specific device you took from each, as precisely as 'Monk's whole-tone runs' or 'Frisell's open-string pedal tones'. Then force two of those devices into the same phrase. The collision, played in your time feel, is where synthesis happens. Influences combined at a specific, granular level stop sounding like imitation.",
        ],
      },
    ],
    practice: [
      "Improvise five minutes with one constraint (one string, or black keys only). Record it.",
      "Transcribe two minutes of your own recording and write down five recurring habits.",
      "Ban your single most common lick for a week of practice; notice what you reach for instead.",
      "Take one device each from two heroes and compose a 4-bar phrase that uses both.",
      "Improvise solo for five minutes aiming to use only material from your own audit list, exaggerated.",
      "Repeat the recording a month later and compare: the differences are your voice moving.",
    ],
    watchOut:
      "Confusing 'free' with 'random'. Aimless noodling with no constraint and no listening back develops nothing; the recorder and the self-transcription are the whole method.",
  },

  "trn-gtr-extended": {
    intro: [
      "Altered tunings reset the fretboard so your hands cannot fall into stock shapes, and extended techniques turn the guitar into a percussion section and a harp. Together they are how solo guitar stops sounding like accompaniment missing a singer.",
    ],
    sections: [
      {
        heading: "Getting into DADGAD",
        body: [
          "From standard: drop the 6th string E down a whole step to D (match it an octave below the open 4th string). Leave the 5th (A), 4th (D), and 3rd (G) alone. Drop the 2nd string B down a whole step to A (match the open 5th an octave up). Drop the 1st string E down to D (match the open 4th an octave up). Strummed open you get Dsus4: neither major nor minor, which is the point.",
          "First moves: barre all six strings at one fret for instant chords; play melodies on the top two strings against open D and A drones. Learn the intervals, not transplanted shapes: the 2nd and 1st strings now sit a whole step lower, so anything on those strings shifts up two frets.",
        ],
      },
      {
        heading: "Harmonics",
        body: [
          "Natural harmonics live at 12, 7, and 5 (octave, octave plus fifth, double octave): touch the string directly over the fretwire, pick, release. Artificial harmonics free you from open strings: fret a note, touch the same string exactly 12 frets higher with the picking-hand index, and pluck with thumb or ring finger. Practice harp harmonics by alternating an artificial harmonic with a normally plucked note on the next string.",
        ],
      },
      {
        heading: "Percussive and prepared techniques",
        body: [
          "Three drum voices: thumb heel on the bass side of the soundboard for a kick, ring-finger slap on the treble side near the bridge for a snare, and a full-hand string slap at the neck joint for a combined snare-plus-mute. Keep them on beats 1 and 3 (kick) and 2 and 4 (snare) under a fingerpicked pattern until it grooves without thinking. Prepared guitar: weave a pencil or strip of felt through the strings near the bridge for a muted, kalimba-like attack.",
        ],
      },
    ],
    practice: [
      "Retune to DADGAD using the octave-matching steps above; verify with a tuner.",
      "Map D major on the top three strings in DADGAD and play a familiar melody over open-string drones.",
      "Ten minutes of harp harmonics: artificial harmonic on string 3, plucked note on string 2, alternating, slow.",
      "Loop a two-bar fingerpicked pattern in DADGAD and add kick (beat 1 and 3) then snare (2 and 4) without breaking time.",
      "Learn one full piece in DADGAD from a player like Pierre Bensusan or Andy McKee and perform it end to end.",
    ],
    watchOut:
      "Hunting for standard-tuning chord shapes in the new tuning. The whole value of DADGAD is that your old grips are gone; build from open-string drones and intervals instead.",
  },

  "trn-gtr-transcribe-masters": {
    intro: [
      "Transcription is the only method every great improviser has in common. Reading someone else's transcription gives you the notes; doing it yourself by ear gives you their time feel, articulation, and thinking. At your level the goal is no longer licks. It is absorbing a complete musical mind.",
    ],
    sections: [
      {
        heading: "Method",
        body: [
          "Choose a solo you already half-sing along to; love carries you through the tedium. Use software that loops and slows without changing pitch. Work in 2-4 bar chunks: sing the phrase first, then find it on the guitar. If you cannot sing it, you have not heard it yet, and hunting frets is guessing.",
          "Get the rhythm before the pitches. Tap the phrase against the recording until placement is exact, then add notes. Most transcription errors are rhythmic, not melodic.",
        ],
      },
      {
        heading: "Beyond the notes",
        body: [
          "Match the physical choices: which string, which position, slide versus hammer-on, pick versus finger, where the vibrato starts and how wide it is. Two players can play identical pitches and sound nothing alike; the identity lives in articulation. Steal the fingering, not just the line.",
        ],
      },
      {
        heading: "From transcription to vocabulary",
        body: [
          "After the solo is performable at tempo with the recording, analyze it: label each phrase against the underlying chord, and find the three devices the player leans on hardest. Then transpose your two favorite phrases through all twelve keys and force them into your own solos over different tunes within the week. Unused transcriptions evaporate.",
        ],
      },
    ],
    practice: [
      "Pick one full solo by a player you love; commit to it for a month.",
      "Transcribe 2-4 bars per session: sing the phrase, tap its rhythm, then find it on the neck. Write it down or record it.",
      "Play each finished chunk along with the record at half speed, then full speed, matching articulation and vibrato exactly.",
      "Perform the entire solo with the recording, then alone with a backing track, from memory.",
      "Extract two phrases, run them through all 12 keys, and use each in an improvisation this week.",
    ],
    watchOut:
      "Grabbing a tab or notation instead of using your ears. The written notes are the least valuable part of a solo; the ear-training and feel-matching are the entire point of the exercise.",
  },

  "trn-pno-transcribe-masters": {
    intro: [
      "Transcription at the piano is harder than on any single-line instrument: you are pulling apart voicings, inner lines, and two independent hands at once. That is exactly why it is the fastest route to a great pianist's harmonic mind. Evans, Peterson, and Hancock all built their languages this way.",
    ],
    sections: [
      {
        heading: "Method: layers, not chunks only",
        body: [
          "Work in 2-4 bar chunks, but within each chunk transcribe in layers: right-hand melody first (sing it before you touch the keys), then bass notes, then the inner voices of each chord. For dense voicings, slow the recording to half speed; the top and bottom notes come first, then fill the middle by testing candidates against the record. If you cannot sing the melody line, loop it until you can.",
          "Nail rhythm before pitch. Jazz piano lives in placement: whether a comp stab lands on the and-of-2 or just behind it is the feel. Tap each hand's rhythm against the recording separately before assigning notes.",
        ],
      },
      {
        heading: "Voicings are the treasure",
        body: [
          "When you decode a voicing, name it: rootless left-hand shape, drop-2 spread, fourths stack, upper-structure triad over a shell. Write the formula (e.g. 3-5-7-9 under the melody), not just the notes, so you can move it to every key. One fully understood Evans voicing is worth fifty half-heard ones.",
        ],
      },
      {
        heading: "Absorb the touch",
        body: [
          "Match dynamics between the hands: most masters play the melody a full dynamic level above the accompaniment. Match pedaling by ear, note where lines are dry, and copy articulation: Peterson's even attack, Evans's overlapping legato, Monk's detached stabs. Play along with the record until you disappear into it.",
        ],
      },
    ],
    practice: [
      "Choose one full solo by a pianist you love and commit for a month.",
      "Per session, transcribe 2-4 bars in layers: melody, bass, inner voices. Verify each layer against the recording at half speed.",
      "Label every left-hand voicing with its formula and transpose your three favorites through all 12 keys.",
      "Play the completed solo along with the recording at full tempo, matching dynamics and pedaling.",
      "Perform it from memory over a backing track, then use two of its phrases in your own solo this week.",
    ],
    watchOut:
      "Settling for the right chord quality with the wrong voicing. 'Some Dm9' is not what Evans played; the exact stacking and spacing is the lesson, so keep digging until every inner note is confirmed.",
  },

  "trn-pno-orchestral": {
    intro: [
      "The piano's real identity is an orchestra with 88 seats. Advanced repertoire asks you to be conductor and every section at once: singing strings in one hand, timpani in the other, woodwind filigree on top. Command here means every layer has its own dynamic, articulation, and timbre simultaneously.",
    ],
    sections: [
      {
        heading: "Layered voicing",
        body: [
          "Practice three-layer texture deliberately: melody forte, bass mezzo-forte, inner accompaniment piano, all at once. The mechanism is arm weight distribution and finger speed: melody fingers strike faster into the key while accompaniment fingers stay close and slow. Drill it on a Chopin nocturne: the right hand alone often contains both the singing line and quiet inner notes, and they must live at different volumes within one hand.",
        ],
      },
      {
        heading: "Orchestral thinking",
        body: [
          "Assign every line an instrument and imitate its attack: cello lines get weight and overlapping legato, flute lines get light, fast attacks and taper, horn chords get a soft cushioned onset, timpani bass gets a deep strike released quickly into resonance. Liszt, Rachmaninoff, and Ravel wrote pianistically as orchestrators; playing their textures as undifferentiated 'piano sound' flattens the score. Decide the instrumentation bar by bar, in the score, in pencil.",
        ],
      },
      {
        heading: "Pedal as the string section",
        body: [
          "The damper pedal is your sustain and your blend. Master half and quarter pedal for controlled haze, flutter pedal to thin an accumulating wash without a dry gap, and una corda for a genuine timbre change rather than mere quiet. Legato pedaling (catch the new harmony just after the fingers play it) must be automatic; syncopated changes are the default, not the exception.",
        ],
      },
    ],
    practice: [
      "Play a C major scale in both hands with the right hand forte and the left hand pianissimo; swap; then put melody-forte against inner-piano within the right hand alone on a nocturne phrase.",
      "Take one page of your current advanced piece and pencil an orchestral instrument next to every line; play the page making each assignment audible.",
      "Drill flutter and half pedaling on a sustained fortissimo chord passage until you can thin the sound without silence.",
      "Record yourself playing one full section; listen only for layer balance and mark every spot where the accompaniment swallows the melody.",
      "Perform the complete piece for someone, with dynamics spanning true pianissimo to fortissimo, and get one piece of feedback on texture.",
    ],
    watchOut:
      "Practicing notes instead of balance. At this level wrong notes are rare but monochrome playing is common; if a recording of you cannot be 'orchestrated' by ear, the layers are not yet differentiated.",
  },
};
