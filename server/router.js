var router = require('express').Router();
var jsonparser = require('body-parser').json();
var request = require('request-promise-native');

var apiKey = {'TRN-Api-Key': process.env.API_KEY};

router.get('/test', (req, res) => { res.send('success'); });
router.get('/request-tag', jsonparser, handleRequestTag);

module.exports = router;

function handleRequestTag(req, res) {
    var username = req.query.username;
    var platform = req.query.platform;
    requestStats(username, platform).then(function(d) {
        res.send(d)
    });
}

function requestStats(username, platform) {
    var url = `https://battlefieldtracker.com/bf1/api/Stats/BasicStats?platform=${platform}&displayName=${username}`;
    var json = {};
    var opts = {
        uri: url,
        headers: apiKey,
        json: true
    };

    return request(opts).then(function(body) {
        json.name = username;
        json.rank = body.result.rank.number;
        json.spm = body.result.spm;
        json.kdr = Number.parseFloat((body.result.kills / body.result.deaths).toFixed(2));
        json.timePlayed = body.result.timePlayed;
        json.totalKills = body.result.kills;
        json.winPercent = Number.parseFloat(((body.result.wins / (body.result.wins + body.result.losses)) * 100).toFixed(2));
        json.totalWins = body.result.wins;

        json.dogtags = null;
        json.scoutScore = null;
        json.longestHeadshot = null;

        return json;
        
    }).catch(function(err) {
        console.log('***error', err);
        res.send(err);
    });

    // request({
    //     method: 'GET',
    //     url: url,
    //     headers: apiKey
    // }).then(function(error, response, body) {
    //     console.log('asdf')
    //     var result = JSON.parse(body).result;

    //     json.name = username;
    //     json.rank = result.rank.number;
    //     json.spm = result.spm;
    //     json.kdr = Number.parseFloat((result.kills / result.deaths).toFixed(2));
    //     json.timePlayed = result.timePlayed;
    //     json.totalKills = result.kills;
    //     json.winPercent = Number.parseFloat(((result.wins / (result.wins + result.losses)) * 100).toFixed(2));
    //     json.totalWins = result.wins;

    //     json.dogtags = null;
    //     json.scoutScore = null;
    //     json.longestHeadshot = null;

    //     return json;
    // });
}
