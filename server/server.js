require('./config/config');

const request = require('request');
const cheerio = require('cheerio');
const express = require('express');

const app = express();
const port = process.env.PORT;

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');

app.get('/scrape/:id', (req, res) => {
  var id = req.params.id;

  if(!id) {
    // No user sent
    return res.status(400).send();
  } else {
    // Search db for user
    User.findOne({
      profile: id
    }).then((user) => {
      // Check if user was found
      if(user) {
        // console.log(`User ${id} found in db.`);
        return res.send(user);
      } else {
        // User wasn't found in db, see if we can scrap the user from FCC
        // console.log(`User ${id} not found. Trying FCC.`);
        var url = 'https://www.freecodecamp.com/' + id;

        var fccPoints,
          lastProject,
          lastProjectDate,
          lastAlgorithm,
          lastAlgorithmDate,
          lastChallenge,
          lastChallengeDate,
          profileImageUrl;
        
        var json = {
          id,
          fccPoints : 0,
          lastProject : "",
          lastProjectDate : "",
          lastAlgorithm : "",
          lastAlgorithmDate : "",
          lastChallenge : "",
          lastChallengeDate : "",
          profileImageUrl : ""
        };
        
        request(url, function(err, resp, html) {
          if (!err && resp.statusCode === 200){
            $ = cheerio.load(html);

            // If user doesn't exist send 404
            if($('h1.text-center').text() !== id) {
              return res.status(404).send();
            }

            // Else, scrape that glorious data
            json.fccPoints = $('h1.flat-top.text-primary').text().replace(/[^0-9]/g, '');
            
            json.lastProject = $('tbody').eq(0).find('tr').last().children().first().text();
            json.lastProjectDate = $('tbody').eq(0).find('tr').last().children().eq(1).text();
            
            json.lastAlgorithm = $('tbody').eq(1).find('tr').last().children().first().text();
            json.lastAlgorithmDate = $('tbody').eq(1).find('tr').last().children().eq(1).text();
            
            json.lastChallenge = $('tbody').eq(2).find('tr').last().children().first().text();
            json.lastChallengeDate = $('tbody').eq(2).find('tr').last().children().eq(1).text();

            json.profileImageUrl = $(".public-profile-img").attr("src");

            // Save user the user to the db
            var user = new User({
              profile: id,
              fccPoints: json.fccPoints,
              profileImage: json.profileImageUrl,
              lastProject: { name: json.lastProject, date: json.lastProjectDate },
              lastAlgorithm: { name: json.lastAlgorithm, date: json.lastAlgorithmDate },
              lastChallenge: { name: json.lastChallenge, date: json.lastChallengeDate },
            });

            // If user was successfully saved, send data. Else, send 500
            user.save().then((doc) => {
              // console.log(doc);
              return res.send(doc);
            }, (e) => {
              // console.log(e);
              return res.status(500).send();
            });
          } else {
            // console.log(err, resp.statusCode);
            return res.status(resp.statusCode).send();
          }
        });
      }
    }, (e) => {
      // Error Searching the db, send a 500
      return res.status(500).send();
    });
  }
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
