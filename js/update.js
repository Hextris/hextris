//remember to update history function to show the respective iter speeds
function update() {
	var now = Date.now();
	if (importing) {
		if (importedHistory[count]) {
			if (importedHistory[count].block) {
				addNewBlock(importedHistory[count].block.blocklane, importedHistory[count].block.color, importedHistory[count].block.iter, importedHistory[count].block.distFromHex, importedHistory[count].block.settled);
			}

			if (importedHistory[count].rotate) {
				MainClock.rotate(importedHistory[count].rotate);
			}
		}
	}
	else if (gameState == 1) {
		waveone.update();
		if (now - waveone.prevTimeScored > 1000) {
			waveone.prevTimeScored = now;
		}
	}
	var lowestDeletedIndex = 99;
	var i;
	var j;
	var block;

	var objectsToRemove = [];
	for (i = 0; i < blocks.length; i++) {
		MainClock.doesBlockCollide(blocks[i]);
		if (!blocks[i].settled) {
			if (!blocks[i].initializing) blocks[i].distFromHex -= blocks[i].iter * settings.scale;
		} else if (!blocks[i].removed) {
			blocks[i].removed = 1;
		}
	}

	for (i = 0; i < MainClock.blocks.length; i++) {
		for (j = 0; j < MainClock.blocks[i].length; j++) {
            if (MainClock.blocks[i][j].checked ==1 ) {
                consolidateBlocks(MainClock,MainClock.blocks[i][j].attachedLane,MainClock.blocks[i][j].getIndex());
                MainClock.blocks[i][j].checked=0;
            }
        }
    }

	for (i = 0; i < MainClock.blocks.length; i++) {
		lowestDeletedIndex = 99;
		for (j = 0; j < MainClock.blocks[i].length; j++) {
			block = MainClock.blocks[i][j];
			if (block.deleted == 2) {
				MainClock.blocks[i].splice(j,1);
				blockDestroyed();
				if (j < lowestDeletedIndex) lowestDeletedIndex = j;
				j--;
			}
		}

		if (lowestDeletedIndex < MainClock.blocks[i].length) {
			for (j = lowestDeletedIndex; j < MainClock.blocks[i].length; j++) {
				MainClock.blocks[i][j].settled = 0;
			}
		}
	}

	for (i = 0; i < MainClock.blocks.length; i++) {
		for (j = 0; j < MainClock.blocks[i].length; j++) {
			block = MainClock.blocks[i][j];
			MainClock.doesBlockCollide(block, j, MainClock.blocks[i]);

			if (!MainClock.blocks[i][j].settled) {
				MainClock.blocks[i][j].distFromHex -= block.iter * settings.scale;
			}
		}
	}

	for(i = 0; i < blocks.length;i++){
		if (blocks[i].removed == 1) {
			blocks.splice(i,1);
			i--;
		}
	}
        MainClock.ct++;
	count++;
}
