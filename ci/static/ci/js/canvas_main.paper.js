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
var textUserLeft = null;
var textUserRight = null;
var groupQuest = null;
//發起任務
var groupInitQuestLeft = null;
var groupInitQuestRight = null;
//刪除任務
var groupDeleteQuestLeft = null;
var groupDeleteQuestRight = null;
//申請執行任務
var groupApplyQuestLeft = null;
var groupApplyQuestRight = null;
//接受申請
var groupAcceptApplicationLeft = null;
var groupAcceptApplicationRight = null;
//拒絕申請
var groupRejectApplicationLeft = null;
var groupRejectApplicationRight = null;
//取消申請
var groupCancelApplicationLeft = null;
var groupCancelApplicationRight = null;

//初始化 #canvas_main 畫布
function initCanvasMain() {
    //初始化 物件
    initCanvasItemObject();
    //初始化 事件
    initCanvasEvent();
};

//初始化 物件
function initCanvasItemObject() {
    //用戶外框
    rectUserLeft = new Path.Rectangle({
        point: [0, 0],
        size: [view.size.width/2-2, view.size.height],
        radius: 10,
        strokeColor: "red",
        strokeWidth: 2,
    });
    rectUserRight = new Path.Rectangle({
        point: [0, 0],
        size: [view.size.width/2-2, view.size.height],
        radius: 10,
        strokeColor: "blue",
        strokeWidth: 2,
    });
    
    //用戶文字
    textUserLeft = new PointText({
        point: [view.size.width/4, 20],
        justification: "center",
        content: "A用戶",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 18
    });
    textUserRight = new PointText({
        point: [view.size.width/4, 20],
        justification: "center",
        content: "B用戶",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 18
    });
    
    //任務外框
    circleQuest = new Path.Circle({
        center: view.center,
        radius: view.size.height/4,
        strokeColor: "black",
        fillColor: "gold",
        strokeWidth: 2,
    });
    //任務文字
    textQuest = new PointText({
        point: view.center-[0, view.size.height/4-20],
        justification: "center",
        content: "任務",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 18
    });
    
    //群組
    groupUserLeft = new Group({
        children: [rectUserLeft, textUserLeft],
        position: [view.size.width*1/4, view.size.height/2],
        visible: true,
    });
    groupUserRight = new Group({
        children: [rectUserRight, textUserRight],
        position: [view.size.width*3/4, view.size.height/2],
        visible: true,
    });
    groupQuest = new Group({
        children: [circleQuest, textQuest],
        position: view.center,
        visible: false,
    });
    //發起任務 按鈕
    groupInitQuestLeft = buildGroupButtonItem("發起任務", [view.size.width*1/4, view.size.height/2], true);
    groupInitQuestRight = buildGroupButtonItem("發起任務", [view.size.width*3/4, view.size.height/2], true);
    //刪除任務 按鈕
    groupDeleteQuestLeft = buildGroupButtonItem("刪除任務", [view.size.width*1/4, view.size.height/2], false);
    groupDeleteQuestRight = buildGroupButtonItem("刪除任務", [view.size.width*3/4, view.size.height/2], false);
    //申請執行任務 按鈕
    groupApplyQuestLeft = buildGroupButtonItem("申請執行任務", [view.size.width*1/4, view.size.height/2], false);
    groupApplyQuestRight = buildGroupButtonItem("申請執行任務", [view.size.width*3/4, view.size.height/2], false);
    //接受申請 按鈕
    groupAcceptApplicationLeft = buildGroupButtonItem("接受申請", [view.size.width*1/4, view.size.height/2], false);
    groupAcceptApplicationRight = buildGroupButtonItem("接受申請", [view.size.width*3/4, view.size.height/2], false);
    //拒絕申請 按鈕
    groupRejectApplicationLeft = buildGroupButtonItem("拒絕申請", [view.size.width*1/4, view.size.height/2+50], false);
    groupRejectApplicationRight = buildGroupButtonItem("拒絕申請", [view.size.width*3/4, view.size.height/2+50], false);
    //取消申請 按鈕
    groupCancelApplicationLeft = buildGroupButtonItem("取消申請", [view.size.width*1/4, view.size.height/2], false);
    groupCancelApplicationRight = buildGroupButtonItem("取消申請", [view.size.width*3/4, view.size.height/2], false);
};

