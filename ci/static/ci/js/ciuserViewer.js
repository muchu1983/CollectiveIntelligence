//Copyright © 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initCiuserViewer);
    
    function initCiuserViewer() {
        initLinkViewCIQuest();
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
    
})(jQuery);