// Percorso ShortCuts
// C:\Users\Utente\AppData\Roaming\Code\User

// TABELLA ORDINE
// 2. Funzione Collisione Proiettile con alieno
// 3. Ship che spara
// 4. Alieni che sparano

//#region Properties
var container = document.getElementById("container");
var ship = document.getElementById("ship");
// Dimensioni del contenitore
var containerWidth = container.offsetWidth;
// Dimensioni della nave
var halfShipWidth;
// Variabile per tenere traccia della posizione attuale della nave
var currentPositionX;
// Movimento Nave
var moveShip = 1;
// Margine laterale nave
var shipMargin = 20;
// Numero righe
var nRows = 10;
// Numero colonne
var nCols = 10;
// Dimensioni celle per CPU
var cpuRowWidth = document.getElementById("cpuContainer").offsetWidth - shipMargin * 2;
var cpuCellDimension = cpuRowWidth / nCols + 'px';
// Timeout per spostamento cpu
var cpuMovementTimer = 1000;
// CPU spostamento interval
var cpuMovementInterval;
// Direzione movimento cpu
var cpuSideDirection = "R"; // oppure L
// Numero di spostamenti effettuati cpu
var cpuSideMovementsNumber = 0;
// Numero di spostamenti verticali effettuati cpu
var cpuVerticalMovementsNumber = 0;
// Creiamo il proiettile
var bullet;
//#endregion

document.addEventListener("DOMContentLoaded", function () {
    renderCPU();
    startGame();
});

//#region Game
function startGame() {
    var startButton = document.getElementById("startButton");

    // Listener per l'evento di clic sul pulsante di avvio
    startButton.addEventListener("click", function () {
        // Nascondo il pulsante di avvio
        startButton.style.display = "none";
        // Mostro il contenitore del gioco
        document.getElementById("ship").style.display = "block";

        // Prendo gli alieni
        var aliens = document.querySelectorAll(".aliens");
        aliens.forEach(alien => {
            alien.style.display = "block";
        });

        // Dimensioni della nave
        halfShipWidth = document.getElementById("ship").offsetWidth / 2;
        // Variabile per tenere traccia della posizione attuale della nave
        currentPositionX = parseInt(containerWidth / 2);

        // Avvia intervallo CPU
        initCPUMovement();

        shoot();
        movement();
    });
}

function gameOver() {
    // Bottone di game over
    var gameOverButton = document.getElementById("gameOverButton");
    // Mostra pulsante game over
    gameOverButton.style.display = "block";
    // Nascondo la nave
    document.getElementById("ship").style.display = "none";
    // Nascondo gli alieni
    var aliens = document.querySelectorAll(".aliens");
    aliens.forEach(alien => {
        alien.style.display = "none";
    });

    gameOverButton.addEventListener("click", function () {
        location.reload();
    });
}
//#endregion

//#region CPU
function renderCPU() {
    renderAliensGrid();
}
function renderAliensGrid() {

    for (let iRow = 0; iRow < nRows; iRow++) {
        // Crea l'ID alla riga
        var rowId = `cpuRow${iRow + 1}`;

        // Crea div
        var div = document.createElement("div");

        // Crea dimensioni
        div.style.width = `${cpuRowWidth}px`;
        div.style.height = cpuCellDimension;

        // Controlla se è una riga contenente gli alieni
        if (iRow < 4) {
            // Assegno attributo
            div.setAttribute("cpu_row", "");
            div.id = rowId;
        }
        // Riga vuota
        else
            div.setAttribute("cpu_empty_row", "");

        // Inserisci riga
        document.getElementById("cpuContainer").appendChild(div);

        // Controlla se è una riga contenente gli alieni
        if (iRow < 4) {

            // Inserisce l'immagine in una variabile
            var alienImg = document.getElementById(`alien${iRow + 1}_template`).innerHTML.trim();

            for (let iCol = 0; iCol < nCols; iCol++) {

                // Crea div
                var div = document.createElement("div");

                // Crea dimensioni
                div.style.width = cpuCellDimension;
                div.style.height = cpuCellDimension;
                div.classList.add("alienContainer");

                // Controlla se è una cella contenente l'immagine
                if (iCol <= 6) {
                    div.innerHTML = alienImg;
                    div.setAttribute("alien", "");
                }
                // Cella vuota
                else
                    div.setAttribute("empty", "");

                // Inserisci cella
                document.getElementById(rowId).appendChild(div);
            }
        }
    }
}
function initCPUMovement() {
    cpuMovementInterval = setInterval(() => {

        // Controlliamo se arrivato in fondo
        if (cpuSideMovementsNumber == 3) {

            // Cambio direzione
            if (cpuSideDirection == "L")
                cpuSideDirection = "R";
            else
                cpuSideDirection = "L";

            // Sposta sotto
            if (cpuVerticalMovementsNumber == 6) {
                clearInterval(cpuMovementInterval);
                gameOver();
            }

            // Incrementiamo contatore
            cpuVerticalMovementsNumber++;

            // Svuoto il contatore
            cpuSideMovementsNumber = 0;

            // Prendiamo padre delle righe
            var rowsContainer = document.getElementById("cpuContainer");

            // Prendiamo i figli del container
            var containerChildren = rowsContainer.children;

            // Spostiamo l'ultimo elemento come primo
            rowsContainer.insertBefore(containerChildren[containerChildren.length - 1], rowsContainer.firstChild);

        }
        else {

            // Prendiamo tutte le righe contenenti gli alieni
            var rows = document.querySelectorAll("[cpu_row]");

            // Spostiamo gli alieni per ogni riga
            for (let index = 0; index < rows.length; index++) {
                const row = rows[index];

                // Prendiamo i alieni della riga
                var children = row.children;

                // Controlliamo se R o L
                if (cpuSideDirection == "R")
                    // Spostiamo l'ultimo elemento come primo
                    row.insertBefore(children[children.length - 1], row.firstChild);

                else if (cpuSideDirection == "L")
                    // Spostiamo il primo elemento come ultimo
                    row.appendChild(row.firstChild);

            }

            // Incrementiamo contatore
            cpuSideMovementsNumber++;

        }

    }, cpuMovementTimer);
}
//#endregion

