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
            "width":"40vw",
            "maxChars" : 255,
            "defaultText":"新增"
        });
    };
    
    //初始化 tinymce
    function initTinymce(){
        tinymce.init({
            selector:"textarea",
            language: "zh_TW",
            width: "46vw",
            menubar: false,
            plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table contextmenu paste code"
            ],
            toolbar: "undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
            content_css: [
                "//fonts.googleapis.com/css?family=Lato:300,300i,400,400i",
                "//www.tinymce.com/css/codepen.min.css"
            ],
            default_link_target: "_blank"
        });
    };
    
})(jQuery);