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
      text: "Platzhalter: Schreibe hier eine persönliche Erinnerung an eine gemeinsame Zeit.\n\nWie war es damals? Was habt ihr erlebt, und warum denkst du gern daran zurück?",
      image: "assets/images/erinnerung1.jpg", imageAlt: "Gemeinsames Foto", pos: { x: 0.18, y: 0.62 } },
    { id: "moment", title: "Ein besonderer Moment",
      text: "Platzhalter: Beschreibe hier ein besonderes gemeinsames Erlebnis, einen Ausflug, ein Fest oder einen ganz gewöhnlichen Tag, der unvergesslich wurde.",
      image: "assets/images/erinnerung2.jpg", imageAlt: "Foto vom besonderen Moment", pos: { x: 0.30, y: 0.30 } },
    { id: "besonders", title: "Was dich besonders macht",
      text: "Platzhalter: Schreibe hier, was Pascal zu einem besonderen Menschen macht.\n\nEigenschaften, kleine Gesten, Dinge, für die du dankbar bist.",
      image: "", imageAlt: "", pos: { x: 0.50, y: 0.52 } },
    { id: "laecheln", title: "Ein kleines Lächeln",
      text: "Platzhalter: Hier ist Platz für eine lustige Geschichte, einen Insider-Witz oder ein Foto, bei dem ihr beide lachen müsst.",
      image: "assets/images/erinnerung3.jpg", imageAlt: "Lustiges Foto", pos: { x: 0.66, y: 0.24 } },
    { id: "wuensche", title: "Wünsche für deine Zukunft",
      text: "Platzhalter: Für das neue Lebensjahr wünsche ich dir Gesundheit, Glück, Mut für neue Wege und viele Momente, die du nie vergisst.",
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
