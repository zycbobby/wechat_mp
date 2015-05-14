'use strict';
var config = require('./config/development');
var util = require('./util');

var promise = util.getAccessToken(config.appId, config.appSecret);
promise.then(function(accessToken){
    console.log(accessToken);
    // the program can start now
}).then(undefined, function() {
    console.log('fail');
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
        var msg = {
            FromUserName : data.ToUserName,
            ToUserName : data.FromUserName,
            //MsgType : "text",
            Content : "这是文本回复"
            //FuncFlag : 0
        }
        //回复信息
        wechat.send(msg);
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