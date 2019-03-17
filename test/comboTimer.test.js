
/*
* File name: comboTimer.test.js
* Description: Test calcSide for the main function drawTimer calculation
*/


// Get two functions to be tested from comboTimer file
const {calcSide, drawSide, drawTimer} = require('../js/comboTimer.js');

// Example hexagon pattern
var exHex = {
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
		  "width": 38.606249999999996,
		  "widthWide": 48.854217278115854
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
  };

  ctx = {
	"fillStyle": "#ecf0f1",
	"filter": "none",
	"font": "10px sans-serif",
	"globalAlpha": 1,
	"globalCompositeOperation": "source-over",
	"imageSmoothingEnabled": true,
	"imageSmoothingQuality": "low",
	"lineCap": "round",
	"lineDashOffset": 0,
	"lineJoin": "miter",
	"lineWidth": 3.609999895095825,
	"miterLimit": 10,
	"shadowBlur": 0,
	"shadowColor": "rgba(0, 0, 0, 0)",
	"shadowOffsetX": 0,
	"shadowOffsetY": 0,
	"strokeStyle": "rgba(0, 0, 0, 0)",	
	"textAlign": "start",
	"textBaseline": "alphabetic"
  };


//All variables in calcSide mostly valuated by drawTimer
var done = (exHex.ct - exHex.lastCombo);
var startVertex = 0;
var endVertex =  1;
var fraction = 1-((done*6)/1)%(1);
var offset = 1;

var radius = 245.25625774196396;
var halfRadius = 122.62812887098198;
var triHeight = 212.3981496416447;
//Example of Vertexes
var Vertexes = [
	[122.62812887098198, 212.3981496416447],
	[0, 212.3981496416447],
	[-122.62812887098198, 212.3981496416447],
	[-183.94219330647297, 106.19907482082235],
	[-245.25625774196396, 0],
	[-183.94219330647297, -106.19907482082235],
	[-122.62812887098198, -212.3981496416447],
	[0, -212.3981496416447],
	[122.62812887098198, -212.3981496416447],
	[183.94219330647297, -106.19907482082235],
	[245.25625774196396, 0],
	[183.94219330647297, 106.19907482082235]
]

var checkstartX = 123.62812887098198;
var checkstartY = 213.3981496416447;
var checkendX = 1;
var checkendY = 213.3981496416447;

test('Testing all of comboTimer.js (calcSide function are being used by drawTimer (main) ', () =>{
	// call our calcSide function
	calcSide(startVertex, endVertex, fraction, offset);

	//Check every variable of X and Y that are going to be returned
	expect(startX).toBe(checkstartX);
	expect(startY).toBe(checkstartY);
	expect(endX).toBe(checkendX);
	expect(endY).toBe(checkendY);

});
test('Testing drawSide function', () => {
	// call drawSide()
	drawSide(Vertexes);

	gameState = 1;
	//check for correct settings
	expect(ctx.lineWidth).toBe(4*settings.scale);
	if (gameState == 0){
		expect(ctx.strokeStyle).toBe(hexColorsToTintedColors[MainHex.lastColorScored]);
	}
	else{
		expect(ctx.strokeStyle).toBe(MainHex.lastColorScored);
	}

});
