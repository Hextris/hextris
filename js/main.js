//This function is used to set the canvas (display area) for the game
//to the appropriate size based on the device running the application. 
function scaleCanvas() {
	canvas.width = $(window).width(); //set the canvas width to width of device window 
	canvas.height = $(window).height(); //set the canvas heigh to height of device window 

	//set appropriate aspect ratio based on whether height > width 
	if (canvas.height > canvas.width) {
		settings.scale = (canvas.width / 800) * settings.baseScale; //scale based on width 
	} else {
		settings.scale = (canvas.height / 800) * settings.baseScale; //scale based on height 
	}
	
	//create vector storing width and height information
	trueCanvas = {
		width: canvas.width, //store width
		height: canvas.height //store height
	};

	//If needed, get the pixel ratio of the device 
	//(the size of one CSS pixel to the size of one physical pixel).
	if (window.devicePixelRatio) {
		var cw = $("#canvas").attr('width'); //store canvas width
		var ch = $("#canvas").attr('height'); //store canvas height 
		
		//adjust the canvas to match the screen resolution 
		//of the device based on the device pixel ratio 
		$("#canvas").attr('width', cw * window.devicePixelRatio); 
		$("#canvas").attr('height', ch * window.devicePixelRatio);
		$("#canvas").css('width', cw);
		$("#canvas").css('height', ch);

		//store new canvas width and height 
		trueCanvas = {
			width: cw, //store width
			height: ch //store height 
		};
		
		//scale the window to the new/appropriate size 
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	}
    setBottomContainer(); //call setBottomContainer to setup 
    set_score_pos(); //call set_score_pos to setup
}

//This function is used to initalize the bottom container component which
//contains various UI buttons (like the play/pause button)
function setBottomContainer() {
    var buttonOffset = $("#buttonCont").offset().top; //set button offset to buttonCont's offset value
    var playOffset = trueCanvas.height / 2 + 100 * settings.scale; //set the play button offset to the appropriate position according to new scale
    var delta = buttonOffset - playOffset - 29; //calculate delta to pre-determined value based on new scale values
    //if delta is non-zero, we have to add bottom margin = to delta
    //in order for proper spacing and to fit the display screen 
    if (delta < 0) {
        $("#bottomContainer").css("margin-bottom", "-" + Math.abs(delta) + "px"); //set bottom margin to delta
    }
}

//This function is used to initalize the score text position on screen 
function set_score_pos() {
    $("#container").css('margin-top', '0'); //initalize top margin to 0
    var middle_of_container = ($("#container").height()/2 + $("#container").offset().top); //calculate the middle of the container
    var top_of_bottom_container = $("#buttonCont").offset().top //top of container is equal to buttonCont's offset top value
    var igt = $("#highScoreInGameText") //set text properties to highScoreInGameText
    var igt_bottom = igt.offset().top + igt[0].offsetHeight //calculate the texts bottom position
    var target_midpoint = (top_of_bottom_container + igt_bottom)/2 //calulate midpoint 
    var diff = (target_midpoint-middle_of_container) //calculate difference between midpoint and middle of container to adjust top margin
    $("#container").css("margin-top",diff + "px"); //adjust top margin based on calculated difference 
}

//This function is used for developers to enable or disable the use of 
//development tools.
function toggleDevTools() {
	$('#devtools').toggle(); //Toggle state of dev tools (on/off)
}

//This function is used to resume the state of the game in the event it
//was previously paused. 
function resumeGame() {
	gameState = 1; //set game state to 1 (running)
	hideUIElements(); //hide any ui elements that may be blocking game view
	$('#pauseBtn').show(); //show the pause button 
	$('#restartBtn').hide(); //hide the restart button 
	importing = 0; //log file info
	startTime = Date.now(); //log file info
	//this subfunction is used to ensure the game state changes properly
	//if the condition is not satisfied after 7000ms; timeout
	setTimeout(function() {
		//if the helpscreen is still visible after 7000ms, open the sidebar
		if ((gameState == 1 || gameState == 2) && !$('#helpScreen').is(':visible')) {
			$('#openSideBar').fadeOut(150, "linear"); //display side bar
		}
	}, 7000);
	
	//call checkVisualElements to verify the game is in a playable state 
	//and force calls to animations to ensure this
	checkVisualElements();
}

//This function is used to verify the game is in a playable state again and
//force calls to animations/visibility changes to ensure this. 
function checkVisualElements() {
	//Fade out side bar if it's open
	if ($('#openSideBar').is(":visible")) $('#openSideBar').fadeOut(150, "linear");
	//Fade out pause button if it's closed
	if (!$('#pauseBtn').is(':visible')) $('#pauseBtn').fadeIn(150, "linear");
	//Fade out fork ribbon
	$('#fork-ribbon').fadeOut(150);
	//Fade out restart button if it's open
	if (!$('#restartBtn').is(':visible')) $('#restartBtn').fadeOut(150, "linear");\
	if ($('#buttonCont').is(':visible')) $('#buttonCont').fadeOut(150, "linear");
}

