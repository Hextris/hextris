$(document).ready(scaleCanvas);
$(window).resize(scaleCanvas);

function scaleCanvas() {
	canvas.width = $(window).width();
	canvas.height = $(window).height();

	if (canvas.height > canvas.width) {
		settings.scale = (canvas.width/800) * settings.baseScale;
	} else {
		settings.scale = (canvas.height/800) * settings.baseScale;
	}

	trueCanvas = {
		width:canvas.width,
		height:canvas.height
	};

	if (window.devicePixelRatio) {
		//from https://gist.github.com/joubertnel/870190
		var cw = $("#canvas").attr('width');
		var ch = $("#canvas").attr('height');
	
		$("#canvas").attr('width', cw * window.devicePixelRatio);
		$("#canvas").attr('height', ch * window.devicePixelRatio);
		$("#canvas").css('width', cw);
		$("#canvas").css('height', ch);

		trueCanvas = {
			width:cw,
			height:ch
		};

		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	}
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var count = 0;
var trueCanvas = {width:canvas.width,height:canvas.height};

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
		startDist:227,
		creationDt:40,
		baseScale:1.4,
		scale:1,
		prevScale:1.3,
		baseHexWidth:87,
		hexWidth:87,
		baseBlockHeight:20,
		blockHeight:20,
		rows:6,
		speedModifier:0.8,
		creationSpeedModifier:0.8
	};
} else {
	settings = {
		baseScale:1,
		startDist:340,
		creationDt:30,
		scale:1,
		prevScale:1,
		hexWidth:65,
		baseHexWidth:87,
		baseBlockHeight:20,
		blockHeight:15,
		rows:8,
		speedModifier:1,
		creationSpeedModifier:0.8
	};
}

var gameState = 0;
var framerate = 60;
var history = {};
var score = 0;
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
	gameState = -2;
	count = 0;
	blocks = [];
	MainClock = new Clock(settings.hexWidth);
	MainClock.y = -100;
	startTime = Date.now();
	waveone = new waveGen(MainClock,Date.now(),[1,1,0],[1,1],[1,1]);
}

function addNewBlock(blocklane, color, iter, distFromHex, settled) { //last two are optional parameters
	iter *= settings.speedModifier;
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
	settings.hexWidth = settings.baseHexWidth * settings.scale;
	settings.blockHeight = settings.baseBlockHeight * settings.scale;

	var now = Date.now();
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
			waveone.prevTimeScored = now;
		}
	}

	var i;
	var objectsToRemove = [];
	for (i in blocks) {
		MainClock.doesBlockCollide(blocks[i]);
		if (!blocks[i].settled) {
			if (!blocks[i].initializing) blocks[i].distFromHex -= blocks[i].iter * settings.scale;
		} else if (!blocks[i].removed) {
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
				MainClock.blocks[i][j].distFromHex -= block.iter * settings.scale;
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
	ctx.clearRect(0, 0, trueCanvas.width, trueCanvas.height);
	clearGameBoard();

	if (gameState == -2) {
		if (Date.now() - startTime > 1300) {
			var op = (Date.now() - startTime - 1300)/500;
			if (op > 1) {
				op = 1;
			}
			ctx.globalAlpha = op;
			drawPolygon(trueCanvas.width / 2 , trueCanvas.height / 2 , 6, (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth, 30, "#bdc3c7", false,6);
			ctx.globalAlpha = 1;
		}
	} else {
		drawPolygon(trueCanvas.width / 2 + gdx, trueCanvas.height / 2 + gdy, 6, (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth, 30, '#bdc3c7', false, 6);
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
	settings.prevScale = settings.scale;
}

function stepInitialLoad() {
	var dy = getStepDY(Date.now() - startTime, 0, (100 + trueCanvas.height/2), 1300);
	if (Date.now() - startTime > 1300) {
		MainClock.dy = 0;
		MainClock.y = (trueCanvas.height/2);
		if (Date.now() - startTime - 500 > 1300) {
			gameState = 1;
		}
	} else {
		console.log(dy);
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
		requestAnimFrame(animLoop);
		clearGameBoard();
		showModal('Start!', 'Press enter to start!');
	}
	else if (gameState == -2) { //initialization screen just before starting
		requestAnimFrame(animLoop);
		settings.hexWidth = settings.baseHexWidth * settings.scale;
		settings.blockHeight = settings.baseBlockHeight * settings.scale;
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
