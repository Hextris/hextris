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
  uploadDataToDB()
    .then(() => localStorage.setItem('highscores', JSON.stringify(highscores)));

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
  uploadDataToDB()
    .then( () => localStorage.setItem('highscores', JSON.stringify(highscores)));
}

function clearSaveState() {
	localStorage.setItem("saveState", "{}");
}

function isStateSaved() {
	return localStorage.getItem("saveState") != "{}" && localStorage.getItem("saveState") != undefined;
}

async function uploadDataToDB() {
  const body =  {
    username: window.username,
    highscores, 
  };
  const savegameScoresLambda = '/.netlify/functions/save-game-scores';
  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  try {
    const fetchResponse = await fetch(savegameScoresLambda, fetchOptions)
    const jsonResponse = await fetchResponse.json();
    const userEntry = jsonResponse.data;
    if (userEntry) {
      console.log('Highscores saved...');
    }
  } catch (e) {
    console.log('oh No!, something happened!')
    console.log(e);
  }
}