//Copyright (C) 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initChat);
    
    /* global variable ***************************************************************************/
    
    var strRoom = "to_bella";
    var websocketCore = null;
    var websocketChat = null;
    var strCurrentRepresentative = null;
    var strCurrentUID = null;
    
    /* initial function ***************************************************************************/
    
    //初始化 chat 頁面
    function initChat() {
        initLeftAndRightSwitchBtn();
        initTextInputDiv();
        initKeyBindings();
        connectToCoreWs();
        connectToChatWs(strRoom);
        clean();
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
    
    //始始化訊息傳送區塊
    function initTextInputDiv(){
        $(".btnSendText").click(function(){
            var strMsg = $(".textKeyIn").val();
            $(".textKeyIn").val(""); //清除輸入框
            sendWsMessage(websocketChat, {"ci_type":"ci_chat", "ci_msg":strMsg, "ci_representative":strCurrentRepresentative});
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
    
    /* clean function ***************************************************************************/
    
    function clean() {
        window.onunload = window.onbeforeunload = function(event) {
            //處理 core websocket 關閉之前
            handleBeforeCoreWsClose();
        };
    };
    
    /* utility function ***************************************************************************/
    
    //送出訊息至 websocket 
    function sendWsMessage(websocketTo, jsonMsg) {
        websocketTo.send(JSON.stringify(jsonMsg));
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
    
    /* core ws function ***************************************************************************/
    
    //連線至 core websocket
    function connectToCoreWs() {
        var strWsCoreUrl = "ws://" + window.location.host + "/ws/core/uidmanage/?session_key=" + strSessionKey;
        websocketCore = new WebSocket(strWsCoreUrl);
        //web socket 建立完成
        websocketCore.onopen = function(){
            //連線已邁立，送出 ci_create_uid 訊息
            sendWsMessage(websocketCore, {"ci_action":"ci_create_uid"});
        };
        //接收並處理 core websocket 訊息
        handleCoreWsMessage();
    };
    
    //接收並處理 core websocket 訊息
    function handleCoreWsMessage(){
        websocketCore.onmessage = function(eventMsg) {
            jsonMsg = JSON.parse(eventMsg.data);
            console.log(jsonMsg);
            strCurrentUID = jsonMsg["ci_uid"];
            console.log("current UID: " + strCurrentUID);
        };
    };
    
    //處理 core websocket 關閉之前
    function handleBeforeCoreWsClose(){
        //連線將關閉，送出 ci_delete_uid 訊息
        sendWsMessage(websocketCore, {"ci_action":"ci_delete_uid", "ci_target_uid":strCurrentUID});
        console.log("delete current UID: " + strCurrentUID);
    };
    
    /* chat ws function ***************************************************************************/
    
    //連線至 chat websocket
    function connectToChatWs(strRoom) {
        var strWsChatUrl = "ws://" + window.location.host + "/ws/chat/" + strRoom + "/?session_key=" + strSessionKey;
        websocketChat = new WebSocket(strWsChatUrl);
        //web socket 建立完成
        websocketChat.onopen = function(){
            //連線已邁立，送出 join 訊息
            sendWsMessage(websocketChat, {"ci_type":"ci_sys", "ci_msg":"ci_join"});
        };
        //接收並處理 chat websocket 訊息
        handleChatWsMessage();
    };
    
    //接收並處理 chat websocket 訊息
    function handleChatWsMessage(){
        websocketChat.onmessage = function(eventMsg) {
            jsonMsg = JSON.parse(eventMsg.data);
            console.log(jsonMsg);
            if (jsonMsg["ci_type"] == "ci_sys" && jsonMsg["ci_msg"] == "ci_welcome") {
                showSystemMessage("Aye aye! Welcome on board.");
            };
            if (jsonMsg["ci_type"] == "ci_chat") {
                //接收到左方訊息
                if (jsonMsg["ci_representative"] == "left"){
                    appendChatMessageTo(true, false, jsonMsg["ci_msg"]);
                };
                //接收到右方訊息
                if (jsonMsg["ci_representative"] == "right"){
                    appendChatMessageTo(false, true, jsonMsg["ci_msg"]);
                };
            };
        }
    };
    
    /****************************************************************************/
    
})(jQuery);