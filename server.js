const express = require('express'); // this is a safer way rather than import because import is newer and not as widely adopted 
const path = require('path'); 
const app = express();
const port = process.env.PORT || 5000; 
const fetch = require('isomorphic-unfetch')
require('dotenv').config()
// .env means 'from whatever location we're running inside of, look for a variable named PORT, it's called an environment variable 

app.use(express.static(path.join(__dirname, '/public'))); // sets up a static directory from which our files are served and prevents people seeing sensitive code like login credentials or cc numbers, should always set up a static directory 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
}) // * means 'any path' - __dirname joins our current directory to the following string 

// make callback asyc get rid of promise chaining set fetch awaited and set to a variable 
// we'll then send the result of that fetch 
// res.send returns 
async getDatMap app.get('/mapApi', (req, res) => {
  fetch(`https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}&libraries=places&callback=initMap`)
  .then((dataIn) => {
    return dataIn.toString()
  }).then((jsonData) => {
    res.send(jsonData)
    console.log(jsonData)
  })
})

app.listen(port, () => {
  console.log('Listening on port:', port)
})
// request needs to be made here 
// send fetch to API site

