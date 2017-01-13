//Copyright (C) 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initMain);
    
    function initMain() {
        
        // Note that the path doesn't matter for routing; any WebSocket
        // connection gets bumped over to WebSocket consumers
        socket = new WebSocket(wsUrl);
        socket.onmessage = function(e) {
            alert(e.data);
        }
        socket.onopen = function() {
            socket.send("hello world");
        }
        // Call onopen directly if socket is already open
        if (socket.readyState == WebSocket.OPEN) socket.onopen();
        
    };
    
})(jQuery);