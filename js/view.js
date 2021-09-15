// t: current time, b: begInnIng value, c: change In value, d: duration
function easeOutCubic(t, b, c, d) {
	return c * ((t = t / d - 1) * t * t + 1) + b;
}

function renderText(x, y, fontSize, color, text, font) {
	ctx.save();

	fontSize *= settings.scale;
  if (!font) {
		var font = `20px 'Open Sans'`;
    ctx.font = fontSize + font;
	} else {
    ctx.font = font;
  }
	ctx.textAlign = 'center';
	ctx.fillStyle = color;
	ctx.fillText(text, x, y + (fontSize / 2) - 9 * settings.scale);
	ctx.restore();
}

function renderCircle(x, y, radius, color, startAngle, endAngle) {
	ctx.save();
	ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
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
  var color = "rgb(255, 255, 255)";
	//}
  const basePixelFont = 16;
	if (gameState === 0) {
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale - 5, trueCanvas.height / 2.1 + gdy - 155 * settings.scale, 90, "#FCC058", "HackBreak", `900 ${( (`${90 * settings.scale}20`) / basePixelFont)}rem 'Open Sans'`);
	} else if (gameState != 0 && textOpacity > 0) {
		textOpacity -= 0.05;
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale - 5, trueCanvas.height / 2 + gdy - 155 * settings.scale, 90, "#FCC058", "HackBreak", `900 ${( (`${90 * settings.scale}20`) / basePixelFont)}rem 'Open Sans'`);
		ctx.globalAlpha = scoreOpacity;
		renderText(trueCanvas.width / 2 + gdx, trueCanvas.height - (trueCanvas.height - 100) + gdy * settings.scale, scoreSize, color, score, `900 ${( (`${scoreSize * settings.scale}20`) / basePixelFont)}rem 'Open Sans'`);
		
	} else {
		ctx.globalAlpha = scoreOpacity;
		renderText(trueCanvas.width / 2 + gdx, trueCanvas.height - (trueCanvas.height - 100) + gdy * settings.scale, scoreSize, color, score, `900 ${( (`${scoreSize * settings.scale}20`) / basePixelFont)}rem 'Open Sans'`);
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
		'paused': "<div class='centeredHeader unselectable'>HackBreak</div>",
		'pausedAndroid': "<div class='centeredHeader unselectable'>HackBreak</div>",
		'pausediOS': "<div class='centeredHeader unselectable'>HackBreak</div>",
		'pausedOther': "<div class='centeredHeader unselectable'>HackBreak</div>",
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
		$("#gaveoverscreenlayout").fadeIn(500, 'linear');
		$("#gaveoverscreenmainlayout").fadeIn();
  }
  $("#pausesection").fadeIn(1000, 'linear');
	$(".overlay").html(messages[text]);
}

function setMainMenu() {
	gameState = 4;
	canRestart = false;
	setTimeout(function() {
		canRestart = 's';
	}, 500);
	$('#restartBtn').hide();
	$('#resumeBtn').hide();
}

function hideText() {
	$(".overlay").fadeOut(150, 'linear');
  $(".overlay").html('');
}

function gameOverDisplay() {
	settings.ending_block=false;
	Cookies.set("visited",true);
	var c = document.getElementById("canvas");
	c.className = "blur";
  updateTime();
	updateHighScores();
  updateHouseCombinations();
	if (highscores.length === 0 ){
		$("#currentHighScore").text(0);
		$("#currentHighScoreMainScreen").text(0);
	}
	else {
		$("#currentHighScore").text((highscores[0])[0])
		$("#currentHighScoreMainScreen").text((highscores[0])[0])
	}
  $('#highscoremainscreen').fadeOut(1000, 'linear');
  $('#gameOverBox').text(username.toLocaleUpperCase());
  $("#pausesection").hide();
	$("#xteamlogosvg").fadeOut(1000, 'linear');
	$("#gaveoverscreenlayout").fadeIn(1000, 'linear');
	$("#gaveoverscreenmainlayout").fadeIn();
	$("#restart").fadeIn(1000, 'linear');
	$("#worldwide").fadeIn(1000, 'linear');

  generateGlobalScoresSection().then();
}

