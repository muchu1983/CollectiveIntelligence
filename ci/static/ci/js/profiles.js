//Copyright © 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

(function($) {
    
    $(document).ready(initProfiles);
    //主要 初始化 進入點
    function initProfiles() {
        initSendEmailVerificationBtn();
    };
    //初始化 email 認證信 按鈕
    function initSendEmailVerificationBtn(){
        console.log($("#id_email").val())
        //啟用與關閉
        if ($("#id_email").val() != ""){
            //email 已存在，啟用按鈕
            $(".btnSendEmailVerification").addClass("active").removeClass("disabled");
        }else{
            //email 不存在，關閉按鈕
            $(".btnSendEmailVerification").addClass("disabled").removeClass("active");
        }
        //點擊
        $(".btnSendEmailVerification").click(function(){
            window.location.href="/accounts/sendEmailVerification/";
            return false;
        });
    };
    
})(jQuery);