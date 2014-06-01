var grey = '#bdc3c7';
op=0;
var saveState = localStorage.getItem("saveState") || "{}";
if(saveState !== "{}"){op=1;}
function render() {
	ctx.clearRect(0, 0, trueCanvas.width, trueCanvas.height);
	clearGameBoard();
	if (gameState == 1 || gameState ==2 || gameState == -1) {
		if (op < 1) {
			op += 0.01;
		}
		ctx.globalAlpha = op;
		drawPolygon(trueCanvas.width / 2 , trueCanvas.height / 2 , 6, (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth, 30, grey, false,6);
		ctx.globalAlpha = 1;
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
	if ( gameState ==1 | gameState ==-1 ) {
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