function getGameDuration() {
  const endTime = moment();
  const endTimeFormatted = moment(endTime, 'YYYY/MM/DD HH:mm');
  const startTimeFormatted = moment(startTime, 'YYYY/MM/DD HH:mm')
  return moment.duration(
    endTimeFormatted.diff(startTimeFormatted)
  );
}

function parseGameDurationToText(duration) {
  const ZERO = 0;
  const TEN = 10;
  const HUNDRED = 100;
  const hoursText = duration.hours() > ZERO ? `${duration.hours()}h` : null ;
  const minutesText = duration.minutes() > ZERO ? `${duration.minutes()}m` : null ;
  const secondsText = duration.seconds() >= ZERO ? `${duration.seconds()}` : null ;
  const milliSecondsText = duration.milliseconds() >= ZERO ?
    `${duration.milliseconds() >= HUNDRED ? Math.round( duration.milliseconds() / TEN ) : duration.milliseconds()}` :
    null ;
  const durationText = `${hoursText ? `${hoursText} ` : ''}${minutesText ? `${minutesText} ` : ''}${secondsText}.${milliSecondsText}s`;
  return durationText;
}

function updateHouseCombinations() {
  Object.entries(scoreByColor).forEach(([hexColor, scoreByHex]) => {
    const htmlId = hexColorToHmlId(hexColor);
    $(`#${htmlId}`).text(`${scoreByHex}`);
  });
}

function updateTime() {
  const gameDuration = getGameDuration();
  const gameDurationText = parseGameDurationToText(gameDuration);
  $("#cTime").text(`${gameDurationText}`);
  highscores.forEach(([,time], index) => {
    const momentTime = moment.duration(time);
    $(`#${index + 1}placeTime`).text(`${parseGameDurationToText(momentTime)}`);
  });
}

function updateHighScores (){
    $("#cScore").text(score);
    highscores.forEach(([score], index) => {
      $(`#${index + 1}place`).text(score);
    });
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
		$('#resumeBtn').fadeOut(300, "linear");
		$('#overlayhelpscreen').fadeOut(300, 'linear');

		$("#pauseBtn").fadeIn(300, 'linear');
		$('#overlay').fadeOut(300, 'linear');
		hideText();
		setTimeout(function() {
			gameState = prevGameState;
			pausable =true;
		}, 400);
	} else if (gameState != -2 && gameState !== 0 && gameState !== 2) {
		$('#restartBtn').fadeIn(300, "linear");
		$('#resumeBtn').fadeIn(300, "linear");
		if (message == 'paused') {
			showText(message);
		}
		$('#fork-ribbon').fadeIn(300, 'linear');
		$("#pauseBtn").fadeOut(300, 'linear');
		$('#overlay').fadeIn(300, 'linear');
    showHelp();
		prevGameState = gameState;
		setTimeout(function() {
		    pausable = true;
		}, 400);
		gameState = -1;
	}
}

async function generateGlobalScoresSection() {
  const searchAllUsersLambda = '/.netlify/functions/search-all-users';
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  try {
    const fetchResponse = await fetch(searchAllUsersLambda, fetchOptions)
    const jsonResponse = await fetchResponse.json();
    const AllUsers = jsonResponse.data;

    const scoreTemplate = document.getElementById('scoretemplate');
    const globalScoreDisplay = document.querySelector( '#worldwidescoredisplay');
    AllUsers.forEach( (user, index) => {
      const clon = scoreTemplate.content.cloneNode(true);
      const gameDuration = moment.duration(user.highestScore.pop());
      clon.querySelector('span').innerText = user.username;
      clon.querySelector('aside').innerText = `${user.highestScore.pop()}`;
      clon.querySelector('div').innerText = parseGameDurationToText(gameDuration);
      globalScoreDisplay.appendChild(clon);
    });
  } catch (e) {
    console.log('oh No!, something happened!')
    console.log(e);
  }
}