/* 
* File name: math.test.js
* Description: Tests math functions used to calculate hexagon movements
*/

// Get two functions to be tested from math file
const {rotatePoint, randInt} = require('../js/math.js')

test('Testing a random integer btwn 1 - 10', () => {
	// Create 20 random numbers and make sure they are all within the range
	var values = new Array(20), min = 1, max = 10;

	for(var i = 0; i < values.length; i++){
		values[i] = randInt(min, max);
		expect(values[i]).toBeGreaterThanOrEqual(min);
		expect(values[i]).toBeLessThanOrEqual(max);
	}
});


test('Testing roation over 100, 100 over a 30 degree angle', () => {
	var x, y, angle, checkX, checkY, results;
	x = 100;
	y = 100;
	angle = 30;

	// do expected math
	checkX = Math.cos(((30 * (Math.PI / 180)))) * x - Math.sin(((30 * (Math.PI / 180)))) * y;
	checkY = Math.sin(((30 * (Math.PI / 180)))) * x + Math.cos(((30 * (Math.PI / 180)))) * y;

	results = rotatePoint(x, y, angle);

	// Check for correctness
	expect(checkX).toBe(results['x']);
	expect(checkY).toBe(results['y']);

;});