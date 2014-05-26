function search(twoD,oneD){
	// Searches a two dimensional array to see if it contains a one dimensional array. indexOf doesn't work in this case
	for(var i=0;i<twoD.length;i++){
		if(twoD[i][0] == oneD[0] && twoD[i][1] == oneD[1]) {
			return true;
		}
	}
	return false;
}
function floodFill(clock, side, index, deleting) {
	if (clock.blocks[side] === undefined || clock.blocks[side][index] === undefined) {
		//just makin sure stuff exists
		return;
	}

	//store the color
	var color = clock.blocks[side][index].color;
	//nested for loops for navigating the blocks
	for(var x =-1;x<2;x++){
		for(var y =-1;y<2;y++){
			//make sure the they aren't diagonals
			if(Math.abs(x)==Math.abs(y)){continue;}
			//calculate the side were exploring using mods
			var curSide =(side+x+clock.sides)%clock.sides;
			//calculate the index
			var curIndex = index+y;
			//making sure the block exists at this side and index
			if(clock.blocks[curSide] === undefined){continue;}
			if(clock.blocks[curSide][curIndex] !== undefined){
				// checking equivalency of color, if its already been explored, and if it isn't already deleted
				if(clock.blocks[curSide][curIndex].color == color && search(deleting,[curSide,curIndex]) === false && clock.blocks[curSide][curIndex].deleted == 0 ) {
					//add this to the array of already explored
					deleting.push([curSide,curIndex]);
					//recall with next block explored
					floodFill(clock,curSide,curIndex,deleting);
				}
			}
		}
	}
}

function consolidateBlocks(clock,side,index){
	//record which sides have been changed
	var sidesChanged =[];
	var deleting=[];
	//add start case
	deleting.push([side,index]);
	//fill deleting	
	floodFill(clock,side,index,deleting);
	//make sure there are more than 3 blocks to be deleted
	if(deleting.length<3){return;}
	var i;
	for(var i=0; i<deleting.length;i++){
		var arr = deleting[i];
		//just making sure the arrays are as they should be
		if(arr !== undefined && arr.length==2) {
			//add to sides changed if not in there
			if(sidesChanged.indexOf(arr[0])==-1){
				sidesChanged.push(arr[0]);
			}
			//mark as deleted
			clock.blocks[arr[0]][arr[1]].deleted = 1;
		}
	}
	var lastBlock =  clock.blocks[arr[0]][arr[1]]
	// add scores
	var now = Date.now();
	if(now - clock.lastCombo < 5000 ){
		clock.comboMultiplier += 1;	
		clock.lastCombo = now;
	}
	else{
		clock.lastCombo = now;
		clock.comboMultiplier = 1;
	}
	var adder = deleting.length * deleting.length * clock.comboMultiplier;
	clock.texts.push(new Text(clock.x,clock.y,"+ "+adder.toString(),"bold Roboto 24px","#9b59b6",fadeUpAndOut));
	score += adder;

}
