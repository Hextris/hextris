// t: current time, b: begInnIng value, c: change In value, d: duration
function easeOutCubic(t, b, c, d) {
	return c * ((t = t / d - 1) * t * t + 1) + b;
}

function renderText(x, y, fontSize, color, text, font) {
	ctx.save();
	if (!font) {
		var font = `20px 'Open Sans'`;
	}

	fontSize *= settings.scale;
	ctx.font = fontSize + font;
	ctx.textAlign = 'center';
	ctx.fillStyle = color;
	ctx.fillText(text, x, y + (fontSize / 2) - 9 * settings.scale);
	ctx.restore();
}

function drawScoreboard() {
	if (scoreOpacity < 1) {
		scoreOpacity += 0.01;
		textOpacity += 0.01;
	}
	ctx.globalAlpha = textOpacity;
	var scoreSize = 50;
	var scoreString = String(score);
	if (scoreString.length == 6) {
		scoreSize = 43;
	} else if (scoreString.length == 7) {
		scoreSize = 35;
	} else if (scoreString.length == 8) {
		scoreSize = 31;
	} else if (scoreString.length == 9) {
		scoreSize = 27;
	}
	//if (rush ==1){
  var color = "rgb(236, 240, 241)";
	//}
  var fontSize = settings.platform == 'mobile' ? 35 : 30;
  var h = trueCanvas.height / 2 + gdy + 100 * settings.scale;
	if (gameState === 0) {
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2 + gdy, 60, "#ECF0F1", String.fromCharCode("0xf04b"), 'px FontAwesome');
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2.1 + gdy - 155 * settings.scale, 150, "#FCC058", "Hextris");
		renderText(trueCanvas.width / 2 + gdx + 5 * settings.scale, h + 10, fontSize, "#2A3E50", 'Play!');
	} else if (gameState != 0 && textOpacity > 0) {
		textOpacity -= 0.05;
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2 + gdy, 60, "#ECF0F1", String.fromCharCode("0xf04b"), 'px FontAwesome');
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2 + gdy - 155 * settings.scale, 150, "#FCC058", "Hextris");
		renderText(trueCanvas.width / 2 + gdx + 5 * settings.scale, h, fontSize, "#2A3E50", 'Play!');
		ctx.globalAlpha = scoreOpacity;
		renderText(trueCanvas.width / 2 + gdx, (trueCanvas.height / 2) - xteamLogoSvg.height + gdy, scoreSize, color, score);
		
	} else {
		ctx.globalAlpha = scoreOpacity;
		renderText(trueCanvas.width / 2 + gdx, (trueCanvas.height / 2)- xteamLogoSvg.height + gdy, scoreSize, color, score);
    Object.entries(scoreByColor).forEach(([hexColor, scoreByHex], i) =>
      renderText(100, 50 + (27 * i), 27, '#FFFFFF', `${hexColorToName(hexColor)}: ${scoreByHex}`)
    );
	}

	ctx.globalAlpha = 1;
}

function clearGameBoard() {
	drawPolygon(trueCanvas.width / 2, trueCanvas.height / 2, 6, trueCanvas.width / 2, 30, hexagonBackgroundColor, 0, 'rgba(0,0,0,0)');
}

function drawPolygon(x, y, sides, radius, theta, fillColor, lineWidth, lineColor) {
	ctx.fillStyle = fillColor;
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = lineColor;

	ctx.beginPath();
	var coords = rotatePoint(0, radius, theta);
	ctx.moveTo(coords.x + x, coords.y + y);
	var oldX = coords.x;
	var oldY = coords.y;
	for (var i = 0; i < sides; i++) {
		coords = rotatePoint(oldX, oldY, 360 / sides);
		ctx.lineTo(coords.x + x, coords.y + y);
		oldX = coords.x;
		oldY = coords.y;
	}

	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	ctx.strokeStyle = 'rgba(0,0,0,0)';
}

function toggleClass(element, active) {
	if ($(element).hasClass(active)) {
		$(element).removeClass(active);
	} else {
		$(element).addClass(active);
	}
}

