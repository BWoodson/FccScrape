require('./config/config');

const request = require('request');
const cheerio = require('cheerio');
const express = require('express');

const app = express();
const port = process.env.PORT;

app.get('/scrape/:id', (req, res) => {
  var id = req.params.id;

  if(!id) {
    return res.status(404).send();
  } else {
    var url = 'https://www.freecodecamp.com/' + id;

    var fccPoints,
      lastProject,
      lastProjectDate,
      lastAlgorithm,
      lastAlgorithmDate,
      lastChallenge,
      lastChallengeDate;
    
    var json = {
      id,
      fccPoints : 0,
      lastProject : "",
      lastProjectDate : "",
      lastAlgorithm : "",
      lastAlgorithmDate : "",
      lastChallenge : "",
      lastChallengeDate : ""
    };
    
    request(url, function(err, resp, html) {
      if (!err && resp.statusCode === 200){
        $ = cheerio.load(html);

        // User doesn't exist
        if($('h1.text-center').text() !== id) {
          return res.status(404).send();
        }

        json.fccPoints = $('h1.flat-top.text-primary').text().replace(/[^0-9]/g, '');
        
        json.lastProject = $('tbody').eq(0).find('tr').last().children().first().text();
        json.lastProjectDate = $('tbody').eq(0).find('tr').last().children().eq(1).text();
        
        json.lastAlgorithm = $('tbody').eq(1).find('tr').last().children().first().text();
        json.lastAlgorithmDate = $('tbody').eq(1).find('tr').last().children().eq(1).text();
        
        json.lastChallenge = $('tbody').eq(2).find('tr').last().children().first().text();
        json.lastChallengeDate = $('tbody').eq(2).find('tr').last().children().eq(1).text();
        
        return res.send(json);
      } else {
        console.log(err, resp.statusCode);
        return res.status(resp.statusCode).send();
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
