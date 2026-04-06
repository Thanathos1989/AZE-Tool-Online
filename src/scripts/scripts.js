// #################
// Globale Variablen
// #################
let vacationOthers = []; // Hier werden die Sonstigen Freistellungen gespeichert, damit sie in verschiedenen Funktionen zugänglich sind

// #################
// Event Listener
// #################
document.addEventListener("DOMContentLoaded", () => {
// |-- Menu
// |    |-- welcome
    document.getElementById("btn_welcome").addEventListener("click", () => {
        showArea("ct_welcome");
    });
// |    |-- create File
    document.getElementById("btn_createFile").addEventListener("click", () => {
        showArea("ct_createFile");
    });
// |    |-- edit File
    document.getElementById("btn_editFile").addEventListener("click", () => {
        showArea("ct_editFile");
    });
// |    |-- work File
    document.getElementById("btn_workFile").addEventListener("click", () => {
        showArea("ct_workFile");
    });
// |    |-- Exit
    document.getElementById("btn_exit").addEventListener("click", () => {
        // Sicherheitsabfrage (Optional, aber empfohlen)
        if (confirm("Möchten Sie das AZE-Tool wirklich beenden? (ALT+F4)")) {
            window.open('', '_self', ''); // Öffnet ein leeres Fenster im selben Tab
            window.close(); // Versucht, das aktuelle Fenster zu schließen
        }
    });
// |    
// |-- Container
// |    |-- Create File
// |        |-- Freistellungen hinzufügen
    document.getElementById("btn_create_addOther").addEventListener("click", () => {
        // Greifen des Values der Felder
        var other = {"name": document.getElementById("otherName").value, "count": document.getElementById("otherCount").value};
        var vacationList = [];
        
        // Überprüfen, ob die Anzahl leer ist, und gegebenenfalls auf 0 setzen
        if (other.count === "") {
            other.count = 0; // Standardwert wenn keine Angabe vorhanden
        }

        // Überprüfen ob Name leer ist
        if (other.name === "") {
            alert("Bitte geben Sie einen Namen für die Freistellung ein.");
            return; // Funktion verlassen, wenn kein Name gegeben
        }

        vacationList.push(other); // Neue Freistellung hinzufügen
        document.getElementById("otherName").value = ""; // Eingabefeld leeren
        document.getElementById("otherCount").value = ""; // Anzahl-Feld leeren

        // WORKING
        

        addVacation(other);
    });
// |    |-- Datei speichern
    document.getElementById("btn_create_saveFile").addEventListener("click", () => {
        // Funktion zum Speichern der Datei aufrufen
        let dataCreateFile = getData(); // Ruft die Funktion auf, um die Daten aus den Formularen zu sammeln und in einem Objekt zu speichern
        saveFileAsJson(dataCreateFile); // Ruft die Funktion zum Speichern der Datei auf und übergibt die gesammelten Daten als Argument
    });
// |    
// |    |-- Edit File
// |        |-- Datei laden
    document.getElementById("btn_edit_loadFile").addEventListener("click", () => {
        // Funktion zum Laden der Datei aufrufen
        const fileInput = document.createElement("input"); // Erstellen eines unsichtbaren Datei-Input-Elements
        fileInput.type = "file"; // Setzen des Input-Typs auf "file"
        fileInput.accept = ".json"; // Akzeptieren nur von JSON-Dateien
        fileInput.addEventListener("change", async (event) => {
            // Zugriff auf die ausgewählte Datei
            const file = event.target.files[0];

            // Abbruchkreterien
            // file ist leer
            if (!file) return;
            // Überprüfen, ob eine gültige JSON-Datei ausgewählt wurde
            if (file.type !== "application/json") return alert("Bitte wählen Sie eine gültige JSON-Datei aus."); 

            // Aufruf des Parsers
            /*
            const jsonFile = await processJsonFile(file);
            console.log("scripts.js     eventHandler    jsonFile: ", jsonFile) // Debugging 
            */
            
            try {
                // Warten bis processJsonFile fertig ist
                const jsonFile = await processJsonFile(file);
                console.log("after processJsonFile      :", jsonFile); // debugging

                // Daten anzeigen
                displayData(jsonFile);

            } catch (error) {
                console.error("Fehler im Ablauf:", error);
                alert(error);
            }
        });
        fileInput.click(); // Klicken auf das unsichtbare Datei-Input-Element, um den Datei-Dialog zu öffnen
    });
// |    
// |-- Work File


// #################
// Funktionen
// #################
// |-- HTML Elemente manipulieren
// |  |-- Bereiche anzeigen/ausblenden
});
function showArea(areaId) {
    // Alle Bereiche ausblenden und dann den gewünschten Bereich anzeigen (mit der class="wrk_container" über attribute active) 
    const areas = document.querySelectorAll(".wrk_container"); // Alle Bereiche mit der Klasse "wrk_container" auswählen
    
    // Alle Bereiche ausblenden
    areas.forEach(area => {
        area.classList.remove("active");
    });

    if (areaId) {
        // Gewünschten Bereich anzeigen
        const selectedArea = document.getElementById(areaId);
        if (selectedArea) {
            selectedArea.classList.add("active");
        }
    }
}
// -- eingabe
// |-- Daten aus Formularen sammeln und in einem Objekt speichern Create File
function getData() {
    let data = {}; // Lokale Variable für die Daten, die in der JSON-Datei gespeichert sind, damit sie in verschiedenen Funktionen zugänglich sind
    data = { 
        "employee": {
            "name": document.getElementById("employeeName").value , 
            "surname": document.getElementById("employeeSurname").value,
            "title": document.getElementById("employeeTitle").value,
            "id": document.getElementById("employeeID").value,
            "department": document.getElementById("employeeDepartment").value,
            "team": document.getElementById("employeeTeam").value,
            "email": document.getElementById("employeeEmail").value,
            "emailWork": document.getElementById("employeeEmailWork").value,
            "phone": document.getElementById("employeePhone").value,
            "phoneWork": document.getElementById("employeePhoneWork").value,
            "address": document.getElementById("employeeAddress").value
        },
        "employer": {
            "name": document.getElementById("employerName").value,
            "department": document.getElementById("employerDepartment").value,
            "address": document.getElementById("employerAddress").value,
            "phone": document.getElementById("employerPhone").value,
            "email": document.getElementById("employerEmail").value,
            "id": document.getElementById("employerID").value,
            "hr": document.getElementById("employerHr").value
        },
        "worktime": {
            "week": document.getElementById("worktimeWeek").value,
            "days": document.getElementById("worktimeDays").value
        },
        "workdays": {
            "monday": {"start" : document.getElementById("workdayMondayStart").value, "end": document.getElementById("workdayMondayEnd").value},
            "tuesday": {"start" : document.getElementById("workdayTuesdayStart").value, "end": document.getElementById("workdayTuesdayEnd").value},
            "wednesday": {"start" : document.getElementById("workdayWednesdayStart").value, "end": document.getElementById("workdayWednesdayEnd").value},
            "thursday": {"start" : document.getElementById("workdayThursdayStart").value, "end": document.getElementById("workdayThursdayEnd").value},
            "friday": {"start" : document.getElementById("workdayFridayStart").value, "end": document.getElementById("workdayFridayEnd").value},
            "saturday": {"start" : document.getElementById("workdaySaturdayStart").value, "end": document.getElementById("workdaySaturdayEnd").value},
            "sunday": {"start" : document.getElementById("workdaySundayStart").value, "end": document.getElementById("workdaySundayEnd").value}
        },
        "vacationDays": document.getElementById("vacationDays").value,
        "other": vacationOthers
    };

    return data; // Gibt die gesammelten Daten zurück, damit sie in anderen Funktionen verwendet werden können (z.B. zum Speichern der Datei)
};
function addVacation(other) {
    console.log("Hinzufügen Button geklickt:", other); // Debugging
    
}

