//Copyright © 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initChannel);
    
    /* global variable */
    var wsChannel = null;
    //角色 與 class 對應表
    var dicRoleClassMapping = {
        "role:sys": "roleSys",
        "role:leader": "roleLeader",
        "role:host": "roleHost",
        "role:follower": "roleFollower",
        "role:ciuser": "roleCiuser",
        "role:anonymous": "roleAnonymous",
    };
    //對齊方向 與 class 對應表
    var dicMsgAlignClassMapping = {
        "align:center":"text-center",
        "align:left":"text-left",
        "align:right":"text-right",
    };
    
    /* initial function */
    //初始化 頻道 頁面
    function initChannel() {
        //先讀取 頻道歷史訊息
        loadHistoryMessage();
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
                $("#ulChatMessage").append(buildMessageLiTag(dicHistoryMessage["strMsg"], dicRoleClassMapping[strRole], dicMsgAlignClassMapping[strMsgAlign], strVisitorDisplayName));
            });
            //顯示 自動讀取歷史訊息完畢
            $("#ulChatMessage").append(buildMessageLiTag("自動讀取歷史訊息完畢", dicRoleClassMapping["role:sys"], dicMsgAlignClassMapping["align:center"], "系統訊息"));
            //捲動至最下層
            $("#ulChatMessage").animate({scrollTop: $("#ulChatMessage").prop("scrollHeight")}, 500);
        }).done(function(){
            //再執行初始化...
            initConnectToWebsocket();
            initHandleWsMessage();
            initBtnSendChatMsg();
            initKeyBindings();
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
            $("#ulChatMessage").append(buildMessageLiTag(jsonMsg["strMsg"], dicRoleClassMapping[strRole], dicMsgAlignClassMapping[strMsgAlign], strVisitorDisplayName));
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
    function buildMessageLiTag(strMsg, strClassRole, strClassTextAlign, strVisitorDisplayName){
        strLiTag = 
        "<li class=\"list-group-item " + strClassRole + " " + strClassTextAlign + "\">" +
            "<div>" + strVisitorDisplayName + "</div>" +
            "<div>" + strMsg + "</div>" +
        "</li>";
        return strLiTag;
    };
    
})(jQuery);