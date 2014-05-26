function exportSaveState() {
	var state = {
		clock: undefined,
		blocks: undefined,
		iter: undefined,
		score: undefined,
	};

	if(gameState == 1) {
		state.clock = MainClock;
		state.blocks = blocks;
		state.iter = iter;
		state.score = score;
	}
	
	return JSON.stringify(state);
}

function loadSaveState() {
	
}