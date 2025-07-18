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
        { x: 0, y: 550, width: 800, height: 50 }, // Ground
        { x: 100, y: 450, width: 150, height: 20 }, // Platform 1 (left)
        { x: 350, y: 400, width: 150, height: 20 }, // Platform 2 (right, higher)
        { x: 200, y: 350, width: 150, height: 20 }, // Platform 3 (left, higher)
        { x: 450, y: 300, width: 150, height: 20 }, // Platform 4 (right, higher)
        { x: 300, y: 250, width: 150, height: 20 }, // Platform 5 (left, higher)
        { x: 550, y: 200, width: 150, height: 20 }, // Platform 6 (right, higher)
        { x: 400, y: 150, width: 150, height: 20 }, // Platform 7 (left, higher)
        { x: 650, y: 100, width: 150, height: 20 }, // Platform 8 (right, higher)
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

    // --- SPRITE SHEET CONFIG ---
    const spriteSheet = new Image();
    spriteSheet.src = 'images/spritesheet.png';

    // SPRITE POSITIONS AND SIZES
    // Personaje principal (abajo derecha, dos frames, 320x160 cada uno)
    const playerSprites = [
        { x: 400, y: 480, w: 320, h: 160 }, // frame 1 (naranja)
        { x: 720, y: 480, w: 320, h: 160 }  // frame 2 (celeste)
    ];
    // Enemigos (viejitos, 320x320, fondo amarillo y verde)
    const enemySprites = [
        { x: 320, y: 160, w: 320, h: 320 }, // fondo amarillo
        { x: 320, y: 480, w: 320, h: 320 }  // fondo verde
    ];
    // Barril (circular, arriba izquierda, 160x160)
    const barrelSprite = { x: 0, y: 0, w: 160, h: 160 };
    // Tubo entrada (abajo izquierda, azul, 320x160)
    const tubeInSprite = { x: 0, y: 640, w: 320, h: 160 };
    // Tubo salida (abajo centro-izquierda, azul, 320x160)
    const tubeOutSprite = { x: 320, y: 640, w: 320, h: 160 };

    // --- POSICIONES DE TUBOS EN EL JUEGO ---
    const tubeInPos = { x: 50, y: 550, w: 160, h: 80 }; // Abajo izquierda (ajustado a escala)
    const tubeOutPos = { x: 600, y: 60, w: 160, h: 80 }; // Arriba derecha (ajustado a escala)

    // --- ENEMIGOS EN LA PARTE SUPERIOR ---
    const enemiesPos = [
        { x: 500, y: 60 },
        { x: 350, y: 60 }
    ];

    // --- ANIMACIÓN DEL PERSONAJE PRINCIPAL ---
    let playerAnimFrame = 0;
    let playerAnimCounter = 0;
    const playerAnimSpeed = 20; // frames entre cambio de animación

    function drawPlayer() {
        // Animación de caminar
        if (player.speedX !== 0 && player.onGround) {
            playerAnimCounter++;
            if (playerAnimCounter > playerAnimSpeed) {
                playerAnimFrame = (playerAnimFrame + 1) % playerSprites.length;
                playerAnimCounter = 0;
            }
        } else {
            playerAnimFrame = 0;
            playerAnimCounter = 0;
        }
        // Dibujar sprite del personaje principal
        const sprite = playerSprites[playerAnimFrame];
        ctx.drawImage(
            spriteSheet,
            sprite.x, sprite.y, sprite.w, sprite.h,
            player.x, player.y, player.width, player.height
        );
    }

    function drawBarrels() {
        for (const barrel of barrels) {
            ctx.drawImage(
                spriteSheet,
                barrelSprite.x, barrelSprite.y, barrelSprite.w, barrelSprite.h,
                barrel.x, barrel.y, barrel.width, barrel.height
            );
        }
    }

    function drawPlatforms() {
        ctx.fillStyle = '#4a90e2';
        for (const platform of platforms) {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
    }

    function drawEnemies() {
        // Enemigos en la parte superior
        for (let i = 0; i < enemiesPos.length; i++) {
            const pos = enemiesPos[i];
            const sprite = enemySprites[i % enemySprites.length];
            ctx.drawImage(
                spriteSheet,
                sprite.x, sprite.y, sprite.w, sprite.h,
                pos.x, pos.y, 64, 64 // Escalado a 64x64 en el canvas
            );
        }
    }

    function drawTubes() {
        // Tubo de entrada (abajo)
        ctx.drawImage(
            spriteSheet,
            tubeInSprite.x, tubeInSprite.y, tubeInSprite.w, tubeInSprite.h,
            tubeInPos.x, tubeInPos.y, tubeInPos.w, tubeInPos.h
        );
        // Tubo de salida (arriba)
        ctx.drawImage(
            spriteSheet,
            tubeOutSprite.x, tubeOutSprite.y, tubeOutSprite.w, tubeOutSprite.h,
            tubeOutPos.x, tubeOutPos.y, tubeOutPos.w, tubeOutPos.h
        );
    }

    function drawBackground() {
        // Simple gradient background for now
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#4682B4');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        drawBackground();
        
        // Draw tubes
        drawTubes();
        // Draw platforms
        drawPlatforms();
        // Draw enemies
        drawEnemies();
        // Draw barrels
        drawBarrels();
        // Draw player
        drawPlayer();
    }

    function update() {
        if (!gameRunning || gamePaused) return;
        
        frameCount++; // Increment global frame counter
        
        updatePlayer();
        createBarrel();
        updateBarrels();
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