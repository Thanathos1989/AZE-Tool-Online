// Create File
// |-- Datei Speichern
/**
 * Erzeugt eine lokale JSON-Datei aus einem Objekt und startet den Browser-Download.
 * @param {Object} data - Das zu speichernde Daten-Objekt.
 */
function saveFileAsJson(data) {
    const jsonData = JSON.stringify(data, null, 2); // Daten als JSON formatieren
    const blob = new Blob([jsonData], { type: "application/json" }); // Blob erstellen
    const url = URL.createObjectURL(blob); // URL für den Blob erstellen
    const a = document.createElement("a"); // Link-Element erstellen
    a.href = url; // Link auf die Blob-URL setzen
    a.download = "azeToolConfig.json"; // Dateiname für den Download
    document.body.appendChild(a); // Link zum Dokument hinzufügen
    a.click(); // Link klicken, um den Download zu starten
    document.body.removeChild(a); // Link wieder entfernen
    URL.revokeObjectURL(url); // Blob-URL freigeben
}
// |-- JSON parsen und als Objekt zurückgeben
/**
 * Liest eine Datei über den FileReader ein und gibt das Ergebnis als Promise zurück.
 * @param {File} file - Das File-Objekt vom Input-Element.
 * @returns {Promise<Object>} - Geparstes JSON-Objekt.
 */
function processJsonFile(file) {
    return new Promise((resolve, reject) => {
        if (!file) return reject("Keine Datei ausgewählt");

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                console.log("json.js processJsonFile fertig:", jsonData);
                resolve(jsonData); // Hier "liefern" wir das Ergebnis aus
            } catch (error) {
                alert("Fehler beim Laden der Datei.")
                reject("Parsing Fehler: " + error);
            }
        };

        reader.onerror = () => reject("Fehler beim Lesen der Datei.");
        reader.readAsText(file);
    });
};
