/* ==========================================================
   config.js – hier änderst du ALLE Texte, Bilder und Einstellungen.
   Leere Strings ("") bedeuten: nicht verwendet (z. B. kein Foto).
   Absätze in Texten trennst du mit einer Leerzeile (\n\n).
   ========================================================== */
window.CONFIG = {
  name: "Pascal",

  intro: {
    title: "Für Pascal",
    quote: "Manche Menschen bringen selbst die dunkelste Nacht zum Leuchten.",
    buttonText: "Entdecke dein Universum",
    hintAfterStart: "Berühre die leuchtenden Sterne."
  },

  /* Beschriftungen der Oberfläche */
  ui: {
    progress: "{n} von {total} Erinnerungen entdeckt",
    tipNew: "Erinnerung entdecken",
    tipFound: "Noch einmal ansehen",
    tipLocked: "Noch verborgen",
    tipFinale: "Öffne die Überraschung",
    hintUnlocked: "Ein letzter Stern leuchtet für dich.",
    close: "Schließen",
    reset: "Von vorne beginnen",
    resetConfirm: "Fortschritt wirklich zurücksetzen?"
  },

  /* Die sechs Sterne. pos = Position in Bruchteilen der Bildschirmgröße (0–1).
     Reihenfolge = Reihenfolge der Verbindungslinien. Der letzte Stern ist das Finale. */
  memories: [
    { id: "erinnerungen", title: "Unsere Erinnerungen",
      text: "MOZZART",
      image: "assets/images/erinnerung1.jpg", imageAlt: "Zwei Personen vor dem MOZZART-Schriftzug", imagePosition: "50% 62%", pos: { x: 0.18, y: 0.62 } },
    { id: "moment", title: "Rhein in Flammen",
      text: "",
      image: "assets/images/erinnerung2.jpg", imageAlt: "Selfie von vier Personen bei Rhein in Flammen", imagePosition: "50% 35%", pos: { x: 0.30, y: 0.30 } },
    { id: "besonders", title: "Was dich besonders macht",
      text: "Pascal, du bist ein liebevoller und hilfsbereiter Mensch, auf den man sich immer verlassen kann. Mit deiner netten Art und deinem Humor bringst du andere zum Lachen. Bleib so, wie du bist!",
      image: "", imageAlt: "", pos: { x: 0.50, y: 0.52 } },
    { id: "laecheln", title: "Ein kleines Lächeln",
      text: "Nimm 2",
      image: "", imageAlt: "", pos: { x: 0.66, y: 0.24 } },
    { id: "wuensche", title: "Wünsche für deine Zukunft",
      text: "Ich wünsche dir für deine Zukunft ganz viel Glück, Gesundheit und Erfolg. Vor allem wünsche ich dir viel Erfolg bei deinem Meister. Ich bin mir sicher, dass du das packst!",
      image: "", imageAlt: "", pos: { x: 0.82, y: 0.58 } },
    { id: "ueberraschung", type: "finale", title: "Eine geheime Überraschung",
      text: "Dieser Stern hütet das große Finale.\n\nEr leuchtet erst, wenn du alle anderen Erinnerungen entdeckt hast.",
      image: "", imageAlt: "", pos: { x: 0.50, y: 0.76 } }
  ],

  finale: {
    headline: "Alles Gute zum Geburtstag, Pascal!",
    message:
      "Lieber Pascal,\n\n" +
      "dieser Sternenhimmel ist nur für dich.\n\n" +
      "Jeder einzelne Stern steht für einen besonderen Moment, ein Lächeln oder eine Erinnerung.\n\n" +
      "Ich wünsche dir von Herzen alles Gute zum Geburtstag, ganz viel Glück, Gesundheit und unvergessliche Momente.\n\n" +
      "Und vergiss niemals: Auch wenn der Himmel manchmal dunkel erscheint, gibt es immer Sterne, die für dich leuchten.",
    restartText: "Den Sternenhimmel erneut entdecken"
  },

  /* Audio ist optional. Fehlt eine Datei, bleibt die Funktion einfach aus. */
  audio: {
    music: "assets/audio/hintergrundmusik.mp3",
    musicVolume: 0.35,
    click: "",     // z. B. "assets/audio/klick.mp3"
    open: "",
    unlock: "",
    finale: ""
  },

  animation: {
    starsFadeInMs: 3200,
    titleDelayMs: 1800,
    quoteDelayMs: 3400,
    buttonDelayMs: 5600,
    starCountMin: 200,
    starCountMax: 500,
    starCountMobileMax: 220,
    parallaxStrength: 22,
    shootingStarMinSec: 7,
    shootingStarMaxSec: 16
  }
};
