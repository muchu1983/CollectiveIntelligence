//Copyright © 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initQuestViewer);
    
    function initQuestViewer() {
        initInteractiveButtons();
    };
    
    //初始化 任務 互動按鈕
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
                        window.location.reload();
                    }, "json");
                },
                function(){
                    //Cancel
                    $(this).dialog("close");
                    console.log("取消 刪除任務");
                }
            );
        });
        //按贊 btnLikeOrDislikeQuest
        $("#btnLikeOrDislikeQuest").tooltip();
        $("#btnLikeOrDislikeQuest").click(function(){
            //POST 資料
            dicPostData = {
                "strQID": strQID,
                "csrfmiddlewaretoken": strCsrfToken
            };
            console.log(dicPostData);
            //POST
            $.post("/quest/likeOrDislikeQuest/", dicPostData, function(jsonResp){
                console.log(jsonResp);
                //更新頁面
                var isLiked = jsonResp["isLiked"];
                if (isLiked){
                    //將贊數 +1
                    $("#strLikedCount").html(parseInt($.trim($("#strLikedCount").html())) + 1);
                    //將獎勵PV +1
                    $("#strRewardPV").html(parseInt($.trim($("#strRewardPV").html())) + 1);
                    //更改 tooltip
                    $("#btnLikeOrDislikeQuest").attr("title", "取消喜歡");
                } else {
                    //將贊數 -1
                    $("#strLikedCount").html(parseInt($.trim($("#strLikedCount").html())) - 1);
                    //將獎勵PV -1
                    $("#strRewardPV").html(parseInt($.trim($("#strRewardPV").html())) - 1);
                    //更改 tooltip
                    $("#btnLikeOrDislikeQuest").attr("title", "我喜歡");
                }
            }, "json");
        });
        //申請執行任務 btnApplyQuest
        $("#btnApplyQuest").click(function(){
            strDialogSelector = "#dialogConfirmApplyQuest";
            showConfirmDialog(
                strDialogSelector,
                function(){
                    //OK
                    $(this).dialog("close");
                    console.log("確定要 申請執行任務");
                    //POST 資料
                    dicPostData = {
                        "strQID": strQID,
                        "csrfmiddlewaretoken": strCsrfToken
                    };
                    console.log(dicPostData);
                    //POST
                    $.post("/quest/applyQuest/", dicPostData, function(jsonResp){
                        console.log(jsonResp);
                        //更新頁面
                        window.location.reload();
                    }, "json");
                },
                function(){
                    //Cancel
                    $(this).dialog("close");
                    console.log("取消 申請執行任務");
                }
            );
        });
        //接受申請
        $("#btnAcceptApplication").click(function(){
            //POST 資料
            dicPostData = {
                "strQID": strQID,
                "csrfmiddlewaretoken": strCsrfToken
            };
            console.log(dicPostData);
            //POST
            $.post("/quest/acceptApplication/", dicPostData, function(jsonResp){
                console.log(jsonResp);
                //更新頁面
                window.location.reload();
            }, "json");
        });
        //拒絕申請
        $("#btnRejectApplication").click(function(){
            //POST 資料
            dicPostData = {
                "strQID": strQID,
                "csrfmiddlewaretoken": strCsrfToken
            };
            console.log(dicPostData);
            //POST
            $.post("/quest/rejectApplication/", dicPostData, function(jsonResp){
                console.log(jsonResp);
                //更新頁面
                window.location.reload();
            }, "json");
        });
        //取消申請
        $("#btnCancelApplication").click(function(){
            //POST 資料
            dicPostData = {
                "strQID": strQID,
                "csrfmiddlewaretoken": strCsrfToken
            };
            console.log(dicPostData);
            //POST
            $.post("/quest/cancelApplication/", dicPostData, function(jsonResp){
                console.log(jsonResp);
                //更新頁面
                window.location.reload();
            }, "json");
        });
        //成功達成目標 btnQuestReached
        $("#btnQuestReached").click(function(){
            //POST 資料
            dicPostData = {
                "strQID": strQID,
                "csrfmiddlewaretoken": strCsrfToken
            };
            console.log(dicPostData);
            //POST
            $.post("/quest/questReached/", dicPostData, function(jsonResp){
                console.log(jsonResp);
                //更新頁面
                window.location.reload();
            }, "json");
        });
        //終結任務 btnTerminateQuest
        $("#btnTerminateQuest").click(function(){
            strDialogSelector = "#dialogConfirmTerminateQuest";
            showConfirmDialog(
                strDialogSelector,
                function(){
                    //OK
                    $(this).dialog("close");
                    console.log("確定要 終結任務");
                    //POST 資料
                    dicPostData = {
                        "strQID": strQID,
                        "csrfmiddlewaretoken": strCsrfToken
                    };
                    console.log(dicPostData);
                    //POST
                    $.post("/quest/terminateQuest/", dicPostData, function(jsonResp){
                        console.log(jsonResp);
                        //更新頁面
                        window.location.reload();
                    }, "json");
                },
                function(){
                    //Cancel
                    $(this).dialog("close");
                    console.log("取消 終結任務");
                }
            );
        });
        //放棄任務 btnAbandonQuest
        $("#btnAbandonQuest").click(function(){
            strDialogSelector = "#dialogConfirmAbandonQuest";
            showConfirmDialog(
                strDialogSelector,
                function(){
                    //OK
                    $(this).dialog("close");
                    console.log("確定要 放棄任務");
                    //POST 資料
                    dicPostData = {
                        "strQID": strQID,
                        "csrfmiddlewaretoken": strCsrfToken
                    };
                    console.log(dicPostData);
                    //POST
                    $.post("/quest/abandonQuest/", dicPostData, function(jsonResp){
                        console.log(jsonResp);
                        //更新頁面
                        window.location.reload();
                    }, "json");
                },
                function(){
                    //Cancel
                    $(this).dialog("close");
                    console.log("取消 放棄任務");
                }
            );
        });
        //完成任務 btnAccomplishQuest
        $("#btnAccomplishQuest").click(function(){
            //POST 資料
            dicPostData = {
                "strQID": strQID,
                "csrfmiddlewaretoken": strCsrfToken
            };
            console.log(dicPostData);
            //POST
            $.post("/quest/accomplishQuest/", dicPostData, function(jsonResp){
                console.log(jsonResp);
                //更新頁面
                window.location.reload();
            }, "json");
        });
        //任務已失敗 btnQuestUnreachable
        $("#btnQuestUnreachable").click(function(){
            //POST 資料
            dicPostData = {
                "strQID": strQID,
                "csrfmiddlewaretoken": strCsrfToken
            };
            console.log(dicPostData);
            //POST
            $.post("/quest/questUnreachable/", dicPostData, function(jsonResp){
                console.log(jsonResp);
                //更新頁面
                window.location.reload();
            }, "json");
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