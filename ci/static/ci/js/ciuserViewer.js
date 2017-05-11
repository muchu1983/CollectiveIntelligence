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
        filterExecutorCIQuest();
        filterInitiatorCIQuest();
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
        //接受的任務 列表
        $(".filterExecutorCIQuest input[type=checkbox]").click(function () {
            filterExecutorCIQuest();
        });
        //發起的任務 列表
        $(".filterInitiatorCIQuest input[type=checkbox]").click(function () {
            filterInitiatorCIQuest();
        });
    };
    
    //過瀘 接受的任務 列表
    function filterExecutorCIQuest(){
        if ($(".filterExecutorCIQuest input[type=checkbox]:checked").length) {
            //有勾選
            $(".liExecutorCIQuest").hide(); //先隱藏
            //重新顯示 data-quest-state vaule 符合勾選的項目
            $(".filterExecutorCIQuest input[type=checkbox]:checked").each(function () {
                $(".liExecutorCIQuest[data-" + $(this).prop("name") + "*=\"" + $(this).val() + "\"]").show();
            });
        } else {
            //無勾選
            $(".liExecutorCIQuest").show();
        }
    };
    
    //過瀘 發起的任務 列表
    function filterInitiatorCIQuest(){
        if ($(".filterInitiatorCIQuest input[type=checkbox]:checked").length) {
            //有勾選
            $(".liInitiatorCIQuest").hide(); //先隱藏
            //重新顯示 data-quest-state vaule 符合勾選的項目
            $(".filterInitiatorCIQuest input[type=checkbox]:checked").each(function () {
                $(".liInitiatorCIQuest[data-" + $(this).prop("name") + "*=\"" + $(this).val() + "\"]").show();
            });
        } else {
            //無勾選
            $(".liInitiatorCIQuest").show();
        }
    };
    
})(jQuery);