//Copyright © 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initCiuserViewer);
    
    function initCiuserViewer() {
        initLinkViewCIQuest();
        initCIQuestFilter();
    };
    
    //初始化 任務連結
    function initLinkViewCIQuest(){
        $(".linkViewCIQuest").click(function(){
            //先暫存選擇的 strQID
            var strQID = $(this).prev(".strQID").val();
            //設定 questViewer iframe src
            $("#iframeQuestViewer").attr("src", "/quest/questViewer/" + strQID);
            //popup questViewer iframe
            $("#divQuestViewerIFrame").removeClass("divHiddenQuestViewerIFrame").addClass("divShowQuestViewerIFrame");
        });
    };
    
    //初始化 任務列表過瀘器
    function initCIQuestFilter(){
        //執行中任務 列表
        $(".filterExecutorCIQuest input[type=checkbox]").click(function () {
            console.log("hi");
            if ($(".filterExecutorCIQuest input[type=checkbox]:checked").length) {
                console.log("hihi");
                $(".liExecutorCIQuest").hide();
                $(".filterExecutorCIQuest input[type=checkbox]:checked").each(function () {
                    $(".liExecutorCIQuest[data-" + $(this).prop("name") + "*=\"" + $(this).val() + "\"]").show();
                });
            } else {
                console.log("hihihi");
                $(".liExecutorCIQuest").show();
            }
        });
        //發起的任務 列表
        $(".filterInitiatorCIQuest input[type=checkbox]").click(function () {
            if ($(".filterInitiatorCIQuest input[type=checkbox]:checked").length) {
                $(".liInitiatorCIQuest").hide();
                $(".filterInitiatorCIQuest input[type=checkbox]:checked").each(function () {
                    $(".liInitiatorCIQuest[data-" + $(this).prop("name") + "*=\"" + $(this).val() + "\"]").show();
                });
            } else {
                $(".liInitiatorCIQuest").show();
            }
        });
    };
    
    
})(jQuery);