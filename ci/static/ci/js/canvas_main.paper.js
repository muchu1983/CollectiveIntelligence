//Copyright © 2017, MuChu Hsu
//Contributed by Muchu Hsu (muchu1983@gmail.com)
//This file is part of BSD license
//
//<https://opensource.org/licenses/BSD-3-Clause>

/*
strState route graph:

           ↓------ cancel ------↑                          ↑-- reached --> "complete" -- accomplish --> "end_success"
           ↓                    ↑                          ↑
init ----->↓------ reject ------↑                          ↑-- terminate --> "incomplete" -- unreachable --> "end_failure"
 ↑         ↓                    ↑                          ↑
delete -- "new" -- apply --> "matching" -- accept --> "processing"
           ↑                                               ↓
           ↑---------------------- abandon ----------------↓
*/

$(document).ready(initCanvasMain);

//全域變數
var circleUser = null;
var textUserA = null;
var textUserB = null;
var groupUserA = null;
var groupUserB = null;

//初始化 #canvas_main 畫布
function initCanvasMain() {
    //初始化 物件
    initCanvasItemObject();
};

//初始化 物件
function initCanvasItemObject() {
    //使用者圓
    circleUser = new Path.Circle({
        center: view.center,
        radius: 20,
        fillColor: "white",
        strokeWidth: 1,
        strokeColor: "black"
    });
    var symbolCircleUser = new Symbol(circleUser);
    
    //使用者文字
    textUserA = new PointText({
        point: view.center,
        justification: "center",
        content: "A",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 18
    });
    textUserB = new PointText({
        point: view.center,
        justification: "center",
        content: "B",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 18
    });
    
    //群組 - 使用者
    groupUserA = new Group({
        children: [symbolCircleUser.place(view.center), textUserA],
        position: [150,150],
        visible: false,
    });
    groupUserB = new Group({
        children: [symbolCircleUser.place(view.center), textUserB],
        position: [300,150],
        visible: false,
    });
    groupUserB.visible = true;
    groupUserA.visible = true;
};

//動畫
function onFrame(event) {
    var intTimeSecond = Math.floor(event.time)
    if (event.count % 10 == 0){
        if(groupUserA){
            groupUserA.visible = !groupUserA.visible;
        }
    };
};
