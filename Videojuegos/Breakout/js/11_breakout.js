/*BREAKOUT BY PABLO PAZ BASED ON THE ATARI CLASSIC 

12-06-2026

*/ 
"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Context of the Canvas
let ctx;

// A variable to store the game object
let game;

// Variable to store the time at the previous frame
let oldTime = 0;

// Global variables for the settings of the game
let initialSpeed = 0.5;
let ballSpeed = 0.5;

// Class for the ball in the game
class Ball extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "ball", sheetCols);
        this.velocity = new Vector(0, 0);
    }

    update(deltaTime) {
        this.position = this.position.plus(this.velocity.times(ballSpeed).times(deltaTime));
        this.updateCollider();
    }
// Move the ball to the center, and stop its motion
    reset() {
        this.position.x = canvasWidth / 2;
        this.position.y = canvasHeight / 2;
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    // Start the ball motion
    serve() {
        // Get a random angle between -PI/2 and PI/2
        let angle = Math.random() * Math.PI / 2 - Math.PI / 4;
        // Conver the angle into a vector, and scale it by the speed
        this.velocity = new Vector(Math.cos(angle), Math.sin(angle));
        ballSpeed = initialSpeed;

        // Select a random direction
        if (Math.random() > 0.5) {
            this.velocity.x *= -1;
        }
    }
}

// Class for the main character in the game
class Paddle extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "paddle", sheetCols);
        this.velocity = new Vector(0, 0);

        // Structure with the directions the object can move
        this.motion = {
            left: {
                axis: "x",
                sign: -1,
            },
            right: {
                axis: "z",
                sign: 1,
            },
        }

        // Keys pressed to move the player
        this.keys = [];
    }

    update(deltaTime) {
        // Restart the velocity
        this.velocity.x = 0;
        this.velocity.y = 0;
        // Modify the velocity according to the directions pressed
        for (const direction of this.keys) {
            const axis = this.motion[direction].axis;
            const sign = this.motion[direction].sign;
            this.velocity[axis] += sign;
        }
        // Normalize the velocity to avoid greater speed on diagonals
        this.velocity = this.velocity.normalize().times(paddleSpeed);

        this.position = this.position.plus(this.velocity.times(deltaTime));

        this.clampWithinCanvas();

        this.updateCollider();
    }

    clampWithinCanvas() {
        // Top border
        if (this.position.y - this.halfSize.y < 0) {
            this.position.y = this.halfSize.y;
        }
        // Bottom border
        if (this.position.y + this.halfSize.y > canvasHeight) {
            this.position.y = canvasHeight - this.halfSize.y;
        }
    }
}

class Game {
    constructor() {
        this.createEventListeners();
        this.initObjects();

        // Boolean to detect if the game is already in play
        this.inPlay = false;
    }

    // Create the objects in the game
    initObjects() {
        // The player controlled paddles
        this.paddleLeft = new Paddle(new Vector(50, canvasHeight / 2), 20, 100, "red");
         this.actors = [
            this.goalLeft,
            this.goalRight,
            this.wallTop,
            this.wallBottom,
            this.paddleLeft,
            this.paddleRight,
            this.ball
        ];
        for (let actor of this.actors) {
            actor.draw(ctx);
        }
    }

    update(deltaTime) {
        if (this.inPlay) {
            this.timeRemaining -= deltaTime;
            if (this.timeRemaining <= 0) {
                this.timeRemaining = 0;
                return;
            }
        }

    }

     // Add the key pressed to the 'keys' array of the object sent
    addKey(direction, object) {
        if (!object.keys.includes(direction)) {
            object.keys.push(direction);
        }
    }

    // Remove the key pressed from the 'keys' array of the object sent
    delKey(direction, object) {
        if (object.keys.includes(direction)) {
            object.keys.splice(object.keys.indexOf(direction), 1);
        }
    }
}
