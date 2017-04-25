//Copyright (C) 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initSearchCIUser);
    
    //初始化 進入點
    function initSearchCIUser() {
        initBtnViewCIUser();
    };
    
    //檢視按鈕
    function initBtnViewCIUser(){
        //點擊檢視
        $(".btnViewCIUser").click(function(){
            //POST 資料
            dicPostData = {
                "strCIUserUID": $(this).prev(".strCIUserUID").val(),
                "csrfmiddlewaretoken": strCsrfToken
            };
            //POST
            console.log(dicPostData);
            $.post("/core/ciuserViewer/", dicPostData, function(jsonResp){
                console.log(jsonResp);
                return false;
            }, "json");
        });
    };
    
})(jQuery);