# -*- coding: utf-8 -*-
"""
Copyright © 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import uuid
from django.shortcuts import render
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib import messages
from django.db.models import Q
from django.http import JsonResponse
from core.models import CIUser
from core.forms import RegisterUserForm
from core.forms import ProfilesCIUserForm
from core.forms import ProfilesUserForm
from core.forms import UploadAvatarThumbnailForm
from ci.utility.email import EmailUtility
from core.utility.raid import RaidUtility

#用戶註冊
def register(request):
    if request.method == "POST":
        formRegisterUser = RegisterUserForm(request.POST)
        if formRegisterUser.is_valid():
            user = formRegisterUser.save()
            return redirect("/accounts/login/")
    else:
        formRegisterUser = RegisterUserForm()
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
        formUser = ProfilesUserForm(request.POST, instance=request.user)
        formCIUser = ProfilesCIUserForm(request.POST, instance=request.user.ciuser)
        if formUser.is_valid() and formCIUser.is_valid():
            #讀取新的 email
            strNewEmail = request.user.email
            #更改 email 驗證狀態
            if strOldEmail != strNewEmail:
                #設為未認證
                request.user.ciuser.isEmailVerified = False
                #亂數設定一個新的認證碼
                request.user.ciuser.strEmailVerificationKey = str(uuid.uuid1())
            #分兩段儲存
            formUser.save()
            formCIUser.save()
            messages.success(request, "個人資料已更新")
            return redirect("/accounts/profiles/")
    else:
        #顯示目前個人資料設定
        formUser = ProfilesUserForm(instance=request.user)
        formCIUser = ProfilesCIUserForm(instance=request.user.ciuser)
    return render(request, "core/accounts/profiles.html", {
        "strUsername":strUsername,
        "isEmailVerified":isEmailVerified,
        "formUser":formUser,
        "formCIUser":formCIUser
    })
    
#上傳個人頭像
@login_required
def uploadAvatarThumbnail(request):
    if request.method == "POST":
        thumbnailForm = UploadAvatarThumbnailForm(request.POST, request.FILES)
        if thumbnailForm.is_valid():
            request.user.ciuser.avatarThumbnail = thumbnailForm.cleaned_data["avatarThumbnail"]
            request.user.save()
    return redirect("/accounts/profiles/")
    
#傳送 Email 認證信
@login_required
def sendEmailVerification(request):
    if request.user.is_authenticated(): #已登入
        #Server domain
        strServerDomain = "http://www.c8ei10e.com/"
        #顯示名稱
        strDisplayName = request.user.ciuser.strDisplayName
        #使用者 UID
        strCIUserUID = request.user.ciuser.strCIUserUID
        #使用者 email
        strEmail = request.user.email
        #產生 認證金鑰
        strKeyUUID = str(uuid.uuid1())
        #儲存 認證金鑰
        request.user.ciuser.strEmailVerificationKey = strKeyUUID
        #儲存 過期時間為 1天
        request.user.ciuser.dtEmailVerificationKeyExpire = timezone.now() + timezone.timedelta(days=1)
        request.user.save()
        #生成 Email 認證信
        strMsg = (
            "<div><img src=\"{strServerDomain}static/ci/img/logo.png\" width=\"80\" height=\"80\"></img></div>"
            "<h2>親愛的冒險者 {strDisplayName},</h2>"
            "<div>"
                "<p>歡迎加入 C8eI10e 平台。</p>"
                "<p>請點擊這個 "
                    "<a href=\"{strServerDomain}accounts/verifyEmail/?strCIUserUID={strCIUserUID}&strKeyUUID={strKeyUUID}\">"
                        "連結(對！就是點我！)"
                    "</a>"
                " 以進行驗證您的 e-mail 信箱。謝謝！</p>"
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
    
#尋找 CI 使用者
def searchCIUser(request):
    #頁面標題
    strPageTitle = "搜尋用戶"
    #form 的 action 目標 url
    strFormActionUrl = "/core/searchCIUser/"
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
        #比對 isVIP
        queryObject = Q(isVIP=True)
        #查尋
        qsetMatchedCIUser = CIUser.objects.filter(queryObject)
        strSearchResult = "請輸入搜尋字串"
    return render(request, "core/searchCIUser.html", locals())
    
#尋找 CI 領導人
@login_required
def searchLeader(request):
    #頁面標題
    strPageTitle = "搜尋領導人"
    #form 的 action 目標 url
    strFormActionUrl = "/core/searchLeader/"
    #尋找結果字串
    strSearchResult = None
    #尋找結果
    qsetMatchedCIUser = None
    #團隊操作工具
    raidUtil = RaidUtility()
    if request.method == "POST":
        strKeyword = request.POST.get("strKeyword", None)
        #比對 strDisplayName
        queryObject = Q(strDisplayName__iregex="^.*{strDisplayName}.*$".format(strDisplayName=strKeyword))
        #查尋
        qsetMatchedCIUser = CIUser.objects.filter(queryObject)
        #移除自己(user)
        qsetMatchedCIUser = qsetMatchedCIUser.exclude(strCIUserUID=request.user.ciuser.strCIUserUID)
        #若已有領導人，移除原有的領導人
        ciuserLeader = request.user.ciuser.leader
        if ciuserLeader is not None:
            qsetMatchedCIUser = qsetMatchedCIUser.exclude(strCIUserUID=ciuserLeader.strCIUserUID)
        #移除 該選項的上層領導人有自己(user) 的選項 - 避免領導人無限迴圈
        for matchedCIUser in qsetMatchedCIUser:
            if raidUtil.isLeaderOrLeaderOfLeader(user=matchedCIUser.user, strLeaderUID=request.user.ciuser.strCIUserUID):
                qsetMatchedCIUser = qsetMatchedCIUser.exclude(strCIUserUID=matchedCIUser.strCIUserUID)
        #todo 若更換的對像為 原有領導人的領導人 是否該移除 (再討論)
        strSearchResult = "查尋 {strKeyword} 共找到 {intResultCount} 個用戶".format(strKeyword=strKeyword, intResultCount=qsetMatchedCIUser.count())
    else:
        strSearchResult = "請輸入搜尋字串"
    return render(request, "core/searchLeader.html", locals())
    
#重設 領導人
@login_required
def resetLeader(request):
    #重設領導人結果 字串
    strResetResult = None
    #團隊操作工具
    raidUtil = RaidUtility()
    if request.method == "POST":
        strCIUserUID = request.POST.get("strCIUserUID", None)
        if strCIUserUID:
            #重設 領導人 並重置 PV 值
            raidUtil.resetLeaderAndPV(user=request.user, strLeaderUID=strCIUserUID)
            #完成字串
            strResetResult = "已完成重設領導人為 {strLeaderDisplayName}".format(strLeaderDisplayName=request.user.ciuser.leader.strDisplayName)
        else:
            #無效的領導人 UID
            strResetResult = "無效的領導人 UID"
    else:
        strResetResult = "只允許 POST 方式設定領導人"
    return JsonResponse({"reset_result":strResetResult}, safe=False)
    
#清除 領導人
@login_required
def clearLeader(request):
    #清除領導人結果 字串
    strClearResult = None
    #團隊操作工具
    raidUtil = RaidUtility()
    if request.method == "POST":
        #清除 領導人
        raidUtil.clearLeader(user=request.user)
        #完成字串
        strClearResult = "已完成清除領導人"
    else:
        strClearResult = "只允許 POST 方式設定領導人"
    return JsonResponse({"clear_result":strClearResult}, safe=False)
    
#取得 追隨者
@login_required
def retrieveLstDicFollower(request):
    #取得追隨者結果 字串
    strRetrieveResult = None
    #追隨者 列表
    lstDicFollower = []
    #團隊操作工具
    raidUtil = RaidUtility()
    if request.method == "POST":
        qsetCIUserFollower = raidUtil.getQsetFollower(user=request.user)
        #轉換為 json 物件再回傳
        for ciuserFollower in qsetCIUserFollower:
            dicFollower = {
                "strDisplayName": ciuserFollower.strDisplayName,
                "strCIUserUID": ciuserFollower.strCIUserUID,
                "intPointVolume": ciuserFollower.intPointVolume
            }
            lstDicFollower.append(dicFollower)
        strRetrieveResult = "完成取得 追隨者"
    else:
        strRetrieveResult = "只允許 POST 方式取得 追隨者"
    return JsonResponse({"retrieve_result":strRetrieveResult, "lstDicFollower":lstDicFollower}, safe=False)
    
#CI用戶檢視頁
def ciuserViewer(request, strCIUserUID=None):
    raidUtil = RaidUtility()
    intRaidPV = 0
    userHost = raidUtil.getUserByCIUSerUID(strCIUserUID=strCIUserUID)
    if userHost is not None:
        #計算 團隊 PV
        intRaidPV = raidUtil.calculateRaidPV(userHost)
    return render(request, "core/ciuserViewer.html", locals())
    
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
    
#google 網站驗證
def googleSiteVerification(request):
    return render(request, "core/google-site-verification/google707bf3bffb973ed1.html", {})
    
#bing 網站驗證
def bingSiteVerification(request):
    return render(request, "core/bing-site-verification/BingSiteAuth.xml", {})