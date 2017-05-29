const request = require('request');
const cheerio = require('cheerio');

request('https://www.freecodecamp.com/bwoodson', function(err, resp, html) {
  if (!err){
    $ = cheerio.load(html);

    var fccPoints = $('h1.flat-top.text-primary').text().replace(/[^0-9]/g, '');
    console.log('Items finished:' + fccPoints);

    var lastProject = $('tbody').eq(0).find('tr').last().children().first().text();
    var lastProjectDate = $('tbody').eq(0).find('tr').last().children().eq(1).text();
    console.log('Last Project: ' + lastProject + ' - ' + lastProjectDate);

    var lastAlgorithm = $('tbody').eq(1).find('tr').last().children().first().text();
    var lastAlgorithmDate = $('tbody').eq(1).find('tr').last().children().eq(1).text();
    console.log('Last Algirithm: ' + lastAlgorithm + ' - ' + lastAlgorithmDate);

    var lastChallenge = $('tbody').eq(2).find('tr').last().children().first().text();
    var lastChallengeDate = $('tbody').eq(2).find('tr').last().children().eq(1).text();
    console.log('Last Challenge: ' + lastChallenge + ' - ' + lastChallengeDate);
  } else {
    console.log(err);
  }
});