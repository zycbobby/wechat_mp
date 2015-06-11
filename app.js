'use strict';
var config = require('./config/development');
var util = require('./util');
var heapdump = require('heapdump');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: config.elasticsearch.host,
    log: 'error'
});

var http = require('http'),
    wechat = require('node-wechat')(config.token);

http.createServer(function (req, res) {
    //检验 token
    wechat.checkSignature(req, res);
    //预处理
    wechat.handler(req, res);

    //监听文本信息
    wechat.text(function (data) {
        console.log(data.ToUserName);
        console.log(data.FromUserName);
        console.log(data.CreateTime);
        console.log(data.MsgType);

        client.search({
            index: config.elasticsearch.indexName,
            body: {
                "query": {
                    "function_score": {
                        "score_mode": "first",
                        "query": {
                            "match": {
                                "title": data.Content
                            }
                        },

                        "functions": [
                            {
                                "filter": {
                                    "exists": {
                                        "field": "updatedAt"
                                    }
                                },
                                "gauss": {
                                    "updatedAt": {
                                        "scale": "1d",
                                        "offset": "0.2d",
                                        "decay": 0.5
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }, function (error, response) {
            if (error) {
                return;
            }

            var articles = [];
            var hits = response.hits.hits;
            for (var i = 0; i < 5 && i < hits.length; i++) {
                var thing = hits[i]._source;
                var score = hits[i]._score;
                if (score > 5) {
                  articles.push({
                    Title: thing.title,
                    Description: thing.title,
                    PicUrl: (thing.info.images && thing.info.images.length > 0) ? thing.info.images[0].url : '',
                    Url: thing.source
                  });
                }
            }
            var msg = {
                FromUserName: data.ToUserName,
                ToUserName: data.FromUserName
            };

            if (articles.length > 0) {
                msg.Articles = articles;
            } else {
                msg.Content = "科里哥没找到...";
            }
            wechat.send(msg);
        });
    });

    //监听图片信息
    //wechat.image(function (data) { ... });

    //监听地址信息
    //wechat.location(function (data) { ... });

    //监听链接信息
    //wechat.link(function (data) { ... });

    //监听事件信息
    //wechat.event(function (data) { ... });

    //监听语音信息
    //wechat.voice(function (data) { ... });

    //监听视频信息
    //wechat.video(function (data) { ... });

    //监听所有信息
    //wechat.all(function (data) { ... });
}).listen(config.port);
