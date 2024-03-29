# -*- coding: utf-8 -*-
"""
Copyright © 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import os
import uuid
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill
from storages.backends.ftp import FTPStorage

#CI使用者
class CIUser(models.Model):
    
    #重新命名頭像圖片路徑
    def renameAvatarThumbnailFilePath(instance, filename):
        strAvatarsBasePath="ci/img/avatars/"
        strFilenameExt = filename.split(".")[-1]
        #亂數產生新 filename
        strNewFilename = "{}.{}".format(uuid.uuid1().hex, strFilenameExt)
        #組合完整路徑
        return os.path.join(strAvatarsBasePath, strNewFilename)
        
    #UID DB索引鍵 建立後不可更改 搜尋使用UID可避免 username 曝光
    strCIUserUID = models.CharField(db_index=True, editable=False, max_length=36, default=uuid.uuid1, null=False)
    #一對一 Django 使用者
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    #多對一 領導人 CI使用者
    leader = models.ForeignKey("self", default=None, null=True, related_name="follower_set", on_delete=models.SET_NULL)
    #頭像
    avatarThumbnail = ProcessedImageField(
        default="ci/img/avatars/default-thumbnail.png",
        upload_to=renameAvatarThumbnailFilePath,
        processors=[ResizeToFill(100, 100)],
        format="PNG",
        options={"quality": 90},
        storage=FTPStorage()
    )
    #PV值
    intPointVolume = models.IntegerField(default=0, null=False)
    #顯示名稱
    strDisplayName = models.CharField(max_length=255, null=True)
    #是否為 VIP
    isVIP = models.BooleanField(default=False, null=False)
    #email 驗證 UUID
    strEmailVerificationKey = models.CharField(max_length=36, null=True)
    #email 驗證 過期時間
    dtEmailVerificationKeyExpire = models.DateTimeField(null=True)
    #email 驗證 已通過
    isEmailVerified = models.BooleanField(default=False, null=False)
    
#建立 Django 使用者時一併建立 CIUser
@receiver(post_save, sender=User)
def createCIUser(sender, instance, created, **kwargs):
    if created:
        CIUser.objects.create(user=instance, strDisplayName=instance.username)

#儲存 Django 使用者時一併儲存 CIUser
@receiver(post_save, sender=User)
def saveCIUser(sender, instance, **kwargs):
    instance.ciuser.save()
