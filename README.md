# Grusel-Highschool 🦇

Eine kleine Physik-Sandbox für Kinder: Monster-Schüler und Gegenstände werfen, auf dem Spinnennetz-Trampolin hüpfen lassen,
im Hexenkessel hochschleudern – und eigene Monster gestalten. Läuft im Browser auf Tablet, Handy und Computer.

## Funktionen
- Physik mit [Matter.js](https://brm.io/matter-js/) – Ziehen und Werfen, auch mit mehreren Fingern gleichzeitig
- 4 Orte mit eigener Kulisse, eigenen Spielgeräten und eigener Musik: Schulflur, Gruselwald, Klassenzimmer, Friedhof
- 17 Start-Figuren in 11 Monsterarten (u. a. Vampir, Werwolf, Katze, Teufelchen, Fledermaus, Alien, Gorgone)
- Trampolin und Kessel lassen sich hinzufügen, verschieben und umwerfen; der Kessel kippt aus und füllt sich wieder
- In Kessel, Baumstumpf, Becherglas und Brunnen kann man eintauchen – danach wird man herausgeschleudert
- **Erstellungsmodus**: Name, Monsterart, Haut-, Haar- und Augenfarbe, Frisur (auch Glatze und Schlangenhaar), Gesicht (Wimpern, Bart, Schnurrbart), Kleidung (u. a. Kleid, Hoodie, Anzug, Rock, Hose, Shorts), Schuhe, Accessoires
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
- Doppelt auf Kessel oder Trampolin tippen → umwerfen bzw. wieder aufstellen
- Oben rechts: Ort wechseln, Schwerkraft, Musik, Einstellungen (Sprache, Aufräumen)

## Lizenz & Hinweise
Code: MIT. Matter.js © Liam Brummitt, MIT-Lizenz.
Alle Figuren, Grafiken und Sounds sind eigene Entwürfe. Keine Verbindung zu Spielzeug- oder Medienmarken.
