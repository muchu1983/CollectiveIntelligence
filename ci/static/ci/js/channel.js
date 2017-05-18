//Copyright © 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(beforeInitChannel);
    
    /* global variable */
    var wsChannel = null;
    //角色 與 顏色 class 對應表
    var dicRoleClassMapping = {
        "role:sys": "roleSys",
        "role:leader": "roleLeader",
        "role:host": "roleHost",
        "role:follower": "roleFollower",
        "role:ciuser": "roleCiuser",
        "role:anonymous": "roleAnonymous",
    };
    //對齊方向 與 文字方向 class 對應表
    var dicMsgAlignClassMapping = {
        "align:center":"text-center",
        "align:left":"text-left",
        "align:right":"text-right",
    };
    //對齊方向 與 對話泡泡 class 對應表
    var dicMsgBubbleClassMapping = {
        "align:center":"bubble bubbleCenter",
        "align:left":"bubble bubbleLeft",
        "align:right":"bubble bubbleRight",
    };
    
    /* initial function */
    //初始化 頻道 之前
    function beforeInitChannel() {
        //先讀取 頻道歷史訊息
        loadHistoryMessage();
    };
    
    //初始化 頻道 頁面
    function initChannel() {
        //再執行初始化...
        initConnectToWebsocket();
        initHandleWsMessage();
        initBtnSendChatMsg();
        initKeyBindings();
    };
    
    //讀取 頻道歷史訊息
    function loadHistoryMessage() {
        //POST 資料
        dicPostData = {
            "csrfmiddlewaretoken": strCsrfToken
        };
        console.log(dicPostData);
        //POST
        $.post("/chat/loadHistoryMessage/" + strHostCIUserUID + "/", dicPostData, function(jsonResp){
            console.log(jsonResp);
            $.each(jsonResp["lstDicHistoryMessage"], function(intIndex, dicHistoryMessage) {
                var strRole = dicHistoryMessage["strRole"];
                var strMsgAlign = dicHistoryMessage["strMsgAlign"];
                var strVisitorDisplayName = dicHistoryMessage["strVisitorDisplayName"];
                //加入歷史訊息至聊天內容 #ulChatMessage
                $("#ulChatMessage").append(buildMessageLiTag(dicHistoryMessage["strMsg"], dicRoleClassMapping[strRole], dicMsgAlignClassMapping[strMsgAlign], dicMsgBubbleClassMapping[strMsgAlign], strVisitorDisplayName));
            });
            //顯示 自動讀取歷史訊息完畢
            $("#ulChatMessage").append(buildMessageLiTag("自動讀取歷史訊息完畢", dicRoleClassMapping["role:sys"], dicMsgAlignClassMapping["align:center"], dicMsgBubbleClassMapping["align:center"], "系統訊息"));
            //捲動至最下層
            $("#ulChatMessage").animate({scrollTop: $("#ulChatMessage").prop("scrollHeight")}, 500);
        }).done(function(){
            //讀取完頻道歷史訊息，再初始化 頻道 頁面
            initChannel();
        });
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
            var strRole = jsonMsg["strRole"];
            var strMsgAlign = jsonMsg["strMsgAlign"];
            var strVisitorDisplayName = jsonMsg["strVisitorDisplayName"];
            //加入訊息至聊天內容 #ulChatMessage
            $("#ulChatMessage").append(buildMessageLiTag(jsonMsg["strMsg"], dicRoleClassMapping[strRole], dicMsgAlignClassMapping[strMsgAlign], dicMsgBubbleClassMapping[strMsgAlign], strVisitorDisplayName));
            //訊息過長時，移除最前面的訊息
            if ($("#ulChatMessage li").length > 666){
                $("#ulChatMessage li").first().remove();
            };
            //捲動至最下層
            $("#ulChatMessage").animate({scrollTop: $("#ulChatMessage").prop("scrollHeight")}, 500);
        });
    };
    
    //初始化 傳送訊息按鈕
    function initBtnSendChatMsg(){
        $("#btnSendChatMsg").click(function(){
            //訊息內容
            var strChatMsg = $("#inputChatMsg").val();
            $("#inputChatMsg").val(""); //清除輸入框
            //訊息對齊方向
            var strMsgAlign = null;
            if ($("#checkboxMsgAlign").prop("checked")) {
                strMsgAlign = "align:right";
            } else {
                strMsgAlign = "align:left";
            };
            jsonChatMsg = buildWsJsonMessage("type:yell", strChatMsg, strMsgAlign);
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
    function buildMessageLiTag(strMsg, strClassRole, strClassTextAlign, strClassMsgBubble, strVisitorDisplayName){
        
        strLiTag = 
        "<li class=\"list-group-item " + strClassRole + " " + strClassTextAlign + "\">" +
            "<span class=\"visitorName\">" + strVisitorDisplayName + "</span>" +
            "<div class=\"" + strClassMsgBubble + "\">" +
                    strMsg + 
            "</div>" +
        "</li>";
        return strLiTag;
    };
    
})(jQuery);