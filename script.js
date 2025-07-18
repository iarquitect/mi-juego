// --- VARIABLES GLOBALES DEL JUEGO ---
// Canvas y contexto
let canvas, ctx;

// Elementos del DOM
let startButton, pauseButton;

// Estado del juego
let gameRunning = false;
let gamePaused = false;
let score = 0;
let lives = 3;
let level = 1;
let barrelTimer = 0;
let barrelInterval = 180;
let frameCount = 0;

// Constantes de física súper lenta
const PLAYER_GRAVITY = 0.12;
const PLAYER_JUMP_SPEED = -3.2;
const PLAYER_MOVE_SPEED = 1.2;
const BARRIL_GRAVITY = 0.09;
const BARRIL_INIT_VY = 2.2;
const BARRIL_INIT_VX = -3.5;
const BARRIL_LAUNCH_INTERVAL = 180;
const BARRIL_REBOTES_MAX = 6;

// Constantes de dibujo
const PLAYER_DRAW_W = 48;
const PLAYER_DRAW_H = 96;
const ENEMY_DRAW_W = 64;
const ENEMY_DRAW_H = 64;
const TUBE_DRAW_W = 48;
const TUBE_DRAW_H = 96;
const BARRIL_DRAW_W = 32;
const BARRIL_DRAW_H = 32;
const BARRIL_VISTA_W = 24;
const BARRIL_VISTA_H = 48;

// Posiciones de elementos
const tubeInPos = { x: 100, y: 1040 - TUBE_DRAW_H, w: TUBE_DRAW_W, h: TUBE_DRAW_H };
const tubeOutPos = { x: 1750, y: 200, w: TUBE_DRAW_W, h: TUBE_DRAW_H };
const enemiesPos = { x: 1600, y: 200 };
const barrilVistaPos = { x: 1700, y: 150 };

// Suelo base
const suelo = { x: 0, y: 1040, width: 1920, height: 40 };

// Plataformas escalonadas
const platforms = [
    { x: 0, y: 1040, width: 1920, height: 40 }, // Suelo
    { x: 300, y: 900, width: 350, height: 24 },
    { x: 600, y: 760, width: 350, height: 24 },
    { x: 900, y: 620, width: 350, height: 24 },
    { x: 1200, y: 480, width: 350, height: 24 },
    { x: 1500, y: 340, width: 350, height: 24 },
    { x: 1700, y: 200, width: 180, height: 24 },
];

// Objetos del juego
const player = {
    x: tubeInPos.x + TUBE_DRAW_W + 20,
    y: suelo.y - PLAYER_DRAW_H,
    width: 32,
    height: 32,
    speedX: 0,
    speedY: 0,
    onGround: false,
    frame: 0,
    frameCount: 0,
    direction: 1,
    jumping: false,
    moveSpeed: 1.5,
    jumpSpeed: -8
};

const barrels = [];
const enemies = [];
const keys = {};

// Estado de enemigos y barriles
let enemigosEstado = 'esperando';
let barrilEnCaida = null;

// Sprites
const spriteImgs = {
    personaje_caminando: new Image(),
    personaje_saltando: new Image(),
    enemigos_esperando: new Image(),
    enemigos_tirandobarril: new Image(),
    enemigos_festejando: new Image(),
    barril_vista: new Image(),
    barril_caida: new Image(),
    tubo_entrada: new Image(),
    tubo_salida: new Image()
};

