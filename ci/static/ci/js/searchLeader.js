//Copyright (C) 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initSearchLeader);
    
    function initSearchLeader() {
        initBtnResetLeader();
    };
    
    //設為領導人按鈕
    function initBtnResetLeader(){
        //點擊 設為領導人
        $(".btnResetLeader").click(function(){
            //先暫存 strCIUserUID
            var strCIUserUID = $(this).prev().prev(".strCIUserUID").val();
            //popup 確認重設領導人 將重置 個人值 PV
            $("#dialogConfirmResetLeader").dialog({
                resizable: false,
                height: "auto",
                width: 300,
                modal: true,
                buttons: {
                    "確定要重設": function() {
                        $( this ).dialog("close");
                        console.log("確定要 重設領導人"); //確定
                        //POST 資料
                        dicPostData = {
                            "strCIUserUID": strCIUserUID,
                            "csrfmiddlewaretoken": strCsrfToken
                        };
                        //POST
                        console.log(dicPostData);
                        $.post("/core/resetLeader/", dicPostData, function(jsonResp){
                            console.log(jsonResp);
                            return false;
                        }, "json");
                    },
                    "取消": function() {
                        $( this ).dialog("close");
                        console.log("取消 重設領導人"); //取消
                    }
                }
            });
        });
    };
    
})(jQuery);