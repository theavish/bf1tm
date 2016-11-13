var request = require('request-promise-native');
var Jimp = require('jimp');
var mkpath = require('mkpath');
var path = require('path');

var helpers = {
    handleRequestTag: handleRequestTag,
    handleRequestStats: handleRequestStats
};

module.exports = helpers;

function handleRequestTag(req, res) {
    var username = req.query.username;
    var platform = req.query.platform;
    var tagType = req.query['tag-type'];


    requestStats(username, platform).then(function(stats) {
        requestTag(stats, tagType, username).then(function(b) {
            res.sendFile(path.resolve(`${__dirname}/../tag-images/output/${username}/type${tagType}.png`));
        });

    });
}

function handleRequestStats(req, res) {
    var username = req.query.username;
    var platform = req.query.platform;

    requestStats(username, platform).then(function(stats) {
        res.send(stats);
    });
}

function requestTag(stats, tagType, username) {
    var tagImagesPath = `${__dirname}/../tag-images`;
    var tagTemplate = `${tagImagesPath}/type${tagType}.png`;
    var outputPath = `${tagImagesPath}/output/${username}`;
    var outputImage = `${outputPath}/type${tagType}.png`;

    makePath(outputPath);

    return Jimp.read(tagTemplate).then(function(image) {
        return Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then(function(font) {
            image
            .print(font, 0, 0, 'hello world')
            .write(outputImage, function(err) {
                if (err) { console.log('ERROR IN JIMP WRITE FUNCTION INSIDE REQUESTTAG FUNCTION:', err) }
            });
        });
    }).catch(function(err) {
        console.log('ERROR IN JIMP READ FUNCTION INSIDE REQUESTTAG FUNCTION:', err)
    });
}

function requestStats(username, platform) {
    var url = `https://battlefieldtracker.com/bf1/api/Stats/BasicStats?platform=${platform}&displayName=${username}`;
    var json = {};
    var opts = {
        uri: url,
        headers: {'TRN-Api-Key': process.env.API_KEY},
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
        console.log('ERROR IN REQUEST INSIDE REQUESTSTATS FUNCTION:', err);
        return err;
    });
}

function makePath(path) {
    mkpath.sync(path, function(err) {
        if (err) {
            console.log('ERROR IN MAKEPATH FUNCTION:', err)
        }
    });
};