//事件
function initCanvasEvent() {
    //左方按下發起任務
    groupInitQuestLeft.onClick = function(event){
        groupQuest.visible = true;
        groupInitQuestLeft.visible = false;
        groupInitQuestRight.visible = false;
        textUserLeft.content = "發起人-A用戶";
        groupDeleteQuestLeft.visible = true;
        groupApplyQuestRight.visible = true;
    };
    //右方按下發起任務
    groupInitQuestRight.onClick = function(event){
        groupQuest.visible = true;
        groupInitQuestLeft.visible = false;
        groupInitQuestRight.visible = false;
        textUserRight.content = "發起人-B用戶";
        groupDeleteQuestRight.visible = true;
        groupApplyQuestLeft.visible = true;
    };
    //左方按下刪除任務
    groupDeleteQuestLeft.onClick = function(event){
        groupQuest.visible = false;
        groupInitQuestLeft.visible = true;
        groupInitQuestRight.visible = true;
        textUserLeft.content = "A用戶";
        groupDeleteQuestLeft.visible = false;
        groupApplyQuestRight.visible = false;
    };
    //右方按下刪除任務
    groupDeleteQuestRight.onClick = function(event){
        groupQuest.visible = false;
        groupInitQuestLeft.visible = true;
        groupInitQuestRight.visible = true;
        textUserRight.content = "B用戶";
        groupDeleteQuestRight.visible = false;
        groupApplyQuestLeft.visible = false;
    };
    //左方按下申請執行任務
    groupApplyQuestLeft.onClick = function(event){
        textUserLeft.content = "A用戶-執行人";
        groupDeleteQuestRight.visible = false;
        groupApplyQuestLeft.visible = false;
        groupAcceptApplicationRight.visible = true;
        groupRejectApplicationRight.visible = true;
        groupCancelApplicationLeft.visible = true;
    };
    //右方按下申請執行任務
    groupApplyQuestRight.onClick = function(event){
        textUserRight.content = "B用戶-執行人";
        groupDeleteQuestLeft.visible = false;
        groupApplyQuestRight.visible = false;
        groupAcceptApplicationLeft.visible = true;
        groupRejectApplicationLeft.visible = true;
        groupCancelApplicationRight.visible = true;
    };
    //左方按下接受申請
    groupAcceptApplicationLeft.onClick = function(event){
        groupAcceptApplicationLeft.visible = false;
        groupRejectApplicationLeft.visible = false;
        groupCancelApplicationRight.visible = false;
    };
    //右方按下接受申請
    groupAcceptApplicationRight.onClick = function(event){
        groupAcceptApplicationRight.visible = false;
        groupRejectApplicationRight.visible = false;
        groupCancelApplicationLeft.visible = false;
    };
    //左方按下拒絕申請
    groupRejectApplicationLeft.onClick = function(event){
        groupAcceptApplicationLeft.visible = false;
        groupRejectApplicationLeft.visible = false;
        textUserRight.content = "B用戶";
        groupApplyQuestRight.visible = true;
        groupDeleteQuestLeft.visible = true;
        groupCancelApplicationRight.visible = false;
    };
    //右方按下拒絕申請
    groupRejectApplicationRight.onClick = function(event){
        groupAcceptApplicationRight.visible = false;
        groupRejectApplicationRight.visible = false;
        textUserLeft.content = "A用戶";
        groupApplyQuestLeft.visible = true;
        groupDeleteQuestRight.visible = true;
        groupCancelApplicationLeft.visible = false;
    };
    //左方按下取消申請
    groupCancelApplicationLeft.onClick = function(event){
        groupCancelApplicationLeft.visible = false;
        groupAcceptApplicationRight.visible = false;
        groupRejectApplicationRight.visible = false;
        textUserLeft.content = "A用戶";
        groupApplyQuestLeft.visible = true;
        groupDeleteQuestRight.visible = true;
    };
    //右方按下取消申請
    groupCancelApplicationRight.onClick = function(event){
        groupCancelApplicationRight.visible = false;
        groupAcceptApplicationLeft.visible = false;
        groupRejectApplicationLeft.visible = false;
        textUserRight.content = "B用戶";
        groupApplyQuestRight.visible = true;
        groupDeleteQuestLeft.visible = true;
    };
};

//滑鼠進入按鈕
function onMouseEnterButtonItem(bgItem, textItem){
    function wrapper(event){
        bgItem.fillColor = "red";
        textItem.fillColor = "white";
    }
    return wrapper;
};
//滑鼠離開按鈕
function onMouseLeaveButtonItem(bgItem, textItem){
    function wrapper(event){
        bgItem.fillColor = "pink";
        textItem.fillColor = "black";
    }
    return wrapper;
};

//建構按鈕
function buildGroupButtonItem(strBtnContent, pointPosition, isVisible){
    //外框
    rectBtnItem = new Path.Rectangle({
        point: [0, 0],
        size: [150, 30],
        radius: 10,
        fillColor: "pink",
        strokeColor: "black",
        strokeWidth: 2,
    });
    //文字
    textBtnItem = new PointText({
        point: [rectBtnItem.bounds.width/2, rectBtnItem.bounds.height/2+3],
        justification: "center",
        content: strBtnContent,
        fillColor: "black",
        fontFamily: "MingLiU",
        fontWeight: "normal",
        fontSize: 20
    });
    //群組
    groupBtnItem = new Group({
        children: [rectBtnItem, textBtnItem],
        position: pointPosition,
        visible: isVisible,
    });
    //事件
    groupBtnItem.onMouseEnter = onMouseEnterButtonItem(rectBtnItem, textBtnItem);
    groupBtnItem.onMouseLeave = onMouseLeaveButtonItem(rectBtnItem, textBtnItem);
    return groupBtnItem;
};