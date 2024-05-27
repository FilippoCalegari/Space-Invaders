// Percorso ShortCuts
// C:\Users\Utente\AppData\Roaming\Code\User

// TABELLA ORDINE
// 2. Funzione Collisione Proiettile con alieno
// 3. Ship che spara
// 4. Alieni che sparano

//#region Properties
var container = document.getElementById("container");
var ship = document.getElementById("ship");
// var points = document.getAttribute("p");
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
// Numero righe con alieni
var nRowsCPU = 4;
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
// Timout intervallo velocità proiettile
var bulletSpeed = 2;
// Indice del proiettile
var bulletIndex = 0;
// Ultimo sparo timestamp
var bulletShotTimestamp = Date.now();
// Variabile per game over
var isGameOver = false;
// Variabile per vittoria
var isVictory = false;
// Variabile che conta gli alieni distrutti
var aliensKilled = 0;
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

        // Mostro il punteggio
        document.getElementById("pointsContainer").style.display = "block";

        // Mostro il contenitore del gioco
        document.getElementById("ship").style.display = "block";

        // Aggiungiamo classe alla ship container
        document.getElementById("shipContainer").className = "shipContainerBorder";

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

        // Inizializza altrimenti movimenti e azioni
        shoot();
        movement();
        initBulletInterval();
    });
}

function gameOver() {

    // Controlliamo che non sia vittoria
    if(isVictory == true)
        return;

    isGameOver = true;

    // Bottone di game over
    var gameOverButton = document.getElementById("gameOverButton");

    // Mostra pulsante game over
    gameOverButton.style.display = "block";

    // Nascondo la nave
    document.getElementById("ship").style.display = "none";

    // Rimuoviamo la classe alla ship container
    document.getElementById("shipContainer").className = "";

    // Nascondo gli alieni
    var aliens = document.querySelectorAll(".aliens");
    aliens.forEach(alien => {
        alien.style.display = "none";
    });

    // Nascondo i proiettili
    var bullets = document.querySelectorAll(".bullet");
    bullets.forEach(bullet => {
        bullet.style.display = "none";
    });

    gameOverButton.addEventListener("click", function () {
        location.reload();
    });
}
function victory() {

    // Controlliamo che non sia game over
    if(isGameOver == true)
        return;

    // Vittoria
    isVictory = true;

    // Bottone di vittoria
    var victoryButton = document.getElementById("victoryButton");

    // Mostra pulsante vittoria
    victoryButton.style.display = "block";

    // Nascondo la nave
    document.getElementById("ship").style.display = "none";

    // Rimuoviamo la classe alla ship container
    document.getElementById("shipContainer").className = "";

    // Nascondo i proiettili
    var bullets = document.querySelectorAll(".bullet");
    bullets.forEach(bullet => {
        bullet.style.display = "none";
    });

    victoryButton.addEventListener("click", function () {
        location.reload();
    });

}
//#endregion

