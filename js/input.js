function addKeyListeners() {
    keypress.register_combo({
        keys: "left",
        on_keydown: function() {
            if (MainHex && gameState !== 0) {
                MainHex.rotate(1);
            }
        }
    });

    keypress.register_combo({
        keys: "right",
        on_keydown: function() {
            if (MainHex && gameState !== 0){
                MainHex.rotate(-1);
            }
        }
    });


    keypress.register_combo({
        keys: "a",
        on_keydown: function() {
            if (MainHex && gameState !== 0) {
                MainHex.rotate(1);
            }
        }
    });

    keypress.register_combo({
        keys: "d",
        on_keydown: function() {
            if (MainHex && gameState !== 0){
                MainHex.rotate(-1);
            }
        }
    });

    keypress.register_combo({
        keys: "p",
        on_keydown: function(){pause();}
    });

    keypress.register_combo({
        keys: "q",
        on_keydown: function() {
            if (devMode) toggleDevTools();
        }
    });

    keypress.register_combo({
        keys: "enter",
        on_keydown: function() {
            if (gameState==2 || gameState==1 || importing == 1) {
                init(1);
            }
            if (gameState===0) {
                resumeGame();
            }
        }
    });
	$("#pauseBtn").on('touchstart mousedown', function() {
		if (gameState != 1 && gameState != -1) {
			return;
		}

		if ($('#helpScreen').is(":visible")) {
			$('#helpScreen').fadeOut(150, "linear");
		}

		pause();
		return false;
	});


    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        $("#restartBtn").on('touchstart', function() {
            if (gameState==2 || gameState == -1 || gameState==1 || importing == 1) {
                init(1);
                canRestart = false;
            }
            else if (gameState===0) {
                init(1)();
            }

        });
    }
    else {
        $("#restartBtn").on('mousedown', function() {
            if (gameState==2 || gameState == -1 ||  gameState==1 || importing == 1) {
                init(1);
                canRestart=false;
            }
            else if (gameState===0) {
                resumeGame();
            }

        });
    }
}
function handleClickTap(x) {
    if (gameState == 2 && canRestart) {
        init(1);
        return;
    }

    if (!MainHex || gameState === 0 || gameState==-1) {
        return;
    }

    if (x < window.innerWidth/2) {
        if (gameState != 1 && gameState != -2 && gameState != -1 ){
            if (importing === 0) {
                resumeGame();
            }
            else {
                init(1);
            }
        }

        MainHex.rotate(1);
    }
    if (x > window.innerWidth/2) {
        if (gameState != 1 && gameState != -2 && gameState != -1) {
            if (importing === 0) {
                resumeGame();
            }
            else {
                init(1);
            }
        }
        MainHex.rotate(-1);
    }
}
