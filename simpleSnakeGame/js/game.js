let canvas = document.getElementById("canvas"); //zeichnet Element auf der HTML Seite
let ctx = canvas.getContext("2d");  //zeichenstift
let cols = 30;  //spalten
let rows = 30;  //reihen
let snake = [{}];   //die snake
let food = {};  //die narung
let cellWidth = canvas.width / cols;    //einzelne Zellenbreite
let cellHeight = canvas.height / rows;  //einzelne Zellenhöhe
let direction = ""; //event schreibt hier die richtung rein
let foodCollected = false;  //wenn narung gegessen wurde true
let step = false;   //wenn ein schritt gemacht wurde, damit man die richtung nur einmal ändern kann

initGame();
startGameLoop();

function initGame() {
    placeFood(); //setzt random die Narung
    placeSnake(); //setzt random den Kopf der Snake
    setEventListener(); //setzt den eventListener für die Tasten
}

function startGameLoop() {
    setInterval(gameLoop, 100); //startet die GameLoop
    draw(); //startet die DrawLoop
}

function draw() {
    //Loop
    drawBackground(); //zeichnet den hintergrund
    drawSnake(); //zeichent die snake
    drawFood(); //zeichent die narung
    requestAnimationFrame(draw); //drawLoop https://wiki.selfhtml.org/wiki/JavaScript/Window/requestAnimationFrame
}
function gameLoop() {
    //Loop
    testGameOver(); //testet ob man verloren hat
    addPartToSnake(); //gibt einen part an die snake dazu
    shiftSnake(); //setzt die snakeparts einen weiter wie den vorgänger
    setDirection(); //legt die richtung fest
    checkSnakeOnFood(); //testet ob der kopf auf dem essen ist
}
function setEventListener() {
    document.addEventListener(
        "keydown",
        (e) => {
            newGame = false;
            keyDown(e);
        }
    );
}
function placeSnake() {
    let randomX = Math.floor(
        Math.random() * cols
    );
    let randomY = Math.floor(
        Math.random() * rows
    );

    snake[0].x = randomX;
    snake[0].y = randomY;
}
function placeFood() {
    let randomX = Math.floor(
        Math.random() * cols
    );
    let randomY = Math.floor(
        Math.random() * rows
    );
    food.x = randomX;
    food.y = randomY;
    let findParts = snake.find(
        (part) =>
            part.x == food.x &&
            part.y == food.y
    );
    if (findParts) {
        placeFood();
    }
}
function testGameOver() {
    if (isSnakeRunIntoWall()) resetGame(); //test ob die schlange in die wand läuft
    if (isSnakeIfBite()) resetGame(); //test ob die schlange sich selber beist
}
function addPartToSnake() {
    if (foodCollected) {
        snake = [
            { x: snake[0].x, y: snake[0].y }, //snake wird zu  (neuer part + ... rest der snake
            ...snake,
        ];
        foodCollected = false; //hat die schlange gegessen: nein
    }
}
function shiftSnake() {
    for (
        let snakeLenght = snake.length - 1;
        snakeLenght > 0;
        snakeLenght--
    ) {
        const partBefor = snake[snakeLenght];
        const partAfter = snake[snakeLenght - 1];
        partBefor.x = partAfter.x;
        partBefor.y = partAfter.y;
    }
}
function setDirection() {
    //wenn event keydown gleich der keynumber, dann wird
    //der schlangenkopf in die nächste richtung versetzt
    if (direction == "LEFT") {
        snake[0].x--;
    }
    if (direction == "RIGHT") {
        snake[0].x++;
    }
    if (direction == "UP") {
        snake[0].y--;
    }
    if (direction == "DOWN") {
        snake[0].y++;
    }

    step = false; //snake hat einen schritt durchgeführt
}
function checkSnakeOnFood() {
    if (
        snake[0].x == food.x &&
        snake[0].y == food.y
    ) {
        foodCollected = true; //hat die schlange gegessen: ja
        placeFood(); //plaziert neues food
    }
}

function resetGame() {
    direction = ""; //bewegung abschalten
    snake = [{}]; //snake auf null parts setzen
    placeFood(); //narung neu plazieren
    placeSnake(); //snake neu plazieren
}

function isSnakeRunIntoWall() {
    if (isSnakeOutLeft()) return true;
    if (isSnakeOutRight()) return true;
    if (isSnakeOutTop()) return true;
    if (isSnakeOutBottom()) return true;
    return false;
}

function isSnakeOutLeft() {
    return snake[0].x < 0 ? true : false;
}

function isSnakeOutRight() {
    return snake[0].x > cols - 1
        ? true
        : false;
}

function isSnakeOutTop() {
    return snake[0].y < 0 ? true : false;
}

function isSnakeOutBottom() {
    return snake[0].y > rows - 1
        ? true
        : false;
}

function isSnakeIfBite() {
    let firstPart = snake[0];
    let otherParts = snake.slice(1);
    let duplicatePart = otherParts.find(
        (part) =>
            part.x == firstPart.x &&
            part.y == firstPart.y
    );
    return duplicatePart ? true : false;
}

function drawFood() {
    ctx.fillStyle = "orange";
    add(food.x, food.y);
}

function drawSnake() {
    ctx.fillStyle = "white";
    snake.forEach((part) =>
        add(part.x, part.y)
    );
}

function drawBackground() {
    ctx.fillStyle = "black";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

function keyDown(e) {
    if (!step) {
        if (e.keyCode == 37) {
            if (direction != "RIGHT") {
                direction = "LEFT";
                step = true;
            }
        }
        if (e.keyCode == 38) {
            if (direction != "DOWN") {
                direction = "UP";
                step = true;
            }
        }
        if (e.keyCode == 39) {
            if (direction != "LEFT") {
                direction = "RIGHT";
                step = true;
            }
        }
        if (e.keyCode == 40) {
            if (direction != "UP") {
                direction = "DOWN";
                step = true;
            }
        }
    }
}

function add(x, y) {
    ctx.fillRect(
        x * cellWidth,
        y * cellHeight,
        cellWidth - 1,
        cellHeight - 1
    );
}
