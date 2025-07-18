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

    // Verificación robusta de elementos
    if (!canvas || !startButton || !pauseButton || !scoreElement || !livesElement || !levelElement) {
        console.error('Error: No se encontraron uno o más elementos esenciales del juego (canvas, botones, UI).');
        return;
    }

    const ctx = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1080;

    // --- CONFIGURACIÓN Y CONSTANTES DEL JUEGO ---

    // FÍSICA DEL JUGADOR
    const PLAYER_MOVE_SPEED = 2.5;  // Velocidad de movimiento lateral más fluida
    const PLAYER_JUMP_SPEED = -10;  // Salto más suave
    const PLAYER_GRAVITY = 0.25;    // Gravedad más realista y lenta

    // FÍSICA DE LOS BARRILES
    const BARREL_SPAWN_INTERVAL = 180; // Frames entre barriles (3 segundos a 60fps)
    const BARREL_GRAVITY = 0.15;
    const BARREL_HORIZONTAL_SPEED = -2.0;
    const BARREL_BOUNCE_FACTOR = 0.7; // Energía que retiene al rebotar

    // TAMAÑOS DE DIBUJO (SPRITES)
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
    let enemyState = 'idle'; // 'idle', 'throwing', 'celebrating'
    let throwAnimationTimer = 0;
    const keys = {};

    // --- OBJETOS DEL JUEGO ---
    const player = {
        x: 100,
        y: canvas.height - 40 - PLAYER_DRAW_H, // Inicia sobre el suelo
        width: PLAYER_DRAW_W,
        height: PLAYER_DRAW_H,
        speedX: 0,
        speedY: 0,
        onGround: false,
        jumping: false // Agregar estado de salto
    };

    const enemy = {
        x: 1720,
        y: 200 - ENEMY_DRAW_H,
        width: ENEMY_DRAW_W,
        height: ENEMY_DRAW_H
    };

    const platforms = [
        { x: 0, y: 1040, width: 1920, height: 40 }, // Suelo
        { x: 300, y: 900, width: 350, height: 24 },
        { x: 600, y: 760, width: 350, height: 24 },
        { x: 900, y: 620, width: 350, height: 24 },
        { x: 1200, y: 480, width: 350, height: 24 },
        { x: 1500, y: 340, width: 350, height: 24 },
        { x: 1700, y: 200, width: 180, height: 24 } // Plataforma del enemigo
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
        tube_in: 'images/tubo_entrada.png',
        tube_out: 'images/tubo_salida.png'
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

    // --- MANEJO DE ENTRADAS (INPUT) ---
    document.addEventListener('keydown', (e) => { keys[e.code] = true; });
    document.addEventListener('keyup', (e) => { keys[e.code] = false; });
    startButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', togglePause);

    function clearAllKeys() {
        // Limpiar todas las teclas para evitar movimiento automático
        Object.keys(keys).forEach(key => {
            keys[key] = false;
        });
    }

    // --- FUNCIONES PRINCIPALES DEL JUEGO ---

    function resetPlayer() {
        player.x = 100;
        player.y = canvas.height - 40 - PLAYER_DRAW_H;
        player.speedX = 0;
        player.speedY = 0;
        player.onGround = false;
        player.jumping = false;
        
        // Limpiar el estado de las teclas para evitar movimiento automático
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
        clearAllKeys(); // Limpiar teclas al iniciar
        resetPlayer();
        updateUI();
        gameLoop();
    }

    function togglePause() {
        if (!gameRunning) return;
        gamePaused = !gamePaused;
        pauseButton.textContent = gamePaused ? 'Reanudar' : 'Pausar';
        if (!gamePaused) {
            gameLoop(); // Reanudar el loop si se despausa
        }
    }

    function gameOver() {
        gameRunning = false;
        enemyState = 'celebrating';
        alert(`¡Game Over! Puntuación: ${score}`);
        // Acá podrías dibujar una pantalla de "Game Over" en el canvas
    }

    // --- LÓGICA DE ACTUALIZACIÓN (UPDATE) ---

    function update() {
        if (!gameRunning || gamePaused) return;

        updatePlayer();
        createAndupdateBarrels();
        updateEnemyAnimation();
        checkCollisions();
        updateUI();
    }

    function updatePlayer() {
        // Movimiento lateral
        if (keys['ArrowLeft']) {
            player.speedX = -PLAYER_MOVE_SPEED;
        } else if (keys['ArrowRight']) {
            player.speedX = PLAYER_MOVE_SPEED;
        } else {
            player.speedX = 0;
        }

        // Salto
        if (keys['Space'] && player.onGround) {
            player.speedY = PLAYER_JUMP_SPEED;
            player.onGround = false;
            player.jumping = true;
        }

        // Aplicar gravedad
        if (!player.onGround) {
            player.speedY += PLAYER_GRAVITY;
        }

        // Actualizar posición
        player.x += player.speedX;
        player.y += player.speedY;

        // Colisión con bordes del canvas
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

        // Colisión con plataformas
        player.onGround = false;
        for (const platform of platforms) {
            if (player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y + player.height > platform.y &&
                player.y + player.height - player.speedY <= platform.y + 1 // El +1 previene "temblores"
            ) {
                player.y = platform.y - player.height;
                player.speedY = 0;
                player.onGround = true;
                player.jumping = false; // Resetear estado de salto cuando toca suelo
                break; // Solo puede estar en una plataforma a la vez
            }
        }
    }

    function updateEnemyAnimation() {
        if (enemyState === 'throwing') {
            throwAnimationTimer++;
            if (throwAnimationTimer > 30) { // 0.5 segundos a 60fps
                enemyState = 'idle';
                throwAnimationTimer = 0;
            }
        }
    }

    function createAndupdateBarrels() {
        // Crear nuevos barriles
        barrelTimer++;
        if (barrelTimer >= BARREL_SPAWN_INTERVAL) {
            barrelTimer = 0;
            enemyState = 'throwing';
            throwAnimationTimer = 0;
            
            // Crear barril desde la posición correcta del enemigo
            barrels.push({
                x: enemy.x + enemy.width / 2 - BARREL_DRAW_W / 2, // Centrado en el enemigo
                y: enemy.y + enemy.height / 2, // Desde la mitad del enemigo
                width: BARREL_DRAW_W,
                height: BARREL_DRAW_H,
                speedY: 2,
                speedX: BARREL_HORIZONTAL_SPEED,
            });
        }

        // Actualizar barriles existentes
        for (let i = barrels.length - 1; i >= 0; i--) {
            const barrel = barrels[i];

            barrel.speedY += BARREL_GRAVITY;
            barrel.y += barrel.speedY;
            barrel.x += barrel.speedX;

            // Colisión con plataformas (rebote)
            for (const platform of platforms) {
                 if (barrel.x < platform.x + platform.width &&
                    barrel.x + barrel.width > platform.x &&
                    barrel.y + barrel.height > platform.y &&
                    barrel.y + barrel.height - barrel.speedY <= platform.y + 1
                 ) {
                    barrel.y = platform.y - barrel.height;
                    barrel.speedY *= -BARREL_BOUNCE_FACTOR; // Rebota perdiendo energía
                    if (Math.abs(barrel.speedY) < 1) { // Si el rebote es muy débil, rueda
                        barrel.speedY = 0;
                    }
                 }
            }
            
            // Eliminar barriles que salen de la pantalla
            if (barrel.x + barrel.width < 0 || barrel.y > canvas.height) {
                barrels.splice(i, 1);
                score += 10; // Dar puntos por esquivar
            }
        }
    }

    function checkCollisions() {
        // Colisión entre jugador y barriles
        for (let i = barrels.length - 1; i >= 0; i--) {
            const barrel = barrels[i];
            if (player.x < barrel.x + barrel.width &&
                player.x + player.width > barrel.x &&
                player.y < barrel.y + barrel.height &&
                player.y + player.height > barrel.y)
            {
                barrels.splice(i, 1); // El barril desaparece
                lives--;
                if (lives <= 0) {
                    gameOver();
                } else {
                    // Reiniciar solo el jugador, no todo el juego
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
        gradient.addColorStop(0, '#87CEEB'); // Cielo celeste
        gradient.addColorStop(1, '#4682B4'); // Acero azulado
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Plataformas
        ctx.fillStyle = '#d2691e'; // Color chocolate para las vigas
        for (const platform of platforms) {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }

        // Tubos
        ctx.drawImage(spriteImgs.tube_in, 50, canvas.height - 40 - 96, 48, 96);
        ctx.drawImage(spriteImgs.tube_out, 1750, 200, 48, 96);

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

        // Jugador - SOLO UNA IMAGEN
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
    // El juego no se inicia automáticamente, espera al precargador
    preloadAssets(() => {
        console.log('Listo para jugar. Presioná "Start".');
        // Dibuja el estado inicial para que no se vea una pantalla en blanco
        updateUI();
        draw();
    });
}); 