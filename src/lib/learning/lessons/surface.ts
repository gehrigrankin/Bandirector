import type { Lesson } from "./types";

export const SURFACE_LESSONS: Record<string, Lesson> = {
  "srf-note-names": {
    intro: [
      "Every scale, chord, and song is built from just twelve notes that repeat over and over. Learn their names now and everything that follows has a language.",
      "By the end of this you will be able to name any note and locate it on a guitar neck or a keyboard without guessing.",
    ],
    sections: [
      {
        heading: "Seven letters, then repeat",
        body: [
          "Music uses only the letters A, B, C, D, E, F, G. After G you start over at A. These seven are the natural notes - on a piano, they are all the white keys.",
          "When you go from one A up to the next A, that distance is an octave. The higher A vibrates exactly twice as fast, which is why the two notes sound like the same note, just higher. Octaves are why the alphabet can repeat forever up and down your instrument.",
        ],
      },
      {
        heading: "Sharps and flats fill the gaps",
        body: [
          "Between most neighboring letters there is one extra note. It has two names: the sharp of the note below it or the flat of the note above it. The note between C and D is both C sharp and D flat - same pitch, two names.",
          "Two pairs have no note between them: B to C, and E to F. Memorize those two exceptions. Count it out: A, A#, B, C, C#, D, D#, E, F, F#, G, G#, then A again. Twelve notes total.",
        ],
      },
      {
        heading: "Half steps on your instrument",
        body: [
          "The distance from any note to the very next one is a half step. On guitar, one fret equals one half step, so moving up one fret on any string raises the pitch by one note in the twelve-note cycle. On piano, a half step is the very next key, black or white - E to F is white to white because there is no black key between them.",
        ],
      },
    ],
    practice: [
      "Say the musical alphabet forward from A to G ten times, then backward from G to A ten times, until both are automatic.",
      "Recite all twelve notes in order starting from A, including sharps, without skipping B-C and E-F.",
      "On piano, play every C on the keyboard, then every F. On guitar, find every C on the low E and A strings using the fret-equals-half-step rule from the open string.",
      "Pick a random letter, then name the note one half step above it and one half step below it. Do ten rounds.",
      "On your instrument, start on any note, name it out loud, then move up one half step at a time, naming each note until you return to the starting letter.",
    ],
    watchOut:
      "Forgetting that B-C and E-F have no sharp between them. If your counting drifts by one fret or one key, this is almost always why.",
  },

  "srf-rhythm-counting": {
    intro: [
      "Rhythm is the skill that makes you playable-with. A wrong note in time sounds like music; the right note out of time sounds like a mistake. Counting out loud is how you build an internal clock.",
      "After this lesson you can clap and count simple rhythms in 4/4 and keep your place in a bar.",
    ],
    sections: [
      {
        heading: "The beat and the bar",
        body: [
          "The beat is the steady pulse you tap your foot to. Beats are grouped into bars (also called measures). The most common grouping is 4/4 time: four beats per bar, counted 1, 2, 3, 4, then a new bar starts and you count 1 again.",
          "Beat 1 is the strongest - it is where you feel the music restart. If you get lost, listen for that emphasis and rejoin on the next 1.",
        ],
      },
      {
        heading: "Quarter notes and eighth notes",
        body: [
          "A quarter note lasts one beat. Four quarter notes fill a bar of 4/4, one per count: 1, 2, 3, 4.",
          "An eighth note lasts half a beat, so two fit inside each beat. Count them by adding the word 'and' between the numbers: 1 and 2 and 3 and 4 and. The numbers are downbeats, the ands are offbeats. Say every syllable evenly, like a ticking clock split in two.",
        ],
      },
      {
        heading: "Rests are notes too",
        body: [
          "A rest is a beat of deliberate silence. It still gets counted - you just do not clap or play. Keep counting through rests at full volume in your head or out loud; the pulse never stops, only the sound does.",
        ],
      },
    ],
    practice: [
      "Set a metronome to 60 bpm. Count 1, 2, 3, 4 out loud with the clicks for two minutes, clapping on every beat.",
      "Same tempo: keep clapping quarter notes but count 1 and 2 and 3 and 4 and out loud, so your voice fills the space between claps.",
      "Now clap the eighth notes too - two even claps per click - while counting. Two minutes without speeding up.",
      "Clap this one-bar pattern four times through: clap on 1, 2, rest on 3, clap on the and of 3 and on 4. Count every syllable out loud including the silent beat.",
      "Put on a song with a steady drum beat, find beat 1, and count bars out loud for one minute without losing your place.",
    ],
    watchOut:
      "Stopping the count when you make a mistake. The pulse never pauses for you - train yourself to keep counting and rejoin on the next beat instead of restarting the bar.",
  },

  "srf-chord-charts": {
    intro: [
      "Most songs are shared as a chord chart: lyrics with chord symbols written above the words. Learn to read this format and thousands of songs open up to you for free.",
      "By the end you can take a chart for a song you know and play along from top to bottom without getting lost.",
    ],
    sections: [
      {
        heading: "What the symbols mean",
        body: [
          "A chord symbol names the chord's root note and quality. A capital letter alone means a major chord: G means G major. A lowercase m after the letter means minor: Am is A minor. A 7 means a seventh chord: D7. Sharps and flats attach to the root: F#m, Bb.",
          "On guitar you play these as chord shapes; on piano you play the chord's notes together in your hand. The symbol tells you what harmony to make, not exactly how - that freedom is the point of the format.",
        ],
      },
      {
        heading: "Where to change",
        body: [
          "Each chord symbol sits above the word or syllable where the change happens. Play that chord and keep playing it until the next symbol appears - even if that is two lines later. No new symbol means no change.",
          "Charts assume you know the song's rhythm and tempo from the recording. Listen to the song first, then use the chart as a map of the changes, not a substitute for your ears.",
        ],
      },
      {
        heading: "Navigating the form",
        body: [
          "Charts label song parts: Verse, Chorus, Bridge, Intro. When a section repeats, many charts do not rewrite it - a second verse often reuses the first verse's chords. Scan the whole chart before playing so repeats do not surprise you.",
        ],
      },
    ],
    practice: [
      "Find a chart for a song you know well that uses only chords you can play. Read it away from your instrument first, tapping the moment of each chord change while singing or humming the melody.",
      "Play through the chart giving every chord one slow strum or one held piano chord at each symbol, letting it ring until the next change.",
      "Play along with the recording at full speed, keeping your place even if you flub changes.",
      "Repeat with a second song, this time noting the section labels and predicting the chorus chords before you reach them.",
    ],
    watchOut:
      "Stopping when a change goes wrong. The song keeps moving - skip the missed chord and land on the next one. Staying in the song matters more than catching every chord.",
  },

  "srf-gtr-anatomy": {
    intro: [
      "You cannot follow a single instruction - or sound good for a single minute - without knowing your string names and being in tune. This is day one for a reason.",
      "After this you can name every open string instantly and tune your guitar from scratch with a tuner.",
    ],
    sections: [
      {
        heading: "The six strings",
        body: [
          "From the thickest string to the thinnest, the open strings are E, A, D, G, B, E. The thick E is the low E (lowest pitch, closest to your face when playing); the thin E is the high E. Strings are numbered in reverse of what you might expect: the thin high E is string 1 and the thick low E is string 6.",
          "Use a memory phrase for E-A-D-G-B-E, such as Eddie Ate Dynamite, Good Bye Eddie. Say it thick-to-thin every time you pick up the guitar until it sticks.",
        ],
      },
      {
        heading: "Frets and the neck",
        body: [
          "The metal strips across the neck are frets. Pressing a string down just behind a fret shortens it and raises the pitch by one half step per fret. Frets are numbered from the headstock: fret 1 is nearest the nut (the slotted strip at the top of the neck). Fret markers - dots at frets 3, 5, 7, 9, and a double dot at 12 - help you find positions fast. At fret 12 each string repeats its open note an octave higher.",
        ],
      },
      {
        heading: "Tuning with a tuner",
        body: [
          "Clip a tuner to the headstock or use a tuner app. Pluck one string at a time and watch the display: it shows the nearest note name and whether you are flat (too low) or sharp (too high). Turn that string's tuning peg slowly - small turns matter - until the display centers on the correct note: E A D G B E, thick to thin.",
          "If you are below the target note, tune up to it. If you are above it, drop below and come back up - strings hold tune better when the final move is upward.",
        ],
      },
    ],
    practice: [
      "Say the open string names thick to thin, then thin to thick, five times each while touching each string as you name it.",
      "Detune each string slightly on purpose, then tune all six back with a tuner. Repeat until a full tune-up takes under two minutes.",
      "Pluck a random string without looking at your hands and name it before checking.",
      "Find fret 5 and fret 12 on the low E string by the dot markers alone, without counting frets one by one.",
      "Tune up at the start of every practice session this week, every time, no exceptions.",
    ],
    watchOut:
      "Turning the wrong tuning peg while watching the tuner and wondering why nothing changes - or snapping a string by cranking it far too high. Always trace the string to its peg first, and turn slowly.",
  },

  "srf-gtr-fretting": {
    intro: [
      "Buzzing, thudding, dead notes - almost all of it comes down to where and how your fingertip meets the string. Fix that now and every chord and riff you ever learn gets easier.",
      "The goal: single notes that ring clean and clear on any string, any fret.",
    ],
    sections: [
      {
        heading: "Where to press",
        body: [
          "Press the string just behind the fret wire - close to it, but not on top of it. Right behind the fret you need surprisingly little pressure for a clean note. Back in the middle of the fret space you have to squeeze hard and you still buzz.",
          "Use the very tip of your finger, not the pad, and arch the finger so it comes down on the string like a hammer, nearly vertical. A collapsed, flat finger will lean against the neighboring string and mute it.",
        ],
      },
      {
        heading: "Thumb and wrist",
        body: [
          "Rest your thumb on the back of the neck, roughly opposite your middle finger, pointing up. This lets your fingers curl over the fretboard. Keep the wrist relaxed with a gentle bend - not kinked. If your thumb hooks over the top of the neck this early, your fingers flatten and notes die.",
          "Fingers are numbered 1 to 4 from index to pinky. Instructions like 'first finger, third fret' mean index finger pressing at fret 3.",
        ],
      },
      {
        heading: "Picking one string",
        body: [
          "Hold the pick between the pad of your thumb and the side of your index finger, with just the tip poking out. Pick with a small motion from the wrist, not the whole arm, and aim to hit only the string you want. Pick right after you press, and keep pressing while the note rings - releasing early chokes it.",
        ],
      },
    ],
    practice: [
      "On the high E string, fret 5 with finger 1. Pick it. If it buzzes, slide closer to the fret; if it is muted, arch the finger more. Get five clean notes in a row.",
      "Play frets 5-6-7-8 on the high E using fingers 1-2-3-4, one finger per fret. Then the same on every string down to low E, slowly, every note clean.",
      "Set a metronome to 60 bpm and play that 5-6-7-8 pattern one note per click across all six strings without stopping.",
      "Press a note with the least pressure that still sounds clean - back off until it buzzes, then add just enough. Do this on three different strings.",
      "Reverse the pattern: 8-7-6-5 with fingers 4-3-2-1 across all strings at 60 bpm.",
    ],
    watchOut:
      "Fretting in the middle of the fret space instead of right behind the fret wire, then compensating by squeezing harder. That causes buzz, sore hands, and notes pulled out of tune.",
  },

  "srf-gtr-open-chords": {
    intro: [
      "E, A, D, G, and C are the shapes behind thousands of songs - campfire classics to stadium rock. Learn these five and you can play real music this week.",
      "The goal is to form each shape from memory with every string that should ring, ringing.",
    ],
    sections: [
      {
        heading: "E and A",
        body: [
          "E major: finger 1 on the G string fret 1, finger 2 on the A string fret 2, finger 3 on the D string fret 2. Strum all six strings.",
          "A major: fingers 1, 2, and 3 in a row across fret 2 on the D, G, and B strings. Strum from the A string down - do not hit the low E. Crowded? Bunch the fingers diagonally, or try fingers 2-3-4.",
        ],
      },
      {
        heading: "D and G",
        body: [
          "D major: finger 1 on the G string fret 2, finger 3 on the B string fret 3, finger 2 on the high E string fret 2 - a small triangle. Strum only the top four strings, starting from the open D.",
          "G major: finger 2 on the low E string fret 3, finger 1 on the A string fret 2, finger 3 on the high E string fret 3. Strum all six strings.",
        ],
      },
      {
        heading: "C, and checking your work",
        body: [
          "C major: finger 3 on the A string fret 3, finger 2 on the D string fret 2, finger 1 on the B string fret 1 - a diagonal staircase. Strum from the A string down, skipping the low E.",
          "For every chord, do a string check: pick each string one at a time. Buzz means press closer behind the fret; a dead thud usually means a neighboring finger is touching that string. Fix the one bad string, then strum the whole chord.",
        ],
      },
    ],
    practice: [
      "Form E major, then pick each string individually and fix any that do not ring. Repeat for A, D, G, and C.",
      "For each chord: form it, strum once, take your hand completely off the neck, and re-form it from memory. Ten times per chord.",
      "Close your eyes and form each shape by feel, then open your eyes and string-check it.",
      "Set a metronome to 50 bpm and strum one chord per click, cycling E, A, D, G, C - a slow change on every beat.",
      "Practice the two hardest switches for most beginners, G to C and C to D, twenty times each, slowly.",
    ],
    watchOut:
      "Strumming strings that do not belong in the chord - the low E on A, C, and D ruins the sound. Learn which string each chord starts from as part of the shape itself.",
  },

  "srf-gtr-strumming": {
    intro: [
      "Strumming is the engine of rhythm guitar. Chords are what you play; strumming is when - and the when is what makes people tap their feet.",
      "By the end you will play the most useful strumming pattern in popular music, D-DU-UDU, smoothly and in time.",
    ],
    sections: [
      {
        heading: "The motion",
        body: [
          "Strum from the wrist and elbow together in a loose, brushing motion, like shaking water off your hand. Hold the pick lightly and let it glide across the strings - if you are catching or getting a harsh attack, your grip is too tight or you are digging in too deep.",
          "Downstrums sweep toward the floor, upstrums toward the ceiling. Upstrums do not need to hit all the strings; catching the top three or four is normal and sounds right.",
        ],
      },
      {
        heading: "The golden rule: the arm never stops",
        body: [
          "Your strumming arm swings down and up continuously, like a pendulum: down on each beat (1, 2, 3, 4), up on each 'and'. To skip a strum, keep the arm moving but miss the strings on purpose. Never freeze the arm - it is your built-in metronome.",
        ],
      },
      {
        heading: "Building D-DU-UDU",
        body: [
          "Count one bar of eighth notes: 1 and 2 and 3 and 4 and. The pattern is: down on 1, down on 2, up on the and of 2, up on the and of 3, down on 4, up on the and of 4. You skip the strum on the and of 1 and on beat 3 - but the arm still travels through both.",
          "Say it out loud as you play: down, down-up, up-down-up. That missed downstrum on beat 3 is what gives the pattern its bounce.",
        ],
      },
    ],
    practice: [
      "Mute the strings with your fretting hand laid flat across them and strum continuous down-up eighth notes for two minutes - just the motion, a percussive scratch.",
      "Set a metronome to 60 bpm. Hold E major and play downstrums only on each click for one minute without the arm stopping between beats.",
      "Add upstrums: down-up on every click (1 and 2 and 3 and 4 and), still on E major, still 60 bpm.",
      "Play D-DU-UDU on E major at 60 bpm, saying 'down, down-up, up-down-up' out loud. Ten clean bars in a row.",
      "Do the same pattern on A, then on D. Then try switching chords once per bar without breaking the pattern.",
    ],
    watchOut:
      "Stopping the strumming arm during skipped strums. The moment the pendulum freezes, your timing collapses - keep the arm moving and miss the strings instead.",
  },

  "srf-pno-geography": {
    intro: [
      "The piano keyboard looks like a wall of identical white keys - until you learn to read the black-key pattern. Then every note has a fixed address you can find in a split second.",
      "By the end you can put a finger on any white key by name, anywhere on the keyboard, without counting from middle C.",
    ],
    sections: [
      {
        heading: "The black keys are the map",
        body: [
          "Black keys alternate in groups of two and three, repeating all the way up the keyboard. This pattern is your map. C is always the white key immediately to the left of a group of two black keys. Find every group of two and you have found every C.",
          "F is the white key immediately to the left of a group of three black keys. With C and F as anchors, the rest fall into place: C-D-E sit around the two black keys, F-G-A-B around the three.",
        ],
      },
      {
        heading: "Octaves and middle C",
        body: [
          "The pattern C-D-E-F-G-A-B repeats every octave - from one C to the next is eight white keys and the same layout every time. Learn one octave and you have learned the whole keyboard.",
          "Middle C is the C nearest the middle of the instrument, roughly in front of the maker's logo on most pianos. It is the landmark that sheet music and most lessons refer to, but do not depend on counting up from it - use the black-key groups wherever your hand happens to be.",
        ],
      },
      {
        heading: "Finger numbers",
        body: [
          "Piano fingering numbers both hands the same way: thumb is 1, index is 2, middle is 3, ring is 4, pinky is 5. When a lesson says 'right hand 1 on C', that is your right thumb on C. Say the numbers while wiggling each finger until the mapping is instant - fingering instructions run through everything you will learn from here on.",
        ],
      },
    ],
    practice: [
      "Play every C on your keyboard from lowest to highest using the two-black-key rule, saying 'C' on each. Then do the same for every F using the three-black-key rule.",
      "Pick one octave and play the white keys up from C, naming each out loud: C, D, E, F, G, A, B, C. Then come back down with the names reversed.",
      "Have someone call out random white-key names (or shuffle written cards) and touch the key in under two seconds, anywhere on the keyboard.",
      "Play D in five different octaves, then B in five different octaves, using the black-key groups to orient each time.",
      "With eyes closed, feel for a group of two black keys, place a finger on C, open your eyes and check. Repeat for F with a group of three.",
    ],
    watchOut:
      "Counting up key by key from middle C to find every note. It works but it is slow and it never becomes automatic - force yourself to use the black-key groups from the start.",
  },

  "srf-pno-posture": {
    intro: [
      "How you sit and shape your hands decides how fast you can play, how good you sound, and whether your wrists hurt in a year. Set the habits now while there is nothing to unlearn.",
      "The goal is a relaxed, rounded hand that can play a five-finger pattern with no tension.",
    ],
    sections: [
      {
        heading: "The bench and your body",
        body: [
          "Sit on the front half of the bench, feet flat on the floor, facing the middle of the keyboard. Set the bench height so your forearms are level with the keys and your elbows sit slightly in front of your body, bent at about a right angle. If your wrists slope uphill to the keys, sit higher; if your elbows ride above the keys, sit lower.",
          "Sit tall but not stiff - shoulders down and relaxed, not creeping toward your ears.",
        ],
      },
      {
        heading: "The hand shape",
        body: [
          "Let your arm hang loose at your side and look at your hand: gently curved fingers, relaxed. That exact shape goes to the keyboard - as if holding a bubble you must not pop. Play on the pads of the fingers with each finger gently curved, never buckled flat or collapsed at the first joint.",
          "Keep the wrist level and floating - roughly in line with the forearm, neither drooping below the keys nor arched up high. The thumb plays on the side of its tip.",
        ],
      },
      {
        heading: "Five-finger position",
        body: [
          "Place right-hand fingers 1 through 5 (thumb to pinky) on C, D, E, F, G, one finger per key. Left hand: pinky (5) on the C below middle C, up to thumb (1) on G. This is C position - home base for early pieces.",
          "Press each key from the finger with the arm's weight behind it, and release without pulling the hand away. The non-playing fingers rest lightly on their keys, not hovering stiffly in the air.",
        ],
      },
    ],
    practice: [
      "Check your setup: feet flat, forearms level with the keys, elbows slightly forward. Adjust the bench (or add a cushion) before every session this week.",
      "Do the arm-dangle test - let your hand hang, see the natural curve, and carry that shape to the keys. Repeat five times until it feels normal.",
      "In right-hand C position, play C-D-E-F-G up and back down (fingers 1-2-3-4-5-4-3-2-1), slowly, watching that no finger flattens and the wrist stays level.",
      "Same exercise, left hand: fingers 5-4-3-2-1-2-3-4-5 from low C up to G and back.",
      "Set a metronome to 60 bpm and play the pattern one note per click, hands separately, for two minutes each. Freeze mid-exercise once and check: shoulders down? wrist level? fingers curved?",
    ],
    watchOut:
      "Collapsing wrists that droop below the keyboard. It feels restful but forces the fingers to work from a weak angle and builds tension - keep the wrist floating level with the forearm.",
  },

  "srf-pno-triads": {
    intro: [
      "C, F, and G major are the three chords behind an enormous share of popular music. Put them under your hands and you can accompany real songs almost immediately.",
      "The goal: switch C to F to G and back, in time, hands separately.",
    ],
    sections: [
      {
        heading: "Building the shapes",
        body: [
          "A major triad in root position is three notes: the root, then skip a white key, then skip another. C major is C-E-G. F major is F-A-C. G major is G-B-D. All three use only white keys - same shape, different starting note.",
          "Right hand plays all three with fingers 1-3-5 (thumb, middle, pinky). Left hand uses 5-3-1 (pinky on the bottom note). One finger per note, the skipped keys left open.",
        ],
      },
      {
        heading: "Making them sound like one chord",
        body: [
          "All three notes must strike at exactly the same instant - one sound, not a ripple. Prepare the full hand shape on the key surfaces first, then drop the hand as a unit with the arm behind it. Keep the fingers curved; if the chord splatters, you are pressing finger by finger instead of dropping the hand as one piece.",
        ],
      },
      {
        heading: "Moving between chords",
        body: [
          "Keep the 1-3-5 shape intact and shift the whole hand sideways: C up to F is a jump of three white keys, F up to G is just one. Look at the target's bottom note, move, land ready, then play.",
          "Practice the release-shift-prepare cycle slowly: release the chord, glide to the next position, set all three fingertips on their keys, then sound the chord. Speed comes from shrinking the pause between prepare and play - never from lunging.",
        ],
      },
    ],
    practice: [
      "Right hand: play C major, lift, replace, and replay ten times, listening for all three notes striking together.",
      "Right hand: play C, F, G, F, C as slow whole chords, pausing as long as needed between them to prepare each shape. Five clean cycles.",
      "Same sequence with the left hand (5-3-1), five clean cycles.",
      "Set a metronome to 50 bpm and play one chord every four clicks: C, F, G, C, using the three empty beats to travel and prepare. When that is easy, one chord every two clicks.",
      "Play the loop C-F-G-C for two minutes straight, right hand, one chord per bar at 60 bpm, without stopping - even if a chord splats, keep going.",
    ],
    watchOut:
      "Rolling the chord - notes sounding one after another instead of together. Prepare all three fingertips on the keys before you play, and drop the hand as a single unit.",
  },

  "srf-pno-melody": {
    intro: [
      "Playing a recognizable melody is the moment the piano stops being an exercise machine and starts being an instrument. Hands-separate melody work builds the finger control and steady rhythm everything else stands on.",
      "The goal: a complete simple melody, right hand, with even rhythm - and a held left-hand note underneath.",
    ],
    sections: [
      {
        heading: "One finger per key",
        body: [
          "Start in C position: right-hand fingers 1-5 resting on C-D-E-F-G. Early melodies live inside these five notes, so the rule is simple - each key has its finger, and the finger assigned to a note is the one that plays it. No reaching across with a favorite finger.",
          "Play from the finger with the hand quiet and the wrist level. The hand should look calm even while the fingers work.",
        ],
      },
      {
        heading: "Rhythm before notes",
        body: [
          "Before playing any melody, learn its rhythm alone: count 1, 2, 3, 4 out loud and clap the pattern of long and short notes. A note that lasts two beats gets held while you keep counting - the count never pauses for a long note.",
          "Then play the melody while counting out loud, slowly. Right notes in wobbly rhythm is not a learned melody; steady rhythm at a slow tempo is the real target.",
        ],
      },
      {
        heading: "Adding a left-hand anchor",
        body: [
          "Once the right hand is solid, hold a single low C with the left hand (finger 5) at the start of each phrase or bar and let it ring under the melody. This is not full hands-together playing - it is one held note - but it teaches the hands to coexist and makes everything sound instantly fuller.",
          "Press the left-hand note exactly together with the melody note that starts the bar, then forget about it until the next change.",
        ],
      },
    ],
    practice: [
      "In C position, play C-D-E-F-G-F-E-D-C slowly, one even note per beat, counting out loud. Five clean repetitions.",
      "Learn Mary Had a Little Lamb by ear or from a lesson sheet: E-D-C-D-E-E-E, D-D-D, E-G-G, then E-D-C-D-E-E-E-E, D-D-E-D-C. Fingers 3-2-1-2-3-3-3 to start.",
      "Clap and count the tune's rhythm away from the keys - the third E and the final C are held twice as long - then play it while counting.",
      "Set a metronome to 60 bpm and play the whole melody through without stopping, even if you hit a wrong note.",
      "Add left-hand low C held through each phrase while the right hand plays the tune.",
      "Repeat the melody daily until you can play it from memory, eyes on your hands only at leaps.",
    ],
    watchOut:
      "Stopping to fix every wrong note. Restarting constantly trains hesitation - keep the beat, let the mistake go, and finish the phrase. Fix trouble spots afterward, in isolation.",
  },
};
