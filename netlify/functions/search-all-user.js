require('dotenv').config();
const io = require('../io');

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
  if (event.httpMethod !== "POST") {
    return io.sendResponse({ statusCode: 405, body: { message: 'Method Not Allowed' } });
  }

  const requestBody = io.bodyParser(event);
  const usernameToSearch = requestBody.username;
  // Search for the username
	const { data: usersFound, error } = await supabase
		.from('UserEntry')
 		.select('username, highScores')
    .eq('username', usernameToSearch)
    .limit(10);

  if (error) {
    return io.sendResponse({ statusCode: 500, body: { message: 'Something wrong happened' } });
  }

  const orderFunction = ([aScore, aTime],[bScore, bTime]) => {
    aScore = parseInt(aScore, 10);
    bScore = parseInt(bScore, 10);
    if (aScore < bScore) {
      return 1;
    } else if (aScore > bScore) {
      return -1;
    } else {
      return (aTime < bTime) ? 1: (aTime > bTime) ? -1 : 0;
    }
  }
  
  return io.sendResponse({
    statusCode: 200,
    body: { data: usersFound },
  })
}