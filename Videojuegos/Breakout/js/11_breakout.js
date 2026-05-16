/*BREAKOUT BY PABLO PAZ BASED ON THE ATARI CLASSIC

12-06-2026

*/
"use strict";

// Canvas size
const canvasWidth = 800;
const canvasHeight = 600;

// Canvas context
let ctx;

// Main game object
let game;

// Last frame time
let oldTime = 0;

//Game music
let music;
let x4Music;
let effectGet;
let effectOver;

// Game settings
let initialSpeed = 0.5;
let ballSpeed = 0.5;
let paddleSpeed = 0.5;
let speedIncrease = 1.0002;
let scoreMulti = 1;

// Ball object
class Ball extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "ball", sheetCols);
        this.velocity = new Vector(0, 0);
    }

    update(deltaTime) {
        this.position = this.position.plus(this.velocity.times(ballSpeed).times(deltaTime));
        this.updateCollider();
    }

    // Place the ball on the paddle
    reset(paddle) {
        this.position.x = paddle.position.x;
        this.position.y = paddle.position.y - paddle.halfSize.y - this.halfSize.y - 2;
        this.velocity.x = 0;
        this.velocity.y = 0;
        ballSpeed = initialSpeed;
        this.updateCollider();
    }

    // Launch the ball
    serve() {
        // Pick a random upward angle
        let angle = Math.random() * Math.PI / 3 + Math.PI / 6;
        this.velocity = new Vector(Math.cos(angle), -Math.sin(angle));
        ballSpeed = initialSpeed;

        // Pick left or right
        if (Math.random() > 0.5) {
            this.velocity.x *= -1;
        }
    }
}

// Breakable block
class Block extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "block", sheetCols);
    }
}

// Falling powerup
class PowerUp extends GameObject {
    constructor(position, width, height, color, type, sheetCols) {
        super(position, width, height, color, "powerup", sheetCols);
        this.velocity = new Vector(0, 0.18);
        this.type = type;
    }

    update(deltaTime) {
        this.position = this.position.plus(this.velocity.times(deltaTime));
        this.updateCollider();
    }
}

// Player paddle
class Paddle extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "paddle", sheetCols);
        this.velocity = new Vector(0, 0);

        // Movement directions
        this.motion = {
            left: {
                axis: "x",
                sign: -1,
            },
            right: {
                axis: "x",
                sign: 1,
            },
        };

        // Pressed keys
        this.keys = [];
    }

    update(deltaTime) {
        // Reset speed
        this.velocity.x = 0;
        this.velocity.y = 0;

        // Move with pressed keys
        for (const direction of this.keys) {
            const axis = this.motion[direction].axis;
            const sign = this.motion[direction].sign;
            this.velocity[axis] += sign;
        }

        // Keep a steady speed
        this.velocity = this.velocity.normalize().times(paddleSpeed);
        this.position = this.position.plus(this.velocity.times(deltaTime));

        this.clampWithinCanvas();
        this.updateCollider();
    }

    clampWithinCanvas() {
        // Left edge
        if (this.position.x - this.halfSize.x < 0) {
            this.position.x = this.halfSize.x;
        }

        // Right edge
        if (this.position.x + this.halfSize.x > canvasWidth) {
            this.position.x = canvasWidth - this.halfSize.x;
        }
    }
}

// Game manager
class Game {
    constructor() {
        // Game state
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.inPlay = false;
        this.gameOver = false;
        this.gameWon = false;

        // Falling powerup on screen
        this.powerUp = undefined;

        // Big paddle timer
        this.powerUpTime = 0;

        // Extra score multiplier
        this.scoreMultiplier = 1;

        // Score multiplier timer
        this.scoreMultiplierTime = 0;

        // Text labels
        this.scoreLabel = new TextLabel(30, 45, "30px Arial", "white");
        this.livesLabel = new TextLabel(canvasWidth - 130, 45, "30px Arial", "white");
        this.levelLabel = new TextLabel(canvasWidth / 2 - 55, 45, "30px Arial", "white");
        this.messageLabel = new TextLabel(canvasWidth / 2 - 170, canvasHeight / 2,
                "32px Arial", "white");
        this.pTimeLabel = new TextLabel(20, canvasHeight-5,"20px Arial","white");
        this.currentMult = new TextLabel(canvasWidth-165, canvasHeight-5,"20px Arial","white");

        this.createEventListeners();
        this.initObjects();
    }

