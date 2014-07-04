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
    keys: "e",
    on_keydown: function() {
        if (devMode) exportHistory();
    }
});

keypress.register_combo({
    keys: "i",
    on_keydown: function() {
        if (devMode) importHistory();
    }
});

keypress.register_combo({
    keys: "`",
    on_keydown: function() {
        if (devMode) {
            devMode = 0;
        } else {
            devMode = 1;
        }
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

$(document).ready(function(){
    $("#pauseBtn").on('touchstart mousedown', function() {
        pause();
        if ($($("#pauseBtn").children()[0]).attr('class').indexOf('pause') == -1) {
            $("#pauseBtn").html('<i class="fa fa-pause fa-2x"></i>');
        } else {
            $("#pauseBtn").html('<i class="fa fa-play fa-2x"></i>');
        }

        return false;
    });

    $("#restartBtn").on('touchstart mousedown', function() {
        if (gameState==2 || gameState==1 || importing == 1) {
            init(1);
        }
        if (gameState===0) {
            resumeGame();
        }

    });
}, false);

function handleClickTap(x) {
    if (!MainHex || gameState === 0 || gameState==2 || gameState==-1) {
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
