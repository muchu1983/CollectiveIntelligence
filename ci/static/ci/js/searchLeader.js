//Copyright © 2017, MuChu Hsu
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
            //先暫存選擇的 strCIUserUID
            var strCIUserUID = $(this).prev().prev(".strCIUserUID").val();
            //todo 確認 不是選擇自已
            
            //popup 確認重設領導人 將重置 個人值 PV
            $("#dialogConfirmResetLeader").dialog({
                resizable: false,
                height: "auto",
                width: 300,
                modal: true,
                buttons: {
                    "確定要重設": function() {
                        $(this).dialog("close");
                        console.log("確定要 重設領導人"); //確定
                        //POST 資料
                        dicPostData = {
                            "strCIUserUID": strCIUserUID,
                            "csrfmiddlewaretoken": strCsrfToken
                        };
                        console.log(dicPostData);
                        //POST
                        $.post("/core/resetLeader/", dicPostData, function(jsonResp){
                            console.log(jsonResp);
                            //顯示設定結果
                            $("#strResetResult").html(jsonResp["reset_result"]);
                            $("#dialogResetLeaderResult").dialog({
                                modal: true,
                                buttons: {
                                    Ok: function() {
                                        $(this).dialog("close");
                                        //更新頁面
                                        window.location.replace("/core/searchLeader/");
                                    }
                                }
                            });
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