    // Create game objects
    initObjects() {
        // Player paddle
        this.paddleDown = new Paddle(new Vector(canvasWidth / 2, canvasHeight - 30),
                110, 20, "red");

        // Ball
        this.ball = new Ball(new Vector(canvasWidth / 2, canvasHeight / 2),
                20, 20, "white");
        this.ball.setSprite("../Sprites/Ball.png")

        // Walls
        this.wallTop = new Paddle(new Vector(canvasWidth / 2, 0),
                canvasWidth, 20, "green");
        this.wallLeft = new Paddle(new Vector(0, canvasHeight / 2),
                20, canvasHeight, "green");
        this.wallRight = new Paddle(new Vector(canvasWidth, canvasHeight / 2),
                20, canvasHeight, "green");

        this.blocks = [];
        this.createBlocks();
        this.ball.reset(this.paddleDown);
    }

    createBlocks() {
        const rows = this.level + 2;
        const cols = 10;
        const blockWidth = 65;
        const blockHeight = 25;
        const startX = 72;
        const startY = 90;
        const gap = 10;
        const colors = ["#ff5555", "#ffaa00", "#ffff55", "#55dd55", "#55aaff"];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let x = startX + col * (blockWidth + gap);
                let y = startY + row * (blockHeight + gap);
                let block = new Block(new Vector(x, y), blockWidth, blockHeight,
                        colors[row]);
                this.blocks.push(block);
            }
        }
    }

    draw(ctx) {
        this.scoreLabel.draw(ctx, `Score: ${this.score}`);
        this.livesLabel.draw(ctx, `Lives: ${this.lives}`);
        this.levelLabel.draw(ctx, `Level: ${this.level}`);
        if (this.scoreMultiplierTime > 0) {
            this.pTimeLabel.draw(ctx, `x4 Mult time left: ${Math.ceil(this.scoreMultiplierTime / 1000)}`);
            this.currentMult.draw(ctx,`Current mult x4`);
        }
        else{
        this.currentMult.draw(ctx,`Current mult x${scoreMulti}`);
        }


        this.wallTop.draw(ctx);
        this.wallLeft.draw(ctx);
        this.wallRight.draw(ctx);
        this.paddleDown.draw(ctx);
        this.ball.draw(ctx);

        for (let block of this.blocks) {
            block.draw(ctx);
        }

        if (this.powerUp) {
            this.powerUp.draw(ctx);
        }

        if (!this.inPlay && !this.gameOver && !this.gameWon) {
            this.messageLabel.draw(ctx, "Press space to start");
        }

        if (this.gameOver) {
            this.messageLabel.draw(ctx, "Game over - press R");
        }

        if (this.gameWon) {
            this.messageLabel.draw(ctx, "You win - press R");
        }
    }

    update(deltaTime) {
        this.paddleDown.update(deltaTime);

        if (!this.inPlay || this.gameOver || this.gameWon) {
            this.ball.reset(this.paddleDown);
            return;
        }

        this.updatePowerUp(deltaTime);
        this.ball.update(deltaTime);

        // Check paddle hit
        if (boxOverlap(this.paddleDown, this.ball) && this.ball.velocity.y > 0) {
            this.ball.velocity.y *= -1;
            this.ball.position.y = this.paddleDown.position.y
                    - this.paddleDown.halfSize.y - this.ball.halfSize.y - 1;
            this.changeBallDirectionWithPaddle();
            ballSpeed *= speedIncrease;
            this.ball.updateCollider();
            scoreMulti = 1;
        }

        // Check wall hits
        if (boxOverlap(this.wallTop, this.ball) && this.ball.velocity.y < 0) {
            this.ball.velocity.y *= -1;
            ballSpeed *= speedIncrease;
        }

        if (boxOverlap(this.wallLeft, this.ball) && this.ball.velocity.x < 0) {
            this.ball.velocity.x *= -1;
            ballSpeed *= speedIncrease;
        }

        if (boxOverlap(this.wallRight, this.ball) && this.ball.velocity.x > 0) {
            this.ball.velocity.x *= -1;
            ballSpeed *= speedIncrease;
        }

        this.checkBlockCollisions();

        if (this.ball.position.y - this.ball.halfSize.y > canvasHeight) {
            this.lives--;
            this.inPlay = false;

            if (this.lives <= 0) {
                this.gameOver = true;
            }
        }

        if (this.blocks.length == 0) {
            this.inPlay = false;
            this.powerUp = undefined;
            this.resetPaddleSize();
            this.resetScoreMultiplier();

            if (this.level < 3) {
                this.level++;
                this.blocks = [];
                this.createBlocks();
                this.ball.reset(this.paddleDown);
            } else {
                this.gameWon = true;
            }
        }
    }

    checkBlockCollisions() {
        for (let index = 0; index < this.blocks.length; index++) {
            let block = this.blocks[index];

            if (boxOverlap(block, this.ball)) {
                this.bounceBallFromObject(block);
                this.blocks.splice(index, 1);

                // Add points with the current multipliers
                this.score += 100 * scoreMulti * this.scoreMultiplier;

                ballSpeed *= speedIncrease;
                this.createPowerUp(block);

                if (scoreMulti < 2) {
                    scoreMulti += 0.10;
                }

                return;
            }
        }
    }

    createPowerUp(block) {
        // Only one powerup can fall at a time
        if (this.powerUp) {
            return;
        }

        // Choose a random powerup
        let randomPower = Math.random();

        if (randomPower < 0.25) {
            // Earth ball makes the paddle bigger
            this.powerUp = new PowerUp(new Vector(block.position.x, block.position.y),
                    18, 18, "#44ffcc", "bigPaddle");
            this.powerUp.setSprite("../Sprites/EarthBall.png")
        } else if (randomPower < 0.40) {
            // Rainbow ball gives x4 score
            this.powerUp = new PowerUp(new Vector(block.position.x, block.position.y),
                    18, 18, "#d7ff44", "x4Mult");
            this.powerUp.setSprite("../Sprites/RainbowBall_0.png")
        }
    }

    updatePowerUp(deltaTime) {
        // Count down the big paddle effect
        if (this.powerUpTime > 0) {
            this.powerUpTime -= deltaTime;

            if (this.powerUpTime <= 0) {
                this.resetPaddleSize();
                effectOver.play();
            }
        }

        // Count down the x4 score effect
        if (this.scoreMultiplierTime > 0) {
            this.scoreMultiplierTime -= deltaTime;

            if (this.scoreMultiplierTime <= 0) {
                this.resetScoreMultiplier();
                effectOver.play();
            }
        }

        if (!this.powerUp) {
            return;
        }

        // Move the powerup down
        this.powerUp.update(deltaTime);

        // Catch the powerup with the paddle
        if (boxOverlap(this.powerUp, this.paddleDown)) {
            effectGet.play();
            this.activatePowerUp();
            this.powerUp = undefined;
            return;
        }

        // Delete missed powerups
        if (this.powerUp.position.y - this.powerUp.halfSize.y > canvasHeight) {
            this.powerUp = undefined;
        }
    }

    activatePowerUp() {
        // Make the paddle bigger
        if (this.powerUp.type == "bigPaddle") {
            this.paddleDown.size.x = 160;
            this.paddleDown.halfSize.x = 80;
            this.paddleDown.setCollider(160, this.paddleDown.size.y);
            this.powerUpTime = 8000;
        }

        // Multiply score by four
        else if (this.powerUp.type == "x4Mult") {
            this.scoreMultiplier = 4;
            this.scoreMultiplierTime = 8000;
            this.playX4Music();
        }
    }

    resetPaddleSize() {
        // Return the paddle to normal size
        this.paddleDown.size.x = 110;
        this.paddleDown.halfSize.x = 55;
        this.paddleDown.setCollider(110, this.paddleDown.size.y);
        this.powerUpTime = 0;
    }

    resetScoreMultiplier() {
        // Return score points to normal
        this.scoreMultiplier = 1;
        this.scoreMultiplierTime = 0;

        if (x4Music) {
            x4Music.pause();
            x4Music.currentTime = 0;
        }

        this.playNormalMusic();
    }
    
    // This section changes the music depending if multx4 is active or not
    playNormalMusic() {
        if (!this.inPlay || !music || !x4Music) {
            return;
        }

        x4Music.pause();
        music.play();
    }

    playX4Music() {
        if (!music || !x4Music) {
            return;
        }

        music.pause();

       if(x4Music.paused){
            x4Music.play();
       }
    }
    //Lets the ball bounce to the left if it hits the left side from de paddle and viceversa, searched online
    bounceBallFromObject(object) {
        let overlapX = this.ball.halfSize.x + object.halfSize.x
                - Math.abs(this.ball.position.x - object.position.x);
        let overlapY = this.ball.halfSize.y + object.halfSize.y
                - Math.abs(this.ball.position.y - object.position.y);

        if (overlapX < overlapY) {
            this.ball.velocity.x *= -1;
        } else {
            this.ball.velocity.y *= -1;
        }
    }
    //Changes ball direction deppending on where it hit the paddle, searched online
    changeBallDirectionWithPaddle() {
        let distance = this.ball.position.x - this.paddleDown.position.x;
        let percent = distance / this.paddleDown.halfSize.x;

        this.ball.velocity.x = percent;
        this.ball.velocity = this.ball.velocity.normalize();
    }

    restart() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.inPlay = false;
        this.gameOver = false;
        this.gameWon = false;
        this.powerUp = undefined;
        this.resetScoreMultiplier();
        scoreMulti = 1;
        this.resetPaddleSize();
        this.blocks = [];
        this.createBlocks();
        this.ball.reset(this.paddleDown);
    }

    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key == 'a' || event.key == 'ArrowLeft') {
                this.addKey('left', this.paddleDown);
            }

            if (event.key == 'd' || event.key == 'ArrowRight') {
                this.addKey('right', this.paddleDown);
            }

            // Start the ball
            if (event.key == ' ') {
                // Start only when stopped
                if (!this.inPlay && !this.gameOver && !this.gameWon) {
                    this.ball.serve();
                    this.inPlay = true;
                    this.playNormalMusic();
                }
            }

            if (event.key == 'r' || event.key == 'R') {
                this.restart();
                music.currentTime=0;
                music.pause();
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'a' || event.key == 'ArrowLeft') {
                this.delKey('left', this.paddleDown);
            }

            if (event.key == 'd' || event.key == 'ArrowRight') {
                this.delKey('right', this.paddleDown);
            }
        });
    }

    // Add a pressed key
    addKey(direction, object) {
        if (!object.keys.includes(direction)) {
            object.keys.push(direction);
        }
    }

    // Remove a released key
    delKey(direction, object) {
        if (object.keys.includes(direction)) {
            object.keys.splice(object.keys.indexOf(direction), 1);
        }
    }
}

// Start the game
function main() {
    // Get the canvas
    const canvas = document.getElementById('canvas');

    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Get 2D drawing context
    ctx = canvas.getContext('2d');

    // Create the game
    game = new Game();

    //Music and effect section
    music = new Audio("../Music/moodmode-retro-game-arcade-236133.mp3");
    music.loop = true;
    music.volume = 0.4;

    x4Music = new Audio("../Music/nickpanekaiassets-fast-paced-8bit-chiptune-for-retro-gaming-224787.mp3");
    x4Music.loop = true;
    x4Music.volume = 0.4;

    effectGet= new Audio("../Music/twink.ogg")
    effectOver= new Audio("../Music/untitled.mp3")

    drawScene(0);
}

// Main game loop
function drawScene(newTime) {
    // Time since last frame
    let deltaTime = newTime - oldTime;

    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.update(deltaTime);
    game.draw(ctx);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}
