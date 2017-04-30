//Copyright (C) 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initChannel);
    
    /* global variable */
    var wsChannel = null;
    
    /* initial function */
    
    //初始化 頻道 頁面
    function initChannel() {
        initConnectToWebsocket();
        initHandleWsMessage();
        initBtnSendChatMsg();
        initKeyBindings();
    };
    
    //初始化 websocket
    function initConnectToWebsocket() {
        var strWsUrl = "ws://" + window.location.host + "/ws/chat/channel/" + strHostCIUserUID + "/?session_key=" + strSessionKey;
        /* 連線至 websocket */
        wsChannel = connectToWs(strWsUrl);
    };
    
    //初始化 websocket 訊息處理
    function initHandleWsMessage() {
        handleWsMessage(wsChannel, function(jsonMsg){
            //角色
            if (jsonMsg["strRole"] == "role:sys"){
                
            }
            //對齊方向
            if (jsonMsg["strAlign"] == "align:center"){
                
            }
            //加入訊息至聊天內容 #ulChatMessage
            $("#ulChatMessage").append(buildMessageLiTag(jsonMsg["strMsg"], null, null));
            //訊息過長時，移除最前面的訊息
            if ($("#ulChatMessage li").length > 100){
                $("#ulChatMessage li").first().remove();
            };
            //捲動至最下層
            $("#ulChatMessage").animate({scrollTop: $("#ulChatMessage").prop("scrollHeight")}, 500);
        });
    };
    
    //初始化 傳送訊息按鈕
    function initBtnSendChatMsg(){
        $("#btnSendChatMsg").click(function(){
            var strChatMsg = $("#inputChatMsg").val();
            $("#inputChatMsg").val(""); //清除輸入框
            jsonChatMsg = buildWsJsonMessage("type:yell", strChatMsg);
            sendWsMessage(wsChannel, jsonChatMsg);
        });
    }
    
    //初始化鍵盤綁定
    function initKeyBindings(){
        //輸入框綁定 Enter 鍵
        $("#inputChatMsg").keyup(function(eventKey){
            var code = eventKey.which;
            if (code==13) {
                eventKey.preventDefault();
                $("#btnSendChatMsg").click();
            };
        });
    };
    
    /* utility function */
    
    //建立訊息 li
    function buildMessageLiTag(strMsg, strColor, strAlign){
        strLiTag = 
        "<li class=\"list-group-item\">" +
            strMsg +
        "</li>";
        return strLiTag;
    };
    
})(jQuery);