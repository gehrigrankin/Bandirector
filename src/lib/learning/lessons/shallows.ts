import type { Lesson } from "./types";

export const SHALLOWS_LESSONS: Record<string, Lesson> = {
  "shw-major-scale": {
    intro: [
      "The major scale is the ruler every other musical idea is measured against. Chords, keys, intervals, melodies - they are all described by how they relate to it.",
      "By the end of this you will be able to build a major scale from any starting note on paper, and play it in C and G.",
    ],
    sections: [
      {
        heading: "The formula: W-W-H-W-W-W-H",
        body: [
          "A whole step (W) is two half steps; a half step (H) is the smallest move in Western music - one fret on guitar, one key (including black keys) on piano. Every major scale uses the same pattern of steps from its root: W-W-H-W-W-W-H.",
          "Start on any note, apply the pattern, and you get that note's major scale. That is the whole trick.",
        ],
      },
      {
        heading: "Worked example: C major",
        body: [
          "Start on C. Up a whole step: D. Whole: E. Half: F. Whole: G. Whole: A. Whole: B. Half: back to C. So C major is C-D-E-F-G-A-B-C - all white keys on piano, no sharps or flats.",
          "Notice the half steps fall between E-F and B-C. Those are the only two natural half steps in the musical alphabet.",
        ],
      },
      {
        heading: "Worked example: G major",
        body: [
          "Start on G: whole to A, whole to B, half to C, whole to D, whole to E, whole to... F is only a half step from E, so you must raise it to F sharp. Then a half step from F sharp lands you on G.",
          "G major is G-A-B-C-D-E-F#-G. One sharp appears because the formula forces it. This is exactly where key signatures come from.",
        ],
      },
    ],
    practice: [
      "On paper, write the W-W-H-W-W-W-H formula, then build C major and G major from it without looking at the lesson.",
      "Build D major and F major on paper the same way. Check: D major has two sharps (F#, C#); F major has one flat (Bb).",
      "Play C major slowly on your instrument, saying each note name out loud as you play it.",
      "Play G major the same way, listening for the F sharp.",
      "Set a metronome to 60 bpm and play each scale up and down, one note per click, no stopping.",
    ],
    watchOut: "Counting the starting note as the first step. The formula describes the gaps between notes, not the notes themselves - start on the root, then apply W-W-H-W-W-W-H to move away from it.",
  },

  "shw-keys": {
    intro: [
      "When a song is \"in G\", it means the song treats G as home base and draws its notes from the G major scale. Knowing keys tells you which chords and notes will sound right before you play a single one.",
      "You will be able to name every note in any key with up to two sharps or flats.",
    ],
    sections: [
      {
        heading: "What a key is",
        body: [
          "A key is a family of seven notes - the major scale of the home note - plus the feeling that the home note (the tonic) is where phrases want to resolve. Play C-D-E-F-G-A-B and stop on B: it feels unfinished. Land on C and it feels done. That pull toward home is the key at work.",
        ],
      },
      {
        heading: "Key signatures",
        body: [
          "Instead of writing a sharp on every F in a piece in G major, notation puts one sharp at the start of each line: the key signature. It says \"every F is F sharp unless told otherwise.\"",
          "Sharps and flats arrive in a fixed order. Sharps: F#, then C#, then G#. Flats: Bb, then Eb, then Ab.",
        ],
      },
      {
        heading: "The five keys to memorize now",
        body: [
          "C major: no sharps or flats. G major: one sharp (F#). D major: two sharps (F#, C#). F major: one flat (Bb). Bb major: two flats (Bb, Eb).",
          "Guitar players live in G and D because open chords fit them; piano beginners start in C and F because the fingerings are comfortable. Learn all five either way.",
        ],
      },
    ],
    practice: [
      "Write out the notes of C, G, D, F, and Bb major from memory. Check them against the sharps and flats listed above.",
      "Quiz yourself out of order: \"Which key has two sharps?\" \"What is the flat in F major?\" Do ten questions.",
      "Play the G major scale on your instrument, then play a G chord (guitar) or G triad G-B-D (piano). Hear how the chord sounds like \"home\" for the scale.",
      "Pick a simple song you know and find out its key. List its seven notes.",
    ],
    watchOut: "Thinking the key signature is decoration. It changes every affected note in the piece - if the signature has F#, every single F you see is played sharp.",
  },

  "shw-intervals": {
    intro: [
      "An interval is the distance between two notes. Chords are stacks of intervals; melodies are chains of them. Once you can name and hear intervals, music stops being a wall of notes and becomes measurable.",
      "You will identify major and minor 3rds, perfect 4ths, perfect 5ths, and octaves by name and by ear.",
    ],
    sections: [
      {
        heading: "Counting intervals",
        body: [
          "Count letter names, including both ends. C up to E: C, D, E - three letters, so it is a 3rd. C to F is a 4th, C to G a 5th, C to the next C an octave (8th).",
          "The number alone is not enough - quality matters. C to E is 4 half steps: a major 3rd, bright. C to Eb is 3 half steps: a minor 3rd, darker. A perfect 4th is 5 half steps, a perfect 5th is 7, an octave is 12.",
        ],
      },
      {
        heading: "Finding them on your instrument",
        body: [
          "Guitar: on one string, a minor 3rd is 3 frets up, major 3rd 4 frets, perfect 4th 5 frets, perfect 5th 7 frets, octave 12 frets. Across strings, the note on the next higher string at the same fret is a perfect 4th up (except G to B, which is a major 3rd).",
          "Piano: count half steps key by key, black keys included. C to E is a major 3rd (4 half steps); E to G is a minor 3rd (3 half steps); C to G is a perfect 5th (7 half steps).",
        ],
      },
      {
        heading: "Hearing them",
        body: [
          "Anchor each interval to a song opening. Major 3rd: the first two notes of \"Oh When the Saints.\" Perfect 4th: \"Here Comes the Bride.\" Perfect 5th: the Star Wars theme. Octave: \"Somewhere Over the Rainbow.\" Sing the song fragment, and you have sung the interval.",
        ],
      },
    ],
    practice: [
      "Play C then E, and sing both notes. Do the same for C-Eb, C-F, C-G, and C-C an octave up. Say each interval name out loud.",
      "On guitar, play the 5th string open (A), then find the notes 3, 4, 5, 7, and 12 frets up, naming each interval.",
      "On piano, pick a random white key and build a major 3rd, perfect 4th, and perfect 5th above it by counting half steps.",
      "Have someone (or an app) play two notes; guess the interval. Ten tries a day.",
      "Sing your four anchor songs and name the interval each one starts with.",
    ],
    watchOut: "Counting the gaps instead of the letter names for the interval number. C to E is a 3rd because you count C, D, E - three letters - not because there are two steps between them.",
  },

  "shw-minor-chords": {
    intro: [
      "Major chords sound bright; minor chords sound dark or sad. The difference is one note moved one half step - and understanding it unlocks half the chords in every song you will ever play.",
      "You will be able to explain and play the difference between C major and A minor, and find any key's \"sad twin.\"",
    ],
    sections: [
      {
        heading: "One note makes the difference",
        body: [
          "A major chord is root + major 3rd + perfect 5th. C major: C-E-G. Lower the middle note a half step and you get a minor chord. C minor: C-Eb-G. Same root, same 5th, but the 3rd drops - and the whole mood changes.",
          "Piano: play C-E-G with fingers 1-3-5, then slide the 3 finger from E to the black key Eb. Guitar: compare open E major to E minor - lift your first finger off the 3rd string, changing G# to G. That one string is the 3rd.",
        ],
      },
      {
        heading: "The relative minor",
        body: [
          "Every major key has a minor key that uses exactly the same notes: its relative minor, found on the 6th note of the major scale. In C major (C-D-E-F-G-A-B), the 6th note is A - so A minor is C major's relative minor.",
          "A minor uses the same seven white keys as C major but treats A as home. Same ingredients, different center of gravity, completely different mood. Likewise E minor is the relative minor of G major.",
        ],
      },
      {
        heading: "Hearing major vs minor",
        body: [
          "Play C major (C-E-G), then A minor (A-C-E). On guitar, strum C then Am. The minor chord sounds like a shadow of the major. Train your ear to label chords bright or dark on first hearing - that is the major/minor call, and it is the most useful ear skill a beginner can build.",
        ],
      },
    ],
    practice: [
      "Play C major then C minor back to back five times (piano: C-E-G then C-Eb-G; guitar: use E major vs E minor if C minor is out of reach). Say \"major\" and \"minor\" as you play each.",
      "Play C major then A minor and hear how they share notes but feel different.",
      "For G, D, and F major, name the relative minor by counting to the 6th scale note. Check: Em, Bm, Dm.",
      "Have someone play random major or minor chords while you look away; call out bright or dark. Ten chords.",
    ],
    watchOut: "Confusing the relative minor (A minor vs C major - same notes, different root) with the parallel minor (C minor vs C major - same root, different notes). The relative minor shares the key signature; the parallel minor does not.",
  },

  "shw-gtr-minor-7th-chords": {
    intro: [
      "You already know a handful of majors. Add the open minors and the 7th chords and you can read almost any chord chart at a campfire: Am, Em, Dm, plus E7, A7, D7, G7, C7, and B7.",
      "The goal: see any common chord symbol and have your hand form it without thinking.",
    ],
    sections: [
      {
        heading: "The three open minors",
        body: [
          "Em: fingers 2 and 3 on the 2nd fret of the 5th and 4th strings; strum all six. Am: like E major moved down one string - fingers 2 and 3 on the 2nd fret of the 4th and 3rd strings, finger 1 on the 1st fret of the 2nd string; strum from the 5th string. Dm: finger 1 on the 1st fret of the 1st string, finger 2 on the 2nd fret of the 3rd string, finger 3 on the 3rd fret of the 2nd string; strum from the 4th string.",
        ],
      },
      {
        heading: "7th chords are often easier",
        body: [
          "Most open 7th chords remove a finger or move one. E7: play E major, lift finger 3 - the open 4th string does the work. A7: finger 2 on the 2nd fret of the 4th string, finger 3 on the 2nd fret of the 2nd string, 3rd string open. D7: a triangle pointing the opposite way from D - finger 2 at the 1st fret of the 2nd string, fingers 1 and 3 at the 2nd fret of the 3rd and 1st strings.",
          "G7: like G but with finger 1 on the 1st fret of the 1st string (fingers 3 and 2 on the low strings as usual). C7: play C, then add finger 4 on the 3rd fret of the 3rd string. B7: the only stretch - finger 2 on the 2nd fret of the 5th string, finger 1 on the 1st fret of the 4th string, finger 3 on the 2nd fret of the 3rd string, finger 4 on the 2nd fret of the 1st string; 2nd string open.",
        ],
      },
      {
        heading: "Where 7ths live",
        body: [
          "A dominant 7th chord pulls hard toward the chord a 4th above it: E7 wants to go to A, A7 to D, D7 to G, G7 to C, B7 to E. Play E7 then A and you will hear the resolution. Blues, country, and early rock are built on this pull.",
        ],
      },
    ],
    practice: [
      "Learn one new chord per day. Form it, check every string rings by picking them one at a time, shake your hand out, form it again. Five repetitions.",
      "Set a metronome to 60 bpm and strum each new chord on every beat for 30 seconds without buzzing.",
      "Play each resolution pair four times: E7-A, A7-D, D7-G, G7-C, B7-Em.",
      "Flash-card drill: write the ten chord symbols on cards, shuffle, and form each one within three seconds of flipping it.",
    ],
    watchOut: "Muting the open strings a chord needs. In A7 and D7 the open 3rd string and in B7 the open 2nd string carry essential notes - flatten fingers even slightly and the chord dies. Pick through every string, every time.",
  },

  "shw-gtr-changes": {
    intro: [
      "Knowing chords is not the same as changing between them in time. Songs do not wait while you rebuild your hand - the change has to happen inside the beat.",
      "You will change between any two open chords on the beat at 80 bpm without stopping the strum.",
    ],
    sections: [
      {
        heading: "One-minute changes",
        body: [
          "Pick two chords, set a timer for one minute, and switch between them as many times as you can - no strumming, just landing clean shapes. Count your switches and write the number down. Beat your score tomorrow. This drill, from Justin Sandercoe, builds changes faster than anything else.",
        ],
      },
      {
        heading: "Pivot and glide fingers",
        body: [
          "Before switching, look for a finger both chords share. C to Am: fingers 1 and 2 do not move at all - only finger 3 lifts. Am to E: keep the same shape, shift each finger one string toward the floor. G to Em: finger 2 slides down a string. Anchoring one finger while the others move cuts the change time in half.",
          "Where no pivot exists, move all fingers as one unit toward the new shape rather than placing them one at a time.",
        ],
      },
      {
        heading: "Never stop the strum",
        body: [
          "The rhythm matters more than the chord. Strum down on every beat and change chords on beat 1 no matter what - even if the new chord lands sloppy or you strum open strings during the switch. Every real guitarist strums open strings mid-change; the motion never pauses. A perfect chord that arrives late is a wrong chord.",
        ],
      },
    ],
    practice: [
      "Do one-minute changes on C-Am, G-D, and Em-Am. Log your scores; aim for 60 clean switches per minute over a week or two.",
      "Set a metronome to 60 bpm, strum one downstrum per beat, and change chords every 4 beats: C for 4, G for 4, repeat for two minutes without stopping.",
      "Repeat at 70, then 80 bpm on the same pair.",
      "Do the same drill changing every 2 beats at 60 bpm.",
      "Pick the pair you fumble most and give it its own one-minute drill daily.",
    ],
    watchOut: "Stopping the strumming hand to wait for the fretting hand. Keep the strum going and let the change be ugly at first - rhythm first, cleanliness second.",
  },

  "shw-gtr-tab": {
    intro: [
      "Tablature is the guitarist's shortcut notation: it shows exactly where to put your fingers, no note-reading required. Nearly every riff and solo on the internet is written in tab.",
      "You will be able to learn a riff you have never heard from tab alone.",
    ],
    sections: [
      {
        heading: "Six lines, upside down",
        body: [
          "Tab has six horizontal lines, one per string - but the top line is the thinnest string (high E) and the bottom line is the thickest (low E). It is the view looking down at your own guitar, which trips everyone up at first.",
          "From bottom line to top the strings read E-A-D-G-B-E, low to high.",
        ],
      },
      {
        heading: "Fret numbers",
        body: [
          "A number on a line means: press that fret on that string and pick it. 0 means play the string open. 3 on the bottom line is the 3rd fret of the low E string - a G note. Numbers in a horizontal row are played one after another, left to right.",
          "Numbers stacked vertically are played at the same time - that is a chord. A stack reading 0-2-2-1-0-0 from bottom to top is the open E major chord.",
        ],
      },
      {
        heading: "Common symbols",
        body: [
          "h = hammer-on (5h7: pick the 5th fret, then hammer a finger onto the 7th without picking again). p = pull-off (7p5: the reverse). / or \\ = slide between frets. b = bend the string up in pitch. x = muted string, a percussive click. ~ = let the note ring or add vibrato.",
          "Plain tab usually does not show rhythm precisely. Spacing hints at timing, but listen to a recording when one exists - and when it does not, count evenly and keep the notes in a steady pulse.",
        ],
      },
    ],
    practice: [
      "Write out the tab for the open E major and A minor chords yourself as vertical stacks, then check them against a chord chart.",
      "Play this riff from tab only, on the low E string: 0-3-5, 0-3-6-5 (the Smoke on the Water rhythm, one string version). All notes on the bottom line.",
      "Find the tab for a simple riff you have never heard, learn four bars from the tab alone, then listen to the song and compare.",
      "Practice one hammer-on line (5h7 on the 3rd string) and one pull-off line (7p5) ten times each, slow.",
    ],
    watchOut: "Reading the lines upside down. The top line of tab is the highest-sounding, thinnest string - not the one nearest the ceiling when you hold the guitar.",
  },

  "shw-gtr-first-songs": {
    intro: [
      "Drills build skills, but songs make you a guitarist. A complete song forces everything at once: changes, rhythm, endurance, and memory - and it gives you something to actually play for people.",
      "The goal: three complete songs, start to finish, from memory.",
    ],
    sections: [
      {
        heading: "Pick the right songs",
        body: [
          "Choose songs with three or four open chords, a steady tempo, and no barre chords. Classic beginner picks: Knockin' on Heaven's Door (G, D, Am, C), Three Little Birds (A, D, E), Stand By Me (G, Em, C, D). Thousands of songs use G-C-D or G-Em-C-D - search for \"three chord songs\" and pick ones you actually like, because you will play them hundreds of times.",
        ],
      },
      {
        heading: "Learn the map before the notes",
        body: [
          "Every song has a structure: intro, verse, chorus, maybe a bridge. Write the chord sequence for each section on one sheet - for example, verse: G-D-Am-Am, chorus: G-D-C-C. Learning eight bars of structure is easier than memorizing three minutes of music, because songs repeat.",
        ],
      },
      {
        heading: "Play through, never stop",
        body: [
          "Practice performance is different from practice: play the whole song top to bottom and do not stop for mistakes. A flubbed chord in bar 12 does not matter if the song keeps moving. Stopping to fix errors trains you to stop; playing through trains you to recover - which is the actual skill.",
        ],
      },
    ],
    practice: [
      "Pick three songs that use only chords you know. Write out each song's section map on one page.",
      "Learn song one section by section: loop the verse progression with a metronome at 60 bpm until smooth, then the chorus, then join them.",
      "Play song one start to finish three times in a row without stopping, mistakes and all.",
      "Repeat the process for songs two and three over the following weeks.",
      "Once all three are solid, put the paper away and play each from memory. Then play one for another person.",
    ],
    watchOut: "Endlessly practicing the intro. Most beginners play the first eight bars beautifully and have never reached the bridge. Practice the whole song - especially the parts you avoid.",
  },

  "shw-pno-hands-together": {
    intro: [
      "Playing hands together is the moment piano becomes piano: melody in one hand, harmony in the other, one brain running both. It feels impossible for about two weeks, and then it suddenly does not.",
      "You will play a melody with block chords underneath at a slow, steady tempo.",
    ],
    sections: [
      {
        heading: "Hands separate first - really",
        body: [
          "Learn each hand alone until it is automatic, not merely correct. The test: you can play the right hand while saying the alphabet out loud. If a hand still needs your full attention, combining will collapse. Most hands-together problems are actually hands-separate problems in disguise.",
        ],
      },
      {
        heading: "Line up the landmarks",
        body: [
          "Before combining, mark where the hands play at the same time. With a melody over block chords, the left hand usually lands on beat 1 of each bar while the right keeps moving. Say it out loud as you play slowly: \"together, right, right, right, together...\" Knowing exactly when the hands coincide is half the coordination.",
        ],
      },
      {
        heading: "Small chunks, glacial tempo",
        body: [
          "Combine two bars at a time at a tempo that feels insultingly slow - 50 bpm or less, one melody note per click if needed. Play the chunk hands together three times perfectly, then move to the next two bars, then join chunks. Slow and correct becomes fast and correct; fast and sloppy becomes only sloppy.",
        ],
      },
    ],
    practice: [
      "Choose a piece with a right-hand melody and one left-hand block chord per bar (C, F, and G triads work well).",
      "Practice each hand alone until you can play it while talking. Right hand with a metronome at 60 bpm; left hand the same.",
      "Mark every spot where both hands play together. Tap the rhythm hands on knees - left taps bar starts, right taps the melody rhythm - before touching the keys.",
      "Set the metronome to 50 bpm and combine bars 1-2 only. Three perfect repetitions before adding bars 3-4.",
      "Join the chunks and play the full piece hands together at 50 bpm, then nudge up 5 bpm per day as long as it stays clean.",
    ],
    watchOut: "Combining hands too early and too fast. If you cannot play each hand alone on autopilot, hands together will fall apart - and practicing the fall-apart just rehearses failure. Slow down until it is boring, then speed up.",
  },

  "shw-pno-easy-scales": {
    intro: [
      "Scales are not a chore - they are the fingering system of the piano. The thumb-under move you learn here is the same move that powers every fast passage you will ever play.",
      "You will play C, G, D, and F major, one octave, hands separate, with correct standard fingering.",
    ],
    sections: [
      {
        heading: "Finger numbers and the thumb-under",
        body: [
          "Fingers are numbered 1 (thumb) to 5 (pinky) on both hands. You have five fingers and a scale has eight notes, so the thumb must pass under the hand mid-scale.",
          "Right hand going up in C: 1-2-3 on C-D-E, then the thumb slips under the 3rd finger to land on F, and 1-2-3-4-5 finishes F-G-A-B-C. Full fingering: 1-2-3-1-2-3-4-5. Coming down, reverse it, and the 3rd finger crosses over the thumb.",
        ],
      },
      {
        heading: "The left hand mirrors it",
        body: [
          "Left hand going up in C starts on the pinky: 5-4-3-2-1, then the 3rd finger crosses over the thumb: 3-2-1. Full fingering: 5-4-3-2-1-3-2-1. Going down, it is 1-2-3 then thumb under to 1-2-3-4-5.",
          "G and D major use exactly the same fingerings as C in both hands. Only the key signature changes: G has F#, D has F# and C#.",
        ],
      },
      {
        heading: "F major: the one exception",
        body: [
          "In F major the right hand cannot put the thumb on the black key Bb, so the fingering changes: 1-2-3-4 on F-G-A-Bb, thumb under to C, then 1-2-3-4 to finish. The left hand stays standard: 5-4-3-2-1-3-2-1. Memorize F as the odd one out now and it will never surprise you.",
        ],
      },
    ],
    practice: [
      "Right hand only: play C major up and down at 60 bpm, one note per click, saying the finger numbers out loud (1-2-3-1-2-3-4-5).",
      "Left hand only: same drill, saying 5-4-3-2-1-3-2-1.",
      "Practice just the crossing: loop E-F-G with fingers 3-1-2 (right hand) ten times, keeping the wrist level and quiet.",
      "Repeat the full drill in G, then D, watching for the sharps.",
      "Learn F major right hand separately (1-2-3-4-1-2-3-4), then run all four scales daily, hands separate, at 60 bpm.",
    ],
    watchOut: "Twisting the elbow or flicking the wrist during the thumb-under. The thumb should glide under a quiet, level hand - if your elbow swings out at every crossing, slow down and fix it now, because this habit caps your speed forever.",
  },

  "shw-pno-accompaniment": {
    intro: [
      "Block chords get boring fast. Break a chord into a moving pattern and the left hand turns from a metronome into an accompanist - the difference between plunking and playing.",
      "You will accompany a melody or singer with two different left-hand patterns.",
    ],
    sections: [
      {
        heading: "Broken triads",
        body: [
          "Take a C triad (C-E-G, left-hand fingers 5-3-1) and play the notes one at a time instead of together: C, E, G, E, repeating evenly, one note per beat. That is a broken chord. Keep the hand in shape over all three keys the whole time - only the fingers move, not the arm.",
          "Practice the same pattern on F (F-A-C) and G (G-B-D), then chain them: one bar each of C, F, G, C.",
        ],
      },
      {
        heading: "Root-fifth-octave",
        body: [
          "Play C with finger 5, G with finger 2, and the C an octave up with the thumb: root, fifth, octave. It sounds open and strong - pop ballads and folk songs live on this pattern. Play it as three even notes per bar, or root-fifth-octave-fifth for four beats.",
          "Because there is no 3rd in it, the same shape works over major and minor chords - shift the whole hand so finger 5 sits on the new root.",
        ],
      },
      {
        heading: "Waltz bass",
        body: [
          "For songs in 3/4 time: beat 1, play the root alone, low (finger 5); beats 2 and 3, play the rest of the chord together twice, higher (fingers 3-1 or 2-1). Count \"OOM-pah-pah.\" In C: low C, then E-G together, E-G together. The jump from the low root to the chord is the skill - practice the leap slowly, eyes on the target before the hand moves.",
        ],
      },
    ],
    practice: [
      "Set a metronome to 60 bpm and play broken triads (C-E-G-E) one note per beat, four bars on C, then move the pattern to F and G.",
      "Play the progression C-F-G-C, one bar of broken chords each, without stopping between chords. Three clean loops.",
      "Drill root-fifth-octave on C, F, and G, four bars each at 60 bpm, then chain the progression.",
      "Practice waltz bass in C at 60 bpm: OOM-pah-pah for eight bars, then through C-F-G-C.",
      "Put a simple right-hand melody (or a singer) over each pattern and play the accompaniment without dropping the pulse.",
    ],
    watchOut: "Letting the left hand thump every note at the same volume. Accompaniment sits under the melody - keep the pattern light and even, with a small lean on beat 1, or it will bury the tune it is supposed to support.",
  },

  "shw-pno-first-songs": {
    intro: [
      "Everything so far - hands together, scales, accompaniment patterns - was building toward this: complete songs, both hands, start to finish. Finished songs are what make practice feel worth it, and playing three from memory proves the skills are actually yours.",
    ],
    sections: [
      {
        heading: "Choose easy arrangements, not easy songs",
        body: [
          "Almost any song exists in an easy arrangement: right-hand melody with one left-hand chord or pattern per bar, in C, G, or F. Pick three pieces you genuinely like at that level - beginner books, easy-piano sheet music, or a lead sheet where you add your own left hand from the chord symbols using patterns you already know.",
        ],
      },
      {
        heading: "Learn in sections, then link",
        body: [
          "Divide the piece into 4-bar sections. For each: right hand alone, left hand alone, then hands together at 50-60 bpm, three clean repetitions before moving on. Then link sections in pairs, always practicing the seam - the last bar of one section into the first bar of the next - because the joins are where memory breaks.",
        ],
      },
      {
        heading: "Memorize on purpose",
        body: [
          "Memory comes from three sources: your fingers (muscle memory), your ears (how it should sound), and your head (knowing the chords - \"verse is C-Am-F-G\"). Muscle memory alone fails under pressure. Test the other two: name the chord progression away from the piano, and start the piece from the beginning of any section, not just bar one.",
        ],
      },
    ],
    practice: [
      "Pick three easy arrangements or lead sheets in C, G, or F using only chords and patterns you know.",
      "Learn song one in 4-bar sections: hands separate, then together at 50 bpm, three clean repetitions per section.",
      "Practice every seam between sections five times, then play the whole song through without stopping, even through mistakes.",
      "Write the chord progression from memory on paper, then play the song with the sheet music closed.",
      "Repeat for songs two and three, and keep song one alive by playing it once a day.",
      "Play all three from memory for someone else.",
    ],
    watchOut: "Restarting from the top after every mistake. It trains a great first line and a shaky everything else - practice playing through errors and starting from the middle of the piece.",
  },
};
