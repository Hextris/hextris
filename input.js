keypress.register_combo({
	keys: "left", 
	on_keyup: function(){MainClock.rotate(1)},
});

keypress.register_combo({
	keys: "right", 
	on_keyup: function(){MainClock.rotate(-1)},
});

keypress.register_combo({
	keys: "enter", 
	on_keyup: function(){
		if (gameState != 1) {
			init();
		}
	},
});

keypress.register_combo({
	keys: "space", 
	on_keyup: function(){
		iter = 1;
		scoreAdditionCoeff = 1;
	},
	on_keydown: function() {
		iter = 2;
		scoreAdditionCoeff = 2;
	}
});
