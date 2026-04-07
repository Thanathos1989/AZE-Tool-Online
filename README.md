# 📝 AZE-Tool Online

![Status](https://img.shields.io/badge/Status-Entwicklung-orange)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

## Beschreibung
**AZE-Tool Online** ist eine moderne, webbasierte Anwendung zur effizienten Verwaltung von Arbeitszeiten und Mitarbeiterstammdaten. Das Tool ermöglicht es, universelle Konfigurationsdateien im JSON-Format zu erstellen, die als Basis für eine automatisierte Zeiterfassung dienen.

## Funktionen
- 👤 **Mitarbeiterverwaltung**: Detaillierte Erfassung von Personaldaten.
- 🏢 **Unternehmensdaten**: Hinterlegung von Arbeitgeber- und HR-Informationen.
- 🕒 **Arbeitszeit-Profile**: Definition von Wochenstunden und flexiblen Tagesplänen (Mo-So).
- 🏖️ **Urlaubsplaner**: Verwaltung von Jahresurlaub und individuellen Freistellungen.
- 📂 **Smart JSON Handling**: Exportieren und Importieren von Konfigurationen ohne Datenbankzwang.
- 🧹 **Auto-Reset**: Intelligentes Leeren der Formulare nach erfolgreichem Export.

## Verwendung

### Lokale Ausführung
1. Repository klonen oder als ZIP herunterladen.
2. Die Datei `index.html` in einem modernen Browser öffnen.
3. *Alternativ*: Die `Programmstart.bat` nutzen, um das Tool direkt im Edge-Kiosk-Modus zu starten.

### Navigation
- **Welcome**: Der Einstiegsbereich mit Kurzanleitung.
- **Create File**: Erstellung der initialen Konfigurationsdatei.
- **Edit File**: Vorhandene JSON-Dateien laden, einsehen und anpassen.
- **Work File**: Zukünftiger Bereich für die tägliche Zeiterfassung.

## Technische Details
- **Frontend**: HTML5, CSS3 (Modernes Flex/Grid-Layout).
- **Logik**: Vanilla JavaScript (ES6+) mit asynchronem FileReader-Handling.
- **Datenformat**: JSON (Standardisiert für maximale Kompatibilität).

## Projektstatus
⚠️ **Under Construction**: Die Kernfunktionen zum Erstellen und Bearbeiten von Konfigurationen sind stabil. Der Bereich für das aktive Zeittracking (`Work File`) befindet sich aktuell in der Umsetzung.

---
*Entwickelt für eine einfache und papierlose Arbeitszeitorganisation.*

## Lizenz
[Hier Lizenzinformationen einfügen, falls vorhanden]