//#region SpaceShip
function movement() {
    var timers = {};
    var interval = 10; // Tempo minimo tra le pressioni dei tasti in millisecondi

    document.addEventListener("keydown", function (event) {
        // Controlla se l'evento di movimento è già in esecuzione per questo tasto e se non è dx o sx
        if (timers[event.keyCode] || (event.keyCode != 37 && event.keyCode != 39)) return;

        // Avvia un intervallo di tempo prima di eseguire l'azione di movimento
        timers[event.keyCode] = setInterval(function () {
            // Controlla quale tasto è stato premuto
            switch (event.keyCode) {
                case 37: // Freccia sinistra
                    // Calcola la nuova posizione dell'immagine a sinistra
                    var newPositionXLeft = currentPositionX - moveShip; // Modifica il valore come desideri

                    // Controlla se l'immagine raggiunge il bordo sinistro del contenitore
                    if (newPositionXLeft >= halfShipWidth + shipMargin) {
                        currentPositionX = newPositionXLeft;
                    } else {
                        currentPositionX = halfShipWidth + shipMargin;
                    }
                    break;

                case 39: // Freccia destra
                    // Calcola la nuova posizione dell'immagine a destra
                    var newPositionXRight = currentPositionX + moveShip;

                    // Controlla se l'immagine raggiunge il bordo destro del contenitore
                    if (newPositionXRight <= containerWidth - halfShipWidth - shipMargin) {
                        currentPositionX = newPositionXRight;
                    } else {
                        currentPositionX = containerWidth - halfShipWidth - shipMargin;
                    }
                    break;
            }

            // Imposta la nuova posizione dell'immagine
            ship.style.left = currentPositionX + "px";
        }, interval);

        // Rimuove l'intervallo di tempo se il tasto viene rilasciato
        document.addEventListener("keyup", function (event) {
            clearInterval(timers[event.keyCode]);
            timers[event.keyCode] = null;
        });
    });
}
function shoot() {

    document.addEventListener("keydown", function (event) {

        // Solo barra spaziatrice consentita
        if (event.keyCode != 32) return;

        // Creiamo proiettile
        bullet = document.createElement("div");

        bullet.className = "bullet";
        bullet.style.left = `${currentPositionX - shipMargin}px`;

        timer = setInterval(moveBullet(), 2);

        // Inserisci riga
        document.getElementById("cpuContainer").appendChild(bullet);
    });
}
function moveBullet() {
    bullet.style.bottom = parseInt(bullet.style.bottom) + 1 + 'px';

    if (parseInt(bullet.style.bottom) >= document.getElementById("cpuContainer"))
        bullet.style.bottom = 0;
}

// function shoot() {
//     const speed = 5;
//     const delay = 7;
//     const damage = 1;
//     var timers = {};
//     var interval = 10; // Tempo minimo tra le pressioni dei tasti in millisecondi

//     document.addEventListener("keydown", function (event) {
//         // Controlla se l'evento di movimento è già in esecuzione per questo tasto
//         if (timers[event.keyCode]) return;

//         // Avvia un intervallo di tempo prima di eseguire l'azione di movimento
//         timers[event.keyCode] = setInterval(function () {
//             // Controlla quale tasto è stato premuto
//             switch (event.keyCode) {
//                 case 32: // Spazio
//                     div.style.top = parseInt(div.style.top) - 1 + 'px';

//             }

//             // Imposta la nuova posizione dell'immagine
//             ship.style.left = currentPositionX + "px";
//         }, interval);

//         // Rimuove l'intervallo di tempo se il tasto viene rilasciato
//         document.addEventListener("keyup", function (event) {
//             clearInterval(timers[event.keyCode]);
//             timers[event.keyCode] = null;
//         });
//     });

// }
//#endregion
