function addKeyListeners() {
	keypress.register_combo({
		keys: "left",
		on_keydown: function() {
			if (MainHex && gameState !== 0) {
				MainHex.rotate(1);
			}
		}
	});

	keypress.register_combo({
		keys: "right",
		on_keydown: function() {
			if (MainHex && gameState !== 0){
				MainHex.rotate(-1);
			}
		}
	});
	keypress.register_combo({
		keys: "a",
		on_keydown: function() {
			if (MainHex && gameState !== 0) {
				MainHex.rotate(1);
			}
		}
	});

	keypress.register_combo({
		keys: "d",
		on_keydown: function() {
			if (MainHex && gameState !== 0){
				MainHex.rotate(-1);
			}
		}
	});

	keypress.register_combo({
		keys: "p",
		on_keydown: function(){pause();}
	});

	keypress.register_combo({
		keys: "space",
		on_keydown: function(){pause();}
	});

	keypress.register_combo({
		keys: "q",
		on_keydown: function() {
			if (devMode) toggleDevTools();
		}
	});

    // speed up key
	keypress.register_combo({
		keys: "up",
		on_keydown: function() {
			togglespeed(0.1, window.blocks, MainHex);
		}
	});

    // slow down key
	keypress.register_combo({
		keys: "down",
		on_keydown: function() {
			togglespeed(-0.1, window.blocks, MainHex);
		}
	});

    // colour blind toggle key
	keypress.register_combo({
		keys: "t",
		on_keydown: function(){
			togglecolor(window.blocks, MainHex);
		}
	});

	keypress.register_combo({
		keys: "enter",
		on_keydown: function() {
			if (gameState==1 || importing == 1) {
				init(1);
			}
			if (gameState == 2) {
				init();
				$("#gameoverscreen").fadeOut();
			}
			if (gameState===0) {
				resumeGame();
			}
		}
	});

	$("#pauseBtn").on('touchstart mousedown', function() {
		if (gameState != 1 && gameState != -1) {
			return;
		}

		if ($('#helpScreen').is(":visible")) {
			$('#helpScreen').fadeOut(150, "linear");
		}
		pause();
		return false;
	});

	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			$("#restart").on('touchstart', function() {
			init();
			canRestart = false;
			$("#gameoverscreen").fadeOut();
		});

	}
	else {
		$("#restart").on('mousedown', function() {
			init();
			canRestart = false;
			$("#gameoverscreen").fadeOut();
		});

	}
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			$("#restartBtn").on('touchstart', function() {
			init(1);
			canRestart = false;
			$("#gameoverscreen").fadeOut();
		});

	}
	else {
		$("#restartBtn").on('mousedown', function() {
			init(1);
			canRestart = false;
			$("#gameoverscreen").fadeOut();
		});


	}

}
function inside (point, vs) {
	// ray-casting algorithm based on
	// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	
	var x = point[0], y = point[1];
	
	var inside = false;
	for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
		var xi = vs[i][0], yi = vs[i][1];
		var xj = vs[j][0], yj = vs[j][1];
		
		var intersect = ((yi > y) != (yj > y))
			&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if (intersect) inside = !inside;
	}
	
	return inside;
};

function handleClickTap(x,y) {
	if (x < 120 && y < 83 && $('.helpText').is(':visible')) {
		showHelp();
		return;
	}
	var radius = settings.hexWidth ;
	var halfRadius = radius/2;
	var triHeight = radius *(Math.sqrt(3)/2);
	var Vertexes =[
		[radius,0],
		[halfRadius,-triHeight],
		[-halfRadius,-triHeight],
		[-radius,0],
		[-halfRadius,triHeight],
		[halfRadius,triHeight]];
	Vertexes = Vertexes.map(function(coord){ 
		return [coord[0] + trueCanvas.width/2, coord[1] + trueCanvas.height/2]});

	if (!MainHex || gameState === 0 || gameState==-1) {
		return;
	}

	if (x < window.innerWidth/2) {
		MainHex.rotate(1);
	}
	if (x > window.innerWidth/2) {
		MainHex.rotate(-1);
	}
}

function togglecolor(blocks, hex){
	// compute the current and next color
	window.prevcb = window.currcb;
	window.currcb = (window.prevcb + 1) % window.cbcolors.length;

	// set the current window color to the one we need
	window.colors = window.cbcolors[currcb];

	// obtain all the current falling blocks
	for (var i = 0; i < blocks.length; i++){

		// find the colour of the block and change accordingly
		for (var j = 0; j < window.cbcolors[window.prevcb].length; j++){
			if (blocks[i].color == window.cbcolors[window.prevcb][j]){
				blocks[i].color = window.cbcolors[window.currcb][j]
			}
		}
	}

	// obtain all colours from the hex and change them
	for(var k = 0; k < hex.blocks.length; k++) {
		for (var l = 0; l < hex.blocks[k].length; l++) {
			for (var m = 0; m < window.cbcolors[window.prevcb].length; m++){
				// find the colour of the block and change accordingly
				if (hex.blocks[k][l].color == window.cbcolors[window.prevcb][m]){
					hex.blocks[k][l].color = window.cbcolors[window.currcb][m];
				}
			}
		}
	}
}

function togglespeed(increment, blocks, hex){

	// check if we are incrementing or decrementing the game speed
	if (increment < 0){

		// if incrementing, adjust the speed accordingly
		if (window.speedscale >= 0.3){
			window.speedscale -= 0.1;
			console.log(window.speedscale);
		}
	}
	else { // increment is positive
		// if decrementing, adjust the speed accordingly
		if (window.speedscale < 1.7){
			window.speedscale += 0.1;
			console.log(window.speedscale);
		}
	}

	// slow down the generation of the wave speeds
	waveone.nextGen = waveone.nextGen*(1/window.speedscale)/(1/window.oldspeedscale);
    var iterfactor = window.speedscale / window.oldspeedscale;

	// slow down speed of falling blocks
	for (var k = 0; k < blocks.length; k++){
		blocks[k].iter = blocks[k].iter * iterfactor;
	}

	// obtain all speeds from the hex and change thems
	for(var k = 0; k < hex.blocks.length; k++) {
		for (var l = 0; l < hex.blocks[k].length; l++) {
			hex.blocks[k][l].iter = hex.blocks[k][l].iter*iterfactor;
		}
	}

    // store the old value of so speed can be adjusted in future
	window.oldspeedscale = window.speedscale;
}
