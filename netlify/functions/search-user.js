require('dotenv').config();
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
    return { statusCode: 405, data: { message: 'Method Not Allowed' } };
  }

  const requestBody = JSON.parse(event.body);
  const usernameToSearch = requestBody.username;
  // Search for the username
	const { data, error } = await supabase
		.from('UserEntry')
 		.select('username')
     .eq('username', usernameToSearch);

  // Did it work?
  console.log(data, error);

  if (error) {
    return { statusCode: 500, data: { message: 'Something wrong happened' } };
  }

  return {
    statusCode: 200,
    data: data,
  }
}