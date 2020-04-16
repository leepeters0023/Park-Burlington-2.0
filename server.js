const express = require('express'); // this is a safer way rather than import because import is newer and not as widely adopted 
const path = require('path'); 
const app = express();
const port = process.env.PORT || 5000; 
require('dotenv').config()

app.use(express.static(path.join(__dirname, '/public'))); // sets up a static directory from which our files are served and prevents people seeing sensitive code 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
}) // * means 'any path' - __dirname joins our current directory to the following string 
app.get('/apikey', (req, res) => {
  res.send(process.env.API_KEY)
})
app.listen(port, () => {
  console.log('Listening on port:', port)
})