//This function is used to hide all UI elements when 
//the game resumes play after being paused 
function hideUIElements() {
	$('#pauseBtn').hide();
	$('#restartBtn').hide();
	$('#startBtn').hide();
}

//This function is used to initalize the main components of the game
function init(b) {
	//exit condition based on settings for b 
	if(settings.ending_block && b == 1){return;}
	//if paramter b is permitted
	if (b) {
		$("#pauseBtn").attr('src',"./images/btn_pause.svg"); //set pause button imatge
		if ($('#helpScreen').is(":visible")) {//if the help screen is visible; fade it out
			$('#helpScreen').fadeOut(150, "linear");//fade help screen
		}
		
		//this subfunction is used to fade side bar 
		//but timeouts after 7000ms if something goes wrong
		setTimeout(function() {
			$('#openSideBar').fadeOut(150, "linear"); //fade side bar
			infobuttonfading = false;
		}, 7000);
		clearSaveState(); //clear the save state
		checkVisualElements();//verify visual elements of game are all set up
	}
	//if no highscores exist set high score to 0
	//otherwise set to the highest current score
	if (highscores.length === 0 ){
		$("#currentHighScore").text(0); //set high score to 0
	}
	else {
		$("#currentHighScore").text(highscores[0]) //set high to score to highest score
	}
	infobuttonfading = true;
	$("#pauseBtn").attr('src',"./images/btn_pause.svg"); //set pause button to pause image
	hideUIElements(); //hide any unneeded ui elements that may block game 
	var saveState = localStorage.getItem("saveState") || "{}"; //set save state if it exists 
	saveState = JSONfn.parse(saveState); //parse save state to json
	//initialize necessary variables to their default values (generally 0 or false)
	document.getElementById("canvas").className = "";
	history = {};
	importedHistory = undefined;
	importing = 0;
	score = saveState.score || 0;
	prevScore = 0;
	spawnLane = 0;
	op = 0;
	tweetblock=false;
	scoreOpacity = 0;
	gameState = 1; //set game state to playing 
	$("#restartBtn").hide(); //hide restart button 
	$("#pauseBtn").show(); //display the pause button 
	if (saveState.hex !== undefined) gameState = 1;

	//adjust block height and hex width based on the scale setting
	settings.blockHeight = settings.baseBlockHeight * settings.scale;
	settings.hexWidth = settings.baseHexWidth * settings.scale;
	MainHex = saveState.hex || new Hex(settings.hexWidth); //mainhex either equals the save state info or a new hex if its a new game
	if (saveState.hex) {
		MainHex.playThrough += 1; //increment number of play throughs on this save state
	} 
	MainHex.sideLength = settings.hexWidth; //set max side length before loss to that stored in settings

	//declare variables for blocks
	var i;
	var block;
	//if save state has blocks in it 
	if (saveState.blocks) {
		//map the saved blocks to their appropraite positions/colors
		saveState.blocks.map(function(o) {
			if (rgbToHex[o.color]) {
				o.color = rgbToHex[o.color]; //set color
			}
		});

		//for every block in the save state add it to the game
		for (i = 0; i < saveState.blocks.length; i++) {
			block = saveState.blocks[i]; //get info from save state
			blocks.push(block); //push this new object to game
		}
	} else {
		blocks = []; //no blocks exist in the game
	}

	gdx = saveState.gdx || 0; //set change in x to save state or to 0
	gdy = saveState.gdy || 0; //set change in y to save state or to 0
	comboTime = saveState.comboTime || 0; //set combo time to save state or to 0

	//for every block in the game attached to mainhex
	//adjust its height and set moving property to 0 or false 
	for (i = 0; i < MainHex.blocks.length; i++) {
		for (var j = 0; j < MainHex.blocks[i].length; j++) {
			MainHex.blocks[i][j].height = settings.blockHeight; //adjust height 
			MainHex.blocks[i][j].settled = 0; //block is not moving 
		}
	}

	//map all the blocks attached to main hex to their respective colors
	MainHex.blocks.map(function(i) {
		i.map(function(o) {
			if (rgbToHex[o.color]) {
				o.color = rgbToHex[o.color]; //set color
			}
		});
	});

	//set main hex y position 
	MainHex.y = -100;

	//get current time
	startTime = Date.now();
	waveone = saveState.wavegen || new waveGen(MainHex); //start to generate new blocks based on state or create a new wave

	MainHex.texts = []; //clear texts
	MainHex.delay = 15; //set delay to 15
	hideText(); //hide any text on screen 
}

