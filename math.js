function rotatePoint(x, y, theta) {
	var thetaRad = theta * 0.0174532925;
	var rotX = Math.cos(thetaRad) * x - Math.sin(thetaRad) * y;
	var rotY = Math.sin(thetaRad) * x + Math.cos(thetaRad) * y;

	return { 
		x: rotX,
		y: rotY,
	};
}