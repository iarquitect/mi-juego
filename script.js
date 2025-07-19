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

    // --- CONFIGURACIÓN Y CONSTANTES DEL JUEGO (FÍSICA BUENA) ---
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

    // CAMBIO 1: SE RESTAURA EL POSICIONAMIENTO BUENO DE LOS OBJETOS
    const player = {
        x: 100, y: 0, // Se calculará dinámicamente
        width: PLAYER_DRAW_W, height: PLAYER_DRAW_H,
        speedX: 0, speedY: 0, onGround: false, jumping: false
    };

    const enemy = {
        x: 1650, y: 220, width: ENEMY_DRAW_W, height: ENEMY_DRAW_H
    };

    const escalera = {
        imgWidth: 0, imgHeight: 0, // Se obtendrá de la imagen
        x: 200, y: 0 // Se calculará dinámicamente
    };

    const suelo = {
        x: 0, y: canvas.height - 80, // Suelo grueso en la parte inferior
        width: 1920, height: 80
    };

    // PLATAFORMAS DE COLISIÓN (EL "ESQUELETO" INVISIBLE)
    // ESTA ES LA FÍSICA BUENA. AHORA HAY QUE ALINEARLA CON LA IMAGEN.
    const platforms = [
        // El primer elemento ahora es el nuevo suelo
        { x: suelo.x, y: suelo.y, width: suelo.width, height: suelo.height },
        // El resto de las plataformas invisibles para los escalones
        { x: 280, y: 900, width: 350, height: 24 },
        { x: 560, y: 780, width: 350, height: 24 },
        { x: 840, y: 660, width: 350, height: 24 },
        { x: 1120, y: 540, width: 350, height: 24 },
        { x: 1400, y: 420, width: 350, height: 24 },
        { x: 1650, y: 348, width: 270, height: 24 } // Plataforma del enemigo
    ];

    const barrels = [];

    // --- CARGA DE ASSETS (IMÁGENES) ---
    const spriteSources = {
        player_walk: 'images/personaje1_caminando.png',
        player_jump: 'images/personaje1_saltando.png',
        enemy_idle: 'images/enemigos1_esperando.png',
        enemy_throw: 'images/enemigos1_tirandobarril.png',
        enemy_celebrate: 'images/enemigos1_festejando.png',
        barrel: 'images/barril_caída.png',
        barrel_view: 'images/barril_vista.png',
        escalera: 'images/escalera.png',
        tube_in: 'images/tubo_entrada.png',
        tube_out: 'images/tubo_salida.png',
        nuevo_fondo: 'images/nuevo-fondo.jpg'
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
                // CAMBIO 2: LÓGICA DE POSICIONAMIENTO VISUAL RESTAURADA
                if (key === 'escalera') {
                    escalera.imgWidth = spriteImgs[key].width;
                    escalera.imgHeight = spriteImgs[key].height;
                    // Posiciona la imagen de la escalera para que su base descanse sobre el suelo
                    escalera.y = suelo.y - escalera.imgHeight;
                }
                if (imagesLoaded === numImages) {
                    // Una vez todo cargado, se define la posición inicial del jugador
                    player.y = suelo.y - player.height;
                    console.log('¡Todos los assets fueron cargados!');
                    callback();
                }
            };
            spriteImgs[key].onerror = () => console.error(`Error cargando: ${spriteSources[key]}`);
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
        player.x = 100;
        player.y = suelo.y - player.height;
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

    // --- LÓGICA DE ACTUALIZACIÓN (FÍSICA BUENA, SIN CAMBIOS) ---
    function update() {
        if (!gameRunning || gamePaused) return;
        updatePlayer();
        createAndupdateBarrels();
        updateEnemyAnimation();
        checkCollisions();
        updateUI();
    }

    function updatePlayer() {
        if (keys['ArrowLeft']) player.speedX = -PLAYER_MOVE_SPEED;
        else if (keys['ArrowRight']) player.speedX = PLAYER_MOVE_SPEED;
        else player.speedX = 0;
        
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
                x: enemy.x, y: enemy.y + enemy.height,
                width: BARREL_DRAW_W, height: BARREL_DRAW_H,
                speedY: 2, speedX: BARREL_HORIZONTAL_SPEED,
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
        // NUEVO FONDO
        if (spriteImgs.nuevo_fondo && spriteImgs.nuevo_fondo.complete) {
            // Dibujar el fondo escalado para cubrir todo el canvas
            ctx.drawImage(spriteImgs.nuevo_fondo, 0, 0, canvas.width, canvas.height);
        } else {
            // Fallback: gradiente si la imagen no está cargada
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(1, '#4682B4');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Suelo
        ctx.fillStyle = '#D2B48C';
        ctx.fillRect(suelo.x, suelo.y, suelo.width, suelo.height);

        // Escalera
        if (spriteImgs.escalera && spriteImgs.escalera.complete) {
            ctx.drawImage(spriteImgs.escalera, escalera.x, escalera.y, escalera.imgWidth, escalera.imgHeight);
        }

        // Tubos CAMBIO 3: POSICIÓN DE TUBOS RESTAURADA
        if (spriteImgs.tube_in && spriteImgs.tube_in.complete) {
            ctx.drawImage(spriteImgs.tube_in, 0, suelo.y - 96, 48, 96);
        }
        if (spriteImgs.tube_out && spriteImgs.tube_out.complete) {
            ctx.drawImage(spriteImgs.tube_out, canvas.width - 48, platforms[platforms.length - 1].y - 96, 48, 96);
        }

        // **DEBUG: Descomentar para ver las plataformas de colisión**
        /*
        ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
        for (const platform of platforms) {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
        */

        // Enemigo con animación
        let enemySprite;
        if (enemyState === 'idle') {
            enemySprite = spriteImgs.enemy_idle;
        } else if (enemyState === 'throwing') {
            enemySprite = spriteImgs.enemy_throw;
        } else if (enemyState === 'celebrating') {
            enemySprite = spriteImgs.enemy_celebrate;
        }
        if (enemySprite) ctx.drawImage(enemySprite, enemy.x, enemy.y, enemy.width, enemy.height);

        // Barril de vista (al lado del enemigo) solo cuando está idle
        if (enemyState === 'idle' && barrelTimer < BARREL_SPAWN_INTERVAL - 30) {
            if (spriteImgs.barrel_view) {
                ctx.drawImage(spriteImgs.barrel_view, enemy.x + enemy.width + 10, enemy.y + 20, 24, 48);
            }
        }

        // Barriles
        for (const barrel of barrels) {
            if (spriteImgs.barrel) ctx.drawImage(spriteImgs.barrel, barrel.x, barrel.y, barrel.width, barrel.height);
        }

        // Jugador
        const playerSprite = player.jumping ? spriteImgs.player_jump : spriteImgs.player_walk;
        if (playerSprite) ctx.drawImage(playerSprite, player.x, player.y, player.width, player.height);
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