//This function is used to add a new block to the game/screen. Block lane picks which area of the screen
//it comes from. The color determines the color of the block. The iter determines the speed. The distfromhex 
//determines the distance from the middle it spawns, and the settled determines whether it is moving or stopped.
//The last two parameters are optional. 
function addNewBlock(blocklane, color, iter, distFromHex, settled) { 
	//calculate speed based on current speed modifier
	iter *= settings.speedModifier;
	//check if an object is already drawn at the same location 
	if (!history[MainHex.ct]) {
		history[MainHex.ct] = {};
	}
	//save the position/properties of the block being added for later checks 
	//through dev tools
	history[MainHex.ct].block = {
		blocklane: blocklane,
		color: color,
		iter: iter
	};
	
	//save the optional properties about the block (if the parameters were passed)
	//to the history for later checks 
	if (distFromHex) { //save distFromHex property
		history[MainHex.ct].distFromHex = distFromHex;
	}
	if (settled) { //save settled property
		blockHist[MainHex.ct].settled = settled;
	}
	//create the new block and push this new object to the object stack 
	//to be displayed in the game 
	blocks.push(new Block(blocklane, color, iter, distFromHex, settled));
}

//This fucntion is used to export the history of blocks added to the game
//as a JSON string through the dev tools interface. 
function exportHistory() {
	$('#devtoolsText').html(JSON.stringify(history)); //convert to JSON string
	toggleDevTools(); //turn on dev tools 
}

//This function is used to initalize the start screen
//and other UI elements that correspond to it. 
function setStartScreen() {
	$('#startBtn').show(); //show the start button
	init(); //call to init to initalize the game
	//determine if game state needs to be imported or not
	if (isStateSaved()) { 
		importing = 0; //don't import 
	} else {
		importing = 1; //import 
	}
	
	$('#pauseBtn').hide(); //hide pause button
	$('#restartBtn').hide(); //hide restart button
	$('#startBtn').show(); //show start button 

	gameState = 0; //set game state to paused 
	requestAnimFrame(animLoop); //begin animations
}

//initalize speed of game to 1
var spd = 1;

//This function is used to govern the animation of different game states 
function animLoop() {
	//Choose the animation states based on the current game state 
	switch (gameState) {
	case 1: //if the game is being played
		requestAnimFrame(animLoop); //recursive call
		render(); //display the game
		var now = Date.now(); //update current time
		var dt = (now - lastTime)/16.666 * rush; //calculate change in time since last animation loop 
		if (spd > 1) { //artificially change dt if spd > 1
			dt *= spd; //calculate dt by multiplying by speed modifier 
		}
		
		//if game state is running 
		if(gameState == 1 ){
			//update dt or mainhex delay based on
			//current value
			if(!MainHex.delay) {
				update(dt); //update dt
			}
			else{
				MainHex.delay--; //decrement mainhex delay 
			}
		}

		//save current time for next calculation of dt
		lastTime = now;

		//check if the game is over 
		if (checkGameOver() && !importing) {
			//get save state from current local storage if it exists
			var saveState = localStorage.getItem("saveState") || "{}";
			saveState = JSONfn.parse(saveState); //parse the save state to JSON
			gameState = 2; //set game state to 2 
			
			//This subfunction calls enable restart but timeouts 
			//after 150ms if something goes wrong 
			setTimeout(function() {
				enableRestart(); //call enablerestart to restart game
			}, 150);

			//if the help screen is visible, fade it out
			if ($('#helpScreen').is(':visible')) {
				$('#helpScreen').fadeOut(150, "linear"); //fade out help screen
			}

			//adjust visibility of buttons
			if ($('#pauseBtn').is(':visible')) $('#pauseBtn').fadeOut(150, "linear"); //fade pause button if open
			if ($('#restartBtn').is(':visible')) $('#restartBtn').fadeOut(150, "linear"); //fade restart button if open
			if ($('#openSideBar').is(':visible')) $('.openSideBar').fadeOut(150, "linear"); //fade side bar if open

			canRestart = 0; //can't restart
			clearSaveState(); //clear the save state
		}
		break;

	case 0: //if the game is paused
		requestAnimFrame(animLoop); //recursive call
		render(); //display the game
		break; 

	case -1: 
		requestAnimFrame(animLoop); //recursive call
		render(); //display the game
		break;

	case 2: 
		var now = Date.now(); //get current time
		var dt = (now - lastTime)/16.666 * rush; //calculate change in time
		requestAnimFrame(animLoop); //recursive call
		update(dt); //update dt 
		render(); //display the game
		lastTime = now; //save current time for next dt calculation
		break;

	case 3:
		requestAnimFrame(animLoop); //recursive call
		fadeOutObjectsOnScreen(); //fade all objects on screen 
		render(); //display the game
		break;

	case 4:
		//This sub functions trys to re-initalize but 
		//timeouts if something goes wrong 
		setTimeout(function() {
			initialize(1); //initialize the game again
		}, 1);
		render(); //display the game
		return;
	
	default: //default case for the switch (game loading)
		initialize(); //initalize the game
		setStartScreen(); //display the start screen 
		break;
	}
	
	//save the current time for next dt calculation if not 
	//already done (in game state 1 or 2)
	if (!(gameState == 1 || gameState == 2)) {
		lastTime = Date.now(); //save time
	} 
}

