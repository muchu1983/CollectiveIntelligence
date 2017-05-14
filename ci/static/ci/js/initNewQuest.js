//Copyright © 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initNewQuest);
    
    function initNewQuest() {
        initTinymce();
        initInputQuestTags();
    };
    
    //初始化 任務標籤 輸入框
    function initInputQuestTags(){
        $("#inputQuestTags").tagsInput({
            "height":"40px",
            "width":"300px",
            "defaultText":"新增標籤"
        });
    };
    
    //初始化 tinymce
    function initTinymce(){
        tinymce.init({
            selector:"textarea",
            width: "50vw"
        });
    };
    
})(jQuery);