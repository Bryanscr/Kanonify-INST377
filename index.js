const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');
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
  res.sendFile('public/homepage.html', { root: __dirname });
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/public/aboutpage.html", { root: __dirname });
});

app.get("/search", (req, res) => {
  res.sendFile(__dirname + "/public/searchpage.html", { root: __dirname });
});

app.get("/lists", (req, res) => {
  res.sendFile(__dirname + "/public/listspage.html", { root: __dirname });
});

app.get('/reviews', async (req, res) => {
  const { data, error } = await supabase.from('reviews')
  .select("*")
  .order("created_at", {ascending: false})
  .limit(5);

  if (error) {
    console.error(error);
    res.status(500).json({message: "Failed to fetch reviews"});
    return;
  }
  res.json(data);
});

app.post('/reviews', async (req, res) => {
  console.log("Incoming review:", req.body);

  const { title, media_type, rating, review_text, poster_url } = req.body;

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      title,
      media_type,
      rating,
      review_text,
      poster_url
    })
    .select();

  if (error) {
    console.error("🔥 SUPABASE FETCH ERROR:", error);
    return res.status(500).json({
      message: "Failed to save review",
      error: error.message,
    });
  }

  res.json(data);
});

module.exports = app;


