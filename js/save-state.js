function exportSaveState() {
	var state = {};

	if(gameState == 1 || gameState == -1 || (gameState === 0 && localStorage.getItem('saveState') !== undefined)) {
		state = {
			hex: $.extend(true, {}, MainHex),
			blocks: $.extend(true, [], blocks),
			score: score,
			wavegen: waveone,
			gdx: gdx,
			gdy: gdy,
			comboTime:settings.comboTime
		};

		state.hex.blocks.map(function(a){
			for (var i = 0; i < a.length; i++) {
				a[i] = $.extend(true, {}, a[i]);
			}

			a.map(descaleBlock);
		});

		for (var i = 0; i < state.blocks.length; i++) {
			state.blocks[i] = $.extend(true, {}, state.blocks[i]);
		}

		state.blocks.map(descaleBlock);
	}

	localStorage.setItem('highscores', JSON.stringify(highscores));

	return JSONfn.stringify(state);
}

function descaleBlock(b) {
	b.distFromHex /= settings.scale;
}

function writeHighScores() {
  highscores.sort(
    ([aScore, aTime],[bScore, bTime]) => {
      aScore = parseInt(aScore, 10);
      bScore = parseInt(bScore, 10);
      if (aScore < bScore) {
        return 1;
      } else if (aScore > bScore) {
        return -1;
      } else {
        return (aTime < bTime) ? 1: (aTime > bTime) ? -1 : 0;
      }
    }
	);
	highscores = highscores.slice(0,3);
	localStorage.setItem("highscores", JSON.stringify(highscores));
}

function clearSaveState() {
	localStorage.setItem("saveState", "{}");
}

function isStateSaved() {
	return localStorage.getItem("saveState") != "{}" && localStorage.getItem("saveState") != undefined;
}
