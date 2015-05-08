'use strict';
var url = require('url');
var https = require('https');
var Q = require('q');

module.exports = {
    getAccessToken: function (appId, appSecret) {
        var defer = Q.defer();
        var options = url.parse('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+ appId + '&secret=' + appSecret);
        var req = https.request(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (accessToken) {
                defer.resolve(accessToken);
            });
        });
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
            defer.reject(e);
        });
        req.end();

        return defer.promise;
    }
};
