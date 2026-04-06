// Create File
// |-- Datei Speichern
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
function processJsonFile(file) {
/*
    if (!file) return; // Überprüfen, ob eine Datei ausgewählt wurde

    const reader = new FileReader(); // FileReader-Objekt erstellen, um die Datei zu lesen

    // Event-Listener für das Laden der Datei hinzufügen
    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target.result); // JSON-Daten parsen
            // Hier rufst du die nächste Funktion auf, die mit den Daten arbeitet, z.B. renderDashboard(jsonData);
            console.log("json.js    processJsonFile     :", jsonData) // DEBUGGING
            return jsonData;
        } catch (error) {
            alert("Fehler beim Laden der Datei.");
            console.error("Parsing Fehler:", error);
        }
    };

    reader.onerror = () => alert("Fehler beim Lesen der Datei.");
    reader.readAsText(file);    // Datei als Text lesen, um sie später als JSON zu parsen
*/

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