// -- verarbeitung

// -- ausgabe
// |-- Datenobjekt aus JSON auswerten zum bearbeiten.
// Daten im div "editFile_dataDisplay" anzeigen
function displayData(data) {
    console.log("scripts.js    displayData    > Daten erhalten: ", data); // Debugging
    // Warten 1ms und dann die Daten anzeigen, um die Race Condition zu umgehen
    setTimeout(() => {
        // Daten im div "editFile_dataDisplay" anzeigen
        // Employee Daten anzeigen
        for (const [key, value] of Object.entries(data.employee)) {
            document.getElementById("editFile_dataDisplay").innerHTML += "<label for='employee" + key + "'>" + key + ":</label><input type='text' id='employee" + key + "' value='" + value + "'><br/>";
        }
        // Employer Daten anzeigen
        for (const [key, value] of Object.entries(data.employer)) {
            document.getElementById("editFile_dataDisplay").innerHTML += "<label for='employer" + key + "'>" + key + ":</label><input type='text' id='employer" + key + "' value='" + value + "'><br/>";
        }
        // Worktime Daten anzeigen
        for (const [key, value] of Object.entries(data.worktime)) {
            document.getElementById("editFile_dataDisplay").innerHTML += "<label for='worktime" + key + "'>" + key + ":</label><input type='text' id='worktime" + key + "' value='" + value + "'><br/>";
        }
        // Workdays Daten anzeigen
        for (const [key, value] of Object.entries(data.workdays)) {
            document.getElementById("editFile_dataDisplay").innerHTML += "<label for='workday" + key + "'>" + key + ":</label><input type='time' id='workday" + key + "Start' value='" + value.start + "'> - <input type='time' id='workday" + key + "End' value='" + value.end + "'><br/>";
        }
        // Vacation Days anzeigen
        document.getElementById("editFile_dataDisplay").innerHTML += "<label for='vacationDays'>Vacation Days:</label><input type='text' id='vacationDays' value='" + data.vacationDays + "'><br/>";
        // Other Freistellungen anzeigen
        data.other.forEach(function(freistellung, index) {
            document.getElementById("editFile_dataDisplay").innerHTML += "<label for='otherName" + index + "'>Other " + (index + 1) + " Name:</label><input type='text' id='otherName" + index + "' value='" + freistellung.name + "'><br/>";
            document.getElementById("editFile_dataDisplay").innerHTML += "<label for='otherCount" + index + "'>Other " + (index + 1) + " Count:</label><input type='text' id='otherCount" + index + "' value='" + freistellung.count + "'><br/>";
        });
        // Other erweitern - Button hinzufügen
        document.getElementById("editFile_dataDisplay").innerHTML += "<input type='text' id='otherName' placeholder='Sonstige Freistellungen'><br/>";
        document.getElementById("editFile_dataDisplay").innerHTML += "<input type='text' id='otherCount' placeholder='Anzahl'><br/>";
        document.getElementById("editFile_dataDisplay").innerHTML += "<button id='addOther'>Sonstige Freistellung hinzufügen</button><br/>";
        document.getElementById("editFile_dataDisplay").innerHTML += "<div id='otherFreistellung'></div>"; // Hier werden die hinzugefügten Freistellungen angezeigt
    }, 1);
};




// Initialisierung beim Laden der Seite
showArea("ct_createFile") // Zeigt den Willkommensbereich an, wenn die Seite geladen wird, damit der Benutzer sofort eine Begrüßung sieht und weiß, dass er hier Dateien erstellen, bearbeiten oder verwenden kann