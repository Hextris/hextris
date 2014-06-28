function exportSaveState() {
	var state = {};

	if(gameState == 1 || gameState == -1 || (gameState === 0 && localStorage.getItem('saveState') !== undefined)) {
		MainClock.blocks.map(function(i){i.map(function(o){o.distFromHex /= settings.scale})});
		blocks.map(function(block){block.distFromHex /= settings.scale;});
		state = {
			clock: MainClock,
			blocks: blocks,
			score: score,
			wavegen: waveone,
			gdx: gdx,
			gdy: gdy,
			comboMultiplier:comboMultiplier
		};
	}

	return JSONfn.stringify(state);
}

function clearSaveState() {
	localStorage.setItem("saveState", "{}"); 
}

function isStateSaved() {
	return localStorage.getItem("saveState") != "{}";
}
