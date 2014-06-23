function Text(x,y,text,font,color,incrementFunction){
	this.x = x;
	this.y = y;
	this.font = font;
	this.color = color;
	this.opacity =1;
	this.text = text;
	this.alive=1;
	
	this.draw = function(){
		if(this.alive>0){
			ctx.save();
			var sf = (settings.scale - 1)/3 + 1;
			ctx.scale(sf, sf);
			ctx.font= this.font;
			ctx.fillStyle = this.color;
			ctx.globalAlpha = this.opacity;
			ctx.fillText(this.text,(this.x + gdx) * (1/sf), (this.y + gdy) * (1/sf));
			ctx.globalAlpha =1;
			ctx.restore();
			incrementFunction(this);
			return true;
		}
		else {
			return false;
		}
	}

}

function fadeUpAndOut(text){
	text.opacity -=  Math.pow(Math.pow((1-text.opacity), 1/3)+1,3)/100;
	text.alive = text.opacity;
	text.y-=3;
}

