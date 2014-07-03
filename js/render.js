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

	if (MainClock.ct < 400 && (gameState != 0) && !MainClock.playThrough) {
		if (MainClock.ct > 350) {
			ctx.globalAlpha = (50 - (MainClock.ct - 350))/50;
		}

		if (MainClock.ct < 50) {
			ctx.globalAlpha = (MainClock.ct)/50;
		}

		renderText((trueCanvas.width)/2 + 1.5 * settings.scale, (trueCanvas.height)/2 - 208 * settings.scale, 35, '#2c3e50', 'Controls', '35px Roboto');
		renderText((trueCanvas.width)/2 - 85 * settings.scale, (trueCanvas.height)/2 - 169 * settings.scale, 20, '#2c3e50', 'Rotation:', '20px Roboto');
		renderText((trueCanvas.width)/2 - 21 * settings.scale, (trueCanvas.height)/2 - 141 * settings.scale, 12, '#2c3e50', 'Left', '12px Roboto');
		renderText((trueCanvas.width)/2 + 25 * settings.scale, (trueCanvas.height)/2 - 141 * settings.scale, 12, '#2c3e50', 'Right', '12px Roboto');
		drawKey("right",(trueCanvas.width)/2 + 23 * settings.scale - 35/2 * settings.scale, (trueCanvas.height)/2 - 195 * settings.scale);
		drawKey("left",(trueCanvas.width)/2 - 23 * settings.scale - 35/2 * settings.scale, (trueCanvas.height)/2 - 195 * settings.scale);
		renderText((trueCanvas.width)/2 + 1.5 * settings.scale, (trueCanvas.height)/2 - 125 * settings.scale, 20, '#2c3e50', 'Rotate the Hexagon to make combos of 3 or more touching blocks!', '20px Roboto');
		renderText((trueCanvas.width)/2 + 1.5 * settings.scale, (trueCanvas.height)/2 - 105 * settings.scale, 20, '#2c3e50', 'Make combos in a row to receive a score multiplier!', '20px Roboto');
		renderText((trueCanvas.width)/2 + 1.5 * settings.scale, (trueCanvas.height)/2 - 85 * settings.scale, 20, '#2c3e50', 'Don\'t let the blocks stack outside of the gray Hexagon!', '20px Roboto');
		ctx.globalAlpha = 1;
	}
}

function drawKey(key, x, y) {
	ctx.save();
	ctx.fillStyle = '#2c3e50';
	ctx.strokeStyle = '#2c3e50';
	ctx.lineWidth = 4 * settings.scale;
	ctx.rect(x + 2.5 * settings.scale, y + 2.5 * settings.scale, 35 * settings.scale, 35 * settings.scale);
	ctx.stroke();

	switch (key) {
		case "left":
			ctx.translate(x + settings.scale * 28, y + settings.scale * 13);
			ctx.rotate(3.14159);
			ctx.font = "20px Fontawesome";
			ctx.scale(settings.scale, settings.scale);
			ctx.fillText(String.fromCharCode("0xf04b"), 0, 0);
			break;
		case "right":
			ctx.font = "20px Fontawesome";
			ctx.translate(x + settings.scale * 12.5, y + settings.scale * 27.5);
			ctx.scale( 	settings.scale, settings.scale);
			ctx.fillText(String.fromCharCode("0xf04b"), 0, 0);
			break;
		
		default:
			ctx.font = "35px Roboto";
			ctx.translate(x + settings.scale * 25 , y + settings.scale * 39.5)
			ctx.scale(settings.scale, settings.scale);
			ctx.fillText(key, 0, 0);
	}

	ctx.restore();
}