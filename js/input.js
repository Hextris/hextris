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
	
	$("#colorBlindBtn").on('touchstart mousedown', function() {
	window.colors = ["#8e44ad", "#f1c40f", "#3498db", "#d35400"];
	
    window.hexColorsToTintedColors = {
        "#8e44ad": "rgb(229,152,102)",
        "#f1c40f": "rgb(246,223,133)",
        "#3498db": "rgb(151,201,235)",
        "#d35400": "rgb(210,180,222)"
    };

    window.rgbToHex = {
        "rgb(142,68,173)": "#8e44ad",
        "rgb(241,196,15)": "#f1c40f",
        "rgb(52,152,219)": "#3498db",
        "rgb(211,84,0)": "#d35400"
    };

    window.rgbColorsToTintedColors = {
        "rgb(142,68,173)": "rgb(229,152,102)",
        "rgb(241,196,15)": "rgb(246,223,133)",
        "rgb(52,152,219)": "rgb(151,201,235)",
        "rgb(46,204,113)": "rgb(210,180,222)"
	};
	});


    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $("#restartBtn").on('touchstart', function() {
            init(1);
            canRestart = false;
        });
    }
    else {
        $("#restartBtn").on('mousedown', function() {
            init(1);
            canRestart = false;
        });
    }
}

function handleClickTap(x,y) {
    if (x < 120 && y < 50 && $('.helpText').is(':visible')) {
        showHelp();
        return;
    }

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
