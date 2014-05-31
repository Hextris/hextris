var prevGameState;
var messages = {
        'paused':"<div class='centeredHeader'>Paused</div> \
                  <br> \
                  <div class='centeredSubHeader'>Press p to resume</div>"
}
function pause(x,o,message) {

        if(x === undefined){x=true}
        message = 'paused';
        var c = document.getElementById("canvas");
        var pt = document.getElementById("overlay");
        if (gameState == -1 ) {
            if(showingHelp && !o){return;}
            c.className = '';
            pt.className = 'faded';
            gameState = prevGameState;
            requestAnimFrame(animLoop);

        }
        else if(gameState != -2 && gameState != 0) {
            c.className = "blur";
            pt.className = '';
            pt.innerHTML = messages[message];
            prevGameState = gameState;
            gameState = -1;
        }
}



keypress.register_combo({
    keys: "left",
    on_keydown: function() {
        if (MainClock) {
            MainClock.rotate(1);
        }
    }
});

keypress.register_combo({
    keys: "right",
    on_keydown: function() {
        if (MainClock){
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
       if ( gameState != -2) {
          init();
      }
  }
});


document.body.addEventListener('touchstart', function(e) {
    if (e.changedTouches[0].pageX<window.innerWidth/2) {
        if (gameState != 1 && gameState != -2) {
            init();
        }
        MainClock.rotate(1);
    }
    if (e.changedTouches[0].pageX>window.innerWidth/2) {
        if (gameState != 1 && gameState != -2) {
            init();
        }
        MainClock.rotate(-1);
    }
}, false)