//enable the restart button
function enableRestart() {
	canRestart = 1; //user can restart the game
}

//This function is used to check if any of the hex blocks are interfering with 
//over the boundary, causing the player to lose. 
function isInfringing(hex) {
	//for every side
	for (var i = 0; i < hex.sides; i++) {
		var subTotal = 0;
		//for every block attached to the side calculate the length 
		//to check if its over the boundary causing the plyer to lose
		for (var j = 0; j < hex.blocks[i].length; j++) {
			subTotal += hex.blocks[i][j].deleted; //add current length 
		}
		
		//if the sides length is greater than the allowed length 
		//the player loses
		if (hex.blocks[i].length - subTotal > settings.rows) {
			return true; //return that the side infringes lose condition
		}
	}
	return false; //return that the side does not infringe the lose condition  
}

//This function is used to check if the game is over
//based on win/lose conditions. 
function checkGameOver() {
	//Check all of the mainhex's sides
	for (var i = 0; i < MainHex.sides; i++) {
		//if that side of the mainhex is infringing, end the game
		if (isInfringing(MainHex)) {
			$.get('http://54.183.184.126/' + String(score)) //fetch high score from servers
			if (highscores.indexOf(score) == -1) { //if new score was set
				highscores.push(score); //set new high score
			}
			writeHighScores(); //display the high scores on screen
			gameOverDisplay(); //display game over elements 
			return true; //return that the game is over
		}
	}
	return false; //return the game is not over
}

//This function is used to display the help menu. 
function showHelp() {
	//if the side bar is equal to the back button
	if ($('#openSideBar').attr('src') == './images/btn_back.svg') {
		//set side bar to help image
		$('#openSideBar').attr('src', './images/btn_help.svg');
		//if the gamestate is not in 0,-1,or 2 fade out the ribbon
		if (gameState != 0 && gameState != -1 && gameState != 2) {
			$('#fork-ribbon').fadeOut(150, 'linear'); //fade out the ribbon
		}
	//if the side bar is already set to help image
	} else {
		//set the side bar to the back button
		$('#openSideBar').attr('src', './images/btn_back.svg');
		//if the game state is 0, -1, and 2; fade in ribbon
		if (gameState == 0 && gameState == -1 && gameState == 2) {
			$('#fork-ribbon').fadeIn(150, 'linear'); //fade in the ribbon
		}
	}
	
	//Set the main body text of help menu to the instructions below 
	$("#inst_main_body").html("<div id = 'instructions_head'>HOW TO PLAY</div><p>The goal of Hextris is to stop blocks from leaving the inside of the outer gray hexagon.</p><p>" + (settings.platform != 'mobile' ? 'Press the right and left arrow keys' : 'Tap the left and right sides of the screen') + " to rotate the Hexagon</p><p>Clear blocks and get points by making 3 or more blocks of the same color touch.</p><p>Time left before your combo streak disappears is indicated by <span style='color:#f1c40f;'>the</span> <span style='color:#e74c3c'>colored</span> <span style='color:#3498db'>lines</span> <span style='color:#2ecc71'>on</span> the outer hexagon</p> <hr> <p id = 'afterhr'></p> By <a href='http://loganengstrom.com' target='_blank'>Logan Engstrom</a> & <a href='http://github.com/garrettdreyfus' target='_blank'>Garrett Finucane</a><br>Find Hextris on <a href = 'https://itunes.apple.com/us/app/id903769553?mt=8' target='_blank'>iOS</a> & <a href ='https://play.google.com/store/apps/details?id=com.hextris.hextris' target='_blank'>Android</a><br>More @ the <a href ='http://hextris.github.io/' target='_blank'>Hextris Website</a>");
	if (gameState == 1) {//if the game is running
		pause(); //pause the game
	}
	
	//if the pause button is equal to button pause image and the game state is not paused return 
	if($("#pauseBtn").attr('src') == "./images/btn_pause.svg" && gameState != 0 && !infobuttonfading) {
		return;
	}

	$("#openSideBar").fadeIn(150,"linear"); //fade in side bar
	$('#helpScreen').fadeToggle(150, "linear"); //fade help screen
}
