# AZE-Tool Online - Dokumentation

## Übersicht
Das AZE-Tool Online ist eine webbasierte Anwendung zur Verwaltung von Arbeitszeiten und Mitarbeiterdaten. Die Anwendung ermöglicht es Benutzern, eine Grundkonfigurationsdatei zu erstellen, bestehende Dateien zu laden und zu bearbeiten, sowie Arbeitszeiten zu verwalten.

## Projektstruktur
```
AZE-Tool-Online/
├── index.html          # Haupt-HTML-Datei mit der Benutzeroberfläche
└── src/
    ├── scripts/
    │   ├── scripts.js  # Haupt-JavaScript-Datei für die Anwendungslogik
    │   └── json.js     # Hilfsfunktionen für JSON-Handling
    └── style/
        └── style.css   # Stylesheet für das Design (aktuell leer)
```

## Funktionen

### 1. Navigation (Menu)
- **Welcome**: Einführungsseite mit Beschreibung der Anwendung
- **Create File**: Erstellung einer neuen Konfigurationsdatei mit Mitarbeiter- und Arbeitsgeberdaten
- **Edit File**: Laden und Anzeigen einer bestehenden JSON-Konfigurationsdatei
- **Work File**: Platzhalter für die Bearbeitung von Arbeitsdateien (noch nicht implementiert)
- **Work File**: Bereich zur Bearbeitung von Arbeitszeiten (Aktuell: Under Construction)

### 2. Dateierstellung (Create File)
Eingabefelder für:
- **Arbeitnehmerdaten**: Name, Nachname, Titel, ID, Abteilung, Team, E-Mail (privat/arbeits), Telefonnummer (privat/arbeits), Adresse
- **Arbeitgeberdaten**: Name, Abteilung, Adresse, Telefonnummer, E-Mail, ID, HR-Bearbeiter
- **Arbeitszeit**: Wochenarbeitszeit, Arbeitstage pro Woche, tägliche Arbeitszeiten (Mo-So)
- **Urlaub**: Urlaubstage, sonstige Freistellungen

Funktionen:
- Hinzufügen von sonstigen Freistellungen
- Speichern der Daten als JSON-Datei

### 3. Datei bearbeiten (Edit File)
- Laden einer bestehenden JSON-Datei
- Anzeige des Dateiinhalts (Implementierung unvollständig)
- Dynamische Generierung von Eingabefeldern basierend auf dem Dateiinhalt
- Anzeige von Arbeitnehmer-, Arbeitgeber- und Arbeitszeitdaten

### 4. Arbeitsdatei bearbeiten (Work File)
- Platzhalter für zukünftige Funktionen zur Bearbeitung von Arbeitszeiten
- Aktuell nur "UNDER CONSTRUCTION" angezeigt

## Technische Implementierung

### HTML (index.html)
- Strukturierte Container für verschiedene Ansichten
- Formularelemente für Dateneingabe
- Navigation über Anker-Links
- Event-gesteuerte Navigation

### JavaScript (scripts.js)
- Import von Hilfsfunktionen aus json.js
- Funktion `setDisplayNone()`: Blendet alle Arbeitsbereiche aus (für Navigation)
- Event-Listener und weitere Funktionen sind noch nicht implementiert
- `showArea(areaId)`: Steuert die Sichtbarkeit der verschiedenen Sektionen
- `getData()`: Sammelt alle Formulardaten in einem strukturierten JSON-Objekt
- `displayData(data)`: Erzeugt dynamisch HTML-Elemente zur Bearbeitung geladener Daten

### JSON-Handling (json.js)
- Exportiert eine Testfunktion `test()`
- Weitere JSON-Verarbeitungsfunktionen sind noch nicht implementiert
- `saveFileAsJson(data)`: Erstellt einen Blob und triggert den Download der Konfiguration
- `processJsonFile(file)`: Asynchroner FileReader-Wrapper (Promise-basiert) zum Parsen von JSON-Dateien

### CSS (style.css)
- Aktuell leer, kein Styling definiert

## Bekannte Einschränkungen
- JavaScript-Funktionalität ist minimal implementiert
- Kein Styling vorhanden
- Dateioperationen (Speichern/Laden) sind nicht vollständig implementiert
- Navigation zwischen Bereichen funktioniert noch nicht korrekt
- Work File-Bereich ist nicht implementiert
- `displayData` nutzt aktuell `innerHTML` für den Aufbau der Felder
- Styling (CSS) ist noch nicht finalisiert
- Der "Work File"-Bereich für die Zeiterfassung fehlt noch

## Zukünftige Entwicklung
- Vollständige Implementierung der JavaScript-Funktionen
- Hinzufügen von CSS-Styling
- Implementierung von Dateioperationen (File API)
- Navigation und UI-Interaktionen
- Arbeitszeiterfassungsfunktionen im Work File-Bereich