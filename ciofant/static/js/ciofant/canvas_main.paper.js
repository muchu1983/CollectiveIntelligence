//Copyright (C) 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

$(document).ready(initCanvasMain);
var websocketBattle = null;
var path

//初始化 #canvas_main 畫布
function initCanvasMain() {
    connectToBattleChannel();
};

//建立 web socket 連線
function connectToBattleChannel(){
    var strWsBattleUrl = "ws://" + window.location.host + "/battle/field_1/?session_key=" + strSessionKey
    websocketBattle = new WebSocket(strWsBattleUrl);
    path = new Path.Rectangle({
        point: [75, 75],
        size: [75, 75],
        strokeColor: "black"
    });
    handleBattleChannelMessage();
};

//處理 battle channel 訊息
function handleBattleChannelMessage(){
    websocketBattle.onmessage = function(msgEvent) {
        console.log(JSON.parse(msgEvent.data))
        path.rotate(3);
    }
};

//送出訊息至 battle channel
function sendBattleChannelMessage() {
    websocketBattle.send(JSON.stringify({"msg":"hello battle field"}));
};

//paper.js 畫布更新
function onFrame(event) {
    console.log(event.count);
    if (websocketBattle != null && event.count%6==0) {
        websocketBattle.onopen = sendBattleChannelMessage;
        if (websocketBattle.readyState == WebSocket.OPEN) {
            websocketBattle.onopen();
        };
    };
}