function showText(text) {
	var messages = {
		'paused': "<div class='centeredHeader unselectable'>Game Paused</div>",
		'pausedAndroid': "<div class='centeredHeader unselectable'>Game Paused</div><div class='unselectable centeredSubHeader' style='position:absolute;margin-left:-150px;left:50%;margin-top:20px;width:300px;font-size:16px;'></div>",
		'pausediOS': "<div class='centeredHeader unselectable'>Game Paused</div><div class='unselectable centeredSubHeader' style='position:absolute;margin-left:-150px;left:50%;margin-top:20px;width:300px;font-size:16px;'></div>",
		'pausedOther': "<div class='centeredHeader unselectable'>Game Paused</div><div class='unselectable centeredSubHeader' style='margin-top:10px;position:absolute;left:50%;margin-left:-190px;max-width:380px;font-size:18px;'></div>",
		'start': "<div class='centeredHeader unselectable' style='line-height:80px;'>Press enter to start</div>"
	};

	if (text == 'paused') {
		if (settings.os == 'android') {
			text = 'pausedAndroid'
		} else if (settings.os == 'ios') {
        text = 'pausediOS'
    } else if (settings.platform == 'nonmobile') {
        text = 'pausedOther'
    }
	}

	if (text == 'gameover') {
	   //Clay('client.share.any', {text: 'Think you can beat my score of '+ score + ' in Super Cool Game?'})
		$("#gameoverscreen").fadeIn();
  }
	$(".overlay").html(messages[text]);
	$(".overlay").fadeIn("1000", "swing");

}

function setMainMenu() {
	gameState = 4;
	canRestart = false;
	setTimeout(function() {
		canRestart = 's';
	}, 500);
	$('#restartBtn').hide();
	if ($("#pauseBtn").replace(/^.*[\\\/]/, '') == "btn_pause.svg") {
		$("#pauseBtn").attr("src","./images/btn_resume.svg");
	} else {
		$("#pauseBtn").attr("src","./images/btn_pause.svg");
	}
}

function hideText() {
	$(".overlay").fadeOut(150, function() {
		$(".overlay").html("");
	})
}

function gameOverDisplay() {
	settings.ending_block=false;
	Cookies.set("visited",true);
	var c = document.getElementById("canvas");
	c.className = "blur";
	updateHighScores();
	if (highscores.length === 0 ){
		$("#currentHighScore").text(0);
	}
	else {
		$("#currentHighScore").text(highscores[0])
	}
	$("#xteamlogosvg").fadeOut();
	$("#gameoverscreen").fadeIn();
	$("#buttonCont").fadeIn();
	$("#gameoverdisconnected").fadeIn();
	$("#socialShare").fadeIn();
	$("#restart").fadeIn();
  set_score_pos();
}

function updateHighScores (){
    $("#cScore").text(score);
    $("#1place").text(highscores[0]);
    $("#2place").text(highscores[1]);
    $("#3place").text(highscores[2]);
}

var pausable = true;
function pause(o) {
    if (gameState == 0 || gameState == 2 || !pausable) {
        return;
    }

	pausable = false;
	writeHighScores();
	var message;
	if (o) {
		message = '';
	} else {
		message = 'paused';
	}

	var c = document.getElementById("canvas");
	if (gameState == -1) {
		$('#fork-ribbon').fadeOut(300, 'linear');
		$('#restartBtn').fadeOut(300, "linear");
		$('#buttonCont').fadeOut(300, "linear");
		if ($('#helpScreen').is(':visible')) {
			$('#helpScreen').fadeOut(300, "linear");
		}

		$("#pauseBtn").attr("src", "./images/btn_pause.svg");
		$('.helpText').fadeOut(300, 'linear');
		$('#overlay').fadeOut(300, 'linear');
		hideText();
		setTimeout(function() {
			gameState = prevGameState;
			pausable =true;
		}, 400);
	} else if (gameState != -2 && gameState !== 0 && gameState !== 2) {
		$('#restartBtn').fadeIn(300, "linear");
		$('#buttonCont').fadeIn(300, "linear");
		$('.helpText').fadeIn(300, 'linear');
		if (message == 'paused') {
			showText(message);
		}
		$('#fork-ribbon').fadeIn(300, 'linear');
		$("#pauseBtn").attr("src","./images/btn_resume.svg");
		$('#overlay').fadeIn(300, 'linear');
		prevGameState = gameState;
		setTimeout(function() {
		    pausable = true;
		}, 400);
		gameState = -1;
	}
}
