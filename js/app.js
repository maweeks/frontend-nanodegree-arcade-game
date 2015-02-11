/*jslint browser:true */

// Set the width and height of the playing grid.
var NUM_OF_COL = 7;
var NUM_OF_ROW = 7;

document.getElementById('gameDetails').style.width = (NUM_OF_COL * 101) + "px";

// Set the player's highscore to 0.
// Set the player's score to 0.
var highScore = 0;
var score = 0;

// Defining enemies our player must avoid
var Enemy = function () {
    // Setting the variables of our bugs, the speed, sprite and location.
    this.speed = Math.floor(Math.random() * 150) + 100;
    this.sprite = 'images/enemy-bug-red.png';
    this.x = this.startX();
    this.y = this.startY();
};

// Draw the enemy on the screen, required method for game.
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// A function to randomly generate the x start location of an enemy.
Enemy.prototype.startX = function () {
    return -((Math.floor(Math.random() * 800)) + 200);
};

// A function to randomly generate the y start location of an enemy.
Enemy.prototype.startY = function () {
    return (Math.floor(Math.random() * 3) * 83) + 145;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;
    if (this.x > NUM_OF_ROW * 101) {
        this.x = this.startX();
    }
};

// Place all enemy objects in an array called allEnemies
var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy()];

// Defining the player.
var Player = function () {
    // Set the sprite and start location of the player.
    this.sprite = 'images/char-boy.png';
    // Top-left cell for player = [-1, -13];
    this.x = this.startX();
    this.y = this.startY();
};

// Defines what happens to the player when user input is detected.
Player.prototype.handleInput = function (num) {
    // Case statement selects different code for each key pressed.
    // If statements check that the player can't walk into a rock or off the grid.
    switch (num) {
    case 'left':
        if (this.x > 15 && noRock('x', -101)) {
            this.x -= 101;
        }
        break;
    case 'up':
        if (this.y > -5 && noRock('y', -83)) {
            this.y -= 83;
        }
        break;
    case 'right':
        if (this.x < 600 && noRock('x', 101)) {
            this.x += 101;
        }
        break;

    case 'down':
        if (this.y < 420 && noRock('y', 83)) {
            this.y += 83;
        }
        break;
    default:
        return;
    }
};

// Draws the player on the canvas.
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset the player's location.
Player.prototype.reset = function () {
    this.x = this.startX();
    this.y = this.startY();
};

// Randomly generate the location of the player.
Player.prototype.startX = function () {
    return (Math.floor(Math.random() * NUM_OF_COL) * 101) - 1;
};

// Place the player on the bottom row of the grid.
Player.prototype.startY = function () {
    return 485;
};

// Create the player.
var player = new Player();

// Rock stuff.
var Rock = function (yLoc) {
    this.x = this.startX();
    this.y = yLoc;
};

// Show the rock on the canvas.
Rock.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Set the sprite of the rock.
Rock.prototype.sprite = 'images/Rock.png';

// Randomly generate the x location of the rock.
Rock.prototype.startX = function () {
    return (Math.floor(Math.random() * NUM_OF_COL) * 101) - 1;
};

// Add up to 3 rocks on both the second row and the fifth row.
var rocks = [new Rock(52), new Rock(52), new Rock(52), new Rock(384), new Rock(384), new Rock(384)];

function updateHighScore() {
    document.getElementById("highScore").innerHTML = "<b><em>High Score: " + highScore + "</em></b>";
}

function updateScore() {
    document.getElementById("score").innerHTML = "<b><em>Score: " + score + "</em></b>";
}

function hideHeader() {
    document.getElementById("header").style.display = "none";
    document.getElementById("viewHeader").innerHTML = "<a href='javascript:showHeader();'>Show heading</a>";
}

function showHeader() {
    document.getElementById("header").style.display = "block";
    document.getElementById("viewHeader").innerHTML = "<a href='javascript:hideHeader();'>Minimize heading</a>";
}

// Check if there is a rock where the player is trying to move
// moveAxis - contains 'x' or 'y' depending which axis the player is moving on.
// moveValue - the distance that the player is trying to move.
// @Return bool - return true if there is no rock in the way.
function noRock(moveAxis, moveValue) {

    // Calculate the attempted player move.
    var newPlayerX, newPlayerY, notFoundRock = true;
    if (moveAxis === "x") {
        newPlayerX = player.x + moveValue;
        newPlayerY = player.y;
    } else {
        newPlayerX = player.x;
        newPlayerY = player.y + moveValue;
    }
    // Check if any of the rocks are in the position that the player is trying to move into.
    // If a rock is where the player is trying to move to, set the boolean to false.
    // (The 18 accounts for the offset when drawing the stone compared to the player.)
    rocks.forEach(function (rock) {
        if (((newPlayerX - rock.x) === 0) && ((newPlayerY - rock.y) === 18)) {
            notFoundRock = false;
        }
    });
    // Return false if a rock is in the way.
    return notFoundRock;
}

// Set a new x location for each rock.
function moveRocks() {
    rocks.forEach(function (rock) {
        rock.x = rock.startX();
    });
}

// If the player dies, alert the user their score and reset the game.
function endGame() {
    alert("Congratulations, you scored " + score + ".");
    resetGame();
}

// Reset the score to zero and give the player a new starting position.
function resetGame() {
    if (score > highScore) {
        highScore = score;
        updateHighScore();
    }
    score = 0;
    player.x = player.startX();
    player.y = player.startY();
    updateScore();
}

function hitByBug() {
    // If part of the player sprite is touching part of a bug then end the game.
    allEnemies.forEach(function (enemy) {
        if ((player.x - enemy.x >= -79) && (player.x - enemy.x <= 78) && (player.y - enemy.y === 8)) {
            endGame();
        }
    });
}

// Checks for player collisions.
function checkCollisions() {
    // If player is swimming, score a point and reset.
    if (player.y == -13) {
        player.reset();
        score += 1;
        updateScore();
        moveRocks();
    } else if (hitByBug()) {
        //If player gets hit by a bug, end the game.
        endGame();
    }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});