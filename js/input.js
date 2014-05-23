// HackExeter
keypress.register_combo({
    keys: "left",
    on_keydown: function() {
        MainClock.rotate(1);
    }
});

keypress.register_combo({
    keys: "right",
    on_keydown: function() {
        MainClock.rotate(-1);
    }
});

keypress.register_combo({
    keys: "enter",
    on_keydown: function() {
        if (gameState != 1) {
            init();
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

// keypress.register_combo({
//     keys: "space",
//     on_keyup: function() {
//         iter = 1; // <- 1337 hax that reset speed anywhere in the game
//         scoreAdditionCoeff = 1;
//     },
//     on_keydown: function() {
//         iter = 2;
//         scoreAdditionCoeff = 2;
//     }
// });
