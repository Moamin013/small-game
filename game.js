const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Speler vliegtuig
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 70,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0
};

// Kogels
const bullets = [];

// Vijandelijke vliegtuigen
const enemies = [];
let level = 1;
let score = 0;

// Eindbaas
let boss = null;

// Beweging van het vliegtuig
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") player.dx = -player.speed;
    if (e.key === "ArrowRight" || e.key === "d") player.dx = player.speed;
    if (e.key === "ArrowUp" || e.key === "w") player.dy = -player.speed;
    if (e.key === "ArrowDown" || e.key === "s") player.dy = player.speed;
    if (e.key === " ") shootBullet();
});

document.addEventListener('keyup', (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") player.dx = 0;
    if (e.key === "ArrowRight" || e.key === "d") player.dx = 0;
    if (e.key === "ArrowUp" || e.key === "w") player.dy = 0;
    if (e.key === "ArrowDown" || e.key === "s") player.dy = 0;
});

function shootBullet() {
    bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 5, height: 10, speed: 7 });
}

function drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function movePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    // Zorg ervoor dat het vliegtuig binnen het canvas blijft
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function drawBullets() {
    ctx.fillStyle = "yellow";
    for (let i = 0; i < bullets.length; i++) {
        ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
    }
}

function moveBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bullets[i].speed;

        // Verwijder kogels die buiten het scherm gaan
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

function createEnemies() {
    if (Math.random() < 0.02 * level) { // Verhoog kans per level
        const enemy = {
            x: Math.random() * (canvas.width - 50),
            y: -50,
            width: 50,
            height: 50,
            speed: 2 + level * 0.5
        };
        enemies.push(enemy);
    }
}

function drawEnemies() {
    ctx.fillStyle = "red";
    for (let i = 0; i < enemies.length; i++) {
        ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
    }
}

function moveEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += enemies[i].speed;

        // Verwijder vijanden die buiten het scherm gaan
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            i--;
        }
    }
}

function checkCollisions() {
    // Kogels raken vijanden
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (bullets[i].x < enemies[j].x + enemies[j].width &&
                bullets[i].x + bullets[i].width > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemies[j].height &&
                bullets[i].y + bullets[i].height > enemies[j].y) {
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                score += 10;
                break;
            }
        }
    }

    // Speler raakt vijanden
    for (let i = 0; i < enemies.length; i++) {
        if (player.x < enemies[i].x + enemies[i].width &&
            player.x + player.width > enemies[i].x &&
            player.y < enemies[i].y + enemies[i].height &&
            player.y + player.height > enemies[i].y) {
            // Game over, reset het spel
            alert("Game Over! Je score was: " + score);
            resetGame();
        }
    }
}

function levelUp() {
    if (score >= level * 100) {
        level++;
        alert("Level " + level + "!");
    }
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);
    ctx.fillText("Level: " + level, canvas.width - 100, 30);
}

function resetGame() {
    player.x = canvas.width / 2 - 25;
    player.y = canvas.height - 70;
    bullets.length = 0;
    enemies.length = 0;
    level = 1;
    score = 0;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    moveBullets();
    moveEnemies();
    createEnemies();

    drawPlayer();
    drawBullets();
    drawEnemies();
    checkCollisions();
    levelUp();
    drawScore();

    requestAnimationFrame(gameLoop);
}

gameLoop();
