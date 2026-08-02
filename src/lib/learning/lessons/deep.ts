import type { Lesson } from "./types";

export const DEEP_LESSONS: Record<string, Lesson> = {
  "dep-modes": {
    intro: [
      "The seven modes are not seven new scales to memorize. They are the one major scale you already know, started from each of its seven notes. What changes is which note feels like home, and that single shift gives you seven distinct moods from one set of notes.",
      "Once you hear modes as colors rather than fingerings, you can pick the exact flavor a chord or vamp calls for instead of defaulting to plain major or minor.",
    ],
    sections: [
      {
        heading: "One scale, seven starting points",
        body: [
          "Take C major: C D E F G A B. Start on D and treat D as home and you get D Dorian. Start on G and you get G Mixolydian. Same notes, different tonal center. The order is: Ionian (1), Dorian (2), Phrygian (3), Lydian (4), Mixolydian (5), Aeolian (6), Locrian (7).",
        ],
      },
      {
        heading: "Each mode by its characteristic note",
        body: [
          "The fastest way to own a mode is to compare it to plain major or minor and name the one note that defines it. Dorian is natural minor with a natural 6 (D Dorian: the B natural) - minor but hopeful, the sound of Santana and So What. Phrygian is natural minor with a b2 - dark, Spanish. Lydian is major with a #4 - floaty, film-score bright. Mixolydian is major with a b7 - bluesy, rock and roll dominant. Aeolian is natural minor itself. Locrian has b2 and b5 and is rarely a home key.",
          "On guitar, play an open D minor vamp and solo with the notes of C major - that is D Dorian. On piano, hold a D in the bass with your left hand and play white keys above it; then move the bass to E for Phrygian, F for Lydian, G for Mixolydian. Same white keys, completely different weather.",
        ],
      },
      {
        heading: "Modes need a drone or vamp",
        body: [
          "A mode only exists relative to a tonal center. Without a bass note or chord anchoring the root, D Dorian just sounds like C major. Always practice modes over a drone or a one-chord vamp on the mode's root.",
        ],
      },
    ],
    practice: [
      "Play or sustain a D drone, then play the C major scale from D to D. Sing the natural 6 (B) and notice how it brightens the minor sound.",
      "Repeat over an E drone (Phrygian), F drone (Lydian), and G drone (Mixolydian), naming each characteristic note out loud.",
      "Pick one mode per day this week and improvise two minutes over a one-chord vamp on its root.",
      "Write out D Dorian, G Mixolydian, and F Lydian as formulas relative to major (e.g. Dorian = 1 2 b3 4 5 6 b7).",
      "Find one real song per mode: Oye Como Va (Dorian), Sweet Home Alabama's riff (Mixolydian), the Simpsons theme (Lydian).",
    ],
    watchOut: "Running the mode as a scale exercise over no harmony - without a root drone or vamp underneath, every mode collapses back into its parent major scale and you learn nothing about its sound.",
  },

  "dep-secondary-dominants": {
    intro: [
      "Diatonic chords cover most songs, but the chords that make you sit up - the ones that pull hard somewhere unexpected - are usually secondary dominants or borrowed chords. These are the first controlled ways to leave the key without getting lost.",
      "After this topic you will spot that E7 in a key of C song and know exactly why it is there and where it is going.",
    ],
    sections: [
      {
        heading: "Secondary dominants: borrowing V's pull",
        body: [
          "A dominant 7 chord pulls to the chord a fifth below it: G7 wants C. A secondary dominant applies that pull to a chord other than the tonic. In C major, the ii chord is Dm; the chord a fifth above Dm is A, so A7 is V/ii (\"five of two\") and yanks the ear toward Dm. Likewise D7 is V/V (resolving to G), and E7 is V/vi (resolving to Am).",
          "The tell: a major or dominant chord built on a scale degree that should be minor. See A7, D7, or E7 in a key of C chart and check the next chord - it is almost always the target a fifth down.",
        ],
      },
      {
        heading: "Borrowed chords: raiding the parallel minor",
        body: [
          "The parallel minor of C major is C minor, and you can borrow its chords. The most common loans: iv (Fm), bVII (Bb), bVI (Ab), and bIII (Eb). The move IV to iv to I (F, Fm, C) is the classic bittersweet cadence in thousands of pop songs. bVII to I (Bb to C) is the rock cadence in Hey Jude's outro.",
        ],
      },
      {
        heading: "Try them on your instrument",
        body: [
          "Guitar: play C, A7, Dm, G7, C using open shapes - the A7 is one finger different from Am, and that one note (C#) creates all the pull. Piano: play C, then E7 with E-G#-B-D spread between hands, resolving G# up to A as you land on Am. Voice-lead the resolution and you will hear why it works.",
        ],
      },
    ],
    practice: [
      "In C, play I - V/ii - ii - V - I (C, A7, Dm, G7, C) until the A7 sounds inevitable rather than wrong.",
      "Play I - V/vi - vi (C, E7, Am), then transpose both exercises to G and F.",
      "Play C, F, Fm, C slowly and listen to the Ab in the Fm falling to G in the C chord.",
      "Take a four-chord song you know and insert one secondary dominant before a diatonic chord. Keep it if it improves the song.",
      "Find the borrowed or secondary chord in two songs you like and name it with Roman numerals.",
    ],
    watchOut: "Treating these chords as random spice - a secondary dominant must resolve to its target (a fifth down) or it just sounds like a wrong chord. Placement is the whole trick.",
  },

  "dep-extensions": {
    intro: [
      "Extensions are what separate a plain C chord from the lush chords you hear in jazz, neo-soul, and R&B. They are not exotic: a 9th is just the 2nd played an octave up, an 11th is the 4th, a 13th is the 6th. You keep stacking thirds past the 7th.",
      "Learn which extensions fit which chord qualities and you can thicken any progression on demand instead of guessing.",
    ],
    sections: [
      {
        heading: "The stack",
        body: [
          "Build C major up in thirds: C E G B D F A - that is 1 3 5 7 9 11 13. The 9th is D, the 11th is F, the 13th is A. Extensions assume the 7th is present: Cmaj9 contains the major 7 (B); C9 is a dominant chord containing Bb; Cadd9 skips the 7th entirely.",
        ],
      },
      {
        heading: "Which extensions fit which chords",
        body: [
          "Major 7 chords take 9 and 13 freely; the natural 11 clashes with the major 3rd (avoid it, or raise it to #11 for a Lydian sheen). Minor 7 chords take 9 and 11 happily - the 11 is the prettiest note on a minor chord. Dominant 7 chords take everything: 9, 13, and altered versions (b9, #9, b13) when resolving.",
        ],
      },
      {
        heading: "Voicing them without ten fingers",
        body: [
          "You do not play every note. Drop the 5th first, and often the root if a bass player or left hand covers it. Piano: for Cmaj9 play C in the left hand and E-G-B-D in the right; for a G13 play G-B in the left and F-A-E in the right (3, b7, 13, spread). Guitar: a movable m11 grip is x-5-5-5-3-3 for Am11; a 9th chord is the funk staple x-5-4-5-5-x for C9. Two or three carefully chosen upper notes beat six stacked ones.",
        ],
      },
    ],
    practice: [
      "Spell 1-3-5-7-9-11-13 from C, F, and G on paper until it takes seconds.",
      "Play a ii-V-I in C as Dm9, G13, Cmaj9, keeping the top note as smooth as possible between chords.",
      "Guitar: swap the plain chords of a song you know for m9 and maj9 grips; piano: do the same keeping roots in the left hand.",
      "Compare Cadd9, Cmaj9, and C9 back to back and describe the difference out loud.",
      "Voice one 13th chord (G13) three different ways and pick the one that sounds best in context.",
    ],
    watchOut: "Cramming every extension into one voicing - a muddy seven-note pileup. Pick one or two extensions, drop the 5th, and let the bass own the root.",
  },

  "dep-transposition": {
    intro: [
      "The singer says \"can we do it in Bb?\" and the room looks at you. Transposition is the ability to move a whole song to a new key instantly, and it is what makes you useful to vocalists, horn players, and capo-averse bandmates.",
      "The secret is that you stop thinking in chord names and start thinking in numbers. A I-V-vi-IV progression is the same object in every key.",
    ],
    sections: [
      {
        heading: "Numbers, not names",
        body: [
          "First convert the song to Roman numerals in its original key. G, D, Em, C in the key of G is I, V, vi, IV. Now the song is key-independent. To play it in Bb, spell Bb major (Bb C D Eb F G A) and read the numerals back off: Bb, F, Gm, Eb. Two steps, every time: numerals out, numerals in.",
        ],
      },
      {
        heading: "Interval shifting for speed",
        body: [
          "For quick shifts, move every chord by the same interval. Up a whole step from G takes G, D, Em, C to A, E, F#m, D. The circle of fifths helps you sanity-check: the new key's chords must all live in the new key signature.",
        ],
      },
      {
        heading: "Instrument shortcuts",
        body: [
          "Guitar: a capo transposes open shapes for you - capo 3 with G-shape fingerings sounds in Bb (count one semitone per fret up from the shape's key). Barre and CAGED shapes transpose by pure geometry: slide the whole shape the right number of frets. Piano has no capo, so pianists must actually think in the new key - practice the number method until the fingers follow. Knowing your scales in all 12 keys is the prerequisite.",
        ],
      },
    ],
    practice: [
      "Convert three songs you know into Roman numerals from memory.",
      "Take one of them through all 12 keys around the circle of fifths, one key per day if needed.",
      "Guitar: play the same song in C open position, then with capo 2, then as barre chords in D with no capo, and confirm they match.",
      "Piano: play a I-V-vi-IV loop in C, F, G, and Bb without writing anything down.",
      "Have someone call out random keys while you keep a four-chord song going, switching at the top of each cycle.",
    ],
    watchOut: "Transposing chord by chord with fret or key-count arithmetic mid-song. Convert to numerals first - one conversion, then you just play in the new key.",
  },

  "dep-ear-progressions": {
    intro: [
      "Transcription is the single highest-value practice habit there is: it trains your ear, your theory, and your instrument at once. The goal here is to hear a recording and write down its chords without an app or a chord chart.",
      "You do not need perfect pitch. You need relative pitch - hearing each chord's function against the key - and a repeatable process.",
    ],
    sections: [
      {
        heading: "Find the key, then the bass",
        body: [
          "First find the tonic: hum the note the song feels like it wants to end on, then find it on your instrument. Next, follow the bass line - the bass almost always plays chord roots. Loop four bars and match each bass note. Once you have roots in a known key, the chords are nearly decided: in C major, a bass A is almost certainly Am, a bass F is F.",
        ],
      },
      {
        heading: "Function before quality",
        body: [
          "Learn the sound of each numeral as a feeling: I is home, V is tension leaning home, vi is the sad cousin of I, IV lifts away from home. Most pop songs use I, IV, V, and vi plus the occasional ii or borrowed chord, so guess by function first, then verify by playing along. If a chord sounds brighter or darker than expected, check for major/minor quality or a 7th.",
        ],
      },
      {
        heading: "Tools and honesty",
        body: [
          "Slow the recording down (any player with 0.75x speed works) and loop small sections. Verify every guess by playing it against the track - your ear will immediately reject a wrong chord. Write down what you actually hear, not what a tab site claims; tabs are wrong constantly, and the whole point is building your own ear.",
        ],
      },
    ],
    practice: [
      "Pick a simple three or four-chord song. Find the key by humming the resolution note and locating it on your instrument.",
      "Transcribe the bass roots of one verse and chorus, writing them as note names.",
      "Convert the roots to Roman numerals, guess each chord quality by function, and verify by playing along.",
      "Transcribe one new song per week, gradually choosing songs with more chords.",
      "Once chords feel manageable, transcribe a four-bar vocal melody note for note.",
    ],
    watchOut: "Reaching for a chord app or tab site the moment you get stuck. Struggling for a minute and then verifying is the exercise - outsourcing the answer skips the training entirely.",
  },

  "dep-improv": {
    intro: [
      "Improvisation is not playing whatever comes to mind - it is real-time composition with a small set of learnable skills: targeting chord tones, shaping phrases, and developing motifs. Scale knowledge is the alphabet; this topic is learning to write sentences.",
      "The checkpoint that matters: your solo should outline the chords so clearly that someone could guess the progression from your single-note line alone.",
    ],
    sections: [
      {
        heading: "Target tones: play the changes",
        body: [
          "Chord tones (root, 3rd, 5th, 7th) are consonant against their chord; other scale notes are passing color. The core skill is landing on a chord tone - especially the 3rd - on beat one of each chord change. Over C to Am to F to G, that could mean landing E, then C, then A, then B. Everything between those landings is connective tissue.",
        ],
      },
      {
        heading: "Phrasing: play like you talk",
        body: [
          "Speech has phrases and pauses; solos should too. Play a short idea (two bars or less), then rest for at least as long as you played. The rests are where the listener digests and where you plan. A solo with space sounds confident; nonstop notes sound nervous.",
        ],
      },
      {
        heading: "Motifs: say it again, differently",
        body: [
          "Take a three-to-five note idea and repeat it with one change: shift its rhythm, move it up a third, start it a beat later, invert its shape. Three variations of one motif are more musical than ten unrelated licks. This is how memorable solos are built, from B.B. King to horn players to film themes.",
        ],
      },
    ],
    practice: [
      "Over a looped C - Am - F - G backing track, play only chord roots in whole notes, changing exactly with the chords.",
      "Repeat playing only 3rds, then mix roots, 3rds, and 5ths - still one note per chord.",
      "Improvise freely but force a landing on a chord tone at every chord change.",
      "Play a two-bar phrase, rest two bars, repeat for the whole track - no exceptions.",
      "Invent a four-note motif and build an entire chorus from variations of it alone.",
      "Record one solo per week and listen back, noting where you drifted from the changes.",
    ],
    watchOut: "Running the key's scale up and down over every chord. It never clashes, but it never says anything - if your line ignores the chord changes, it is a scale exercise, not a solo.",
  },

  "dep-gtr-caged": {
    intro: [
      "CAGED is the map that turns the fretboard from a mystery into a grid. The insight: every major chord on the guitar is one of just five open shapes - C, A, G, E, D - moved up the neck, and those five shapes tile the entire fretboard in a fixed, repeating order.",
      "Once you own it, any chord lives in five places, every scale connects to a shape you can see, and position playing stops being guesswork.",
    ],
    sections: [
      {
        heading: "Five shapes, one chord",
        body: [
          "Take a C major chord. In open position it is the C shape. Barre at fret 3 with an A shape (x-3-5-5-5-3): still C. Barre at fret 5 with a G shape fragment, fret 8 with an E shape (8-10-10-9-8-8), fret 10 with a D shape (x-x-10-12-13-12): all C major. The shapes always appear in the order C-A-G-E-D as you move up the neck, then the cycle repeats an octave higher.",
        ],
      },
      {
        heading: "How the shapes connect",
        body: [
          "Each shape shares an edge with the next: the top of the C shape is the bottom of the A shape, the top of the A shape is the bottom of the G shape, and so on. The linking landmarks are the root notes. Learn where the roots sit inside each shape (C shape: roots on strings 5 and 2; A shape: strings 5 and 3; G shape: strings 6, 3, and 1; E shape: strings 6, 4, and 1; D shape: strings 4 and 2) and you can always find the next shape up the neck.",
        ],
      },
      {
        heading: "It is more than chords",
        body: [
          "Each chord shape carries a scale pattern and arpeggio around it. Solo out of the E shape at fret 8 for C and your bends land on chord tones you can see. This is the real payoff: chords, arpeggios, and scales become one picture instead of three.",
        ],
      },
    ],
    practice: [
      "Play C major in all five shapes up the neck, in order, naming each shape out loud. Strings that will not ring in a full barre may be omitted - prioritize clean root-position fragments.",
      "Do the same for G major and E major, noticing the cycle starts from a different shape.",
      "For each shape, tap only the root notes inside it and say the note name.",
      "Pick a random chord and a random neck region (frets 5-9) and find the chord there within five seconds.",
      "Play a I-IV-V progression (G, C, D) entirely between frets 3 and 7 using whatever shapes fit.",
    ],
    watchOut: "Memorizing the five grips without learning where the roots are inside each shape. The roots are the map; the shapes without them are just five disconnected chord fingerings.",
  },

  "dep-gtr-scale-positions": {
    intro: [
      "You know the major scale in one box. This topic breaks you out of it: the scale exists everywhere on the neck, and fluency means starting from any note, in any region, and moving horizontally as freely as vertically.",
      "This is what lets you play the melody you hear instead of the lick your box position permits.",
    ],
    sections: [
      {
        heading: "The five positions",
        body: [
          "The major scale falls into five overlapping position patterns, one wrapped around each CAGED chord shape. For C major: position 1 sits around the open C shape (frets 0-3), position 2 around the A shape (frets 2-5), then the G shape (frets 4-8), E shape (frets 7-10), and D shape (frets 9-13). Adjacent positions share two frets of overlap - the shared notes are your bridges between boxes.",
        ],
      },
      {
        heading: "Three-notes-per-string",
        body: [
          "The alternative layout puts exactly three scale notes on every string, giving seven longer, symmetrical patterns that cover more neck per position and suit fast alternate-picked or legato lines. For C major starting at fret 7 on the low E: 7-8-10, 7-8-10, 7-9-10, 7-9-10, 8-10-12, 8-10-12. Learn both systems - CAGED positions for seeing chords inside the scale, 3nps for speed and reach.",
        ],
      },
      {
        heading: "Connecting, not collecting",
        body: [
          "Positions are only useful once you can leave them. Practice shifting along a single string (play the whole scale on the B string alone), and practice diagonal runs that climb through two or three positions using slides on the G and B strings. The neck is one scale, not five.",
        ],
      },
    ],
    practice: [
      "Play C major in all five CAGED positions, ascending and descending, with a metronome at 60 bpm.",
      "Play C major on one string at a time, saying note names, for all six strings.",
      "Run a diagonal: start at fret 3 on the low E and end at fret 12 on the high E, sliding between positions.",
      "Repeat the five positions in G and D major - the shapes are identical, only shifted.",
      "Improvise over a backing track for two minutes while deliberately crossing at least three positions.",
    ],
    watchOut: "Practicing every position from its lowest note up, which glues your ear to patterns instead of the scale. Start runs from the root, and from random scale notes, so you learn notes rather than box rituals.",
  },

  "dep-gtr-fingerstyle": {
    intro: [
      "Travis picking is the engine behind Dust in the Wind, Landslide, and most fingerstyle accompaniment: the thumb plays a steady alternating bass like a metronome while the fingers add melody and fills on top. One guitar starts sounding like two.",
      "The entire skill is thumb independence. Once the thumb runs on autopilot, everything above it is freedom.",
    ],
    sections: [
      {
        heading: "The thumb is the drummer",
        body: [
          "Assign the thumb (p) to strings 6, 5, and 4; index (i) to string 3, middle (m) to string 2, ring (a) to string 1. On a C chord, the thumb alternates string 5 and string 4 in steady quarter notes: C, E, C, E. On G it alternates 6 and 4; on Am, 5 and 4. Practice thumb alone until you can hold a conversation while it keeps going.",
        ],
      },
      {
        heading: "Layering the fingers",
        body: [
          "Add fingers against the thumb in stages. Stage one: pinch - thumb and middle strike together on beat 1. Stage two: place finger notes on the off-beats, between thumb hits. The classic Travis pattern on C, counted in eighths: beat 1 thumb (5th string) with middle (1st or 2nd string) together, and of 1 index, beat 2 thumb (4th), and of 2 middle, beat 3 thumb (5th), and of 3 index, beat 4 thumb (4th), and of 4 middle. Slow is non-negotiable here.",
        ],
      },
      {
        heading: "From pattern to music",
        body: [
          "Once one pattern is automatic on C, Am, F, and G, stop thinking pattern and start thinking melody: let the top finger notes trace the vocal line while the thumb walks between chords with passing bass notes. Slight palm mute on the bass strings keeps the thumb from swamping the melody.",
        ],
      },
    ],
    practice: [
      "Thumb only: alternate bass on C, Am, F, G, one minute per chord, with a metronome at 60 bpm.",
      "Add the beat-1 pinch on every chord until switching chords does not interrupt the thumb.",
      "Learn the full eight-note Travis pattern on C at 50 bpm, then bring it to 80 bpm over a week.",
      "Run the pattern through a full C - Am - F - G progression, changing chords without dropping a thumb beat.",
      "Learn the intro to a real Travis-picked song and play it along with the recording.",
    ],
    watchOut: "Speeding up before the thumb is truly automatic. If the bass hesitates whenever a finger plays, drop the tempo until the thumb never flinches - a wobbly thumb ruins every pattern built on it.",
  },

  "dep-gtr-bending": {
    intro: [
      "Bending and vibrato are why the guitar can sound like a human voice, and they are the most honest test of a lead player: everyone can hear a sour bend. Pitch accuracy here is not a style choice - it is the difference between singing and screeching.",
      "The good news: bending in tune is completely trainable, because the target pitch is always sitting two frets away for you to check.",
    ],
    sections: [
      {
        heading: "Mechanics that make bending easy",
        body: [
          "Bend with wrist rotation, not finger strength - turn the wrist like turning a door key while the fingers stay firm. Use the ring finger for most bends, with the middle and index fingers on the same string behind it, pushing together. Push upward (toward the ceiling) on strings 3, 2, and 1; pull downward on the wound strings. Let the thumb hook over the top of the neck for leverage.",
        ],
      },
      {
        heading: "Tune every bend",
        body: [
          "A whole-step bend must land exactly on the pitch two frets up. Calibrate constantly: play fret 9 on the G string, then bend fret 7 until the pitches match. Do the same for half-step (one fret) and, later, step-and-a-half bends. Also practice the release - lowering back to the starting pitch in tune - and pre-bends, where you bend silently first and strike the string already at the target pitch.",
        ],
      },
      {
        heading: "Vibrato is rhythm, not nerves",
        body: [
          "Good vibrato is a controlled, even pulse of small bends, not a shiver. Practice it in time: bend slightly up and back on eighth-note pulses at 60 bpm, then sixteenths. Keep the motion from the wrist, return fully to pitch on every cycle, and only then vary speed and width for expression. Wide and slow sounds vocal; fast and narrow sounds nervous - choose deliberately.",
        ],
      },
    ],
    practice: [
      "On the G string fret 7, play fret 9 as a reference, then bend fret 7 up a whole step to match. Ten slow reps, listening hard.",
      "Repeat with half-step bends (target one fret up) on the B string at fret 8.",
      "Practice release bends and pre-bends against the same fretted targets.",
      "Metronome vibrato: even pulses on a held note at 60 bpm eighths for one minute, then sixteenths.",
      "Play a lick you know and check every bend in it against its fretted target pitch.",
      "Record 12 bars of blues soloing and listen back only for bend intonation.",
    ],
    watchOut: "Bending with finger strength alone and stopping short of the target pitch. Almost every out-of-tune bend is flat - rotate the wrist, stack three fingers, and always verify against the fretted note.",
  },

  "dep-gtr-alt-picking": {
    intro: [
      "Alternate picking - strict down-up on every note - is the motor skill that unlocks tempo. Without it you hit a hard ceiling; with it, speed becomes a patient, measurable climb instead of a wall.",
      "The counterintuitive truth: speed is a byproduct of relaxation and small motions, not effort. Tension is the enemy at every tempo.",
    ],
    sections: [
      {
        heading: "The motion",
        body: [
          "Hold the pick firmly but not tightly, with just 1-2 mm of tip showing past your thumb. The motion comes from the wrist (or forearm rotation), never from clenching the elbow or thumb joint alone. Keep the pick stroke tiny - the pick should barely clear the string. Anchor lightly: many players rest the palm edge near the bridge for a stable reference point.",
        ],
      },
      {
        heading: "Strict alternation, even across strings",
        body: [
          "The rule is mechanical: downstroke, upstroke, forever, regardless of string changes. This means sometimes crossing to a new string with an \"outside\" or \"inside\" stroke that feels awkward - practice both instead of cheating with an extra downstroke. Cheating feels faster today and caps you permanently.",
        ],
      },
      {
        heading: "The metronome protocol",
        body: [
          "Find your clean tempo: the fastest speed at which a passage is perfect and relaxed. Practice there, not above it. Raise the metronome 4 bpm only when three consecutive perfect repetitions happen. If tension creeps into your hand, forearm, or shoulder, you are over your limit - drop 10 bpm. Also practice short bursts: four fast notes then stop, teaching the hands what the target speed feels like without sustained strain.",
        ],
      },
    ],
    practice: [
      "One minute of down-up on a single open string at 60 bpm sixteenths, monitoring for tension from fingers to shoulder.",
      "Play a chromatic 1-2-3-4 pattern across all six strings, strictly alternated, at your clean tempo.",
      "Run a three-note-per-string C major scale with strict alternation - it forces both outside and inside string crossings.",
      "Apply the +4 bpm protocol to one chosen lick for two weeks and log the tempo daily.",
      "Do burst training: four sixteenths at 120 bpm, rest a beat, repeat ten times.",
    ],
    watchOut: "Practicing above your clean tempo. Sloppy fast reps program sloppy motion permanently - the players who get fast are the ones patient enough to stay clean and add 4 bpm at a time.",
  },

  "dep-pno-shell-voicings": {
    intro: [
      "Shell voicings are the minimum viable jazz chord: just the root, 3rd, and 7th. Those two upper notes define a chord's entire quality - major 7, minor 7, or dominant - so shells let you play convincing changes with three fingers and almost no hand movement.",
      "This is the entry point to comping: accompanying a melody, singer, or soloist with rhythm and harmony instead of written notes.",
    ],
    sections: [
      {
        heading: "Spelling shells for the ii-V-I",
        body: [
          "In C major the ii-V-I is Dm7, G7, Cmaj7. Type A shells (root, 3, 7): Dm7 = D-F-C, G7 = G-B-F, Cmaj7 = C-E-B. Type B shells (root, 7, 3, with the 3rd on top): Dm7 = D-C-F, G7 = G-F-B, Cmaj7 = C-B-E. Play root with finger 5 in the left hand, the two upper notes with fingers 2 and 1.",
        ],
      },
      {
        heading: "Why alternating A and B is magic",
        body: [
          "Alternate shell types through the progression and the voice leading becomes nearly effortless: play Dm7 as D-F-C, then G7 as G-F-B - the C drops a half step to B while F holds. Then Cmaj7 as C-E-B: F falls to E, B holds. Each chord change moves one note by a half step or keeps it. This is voice leading, and it is why pros sound smooth while beginners leap around.",
        ],
      },
      {
        heading: "Comping is rhythm",
        body: [
          "Once shells are automatic, the job becomes rhythmic. Do not hold whole notes: place short, syncopated stabs - the Charleston rhythm (beat 1, then the and of 2) is the classic starting pattern. Left hand plays shells while the right hand plays melody, or shells split between hands (root in left, 3-7 in right) under a soloist. Listen and leave space; comping means complementing.",
        ],
      },
    ],
    practice: [
      "Play the ii-V-I in C with A-then-B-then-A shells, hands separately, until the half-step moves are automatic.",
      "Take the ii-V-I through the circle of fifths: C, F, Bb, Eb, one new key per day.",
      "Play a full 12-bar blues in F using only shells (F7, Bb7, C7).",
      "Comp the C ii-V-I in Charleston rhythm with a metronome at 80 bpm, two beats per chord.",
      "Play a simple melody in the right hand over left-hand shells for one full tune.",
    ],
    watchOut: "Jumping both upper voices to the next chord's root-position shell instead of alternating A and B types. If your hand leaps more than a step between chords, you are ignoring the voice leading that makes shells work.",
  },

  "dep-pno-sight-reading": {
    intro: [
      "Sight reading is what turns the entire written repertoire into an open library: hand someone fluent a piece and they simply play it. It is not a gift - it is a trainable skill with clear rules, and the biggest one is counterintuitive: never stop.",
      "The standard is reading both staves in real time at a steady tempo, mistakes and all, the way you read this sentence without sounding out letters.",
    ],
    sections: [
      {
        heading: "The prime directive: keep going",
        body: [
          "In sight reading, rhythm outranks pitch. A wrong note in time is a blemish; a stop to fix it destroys the music. Set a slow tempo, and when you fumble, drop the notes and rejoin at the next beat. This single habit - trained until it is reflex - is most of the skill. Practicing it means using material easy enough that you rarely fumble: two levels below your repertoire pieces.",
        ],
      },
      {
        heading: "Read shapes and intervals, not note names",
        body: [
          "Fluent readers do not name every note; they read intervals and contours - up a third, down a step, same note - the way word readers see whole words. Anchor a few landmark notes (middle C, treble G, bass F) and read everything else relative to them. Read chords bottom to top as stacked shapes: a snowman of thirds is a triad, whatever its letters.",
        ],
      },
      {
        heading: "Scan before you play, look ahead while you play",
        body: [
          "Before starting, take 30 seconds: key signature, time signature, hairiest rhythm, biggest hand shift, and where patterns repeat. While playing, keep your eyes one beat ahead of your hands and off the keyboard - trust your hands to find keys by feel. Reading the note you are currently playing is already too late.",
        ],
      },
    ],
    practice: [
      "Sight-read two short pieces daily at two difficulty levels below your repertoire - fresh material every day, never repeats.",
      "Set a metronome at 60 bpm and play a new easy piece straight through, forbidding yourself to stop or correct.",
      "Do 10 flash drills: look at a bar, look away, play it from memory - this forces reading ahead.",
      "Read one hymn or chorale per day for chord-shape reading, both staves.",
      "Once a week, sight-read a duet part with a partner or along with a recording, where stopping is impossible.",
    ],
    watchOut: "Stopping to fix wrong notes. Every stop practices stopping - keep the pulse, drop notes when you must, and rejoin at the next beat, because steady and imperfect always beats accurate and halting.",
  },

  "dep-pno-technique": {
    intro: [
      "This is the tier where technique stops being about single notes and starts being about textures: octaves, double thirds, trills, and complete command of the minor scale and arpeggio system. It is the physical vocabulary that advanced repertoire assumes you already have.",
      "The theme throughout is economy: loose wrists, small motions, and fingerings so ingrained they never require thought.",
    ],
    sections: [
      {
        heading: "The three minors, fingered",
        body: [
          "Every minor key has three scale forms. Natural minor uses the key signature as-is (A minor: A B C D E F G). Harmonic minor raises the 7th (G#), creating the exotic step-and-a-half gap from F to G#. Melodic minor raises 6 and 7 ascending (F#, G#) and reverts to natural minor descending. Fingering for A, D, and E minor matches their majors: RH 1-2-3-1-2-3-4-5, LH 5-4-3-2-1-3-2-1. Practice all three forms in every key, hands together, two octaves, aiming for perfect evenness rather than speed.",
        ],
      },
      {
        heading: "Octaves and thirds",
        body: [
          "Octaves come from the wrist, not the arm: fingers 1 and 5 form a fixed arch (use 4 on black keys for legato), and the wrist bounces lightly while the forearm floats. Practice slow staccato octave scales, wrist loose enough that the hand rebounds by itself. Double thirds are a finger-independence problem: RH C major in thirds uses 1-3, 2-4, 3-5 combinations, and both notes must strike exactly together. Practice hands separately, slowly, listening for one attack, not two.",
        ],
      },
      {
        heading: "Trills and seventh-chord arpeggios",
        body: [
          "Trills are fast, relaxed alternation - practice in measured bursts (four notes, then eight, then sixteen per beat) with fingers 1-3 and 2-3, not just 2-3. Keep the unused fingers quietly resting, not flying. Seventh-chord arpeggios (Cmaj7: C-E-G-B, and dominant and m7 forms) use RH 1-2-3-4 crossing to 1; practice them in all keys, two octaves, because they are how romantic and jazz-influenced repertoire actually moves up the keyboard.",
        ],
      },
    ],
    practice: [
      "Daily scale rotation: one key per day, all three minor forms, two octaves hands together at 60 bpm sixteenths.",
      "Staccato octave scales in C and A minor, wrist-driven, one minute per hand.",
      "C major in double thirds, right hand alone, ten slow perfect reps listening for a single attack.",
      "Measured trill bursts on C-D with fingers 1-3, then 2-3: quarter, eighth, sixteenth subdivisions at 60 bpm.",
      "Seventh-chord arpeggios (maj7, 7, m7) from three roots per day, two octaves hands together.",
      "End each session by playing one scale or arpeggio at half speed with deliberately loose wrists as a tension check.",
    ],
    watchOut: "Muscling through octaves and trills with a locked wrist and raised shoulder. Tension is cumulative and eventually injurious - if anything hurts or tightens, stop, slow down, and rebuild the motion loose.",
  },
};
