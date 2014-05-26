var grey = '#bdc3c7';

function render() {
	ctx.clearRect(0, 0, trueCanvas.width, trueCanvas.height);
	clearGameBoard();
	
	if (gameState == -2) {
		if (Date.now() - startTime > 1300) {
			var op = (Date.now() - startTime - 1300)/500;
			if (op > 1) {
				op = 1;
			}
			ctx.globalAlpha = op;
			drawPolygon(trueCanvas.width / 2 , trueCanvas.height / 2 , 6, (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth, 30, grey, false,6);
			ctx.globalAlpha = 1;
		}
	} else {
		drawPolygon(trueCanvas.width / 2 + gdx, trueCanvas.height / 2 + gdy, 6, (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth, 30, grey, false, 6);
	}


	for (var i in MainClock.blocks) {
		for (var j = 0; j < MainClock.blocks[i].length; j++) {
			var block = MainClock.blocks[i][j];
			block.draw(true, j);
		}
	}

	for (var i in blocks) {
		blocks[i].draw();
	}


	MainClock.draw();
	if (gameState == 1) {
		drawScoreboard();
	}
	for (var i in MainClock.texts) {
		var alive = MainClock.texts[i].draw();
		if(!alive){
			MainClock.texts.splice(i,1)
		}
		i--;
	}


	settings.prevScale = settings.scale;
}
