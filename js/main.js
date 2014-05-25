$(document).ready(scaleCanvas);
$(window).resize(scaleCanvas);
function scaleCanvas() {
	var h = $(window).height();
	var w = $(window).width();
	if (w > h) {
		$('#canvas').css("width", h * (window.devicePixelRatio ? window.devicePixelRatio : 1) + 'px');
		$('#canvas').css("height", (h * (Math.sqrt(3)/2)) * (window.devicePixelRatio ? window.devicePixelRatio : 1) + 'px');
	}
	else {
		$('#canvas').css("width", w * (window.devicePixelRatio ? window.devicePixelRatio : 1) + 'px');
		$('#canvas').css("height", (w * (Math.sqrt(3)/2)) * (window.devicePixelRatio ? window.devicePixelRatio : 1) + 'px');
	}


	$('#canvas').css("left", w/2 + 'px');
	$('#canvas').css("top", h/2 + 'px');
	$('#canvas').css("margin-left", -$("#canvas").width()/2 + 'px');
	$('#canvas').css("margin-top", -$("#canvas").height()/2 + 'px');
}

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

var settings;

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	settings = {
		hexWidth:87,
		blockHeight:20,
		rows:6,
		speedModifier:0.8,
		creationSpeedModifier:0.8
	};
} else {
	settings = {
		hexWidth:65,
		blockHeight:15,
		rows:8,
		speedModifier:1,
		creationSpeedModifier:0.8
	};
}

var firstTime = 1;
var gameState = 0;
var framerate = 60;
var history = {};
var score = 0;
var scoreScalar = 1;
var isGameOver = 3;
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
	isGameOver = 2;
	score = 0;
	prevScore = 0;
	spawnLane = 0;
	scoreScalar = 1;
	gameState = -2;
	count = 0;
	blocks = [];
	MainClock = new Clock(settings.hexWidth);
	MainClock.y = -100/(window.devicePixelRatio ? window.devicePixelRatio : 1);
	startTime = Date.now();
	waveone = new waveGen(MainClock,Date.now(),[1,1,0],[1,1],[1,1]);
	if (firstTime) {
		firstTime = 0;
		requestAnimFrame(animLoop);
	}
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
	else if (gameState == 1) {
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
		if (!blocks[i].settled) {
			if (!blocks[i].initializing) blocks[i].distFromHex -= blocks[i].iter;
		} else if(!blocks[i].removed){
			blocks[i].removed = 1;
		}
	}

	var lDI;
	for (i = 0; i < MainClock.blocks.length; i++) {
		lDI = 99;
		for (j = 0; j < MainClock.blocks[i].length; j++) {
			block = MainClock.blocks[i][j];
			if (block.deleted == 2) {
				MainClock.blocks[i].splice(j,1);
				if (j < lDI) lDI = j;
				j--;
			}
		}

		if (lDI < MainClock.blocks[i].length) {
			for (var q = lDI; q < MainClock.blocks[i].length; q++) {
				MainClock.blocks[i][q].settled = 0;
			}
		}
	}

	var block;
	var j;
	for (i in MainClock.blocks) {
		for (j = 0; j < MainClock.blocks[i].length; j++) {
			block = MainClock.blocks[i][j];
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

	if (gameState == -2) {
		if (Date.now() - startTime > 1300) {
			var op = (Date.now() - startTime - 1300)/500;
			if (op > 1) {
				op = 1;
			}
			ctx.globalAlpha = op;
			drawPolygon(canvas.originalWidth / 2 , canvas.originalHeight / 2 , 6, (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth, 30, "#bdc3c7", false,6);
			ctx.globalAlpha = 1;
		}
	} else {
		ctx.save();
		ctx.translate(canvas.originalWidth / 2 + gdx, canvas.originalHeight / 2 + gdy);
		ctx.rotate(MainClock.angle * (Math.PI/180) + 30 * (Math.PI/180));
		drawPolygon(0, 0, 6, (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth, 30, '#bdc3c7', false,6);
		ctx.restore();
	}

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
}

function stepInitialLoad() {
	var dy = getStepDY(Date.now() - startTime, 0, (100 + canvas.height/2)/(window.devicePixelRatio ? window.devicePixelRatio : 1), 1300);
	if (Date.now() - startTime > 1300) {
		MainClock.dy = 0;
		MainClock.y = (canvas.height/2)/(window.devicePixelRatio ? window.devicePixelRatio : 1);
		if (Date.now() - startTime - 500 > 1300) {
			gameState = 1;
		}
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
		if (checkGameOver()) {
			isGameOver--;
			if (isGameOver === 0) {
				gameState = 2;
			}
		}
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
			requestAnimFrame(animLoop);
			update();
			render();
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
			gameState = 0;
		}
	// }
}

requestAnimFrame(animLoop);

function checkGameOver() {
	for (var i = 0; i < MainClock.sides; i++) {
		if (MainClock.blocks[i].length > settings.rows) {
			return true;
		}
	}
	return false;
}

window.onblur = function (e) {
	if (gameState == 1) gameState = -1;
};