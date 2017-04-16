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
from core.models import CIUser
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
def profile(request):
    if request.method == "POST":
        formRegisterUser = UserCreationForm(request.POST)
        if formRegisterUser.is_valid():
            user = formRegisterUser.save()
            return redirect("/accounts/login/")
    else:
        formRegisterUser = UserCreationForm()
    return render(request, "core/accounts/register.html", locals())
    
@login_required
#傳送 Email 認證信
def sendEmailVerification(request):
    if request.user.is_authenticated():
        #已登入
        strUsername = request.user.username
        #生成 Email 認證信
        #產生 UUID
        strUUID = str(uuid.uuid4())
        #儲存 email 認證資訊
        request.user.ciuser.strEmailVerificationKey = strUUID
        #過期時間為1天
        request.user.ciuser.dtEmailVerificationKeyExpire = timezone.now() + timezone.timedelta(days=1)
        request.user.save()
        strMsg = (
            "<div><img src=\"http://www.c8ei10e.com/static/img/logo.png\" width=\"80\"/></div>"
            "<h2>Dear %s,</h2>"
            "<div>"
                "<p>Welcome to c8ei10e.</p>"
                "<p>Please click this "
                    "<a href=\"http://127.0.0.1:9487/accounts/verifyEmail/?strUsername=%s&strUUID=%s\">"
                        "link"
                    "</a>"
                " to confirm your registration.</p>"
                "<p><a href=\"http://www.c8ei10e.com\">http://www.c8ei10e.com</a></p>"
            "</div>"%(strUsername, strUsername, strUUID)
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
    return redirect("/accounts/login/")
    
#檢查 Email 驗證碼正確性
def verifyEmail(request):
    strUsername = request.GET.get("strUsername", None)
    strUUID = request.GET.get("strUUID", None)
    print(strUsername)
    print(strUUID)
    dtNow = timezone.now()
    #查找 User
    qsetMatchedUser = User.objects.filter(
        username=strUsername
    )
    #查找 CIUser
    qsetMatchedCIUser = CIUser.objects.filter(
        user=qsetMatchedUser.first(),
        strEmailVerificationKey=strUUID,
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