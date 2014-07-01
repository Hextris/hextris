var prevGameState;
function showText(text){
    var messages = {
        'paused':"<div class='centeredHeader unselectable'>Paused</div><br><div class='unselectable centeredSubHeader'>Press p to resume</div>",
        'start':"<div class='centeredHeader unselectable' style='line-height:80px;' >Press enter to start</div>",
        'gameover':"<div class='centeredHeader unselectable'> Game Over: "+score+" pts</div><br><table class='tg' style='margin:0px auto'> <tr> <th class='tg-031e'>1.</th> <th class='tg-031e'>"+highscores[0]+"</th> </tr> <tr> <td class='tg-031e'>2.</td> <th class='tg-031e'>"+highscores[1]+"</th> </tr> <tr> <td class='tg-031e'>3.</td> <th class='tg-031e'>"+highscores[2]+"</th> </tr> </table><br><div class='unselectable centeredSubHeader'>Press enter to restart</div>",
    };

    var pt = document.getElementById("overlay");
    pt.className = '';
    pt.innerHTML = messages[text];
}

function hideText(text){
    var pt = document.getElementById("overlay");
    pt.className = 'faded';
    pt.innerHTML = '';
}
function gameOverDisplay(){
    var c = document.getElementById("canvas");
    c.className = "blur";
    showText('gameover');
}

function pause(x,o,message) {
    message = 'paused';
    var c = document.getElementById("canvas");
    if (gameState == -1 ) {
        hideText();
        c.className = '';
        setTimeout(function(){
            gameState = prevGameState;
        }, 300);

    }
    else if(gameState != -2 && gameState !== 0 && gameState !== 2) {
        c.className = "blur";
        showText(message);
        prevGameState = gameState;
        gameState = -1;
    }
}

keypress.register_combo({
    keys: "left",
    on_keydown: function() {
        if (MainClock && gameState !== 0) {
            MainClock.rotate(1);
        }
    }
});

keypress.register_combo({
    keys: "right",
    on_keydown: function() {
        if (MainClock && gameState !== 0){
            MainClock.rotate(-1);
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
        toggleDevTools();
    }
});

keypress.register_combo({
    keys: "e",
    on_keydown: function() {
        exportHistory();
    }
});

keypress.register_combo({
    keys: "i",
    on_keydown: function() {
        importHistory();
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
    if (!MainClock || gameState === 0) {
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
        MainClock.rotate(1);
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
        MainClock.rotate(-1);
    }
}
