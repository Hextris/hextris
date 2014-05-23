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

var gameState = 0; // 0 - start, 1 - playing, 2 - end, -1 - paused
var framerate = 60;
var history = {};
var score = 0;
var scoreScalar = 1;
var scoreAdditionCoeff = 1;
var prevScore = 0;
// var numHighScores = 3;
var highscores = [12312];

var blocks = [];
var MainClock;
var iter;

var gdx = 0;
var gdy = 0;

var lastGen;
var prevTimeScored;
var nextGen;
var spawnLane = 0;
var importing = 0;
var importedHistory;

function init() {
	history = {};
	importedHistory = undefined;
	importing = 0;
	score = 0;
	prevScore = 0;
	spawnLane = 0;
	scoreScalar = 1;
	gameState = 1;
	count = 0;
	blocks = [];
	MainClock = new Clock(65);
	iter = 1;
	waveone = new waveGen(MainClock,0,[1,1,0],[1,1],[1,1]);
	console.log(waveone);
	requestAnimFrame(animloop);
}

function addNewBlock(blocklane, color, distFromHex, settled) { //last two are optional parameters
	if (!history[count]) {
		history[count] = {};
	}

	history[count].block = {
		blocklane:blocklane,
		color:color
	};

	if (distFromHex) {
		history[count].distFromHex = distFromHex;
	}
	if (settled) {
		blockHist[count].settled = settled;
	}

	blocks.push(new Block(blocklane, color, distFromHex, settled));
}

function importHistory() {
	try {
		init();
		importedHistory = JSON.parse(prompt("Import JSON"));
		if (importedHistory) {
			importing = 1;
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

function update() {
	if (importing) {
		if (importedHistory[count]) {
			if (importedHistory[count].block) {
				addNewBlock(importedHistory[count].block.blocklane, importedHistory[count].block.color,importedHistory[count].block.distFromHex, importedHistory[count].block.settled);
			}

			if (importedHistory[count].rotate) {
				MainClock.rotate(importedHistory[count].rotate);
			}
		}
	}

	var now = Date.now();
	if (now - lastGen > nextGen) {
		if (!importing) {
			addNewBlock(spawnLane, colors[randInt(0, colors.length)]);
		}

		spawnLane++;
		lastGen = Date.now();
		var minTime = 500 / iter;
		if (minTime < 100) {
			minTime = 100;
		}
		if(nextGen > 400){
			nextGen -= 10 * ((nextGen - 200)/1000);
		}
	}
	if (now - prevTimeScored > 1000) {
		score += 5 * (scoreScalar * scoreAdditionCoeff);
		prevTimeScored = now;
		iter += 0.1;
	}

	if (!importing) {
		waveone.update();
		var now = Date.now();
		if (now - waveone.prevTimeScored > 1000) {
			score += 5 * (scoreScalar * scoreAdditionCoeff);
			waveone.prevTimeScored = now;
			iter += 0.1;
		}
	}

	var i;
	var objectsToRemove = [];
	for (i in blocks) {
		MainClock.doesBlockCollide(blocks[i], iter);
		if (!blocks[i].settled) {
			blocks[i].distFromHex -= iter;
		} else if(!blocks[i].removed){
			blocks[i].removed = 1;
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
	for(var i=0;i<blocks.length;i++){
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
	// renderText(score + " (x" + scoreScalar * scoreAdditionCoeff + ")", canvas.originalWidth/2, canvas.originalHeight/2 - 360);

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
	} 
	else if (gameState == -1) {
		showModal('Paused!', 'Press "P" to continue.');
	}
	else if (gameState == 1) {
		requestAnimFrame(animloop);
		update();
		render();
		checkGameOver();
	} 
	else if (gameState == 2) {
		if (checkGameOver()) {
			showModal('Game over: ' + score + ' pts!', 'Press enter to restart!');
		}
		else {
			gameState = 1;
		}
	}
}
requestAnimFrame(animloop);

function checkGameOver() {
	for (var i = 0; i < MainClock.sides; i++) {
		if (MainClock.blocks[i].length > 8) {
			gameState = 2;
			return true;
		}
	}
	return false;
}
