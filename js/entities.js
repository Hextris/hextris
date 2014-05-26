var angularVelocityConst = 4;

// t: current time, b: begInnIng value, c: change In value, d: duration
function easeOutCubic(t, b, c, d) {
	return c*((t=t/d-1)*t*t + 1) + b;
}

var colorSounds =  {"#e74c3c": new Audio("../sounds/lowest.ogg"),
"#f1c40f":new Audio("../sounds/highest.ogg"),
"#3498db":new Audio("../sounds/middle.ogg"),
	"#2ecc71":new Audio("../sounds/highest.ogg") //fix this later
};
