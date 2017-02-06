//Copyright (C) 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initChat);
    
    function initChat() {
        initLeftAndRightSwitchBtn();
        
    };
    
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
    
})(jQuery);