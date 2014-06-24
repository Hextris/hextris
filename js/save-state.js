function exportSaveState() {
	console.log('o')
	var state = {};
	
	if(gameState == 1 || gameState == -1 || (gameState == 0 && localStorage.getItem('saveState') !== undefined)) {
        
        MainClock.blocks.forEach(function(o){
			o.forEach(function(b){
				b.distFromhex /= settings.scale;
			})
        });

		blocks.map(function(block){block.distFromHex /= settings.scale})
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
