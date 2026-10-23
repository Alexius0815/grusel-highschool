# Grusel-Highschool 🦇

Eine kleine Physik-Sandbox für Kinder: Monster-Schüler und Gegenstände werfen, auf dem Spinnennetz-Trampolin hüpfen lassen,
im Hexenkessel hochschleudern – und eigene Monster gestalten. Läuft im Browser auf Tablet, Handy und Computer.

## Funktionen
- Physik mit [Matter.js](https://brm.io/matter-js/) – Ziehen und Werfen, auch mit mehreren Fingern gleichzeitig
- 6 Start-Figuren + **Erstellungsmodus**: Name, Monsterart, Haut-, Haar- und Augenfarbe, Frisur, Kleidung, Schuhe, Accessoires
- Löschen mit Rückfrage und Wiederherstellen
- Schwerkraft-Modi (normal, Mond, schwerelos, verkehrt herum)
- Sounds und Musik werden komplett im Browser synthetisiert (keine Audiodateien)
- Sprachen: Deutsch, Englisch, Ungarisch (Standard: Systemsprache)
- Installierbar als App (PWA) und offline spielbar
- Passt sich an kleine Bildschirme an

## Spielen
Die Seite muss über **https** ausgeliefert werden, z. B. per GitHub Pages
(*Settings → Pages → Branch `main`, Ordner `/`*). Auf dem Tablet den Link öffnen → Browser-Menü → **„App installieren“**.

Lokal testen: `python3 -m http.server` im Ordner starten und `http://localhost:8000` öffnen.

## Steuerung
- Figur oder Gegenstand antippen und ziehen, loslassen = werfen
- Doppelt auf einen Patchwork-Zombie tippen (Maus: Rechtsklick) → die Nähte platzen
- Oben rechts: Schwerkraft, Musik, Einstellungen (Sprache, Aufräumen)

## Lizenz & Hinweise
Code: MIT. Matter.js © Liam Brummitt, MIT-Lizenz.
Alle Figuren, Grafiken und Sounds sind eigene Entwürfe. Keine Verbindung zu Spielzeug- oder Medienmarken.
