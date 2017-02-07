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
        $(".btnLeftOn").prop("disabled", false).removeClass("ui-state-disabled");
        $(".btnRightOn").prop("disabled", true).addClass("ui-state-disabled");
        strCurrentRepresentative = "right";
        $(".btnLeftOn").click(function(){
            //切換至左方
            $(".btnLeftOn").prop("disabled", true).addClass("ui-state-disabled");
            $(".btnRightOn").prop("disabled", false).removeClass("ui-state-disabled");
            strCurrentRepresentative = "left";
            console.log("switch representative to left");
        });
        $(".btnRightOn").click(function(){
            //切換至右方
            $(".btnLeftOn").prop("disabled", false).removeClass("ui-state-disabled");
            $(".btnRightOn").prop("disabled", true).addClass("ui-state-disabled");
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
                showSystemMessage("Aye aye! Welcome on board.");
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
    
    //顯示系統訊息
    function showSystemMessage(strMessage){
        console.log("sys msg: " + strMessage);
        $(".divSystemMessage").text(strMessage);
        $(".divSystemMessage").fadeIn("slow", function () {
            $(this).delay(9487).fadeOut("slow");
        });
    };
    
    //加入訊息至左邊或右邊
    function appendChatMessageTo(isToLeft, isToRight, strMessage){
        if (isToLeft == true){
            //文字 div 需加上 dir="ltr" 使文字方向由左至右
            $(".divLeftMessage").append("<div dir=\"ltr\">" + strMessage + "</div>");
            $(".divLeftMessage").animate({scrollTop: $(".divLeftMessage").prop("scrollHeight")}, 1000);
            //對面加入一個空白 div
            $(".divRightMessage").append("<div class=\"divEmptyMsg\"></div>");
            //動態設定空白 div 的高度為對面訊息方塊的高度
            $(".divRightMessage div").last().css("height", $(".divLeftMessage div").last().height());
            $(".divRightMessage").animate({scrollTop: $(".divRightMessage").prop("scrollHeight")}, 1000);
            //訊息過長時，移除最前面的訊息
            if ($(".divLeftMessage div").length > 100){
                $(".divLeftMessage div").first().remove();
            };
        };
        if (isToRight == true){
            //文字 div 需加上 dir="ltr" 使文字方向由左至右
            $(".divRightMessage").append("<div dir=\"ltr\">" + strMessage + "</div>");
            $(".divRightMessage").animate({scrollTop: $(".divRightMessage").prop("scrollHeight")}, 1000);
            //對面加入一個空白 div
            $(".divLeftMessage").append("<div class=\"divEmptyMsg\"></div>");
            //動態設定空白 div 的高度為對面訊息方塊的高度
            $(".divLeftMessage div").last().css("height", $(".divRightMessage div").last().height());
            $(".divLeftMessage").animate({scrollTop: $(".divLeftMessage").prop("scrollHeight")}, 1000);
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