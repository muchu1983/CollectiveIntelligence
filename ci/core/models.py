# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
import uuid
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

#CI使用者
class CIUser(models.Model):
    #一對一 Django 使用者
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    #多對一 老大 CI使用者
    chief = models.ForeignKey("self", default=None, null=True, on_delete=models.SET_NULL)
    #PV值
    intPointVolume = models.IntegerField(default=0, null=False)
    #顯示名稱
    strDisplayName = models.CharField(max_length=30, null=True)
    
#建立 Django 使用者時一併建立 CIUser
@receiver(post_save, sender=User)
def createCIUser(sender, instance, created, **kwargs):
    if created:
        CIUser.objects.create(user=instance, strDisplayName=instance.username)

#儲存 Django 使用者時一併儲存 CIUser
@receiver(post_save, sender=User)
def saveCIUser(sender, instance, **kwargs):
    instance.ciuser.save()

# 已配發的使用者 UID
class BeDispatchedUID(models.Model):
    #UID
    uuidUID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    #最後更新時間
    dtLatestUpdateTime = models.DateTimeField(auto_now=True, null=False)
