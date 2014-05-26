function Text(x,y,text,font,color){
	this.x = x;
	this.y = y;
	this.font = font;
	this.color = color;
	this.opacity =1;
	this.text = text;
	
	this.draw = function(){
		if(this.opacity>0){
			ctx.font= this.font;
			ctx.fillStyle = this.color;
			ctx.globalAlpha = this.opacity;
			ctx.fillText(text,this.x,this.y);
			ctx.globalAlpha =1;
			this.opacity = 1-(Date.now()-MainClock.lastCombo)/5000;
		}


	}

}