// Cargar sprites
spriteImgs.personaje_caminando.src = 'images/personaje1_caminando.png';
spriteImgs.personaje_saltando.src = 'images/personaje1_saltando.png';
spriteImgs.enemigos_esperando.src = 'images/enemigos1_esperando.png';
spriteImgs.enemigos_tirandobarril.src = 'images/enemigos1_tirandobarril.png';
spriteImgs.enemigos_festejando.src = 'images/enemigos1_festejando.png';
spriteImgs.barril_vista.src = 'images/barril_vista.png';
spriteImgs.barril_caida.src = 'images/barril_caída.png';
spriteImgs.tubo_entrada.src = 'images/tubo_entrada.png';
spriteImgs.tubo_salida.src = 'images/tubo_salida.png';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing game...');
    
    // Debug: List all elements with IDs to see what's available
    console.log('=== DEBUGGING DOM ELEMENTS ===');
    const allElements = document.querySelectorAll('[id]');
    console.log('All elements with IDs:', allElements);
    allElements.forEach(el => {
        console.log(`Element with ID "${el.id}":`, el);
    });
    
    // Game variables - with detailed error checking
    canvas = document.getElementById('gameCanvas');
    console.log('Canvas found:', canvas);
    
    startButton = document.getElementById('startButton');
    console.log('Start button found:', startButton);
    
    pauseButton = document.getElementById('pauseButton');
    console.log('Pause button found:', pauseButton);

    // Check if elements exist
    if (!canvas) {
        console.error('Canvas not found!');
        return;
    }
    if (!startButton) {
        console.error('Start button not found!');
        return;
    }
    if (!pauseButton) {
        console.error('Pause button not found!');
        return;
    }

    ctx = canvas.getContext('2d');
    console.log('Canvas context created:', ctx);

    // Add event listeners with error checking
    try {
        document.addEventListener('keydown', (e) => {
            keys[e.code] = true;
        });
        console.log('Keydown listener added');
    } catch (error) {
        console.error('Error adding keydown listener:', error);
    }

    try {
        document.addEventListener('keyup', (e) => {
            keys[e.code] = false;
        });
        console.log('Keyup listener added');
    } catch (error) {
        console.error('Error adding keyup listener:', error);
    }

    // Button event listeners with error checking
    try {
        if (startButton) {
            startButton.addEventListener('click', startGame);
            console.log('Start button listener added');
        } else {
            console.error('Start button is null, cannot add listener');
        }
    } catch (error) {
        console.error('Error adding start button listener:', error);
    }

    try {
        if (pauseButton) {
            pauseButton.addEventListener('click', togglePause);
            console.log('Pause button listener added');
        } else {
            console.error('Pause button is null, cannot add listener');
        }
    } catch (error) {
        console.error('Error adding pause button listener:', error);
    }

    console.log('Game initialized successfully!');
});

// --- FUNCIONES DEL JUEGO ---
function startGame() {
    console.log('Game started!');
    gameRunning = true;
    gamePaused = false;
    score = 0;
    lives = 3;
    level = 1;
    barrels.length = 0;
    enemies.length = 0;
    barrelTimer = 0;
    frameCount = 0;
    player.x = tubeInPos.x + TUBE_DRAW_W + 20;
    player.y = suelo.y - PLAYER_DRAW_H;
    updateUI();
    gameLoop();
}

function togglePause() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        pauseButton.textContent = gamePaused ? 'Reanudar' : 'Pausar';
    }
}

function updateUI() {
    const scoreElement = document.getElementById('score');
    const livesElement = document.getElementById('lives');
    const levelElement = document.getElementById('level');
    
    if (scoreElement) scoreElement.textContent = score;
    if (livesElement) livesElement.textContent = lives;
    if (levelElement) levelElement.textContent = level;
}

function updatePlayer() {
    // Movimiento lateral
    if (keys['ArrowLeft']) {
        player.speedX = -PLAYER_MOVE_SPEED;
        player.direction = -1;
    } else if (keys['ArrowRight']) {
        player.speedX = PLAYER_MOVE_SPEED;
        player.direction = 1;
    } else {
        player.speedX = 0;
    }
    // Salto
    if (keys['Space'] && player.onGround) {
        player.speedY = PLAYER_JUMP_SPEED;
        player.onGround = false;
        player.jumping = true;
    }
    // Gravedad lenta
    if (!player.onGround) {
        player.speedY += PLAYER_GRAVITY;
    }
    // Actualizar posición
    player.x += player.speedX;
    player.y += player.speedY;
    // Limitar a los bordes
    if (player.x < 0) player.x = 0;
    if (player.x + PLAYER_DRAW_W > canvas.width) player.x = canvas.width - PLAYER_DRAW_W;
    // Colisión con plataformas
    player.onGround = false;
    for (const platform of platforms) {
        if (
            player.x < platform.x + platform.width &&
            player.x + PLAYER_DRAW_W > platform.x &&
            player.y + PLAYER_DRAW_H > platform.y &&
            player.y + PLAYER_DRAW_H - player.speedY <= platform.y
        ) {
            player.y = platform.y - PLAYER_DRAW_H;
            player.speedY = 0;
            player.onGround = true;
            player.jumping = false;
        }
    }
}