//#region CPU
function renderCPU() {
    for (let iRow = 0; iRow < nRows; iRow++) {
        // Crea l'ID alla riga
        var rowId = `cpuRow${iRow + 1}`;

        // Crea div
        var div = document.createElement("div");

        // Crea dimensioni
        div.style.width = `${cpuRowWidth}px`;
        div.style.height = cpuCellDimension;

        // Controlla se è una riga contenente gli alieni
        if (iRow < nRowsCPU) {
            // Assegno attributo
            div.setAttribute("cpu_row", "");
            div.id = rowId;
        }
        // Riga vuota
        else
            div.setAttribute("cpu_empty_row", "");

        // Inserisci riga
        document.getElementById("cpuShipsContainer").appendChild(div);

        // Controlla se è una riga contenente gli alieni
        if (iRow < nRowsCPU) {

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
            var rowsContainer = document.getElementById("cpuShipsContainer");

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
function removeCPUEmptyRows() {
    // Inizializziamo numero di righe vuote
    var empty_rows_number = 0;

    // Prendiamo tutte le righe contenenti gli alieni
    for (let index = 0; index < nRowsCPU; index++) {

        // Costruiamo l'ID della riga
        var id = `cpuRow${index + 1}`;

        // Controlliamo che la riga esista ancora
        if (document.getElementById(id) == null) {

            // Incrementiamo il numero di righe inesistenti
            empty_rows_number++;
            continue;
        }

        // Prendiamo il numero di figli con attributo alien
        var number = document.querySelectorAll(`#${id} [alien]`).length;

        // Se non ce ne sono
        if (number == 0) {

            // Svuotiamo la riga
            document.getElementById(id).innerHTML = "";

            // Togliamo l'attributo cpu_row
            document.getElementById(id).removeAttribute("cpu_row");

            // Aggiungiamo l'attributo cpu_empty_row
            document.getElementById(id).setAttribute("cpu_empty_row", "");

            // Rimuoviamo l'ID
            document.getElementById(id).removeAttribute("id");

            // Rimuoviamo 1 al movimento verticale per non considerare più la riga svuotata
            cpuVerticalMovementsNumber--;

            // Incrementiamo il numero di righe inesistenti
            empty_rows_number++;
        }

    }

    // Controlliamo se il numero di righe vuote è uguale al numero di righe contenti gli alieni > VITTORIA
    if (nRowsCPU == empty_rows_number)
        victory();

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

        // Prendi timestamp attuale
        var now = Date.now();

        // Solo barra spaziatrice consentita e non quando è game over o vittoria
        if (event.keyCode != 32 || isGameOver || isVictory || (now - bulletShotTimestamp) < 300) return;

        // Settiamo ultimo sparo
        bulletShotTimestamp = now;

        // Mostriamo proiettile
        renderBullet();
    });
}
//#endregion

//#region Bullet
function renderBullet() {
    // Creiamo proiettile
    bullet = document.createElement("div");

    // Aggiungiamo classe
    bullet.className = "bullet";

    // Centriamo sopra la posizione corrente della nave
    bullet.style.left = `${currentPositionX - shipMargin}px`;
    bullet.style.bottom = 0;

    // Aggiungiamo l'attributo con l'indice
    bullet.setAttribute("bullet-index", bulletIndex);

    // Inserisci riga
    document.getElementById("cpuContainer").appendChild(bullet);

    // Incrementiamo l'indice
    bulletIndex++;
}
function initBulletInterval() {

    setInterval(() => {

        // Prendiamo tutti i proiettili
        var bullets = document.querySelectorAll("[bullet-index]");

        // Controlliamo che ci siano proiettili
        if (bullets.length == 0)
            return;

        // Muovi proiettile
        moveBullet(bullets);

        // Controlla collisione con alieno
        checkBulletCollision(bullets);

    }, bulletSpeed);
}
function moveBullet(bullets) {

    // Muoviamo i proiettili
    bullets.forEach(bullet => {

        bullet.style.bottom = `${parseInt(bullet.style.bottom) + 1}px`;

        // Se arrivato in cima, rimuoviamo
        if (parseInt(bullet.style.bottom) >= document.getElementById("cpuContainer").offsetHeight) {

            // Prendiamo indice
            var i = bullet.getAttribute("bullet-index");

            // Rimuoviamo elemento
            document.querySelector(`[bullet-index="${i}"]`).remove();
        }

    });
}
function checkBulletCollision(bullets) {

    // Prendiamo gli alieni
    var aliens = document.querySelectorAll("[alien]");

    // Controlliamo tutti i proiettili
    bullets.forEach(bullet => {

        // Prendiamo le coordinate del proiettile
        var coords_bullet = bullet.getBoundingClientRect();

        aliens.forEach(alien => {

            // Prendiamo l'immagine dell'alieno
            var alien_img = alien.querySelector(".aliens");

            // Controlliamo che l'alieno esista ancora
            if (alien_img == null || alien_img == undefined)
                return;

            // Prendiamo le coordinate dell'alienop
            var coords_alien = alien_img.getBoundingClientRect();

            // Prendiamo la larghezza dell'alieno
            var width = alien_img.offsetWidth;

            // Prendiamo l'altezza dell'alieno
            var height = alien_img.offsetHeight;

            // Controlliamo se collidono
            if ((coords_alien.x <= coords_bullet.x && (coords_alien.x + width) >= coords_bullet.x) && (coords_alien.y <= coords_bullet.y && (coords_alien.y + height) >= coords_bullet.y)) {

                aliensKilled++;
                document.getElementById("currentPoints").innerHTML = aliensKilled * 10;

                // Rimuovi proiettile
                bullet.remove();

                // Rimuoviamo l'attributo alien all'alieno
                alien.removeAttribute("alien");

                // Aggiungiamo l'attributo empty all'alieno
                alien.setAttribute("empty", "");

                // Sostituiamo l'immmagine dell'alieno con quella dell'esplosione
                alien_img.setAttribute("src", "./Immagini/Explosion.png");

                setTimeout(() => {
                    // Rimuoviamo l'immagine
                    alien_img.remove();

                    // Rimuoviamo le righe vuota
                    removeCPUEmptyRows();
                }, 500);
            }
        });
    });

}
//#endregion