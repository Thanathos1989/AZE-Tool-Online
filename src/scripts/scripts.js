// Externe Scripte
import * as myJson from "./json.js"; // Importiere alle Funktionen aus json.js als myJson AUFRUF mit: myJson.test()



// Globale Variablen

// Event Listener

// Funktionen
// |-- HTML Elemente manipulieren
// |  |-- Alle Bereiche ausblenden
function setDisplayNone() {
    const areas = document.querySelectorAll(".wrk_container"); // Alle Bereiche mit der Klasse "wrk_container" auswählen
    
    console.log(`Anzahl der Bereiche: ${areas.length}`); // Überprüfen, wie viele Bereiche gefunden wurden
    // Verzögerung, um die Race Condition zu umgehen
    setTimeout(() => {
        areas.forEach(area => {
            area.style.visibility = "hidden"; // Sichtbarkeit auf "hidden" setzen, um die Bereiche auszublenden
        });
    }, 1); 
}
// -- eingabe
// -- verarbeitung
// -- ausgabe
