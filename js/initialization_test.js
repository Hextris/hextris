/* This code in this function is identical to that of initialization.js with the exception:
	- UI methods are stripped as this is to test the colour change functionality on
	the backbone of the game, ensuring that the blocks change colour correctly.
 */
function initialize(a) {
	// color blind mode variables
	// max amount of color blind modes
	window.currcb = 0;
	window.prevcb = 0;

	window.cbcolors = [
		["#e74c3c", "#f1c40f", "#3498db", "#2ecc71"],
		["#8e44ad", "#f1c41f", "#3499db", "#d35400"],
		["#000000", "#445555", "#c0c0c0", "#ffffff"]
	]

	// variables to adjust speed of game
	window.speedscale = 1;
	window.oldspeedscale = 1;

	window.rush = 1;
	window.lastTime = Date.now();
	window.iframHasLoaded = false;

	window.colors = window.cbcolors[0];

	window.hexColorsToTintedColors = {
		"#e74c3c": "rgb(241,163,155)",
		"#f1c40f": "rgb(246,223,133)",
		"#3498db": "rgb(151,201,235)",
		"#2ecc71": "rgb(150,227,183)"
	};

	window.rgbToHex = {
		"rgb(231,76,60)": "#e74c3c",
		"rgb(241,196,15)": "#f1c40f",
		"rgb(52,152,219)": "#3498db",
		"rgb(46,204,113)": "#2ecc71"
	};

	window.rgbColorsToTintedColors = {
		"rgb(231,76,60)": "rgb(241,163,155)",
		"rgb(241,196,15)": "rgb(246,223,133)",
		"rgb(52,152,219)": "rgb(151,201,235)",
		"rgb(46,204,113)": "rgb(150,227,183)"
	};

	window.hexagonBackgroundColor = 'rgb(236, 240, 241)';
	window.hexagonBackgroundColorClear = 'rgba(236, 240, 241, 0.5)';
	window.centerBlue = 'rgb(44,62,80)';
	window.angularVelocityConst = 4;
	window.scoreOpacity = 0;
	window.textOpacity = 0;
	window.prevGameState = undefined;
	window.op = 0;
	window.saveState = localStorage.getItem("saveState") || "{}";
	if (saveState !== "{}") {
		op = 1;
	}


	window.framerate = 60;
	window.history = {};
	window.score = 0;
	window.scoreAdditionCoeff = 1;
	window.prevScore = 0;
	window.numHighScores = 3;

	highscores = [];

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
		creationSpeedModifier: 0.65,
		comboTime: 310
	};
}