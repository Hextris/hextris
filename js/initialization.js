$(document).ready(initialize);

function initialize() {
//view.js
	window.colors = ["#e74c3c", "#f1c40f", "#3498db", "#2ecc71"];
	window.hexColorsToTintedColors = {
		"#e74c3c":"rgb(241,163,155)",
		"#f1c40f":"rgb(246,223,133)",
		"#3498db":"rgb(151,201,235)",
		"#2ecc71":"rgb(150,227,183)"
	};

	window.rgbToHex = {
		"rgb(231,76,60)":"#e74c3c",
		"rgb(241,196,15)":"#f1c40f",
		"rgb(52,152,219)":"#3498db",
		"rgb(46,204,113)":"#2ecc71"
	};

	window.rgbColorsToTintedColors = {
		"rgb(231,76,60)":"rgb(241,163,155)",
		"rgb(241,196,15)":"rgb(246,223,133)",
		"rgb(52,152,219)":"rgb(151,201,235)",
		"rgb(46,204,113)":"rgb(150,227,183)"
	};

	window.hexagonBackgroundColor = 'rgb(236, 240, 241)';
	window.hexagonBackgroundColorClear = 'rgba(236, 240, 241, 0.5)';
	window.centerBlue = 'rgb(44,62,80)'; //tumblr?
	window.angularVelocityConst = 4;
	window.scoreOpacity = 0;
	window.textOpacity = 0;
	window.prevGameState = undefined;

	//render.js
	window.op=0;
	window.saveState = localStorage.getItem("saveState") || "{}";
	if (saveState !== "{}"){op=1;}

	//input.js
	//all of main.js

	//main.js
	window.textShown = false;

	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
			window.setTimeout(callback, 1000 / framerate);
		};
	})();

	$('#clickToExit').bind('click', toggleDevTools);
	window.settings;

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

		$("#inst_main_body").html("The goal of Hextris is to stop blocks from leaving the inside of the outer gray hexagon<br><br>Either press the right and left arrow keys or tap the left and right sides of the screen to rotate the Hexagon<br><br>Clear blocks by making 3 or more blocks of the same color touch<br><br>Get points by clearing blocks<br><br>Time left before your combo streak disappears is indicated shown by <span style='color:#f1c40f;'>the</span> <span style='color:#e74c3c'>colored<span> <span style='color:#3498db'>lines</span> <span style='color:#2ecc71'>in</span> the outer hexagon<br><br>Pause by pressing <i class = 'fa fa-pause'></i> or the letter <b>p</b><br>Restart by pressing <i class = 'fa fa-refresh'></i> or <b>enter</b><br>Bring up this menu by pressing <i class = 'fa fa-info-circle'><br><br><a href = 'url'>Found a bug? Go here</a");
	}
	
	window.canvas = document.getElementById('canvas');
	window.ctx = canvas.getContext('2d');
	window.trueCanvas = {width:canvas.width,height:canvas.height};
	scaleCanvas();

	window.framerate = 60;
	window.history = {};
	window.score = 0;
	window.isGameOver = 3;
	window.scoreAdditionCoeff = 1;
	window.prevScore = 0;
	window.numHighScores = 3;

	window.highscores = [0, 0, 0];
	if(localStorage.getItem('highscores'))
		highscores = localStorage.getItem('highscores').split(',').map(Number);

	localStorage.setItem('highscores', highscores);

	window.blocks = [];
	window.MainHex;

	window.gdx = 0;
	window.gdy = 0;

	window.devMode = 0;
	window.lastGen;
	window.prevTimeScored;
	window.nextGen;
	window.spawnLane = 0;
	window.importing = 0;
	window.importedHistory;
	window.startTime;

	window.gameState;
	setStartScreen();

	window.onblur = function (e) {
		if (gameState==1) {
			pause();
		}
	};

	debugger;
	$('#startBtn').on('touchstart mousedown', function(){
		if (importing == 1) {
			init(1);
		} else {
			resumeGame();
		}

		setTimeout(function(){
			if(settings.platform == "mobile"){
				document.body.addEventListener('touchstart', function(e) {
					handleClickTap(e.changedTouches[0].clientX);
				}, false);
			}
			else {
				document.body.addEventListener('mousedown', function(e) {
					handleClickTap(e.clientX);
				}, false);
			}
		}, 1);
	});

	document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
	$(window).resize(scaleCanvas);
	$(window).unload(function(){
		if(gameState ==1 || gameState ==-1) localStorage.setItem("saveState", exportSaveState());
		else localStorage.clear();
	});

	addKeyListeners();

	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-51272720-1', 'teamsnowman.github.io');
	ga('send', 'pageview');
}