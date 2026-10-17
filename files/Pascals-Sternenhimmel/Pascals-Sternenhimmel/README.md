# Pascals Sternenhimmel

Interaktives Geburtstagsgeschenk aus HTML, CSS und JavaScript (kein Backend, keine Bibliotheken).

## Lokal ansehen
`index.html` per Doppelklick öffnen oder in VS Code mit „Live Server“ starten.

## Dateien
- `config.js` – **alle** Texte, Bildpfade, Audio und Animationswerte
- `index.html` – Struktur · `style.css` – Design
- `script.js` – Sternenhimmel, Sternschnuppen, Parallax, Startbildschirm
- `memories.js` – Erinnerungssterne, Fenster, Linien, Fortschritt, Finale, Musik

## Eigene Inhalte einfügen
1. **Texte:** In `config.js` unter `memories` bei `title` und `text` ändern. Eine Leerzeile erzeugt einen neuen Absatz. Die Abschlussnachricht steht unter `finale.message`.
2. **Fotos:** JPG-Dateien nach `assets/images/` legen und den Dateinamen bei `image` eintragen. Leerer String oder fehlende Datei = kein Foto, das Layout bleibt intakt. Tipp: Bilder auf etwa 1200 px Breite verkleinern.
3. **Musik:** MP3 als `assets/audio/hintergrundmusik.mp3` ablegen (oder Pfad in `audio.music` ändern). Ohne Datei erscheint kein Musik-Button. Soundeffekte: Pfade bei `audio.click`, `open`, `unlock`, `finale` eintragen.
4. **Bildausschnitt:** Optional `imagePosition: "50% 30%"` bei einem Stern, falls Gesichter im Fenster abgeschnitten werden.
5. **Sternpositionen:** `pos` (x, y von 0 bis 1) verschiebt die Sterne. Der letzte Eintrag ist immer das Finale.

## Zurücksetzen zum Testen
Unten im Himmel steht „Von vorne beginnen“. Alternativ im Browser: Entwicklerwerkzeuge → Application → Local Storage → Eintrag `pascal-sternenhimmel-v1` löschen.

## Veröffentlichen mit GitHub Pages
1. Konto auf github.com anlegen, **New repository** → Name z. B. `pascals-sternenhimmel`, Sichtbarkeit Public → Create.
2. **Add file → Upload files**: den **Inhalt** des Ordners hochziehen (`index.html` muss im Hauptverzeichnis liegen, nicht in einem Unterordner) → Commit.
3. **Settings → Pages**: Source = „Deploy from a branch“, Branch `main`, Ordner `/ (root)` → Save.
4. Nach ein bis zwei Minuten ist die Seite erreichbar unter `https://DEIN-NAME.github.io/pascals-sternenhimmel/`.
5. Änderungen später: Datei im Repository ersetzen und committen, nach kurzer Zeit ist die neue Version online. Hinweis: Das Repository ist öffentlich, jeder mit dem Link kann die Seite sehen. Lade nur Fotos hoch, die das okay sind.

## QR-Code
Die Adresse aus Schritt 4 in einen QR-Generator eingeben (z. B. qr-code-generator.com oder der QR-Generator von Canva), als PNG herunterladen, ausdrucken und der Geburtstagskarte beilegen. Vorher mit dem eigenen Handy scannen und das Finale einmal komplett durchspielen.
