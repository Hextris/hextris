function exportSaveState() {
	var state = {};

	if(gameState == 1 || gameState == -1) {
		state = {
			clock: MainClock,
			blocks: blocks,
			score: score,
			wavegen: waveone,
			gdx: gdx,
			gdy: gdy,
			comboMultiplier:comboMultiplier
		}
	}

	return JSONfn.stringify(state);
}

function clearSaveState() {
	localStorage.setItem("saveState", "{}"); 
}

function isStateSaved() {
	return localStorage.getItem("saveState") != "{}";
}
