//Copyright (C) 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

/* websocket utility function */

//連線至 websocket
function connectToWs(strWsUrl, jsonOnopenMsg) {
    var websocketTo = new WebSocket(strWsUrl);
    //web socket 建立完成
    websocketTo.onopen = function(){
        //連線已邁立，送出首發訊息
        sendWsMessage(websocketTo, jsonOnopenMsg);
    };
    return websocketTo;
};

//送出訊息至 websocket 
function sendWsMessage(websocketTo, jsonMsg) {
    websocketTo.send(JSON.stringify(jsonMsg));
};

//接收並處理 websocket 訊息
function handleWsMessage(websocketFrom, funcJsonMsgHandler){
    websocketFrom.onmessage = function(eventMsg) {
        jsonMsg = JSON.parse(eventMsg.data);
        console.log("receive json:");
        console.log(jsonMsg);
        funcJsonMsgHandler(jsonMsg);
    };
};

//建構 標準的 websocket 訊息
function buildWsJsonMessage(strMsg){
    jsonMsg = {
        "strVisitorCIUserUID": strVisitorCIUserUID,
        "strMsg": strMsg
    };
    return jsonMsg;
};

