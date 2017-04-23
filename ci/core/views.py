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
from django.db.models import Q
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
    #email 驗證狀態
    isEmailVerified = request.user.ciuser.isEmailVerified
    if request.method == "POST":
        #密碼更改
        strResetPassword1 = request.POST.get("reset_password_1", None)
        strResetPassword2 = request.POST.get("reset_password_2", None)
        if strResetPassword1 and strResetPassword2 and strResetPassword1 != "" and strResetPassword1 == strResetPassword2:
            request.user.set_password(strResetPassword1)
            request.user.save()
            messages.success(request, "密碼已重新設定-完成")
        else:
            messages.error(request, "密碼重新設定-失敗")
        #暫存舊的 email
        strOldEmail = request.user.email
        #讀取新 個人資料
        formUser = UserForm(request.POST, instance=request.user)
        formCIUser = CIUserForm(request.POST, instance=request.user.ciuser)
        if formUser.is_valid() and formCIUser.is_valid():
            #讀取新的 email
            strNewEmail = request.user.email
            #更改 email 驗證狀態
            if strOldEmail != strNewEmail:
                #設為未認證
                request.user.ciuser.isEmailVerified = False
                #亂數設定一個新的認證碼
                request.user.ciuser.strEmailVerificationKey = str(uuid.uuid4())
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
        "isEmailVerified":isEmailVerified,
        "formUser":formUser,
        "formCIUser":formCIUser
    })
    
#傳送 Email 認證信
@login_required
def sendEmailVerification(request):
    if request.user.is_authenticated(): #已登入
        #Server domain
        strServerDomain = "http://www.c8ei10e.com:9487/"
        #顯示名稱
        strDisplayName = request.user.ciuser.strDisplayName
        #使用者 UID
        strCIUserUID = request.user.ciuser.strCIUserUID
        #使用者 email
        strEmail = request.user.email
        #產生 認證金鑰
        strKeyUUID = str(uuid.uuid4())
        #儲存 認證金鑰
        request.user.ciuser.strEmailVerificationKey = strKeyUUID
        #儲存 過期時間為 1天
        request.user.ciuser.dtEmailVerificationKeyExpire = timezone.now() + timezone.timedelta(days=1)
        request.user.save()
        #生成 Email 認證信
        strMsg = (
            "<div><img src=\"{strServerDomain}static/ci/img/logo.png\" width=\"80\"/></div>"
            "<h2>Dear {strDisplayName},</h2>"
            "<div>"
                "<p>Welcome to c8ei10e.</p>"
                "<p>Please click this "
                    "<a href=\"{strServerDomain}accounts/verifyEmail/?strCIUserUID={strCIUserUID}&strKeyUUID={strKeyUUID}\">"
                        "link"
                    "</a>"
                " to verify your email.</p>"
                "<p><a href=\"{strServerDomain}\">{strServerDomain}</a></p>"
            "</div>".format(
                strServerDomain=strServerDomain,
                strDisplayName=strDisplayName,
                strCIUserUID=strCIUserUID,
                strKeyUUID=strKeyUUID
            )
        )
        #寄出 email
        emailUtil = EmailUtility()
        emailUtil.sendEmail(
            strSubject="使用者 email 認證.",
            strFrom="c8ei10e",
            strTo="me",
            strMsg=strMsg,
            lstStrTarget=[strEmail],
            strSmtp="smtp.gmail.com:587",
            strAccount="public.muchu1983@gmail.com",
            strPassword="bee520520bee"
        )
    return redirect("/accounts/profiles/")
    
#檢查 Email 驗證碼正確性
def verifyEmail(request):
    strCIUserUID = request.GET.get("strCIUserUID", None)
    strKeyUUID = request.GET.get("strKeyUUID", None)
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
    else: #認證失敗
        #todo
        pass
    #todo 將用戶導向通知頁
    #return render(request, "notice.html", {"strMessage":"Email (%s) verification SUCCESS. your account level updated."%strEmail})
    return redirect("/accounts/login/")
    
#尋找 CI User
def searchCIUser(request):
    #尋找結果字串
    strSearchResult = None
    #尋找結果
    qsetMatchedCIUser = None
    if request.method == "POST":
        strKeyword = request.POST.get("strKeyword", None)
        #比對 strDisplayName
        queryObject = Q(strDisplayName__iregex="^.*{strDisplayName}.*$".format(strDisplayName=strKeyword))
        #查尋
        qsetMatchedCIUser = CIUser.objects.filter(queryObject)
        strSearchResult = "查尋 {strKeyword} 共找到 {intResultCount} 個用戶".format(strKeyword=strKeyword, intResultCount=qsetMatchedCIUser.count())
    else:
        strSearchResult = "請輸入搜尋字串"
    return render(request, "core/searchCIUser.html", locals())
    
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