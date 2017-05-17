//Copyright © 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initSearchCIQuest);
    
    function initSearchCIQuest() {
        initQuestTagSpan();
        initBtnViewCIQuest();
    };
    
    //初始化 任務標籤
    function initQuestTagSpan(){
        $(".spanQuestTag").click(function(){
            //即時產生 搜尋的 POST form 
            var formPostSearchTag = 
                "<form id=\"formPostSearchTag\" action=\"/quest/searchCIQuest/\" method=\"post\">"+
                    "<input type=\"text\" id=\"strKeyword\" name=\"strKeyword\" value=" + $(this).html() + "></input>"+
                    "<input type=\"text\" id=\"csrfmiddlewaretoken\" name=\"csrfmiddlewaretoken\" value=" + strCsrfToken + "></input>"+
                "</form>";
            //加至 body 最後面
            $("body").append(formPostSearchTag);
            //POST
            $("#formPostSearchTag").submit();
        });
    };
    
    //初始化檢視按鈕
    function initBtnViewCIQuest(){
        $(".btnViewCIQuest").click(function(){
            //先暫存選擇的 strQID
            var strQID = $(this).prev(".strQID").val();
            //設定 questViewer iframe src
            $("#iframeQuestViewer").attr("src", "/quest/questViewer/" + strQID);
            //popup questViewer iframe
            $("#divQuestViewerIFrame").removeClass("divHiddenQuestViewerIFrame").addClass("divShowQuestViewerIFrame");
        });
    };
    
})(jQuery);