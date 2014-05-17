keypress.register_combo({
	keys: "right", 
	on_keyup: function(){MainClock.rotate(1)},
});

keypress.register_combo({
	keys: "left", 
	on_keyup: function(){MainClock.rotate(-1)},
});
