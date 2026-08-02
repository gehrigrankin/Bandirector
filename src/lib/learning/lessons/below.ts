import type { Lesson } from "./types";

export const BELOW_LESSONS: Record<string, Lesson> = {
  "blw-circle-of-fifths": {
    intro: [
      "The circle of fifths is the map of all twelve keys. Once you can walk it, you can read any key signature at a glance, find the chords that belong to a key, and see why some keys feel close together and others feel distant.",
    ],
    sections: [
      {
        heading: "Walking the circle",
        body: [
          "Start at C at the top and go clockwise, moving up a perfect fifth each time: C, G, D, A, E, B, F#, C#. Going counterclockwise from C moves in fourths (down a fifth): F, Bb, Eb, Ab, Db, Gb. The sharp side and the flat side meet at the bottom, where F#/Gb and C#/Db are the same keys spelled two ways.",
          "Memorize it as two runs: clockwise C-G-D-A-E-B-F#, counterclockwise C-F-Bb-Eb-Ab-Db-Gb.",
        ],
      },
      {
        heading: "Reading key signatures off it",
        body: [
          "Each clockwise step adds one sharp: C has none, G has one, D has two, A has three, and so on. Each counterclockwise step adds one flat: F has one, Bb has two, Eb has three. The sharps themselves also arrive in fifths: F#, C#, G#, D#, A#, E#, B#. Flats arrive in fourths: Bb, Eb, Ab, Db, Gb, Cb, Fb.",
          "So the key of A (three steps clockwise) has three sharps: F#, C#, G#. The key of Eb (three steps counterclockwise) has three flats: Bb, Eb, Ab.",
        ],
      },
      {
        heading: "Finding a key's chords",
        body: [
          "Any key's most important chords sit next to it on the circle. Take the key, its clockwise neighbor, and its counterclockwise neighbor: those are I, V, and IV. For G major that is G (I), D (V), and C (IV). The relative minor (vi) sits just inside the circle: E minor for G major.",
        ],
      },
    ],
    practice: [
      "Draw the full circle from memory on paper, both directions, three days in a row.",
      "Pick a random key each day and write out its key signature without looking, then check it against the circle.",
      "For C, G, D, and F, name the I, IV, V, and vi chords using neighbors on the circle, then play them on your instrument.",
      "Play I-IV-V-I in G, then move one step clockwise to D and play it again. Notice only one note changed in the key.",
    ],
    watchOut:
      "Memorizing the circle as a picture without using it. If you cannot answer 'what is the V of E?' in two seconds, keep drilling with your instrument in hand.",
  },

  "blw-diatonic-chords": {
    intro: [
      "Every major key contains exactly seven chords, built from its own notes. Learn the pattern once and you know the chords of all twelve keys. This is also how musicians talk to each other: 'it's a one-five-six-four in G' describes thousands of songs in one sentence.",
    ],
    sections: [
      {
        heading: "Building the seven chords in C",
        body: [
          "Take the C major scale: C D E F G A B. Build a chord on each note by stacking every other scale note. You get C (C-E-G), Dm (D-F-A), Em (E-G-B), F (F-A-C), G (G-B-D), Am (A-C-E), and B diminished (B-D-F).",
          "The qualities always come out the same in every major key: major, minor, minor, major, major, minor, diminished.",
        ],
      },
      {
        heading: "Roman numerals",
        body: [
          "Write those chords as I ii iii IV V vi vii deg. Uppercase means major, lowercase means minor, the small circle means diminished. In C: I=C, ii=Dm, iii=Em, IV=F, V=G, vi=Am, vii deg=Bdim. In G: I=G, ii=Am, iii=Bm, IV=C, V=D, vi=Em, vii deg=F#dim.",
          "Numerals are key-independent. A I-vi-IV-V is C-Am-F-G in C and G-Em-C-D in G, same song, different key.",
        ],
      },
      {
        heading: "On your instrument",
        body: [
          "Guitar: in G, all seven chords are playable with shapes you know: G, Am, Bm (barre), C, D, Em; skip the diminished for now. Piano: play the C scale in the left hand while the right hand builds a triad on each note, white keys only, and say the numeral out loud.",
        ],
      },
    ],
    practice: [
      "Write out the seven diatonic chords of C, G, D, and F on paper, with numerals and qualities.",
      "Play I through vi in C, in order, saying each numeral aloud as you land on it.",
      "Take a song you know and label each of its chords with a numeral in its key.",
      "Given 'vi-IV-I-V in G' name the chords (Em-C-G-D), then play it in time at 70 bpm.",
    ],
    watchOut:
      "Forgetting the qualities are baked in. The ii chord is minor, always; playing D major as the two chord in C is the number one giveaway that someone learned numerals halfway.",
  },

  "blw-progressions": {
    intro: [
      "A handful of progressions power most of popular music. Learn them by numeral and by sound, and new songs stop being lists of chords and start being patterns you already know.",
    ],
    sections: [
      {
        heading: "I-V-vi-IV: the pop workhorse",
        body: [
          "In C: C-G-Am-F. In G: G-D-Em-C. It works because it starts home (I), builds tension (V), softens into the sad relative (vi), and lands on the warm IV that pulls back to I. Rotate it to vi-IV-I-V and you get the melancholy version used in countless ballads.",
        ],
      },
      {
        heading: "ii-V-I: the jazz engine",
        body: [
          "In C: Dm-G-C. Each root falls a fifth, the strongest motion in harmony, so it sounds like an arrow pointing home. Jazz tunes chain ii-V-Is through several keys; hearing this cell instantly is a core skill.",
        ],
      },
      {
        heading: "The 12-bar blues",
        body: [
          "Twelve bars using I, IV, and V, usually as dominant 7ths. In A: four bars of A7, two of D7, two of A7, one of E7, one of D7, then A7 and a final bar of E7 (the turnaround). Count the bars out loud until the form is automatic; the whole blues and early rock catalog sits on it.",
        ],
      },
    ],
    practice: [
      "Play I-V-vi-IV in C and in G at 70 bpm, one chord per bar, four times through without stopping.",
      "Play ii-V-I in C (Dm-G-C) and in F (Gm-C-F), two beats per chord.",
      "Set a metronome to 80 bpm and play a full 12-bar blues in A, counting bar numbers out loud.",
      "Put on three songs you like and try to identify which of these progressions each uses.",
    ],
    watchOut:
      "Learning progressions only in one key. If you can only play the blues in A, you know a fingering, not a progression; do everything in at least two keys.",
  },

  "blw-seventh-chords": {
    intro: [
      "Add one more note to a triad and you get a seventh chord, the difference between a plain sound and a rich one. Three flavors cover most music: major 7, minor 7, and dominant 7, and each has a fixed home inside a key.",
    ],
    sections: [
      {
        heading: "The three flavors",
        body: [
          "Start with a major triad and add the 7th scale note: Cmaj7 is C-E-G-B, dreamy and soft. Lower that top note a half step and you get C7 (C-E-G-Bb), the dominant 7th: bluesy, tense, wanting to resolve. Start from a minor triad and add the lowered 7th: Cm7 is C-Eb-G-Bb, mellow and smooth.",
        ],
      },
      {
        heading: "Where they live in a key",
        body: [
          "Stack sevenths on every diatonic chord and the qualities are fixed: Imaj7, ii m7, iii m7, IVmaj7, V7, vi m7, vii m7b5. In C: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7b5. Note that the dominant 7th appears in exactly one place, on V, which is why hearing a 7 chord tells your ear where home is.",
        ],
      },
      {
        heading: "On guitar and piano",
        body: [
          "Guitar: turn open A into Amaj7 by moving the note on the G string from fret 2 to fret 1; Am to Am7 by lifting your ring finger off the G string; E to E7 by lifting your ring finger off the D string. Piano: play C-E-G with fingers 1-2-3 and add B with 5 for Cmaj7, then lower B to Bb for C7, then also lower E to Eb for Cm7. Hear the three colors side by side.",
        ],
      },
    ],
    practice: [
      "On one root (C), play maj7, then dominant 7, then m7, naming the notes aloud each time.",
      "Do the same from G and F as roots, spelling each chord on paper first.",
      "Play the full diatonic seventh sequence in C from Imaj7 up to vii m7b5, one chord per beat at 60 bpm.",
      "Play a ii-V-I in C as Dm7-G7-Cmaj7 and listen for how much stronger the pull is than plain triads.",
    ],
    watchOut:
      "Confusing 'C7' with 'Cmaj7'. A plain 7 always means dominant, with the lowered seventh; maj7 is a different chord and swapping them sounds obviously wrong.",
  },

  "blw-ear-basics": {
    intro: [
      "Your ear is the instrument behind the instrument. A few minutes of daily training lets you tell major from minor instantly, sing what you hear, and eventually pull songs off recordings without searching for tabs or sheet music.",
    ],
    sections: [
      {
        heading: "Major vs minor",
        body: [
          "Play a C major chord, then C minor (lower the E to Eb on piano; on guitar compare open A major to A minor). Major sounds bright or resolved; minor sounds dark or sad. Do this every day until the difference is as obvious as red versus blue. Then have a friend or an app quiz you blind.",
        ],
      },
      {
        heading: "Matching pitch",
        body: [
          "Play a single note in your singing range and sing it back on 'ah'. If you are off, slide your voice until the two sound like one fatter note; that beating-then-locking sensation is what in tune feels like. Pitch matching is the foundation of every other ear skill.",
        ],
      },
      {
        heading: "Intervals with song anchors",
        body: [
          "Learn intervals by attaching each to a melody you know cold. Major 3rd: the first two notes of 'Oh When the Saints'. Perfect 4th: 'Here Comes the Bride'. Perfect 5th: the Star Wars theme. Octave: 'Somewhere Over the Rainbow'. Minor 3rd: 'Greensleeves'. Sing the anchor, then sing just the two notes, then find them on your instrument.",
        ],
      },
    ],
    practice: [
      "Daily for one week: play five random chords, eyes closed after striking, and call major or minor before looking.",
      "Play a random note, sing it, then check yourself by playing it again. Ten notes a day.",
      "Sing a perfect 5th up from three different starting notes, verifying each against your instrument.",
      "Play the first note of a simple melody you know (like Happy Birthday) and work out the rest entirely by ear.",
    ],
    watchOut:
      "Testing without singing. Passive listening quizzes plateau fast; singing the notes back is what actually wires your ear, even if your voice is rough.",
  },

  "blw-gtr-barre": {
    intro: [
      "Barre chords unlock the whole neck: one shape, twelve keys. They are also the first real physical hurdle on guitar, so expect a couple of weeks of ugly before it gets easy. Every guitarist you admire went through the same wall.",
    ],
    sections: [
      {
        heading: "The E-shape barre, finger by finger",
        body: [
          "Take an open E major chord but play it with fingers 2, 3, 4 instead of 1, 2, 3: middle finger on the G string fret 1, ring on the A string fret 2, pinky on the D string fret 2. Now slide everything up one fret and lay your index finger flat across all six strings at fret 1. That is F major. Slide the whole thing to fret 3 and it is G; fret 5 is A. The low E string names the chord.",
        ],
      },
      {
        heading: "Making the barre actually sound",
        body: [
          "Roll the index finger slightly onto its bony outer edge rather than the soft pad, and place it right behind the fret wire, not in the middle of the fret. Squeeze less than you think: the real leverage comes from pulling back lightly with your arm while the thumb sits low, centered on the back of the neck, roughly opposite your index finger.",
        ],
      },
      {
        heading: "The A-shape, and minor versions",
        body: [
          "Barre fret 2 across strings A through high E and grab frets 4-4-4 on the D, G, and B strings with fingers 2, 3, 4 (or one ring-finger mini barre): that is B major, the A-shape, named by the A string. For minors, the E-shape drops the middle finger's note by a half step (barre plus fingers 3 and 4 only, an Em shape); the A-shape minor uses a barre with fingers 2, 3, 4 in an Am shape.",
        ],
      },
    ],
    practice: [
      "Play the E-shape barre at fret 5 (A major, where the strings are slack and the frets close) and pick each string one at a time, fixing any dead note before strumming.",
      "Do that string-by-string check daily, moving one fret closer to the nut each day until F at fret 1 rings clean.",
      "Set a metronome to 60 bpm and switch between open C and F barre, one bar each, for two minutes.",
      "Play G-Em-C-D using only barre shapes, four beats each, then the same progression starting at different frets to transpose it.",
    ],
    watchOut:
      "Death-gripping with the thumb. If your hand cramps in thirty seconds, the problem is squeeze, not strength; fix the index-finger edge and thumb position instead of pressing harder.",
  },

  "blw-gtr-power-chords": {
    intro: [
      "Power chords are the sound of rock: two or three notes, one movable shape, neither major nor minor, so they fit almost anywhere. Add palm muting and you control the dynamic engine of a whole band's rhythm section.",
    ],
    sections: [
      {
        heading: "The shape",
        body: [
          "Index finger on the low E string, ring finger two frets up on the A string, pinky next to the ring on the D string. At fret 3 that is G5: G, D, and G again. The same shape rooted on the A string at fret 3 gives C5. That is the entire system; the root note under your index finger names every chord.",
          "Let only those strings sound: lightly touch the unused strings with the underside of your index finger so accidental strums stay quiet.",
        ],
      },
      {
        heading: "Palm muting",
        body: [
          "Rest the pinky-side edge of your picking palm on the strings right where they meet the bridge, then pick. You should hear a tight chug with pitch still audible. Too far forward and the notes choke to clicks; too far back and nothing mutes. Slide your palm until you find the sweet spot, and remember it.",
        ],
      },
      {
        heading: "Dynamics as a tool",
        body: [
          "The classic rock move: palm-muted eighth notes in the verse, then lift the palm for the chorus so the same chords explode open. Practice toggling the mute on and off without breaking your down-picking rhythm; that lift IS the chorus.",
        ],
      },
    ],
    practice: [
      "Play G5, Bb5, C5 (frets 3, 6, 8 on the low E string), four downstrokes each, at 80 bpm.",
      "Palm-mute a single G5 with steady eighth-note downstrokes for one minute, keeping every chug even.",
      "Play two bars muted, two bars open, on the same chord, without the tempo moving.",
      "Take a I-bVII-IV riff (G5-F5-C5) and play verse muted, chorus open, four times through.",
    ],
    watchOut:
      "Muting too hard or too far from the bridge, turning notes into pitchless clicks. You should always still hear which chord you are playing.",
  },

  "blw-gtr-pentatonic": {
    intro: [
      "The minor pentatonic is five notes that never sound wrong over a minor or bluesy progression. Box 1 of this scale has launched more solos than everything else combined. Learn the shape, then immediately start making phrases with it, because scales are vocabulary, not music.",
    ],
    sections: [
      {
        heading: "Box 1 in A minor",
        body: [
          "Root at fret 5 on the low E string. The pattern, low string to high: E string frets 5-8, A string 5-7, D string 5-7, G string 5-7, B string 5-8, high E string 5-8. Index finger handles everything at fret 5, ring finger takes fret 7, pinky takes fret 8. The notes are A, C, D, E, G.",
          "Slide the whole box so your index lands on any root and you are in that key: fret 3 is G minor pentatonic, fret 7 is B minor.",
        ],
      },
      {
        heading: "The blues note",
        body: [
          "Add one note, the flat 5, and you have the blues scale. In box 1 it sits at fret 8 on the A string and fret 8 on the G string. Treat it as a passing spice between the 4 and 5, not a note to sit on.",
        ],
      },
      {
        heading: "Phrasing: talk, don't type",
        body: [
          "A solo is sentences, not streams. Play three to six notes, then stop and let a rest happen. Steal rhythm from speech: play the syllables of a spoken phrase on scale notes. End most phrases on the root (A) or the 5th (E) so they sound finished, and repeat a phrase before you vary it; repetition is what makes a lick memorable.",
        ],
      },
    ],
    practice: [
      "Play box 1 in A minor ascending and descending to a 60 bpm metronome, one note per click, then two.",
      "Put on a slow 12-bar blues in A backing track and play only two notes, A and C, focusing entirely on rhythm.",
      "Improvise four-note phrases with a full bar of rest between each, for five minutes.",
      "Make up one short lick, then play it in A, G, and C minor by moving the box.",
    ],
    watchOut:
      "Running the scale up and down as a solo. If your phrases have no rests and no repeated ideas, you are practicing typing, not talking.",
  },

  "blw-gtr-legato": {
    intro: [
      "Hammer-ons, pull-offs, and slides let notes flow into each other instead of being separately picked, which is what makes lead lines sound vocal instead of mechanical. They are also free speed: two or three notes for one pick stroke.",
    ],
    sections: [
      {
        heading: "Hammer-ons",
        body: [
          "Pick a note, then snap another finger down onto a higher fret on the same string hard enough that the new note sounds without picking. Try it on the G string: pick fret 5 with your index down, then hammer fret 7 with your ring finger. Speed of the snap matters more than force; strike like a small hammer falling from a couple of centimeters, landing right behind the fret.",
        ],
      },
      {
        heading: "Pull-offs",
        body: [
          "The reverse, but not just lifting: with index on fret 5 and ring on fret 7 of the G string, pick, then flick the ring finger slightly downward off the string, plucking it as it leaves. The index finger must already be planted and pressing before the pull happens, or you get silence.",
        ],
      },
      {
        heading: "Slides",
        body: [
          "Pick a note, keep full pressure, and glide the finger to the target fret in one motion; the pitch should be continuous with no gap. Practice fret 5 to 7 on the G string with the ring finger, both directions. Time the arrival, not the departure: the destination note should land exactly on the beat.",
        ],
      },
    ],
    practice: [
      "Set a metronome to 60 bpm and play 5h7 (hammer) on each string, two notes per beat, matching the volume of hammered notes to picked ones.",
      "Do the same with 7p5 pull-offs on every string.",
      "Play the trill 5h7p5h7p5 on the G string for 20 seconds without the rhythm collapsing.",
      "Combine all three in one lick in A minor pentatonic: 5h7 on the D string, 5h7 on the G string, slide 7 to 9 on the G string, then pull-off 8p5 on the B string. Loop it slowly until seamless.",
    ],
    watchOut:
      "Hammered and pulled notes coming out quieter than picked ones. If the volume dips, listen for it deliberately and drill the weak motion alone until the line sounds even.",
  },

  "blw-pno-inversions": {
    intro: [
      "Inversions are the same chord with a different note on the bottom, and they are why good pianists' hands barely move while beginners leap around the keyboard. Learn them and progressions become smooth, connected, and far easier to play.",
    ],
    sections: [
      {
        heading: "The three positions",
        body: [
          "C major root position: C-E-G, fingers 1-3-5. First inversion: move the C up an octave to get E-G-C, fingers 1-2-5. Second inversion: move the E up too, G-C-E, fingers 1-3-5. Same three notes, three different bottom notes. Practice rolling up through all three positions and back down, one hand at a time.",
        ],
      },
      {
        heading: "Voice leading: move as little as possible",
        body: [
          "When changing chords, keep any shared note where it is and move the others to their nearest destination. C to F: instead of jumping from C-E-G to F-A-C, keep the C, and move E to F and G to A. You land on F in second inversion (C-F-A) having moved two fingers one step each.",
        ],
      },
      {
        heading: "I-IV-V-I inside one hand span",
        body: [
          "In C, right hand: C-E-G (I, root), C-F-A (IV, second inversion), B-D-G (V, first inversion), then back to C-E-G. No finger travels more than a step or two. Say the chord names out loud as you go, and notice you never leave a five-note range. This is how real accompaniment sounds smooth.",
        ],
      },
    ],
    practice: [
      "Play C major in root, first, and second inversion, up and down, right hand then left, five times each.",
      "Do the same for F and G major.",
      "Set a metronome to 60 bpm and play the close-position I-IV-V-I in C (C-E-G, C-F-A, B-D-G, C-E-G), one chord per two beats.",
      "Transpose that same voice-led progression to G major, working out the nearest-note movements yourself.",
    ],
    watchOut:
      "Jumping every chord back to root position. If your hand leaps more than a couple of keys between chords in a progression, you have stopped voice leading.",
  },

  "blw-pno-pedal": {
    intro: [
      "The sustain pedal is the piano's breath, and legato pedaling, changing the pedal just AFTER each new chord, is the single technique that makes playing sound professional instead of either dry or muddy.",
    ],
    sections: [
      {
        heading: "How the pedal works",
        body: [
          "The right pedal lifts all the dampers so every played note rings until you release it. Press with the ball of your right foot, heel staying planted on the floor. The foot pivots at the ankle; it never stomps or lifts off the pedal.",
        ],
      },
      {
        heading: "The legato pedal cycle",
        body: [
          "The counterintuitive core: you change the pedal after playing the new chord, not before. The cycle is: play chord 1, press the pedal. Play chord 2 while the pedal is still down, and in the instant your fingers land, lift the pedal and immediately press it again. The quick up-down clears chord 1 while your fingers hold chord 2, so there is no gap and no blur.",
          "Say it as a mantra while practicing slowly: play... pedal. play-lift... pedal. The hands and foot move in opposite directions at the change.",
        ],
      },
      {
        heading: "Listening for clean changes",
        body: [
          "Your ear is the judge. If you hear two chords smearing together, the pedal came up too late or not fully. If you hear a dry gap between chords, it came up too early. Record ten seconds of yourself and listen back; the truth is obvious on a recording.",
        ],
      },
    ],
    practice: [
      "With no hands, pump the pedal slowly: press, lift fully, press, feeling the ankle pivot with the heel planted.",
      "Play a single C major chord, pedal after it, then replay the chord and change the pedal on landing. Repeat twenty times slowly.",
      "Play C-F-G-C in the left hand, whole notes at 60 bpm, with a legato pedal change on every chord.",
      "Record yourself playing that progression and listen only for blur or gaps, then fix whichever you hear.",
    ],
    watchOut:
      "Pedaling at the same moment you play the chord (or before it), which carries the old harmony into the new one. The change always happens just after the fingers land.",
  },

  "blw-pno-arpeggios": {
    intro: [
      "Break a chord into flowing single notes and a plain progression becomes a ballad accompaniment. A steady arpeggiated left hand is the engine behind countless pop, classical, and film pieces, and it frees your right hand to carry the melody.",
    ],
    sections: [
      {
        heading: "Alberti bass",
        body: [
          "The classical workhorse: instead of holding C-E-G, play low-high-middle-high, so C-G-E-G, with left-hand fingers 5-1-3-1. Loop it in steady eighth notes. Move the same pattern to F (F-C-A-C) and G (G-D-B-D). Keep it quiet and even; it is a background texture, not the melody.",
        ],
      },
      {
        heading: "Root-fifth-tenth: the ballad stretch",
        body: [
          "Play the root, the fifth above it, then the tenth (the third an octave up): for C, that is C, then G, then E above middle C, fingers 5-2-1. It spans a tenth, so let the wrist travel and use the sustain pedal to hold the low note; do not strain to keep all keys held. This open, wide sound is the default modern ballad left hand.",
        ],
      },
      {
        heading: "Keeping it flowing under a melody",
        body: [
          "The left hand must become automatic. Loop one pattern on a single chord until you can talk over it, then add a simple right-hand melody in whole and half notes. If the left hand stumbles when the right hand enters, slow down until it does not; tempo is earned, not forced.",
        ],
      },
    ],
    practice: [
      "Set a metronome to 60 bpm and loop Alberti bass on C for one minute, perfectly even eighth notes.",
      "Play the progression C-Am-F-G with Alberti bass, one bar each, four times through.",
      "Play the same progression with the root-fifth-tenth pattern and legato pedal, letting each low note ring through the bar.",
      "Add a simple right-hand melody (even just C-B-A-G in whole notes) over the arpeggiated left hand at 60 bpm.",
    ],
    watchOut:
      "Lumpy, uneven eighth notes, usually a thumb that plays louder than every other finger. Practice the pattern slowly and deliberately soften the thumb until all notes match.",
  },

  "blw-pno-all-scales": {
    intro: [
      "All twelve major scales, correct fingerings, two octaves, hands together: this is the project that turns key signatures from theory into muscle memory. After it, no key on a page or in a jam intimidates you, and every future piece gets easier to learn.",
    ],
    sections: [
      {
        heading: "The standard fingering system",
        body: [
          "Most white-key scales use the same skeleton. Right hand: 1-2-3, thumb under, 1-2-3-4, repeating each octave, ending on 5. Left hand mirrors it: 5-4-3-2-1, then 3-2-1 crossing over. C, G, D, A, and E major all use exactly this. F major right hand is the exception: 1-2-3-4, 1-2-3-4, because the thumb must avoid the Bb.",
        ],
      },
      {
        heading: "Black-key scales are friends, not enemies",
        body: [
          "In flat keys the rule of thumb is literal: thumbs play white keys, long fingers take the black keys. B major, Db major (played as C# fingering), and Gb are physically the easiest scales of all because the hand's long fingers fall naturally on the raised black keys; Chopin started students on B major for exactly this reason.",
        ],
      },
      {
        heading: "A learning order that works",
        body: [
          "Go around the circle of fifths, one new scale per week while reviewing the old ones: C, G, D, A, E, then B, then the flats F, Bb, Eb, Ab, Db, Gb. Learn each hands separately first, one octave, then two octaves, then hands together slowly. Hands together at 50 bpm and clean beats hands separately at 90 and sloppy.",
        ],
      },
    ],
    practice: [
      "Set a metronome to 60 bpm and play this week's scale hands separately, two octaves, one note per click, four repetitions.",
      "Same scale hands together at 50 bpm, quarter notes, stopping to fix any fingering slip immediately.",
      "Review day: play every scale learned so far, once each, hands together, before touching the new one.",
      "Weekly self-test: shuffle written key names in a pile, draw three, and play them cold.",
    ],
    watchOut:
      "Improvising fingerings. A scale played with random fingers has to be relearned later; check the thumb crossings from day one, because the fingering IS the skill.",
  },
};
