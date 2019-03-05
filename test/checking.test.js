/* 
* File name: checking.test.js
* Description: Tests squares that are coming down to make sure there are no matches
*/


// Get two functions to be tested from checking file
const {search, floodFill, consolidateBlocks} = require('../js/checking.js')

// Example hexagon pattern 
var nonMatchHex = {
  "playThrough": 0,
  "fillColor": [
    44,
    62,
    80
  ],
  "tempColor": [
    44,
    62,
    80
  ],
  "angularVelocity": 0,
  "position": 2,
  "dy": 0,
  "dt": 0.9000360014400576,
  "sides": 6,
  "blocks": [
    [
      {
        "settled": 1,
        "height": 8.875,
        "fallingLane": 5,
        "checked": 0,
        "angle": -420,
        "angularVelocity": 0,
        "targetAngle": -420,
        "color": "#3498db",
        "deleted": 0,
        "removed": 1,
        "tint": 0,
        "opacity": 1,
        "initializing": 0,
        "ict": 325.99303972158964,
        "iter": 1.1772154441148122,
        "initLen": 9,
        "attachedLane": 0,
        "distFromHex": 33.43399324485298,
        "width": 38.606249999999996,
        "widthWide": 48.854217278115854
      }
    ],
    [
      {
        "settled": 1,
        "height": 8.875,
        "fallingLane": 3,
        "checked": 0,
        "angle": -360,
        "angularVelocity": 0,
        "targetAngle": -360,
        "color": "#e74c3c",
        "deleted": 0,
        "removed": 1,
        "tint": 0,
        "opacity": 1,
        "initializing": 0,
        "ict": 163.02652106084244,
        "iter": 1.171795378644765,
        "initLen": 9,
        "attachedLane": 1,
        "distFromHex": 33.43399324485298,
        "width": 38.606249999999996,
        "widthWide": 48.854217278115854
      },
      {
        "settled": 1,
        "height": 8.875,
        "fallingLane": 5,
        "checked": 0,
        "angle": -360,
        "angularVelocity": 0,
        "targetAngle": -360,
        "color": "#3498db",
        "deleted": 0,
        "removed": 1,
        "tint": 0,
        "opacity": 1,
        "initializing": 0,
        "ict": 813.9325573022877,
        "iter": 1.2148642098019258,
        "initLen": 9,
        "attachedLane": 1,
        "distFromHex": 42.30899324485298,
        "width": 48.854217278115854,
        "widthWide": 59.10218455623171
      }
    ],
    [],
    [
      {
        "settled": 1,
        "height": 8.875,
        "fallingLane": 1,
        "checked": 0,
        "angle": -240,
        "angularVelocity": 0,
        "targetAngle": -240,
        "color": "#3498db",
        "deleted": 0,
        "removed": 1,
        "tint": 0,
        "opacity": 1,
        "initializing": 0,
        "ict": 650.9660386415446,
        "iter": 1.1986042178358425,
        "initLen": 9,
        "attachedLane": 3,
        "distFromHex": 33.43399324485298,
        "width": 38.606249999999996,
        "widthWide": 48.854217278115854
      }
    ],
    [
      {
        "settled": 1,
        "height": 8.875,
        "fallingLane": 2,
        "checked": 0,
        "angle": -180,
        "angularVelocity": 0,
        "targetAngle": -180,
        "color": "#3498db",
        "deleted": 0,
        "removed": 1,
        "tint": 0,
        "opacity": 1,
        "initializing": 0,
        "ict": 489.0195607824333,
        "iter": 1.1860312272437106,
        "initLen": 9,
        "attachedLane": 4,
        "distFromHex": 33.43399324485298,
        "width": 38.606249999999996,
        "widthWide": 48.854217278115854
      }
    ],
    [
      {
        "settled": 1,
        "height": 8.875,
        "fallingLane": 3,
        "checked": 0,
        "angle": -120,
        "angularVelocity": 0,
        "targetAngle": -120,
        "color": "#f1c40f",
        "deleted": 0,
        "removed": 1,
        "tint": 0,
        "opacity": 1,
        "initializing": 0,
        "ict": 976.8990759630307,
        "iter": 1.2347451104671117,
        "initLen": 9,
        "attachedLane": 5,
        "distFromHex": 33.43399324485298,
        "width": 38.606249999999996,
        "widthWide": 48.854217278115854
      }
    ]
  ],
  "angle": 3150,
  "targetAngle": 3150,
  "shakes": [],
  "sideLength": 38.606249999999996,
  "strokeColor": "blue",
  "x": 383.5,
  "y": 177.5,
  "ct": 1221.888875555028,
  "lastCombo": -240,
  "lastColorScored": "#000",
  "comboTime": 1,
  "texts": [],
  "lastRotate": 1551762042900,
  "delay": 0
}

