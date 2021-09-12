function search(twoD,oneD){
	// Searches a two dimensional array to see if it contains a one dimensional array. indexOf doesn't work in this case
	for(var i=0;i<twoD.length;i++){
		if(twoD[i][0] == oneD[0] && twoD[i][1] == oneD[1]) {
			return true;
		}
	}
	return false;
}

function floodFill(hex, side, index, deleting) {
	if (hex.blocks[side] === undefined || hex.blocks[side][index] === undefined) return;

	//store the color
	var color = hex.blocks[side][index].color;
	//nested for loops for navigating the blocks
	for(var x =-1;x<2;x++){
		for(var y =-1;y<2;y++){
			//make sure the they aren't diagonals
			if(Math.abs(x)==Math.abs(y)){continue;}
			//calculate the side were exploring using mods
			var curSide =(side+x+hex.sides)%hex.sides;
			//calculate the index
			var curIndex = index+y;
			//making sure the block exists at this side and index
			if(hex.blocks[curSide] === undefined){continue;}
			if(hex.blocks[curSide][curIndex] !== undefined){
				// checking equivalency of color, if its already been explored, and if it isn't already deleted
				if(hex.blocks[curSide][curIndex].color == color && search(deleting,[curSide,curIndex]) === false && hex.blocks[curSide][curIndex].deleted === 0 ) {
					//add this to the array of already explored
					deleting.push([curSide,curIndex]);
					//recall with next block explored
					floodFill(hex,curSide,curIndex,deleting);
				}
			}
		}
	}
}

function deleteAllHex(hex, deleting) {
  for(let i = 0 ; i < 6; i++) {
    hex.blocks[i].forEach((_blockSide, j) => {
      // checking equivalency of color, if its already been explored, and if it isn't already deleted
      if (search(deleting,[i,j]) === false && hex.blocks[i][j].deleted === 0) {
        deleting.push([i,j]);
      }
    });
  }
}
