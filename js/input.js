// HackExeter
keypress.register_combo({
    keys: "left",
    on_keydown: function() {
        debugger;
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
    keys: "enter",
    on_keydown: function() {
        init();
    }
});

keypress.register_combo({
    keys: "p",
    on_keydown: function() {
        if (Math.abs(gameState) == 1) {
            gameState = -gameState;
        }

        if (gameState == 1) {
            requestAnimFrame(animLoop);
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

var tapLeft = Hammer(document.getElementById("leftTap")).on("tap", function(event) {
    if (gameState != 1) {
        init();
    }
    MainClock.rotate(1);

});

var tapRight = Hammer(document.getElementById("rightTap")).on("tap", function(event) {
    if (gameState != 1) {
        init();
    }
    MainClock.rotate(-1);
});