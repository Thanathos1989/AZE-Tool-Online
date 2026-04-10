// #################
// Globale Variablen
// #################
var vacationOthersEdit = [];   // Freistellungen für "Bearbeiten"
let currentConfig = null;      // Speichert die aktuell geladene JSON-Struktur

// #################
// Event Listener
// #################
document.addEventListener("DOMContentLoaded", () => {
// |-- Menu
// |    |-- welcome
    document.getElementById("btn_welcome").addEventListener("click", () => {
        showArea("ct_welcome");
    });
// |    |-- edit File
    document.getElementById("btn_editFile").addEventListener("click", () => {
        showArea("ct_editFile");
    });
// |    |-- work File
    document.getElementById("btn_workFile").addEventListener("click", () => {
        showArea("ct_workFile");
        initializeWorkFile();
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
// |    |-- Edit File
// |        |-- Datei laden
    document.getElementById("btn_edit_loadFile").addEventListener("click", () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json";
        fileInput.addEventListener("change", async (event) => {
            const file = event.target.files[0];
            if (!file) return;
            if (file.type !== "application/json") return alert("Bitte wählen Sie eine gültige JSON-Datei aus."); 

            try {
                currentConfig = await processJsonFile(file);
                displayData(currentConfig);
            } catch (error) {
                console.error("Fehler im Ablauf:", error);
                alert(error);
            }
        });
        fileInput.click();
    });

    document.getElementById("btn_edit_saveFile").addEventListener("click", () => {
        let updatedData = updateConfigWithFormData("edit_");
        saveFileAsJson(updatedData);
        updateHeaderDisplay(updatedData);
        alert("Änderungen wurden als neue Datei gespeichert.");
    });
// |
// |    |-- Freistellungen hinzufügen
    document.getElementById("btn_edit_addOther").addEventListener("click", () => {
        addOtherVacation("edit_", "edit_otherName", "edit_otherCount", vacationOthersEdit, "edit_otherFreistellung");
    });

// |    |-- Work File Aktionen
    document.getElementById("btn_work_save").addEventListener("click", () => {
        saveWorkFileData();
    });

    // Initialisierung: Zeige beim Start die Willkommensseite
    showArea("ct_welcome");
    initInteractiveBackground();
});

// Gemeinsame Logik für Freistellungen
function addOtherVacation(prefix, nameId, countId, array, displayId) {
    var other = {
        "name": document.getElementById(nameId).value, 
        "count": document.getElementById(countId).value
    };
    
    if (other.count === "") other.count = 0;

    if (other.name === "") {
        alert("Bitte geben Sie einen Namen für die Freistellung ein.");
        return;
    }

    const exists = array.some(v => v.name.toLowerCase() === other.name.toLowerCase());
    if (exists) {
        alert("Diese Freistellung wurde bereits hinzugefügt.");
        return;
    }

    array.push(other);
    document.getElementById(nameId).value = "";
    document.getElementById(countId).value = "";
    document.getElementById(nameId).focus();
    
    renderOtherList(array, displayId);
}

function renderOtherList(array, displayId) {
    const displayDiv = document.getElementById(displayId);
    if (displayDiv) {
        displayDiv.innerHTML = "";
        array.forEach((item, index) => {
            displayDiv.innerHTML += `${index + 1}.\t\t ${item.name}\t\t\t : ${item.count}<br/>`;
        });
    }
}

/**
 * Bereinigt Zeit-Strings und füllt fehlende Stellen auf (z.B. "07:" -> "07:00").
 * @param {string} timeString 
 * @returns {string} Format HH:MM
 */
function sanitizeTime(timeString) {
    if (!timeString || timeString.trim() === "") return "00:00";
    
    let [hours, minutes] = timeString.split(":");
    hours = (hours || "00").padStart(2, "0");
    minutes = (minutes || "00").padEnd(2, "0");

    return `${hours.slice(0, 2)}:${minutes.slice(0, 2)}`;
}

// Bereitet den Work-File Bereich vor und setzt das aktuelle Datum
function initializeWorkFile() {
    const noConfigMsg = document.getElementById("work_no_config_msg");
    const workContent = document.getElementById("work_actual_content");

    if (!currentConfig) {
        if (noConfigMsg) noConfigMsg.classList.remove("u-hidden");
        if (workContent) workContent.classList.add("u-hidden");
        return;
    }

    if (noConfigMsg) noConfigMsg.classList.add("u-hidden");
    if (workContent) workContent.classList.remove("u-hidden");

    const workYear = document.getElementById("work_year");
    const workMonth = document.getElementById("work_month");
    
    if (workYear && workYear.value === "") {
        const now = new Date();
        workYear.value = now.getFullYear();
        workMonth.value = now.getMonth() + 1;
    }

    generateWorkDays(workYear.value, workMonth.value);

    // Updates bei Änderung der Auswahl
    workYear.onchange = () => generateWorkDays(workYear.value, workMonth.value);
    workMonth.onchange = () => generateWorkDays(workYear.value, workMonth.value);
}

// Erzeugt die Eingabemaske für jeden Tag des gewählten Monats
function generateWorkDays(year, month) {
    const tbody = document.getElementById("work_days_body");
    if (!tbody) return;
    tbody.innerHTML = "";

    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Vorhandene Journal-Daten für diesen Monat abrufen, falls vorhanden
    let monthData = [];
    if (currentConfig && currentConfig.journal && currentConfig.journal[year] && currentConfig.journal[year][month]) {
        monthData = currentConfig.journal[year][month];
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const entry = monthData.find(e => parseInt(e[0]) === d);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><b>${d}</b></td>
            <td><input type="time" class="work_start" value="${entry ? entry[1] : ""}"></td>
            <td><input type="time" class="work_end" value="${entry ? entry[2] : ""}"></td>
            <td><input type="time" class="work_break" value="${entry ? entry[3] : "00:00"}"></td>
            <td>
                <select class="work_reason">
                    <option value="">-</option>
                    <option value="Gem. DP" ${entry && entry[4] === "Gem. DP" ? "selected" : ""}>Gem. DP</option>
                    <option value="§30c" ${entry && entry[4] === "§30c" ? "selected" : ""}>§30c</option>
                </select>
            </td>
            <td><input type="text" class="work_comment work-comment-input" placeholder="Kommentar..." value="${entry ? entry[5] : ""}"></td>
        `;

        const startIn = row.querySelector(".work_start");
        const endIn = row.querySelector(".work_end");
        const breakIn = row.querySelector(".work_break");

        const updateBreak = () => {
            // Falls Felder unvollständig sind (z.B. "07:--"), füllen wir sie für die Berechnung auf
            const startTime = sanitizeTime(startIn.value);
            const endTime = sanitizeTime(endIn.value);

            // Wir führen die Berechnung aus, sobald mindestens ein Feld einen Wert hat
            if (startIn.value || endIn.value) {
                const start = new Date(`1970-01-01T${startTime}`);
                const end = new Date(`1970-01-01T${endTime}`);
                let diff = (end - start) / (1000 * 60 * 60);
                if (diff < 0) diff += 24; // Korrektur falls über Mitternacht gearbeitet wird

                if (diff > 9) breakIn.value = "00:45";
                else if (diff > 6) breakIn.value = "00:30";
                else breakIn.value = "00:00";
            }
        };

        startIn.addEventListener("change", updateBreak);
        endIn.addEventListener("change", updateBreak);

        // Blur-Event: Füllt Nullen automatisch auf, wenn der User das Feld verlässt
        const autoFormatOnBlur = (e) => {
            e.target.value = sanitizeTime(e.target.value);
            updateBreak();
        };

        startIn.addEventListener("blur", autoFormatOnBlur);
        endIn.addEventListener("blur", autoFormatOnBlur);
        breakIn.addEventListener("blur", autoFormatOnBlur);

        tbody.appendChild(row);
    }
}

// Extrahiert Journal-Daten und führt sie mit der bestehenden Konfiguration zusammen
function saveWorkFileData() {
    const year = document.getElementById("work_year").value;
    const month = document.getElementById("work_month").value;
    const rows = document.querySelectorAll("#work_days_body tr");
    const entries = [];

    rows.forEach(row => {
        const start = sanitizeTime(row.querySelector(".work_start").value);
        const end = sanitizeTime(row.querySelector(".work_end").value);
        const brk = sanitizeTime(row.querySelector(".work_break").value);

        // Nur speichern, wenn der Tag nicht komplett leer (00:00 bis 00:00) ist
        if (start !== "00:00" || end !== "00:00") {
            entries.push([
                row.cells[0].innerText,                  // tag
                start,                                   // beginn
                end,                                     // ende
                brk,                                     // pause
                row.querySelector(".work_reason").value, // begründung
                row.querySelector(".work_comment").value // kommentar
            ]);
        }
    });

    if (!currentConfig) currentConfig = {};
    if (!currentConfig.journal) currentConfig.journal = {};
    if (!currentConfig.journal[year]) currentConfig.journal[year] = {};

    currentConfig.journal[year][month] = entries;

    saveFileAsJson(currentConfig);
    alert(`Das Journal für ${month}/${year} wurde der JSON-Konfiguration hinzugefügt.`);
}

// Führt die Formulardaten mit der bestehenden Konfiguration zusammen, um keine Daten zu verlieren
function updateConfigWithFormData(prefix) {
    const formData = getData(prefix);
    
    // Wenn noch keine Datei geladen wurde, nehmen wir die Formulardaten als Basis
    if (!currentConfig) return formData;

    // Deep Merge (Ebene 1 der Objekte), um zusätzliche Felder in der JSON zu erhalten
    currentConfig.employee = { ...(currentConfig.employee || {}), ...formData.employee };
    currentConfig.employer = { ...(currentConfig.employer || {}), ...formData.employer };
    currentConfig.worktime = { ...(currentConfig.worktime || {}), ...formData.worktime };
    currentConfig.workdays = { ...(currentConfig.workdays || {}), ...formData.workdays };
    currentConfig.vacationDays = formData.vacationDays;
    currentConfig.other = formData.other;

    return currentConfig;
}


// #################
// Funktionen
// #################
// |-- HTML Elemente manipulieren
// |  |-- Bereiche anzeigen/ausblenden
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

        // Navigation-Links aktualisieren: .active Klasse am Button setzen
        const navLinks = document.querySelectorAll("#navigation a");
        navLinks.forEach(link => link.classList.remove("active"));

        // Die ID des Buttons ableiten (ct_welcome -> btn_welcome)
        const activeBtnId = areaId.replace("ct_", "btn_");
        const activeBtn = document.getElementById(activeBtnId);
        if (activeBtn) {
            activeBtn.classList.add("active");
        }
    }
}
// -- eingabe
// |-- Daten aus Formularen sammeln und in einem Objekt speichern Create File
function getData(prefix = "") {
    let data = { 
        "employee": {
            "name": document.getElementById(prefix + "employeeName").value , 
            "surname": document.getElementById(prefix + "employeeSurname").value,
            "title": document.getElementById(prefix + "employeeTitle").value,
            "id": document.getElementById(prefix + "employeeID").value,
            "department": document.getElementById(prefix + "employeeDepartment").value,
            "team": document.getElementById(prefix + "employeeTeam").value,
            "email": document.getElementById(prefix + "employeeEmail").value,
            "emailWork": document.getElementById(prefix + "employeeEmailWork").value,
            "phone": document.getElementById(prefix + "employeePhone").value,
            "phoneWork": document.getElementById(prefix + "employeePhoneWork").value,
            "address": document.getElementById(prefix + "employeeAddress").value
        },
        "employer": {
            "name": document.getElementById(prefix + "employerName").value,
            "department": document.getElementById(prefix + "employerDepartment").value,
            "address": document.getElementById(prefix + "employerAddress").value,
            "phone": document.getElementById(prefix + "employerPhone").value,
            "email": document.getElementById(prefix + "employerEmail").value,
            "id": document.getElementById(prefix + "employerID").value,
            "hr": document.getElementById(prefix + "employerHr").value
        },
        "worktime": {
            "week": document.getElementById(prefix + "worktimeWeek").value,
            "days": document.getElementById(prefix + "worktimeDays").value
        },
        "workdays": {
            "monday": {"start" : document.getElementById(prefix + "workdayMondayStart").value, "end": document.getElementById(prefix + "workdayMondayEnd").value},
            "tuesday": {"start" : document.getElementById(prefix + "workdayTuesdayStart").value, "end": document.getElementById(prefix + "workdayTuesdayEnd").value},
            "wednesday": {"start" : document.getElementById(prefix + "workdayWednesdayStart").value, "end": document.getElementById(prefix + "workdayWednesdayEnd").value},
            "thursday": {"start" : document.getElementById(prefix + "workdayThursdayStart").value, "end": document.getElementById(prefix + "workdayThursdayEnd").value},
            "friday": {"start" : document.getElementById(prefix + "workdayFridayStart").value, "end": document.getElementById(prefix + "workdayFridayEnd").value},
            "saturday": {"start" : document.getElementById(prefix + "workdaySaturdayStart").value, "end": document.getElementById(prefix + "workdaySaturdayEnd").value},
            "sunday": {"start" : document.getElementById(prefix + "workdaySundayStart").value, "end": document.getElementById(prefix + "workdaySundayEnd").value}
        },
        "vacationDays": document.getElementById(prefix + "vacationDays").value,
        "other": vacationOthersEdit
    };

    return data;
};

/**
 * Aktualisiert die Anzeige oben rechts mit den Mitarbeiter- und Arbeitgeberdaten.
 */
function updateHeaderDisplay(data) {
    const headerInfo = document.getElementById("header_info");
    if (!headerInfo || !data) return;

    const emp = data.employee || {};
    const employer = data.employer || {};

    headerInfo.innerHTML = `
        <div><strong>${emp.surname || ""}, ${emp.name || ""}</strong> (${emp.title || ""})</div>
        <div class="header-id">ID: ${emp.id || "---"}</div>
        <div class="header-employer">${employer.name || ""} - ${employer.department || ""}</div>
    `;
}

// -- verarbeitung
// -- ausgabe
// |-- Datenobjekt aus JSON auswerten zum bearbeiten.
// Daten im div "editFile_dataDisplay" anzeigen
function displayData(data) {
    console.log("scripts.js displayData > Daten erhalten: ", data);
    const p = "edit_"; // Prefix

    // Mitarbeiter-Daten füllen
    document.getElementById(p + "employeeName").value = data.employee.name || "";
    document.getElementById(p + "employeeSurname").value = data.employee.surname || "";
    document.getElementById(p + "employeeTitle").value = data.employee.title || "";
    document.getElementById(p + "employeeID").value = data.employee.id || "";
    document.getElementById(p + "employeeDepartment").value = data.employee.department || "";
    document.getElementById(p + "employeeTeam").value = data.employee.team || "";
    document.getElementById(p + "employeeEmail").value = data.employee.email || "";
    document.getElementById(p + "employeeEmailWork").value = data.employee.emailWork || "";
    document.getElementById(p + "employeePhone").value = data.employee.phone || "";
    document.getElementById(p + "employeePhoneWork").value = data.employee.phoneWork || "";
    document.getElementById(p + "employeeAddress").value = data.employee.address || "";

    // Arbeitgeber-Daten füllen
    document.getElementById(p + "employerName").value = data.employer.name || "";
    document.getElementById(p + "employerDepartment").value = data.employer.department || "";
    document.getElementById(p + "employerAddress").value = data.employer.address || "";
    document.getElementById(p + "employerPhone").value = data.employer.phone || "";
    document.getElementById(p + "employerEmail").value = data.employer.email || "";
    document.getElementById(p + "employerID").value = data.employer.id || "";
    document.getElementById(p + "employerHr").value = data.employer.hr || "";

    // Arbeitszeit füllen
    document.getElementById(p + "worktimeWeek").value = data.worktime.week || "";
    document.getElementById(p + "worktimeDays").value = data.worktime.days || "";

    // Wochentage füllen
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    days.forEach(day => {
        const dayKey = day.toLowerCase();
        if (data.workdays[dayKey]) {
            document.getElementById(p + "workday" + day + "Start").value = data.workdays[dayKey].start || "00:00";
            document.getElementById(p + "workday" + day + "End").value = data.workdays[dayKey].end || "00:00";
        }
    });

    // Urlaubstage
    document.getElementById(p + "vacationDays").value = data.vacationDays || "";

    // Sonstige Freistellungen (Array laden)
    vacationOthersEdit = data.other || [];
    renderOtherList(vacationOthersEdit, p + "otherFreistellung");

    updateHeaderDisplay(data);
    console.log("Bearbeitungsmaske erfolgreich gefüllt.");
};

/**
 * Erzeugt einen interaktiven Hintergrund mit Dreiecken, die der Maus folgen.
 */
function initInteractiveBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleCount = 150; // Etwas mehr Partikel für ein schöneres Netz
    const connectionDistance = 150; // Max Distanz für Linien
    const mouse = { x: -1000, y: -1000 };

    class Particle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = 2;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(76, 175, 80, 0.5)'; // primary-green mit Transparenz
            ctx.fill();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Interaktion mit Maus
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 200) {
                this.x += dx * 0.01;
                this.y += dy * 0.01;
            }

            // Border-Check
            if (this.x < -20) this.x = canvas.width + 20;
            if (this.x > canvas.width + 20) this.x = -20;
            if (this.y < -20) this.y = canvas.height + 20;
            if (this.y > canvas.height + 20) this.y = -20;
        }
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Linien zeichnen
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    // Opazität basierend auf Entfernung (näher = deutlicher)
                    const opacity = 1 - (dist / connectionDistance);
                    ctx.strokeStyle = `rgba(76, 175, 80, ${opacity * 0.4})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    resize();
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    animate();
}