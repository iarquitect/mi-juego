// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando juego...');

    // --- OBTENER ELEMENTOS DEL DOM ---
    const canvas = document.getElementById('gameCanvas');
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const scoreElement = document.getElementById('score');
    const livesElement = document.getElementById('lives');
    const levelElement = document.getElementById('level');

    if (!canvas || !startButton || !pauseButton || !scoreElement || !livesElement || !levelElement) {
        console.error('Error: Faltan elementos del DOM.');
        return;
    }

    const ctx = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1080;

    // --- CONFIGURACIÓN Y CONSTANTES DEL JUEGO ---
    const PLAYER_MOVE_SPEED = 2.5;
    const PLAYER_JUMP_SPEED = -10;
    const PLAYER_GRAVITY = 0.25;
    const BARREL_SPAWN_INTERVAL = 180;
    const BARREL_GRAVITY = 0.15;
    const BARREL_HORIZONTAL_SPEED = -2.0;
    const BARREL_BOUNCE_FACTOR = 0.7;
    const PLAYER_DRAW_W = 64, PLAYER_DRAW_H = 128;
    const ENEMY_DRAW_W = 128, ENEMY_DRAW_H = 128;
    const BARREL_DRAW_W = 64, BARREL_DRAW_H = 64;

    // --- ESTADO DEL JUEGO ---
    let gameRunning = false;
    let gamePaused = false;
    let score = 0;
    let lives = 3;
    let level = 1;
    let barrelTimer = 0;
    let enemyState = 'idle';
    let throwAnimationTimer = 0;
    const keys = {};

    // --- OBJETOS DEL JUEGO ---
    const player = {
        x: 100, y: 912, width: PLAYER_DRAW_W, height: PLAYER_DRAW_H,
        speedX: 0, speedY: 0, onGround: false, jumping: false
    };

    const enemy = {
        x: 1650, y: 220, width: ENEMY_DRAW_W, height: ENEMY_DRAW_H
    };
    
    // CAMBIO 1: LAS PLATAFORMAS DE COLISIÓN (EL "ESQUELETO" INVISIBLE)
    // Estas son las plataformas que la física "siente". Debés ajustarlas para que coincidan con tu imagen.
    const platforms = [
        { x: 0, y: 1000, width: 1920, height: 80 },   // Suelo base, más grueso
        { x: 280, y: 900, width: 350, height: 24 },   // Escalón 1
        { x: 560, y: 780, width: 350, height: 24 },   // Escalón 2
        { x: 840, y: 660, width: 350, height: 24 },   // Escalón 3
        { x: 1120, y: 540, width: 350, height: 24 },  // Escalón 4
        { x: 1400, y: 420, width: 350, height: 24 },  // Escalón 5
        { x: 1650, y: 348, width: 270, height: 24 }   // Plataforma del enemigo (ajustada para estar debajo de él)
    ];

    const barrels = [];
    
    // CAMBIO 2: OBJETO PARA DIBUJAR LA IMAGEN DE LA ESCALERA
    const escaleraVisual = {
        x: 150, // Posición X donde se dibuja la imagen. ¡AJUSTAR!
        y: 280, // Posición Y donde se dibuja la imagen. ¡AJUSTAR!
        width: 1600, // Ancho de la imagen. ¡AJUSTAR!
        height: 725 // Alto de la imagen. ¡AJUSTAR!
    };

    // --- CARGA DE ASSETS (IMÁGENES) ---
    // CAMBIO 3: ASEGURARSE QUE 'escalera.png' ESTÉ EN LA LISTA
    const spriteSources = {
        player_walk: 'images/personaje1_caminando.png',
        player_jump: 'images/personaje1_saltando.png',
        enemy_idle: 'images/enemigos1_esperando.png',
        enemy_throw: 'images/enemigos1_tirandobarril.png',
        enemy_celebrate: 'images/enemigos1_festejando.png',
        barrel: 'images/barril_caída.png',
        barrel_view: 'images/barril_vista.png',
        tube_in: 'images/tubo_entrada.png',
        tube_out: 'images/tubo_salida.png',
        escalera: 'images/escalera.png'
    };

    const spriteImgs = {};
    let imagesLoaded = 0;
    const numImages = Object.keys(spriteSources).length;

    function preloadAssets(callback) {
        console.log('Precargando assets...');
        for (const key in spriteSources) {
            spriteImgs[key] = new Image();
            spriteImgs[key].src = spriteSources[key];
            spriteImgs[key].onload = () => {
                imagesLoaded++;
                console.log(`Imagen cargada: ${spriteSources[key]}`);
                if (imagesLoaded === numImages) {
                    console.log('¡Todos los assets fueron cargados!');
                    callback();
                }
            };
            spriteImgs[key].onerror = () => {
                console.error(`Error cargando la imagen: ${spriteSources[key]}`);
            };
        }
    }

    // --- MANEJO DE ENTRADAS ---
    document.addEventListener('keydown', (e) => { keys[e.code] = true; });
    document.addEventListener('keyup', (e) => { keys[e.code] = false; });
    startButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', togglePause);

    function clearAllKeys() {
        Object.keys(keys).forEach(key => {
            keys[key] = false;
        });
    }

    // --- FUNCIONES PRINCIPALES DEL JUEGO ---
    function resetPlayer() {
        player.x = 48 + 10;
        player.y = 1000 - player.height; // Sobre el suelo base
        player.speedX = 0;
        player.speedY = 0;
        player.onGround = false;
        player.jumping = false;
        clearAllKeys();
    }

    function startGame() {
        if (gameRunning) return;
        console.log('Iniciando juego...');
        gameRunning = true;
        gamePaused = false;
        score = 0;
        lives = 3;
        level = 1;
        barrels.length = 0;
        barrelTimer = 0;
        enemyState = 'idle';
        throwAnimationTimer = 0;
        clearAllKeys();
        resetPlayer();
        updateUI();
        gameLoop();
    }

    function togglePause() {
        if (!gameRunning) return;
        gamePaused = !gamePaused;
        pauseButton.textContent = gamePaused ? 'Reanudar' : 'Pausar';
        if (!gamePaused) {
            gameLoop();
        }
    }

    function gameOver() {
        gameRunning = false;
        enemyState = 'celebrating';
        alert(`¡Game Over! Puntuación: ${score}`);
    }

    // --- LÓGICA DE ACTUALIZACIÓN (UPDATE) ---
    // ¡SIN CAMBIOS EN LA FÍSICA! Sigue usando el array `platforms`.
    function update() {
        if (!gameRunning || gamePaused) return;
        updatePlayer();
        createAndupdateBarrels();
        updateEnemyAnimation();
        checkCollisions();
        updateUI();
    }

    function updatePlayer() {
        if (keys['ArrowLeft']) {
            player.speedX = -PLAYER_MOVE_SPEED;
        } else if (keys['ArrowRight']) {
            player.speedX = PLAYER_MOVE_SPEED;
        } else {
            player.speedX = 0;
        }

        if (keys['Space'] && player.onGround) {
            player.speedY = PLAYER_JUMP_SPEED;
            player.onGround = false;
            player.jumping = true;
        }

        player.speedY += PLAYER_GRAVITY;
        player.x += player.speedX;
        player.y += player.speedY;

        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

        player.onGround = false;
        for (const platform of platforms) {
            if (player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y + player.height > platform.y &&
                player.y + player.height - player.speedY <= platform.y + 1
            ) {
                player.y = platform.y - player.height;
                player.speedY = 0;
                player.onGround = true;
                player.jumping = false;
                break;
            }
        }
    }

    function updateEnemyAnimation() {
        if (enemyState === 'throwing') {
            throwAnimationTimer++;
            if (throwAnimationTimer > 30) {
                enemyState = 'idle';
                throwAnimationTimer = 0;
            }
        }
    }

    function createAndupdateBarrels() {
        barrelTimer++;
        if (barrelTimer >= BARREL_SPAWN_INTERVAL) {
            barrelTimer = 0;
            enemyState = 'throwing';
            throwAnimationTimer = 0;
            
            barrels.push({
                x: enemy.x + enemy.width / 2 - BARREL_DRAW_W / 2,
                y: enemy.y + enemy.height / 2,
                width: BARREL_DRAW_W,
                height: BARREL_DRAW_H,
                speedY: 2,
                speedX: BARREL_HORIZONTAL_SPEED,
            });
        }

        for (let i = barrels.length - 1; i >= 0; i--) {
            const barrel = barrels[i];
            barrel.speedY += BARREL_GRAVITY;
            barrel.y += barrel.speedY;
            barrel.x += barrel.speedX;

            for (const platform of platforms) {
                if (barrel.x < platform.x + platform.width &&
                    barrel.x + barrel.width > platform.x &&
                    barrel.y + barrel.height > platform.y &&
                    barrel.y + barrel.height - barrel.speedY <= platform.y + 1
                ) {
                    barrel.y = platform.y - barrel.height;
                    barrel.speedY *= -BARREL_BOUNCE_FACTOR;
                    if (Math.abs(barrel.speedY) < 1) barrel.speedY = 0;
                }
            }
            
            if (barrel.x + barrel.width < 0 || barrel.y > canvas.height) {
                barrels.splice(i, 1);
                score += 10;
            }
        }
    }

    function checkCollisions() {
        for (let i = barrels.length - 1; i >= 0; i--) {
            const barrel = barrels[i];
            if (player.x < barrel.x + barrel.width &&
                player.x + player.width > barrel.x &&
                player.y < barrel.y + barrel.height &&
                player.y + player.height > barrel.y) {
                barrels.splice(i, 1);
                lives--;
                if (lives <= 0) {
                    gameOver();
                } else {
                    resetPlayer();
                }
                break;
            }
        }
    }

    // --- LÓGICA DE DIBUJADO (DRAW) ---
    function draw() {
        // Fondo
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#4682B4');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // CAMBIO 4: DIBUJAR LA IMAGEN DE LA ESCALERA
        if (spriteImgs.escalera && spriteImgs.escalera.complete) {
            ctx.drawImage(spriteImgs.escalera, escaleraVisual.x, escaleraVisual.y, escaleraVisual.width, escaleraVisual.height);
        }

        // CAMBIO 5: YA NO DIBUJAMOS LAS PLATAFORMAS RECTANGULARES
        /*
        // Descomentá este bloque para ver las cajas de colisión invisibles
        ctx.fillStyle = 'rgba(255, 0, 0, 0.4)'; // Rojo semitransparente
        for (const platform of platforms) {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
        */

        // Tubos
        ctx.drawImage(spriteImgs.tube_in, 0, 1000 - 96, 48, 96);
        ctx.drawImage(spriteImgs.tube_out, canvas.width - 48, enemy.y + enemy.height - 96, 48, 96);

        // Enemigo con animación
        let enemySprite;
        if (enemyState === 'idle') {
            enemySprite = spriteImgs.enemy_idle;
        } else if (enemyState === 'throwing') {
            enemySprite = spriteImgs.enemy_throw;
        } else if (enemyState === 'celebrating') {
            enemySprite = spriteImgs.enemy_celebrate;
        }
        ctx.drawImage(enemySprite, enemy.x, enemy.y, enemy.width, enemy.height);

        // Barril de vista (al lado del enemigo) solo cuando está idle
        if (enemyState === 'idle' && barrelTimer < BARREL_SPAWN_INTERVAL - 30) {
            ctx.drawImage(spriteImgs.barrel_view, enemy.x + enemy.width + 10, enemy.y + 20, 24, 48);
        }

        // Barriles
        for (const barrel of barrels) {
            ctx.drawImage(spriteImgs.barrel, barrel.x, barrel.y, barrel.width, barrel.height);
        }

        // Jugador
        const playerSprite = player.jumping ? spriteImgs.player_jump : spriteImgs.player_walk;
        ctx.drawImage(playerSprite, player.x, player.y, player.width, player.height);
    }

    function updateUI() {
        scoreElement.textContent = score;
        livesElement.textContent = lives;
        levelElement.textContent = level;
    }

    // --- BUCLE PRINCIPAL DEL JUEGO ---
    function gameLoop() {
        update();
        draw();
        if (gameRunning && !gamePaused) {
            requestAnimationFrame(gameLoop);
        }
    }

    // --- INICIO ---
    preloadAssets(() => {
        console.log('Listo para jugar. Presioná "Start".');
        updateUI();
        draw();
    });
}); 