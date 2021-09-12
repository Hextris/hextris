function Text(x,y,text,font,color,incrementFunction, fontSize, pacing){
	this.x = x;
	this.y = y;
	this.font = font;
	this.fontSize = fontSize || 50;
	this.color = color;
	this.opacity = 1;
	this.text = text;
	this.alive= 1;
  this.pacing = pacing;
	this.draw = function(){
		if (this.alive>0) {
			ctx.globalAlpha = this.opacity;
			renderText(
        (this.x + gdx),
        (this.y + gdy),
        this.fontSize,
        this.color,
        this.text,
        this.font,
      );
			ctx.globalAlpha =1;
			incrementFunction(this, this.pacing);
			return true;
		}
		else {
			return false;
		}
	};
}

function fadeUpAndOut(text, pacing = 200){
  const innerPow = Math.pow((1 - text.opacity), 1/3 );
  const poweredNumber = Math.pow( innerPow + 1 , 3 );
	text.opacity -= MainHex.dt * poweredNumber / pacing;
	text.alive = text.opacity;
	text.y -= 3 * MainHex.dt;
}
