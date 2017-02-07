//Copyright (C) 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initChat);
    var strRoom = "bennu-with-bella";
    var websocketChat = null;
    var strCurrentRepresentative = null;
    
    //初始化 chat 頁面
    function initChat() {
        initLeftAndRightSwitchBtn();
        connectToChatChannel(strRoom);
        initTextInputDiv();
        initKeyBindings();
    };
    
    //初始化左右方切換
    function initLeftAndRightSwitchBtn() {
        //預設為右方
        $(".btnLeftOn").prop("disabled", false);
        $(".btnRightOn").prop("disabled", true);
        strCurrentRepresentative = "right";
        $(".btnLeftOn").click(function(){
            //切換至左方
            $(".btnLeftOn").prop("disabled", true);
            $(".btnRightOn").prop("disabled", false);
            strCurrentRepresentative = "left";
            console.log("switch representative to left");
        });
        $(".btnRightOn").click(function(){
            //切換至右方
            $(".btnLeftOn").prop("disabled", false);
            $(".btnRightOn").prop("disabled", true);
            strCurrentRepresentative = "right";
            console.log("switch representative to right");
        });
    };
    
    //送出訊息至 chat channel
    function sendChatMessage(jsonMsg) {
        websocketChat.send(JSON.stringify(jsonMsg));
    };
    
    //連線至 chat websocket
    function connectToChatChannel(strRoom) {
        var strWsChatUrl = "ws://" + window.location.host + "/ws/chat/" + strRoom + "/?session_key=" + strSessionKey;
        websocketChat = new WebSocket(strWsChatUrl);
        //web socket 建立完成
        websocketChat.onopen = function(){
            //連線已邁立，送出 join 訊息
            sendChatMessage({"type":"sys", "msg":"join"});
        };
        //接收並處理 battle channel 訊息
        handleChatMessage();
    };
    
    //接收並處理 chat channel 訊息
    function handleChatMessage(){
        websocketChat.onmessage = function(eventMsg) {
            jsonMsg = JSON.parse(eventMsg.data);
            console.log(jsonMsg);
            if (jsonMsg["type"] == "sys" && jsonMsg["msg"] == "welcome") {
                //appendChatMessageTo(true, true, "Aye Aye");
            };
            if (jsonMsg["type"] == "chat") {
                //接收到左方訊息
                if (jsonMsg["representative"] == "left"){
                    appendChatMessageTo(true, false, jsonMsg["msg"]);
                };
                //接收到右方訊息
                if (jsonMsg["representative"] == "right"){
                    appendChatMessageTo(false, true, jsonMsg["msg"]);
                };
            };
        }
    };
    
    //加入訊息至左邊或右邊
    function appendChatMessageTo(isToLeft, isToRight, strMessage){
        if (isToLeft == true){
            $(".divLeftMessage").append("<div>" + strMessage + "</div>");
            $(".divLeftMessage").animate({scrollTop: $(".divLeftMessage").prop("scrollHeight")}, 500);
            //訊息過長時，移除最前面的訊息
            if ($(".divLeftMessage div").length > 100){
                $(".divLeftMessage div").first().remove();
            };
        };
        if (isToRight == true){
            $(".divRightMessage").append("<div>" + strMessage + "</div>");
            $(".divRightMessage").animate({scrollTop: $(".divRightMessage").prop("scrollHeight")}, 500);
            //訊息過長時，移除最前面的訊息
            if ($(".divRightMessage div").length > 100){
                $(".divRightMessage div").first().remove();
            };
        };
    };
    
    //始始化訊息傳送區塊
    function initTextInputDiv(){
        $(".btnSendText").click(function(){
            var strMsg = $(".textKeyIn").val();
            $(".textKeyIn").val(""); //清除輸入框
            sendChatMessage({"type":"chat", "msg":strMsg, "representative":strCurrentRepresentative});
        });
    };
    
    //初始化鍵盤綁定
    function initKeyBindings(){
        //輸入框綁定 Enter 鍵
        $(".textKeyIn").keyup(function(keyEvent){
            var code = keyEvent.which;
            if (code==13) {
                keyEvent.preventDefault();
                $(".btnSendText").click();
            };
        });
    };
    
})(jQuery);