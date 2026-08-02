import type { Lesson } from "./types";

export const ABYSS_LESSONS: Record<string, Lesson> = {
  "aby-jazz-harmony": {
    intro: [
      "The ii-V-I is the engine of jazz. In C major it is Dm7 G7 Cmaj7: the ii sets up the dominant, the dominant demands resolution, the I delivers it. Most standards are chains of ii-V-Is passing through several keys.",
      "Tensions are what make it sound like jazz instead of a theory exercise. Learn which extensions belong on each chord quality and the changes come alive.",
    ],
    sections: [
      {
        heading: "The three chord qualities",
        body: [
          "Dm7 takes 9 (E) and 11 (G). G7 takes 9 and 13 when resolving gently, or the altered tensions when you want pull. Cmaj7 takes 9 (D) and #11 (F#) — never a natural 11, which clashes with the 3rd.",
        ],
      },
      {
        heading: "Altered dominants",
        body: [
          "On G7, the altered tensions are b9 (Ab), #9 (Bb), #11 (Db), and b13 (Eb). Each is a chromatic note leaning into the C major resolution: Ab falls to G, Eb falls to D, Db falls to C. G7alt means the 5th and 9th are both altered.",
          "Rule of thumb: altered dominant resolving to minor is almost mandatory (G7b9 to Cm); resolving to major it is a color choice.",
        ],
      },
      {
        heading: "Hearing it",
        body: [
          "On piano, play G-B-F in the left hand and add Ab then Bb then Eb on top; hear each tension resolve into Cmaj7. On guitar, compare G13 (3x345x) with G7#9 (3x344x) resolving to Cmaj7 — same function, different heat.",
        ],
      },
    ],
    practice: [
      "Play Dm7 G7 Cmaj7 in all 12 keys, roots only in the bass, until the motion is automatic.",
      "On the V chord, add one tension at a time — b9, #9, b13 — and sing the resolution note before you play it.",
      "Take the A section of Autumn Leaves and label every ii-V-I, including the minor one (Am7b5 D7b9 Gm).",
      "Comp the tune adding at least one altered tension on every dominant.",
    ],
    watchOut: "Cramming every tension onto every chord. Tensions are seasoning; one well-placed b9 resolving down a half step beats a fistful of alterations that go nowhere.",
  },

  "aby-reharm": {
    intro: [
      "Reharmonization means keeping the melody and changing the chords under it. It is how arrangers make a familiar tune sound newly written, and it forces you to understand why the original chords worked in the first place.",
    ],
    sections: [
      {
        heading: "The tritone sub",
        body: [
          "Replace G7 with Db7. They share the two notes that define a dominant chord: B and F are the 3rd and 7th of G7 and the 7th and 3rd of Db7. So Dm7 G7 Cmaj7 becomes Dm7 Db7 Cmaj7, and the bass now walks down chromatically: D, Db, C. Any V7 can be subbed this way; the melody note just needs to fit the new chord.",
        ],
      },
      {
        heading: "Passing diminished",
        body: [
          "Connect diatonic chords a whole step apart with a diminished chord on the chromatic note between them: C to C#dim7 to Dm7, or F to F#dim7 to C/G. The diminished chord is really a rootless dominant b9 (C#dim7 is A7b9), which is why it pulls so hard.",
        ],
      },
      {
        heading: "Quality swaps and new bass lines",
        body: [
          "Swap a chord's quality while keeping the melody: make IV minor (Fm6 instead of F in C), turn a plain V into a IVmaj7 over the 5th, or set the whole phrase over a descending bass line and pick chords to fit each bass note.",
          "Test every sub against the melody. If the melody note is a chord tone or a usable tension of the new chord, it works.",
        ],
      },
    ],
    practice: [
      "Take a ii-V-I in three keys and tritone-sub the V. Play both versions back to back.",
      "Harmonize the C major scale, then insert passing diminished chords between I-ii and IV-V.",
      "Reharmonize the first eight bars of a simple tune (Happy Birthday works) three different ways.",
      "Write out the melody notes and check each against your new chords: chord tone, tension, or clash?",
    ],
    watchOut: "Reharmonizing against the melody. A substitution that clashes with the tune is not sophisticated, it is wrong — the melody always has veto power.",
  },

  "aby-rhythm-mastery": {
    intro: [
      "Advanced players are separated from intermediates less by notes than by time. Swing, syncopation, and odd meters are learnable skills, not talents — but only if you practice them deliberately with a metronome and your own recordings as the judge.",
    ],
    sections: [
      {
        heading: "Swing feel",
        body: [
          "Swing eighths are not dotted rhythms. At medium tempos they sit near a triplet split — the offbeat lands on the third triplet — and they straighten out as tempo rises. The accent goes on the offbeat, not the downbeat.",
          "Set the metronome to click on beats 2 and 4 only. If it feels backwards at first, that is the point.",
        ],
      },
      {
        heading: "Odd meters",
        body: [
          "Feel odd meters as groupings, not counts. 7/8 is 2+2+3 or 3+2+2: say TA-ka TA-ka TA-ki-ta while clapping. 6/8 is two big beats of three; 3/4 is three even beats — do not confuse them. Guitarists: anchor the grouping with a strum accent pattern. Pianists: put the grouping in the left hand as a repeating bass figure.",
        ],
      },
      {
        heading: "Polyrhythm basics",
        body: [
          "Start with 3 against 2. The composite rhythm is the phrase 'nice cup of tea': both hands together, right, left, right. Tap 2 with your foot and 3 with your hand until you can start from either side.",
        ],
      },
    ],
    practice: [
      "Play a familiar tune with the metronome on 2 and 4 for ten minutes a day for a week.",
      "Clap 7/8 as 2+2+3, then play a one-chord vamp in it until you stop counting.",
      "Tap 3-against-2 hands on knees, then move it to your instrument: bass note pattern in one layer, chord stabs in the other.",
      "Record yourself swinging a melody and compare against a recording you love. Adjust, re-record.",
    ],
    watchOut: "Practicing odd meters by counting to seven forever. Counting is scaffolding; the goal is to feel the 2+2+3 grouping as a physical shape, and that only happens when you stop counting.",
  },

  "aby-ear-realtime": {
    intro: [
      "At a jam nobody hands you a chart. Real-time ears means hearing a song's harmonic skeleton fast enough to play it on first listen. The secret is that you are not identifying chords one by one — you are recognizing familiar patterns and only solving the surprises.",
    ],
    sections: [
      {
        heading: "Follow the bass",
        body: [
          "The bass gives you the root motion, and root motion narrows the chord to two or three candidates. Lock onto whether the bass moves by step, by fourth or fifth, or stays put. A bass falling by fifths is almost always a cycle of dominants or a ii-V chain.",
        ],
      },
      {
        heading: "Hear function, then quality",
        body: [
          "First decide the chord's job: home (I), away (IV, ii, vi), or tension (V, VII). Then refine the quality: major, minor, dominant. Most popular songs use six or seven progressions; learn I-V-vi-IV, I-vi-IV-V, ii-V-I, I-IV-V, and the 12-bar blues cold and you have pre-solved most of the song.",
        ],
      },
      {
        heading: "Fast key finding",
        body: [
          "Hum the note the song feels like it wants to end on — that is the tonic. Find it on your instrument in the first few bars. Guitarists: check it against open-position shapes to guess the likely key family. Pianists: test the tonic with a quick I chord in each hand candidate key.",
        ],
      },
    ],
    practice: [
      "Put on a playlist of unfamiliar pop songs. For each: find the key within one verse, singing the tonic first.",
      "Transcribe only the bass line of one song per day for two weeks. No pausing more than once per phrase.",
      "Play along with songs in real time, allowing yourself wrong chords — correct by the next repeat of the section.",
      "At your next jam, ask for a song you do not know. That is the test.",
    ],
    watchOut: "Pausing the recording constantly. Real-time ears are built by staying with the moving song and being wrong in motion, not by grinding one chord to certainty while the music stops.",
  },

  "aby-songwriting": {
    intro: [
      "Craft is what separates a finished song from a promising fragment. Inspiration gives you eight bars; form, melodic design, and arrangement turn them into something a stranger wants to hear twice.",
    ],
    sections: [
      {
        heading: "Form is expectation management",
        body: [
          "Verse-chorus (with optional pre-chorus and bridge) and AABA are the two workhorse forms. The rule underneath both: repeat enough to be memorable, change enough to avoid boredom. The bridge or B section exists to make the return of the main section feel earned — take it somewhere else harmonically (try starting on IV or vi) so home sounds like home again.",
        ],
      },
      {
        heading: "Melody writing",
        body: [
          "Strong melodies balance steps with occasional leaps, and a leap should be followed by a step back the other way. Save the highest note for one moment — usually the chorus — and only use it once or twice. Give verse and chorus different registers and different rhythmic density so they are distinguishable with the harmony stripped away.",
        ],
      },
      {
        heading: "Tension and release",
        body: [
          "Build tension by rising melodic lines, shortening phrase lengths, thickening rhythm, or holding a V chord; release by arriving on I with the melodic peak, then thinning out. A pre-chorus is a tension machine: its whole job is to make the chorus downbeat land.",
        ],
      },
      {
        heading: "Arrangement",
        body: [
          "Arrangement is deciding what NOT to play in each section. Map the song's energy: verses sparse, choruses full, final chorus fullest. Change one texture element per section — a new bass pattern, a register shift, a dropped instrument — rather than everything at once.",
        ],
      },
    ],
    practice: [
      "Analyze the form of three songs you love: label sections, note where the melodic peak lands.",
      "Write a verse and chorus where the chorus melody sits higher and moves less than the verse melody.",
      "Write a bridge starting on a chord you have not used yet in the song.",
      "Record a full demo, then remove one part from every section and listen again.",
      "Finish it. Play it for someone.",
    ],
    watchOut: "Endless verse-writing with no chorus payoff. If every section has the same energy and register, you have a mood, not a song — design the contrast on purpose.",
  },

  "aby-gtr-chord-melody": {
    intro: [
      "Chord melody is the guitar acting as a full band: melody on top, harmony in the middle, bass on the bottom. It is the most complete musical statement one guitarist can make, and arranging your own is the fastest way to truly own a tune.",
    ],
    sections: [
      {
        heading: "Melody lives on top",
        body: [
          "Put the melody on the top two or three strings, mostly strings 1 and 2, and voice every chord underneath it. That means learning each chord type with different notes on top: Cmaj7 with the melody on E, on G, on B. Drop-2 voicings on strings 1-4 and drop-3 voicings with the bass on string 6 are the core grips.",
        ],
      },
      {
        heading: "Not every note gets a chord",
        body: [
          "Harmonize the strong beats and the long notes; let passing eighth notes ride as single notes over the ringing chord. A good default is one chord per bar or per melody phrase. Full block-chording every note is a specific effect, not the baseline.",
        ],
      },
      {
        heading: "Bass and thumb",
        body: [
          "Fingerstyle or hybrid picking lets the thumb keep a bass presence — root on beat 1, maybe root and fifth in a two-feel — while the fingers place the chord and melody. Even on a rubato ballad, a bass note at each harmony change grounds the arrangement.",
        ],
      },
    ],
    practice: [
      "Learn the melody of a simple standard (Fly Me to the Moon) as single notes on strings 1-2 only.",
      "Harmonize just the downbeat of each bar with a drop-2 or drop-3 voicing under the melody note.",
      "Add bass notes with the thumb on beats 1 and 3.",
      "Fill remaining melody notes as single notes over ringing chords.",
      "Perform the arrangement start to finish, rubato first, then in time.",
    ],
    watchOut: "Burying the melody. If a listener cannot sing the tune back after hearing your arrangement, the voicings won — make the top note louder than everything under it.",
  },

  "aby-gtr-advanced-tech": {
    intro: [
      "Sweep picking, tapping, and hybrid picking are the advanced right-hand vocabulary of modern guitar. Each solves a problem ordinary alternate picking cannot: sweeps arpeggiate across strings at speed, taps reach intervals the fretting hand cannot, hybrid picking mixes pick attack with fingerstyle snap.",
    ],
    sections: [
      {
        heading: "Sweep picking",
        body: [
          "One continuous pick stroke across the strings, one note per string. Start with a three-string Am shape: pick down through strings 3-2-1 (A, C, E at frets 14-13-12... use the 12th position shape: G string 14, B string 13, E string 12), then pull off and drag the pick back up. The left hand must lift each finger as the next note sounds — if two notes ring together it is a strum, not a sweep.",
        ],
      },
      {
        heading: "Tapping",
        body: [
          "The classic figure: right-hand tap at fret 12 on the B string, pull off to fret 5, hammer to fret 8, repeat. That outlines a triad across a spread no single hand can reach. Mute the idle strings with the right-hand palm or a hair tie at the nut while learning.",
        ],
      },
      {
        heading: "Hybrid picking",
        body: [
          "Hold the pick normally and use the middle and ring fingers for higher strings. Practice country-style double stops: pick the bass note on string 4, snap strings 2 and 1 with fingers. The finger snap gives an attack a pick cannot, and string skips become trivial.",
        ],
      },
      {
        heading: "Making it music",
        body: [
          "Each technique earns its place only inside a line. End a sweep on a held bend; use a tap to hit the climax note of a phrase; hybrid-pick an arpeggiated fill between vocal lines. If you can drop it into a solo over a backing track and it sounds like a phrase, it is yours.",
        ],
      },
    ],
    practice: [
      "Metronome at 60: three-string Am and A major sweep shapes, perfectly clean, four reps per click.",
      "Tap the 12-5-8 triplet figure on the B string, then move the same figure through a chord progression's arpeggios.",
      "Hybrid-pick a 4th-string bass note plus 2nd/1st-string double stop through a 12-bar blues.",
      "Improvise one chorus over a backing track using each technique exactly once, musically.",
    ],
    watchOut: "Speed before cleanliness. A sloppy sweep at 160 bpm is noise; notes bleeding together is the number one failure, and it only gets fixed slow.",
  },

  "aby-gtr-jazz-vocab": {
    intro: [
      "Bebop vocabulary is how you outline changes so clearly a listener could name the chords from your single-note line alone. The core tools are arpeggios, chromatic approach notes, and enclosures — plus the bebop scale trick that keeps chord tones on downbeats.",
    ],
    sections: [
      {
        heading: "Arpeggios first",
        body: [
          "For every chord in the tune, know the 1-3-5-7 arpeggio in position. Over Dm7 G7 C, the strongest note choices at each chord change are the 3rds and 7ths: F and C over Dm7, B and F over G7, E and B over Cmaj7. Target those on beat 1 of each change.",
        ],
      },
      {
        heading: "Approach notes and enclosures",
        body: [
          "An approach note is a note a half step below or a scale step above your target, played just before it. An enclosure surrounds the target from both sides: to land on E (3rd of C), play F then D# then E, or D# then F then E. Practice enclosing every note of a Cmaj7 arpeggio — instant bebop.",
        ],
      },
      {
        heading: "The bebop scale",
        body: [
          "Over G7, play Mixolydian plus a passing natural 7: G A B C D E F F# G descending. The added note makes the scale eight notes, so chord tones land on downbeats when you run straight eighths. Start it from a chord tone on a downbeat and it self-corrects.",
        ],
      },
      {
        heading: "Jazz blues in F",
        body: [
          "Apply it to F7 Bb7 F7 Cm7-F7 Bb7 Bdim7 F7 Am7b5-D7 Gm7 C7 F7-D7 Gm7-C7. Hit the 3rd of each chord on its downbeat: A over F7, D over Bb7, F# over D7. That single habit outlines the whole form.",
        ],
      },
    ],
    practice: [
      "Play 1-3-5-7 arpeggios through a jazz blues in F, in one position, in time.",
      "Drill enclosures targeting the 3rd of each chord in the blues.",
      "Run the G and C bebop scales in eighth notes, checking that chord tones fall on downbeats.",
      "Transcribe one short Charlie Parker or Grant Green phrase and move it through all twelve keys.",
      "Solo three choruses over the F blues, landing the 3rd of every chord on beat 1.",
    ],
    watchOut: "Running scales that ignore the changes. If your line sounds the same over Dm7 and G7, you are decorating a key, not playing the chords — target 3rds and 7ths at every change.",
  },

  "aby-pno-rootless": {
    intro: [
      "When a bassist covers the roots, your left hand is free to say something better. Rootless voicings — the Bill Evans sound — pack the 3rd, 7th, and tensions into a compact mid-register grip, and upper structures put bright triads on top of dominants.",
    ],
    sections: [
      {
        heading: "A-form and B-form",
        body: [
          "Two grips per chord, chosen so voice leading barely moves. For Dm7 G7 Cmaj7, A-form: Dm7 = F A C E (3-5-7-9), G7 = F A B E (7-9-3-13), Cmaj7 = E G B D (3-5-7-9). B-form starts from the 7th: Dm7 = C E F A, G7 = B E F A (3-13-7-9), Cmaj7 = B D E G. Notice each chord change moves each finger a step or less.",
        ],
      },
      {
        heading: "Where to put them",
        body: [
          "Keep the voicing roughly between C below middle C and the A above it. Lower gets muddy, higher collides with the melody. Alternate A and B forms as the ii-V-Is move through keys so your hand stays in that window.",
        ],
      },
      {
        heading: "Upper structures",
        body: [
          "Over a dominant, the right hand stacks a triad from outside the key while the left holds 3 and 7. Over G7 (LH: B and F): D major triad on top gives 13 and 9; Eb major gives #9 and b13; A major gives 9 and #11. Triad over shell — two hands, huge sound.",
        ],
      },
    ],
    practice: [
      "Play A-form ii-V-I voicings in all 12 keys, left hand alone, around the cycle of fifths.",
      "Repeat with B-form, then alternate A and B so the hand never jumps more than a step.",
      "Comp a blues in F using only rootless voicings while a play-along or metronome covers time.",
      "Add right-hand upper-structure triads on every dominant: D, Eb, and A triads over G7 first.",
      "Comp one full standard from a lead sheet, no written voicings.",
    ],
    watchOut: "Playing rootless voicings too low. Below roughly the C an octave under middle C, 3rds and 7ths turn to mud — keep the grip in the mid register and let the bassist own the bottom.",
  },

  "aby-pno-stride": {
    intro: [
      "Stride and walking bass are the left hand graduating from accompanist to rhythm section. Stride alternates low bass notes with mid-register chords; walking bass spins a continuous quarter-note line. Both demand a left hand that keeps perfect time while the right hand thinks about something else.",
    ],
    sections: [
      {
        heading: "The stride pattern",
        body: [
          "Beats 1 and 3: a low root or fifth (single note, octave, or tenth if your hand reaches). Beats 2 and 4: a small chord — a shell or rootless voicing — around the octave below middle C. The leap is the hard part: practice the jump with your eyes closed, letting the hand memorize the distance. Accuracy at 80 bpm beats flash at 140.",
        ],
      },
      {
        heading: "Walking bass",
        body: [
          "Build quarter-note lines from chord tones and approach notes: start each bar on the root, walk toward the next chord's root, and land on it from a half step above or below. Over Dm7 G7 C: D F A B / G A B Db / C. The half-step approach into each new root is what makes it sound intentional.",
        ],
      },
      {
        heading: "Independence",
        body: [
          "The left hand must become automatic. Loop a single ii-V-I with stride LH until you can hold a conversation over it. Then add simple RH: whole-note guide tones first, then the melody, then improvised phrases. If the LH stumbles when the RH gets busy, the LH was not automatic yet — drop back.",
        ],
      },
    ],
    practice: [
      "Stride LH alone on a 12-bar blues at 80 bpm, no looking at the keys during leaps.",
      "Walking bass LH through ii-V-Is in six keys, always approaching the new root by half step.",
      "LH stride plus RH sustained guide tones (3rds and 7ths) on one standard.",
      "LH walking bass plus RH comped chords on beats 2 and 4, then RH melody.",
      "One full chorus of a tune, either style, with a metronome on 2 and 4.",
    ],
    watchOut: "Rushing the leap. Almost everyone clips beat 2 short because the hand is anxious about the jump — practice slower than feels necessary and let the metronome, not your nerves, place the chord.",
  },

  "aby-pno-solo-arranging": {
    intro: [
      "Solo piano means you are the singer, the band, and the arranger at once. The skill is not playing more — it is distributing melody, harmony, bass, and time across two hands so a complete performance emerges, with a shape from first note to last.",
    ],
    sections: [
      {
        heading: "Intros and endings",
        body: [
          "A dependable intro: play the last four or eight bars of the form, or vamp a two-chord loop (Imaj7 to bIImaj7, or a ii-V) that sets tempo and mood. For endings, the classics work: tag the last phrase three times, or land on Imaj7 and let a #11 color ring. Decide both before you start playing — improvising an ending live is how trainwrecks happen.",
        ],
      },
      {
        heading: "Textures to rotate",
        body: [
          "Build a menu: melody in octaves over stride; melody over LH rootless voicings with slow bass notes; ballad style with rolled tenths; block chords (melody harmonized in both hands) for a shout chorus. A solo arrangement is these textures in a deliberate order, changing at section boundaries.",
        ],
      },
      {
        heading: "Reharmonizing the melody",
        body: [
          "Second time through the form, alter the harmony under held melody notes: tritone-sub the dominants, drop a bII maj7 chord under the final tonic melody note, insert a iv6 before the last cadence. The melody stays recognizable; the floor moves beneath it.",
        ],
      },
      {
        heading: "The arc",
        body: [
          "Map the performance: quiet rubato head, in-time second chorus building texture, peak (block chords, fullest register), then strip down for the final statement and ending. Sketch it in four lines before you touch the piano.",
        ],
      },
    ],
    practice: [
      "Pick one standard. Write a four-line arc: intro, head, development, ending.",
      "Work out an eight-bar intro and a tag ending, and memorize both.",
      "Play the head in two textures: stride under melody, then ballad style with rootless LH.",
      "Reharmonize four moments in the second chorus and keep whichever three sound best.",
      "Perform the complete arrangement for a phone recording, start to finish, no stopping.",
    ],
    watchOut: "Playing everything at one dynamic and density. If every chorus is equally full, the arrangement has no story — plan where the peak is and make everything else smaller than it.",
  },
};
