function Text(x,y,text,font,color,incrementFunction){
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
			ctx.fillText(text,this.x+gdx,this.y+gdy);
			ctx.globalAlpha =1;
			//this.opacity = 1-(Date.now()-MainClock.lastCombo)/5000;
			incrementFunction(this);
			return true;
		}
		else{
			return false;
		}


	}

}

function fadeUpAndOut(text){
	text.opacity -=0.07;
	text.y-=3;
}

function fadeOut(text){
	text.opacity -= 0.01 ;
}
