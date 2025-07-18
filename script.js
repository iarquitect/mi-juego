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
    const canvas = document.getElementById('gameCanvas');
    console.log('Canvas found:', canvas);
    
    const startButton = document.getElementById('startButton');
    console.log('Start button found:', startButton);
    
    const pauseButton = document.getElementById('pauseButton');
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

    const ctx = canvas.getContext('2d');
    console.log('Canvas context created:', ctx);

    // Game state
    let gameRunning = false;
    let gamePaused = false;
    let score = 0;
    let lives = 3;
    let level = 1;
    let barrelTimer = 0;
    let barrelInterval = 180; // Frames between barrels (3 seconds at 60fps) - SLOWER
    let frameCount = 0; // Global frame counter for consistent timing

    // Player properties - SLOW MOTION
    const player = {
        x: 50,
        y: 500,
        width: 32,
        height: 32,
        speedX: 0,
        speedY: 0,
        onGround: false,
        frame: 0,
        frameCount: 0,
        direction: 1, // 1 = right, -1 = left
        jumping: false,
        moveSpeed: 1.5, // 1.5 pixels per frame (90 pixels per second)
        jumpSpeed: -8 // MUCH slower jump (was -15)
    };

    // Game objects - STAIR-LIKE PLATFORMS
    const platforms = [
        { x: 0, y: 1040, width: 1920, height: 40 }, // Suelo
        { x: 300, y: 900, width: 350, height: 24 },
        { x: 600, y: 760, width: 350, height: 24 },
        { x: 900, y: 620, width: 350, height: 24 },
        { x: 1200, y: 480, width: 350, height: 24 },
        { x: 1500, y: 340, width: 350, height: 24 },
        { x: 1700, y: 200, width: 180, height: 24 }, // Última plataforma (enemigos)
    ];

    const barrels = [];
    const enemies = [];

    // Input handling
    const keys = {};

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

    // Game functions
    function startGame() {
        console.log('Game started!'); // Debug log
        gameRunning = true;
        gamePaused = false;
        score = 0;
        lives = 3;
        level = 1;
        barrels.length = 0;
        enemies.length = 0;
        barrelTimer = 0;
        frameCount = 0;
        player.x = 50;
        player.y = 500;
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

    function createBarrel() {
        // SLOW MOTION BARREL DROPPING - INDEPENDENT OF PLAYER
        barrelTimer++;
        
        if (barrelTimer >= barrelInterval) {
            barrelTimer = 0;
            
            // Create barrel from right side with ENHANCED BOUNCING PHYSICS
            barrels.push({
                x: canvas.width + 30, // Start off-screen to the right
                y: 0,
                width: 30,
                height: 30,
                speedY: 0, // Start with no vertical speed
                speedX: -0.8, // CONSTANT horizontal movement: 0.8 pixels per frame
                gravity: 0.15, // CONSTANT gravity for slow motion
                bounceCount: 0, // Track number of bounces
                maxBounces: 6, // More bounces for longer arcs
                bounceFactor: 0.85, // Higher bounce factor (85% retained) for longer arcs
                horizontalBounce: 0.9, // Horizontal bounce factor for side-to-side movement
                lastUpdateFrame: frameCount // Track when this barrel was last updated
            });
        }
    }

    function updateBarrels() {
        for (let i = barrels.length - 1; i >= 0; i--) {
            const barrel = barrels[i];
            
            // Update barrel physics INDEPENDENTLY of player actions
            // Apply gravity for bouncing physics (SLOW MOTION) - CONSTANT RATE
            barrel.speedY += barrel.gravity;
            
            // Update position with CONSTANT speeds
            barrel.y += barrel.speedY;
            barrel.x += barrel.speedX;
            
            // Check for bounce on ground
            if (barrel.y + barrel.height >= canvas.height - 50) { // Ground level
                barrel.y = canvas.height - 50 - barrel.height;
                barrel.speedY = -barrel.speedY * barrel.bounceFactor; // Bounce with energy loss
                barrel.speedX *= barrel.horizontalBounce; // Slight horizontal bounce effect
                barrel.bounceCount++;
                
                // Stop bouncing after max bounces or if speed is too low
                if (barrel.bounceCount >= barrel.maxBounces || Math.abs(barrel.speedY) < 0.3) {
                    barrel.speedY = 0;
                    barrel.y = canvas.height - 50 - barrel.height; // Rest on ground
                }
            }
            
            // Check for bounce on platforms with ENHANCED ARC PHYSICS
            for (const platform of platforms) {
                if (barrel.x < platform.x + platform.width &&
                    barrel.x + barrel.width > platform.x &&
                    barrel.y + barrel.height > platform.y &&
                    barrel.y + barrel.height < platform.y + platform.height + 10 &&
                    barrel.speedY > 0) {
                    
                    barrel.y = platform.y - barrel.height;
                    barrel.speedY = -barrel.speedY * barrel.bounceFactor; // Bounce with energy loss
                    
                    // Add horizontal bounce effect for more pronounced arcs
                    if (barrel.bounceCount < 3) {
                        barrel.speedX *= barrel.horizontalBounce; // Bounce horizontally too
                    }
                    
                    barrel.bounceCount++;
                    
                    // Stop bouncing after max bounces or if speed is too low
                    if (barrel.bounceCount >= barrel.maxBounces || Math.abs(barrel.speedY) < 0.3) {
                        barrel.speedY = 0;
                        barrel.y = platform.y - barrel.height; // Rest on platform
                    }
                    break;
                }
            }
            
            // Remove barrels that go off left side or fall off bottom
            if (barrel.x < -30 || barrel.y > canvas.height + 30) {
                barrels.splice(i, 1);
                if (barrel.y > canvas.height) {
                    score += 10; // Only score if barrel fell off bottom
                }
            }
            
            // Check collision with player
            if (checkCollision(player, barrel)) {
                lives--;
                barrels.splice(i, 1);
                if (lives <= 0) {
                    gameOver();
                }
            }
        }
    }

    function checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    function updatePlayer() {
        // Handle input - SLOW MOTION - INDEPENDENT OF BARRELS
        if (keys['ArrowLeft']) {
            player.speedX = -player.moveSpeed; // 1.5 pixels per frame
            player.direction = -1;
        } else if (keys['ArrowRight']) {
            player.speedX = player.moveSpeed; // 1.5 pixels per frame
            player.direction = 1;
        } else {
            player.speedX = 0;
        }
        
        if (keys['Space'] && player.onGround) {
            player.speedY = player.jumpSpeed; // MUCH slower jump (-8 instead of -15)
            player.onGround = false;
            player.jumping = true;
        }
        
        // Apply gravity (SLOWER) - INDEPENDENT OF BARRELS
        if (!player.onGround) {
            player.speedY += 0.4; // Reduced from 0.8 for slower fall
        }
        
        // Update position
        player.x += player.speedX;
        player.y += player.speedY;
        
        // Keep player in bounds
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
        
        // Platform collision
        player.onGround = false;
        for (const platform of platforms) {
            if (checkCollision(player, platform)) {
                if (player.speedY > 0 && player.y < platform.y) {
                    player.y = platform.y - player.height;
                    player.speedY = 0;
                    player.onGround = true;
                    player.jumping = false;
                }
            }
        }
        
        // Animation
        if (player.speedX !== 0 && player.onGround) {
            player.frameCount++;
            if (player.frameCount > 5) {
                player.frame = (player.frame + 1) % 4;
                player.frameCount = 0;
            }
        }
        
        // Check if player reached the top
        if (player.y < 100) {
            level++;
            score += 100;
            player.x = 50;
            player.y = 500;
            // Make game slightly harder each level
            barrelInterval = Math.max(120, barrelInterval - 15); // Slightly faster barrels
            updateUI();
        }
    }

    function gameOver() {
        gameRunning = false;
        alert(`¡Game Over! Puntuación: ${score}`);
    }

    // --- CARGA DE SPRITES PNG SEPARADOS ---
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
    spriteImgs.personaje_caminando.src = 'images/personaje1_caminando.png';
    spriteImgs.personaje_saltando.src = 'images/personaje1_saltando.png';
    spriteImgs.enemigos_esperando.src = 'images/enemigos1_esperando.png';
    spriteImgs.enemigos_tirandobarril.src = 'images/enemigos1_tirandobarril.png';
    spriteImgs.enemigos_festejando.src = 'images/enemigos1_festejando.png';
    spriteImgs.barril_vista.src = 'images/barril_vista.png';
    spriteImgs.barril_caida.src = 'images/barril_caída.png';
    spriteImgs.tubo_entrada.src = 'images/tubo_entrada.png';
    spriteImgs.tubo_salida.src = 'images/tubo_salida.png';

    // --- AJUSTAR CANVAS A 1920x1080 ---
    canvas.width = 1920;
    canvas.height = 1080;

    // --- ESCALADO DE SPRITES EN EL CANVAS (ajustado a referencia) ---
    const PLAYER_DRAW_W = 64, PLAYER_DRAW_H = 128;
    const ENEMY_DRAW_W = 128, ENEMY_DRAW_H = 128;
    const TUBE_DRAW_W = 96, TUBE_DRAW_H = 192;
    const BARRIL_DRAW_W = 64, BARRIL_DRAW_H = 64;
    const BARRIL_VISTA_W = 48, BARRIL_VISTA_H = 96;

    // --- POSICIONES DE TUBOS EN EL JUEGO (según referencia) ---
    const tubeInPos = { x: 40, y: 1080 - TUBE_DRAW_H - 40, w: TUBE_DRAW_W, h: TUBE_DRAW_H };
    // const tubeOutPos = { x: 1920 - TUBE_DRAW_W - 40, y: 120, w: TUBE_DRAW_W, h: TUBE_DRAW_H }; // This line is now redundant

    // --- POSICIÓN DEL PERSONAJE PRINCIPAL (inicio) ---
    player.x = tubeInPos.x + TUBE_DRAW_W + 20;
    player.y = tubeInPos.y + TUBE_DRAW_H - PLAYER_DRAW_H;

    // --- PLATAFORMAS ESCALONADAS (según referencia) ---
    // const platforms = [
    //     { x: 0, y: 1040, width: 1920, height: 40 }, // Suelo
    //     { x: 300, y: 900, width: 350, height: 24 },
    //     { x: 600, y: 760, width: 350, height: 24 },
    //     { x: 900, y: 620, width: 350, height: 24 },
    //     { x: 1200, y: 480, width: 350, height: 24 },
    //     { x: 1500, y: 340, width: 350, height: 24 },
    //     { x: 1700, y: 200, width: 180, height: 24 }, // Última plataforma (enemigos)
    // ];

    // --- ENEMIGOS EN LA PARTE SUPERIOR DERECHA (según referencia) ---
    // const enemiesPos = { x: 1700 + 40, y: 200 - ENEMY_DRAW_H + 24 }; // This line is now redundant
    // const barrilVistaPos = { x: enemiesPos.x + ENEMY_DRAW_W + 10, y: enemiesPos.y + ENEMY_DRAW_H - BARRIL_VISTA_H }; // This line is now redundant

    // --- TUBO DE SALIDA (arriba derecha) ---
    // tubeOutPos ya definido

    // --- LÓGICA DE BARRIL EN DIAGONAL Y REBOTE EN PLATAFORMAS ---
    let barrilEnCaida = null;
    let barrilRebotes = 0;
    let barrilTimer = 0;
    const BARRIL_REBOTES_MAX = platforms.length - 2; // Rebota en cada plataforma menos el suelo
    const BARRIL_LAUNCH_INTERVAL = 120;
    let enemigosEstado = 'esperando';

    // --- ESTADO DE ANIMACIÓN DE ENEMIGOS ---
    // let enemigosEstado = 'esperando'; // esperando, tirando, festejando
    // let barrilEnCaida = null;
    // let barrilRebotes = 0;
    // let barrilTimer = 0;
    // const BARRIL_REBOTES_MAX = 2;
    // const BARRIL_LAUNCH_INTERVAL = 120; // frames entre lanzamientos

    // --- CENTRAR PERSONAJE EN EL TUBO DE INICIO ---
    // player.x = tubeInPos.x + (TUBE_DRAW_W - PLAYER_DRAW_W) / 2;
    // player.y = tubeInPos.y + TUBE_DRAW_H - PLAYER_DRAW_H;

    // --- ANIMACIÓN DEL PERSONAJE PRINCIPAL ---
    let playerAnimFrame = 0;
    let playerAnimCounter = 0;
    const playerAnimSpeed = 20; // frames entre cambio de animación

    function drawPlayer() {
        let img = player.onGround ? spriteImgs.personaje_caminando : spriteImgs.personaje_saltando;
        ctx.drawImage(img, player.x, player.y, PLAYER_DRAW_W, PLAYER_DRAW_H);
    }

    function drawBarrels() {
        if (barrilEnCaida) {
            ctx.drawImage(spriteImgs.barril_caida, barrilEnCaida.x, barrilEnCaida.y, BARRIL_DRAW_W, BARRIL_DRAW_H);
        }
    }

    function drawPlatforms() {
        ctx.fillStyle = '#5ca3d6';
        for (const platform of platforms) {
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

    function updateBarrelAndEnemies() {
        if (!barrilEnCaida) {
            barrilTimer++;
            if (barrilTimer > BARRIL_LAUNCH_INTERVAL) {
                enemigosEstado = 'tirando';
                setTimeout(() => {
                    barrilEnCaida = {
                        x: barrilVistaPos.x,
                        y: barrilVistaPos.y,
                        vy: 6,
                        vx: -8,
                        rebotes: 0,
                        plataformaActual: platforms.length - 2 // Empieza en la última plataforma
                    };
                    enemigosEstado = 'esperando';
                    barrilTimer = 0;
                }, 500);
            }
        } else {
            // Movimiento diagonal y rebote en plataformas
            barrilEnCaida.x += barrilEnCaida.vx;
            barrilEnCaida.y += barrilEnCaida.vy;
            barrilEnCaida.vy += 0.5;
            // Rebote en plataformas
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
            // Eliminar barril después de los rebotes
            if (barrilEnCaida.rebotes >= BARRIL_REBOTES_MAX || barrilEnCaida.y > 1080) {
                barrilEnCaida = null;
            }
        }
    }

    // --- DIBUJO DE ENEMIGOS, BARRIL Y TUBO DE SALIDA EN ORDEN CORRECTO ---
    function drawEnemiesAndTopRight() {
        // Enemigos esperando
        let img;
        if (enemigosEstado === 'esperando') img = spriteImgs.enemigos_esperando;
        else if (enemigosEstado === 'tirando') img = spriteImgs.enemigos_tirandobarril;
        else img = spriteImgs.enemigos_festejando;
        ctx.drawImage(img, enemiesPos.x, enemiesPos.y, ENEMY_DRAW_W, ENEMY_DRAW_H);
        // Barril al lado de los enemigos
        ctx.drawImage(spriteImgs.barril_vista, barrilVistaPos.x, barrilVistaPos.y, BARRIL_VISTA_W, BARRIL_VISTA_H);
        // Tubo de salida
        ctx.drawImage(spriteImgs.tubo_salida, tubeOutPos.x, tubeOutPos.y, tubeOutPos.w, tubeOutPos.h);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        drawBackground();
        
        // Draw tubes
        ctx.drawImage(spriteImgs.tubo_entrada, tubeInPos.x, tubeInPos.y, tubeInPos.w, tubeInPos.h);
        // Draw platforms
        drawPlatforms();
        // Draw enemies
        drawEnemiesAndTopRight();
        // Draw barrels
        drawBarrels();
        // Draw player
        drawPlayer();
    }

    function update() {
        if (!gameRunning || gamePaused) return;
        
        frameCount++; // Increment global frame counter
        
        updatePlayer();
        updateBarrelAndEnemies();
        updateUI();
    }

    function gameLoop() {
        update();
        draw();
        
        if (gameRunning) {
            requestAnimationFrame(gameLoop);
        }
    }

    // Initialize game
    console.log('Game initialized successfully!');
    updateUI();
    draw();
}); 