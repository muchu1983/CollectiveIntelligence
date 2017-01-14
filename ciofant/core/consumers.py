# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from channels import Group
from channels.sessions import channel_session
from channels.auth import http_session_user
from channels.auth import channel_session_user
from channels.auth import channel_session_user_from_http
import json

# Connected to websocket.connect
@channel_session_user_from_http
def ws_connect(message, room):
    # Accept connection
    message.reply_channel.send({"accept": True})
    # Save room in session and add us to the group
    message.channel_session["room"] = room
    Group("chat-%s" % room).add(message.reply_channel)

# Connected to websocket.receive
@channel_session_user
def ws_message(message, room):
    dicRespText = {
        "text": message["text"],
        "user": message.user.username,
        "room": message.channel_session["room"]
    }
    Group("chat-%s" % room).send(
        {
            "text": json.dumps(dicRespText, sort_keys=True, indent=4),
        }
    )

# Connected to websocket.disconnect
@channel_session_user
def ws_disconnect(message, room):
    Group("chat-%s" % room).discard(message.reply_channel)