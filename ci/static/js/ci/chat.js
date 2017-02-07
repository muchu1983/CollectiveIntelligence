//Copyright (C) 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initChat);
    var strRoom = "bennu-with-bella";
    var websocketChat = null;
    
    //初始化 chat 頁面
    function initChat() {
        initLeftAndRightSwitchBtn();
        connectToChatChannel(strRoom);
        $(".btnSendText").click(function(){
            console.log("click");
            sendChatMessage({"msg":"join"});
        });
    };
    
    //設定 左右切換
    function initLeftAndRightSwitchBtn() {
        $(".btnLeftOn").prop("disabled", false);
        $(".btnRightOn").prop("disabled", true);
        $(".btnLeftOn").click(function(){
            $(".btnLeftOn").prop("disabled", true);
            $(".btnRightOn").prop("disabled", false);
        });
        $(".btnRightOn").click(function(){
            $(".btnLeftOn").prop("disabled", false);
            $(".btnRightOn").prop("disabled", true);
        });
    };
    
    //送出訊息至 chat channel
    function sendChatMessage(jsonMsg) {
        console.log(jsonMsg);
        websocketChat.send(JSON.stringify(jsonMsg));
    };
    
    //連線至 chat websocket
    function connectToChatChannel(strRoom) {
        var strWsChatUrl = "ws://" + window.location.host + "/ws/chat/" + strRoom + "/?session_key=" + strSessionKey;
        websocketChat = new WebSocket(strWsChatUrl);
        //web socket 建立完成
        websocketChat.onopen = function(){
            //連線已邁立，送出 join 訊息
            sendChatMessage({"msg":"join"});
        };
        //接收並處理 battle channel 訊息
        handleChatMessage();
    };
    
    //接收並處理 chat channel 訊息
    function handleChatMessage(){
        websocketChat.onmessage = function(eventMsg) {
            jsonMsg = JSON.parse(eventMsg.data)
            console.log(jsonMsg);
            if (jsonMsg["msg"] == "welcome") {
                appendChatMessageTo(true, true, "Aye Aye");
            };
    };
    
    //加入訊息至左邊或右邊
    function appendChatMessageTo(isToLeft, isToRight, strMessage){
        if (isToLeft == true){
            $(".divLeftMessage").append("<span>" + strMessage + "</span>");
            $(".divLeftMessage").animate({scrollTop: $("divLeftMessage").prop("scrollHeight")}, 1000);
        };
        if (isToRight == true){
            $(".divRightMessage").append("<span>" + strMessage + "</span>");
            $(".divRightMessage").animate({scrollTop: $("divRightMessage").prop("scrollHeight")}, 1000);
        };
    };
};
    
})(jQuery);