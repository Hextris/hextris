var textShown = false;
var showingHelp = false;
$(document).ready(function(){
	scaleCanvas();
	$('#startBtn').on('touchstart mousedown', function(){
		gameState = 1;
		setTimeout(function(){
			document.body.addEventListener('mousedown', function(e) {
				handleClickTap(e.clientX);
			}, false);

			document.body.addEventListener('touchstart', function(e) {
				handleClickTap(e.changedTouches[0].clientX);
			}, false);
		}, 1);
	});
});

$(window).resize(scaleCanvas);
$(window).unload(function() {
	localStorage.setItem("saveState", exportSaveState());
});

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
		prevScale:1,
		baseHexWidth:87,
		hexWidth:87,
		baseBlockHeight:20,
		blockHeight:20,
		rows:6,
		speedModifier:0.7,
		creationSpeedModifier:0.7,
				comboMultiplier: 240
	};
} else {
	settings = {
		baseScale:1,
		startDist:340,
		creationDt:9,
		scale:1,
		prevScale:1,
		hexWidth:65,
		baseHexWidth:87,
		baseBlockHeight:20,
		blockHeight:15,
		rows:8,
		speedModifier:0.8,
		creationSpeedModifier:0.6,
		comboMultiplier:240
	};
}

var framerate = 60;
var history = {};
var score = 0;
var isGameOver = 3;
var scoreAdditionCoeff = 1;
var prevScore = 0;
var numHighScores = 3;
var spaceModifier = 1;

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

var gameState;
setStartScreen();

function init(b) {
	if (b) {
		clearSaveState();
	}

	$('#pauseBtn').hide();
	$('#startBtn').hide();
	var saveState = localStorage.getItem("saveState") || "{}";
	saveState = JSONfn.parse(saveState);
	document.getElementById("canvas").className = "";
	history = {};
	importedHistory = undefined;
	importing = 0;
	isGameOver = 2;
	score = saveState.score || 0;
	prevScore = 0;
	spawnLane = 0;
	op = 0;
	scoreOpacity = 0;
	gameState = -2;
	if(saveState.clock !== undefined) gameState = 1;

	count = 0;
	var i;
	var block;
	if(saveState.blocks) {
		for(i=0; i<saveState.blocks.length; i++) {
			block = saveState.blocks[i];
			block.distFromHex *= settings.scale;
			blocks.push(block);
		}
	}
	else {
		blocks = [];
	}

	gdx = saveState.gdx || 0;
	gdy = saveState.gdy || 0;
	comboMultiplier = saveState.comboMultiplier || 0;


	scaleCanvas();
	settings.blockHeight = settings.baseBlockHeight * settings.scale;
	settings.hexWidth = settings.baseHexWidth * settings.scale;
	MainClock = saveState.clock || new Clock(settings.hexWidth);
	MainClock.sideLength = settings.hexWidth;

	for(i=0; i<MainClock.blocks.length; i++) {
		for(var j=0; j<MainClock.blocks[i].length; j++) {
			MainClock.blocks[i][j].height = settings.blockHeight;
			MainClock.blocks[i][j].settled = 0;
			MainClock.blocks[i][j].distFromHex *= settings.scale;
		}
	}


	MainClock.y = -100;

	startTime = Date.now();
	waveone = saveState.wavegen || new waveGen(MainClock,Date.now(),[1,1,0],[1,1],[1,1]);
	
	MainClock.texts = []; //clear texts
	hideText();
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

function importHistory(j) {
	if (!j) {
		try {
			var ih = JSON.parse(prompt("Import JSON"));
			if (ih) {
				init(1);
				importing = 1;
				importedHistory = ih;
			}
		}
		catch (e) {
			alert("Error importing JSON");
		}
	} else {
		init();
		importing = 1;
		importedHistory = j;
	}
}

function exportHistory() {
	$('#devtoolsText').html(JSON.stringify(history));
	toggleDevTools();
}

function stepInitialLoad() {
	var dy = getStepDY(Date.now() - startTime, 0, (100 + trueCanvas.height/2), 1300);
	if (Date.now() - startTime > 1300) {
		MainClock.dy = 0;
		MainClock.y = (trueCanvas.height/2);
		if (Date.now() - startTime - 500 > 1300) {
			$('#pauseBtn').show();
			gameState = 1;
		}
	} else {
		MainClock.dy = dy;
	}
}

function setStartScreen() {
	$('#startBtn').show();
	if (!isStateSaved()) {
		importHistory(introJSON);
	} else {
	        init();
		importing = 0;
	}
	gameState = 0;
        requestAnimFrame(animLoop);
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
	if (gameState == 1) { //game play
		requestAnimFrame(animLoop);
		update();
		render();
		if (checkGameOver()) {
			gameState = 2;
			clearSaveState();
		}
	}
	else if (gameState === 0) { //start screen
		requestAnimFrame(animLoop);
                if (importing) {
                        update();
                }
                render();
	}
	else if (gameState == -2) { //initialization screen just before starting
		requestAnimFrame(animLoop);
		settings.hexWidth = settings.baseHexWidth * settings.scale;
		settings.blockHeight = settings.baseBlockHeight * settings.scale;
		stepInitialLoad();
		render();
	}
	else if (gameState == -1) { //pause
		requestAnimFrame(animLoop);
                render();
	}
	else if (gameState == 2) { //end screen
		requestAnimFrame(animLoop);
		update();
		render();
        }
	else {
		setStartScreen();
	}
}

function updateHighScore(){
    if(localStorage.getItem('highscores')){
            highscores = localStorage.getItem('highscores').split(',').map(Number);
    }
    for (var i = 0; i < numHighScores; i++) {
            if (highscores[i] <= score) {
                    highscores.splice(i, 0, score);
                    highscores = highscores.slice(0,-1);
                    break;
            }
    }

    localStorage.setItem('highscores', highscores);

}
function isInfringing(clock){
	for(var i=0;i<clock.sides;i++){
		var subTotal=0;
		for (var j=0;j<clock.blocks[i].length;j++){
			subTotal+=clock.blocks[i][j].deleted ;
		}
		if (clock.blocks[i].length- subTotal>settings.rows){
			return true;
		}
	}
	return false;
}

function checkGameOver() {
	for (var i = 0; i < MainClock.sides; i++) {
		if (isInfringing(MainClock)) {
                        updateHighScore();
		        gameOverDisplay();
			return true;
		}
	}
	return false;
}

window.onblur = function (e) {
	if (gameState==1) {
		pause();
	}
};
function showHelp(){
	pause(false,true);
	if(document.getElementById("helpScreen").style.display=="none" || document.getElementById("helpScreen").style.display === ""){
		document.getElementById("helpScreen").style.display = "block";
	}
	else if(document.getElementById("helpScreen").style.display=="block" ){
		document.getElementById("helpScreen").style.display = "none";
		
	}
	showingHelp = !showingHelp;
}
