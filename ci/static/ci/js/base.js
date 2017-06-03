//Copyright © 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initBase);
    
    function initBase() {
        initGA();
        initTooltip();
        //retrieveLstDicFollower();
        initBtnClearLeader();
        initBtnCloseQuestViewerIFrame();
    };
    
    //初始化 Google Analytics
    function initGA(){
        (function(i,s,o,g,r,a,m){
            i['GoogleAnalyticsObject']=r;
            i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)
            },
            i[r].l=1*new Date();
            a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];
            a.async=1;
            a.src=g;
            m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-7021205-3', 'auto');
        ga('send', 'pageview');
    };
    
    //初始化 tooltip
    function initTooltip(){
        $("[data-tooltip=on]").tooltip(); 
    };
    
    //讀取追隨者物件清單 (棄用，暫時保留)
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
                $("#liHiddenMyFollowerAddPoint").after(
                    "<li class=\"list-group-item row\">"+
                        "<div class=\"col-xs-1\">" +
                            "<img class=\"img-circle\" src=\"" + dicFollower["strAvatarThumbnailUrl"] + "\" height=\"20\" width=\"20\">" +
                        "</div>" +
                        "<a class=\"roleFollower col-xs-5\" href=\"/core/ciuserViewer/" + dicFollower["strCIUserUID"] + "/\">" +
                        dicFollower["strDisplayName"] +
                        "</a> "+
                        "<span class=\"col-xs-3\">" + dicFollower["intPointVolume"] + " PV</span>"+
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
    
    //初始化關閉 任務檢視 iframe 按鈕
    function initBtnCloseQuestViewerIFrame(){
        $("#btnCloseQuestViewerIFrame").click(function(){
            //hide questViewer iframe
            $("#divQuestViewerIFrame").removeClass("divShowQuestViewerIFrame").addClass("divHiddenQuestViewerIFrame");
            //設定 questViewer iframe src
            $("#iframeQuestViewer").attr("src", "about:blank");
            //更新頁面
            window.location.reload();
        });
    };
    
})(jQuery);