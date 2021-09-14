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

  // Insert a row
	const { data, error } = await supabase
		.from('UserEntry')
 		.insert([
 			{ username: 'hello', usernameKey: 'hello#identifier' },
		]);

  // Did it work?
  console.log(data, error);
  
}