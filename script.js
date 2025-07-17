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
        // SLOW MOTION BARREL DROPPING
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
                speedX: -0.8, // MUCH slower horizontal movement: 0.8 pixels per frame
                gravity: 0.15, // MUCH slower gravity for slow motion
                bounceCount: 0, // Track number of bounces
                maxBounces: 6, // More bounces for longer arcs
                bounceFactor: 0.85, // Higher bounce factor (85% retained) for longer arcs
                horizontalBounce: 0.9 // Horizontal bounce factor for side-to-side movement
            });
        }
    }

    function updateBarrels() {
        for (let i = barrels.length - 1; i >= 0; i--) {
            const barrel = barrels[i];
            
            // Apply gravity for bouncing physics (SLOW MOTION)
            barrel.speedY += barrel.gravity;
            
            // Update position
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
        // Handle input - SLOW MOTION
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
        
        // Apply gravity (SLOWER)
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

    function drawPlayer() {
        // Draw player as a colored rectangle for now
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // Draw direction indicator
        ctx.fillStyle = '#333';
        ctx.fillRect(player.x + (player.direction === 1 ? 20 : 0), player.y + 8, 8, 8);
    }

    function drawBarrels() {
        ctx.fillStyle = '#ffa500';
        for (const barrel of barrels) {
            ctx.fillRect(barrel.x, barrel.y, barrel.width, barrel.height);
        }
    }

    function drawPlatforms() {
        ctx.fillStyle = '#4a90e2';
        for (const platform of platforms) {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
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
        
        // Draw game objects
        drawPlatforms();
        drawBarrels();
        drawPlayer();
    }

    function update() {
        if (!gameRunning || gamePaused) return;
        
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