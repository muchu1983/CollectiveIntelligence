//Copyright (C) 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initQuestViewer);
    
    function initQuestViewer() {
        initInteractiveButtons();
    };
    
    function initInteractiveButtons(){
        console.log("QID: " + strQID);
        //刪除任務 btnDeleteQuest
        $("#btnDeleteQuest").click(function(){
            strDialogSelector = "#dialogConfirmDeleteQuest";
            showConfirmDialog(
                strDialogSelector,
                function(){
                    //OK
                    $(this).dialog("close");
                    console.log("確定要 刪除任務");
                    //POST 資料
                    dicPostData = {
                        "strQID": strQID,
                        "csrfmiddlewaretoken": strCsrfToken
                    };
                    console.log(dicPostData);
                    //POST
                    $.post("/quest/deleteQuest/", dicPostData, function(jsonResp){
                        console.log(jsonResp);
                        //更新頁面
                        window.location.replace("/quest/searchCIQuest/");
                    }, "json");
                },
                function(){
                    //Cancel
                    $(this).dialog("close");
                    console.log("取消 刪除任務");
                }
            );
        });
        //按贊 btnLikeQuest
        $("#btnLikeQuest").click(function(){
            
        });
        //接受任務 btnAcceptQuest
        $("#btnAcceptQuest").click(function(){
            
        });
        //目標達成 btnQuestReached
        $("#btnQuestReached").click(function(){
            
        });
        //任務失敗 btnQuestFailed
        $("#btnQuestFailed").click(function(){
            
        });
        //放棄任務 btnAbandonQuest
        $("#btnAbandonQuest").click(function(){
            
        });
        //完成任務 btnAccomplishQuest
        $("#btnAccomplishQuest").click(function(){
            
        });
    };
    
    //popup 確認對話框
    function showConfirmDialog(strDialogSelector, funcOk, funcCancel){
        $(strDialogSelector).dialog({
            resizable: false,
            height: "auto",
            width: 300,
            modal: true,
            buttons: {
                "確定": funcOk,
                "取消": funcCancel
            }
        });
    };
    
})(jQuery);