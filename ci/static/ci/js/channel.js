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
        initWebsocket();
        initHandleWsMessage();
    };
    
    //初始化 websocket
    function initWebsocket() {
        var strWsUrl = "ws://" + window.location.host + "/ws/chat/channel/" + strChannelRoom + "/?session_key=" + strSessionKey;
        /* 連線至 websocket */
        jsonOnopenMsg = buildWsJsonMessage("hello");
        wsChannel = connectToWs(strWsUrl, jsonOnopenMsg);
    };
    
    //初始化 websocket 訊息處理
    function initHandleWsMessage() {
        handleWsMessage(wsChannel, function(jsonMsg){
            //todo
        });
    };
    
})(jQuery);