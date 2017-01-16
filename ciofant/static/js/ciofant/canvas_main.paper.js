//Copyright (C) 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

$(document).ready(initCanvasMain);
var websocketBattle = null;
var path;

//初始化 #canvas_main 畫布
function initCanvasMain() {
    connectToBattleChannel();
};

//建立 web socket 連線
function connectToBattleChannel(){
    var strWsBattleUrl = "ws://" + window.location.host + "/battle/field_1/?session_key=" + strSessionKey;
    websocketBattle = new WebSocket(strWsBattleUrl);
    //web socket 建立完成
    websocketBattle.onopen = function(){
        //要求同步戰場狀況
        sendBattleMessage({"msg":"sync"});
    };
    //接收並處理 battle channel 訊息
    handleBattleMessage();
    
    
    path = new Path.Rectangle({
        point: [75, 75],
        size: [75, 75],
        strokeColor: "black"
    });
};

//接收並處理 battle channel 訊息
function handleBattleMessage(){
    websocketBattle.onmessage = function(eventMsg) {
        jsonMsg = JSON.parse(eventMsg.data)
        console.log(jsonMsg);
        path.rotate(3);
    }
};

//送出訊息至 battle channel
function sendBattleMessage(jsonMsg) {
    websocketBattle.send(JSON.stringify(jsonMsg));
};

//paper.js 滑鼠點擊
function onMouseDown(event) {
    if (websocketBattle != null && websocketBattle.readyState == WebSocket.OPEN) {
        sendBattleMessage({"msg":"hello"});
    };
}

//paper.js 畫布更新 (60fps)
function onFrame(event){
    if (websocketBattle != null && websocketBattle.readyState == WebSocket.OPEN && event.count % 600 == 0) {
        //每 10 秒同步一次戰場狀況
        sendBattleMessage({"msg":"sync"});
    };
}
