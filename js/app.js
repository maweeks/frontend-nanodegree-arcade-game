var numOfCols = 7;
var numOfRows = 7;
var score = 0;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug-red.png';
    this.x = this.startX();
    this.y = this.startY();
    this.speed = Math.floor(Math.random()*150)+100;
}

Enemy.prototype.startX = function () {
    return -((Math.floor(Math.random()*800))+200);
}

Enemy.prototype.startY = function() {
    return (Math.floor(Math.random()*3)*83) + 145;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt*this.speed;
    if (this.x > numOfRows*101) {
        this.x = this.startX();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
allEnemies = [new Enemy(),new Enemy(),new Enemy(),new Enemy(),new Enemy(),new Enemy(),new Enemy(),new Enemy(),new Enemy(),new Enemy(),new Enemy(),new Enemy(),new Enemy(),new Enemy(),new Enemy(),new Enemy()];

// Place the player object in a variable called player
var Player = function() {
    this.sprite = 'images/char-boy.png';
    //top-left cell = [-1, -13];
    //Place player on bottom row, in random column.
    this.x = this.startX();
    this.y = this.startY();
}

Player.prototype.handleInput = function (num) {
    //if statements prevent our player from falling off the game board.
    switch(num) {
        case 'left':
            if(this.x > 15 && noRock('x', -101))
            this.x-=101;
            break;
        case 'up':
            if(this.y > -5 && noRock('y', -83))
            this.y-=83;
            break;
        case 'right':
            if(this.x < 600 && noRock('x', 101))
            this.x+=101;
            break;
        case 'down':
            if(this.y < 420 && noRock('y', 83))
            this.y+=83;
            break;
        case 'space':
            endGame();
        default:
            return;
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.reset = function() {
    this.x = this.startX();
    this.y = this.startY();
}

Player.prototype.startX = function () {
    return (Math.floor(Math.random()*numOfCols)*101)-1;
}

Player.prototype.startY = function() {
    return 485;
}

Player.prototype.update = function(dt) {
    this.x*dt;
    this.y*dt;
}

var player = new Player();

// Rock stuff.
var Rock = function(yLoc) {
    this.x = this.startX();
    this.y = yLoc;
}

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Rock.prototype.sprite = 'images/Rock.png'

Rock.prototype.startX = function () {
    return (Math.floor(Math.random()*numOfCols)*101)-1;
}

var rocks = [new Rock(52),new Rock(52),new Rock(52),new Rock(384),new Rock(384),new Rock(384)];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

function checkCollisions() {
    //If player is swimming, score a point and reset.
    if (player.y == -13) {
        player.reset()
        score++;
        moveRocks()
    }
    //If player gets hit by a bug, end the game.
    else if (hitByBug()) {
        endGame();
    }
}

function hitByBug() {
    allEnemies.forEach(function(enemy) {
        if ((player.x - enemy.x >= -79) && (player.x - enemy.x <= 78) && (player.y - enemy.y == 8)) {
            endGame();
        }
    });
}

function noRock(moveAxis, moveValue) {
    var newPlayerX;
    var newPlayerY;
    var notFoundRock = true;
    if (moveAxis=="x") {
        newPlayerX = player.x + moveValue;
        newPlayerY = player.y;
    }
    else {
        newPlayerX = player.x;
        newPlayerY = player.y + moveValue;
    }
    // Check if any of the rocks are in the position that the player is trying to move into.
    // If a rock is where the player is trying to move to, set the boolean to false.
    // (The 18 accounts for the offset when drawing the stone compared to the player.)
    rocks.forEach(function(rock) {
        if (((newPlayerX - rock.x) == 0) && ((newPlayerY - rock.y) == 18)) {
            console.log('rock');
            notFoundRock = false;
        }
    });
    return notFoundRock;
}

function moveRocks() {
    rocks.forEach(function(rock) {
        rock.x = rock.startX();
    });
}

function endGame() {
    alert("Congratulations, you scored " + score + ".");
    resetGame();
}

function resetGame() {
    score = 0;
    player.x = player.startX();
    player.y = player.startY();
    console.log("X: " + player.x + " Y: " + player.y)
}