$(document).ready(function(){
	//some sort loading anim until this point
});

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.originalHeight = canvas.height;
canvas.originalWidth = canvas.width;
var count = 0;
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

$('#clickToExit').bind('click', toggleDevTools);

function toggleDevTools() {
	$('#devtools').toggle();
}

var gameState = 0;
var framerate = 60;
var history = {};
var score = 0;
var scoreScalar = 1;
var scoreAdditionCoeff = 1;
var prevScore = 0;
var numHighScores = 3;

var highscores = [0, 0, 0];
if(localStorage.getItem('highscores'))
    highscores = localStorage.getItem('highscores').split(',').map(Number);

localStorage.setItem('highscores', highscores);

var blocks = [];
var MainClock;

var gdx = 0;
var gdy = 0;

var lastGen;
var prevTimeScored;
var nextGen;
var spawnLane = 0;
var importing = 0;
var importedHistory;
var startTime;

function init() {
	history = {};
	importedHistory = undefined;
	importing = 0;
	score = 0;
	prevScore = 0;
	spawnLane = 0;
	scoreScalar = 1;
	gameState = -2;
	count = 0;
	blocks = [];
	MainClock = new Clock(65);
	MainClock.y = -100;
	startTime = Date.now();
	waveone = new waveGen(MainClock,Date.now(),[1,1,0],[1,1],[1,1]);
	console.log(waveone);
	requestAnimFrame(animLoop);
}

function addNewBlock(blocklane, color, iter, distFromHex, settled) { //last two are optional parameters
	if (!history[count]) {
		history[count] = {};
	}

	history[count].block = {
		blocklane:blocklane,
		color:color,
		iter:iter
	};

	if (distFromHex) {
		history[count].distFromHex = distFromHex;
	}
	if (settled) {
		blockHist[count].settled = settled;
	}

	blocks.push(new Block(blocklane, color, iter, distFromHex, settled));
}

function importHistory() {
	try {
		var ih = JSON.parse(prompt("Import JSON"));
		if (ih) {
			init();
			importing = 1;
			importedHistory = ih;
		}
	}
	catch (e) {
		alert("Error importing JSON");
	}
}

function exportHistory() {
	$('#devtoolsText').html(JSON.stringify(history));
	toggleDevTools();
}

//remember to update history function to show the respective iter speeds
function update() {
	var now = Date.now();
	
	if (now - prevTimeScored > 1000) {
		score += 5 * (scoreScalar * scoreAdditionCoeff);
		prevTimeScored = now;
	}

	if (importing) {
		if (importedHistory[count]) {
			if (importedHistory[count].block) {
				addNewBlock(importedHistory[count].block.blocklane, importedHistory[count].block.color, importedHistory[count].block.iter, importedHistory[count].block.distFromHex, importedHistory[count].block.settled);
			}

			if (importedHistory[count].rotate) {
				MainClock.rotate(importedHistory[count].rotate);
			}

		}
	}
	else {
		waveone.update();
		if (now - waveone.prevTimeScored > 1000) {
			score += 5 * (scoreScalar * scoreAdditionCoeff);
			waveone.prevTimeScored = now;
		}
	}

	var i;
	var objectsToRemove = [];
	for (i in blocks) {
		MainClock.doesBlockCollide(blocks[i]);
		if (!blocks[i].settled) { // && blocks[i].initialization) {
			blocks[i].distFromHex -= blocks[i].iter;
		} else if(!blocks[i].removed){
			blocks[i].removed = 1;
		}
	}

	for (i in MainClock.blocks) {
		for (var j = 0; j < MainClock.blocks[i].length; j++) {
			var block = MainClock.blocks[i][j];
			MainClock.doesBlockCollide(block, j, MainClock.blocks[i]);
			if (!MainClock.blocks[i][j].settled) {
				MainClock.blocks[i][j].distFromHex -= block.iter;
			}
		}
	}
	for(i=0;i<blocks.length;i++){
		if(blocks[i].removed == 1){
			blocks.splice(i,1);
			i--;
		}
	}

	count++;
	if (score != prevScore) {
		updateScoreboard();
		prevScore = score;
	}
}

function render() {
	ctx.clearRect(0, 0, canvas.originalWidth, canvas.originalHeight);
	clearGameBoard();
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
	drawPolygon(canvas.originalWidth / 2, MainClock.y + MainClock.dy, 6, 220, 30, '#95a5a6', false);
}

function stepInitialLoad() {
	var dur = 1300;
	var dy = getStepDY(Date.now() - startTime, 0, 100 + canvas.height/2, dur);
	if (Date.now() - startTime > dur) {
		MainClock.dy = 0;
		MainClock.y = canvas.height/2;
		gameState = 1;
	} else {
		MainClock.dy = dy;
	}
}

//t: current time, b: begInnIng value, c: change In value, d: duration
function getStepDY(t, b, c, d) {
	if ((t/=d) < (1/2.75)) {
		return c*(7.5625*t*t) + b;
	} else if (t < (2/2.75)) {
		return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
	} else if (t < (2.5/2.75)) {
		return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
	} else {
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	}
}

function animLoop() {
	if (gameState == 1) {
		requestAnimFrame(animLoop);
		update();
		render();
		checkGameOver();
	}
	else if (gameState === 0) {
		clearGameBoard();
		showModal('Start!', 'Press enter to start!');
	}
	else if (gameState == -2) { //initialization screen just before starting
		requestAnimFrame(animLoop);
		stepInitialLoad();
		render();
	}
	else if (gameState == -1) {
		showModal('Paused!', 'Press "P" to continue.');
	}
	else if (gameState == 2) {
		if (checkGameOver()) {
			showModal('Game over: ' + score + ' pts!', 'Press enter to restart!');
			highscores = localStorage.getItem('highscores').split(',').map(Number);
			for (var i = 0; i < numHighScores; i++) {
				if (highscores[i] < score) {
					for (var j = numHighScores - 1; j > i; j--) {
						highscores[j] = highscores[j - 1];
					}
					highscores[i] = score;
					break;
				}
			}
			localStorage.setItem('highscores', highscores);
		}
		else {
			gameState = 1;
		}
	}
}
requestAnimFrame(animLoop);

function checkGameOver() {
	for (var i = 0; i < MainClock.sides; i++) {
		if (MainClock.blocks[i].length > 8) {
			gameState = 2;
			return true;
		}
	}
	return false;
}
