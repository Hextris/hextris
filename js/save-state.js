function exportSaveState() {
	console.log('o')
	debugger;
	var state = {};

	if(gameState == 1 || gameState == -1 || (gameState === 0 && localStorage.getItem('saveState') !== undefined)) {
		console.log(MainClock.blocks[5][0].distFromHex);
		MainClock.blocks.map(function(i){i.map(function(o){o.distFromHex /= settings.scale})});
		console.log(MainClock.blocks[5][0].distFromHex);
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
