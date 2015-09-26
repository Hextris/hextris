function rotatePoint(x, y, theta) {
	var thetaRad = theta * (Math.PI / 180);
	var rotX = Math.cos(thetaRad) * x - Math.sin(thetaRad) * y;
	var rotY = Math.sin(thetaRad) * x + Math.cos(thetaRad) * y;

	return {
		x: rotX,
		y: rotY
	};
}

function randInt(min, max) {
	return Math.floor((Math.random() * max) + min);
}
