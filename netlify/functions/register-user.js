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
  const userEntry = {
    username: '',
    highscores: [],
  };
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return io.sendResponse({ statusCode: 405, body: { message: 'Method Not Allowed' } });
  }

  const requestBody = io.bodyParser(event);
  const usernameToAdd = requestBody.username;

  // Insert a user
	const { data: usersFound, error } = await supabase
		.from('UserEntry')
 		.select('username, highScores, usernameKey')
    .eq('username', usernameToAdd)
    .limit(1);;
  
  if (error) {
    return io.sendResponse({ statusCode: 500, body: { message: 'Something wrong happened' } });
  }

  if (usersFound && usersFound.length) {
    const userFound = usersFound.shift();
    const creationAttemptsString = userFound.usernameKey.split('#').pop();
    const creationAttempts = parseInt(creationAttemptsString, 10);
    const usernameKey = `${userFound.username}#${creationAttempts + 1}`;

    const { error } = await supabase
      .from('UserEntry')
      .update({ usernameKey })
      .match({ username: userFound.username });
    
    if (error) {
      return io.sendResponse({ statusCode: 500, body: { message: 'Something wrong happened' } });
    }

    userEntry.username = userFound.username;
    userEntry.highscores = Object.entries(userFound.highScores).sort(helpers.orderScoreFunction);;
    

  } else {

    const usernameKey = `${usernameToAdd}#1`
    const { data: [userCreated], error } = await supabase
      .from('UserEntry')
      .insert([
        { username: usernameToAdd, usernameKey, highScores: {} }
      ])
      .select('username');
    if (error) {
      return io.sendResponse({ statusCode: 500, body: { message: 'Something wrong happened' } });
    }

    userEntry.username = userCreated.username;
    userEntry.highscores = [];
  }

  return io.sendResponse({
    statusCode: 200,
    body: { data: userEntry },
  })
  
}