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

# Connected to websocket.connect
@channel_session_user_from_http
def ws_connect(message):
    # Accept connection
    message.reply_channel.send({"accept": True})
    # Work out room name from path (ignore slashes)
    room = message.content["path"].strip("/")
    # Save room in session and add us to the group
    message.channel_session["room"] = room
    Group("chat-%s" % room).add(message.reply_channel)

# Connected to websocket.receive
@channel_session_user
def ws_message(message):
    Group("chat-%s" % message.channel_session["room"]).send(
        {"text": message["text"],}
    )

# Connected to websocket.disconnect
@channel_session_user
def ws_disconnect(message):
    Group("chat-%s" % message.channel_session["room"]).discard(message.reply_channel)