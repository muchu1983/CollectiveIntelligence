# -*- coding: utf-8 -*-
"""
Copyright (C) 2017, MuChu Hsu
Contributed by Muchu Hsu (muchu1983@gmail.com)
This file is part of BSD license

<https://opensource.org/licenses/BSD-3-Clause>
"""
from channels.routing import route
from channels.routing import route_class
from core import consumers as core_consumers

channel_routing = [
    route("websocket.connect", core_consumers.ws_connect),
    route("websocket.receive", core_consumers.ws_message),
    route("websocket.disconnect", core_consumers.ws_disconnect),
]