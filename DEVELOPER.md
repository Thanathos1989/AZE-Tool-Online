# 🛠 AZE-Tool Online - Developer Documentation

Diese Dokumentation richtet sich an Entwickler, die das Tool erweitern oder die interne Logik verstehen möchten.

## 🧠 Kern-Konzepte

### 1. Zustandsverwaltung (State Management)
Die Anwendung agiert als **Single Page Application (SPA)** ohne Backend. Der globale Zustand wird in der Variable `currentConfig` gehalten. 
*   **Initialisierung**: `currentConfig` ist `null`. In diesem Zustand ist das Journal (`Work File`) gesperrt.
*   **Datenquelle**: Nach dem Parsen via `processJsonFile` wird das Objekt in `currentConfig` abgelegt.
*   **Persistenz**: Daten werden ausschließlich beim Klick auf "Speichern" via `saveFileAsJson` zurück in das Dateisystem des Nutzers geschrieben.

### 2. Daten-Schema (JSON Struktur)
Das Tool erwartet und erzeugt ein spezifisches JSON-Objekt. Hier ist die Definition der Hauptknoten:

```json
{
  "employee": { "name": "", "surname": "", "id": "", "email": "", ... },
  "employer": { "name": "", "department": "", "hr": "", ... },
  "worktime": { "week": "40", "days": "5" },
  "workdays": {
    "monday": { "start": "08:00", "end": "16:30" },
    ...
  },
  "vacationDays": "30",
  "other": [ { "name": "AZV", "count": "6" } ],
  "journal": {
    "2024": {
      "4": [
        ["1", "07:00", "16:00", "00:30", "Gem. DP", "Kommentar"]
      ]
    }
  }
}
```
*Hinweis*: Das Journal nutzt **Arrays statt Objekten** für die Tageseinträge (`[Tag, Start, Ende, Pause, Grund, Kommentar]`), um die Dateigröße bei mehrjährigen Aufzeichnungen gering zu halten.

### 3. Deep Merge Logik (`updateConfigWithFormData`)
Um Datenverlust zu vermeiden, wenn das JSON-Format in Zukunft erweitert wird (z.B. durch manuelle Zusätze im Texteditor), nutzt das Tool einen **Merge-Ansatz**:
1.  `getData()` extrahiert die aktuellen UI-Werte.
2.  `updateConfigWithFormData` nimmt die bestehende `currentConfig`.
3.  Mittels Destructuring (`{...old, ...new}`) werden nur die im UI bekannten Felder überschrieben. Fremde Schlüssel bleiben im Objekt erhalten.

## ⚙️ Logik-Deep-Dive

### Pausenautomatik (Arbeitsstättenverordnung)
In `generateWorkDays` ist ein Observer implementiert. Die Berechnung erfolgt in Echtzeit:
*   Netto-Arbeitszeit > 6 Stunden => 00:30 Pause.
*   Netto-Arbeitszeit > 9 Stunden => 00:45 Pause.
Die Differenz wird über das Date-Objekt berechnet (`(end - start) / 3600000`).

### 3. Datenvalidierung & Sanitizing
Um eine konsistente Datenqualität im Journal zu gewährleisten, bereinigt die Funktion `sanitizeTime(timeString)` unvollständige Eingaben (z.B. "07:" -> "07:00"). Dies verhindert Laufzeitfehler bei der Pausenberechnung.

## 📂 Funktionsübersicht

### `scripts.js`

| Funktion | Beschreibung |
| :--- | :--- |
| `showArea(areaId)` | Schaltet CSS-Klassen (`active`) und aktualisiert den aktiven Navigationsstatus. |
| `getData(prefix)` | Extrahiert mittels Template-Literals (`prefix + fieldId`) alle Formularwerte. |
| `displayData(data)` | Mappt JSON-Werte auf die entsprechenden DOM-Elemente der Edit-Maske. |
| `generateWorkDays(y, m)` | Dynamische DOM-Manipulation zur Erzeugung der monatlichen Journal-Tabelle inkl. Event-Listenern für die Pausenlogik. |
| `saveWorkFileData()` | Serialisiert die Journal-Tabelle in ein Array-of-Arrays Format für maximale Kompaktheit. |
| `initInteractiveBackground()` | Implementiert ein Partikel-System auf einem HTML5 Canvas mit Maus-Interaktion. |

### `json.js`

| Funktion | Beschreibung |
| :--- | :--- |
| `saveFileAsJson(data)` | Nutzt `Blob` und `URL.createObjectURL` für einen clientseitigen Datei-Download ohne Server-Interaktion. |
| `processJsonFile(file)` | Kapselt den asynchronen `FileReader` in einem `Promise`, um eine saubere `async/await` Syntax in der Hauptlogik zu ermöglichen. |

## 🎨 UI & Performance

*   **CSS-Architektur**: Basiert auf dem OOCSS-Prinzip (Object Oriented CSS). Trennung von Struktur (`.wrk_container`) und Design (`--primary-green`).
*   **Layout**: Die Hauptmaske nutzt `display: grid` mit `repeat(2, 1fr)`, was via Media-Query (`@media`) bei schmalen Viewports auf `1fr` kollabiert.
*   **Responsivität**: Ab 850px Breite schaltet das System von einem 2-Spalten-Layout auf ein einspaltiges mobiles Layout um.
*   **Canvas-Optimierung**: Die Animation läuft im Hintergrund. Durch `pointer-events: none` wird sichergestellt, dass das Betriebssystem Klicks direkt an das DOM durchreicht, ohne das Canvas-Layer zu berechnen.

## 🚀 Erweiterungsmöglichkeiten

1.  **Statistik-Modul**: Implementierung einer `calculateBalance()` Funktion, die `workdays` (Soll) gegen `journal` (Ist) rechnet.
2.  **HTML5 Validation**: Nutzung des `required`-Attributes in Kombination mit `checkValidity()` im `getData` Prozess.
3.  **Local Storage**: Caching der `currentConfig` im Browser-Speicher, um Datenverlust bei versehentlichem Refresh zu verhindern.
4.  **PDF-Export**: Integration von `jspdf`, um das Journal direkt druckfertig auszugeben.

---
*Dokumentationsstand: April 2024*