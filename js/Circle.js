function Circle(x , y, radius, incrementFunction, strokeColor) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.strokeColor = strokeColor || '#FFF';
	this.opacity = 1;
	this.alive= 1;

	this.draw = function(){
		if (this.alive > 0) {
			ctx.globalAlpha = this.opacity;
			renderCircle(
        this.x,
        this.y,
        this.radius,
        this.strokeColor,
      );
			ctx.globalAlpha = 1;
			incrementFunction(this, this.pacing);
			return true;
		}
		else {
			return false;
		}
	};
}

function fadeBiggerAndOut(circle, pacing = 200){
  const HUNDRED = 100;
  const innerPow = Math.pow((1 - circle.opacity), 1/3 );
  const poweredNumber = Math.pow( innerPow + 1 , 3 );
	circle.opacity -= MainHex.dt * poweredNumber / pacing;
	circle.alive = circle.opacity;
  // Radius must increment in fast, but slow enough to feel the increment in the screen
  // 1.25
  const onePointTwentyFive = 5/4;
  const radiusIncrementRounded = Math.round((circle.radius *  onePointTwentyFive) * HUNDRED) / HUNDRED; 
	circle.radius = radiusIncrementRounded;
}