function updateBarrelAndEnemies() {
    if (!barrilEnCaida) {
        barrilTimer++;
        if (barrilTimer > BARRIL_LAUNCH_INTERVAL) {
            enemigosEstado = 'tirando';
            setTimeout(() => {
                barrilEnCaida = {
                    x: barrilVistaPos.x,
                    y: barrilVistaPos.y,
                    vy: BARRIL_INIT_VY,
                    vx: BARRIL_INIT_VX,
                    rebotes: 0,
                    plataformaActual: platforms.length - 2
                };
                enemigosEstado = 'esperando';
                barrilTimer = 0;
            }, 500);
        }
    } else {
        barrilEnCaida.x += barrilEnCaida.vx;
        barrilEnCaida.y += barrilEnCaida.vy;
        barrilEnCaida.vy += BARRIL_GRAVITY;
        if (barrilEnCaida.plataformaActual >= 0) {
            const plat = platforms[barrilEnCaida.plataformaActual];
            if (
                barrilEnCaida.y + BARRIL_DRAW_H > plat.y &&
                barrilEnCaida.y + BARRIL_DRAW_H - barrilEnCaida.vy <= plat.y &&
                barrilEnCaida.x + BARRIL_DRAW_W > plat.x &&
                barrilEnCaida.x < plat.x + plat.width
            ) {
                barrilEnCaida.y = plat.y - BARRIL_DRAW_H;
                barrilEnCaida.vy = -barrilEnCaida.vy * 0.7;
                barrilEnCaida.vx *= 0.95;
                barrilEnCaida.rebotes++;
                barrilEnCaida.plataformaActual--;
            }
        }
        if (barrilEnCaida.rebotes >= BARRIL_REBOTES_MAX || barrilEnCaida.y > 1080) {
            barrilEnCaida = null;
        }
    }
}

function drawPlatforms() {
    ctx.fillStyle = '#5ca3d6';
    // Dibujar suelo base
    ctx.fillRect(suelo.x, suelo.y, suelo.width, suelo.height);
    // Dibujar plataformas escalonadas
    for (let i = 1; i < platforms.length; i++) {
        const platform = platforms[i];
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
}

function drawEnemies() {
    let img;
    if (enemigosEstado === 'esperando') img = spriteImgs.enemigos_esperando;
    else if (enemigosEstado === 'tirando') img = spriteImgs.enemigos_tirandobarril;
    else img = spriteImgs.enemigos_festejando;
    ctx.drawImage(img, enemiesPos.x, enemiesPos.y, ENEMY_DRAW_W, ENEMY_DRAW_H);
    if (enemigosEstado === 'esperando' && !barrilEnCaida) {
        ctx.drawImage(spriteImgs.barril_vista, barrilVistaPos.x, barrilVistaPos.y, BARRIL_VISTA_W, BARRIL_VISTA_H);
    }
}

function drawTubes() {
    ctx.drawImage(spriteImgs.tubo_entrada, tubeInPos.x, tubeInPos.y, tubeInPos.w, tubeInPos.h);
    ctx.drawImage(spriteImgs.tubo_salida, tubeOutPos.x, tubeOutPos.y, tubeOutPos.w, tubeOutPos.h);
}

function drawBackground() {
    // Simple gradient background for now
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#4682B4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    const img = player.jumping ? spriteImgs.personaje_saltando : spriteImgs.personaje_caminando;
    ctx.drawImage(img, player.x, player.y, PLAYER_DRAW_W, PLAYER_DRAW_H);
}

function drawBarrels() {
    if (barrilEnCaida) {
        ctx.drawImage(spriteImgs.barril_caida, barrilEnCaida.x, barrilEnCaida.y, BARRIL_DRAW_W, BARRIL_DRAW_H);
    }
}

function drawEnemiesAndTopRight() {
    // Enemigos esperando
    drawEnemies();
    // Tubo de salida
    ctx.drawImage(spriteImgs.tubo_salida, tubeOutPos.x, tubeOutPos.y, tubeOutPos.w, tubeOutPos.h);
}

function draw() {
    drawBackground();
    drawTubes();
    drawPlatforms();
    drawEnemies();
    drawBarrels();
    drawPlayer();
}

function update() {
    if (!gameRunning || gamePaused) return;
    
    updatePlayer();
    updateBarrelAndEnemies();
    updateUI();
}

function gameLoop() {
    if (gameRunning && !gamePaused) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

function gameOver() {
    gameRunning = false;
    enemigosEstado = 'festejando';
    alert(`¡Game Over! Puntuación: ${score}`);
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
} 