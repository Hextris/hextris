var textShown = false;
$(document).ready(function(){
	scaleCanvas();
	$('#startBtn').on('touchstart mousedown', function(){
		if (importing == 1) {
			init(1);
		} else {
			resumeGame();
		}

		setTimeout(function(){
				document.body.addEventListener('touchstart', function(e) {
						handleClickTap(e.changedTouches[0].clientX);
				}, false);
		}, 1);
	});
});

$(window).resize(scaleCanvas);
$(window).unload(function(){
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
		platform:"mobile",
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
		comboTime:240
	};
} else {
	settings = {
		platform:"nonmobile",
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
		speedModifier:0.65,
		creationSpeedModifier:0.55,
		comboTime:240
	};
}

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
var MainHex;

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

function resumeGame() {
	gameState = 1;
	hideUIElements();
	$('#pauseBtn').show();
	$('#restartBtn').show();
	importing = 0;
	startTime = Date.now();
}

function hideUIElements() {
	$('#pauseBtn').hide();
	$('#restartBtn').hide();
	$('#startBtn').hide();
}

function init(b) {
	if (b) {
		clearSaveState();
	}

	hideUIElements();
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
	gameState = 1;
	$("#restartBtn").show();
	$("#pauseBtn").show();
	if(saveState.hex !== undefined) gameState = 1;

	scaleCanvas();
	settings.blockHeight = settings.baseBlockHeight * settings.scale;
	settings.hexWidth = settings.baseHexWidth * settings.scale;
	MainHex = saveState.hex || new Hex(settings.hexWidth);
	if (saveState.hex) {
		MainHex.playThrough += 1;
	}
	MainHex.sideLength = settings.hexWidth;

	count = 0;
	var i;
	var block;
	if(saveState.blocks) {
		saveState.blocks.map(function(o){
			if (rgbToHex[o.color]) {
				o.color = rgbToHex[o.color];
			}
		});

		for(i=0; i<saveState.blocks.length; i++) {
			block = saveState.blocks[i];
			blocks.push(block);
		}
	}
	else {
		blocks = [];
	}

	gdx = saveState.gdx || 0;
	gdy = saveState.gdy || 0;
	comboTime = saveState.comboTime || 0;

	for(i=0; i<MainHex.blocks.length; i++) {
		for (var j=0; j<MainHex.blocks[i].length; j++) {
			MainHex.blocks[i][j].height = settings.blockHeight;
			MainHex.blocks[i][j].settled = 0;
		}
	}

	MainHex.blocks.map(function(i){
		i.map(function(o){
			if (rgbToHex[o.color]) {
				o.color = rgbToHex[o.color];
			}
		});
	});

	MainHex.y = -100;

	startTime = Date.now();
	waveone = saveState.wavegen || new waveGen(MainHex,Date.now(),[1,1,0],[1,1],[1,1]);
	
	MainHex.texts = []; //clear texts
	MainHex.delay = 15;
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

function setStartScreen() {
	$('#startBtn').show();
	if (isStateSaved()) {
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
	switch (gameState) {
		case 1:
			requestAnimFrame(animLoop);
			if (!MainHex.delay) {
				update();
			} else {
				MainHex.delay--;
			}
			render();
			if (checkGameOver() && !importing) {
				gameState = 2;
				clearSaveState();
			}
			break;
		
		case 0:
			requestAnimFrame(animLoop);
			if (importing) {
				update();
			}
			
			render();
			break;
		
		case -1:
			requestAnimFrame(animLoop);
			render();
			break;

		case 2:
			requestAnimFrame(animLoop);
			update();
			render();
			break;

		case 3:
			requestAnimFrame(animLoop);
			fadeOutObjectsOnScreen();
			render();
			break;

		default:
			setStartScreen();
			break;
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
function isInfringing(hex){
	for(var i=0;i<hex.sides;i++){
		var subTotal=0;
		for (var j=0;j<hex.blocks[i].length;j++){
			subTotal+=hex.blocks[i][j].deleted ;
		}
		if (hex.blocks[i].length- subTotal>settings.rows){
			return true;
		}
	}
	return false;
}

function checkGameOver() {
	for (var i = 0; i < MainHex.sides; i++) {
		if (isInfringing(MainHex)) {
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
	if(gameState != 0){
		pause();
	}

	$('#helpScreen').fadeToggle(150, "linear");
}
