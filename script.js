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
    const PLAYER_MOVE_SPEED = 3.0;
    const PLAYER_JUMP_SPEED = -11;
    const PLAYER_GRAVITY = 0.28;
    const BARREL_SPAWN_INTERVAL = 180;
    const BARREL_GRAVITY = 0.18;
    const BARREL_HORIZONTAL_SPEED = -1.5;
    const BARREL_ROLLING_SPEED = -2.5; // Velocidad cuando rueda por la rampa
    const BARREL_BOUNCE_FACTOR = 0.5;
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

    // CAMBIO 1: POSICIONAMIENTO PRECISO DE ENEMIGOS Y ESCALERA
    const enemy = {
        x: 1650, y: 220, width: ENEMY_DRAW_W, height: ENEMY_DRAW_H
    };

    const escalera = {
        imgWidth: 1370, imgHeight: 660,
        // Posicionamos la escalera para que su parte superior derecha quede debajo del enemigo
        x: enemy.x + enemy.width - 1370,
        y: enemy.y + enemy.height - 20
    };

    // CAMBIO 2: CREACIÓN DE LA RAMPA DE COLISIÓN INVISIBLE
    // Estas coordenadas definen la superficie de la rampa, deben ajustarse a tu imagen.
    const rampaInvisible = {
        x1: escalera.x + 80,  // Coordenada X donde empieza la pendiente
        y1: escalera.y + 575, // Coordenada Y donde empieza la pendiente
        x2: escalera.x + 1300, // Coordenada X donde termina la pendiente
        y2: escalera.y + 110  // Coordenada Y donde termina la pendiente
    };
    // Calculamos la pendiente (m) de la rampa una sola vez.
    const pendienteRampa = (rampaInvisible.y2 - rampaInvisible.y1) / (rampaInvisible.x2 - rampaInvisible.x1);

    // CAMBIO 3: ELIMINAMOS 'escalonesColision'. YA NO SE USA.
    const suelo = { x: 0, y: 1040, width: 1920, height: 40 };
    const plataformaEnemigo = { x: enemy.x, y: enemy.y + enemy.height, width: enemy.width, height: 20 };

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
        player.y = canvas.height - 40 - PLAYER_DRAW_H;
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
    function update() {
        if (!gameRunning || gamePaused) return;
        updatePlayer();
        createAndupdateBarrels();
        updateEnemyAnimation();
        checkCollisions();
        updateUI();
    }

    function updatePlayer() {
        // Movimiento y salto
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

        // Aplicar gravedad
        if (!player.onGround) {
            player.speedY += PLAYER_GRAVITY;
        }

        player.x += player.speedX;
        player.y += player.speedY;
        
        // Mantener dentro del canvas
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
        
        player.onGround = false;

        // CAMBIO 4: NUEVA LÓGICA DE COLISIÓN PARA EL JUGADOR
        const playerCenterX = player.x + player.width / 2;

        // ¿Está el jugador sobre la rampa?
        if (playerCenterX >= rampaInvisible.x1 && playerCenterX <= rampaInvisible.x2) {
            // Calcular la altura del suelo en la rampa en la posición X del jugador
            const groundYenRampa = pendienteRampa * (playerCenterX - rampaInvisible.x1) + rampaInvisible.y1;
            
            if (player.y + player.height >= groundYenRampa) {
                player.y = groundYenRampa - player.height;
                player.speedY = 0;
                player.onGround = true;
                player.jumping = false;
            }
        }

        // Colisión con el suelo base
        if (player.y + player.height >= suelo.y) {
            player.y = suelo.y - player.height;
            player.speedY = 0;
            player.onGround = true;
            player.jumping = false;
        }

        // Colisión con la plataforma del enemigo
        if (player.x < plataformaEnemigo.x + plataformaEnemigo.width &&
            player.x + player.width > plataformaEnemigo.x &&
            player.y + player.height >= plataformaEnemigo.y &&
            player.y < plataformaEnemigo.y) {
            player.y = plataformaEnemigo.y - player.height;
            player.speedY = 0;
            player.onGround = true;
            player.jumping = false;
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
        // Crear barriles
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
                speedX: BARREL_HORIZONTAL_SPEED,
                speedY: 2,
                onRamp: false
            });
        }

        // Actualizar barriles
        for (let i = barrels.length - 1; i >= 0; i--) {
            const barrel = barrels[i];
            const barrelCenterX = barrel.x + barrel.width / 2;

            // CAMBIO 5: NUEVA LÓGICA DE COLISIÓN PARA BARRILES
            if (barrel.onRamp) {
                // Si está en la rampa, rueda siguiendo la pendiente
                barrel.speedX = BARREL_ROLLING_SPEED;
                const groundYenRampa = pendienteRampa * (barrelCenterX - rampaInvisible.x1) + rampaInvisible.y1;
                barrel.y = groundYenRampa - barrel.height;
                barrel.speedY = 0; // No hay gravedad vertical en la rampa
            } else {
                // Si no, cae con gravedad normal
                barrel.speedY += BARREL_GRAVITY;
                barrel.y += barrel.speedY;
                barrel.speedX = BARREL_HORIZONTAL_SPEED;
            }
            barrel.x += barrel.speedX;

            // ¿El barril acaba de tocar la rampa?
            if (!barrel.onRamp && barrelCenterX >= rampaInvisible.x1 && barrelCenterX <= rampaInvisible.x2) {
                const groundYenRampa = pendienteRampa * (barrelCenterX - rampaInvisible.x1) + rampaInvisible.y1;
                if (barrel.y + barrel.height >= groundYenRampa) {
                    barrel.onRamp = true; // ¡Ahora está en la rampa!
                }
            }
            
            // Colisión con la plataforma del enemigo (para el inicio de la caída)
            if (!barrel.onRamp && barrel.y + barrel.height >= plataformaEnemigo.y && barrel.x > plataformaEnemigo.x) {
                barrel.y = plataformaEnemigo.y - barrel.height;
                barrel.speedY *= -BARREL_BOUNCE_FACTOR;
            }

            // Eliminar barriles que se van
            if (barrel.x + barrel.width < 0 || barrel.y > canvas.height) {
                barrels.splice(i, 1);
                score += 10;
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
        
        // Suelo
        ctx.fillStyle = '#D2B48C';
        ctx.fillRect(suelo.x, suelo.y, suelo.width, suelo.height);
        
        // Escalera (imagen)
        ctx.drawImage(spriteImgs.escalera, escalera.x, escalera.y, escalera.imgWidth, escalera.imgHeight);

        // Tubos
        ctx.drawImage(spriteImgs.tube_in, 0, canvas.height - 40 - 96, 48, 96);
        ctx.drawImage(spriteImgs.tube_out, canvas.width - 48, 200 - 96, 48, 96);

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