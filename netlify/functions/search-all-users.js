require('dotenv').config();
const io = require('../io');
const helpers = require('../helpers');

const {
	SUPABASE_URL,
	SUPABASE_SERVICE_API_KEY
} = process.env;

// Connect to our database 
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_API_KEY);

// Our standard serverless handler function
exports.handler = async event => {

  // Only allow POST
  if (event.httpMethod !== "GET") {
    return io.sendResponse({ statusCode: 405, body: { message: 'Method Not Allowed' } });
  }

  // Search for the username
	const { data: usersFound, error } = await supabase
		.from('UserEntry')
 		.select('username, highScores')
    .limit(1000);

  if (error) {
    return io.sendResponse({ statusCode: 500, body: { message: 'Something wrong happened' } });
  }
  const usersAndScores = usersFound.map( (user) => {
    const highscoresSorted = Object.entries(user.highScores).sort(helpers.orderScoreFunction);
    const highestScore = highscoresSorted?.shift() ?? [0 , 0];
    
    return { ...user, highScores: Object.entries(user.highScores), highestScore };
  });

  const finalSort = ({ highestScore: [aScore, aTime] },{ highestScore: [bScore, bTime] }) => {
    aScore = parseInt(aScore, 10);
    bScore = parseInt(bScore, 10);
    if (aScore < bScore) {
      return 1;
    } else if (aScore > bScore) {
      return -1;
    } else {
      aTime = parseInt(aTime, 10);
      bTime = parseInt(bTime, 10);
      return (aTime < bTime) ? -1: (aTime > bTime) ? 1 : 0;
    }
  }
  const highestUserScores = usersAndScores.sort(finalSort);

  return io.sendResponse({
    statusCode: 200,
    body: { data: highestUserScores.slice(0, 10) },
  })
}