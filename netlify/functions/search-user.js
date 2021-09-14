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
	const { data: [userFound], error } = await supabase
		.from('UserEntry')
 		.select('username, highScores')
    .eq('username', usernameToSearch)
    .limit(1);

  if (error) {
    return io.sendResponse({ statusCode: 500, body: { message: 'Something wrong happened' } });
  }

  const userEntry = {
    username: userFound.username,
    highscores: Object.entries(userFound.highScores),
  };
  
  return io.sendResponse({
    statusCode: 200,
    body: { data: userEntry },
  })
}