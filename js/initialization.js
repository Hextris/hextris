$(document).ready(function() {
	initialize();
});
function initialize(a) {
	window.rush = 1;
	window.lastTime = Date.now();
	window.iframHasLoaded = false;
  
  window.comboPacing = 10;
  window.colorHouses = [
    {
      color:"#6C45BF",
      name: 'Nightclaw',
      htmlId: 'nightclaw',
    },
    {
      color:"#F7CF05",
      name: 'Nascent Fire',
      htmlId: 'nascentfire',
    },
    {
      color:"#F22F1D",
      name: 'Ragnar',
      htmlId: 'ragnar',
    },
    {
      color:"#05F2F2",
      name: 'Corgi',
      htmlId: 'corgi',
    },
    {
      color:"#F250D7",
      name: 'Lions Pride',
      htmlId: 'lionspride',
    },
    {
      color:"#038C73",
      name: 'Panda',
      htmlId: 'panda',
    }
  ]
  ;
  // HOUSE COLORS   Nightclaw, Nascent F, Ragnar,   Corgi Pack, Lions P,  Panda
  window.colors = ["#6C45BF", "#F7CF05", "#F22F1D", "#05F2F2", "#F250D7", "#038C73"];
  window.hexColorsToTintedColors = {
    "#6C45BF": "rgb(160, 145, 191)", // Nightclaw
    "#F7CF05": "rgb(247, 225, 114)", // Nascent Fire
    "#BE2F1D": "rgb(204, 105, 92)", // Ragnar
    "#05F2F2": "rgb(153, 242, 242)", // Corgi
    "#F250D7": "rgb(242, 160, 229)", // Lions Pride
    "#038C73": "rgb(163, 212, 203)", // Panda
  };
  window.rgbToHex = {
		"rgb(108, 69, 191)":"#6C45BF", // Nightclaw
		"rgb(247, 207, 5)":"#F7CF05", // Nascent Fire
		"rgb(190, 47, 29)":"#BE2F1D", // Ragnar
		"rgb(5, 242, 242)":"#05F2F2", // Corgi
		"rgb(242, 80, 215)":"#F250D7", // Lions Pride
		"rgb(3, 140, 115)":"#038C73", // Panda
	};
	window.rgbColorsToTintedColors = {
		"rgb(108, 69, 191)": "rgb(160, 145, 191)", // Nightclaw
		"rgb(247, 207, 5)": "rgb(247, 225, 114)", // Nascent Fire
		"rgb(190, 47, 29)": "rgb(204, 105, 92)", // Ragnar
		"rgb(5, 242, 242)": "rgb(153, 242, 242)", // Corgi
		"rgb(242, 80, 215)": "rgb(242, 160, 229)", // Lions Pride
		"rgb(3, 140, 115)": "rgb(163, 212, 203)", // Panda
	};

	window.hexagonBackgroundColor = '#252D38';
	window.hexagonBackgroundColorClear = 'rgba(37, 45, 56, 0.5)';
	window.centerBlue = 'rgb(37,45,56)';
	window.angularVelocityConst = 4;
	window.scoreOpacity = 0;
	window.textOpacity = 0;
	window.prevGameState = undefined;
	window.op = 0;
	window.saveState = localStorage.getItem("saveState") || "{}";
	if (saveState !== "{}") {
		op = 1;
	}

	window.textShown = false;
	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
			window.setTimeout(callback, 1000 / framerate);
		};
	})();
	$('#clickToExit').bind('click', toggleDevTools);
	window.settings;
	if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('.rrssb-email').remove();
		settings = {
			os: "other",
			platform: "mobile",
			startDist: 227,
			creationDt: 60,
			baseScale: 1.4,
			scale: 1,
			prevScale: 1,
			baseHexWidth: 87,
			hexWidth: 87,
			baseBlockHeight: 20,
			blockHeight: 20,
			rows: 7,
			speedModifier: 0.73,
			speedUpKeyHeld: false,
			creationSpeedModifier: 0.73,
			comboTime: 310
		};
	} else {
		settings = {
			os: "other",
			platform: "nonmobile",
			baseScale: 1,
			startDist: 340,
			creationDt: 9,
			scale: 1,
			prevScale: 1,
			hexWidth: 65,
			baseHexWidth: 87,
			baseBlockHeight: 20,
			blockHeight: 15,
			rows: 8,
			speedModifier: 0.65,
			speedUpKeyHeld: false,
			creationSpeedModifier: 0.65,
			comboTime: 310
		};

	}
	if(/Android/i.test(navigator.userAgent)) {
		settings.os = "android";
	}

	if(navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)){
		settings.os="ios";
	}

	window.xteamLogoSvg = document.getElementById('xteamlogosvg');

	window.canvas = document.getElementById('canvas');
	window.ctx = canvas.getContext('2d');
	window.trueCanvas = {
		width: canvas.width,
		height: canvas.height
	};
	scaleCanvas();

	window.framerate = 60;
	window.history = {};
	window.score = 0;
  window.scoreByColor = colors.reduce((concatObject, hexColor) => ({ ...concatObject, [hexColor]: 0}), {});
	window.scoreAdditionCoeff = 1;
	window.prevScore = 0;
	window.numHighScores = 3;

	highscores = [];
	if (localStorage.getItem('highscores')) {
		try {
			highscores = JSON.parse(localStorage.getItem('highscores'));
		} catch (e) {
			highscores = [];
		}
	}
	window.blocks = [];
	window.MainHex;
	window.gdx = 0;
	window.gdy = 0;
	window.devMode = 0;
	window.lastGen = undefined;
	window.prevTimeScored = undefined;
	window.nextGen = undefined;
	window.spawnLane = 0;
	window.importing = 0;
	window.importedHistory = undefined;
	window.startTime = undefined;
	window.gameState;
	setStartScreen();
	if (a != 1) {
		window.canRestart = 1;
		window.onblur = function(e) {
			if (gameState == 1) {
				pause();
			}
		};
		$('.startBtn').off();
		$('#startbutton').off();
		if (settings.platform == 'mobile') {
			$('.startBtn').on('touchstart', startBtnHandler);
			$('#startbutton').on('touchstart', startBtnHandler);
		} else {
			$('.startBtn').on('mousedown', startBtnHandler);
			$('#startbutton').on('mousedown', startBtnHandler);
		}

		document.addEventListener('touchmove', function(e) {
			e.preventDefault();
		}, false);
		$(window).resize(scaleCanvas);
		$(window).unload(function() {

			if (gameState == 1 || gameState == -1 || gameState === 0) localStorage.setItem("saveState", exportSaveState());
			else localStorage.setItem("saveState", "{}");
		});

		addKeyListeners();
		(function(i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r;
			i[r] = i[r] || function() {
				(i[r].q = i[r].q || []).push(arguments)
			}, i[r].l = 1 * new Date();
			a = s.createElement(o), m = s.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m)
		})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
		ga('create', 'UA-51272720-1', 'teamsnowman.github.io');
		ga('send', 'pageview');

		document.addEventListener("pause", handlePause, false);
		document.addEventListener("backbutton", handlePause, false);
		document.addEventListener("menubutton", handlePause, false); //menu button on android

		setTimeout(function() {
			if (settings.platform == "mobile") {
				try {
					document.body.removeEventListener('touchstart', handleTapBefore, false);
				} catch (e) {

				}

				try {
					document.body.removeEventListener('touchstart', handleTap, false);
				} catch (e) {

				}

				document.body.addEventListener('touchstart', handleTapBefore, false);
			} else {
				try {
					document.body.removeEventListener('mousedown', handleClickBefore, false);
				} catch (e) {

				}

				try {
					document.body.removeEventListener('mousedown', handleClick, false);
				} catch (e) {

				}

				document.body.addEventListener('mousedown', handleClickBefore, false);
			}
		}, 1);
	}
}

