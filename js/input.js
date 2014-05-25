// HackExeter
var prevGameState;

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
    on_keydown: function() {
        if (gameState == -1) {
            gameState = prevGameState;
            requestAnimFrame(animLoop);
        }
        else {
            prevGameState = gameState;
            gameState = -1;
        }
    }
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
	if (gameState != 1 && gameState != -2) {
		init();
	}
    }
});


document.body.addEventListener('touchstart', function(e){

 	if( e.changedTouches[0].pageX<window.innerWidth/2){
		if (gameState != 1 && gameState != -2) {
			init();
		}
		MainClock.rotate(1);
	}
	if( e.changedTouches[0].pageX>window.innerWidth/2){
		if (gameState != 1 && gameState != -2) {
			init();
		}
		MainClock.rotate(-1);
	}
}, false)
