var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.originalHeight = canvas.height;
canvas.originalWidth = canvas.width;

if (window.devicePixelRatio) {
    canvas.width *= window.devicePixelRatio;
    canvas.height *= window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / framerate);
    };
})();

var gameState = 0; // 0 - start, 1 - playing, 2 - end
var framerate = 60;

var score = 0;
var scoreScalar = 1;
var scoreAdditionCoeff = 1;

ct = 0;

var blocks = [];
var MainClock;
var iter;

var lastGen;
var prevScore;
var nextGen;
var spawnLane = 0;

function init() {
    score = 0;
    spawnLane = 0;
    scoreScalar = 1;
    gameState = 1;
    ct = 0;
    blocks = [];
    MainClock = new Clock(65);
    iter = 1;
    waveone = new waveGen(MainClock,0,[1,1,0],[1,1],[1,1]);
    console.log(waveone);
    requestAnimFrame(animloop);
}

function update() {
    waveone.update(); 
    var i;
    var objectsToRemove = [];
    for (i in blocks) {
        MainClock.doesBlockCollide(blocks[i], iter);
        if (!blocks[i].settled) {
            blocks[i].distFromHex -= iter;
        } else {
            objectsToRemove.push(i);
        }
    }

    for (i in MainClock.blocks) {
        for (var j = 0; j < MainClock.blocks[i].length; j++) {
            var block = MainClock.blocks[i][j];
            MainClock.doesBlockCollide(block, iter, j, MainClock.blocks[i]);
            if (!MainClock.blocks[i][j].settled) {
                MainClock.blocks[i][j].distFromHex -= iter;
            }
        }
    }

    objectsToRemove.forEach(function(o) {
        blocks.splice(o, 1);
    });
}

function render() {
    ctx.clearRect(0, 0, canvas.originalWidth, canvas.originalHeight);
    clearGameBoard();
    renderText(score + " (x" + scoreScalar * scoreAdditionCoeff + ")", canvas.originalWidth/2, canvas.originalHeight/2 - 360);
    
    var i;
    for (i in MainClock.blocks) {
        for (var j = 0; j < MainClock.blocks[i].length; j++) {
            var block = MainClock.blocks[i][j];
            block.draw(true, j);
        }
    }

    for (i in blocks) {
        blocks[i].draw();
    }

    MainClock.draw();
    drawPolygon(canvas.originalWidth / 2, canvas.originalHeight / 2, 6, 220, 30, '#95a5a6', false);
}

function animloop() {
    if (gameState === 0) {
        clearGameBoard();
        showModal('Start!', 'Press enter to start!');
    } else if (gameState == 1) {
        requestAnimFrame(animloop);
        update();
        render();
        checkGameOver();
    } else if (gameState == 2) {
        showModal('Game over: ' + score + ' pts!', 'Press enter to restart!');

    }
}
requestAnimFrame(animloop);

function checkGameOver() { // fix font, fix size of hex
    for (var i = 0; i < MainClock.sides; i++) {
        if (MainClock.blocks[i].length > 8) {
            gameState = 2;
        }
    }
}