var deletedHex = {
  "playThrough": 0,
  "fillColor": [
    44,
    62,
    80
  ],
  "tempColor": [
    44,
    62,
    80
  ],
  "angularVelocity": 0,
  "position": 2,
  "dy": 0,
  "dt": 1.0200408016320652,
  "sides": 6,
  "blocks": [
    [],
    [
      {
        "settled": 1,
        "height": 8.875,
        "fallingLane": 3,
        "checked": 0,
        "angle": -360,
        "angularVelocity": 0,
        "targetAngle": -360,
        "color": "#e74c3c",
        "deleted": 0,
        "removed": 1,
        "tint": 0,
        "opacity": 1,
        "initializing": 0,
        "ict": 163.02652106084244,
        "iter": 1.171795378644765,
        "initLen": 9,
        "attachedLane": 1,
        "distFromHex": 33.43399324485298,
        "width": 38.606249999999996,
        "widthWide": 48.854217278115854
      },
      {
        "settled": 1,
        "height": 8.875,
        "fallingLane": 5,
        "checked": 0,
        "angle": -360,
        "angularVelocity": 0,
        "targetAngle": -360,
        "color": "#3498db",
        "deleted": 0,
        "removed": 1,
        "tint": 0,
        "opacity": 1,
        "initializing": 0,
        "ict": 813.9325573022877,
        "iter": 1.2148642098019258,
        "initLen": 9,
        "attachedLane": 1,
        "distFromHex": 42.30899324485298,
        "width": 48.854217278115854,
        "widthWide": 59.10218455623171
      }
    ],
    [],
    [],
    [],
    [
      {
        "settled": 1,
        "height": 8.875,
        "fallingLane": 3,
        "checked": 0,
        "angle": -120,
        "angularVelocity": 0,
        "targetAngle": -120,
        "color": "#f1c40f",
        "deleted": 0,
        "removed": 1,
        "tint": 0,
        "opacity": 1,
        "initializing": 0,
        "ict": 976.8990759630307,
        "iter": 1.2347451104671117,
        "initLen": 9,
        "attachedLane": 5,
        "distFromHex": 33.43399324485298,
        "width": 38.606249999999996,
        "widthWide": 48.854217278115854
      }
    ]
  ],
  "angle": 3150,
  "targetAngle": 3150,
  "shakes": [],
  "sideLength": 38.606249999999996,
  "strokeColor": "blue",
  "x": 383.5,
  "y": 177.5,
  "ct": 1364.8745949838144,
  "lastCombo": 1341.893675747044,
  "lastColorScored": "#3498db",
  "comboTime": 1,
  "texts": [],
  "lastRotate": 1551762113922,
  "delay": 0,
  "comboMultiplier": 1
}

var side = 5;
var index = 0; 

// Consolidate Blocks is the main function
// Function calls work as such consolidateBlocks -> floodFill -> search 
test('Testing all of checking.js (All functions are dependent of each other', () =>{
	// call our consolidateBlocks function
	consolidateBlocks(nonMatchHex, side, index);

	// Based off the hex variable, no colors are matched
	// Make sure there is no change after calling the function above
	var count = 0; 
	
	// Make sure none of the blocks were deleted 
	for(var i = 0; i < nonMatchHex['blocks'].length; i++){
		for(var j = 0; j < nonMatchHex['blocks'][i].length; j++){
			// 0 indicates no delete
			if(nonMatchHex['blocks'][i][j]['deleted'] == 0){
				count++;
			}
		}
	}

	// Make sure no blocks were deleted after consolidateBlocks function call
	expect(count).toBe(6);

	// After the addition of the new block in the correct spot, we should have deleted blocks
	consolidateBlocks(deletedHex, 2, 0);

	// Reset count and make sure three blocks were deleted
	count = 0;
	// Make sure none of the blocks were deleted 
	for(var i = 0; i < deletedHex['blocks'].length; i++){
		for(var j = 0; j < deletedHex['blocks'][i].length; j++){
			// 0 indicates no delete
			if(deletedHex['blocks'][i][j]['deleted'] == 0){
				count++;
			}
		}
	}
	// Make sure deletions went through 
	expect(count).toBe(3);

});

test('Testing floodFill to see what deletions are returned', () => {
	// Make sure this isn't
	var toBeChecked = [];
	toBeChecked.push([side,index]);
	
	// Call to check that nothing has been deleted
	floodFill(nonMatchHex, side, index, toBeChecked);

	// Make sure nothing is getting deleted
	expect(toBeChecked.length).toBeLessThan(3);

});


test("Test checking of 2D and 1D array matching", () => {
	var a = [1, 2];
	var b =[
		[1,2],
		[1,2],
		[1,2],
		[1,2] 
	] 

	for(var i = 0; i < a.length; i++){
		var bool = search(b, a);
		expect(bool).toBe(true);
	}
	
});