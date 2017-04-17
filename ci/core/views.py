# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import uuid
from django.shortcuts import render
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib import messages
from core.models import CIUser
from core.forms import CIUserForm
from core.forms import UserForm
from ci.utility.email import EmailUtility

#用戶註冊
def register(request):
    if request.method == "POST":
        formRegisterUser = UserCreationForm(request.POST)
        if formRegisterUser.is_valid():
            user = formRegisterUser.save()
            return redirect("/accounts/login/")
    else:
        formRegisterUser = UserCreationForm()
    return render(request, "core/accounts/register.html", locals())
    
#個人資料
@login_required
def profiles(request):
    #使用者帳號(不可修改)
    strUsername = request.user.username
    if request.method == "POST":
        #密碼更改
        strResetPassword1 = request.POST.get("reset_password_1", None)
        strResetPassword2 = request.POST.get("reset_password_2", None)
        if strResetPassword1 and strResetPassword2 and strResetPassword1 == strResetPassword2:
            request.user.set_password(strResetPassword1)
            request.user.save()
            messages.success(request, "密碼已重新設定-完成")
        else:
            messages.error(request, "密碼重新設定-失敗")
        #讀取新 個人資料
        formUser = UserForm(request.POST, instance=request.user)
        formCIUser = CIUserForm(request.POST, instance=request.user.ciuser)
        if formUser.is_valid() and formCIUser.is_valid():
            #分兩段儲存
            formUser.save()
            formCIUser.save()
            messages.success(request, "個人資料已更新")
            return redirect("/accounts/profiles/")
    else:
        #顯示目前個人資料設定
        formUser = UserForm(instance=request.user)
        formCIUser = CIUserForm(instance=request.user.ciuser)
    return render(request, "core/accounts/profiles.html", {
        "strUsername":strUsername,
        "formUser":formUser,
        "formCIUser":formCIUser
    })
    
#傳送 Email 認證信
@login_required
def sendEmailVerification(request):
    if request.user.is_authenticated(): #已登入
        #顯示名稱
        strDisplayName = request.user.ciuser.strDisplayName
        #使用者 UID
        strCIUserUID = request.user.ciuser.strCIUserUID
        #產生 認證金鑰
        strKeyUUID = str(uuid.uuid4())
        #儲存 認證金鑰
        request.user.ciuser.strEmailVerificationKey = strKeyUUID
        #儲存 過期時間為 1天
        request.user.ciuser.dtEmailVerificationKeyExpire = timezone.now() + timezone.timedelta(days=1)
        request.user.save()
        #生成 Email 認證信
        strMsg = (
            "<div><img src=\"http://www.c8ei10e.com/static/img/logo.png\" width=\"80\"/></div>"
            "<h2>Dear %s,</h2>"
            "<div>"
                "<p>Welcome to c8ei10e.</p>"
                "<p>Please click this "
                    "<a href=\"http://127.0.0.1:9487/accounts/verifyEmail/?strCIUserUID=%s&strKeyUUID=%s\">"
                        "link"
                    "</a>"
                " to confirm your registration.</p>"
                "<p><a href=\"http://www.c8ei10e.com\">http://www.c8ei10e.com</a></p>"
            "</div>"%(strDisplayName, strCIUserUID, strKeyUUID)
        )
        #寄出 email
        emailUtil = EmailUtility()
        emailUtil.sendEmail(
            strSubject="使用者 email 認證.",
            strFrom="c8ei10e",
            strTo="me",
            strMsg=strMsg,
            lstStrTarget=["public.muchu1983@gmail.com"],
            strSmtp="smtp.gmail.com:587",
            strAccount="public.muchu1983@gmail.com",
            strPassword="bee520520bee"
        )
    return redirect("/accounts/profiles/")
    
#檢查 Email 驗證碼正確性
def verifyEmail(request):
    strCIUserUID = request.GET.get("strCIUserUID", None)
    strKeyUUID = request.GET.get("strKeyUUID", None)
    print(strCIUserUID)
    print(strKeyUUID)
    #目前時間
    dtNow = timezone.now()
    #查找 CIUser
    qsetMatchedCIUser = CIUser.objects.filter(
        strCIUserUID=strCIUserUID,
        strEmailVerificationKey=strKeyUUID,
        dtEmailVerificationKeyExpire__gte=dtNow
    )
    if len(qsetMatchedCIUser) > 0: #認證成功
        #更新帳號 為 已認證
        intAffectedRows = qsetMatchedCIUser.update(isEmailVerified=True)
        print(intAffectedRows)
    #todo 將用戶導向通知頁
    #return render(request, "notice.html", {"strMessage":"Email (%s) verification SUCCESS. your account level updated."%strEmail})
    return redirect("/accounts/login/")
    
#主頁面
def renderMainPage(request):
    #取得顯示名稱
    strDisplayName = None
    if request.user.is_authenticated():
        #已登入
        strDisplayName = request.user.ciuser.strDisplayName
    else:
        #未登入
        strDisplayName = "未登入"
    return render(request, "core/main.html", {"strDisplayName":strDisplayName})