function startBtnHandler() {
	setTimeout(function() {
		if (settings.platform == "mobile") {
			try {
				document.body.removeEventListener('touchstart', handleTapBefore, false);
			} catch (e) {

			}

			try {
				document.body.removeEventListener('touchstart', handleTap, false);
			} catch (e) {

			}

			document.body.addEventListener('touchstart', handleTap, false);
		} else {
			try {
				document.body.removeEventListener('mousedown', handleClickBefore, false);
			} catch (e) {

			}

			try {
				document.body.removeEventListener('mousedown', handleClick, false);
			} catch (e) {

			}

			document.body.addEventListener('mousedown', handleClick, false);
		}
	}, 5);

	if (!canRestart) return false;

	if (importing == 1) {
		init(1);
		checkVisualElements(0);
	} else {
		resumeGame();
	}
}

function handlePause() {
	if (gameState == 1 || gameState == 2) {
		pause();
	}
}

function handleTap(e) {
	handleClickTap(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
}

function handleClick(e) {
	handleClickTap(e.clientX, e.clientY);
}

function handleTapBefore(e) {
	var x = e.changedTouches[0].clientX;
	var y = e.changedTouches[0].clientY;
}

function handleClickBefore(e) {
	var x = e.clientX;
	var y = e.clientY;
}

function hexColorToHmlId(hexColor) {
  const house = colorHouses.find(({ color }) => color === hexColor);
  return house.htmlId;
}