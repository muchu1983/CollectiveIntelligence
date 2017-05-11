//Copyright © 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initNewQuest);
    
    function initNewQuest() {
        initInputQuestTags();
    };
    
    //初始化 任務標籤 輸入框
    function initInputQuestTags(){
        $("#inputQuestTags").tagsInput();
    };
    
})(jQuery);