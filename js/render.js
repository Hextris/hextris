op=0;
var saveState = localStorage.getItem("saveState") || "{}";
if(saveState !== "{}"){op=1;}
function render() {
	var grey = '#bdc3c7';
	if (gameState === 0) {
		grey = "rgb(220, 223, 225)";
	}
	
	ctx.clearRect(0, 0, trueCanvas.width, trueCanvas.height);
	clearGameBoard();
	if (gameState === 1 || gameState === 2 || gameState === -1 || gameState === 0) {
		if (op < 1) {
			op += 0.01;
		}
		ctx.globalAlpha = op;
		drawPolygon(trueCanvas.width / 2 , trueCanvas.height / 2 , 6, (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth, 30, grey, false,6);
		drawTimer();
		ctx.globalAlpha = 1;
	}

	var i;
	for (i = 0; i < MainClock.blocks.length; i++) {
		for (var j = 0; j < MainClock.blocks[i].length; j++) {
			var block = MainClock.blocks[i][j];
			block.draw(true, j);
		}
	}

	for (i = 0; i < blocks.length; i++) {
		blocks[i].draw();
	}

	MainClock.draw();
	if (gameState ==1 || gameState ==-1 || gameState === 0) {
		drawScoreboard();
	}

	for (i = 0; i < MainClock.texts.length; i++) {
		var alive = MainClock.texts[i].draw();
		if(!alive){
			MainClock.texts.splice(i,1);
			i--;
		}
	}

	settings.prevScale = settings.scale;
	settings.hexWidth = settings.baseHexWidth * settings.scale;
	settings.blockHeight = settings.baseBlockHeight * settings.scale;
}

function drawKey(key, x, y) {
	ctx.save();
	ctx.scale(settings.scale - .3,settings.scale - .3);

	ctx.fillStyle = '#2c3e50';
	ctx.strokeStyle = '#2c3e50';
	ctx.lineWidth = 5;
	ctx.rect(x + 2.5, y + 2.5, 45, 45);
	ctx.stroke();

	switch (key) {
		case "left":
			ctx.translate(x + 24, y + 16.5);
			ctx.rotate(3.14159);
			ctx.font = "25px Fontawesome";
			ctx.fillText("", 0, 0);
			break;
		case "right":
			ctx.font = "25px Fontawesome";
			ctx.fillText("", x + 27, y + 34.5);
			break;
		
		default:
			ctx.font = "40px Roboto";
			ctx.fillText(key, x + 25 , y + 39.5);
	}

	ctx.restore();
}