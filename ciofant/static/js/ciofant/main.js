//Copyright (C) 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initMain);
    
    function initMain() {
        
        var webSocket = new WebSocket(wsUrl);
        webSocket.onmessage = function(msgEvent) {
            alert(msgEvent.data)
            console.log(JSON.parse(msgEvent.data))
        }
        webSocket.onopen = function() {
            webSocket.send(JSON.stringify({"msg":"hello world"}));
        }
        
    };
    
})(jQuery);