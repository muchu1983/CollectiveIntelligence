//Copyright © 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initBase);
    
    function initBase() {
        retrieveLstDicFollower();
        initBtnClearLeader();
    };
    
    //讀取追隨者物件清單
    function retrieveLstDicFollower(){
        //POST 資料
        dicPostData = {
            "csrfmiddlewaretoken": strCsrfToken
        };
        console.log(dicPostData);
        //POST
        $.post("/core/retrieveLstDicFollower/", dicPostData, function(jsonResp){
            $.each(jsonResp["lstDicFollower"], function(intIndex, dicFollower) {
                //加入
                $("#labelMyFollower").after(
                    "<li class=\"list-group-item\">"+
                        "<a href=\"/core/ciuserViewer/" + dicFollower["strCIUserUID"] + "/\">" +
                        dicFollower["strDisplayName"] +
                        "</a>"+
                    "</li>"
                );
            });
        }, "json");
    };
    
    //停止追隨領導人按鈕
    function initBtnClearLeader(){
        //點擊 停止追隨
        $(".btnClearLeader").click(function(){
            //popup 確認清除領導人
            $("#dialogConfirmClearLeader").dialog({
                resizable: false,
                height: "auto",
                width: 300,
                modal: true,
                buttons: {
                    "確定要清除": function() {
                        $(this).dialog("close");
                        console.log("確定要 清除領導人"); //確定
                        //POST 資料
                        dicPostData = {
                            "csrfmiddlewaretoken": strCsrfToken
                        };
                        console.log(dicPostData);
                        //POST
                        $.post("/core/clearLeader/", dicPostData, function(jsonResp){
                            console.log(jsonResp);
                            //顯示設定結果
                            $("#strClearResult").html(jsonResp["clear_result"]);
                            $("#dialogClearLeaderResult").dialog({
                                modal: true,
                                buttons: {
                                    Ok: function() {
                                        $(this).dialog("close");
                                        //更新頁面
                                        window.location.replace(window.location.href);
                                    }
                                }
                            });
                        }, "json");
                    },
                    "取消": function() {
                        $( this ).dialog("close");
                        console.log("取消 清除領導人"); //取消
                    }
                }
            });
        });
    };
    
})(jQuery);