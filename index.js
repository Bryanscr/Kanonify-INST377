const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');
const { isValidStateAbbreviation } = require('usa-state-validator');
const dotenv = require('dotenv');

const app = express();
const port = 3000;
dotenv.config();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
  res.sendFile('public/Customers.html', { root: __dirname });
});

app.get('/customers', async (req, res) => {
  console.log('Attempting to GET all customers');

  const { data, error } = await supabase.from('customer').select();

  if (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
    return;
  } else {
    res.send(data);
  }
});

app.post('/customer', async (req, res) => {
  console.log('Adding customer');
  console.log('Request:', req.body);

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const state = req.body.state;

  if (!isValidStateAbbreviation(state)) {
    console.error(`State: ${state} is Invalid`);
    res.statusCode = 400;
    const errorJSON = {
      message: `${state} is ano a valid 2 Letter state abbreviaton`,
    };
    res.header('Content-type', 'application/json');
    res.send(JSON.stringify(errorJSON));
    return;
  }

  const { data, error } = await supabase
    .from('customer')
    .insert({
      customer_first_name: firstName,
      customer_last_name: lastName,
      customer_state: state,
    })
    .select();

  if (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
    return;
  } else {
    res.send(data);
  }
  res.send(req.body);
});

app.listen(port, () => {
  console.log('App is available on port:', port);
});
