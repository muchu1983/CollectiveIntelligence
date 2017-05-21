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
//用戶
var textUserLeft = null;
var textUserRight = null;
//任務
var groupQuest = null;
var textQuestState = null;
var rasterQuestNew = null;
var rasterQuestMatching = null;
var rasterQuestProcessing = null;
var rasterQuestComplete = null;
var rasterQuestIncomplete = null;
var rasterQuestEndSuccess = null;
var rasterQuestEndFailure = null;
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
//成功達成目標 
var groupQuestReachedLeft = null;
var groupQuestReachedRight = null;
//終結任務
var groupTerminateQuestLeft = null;
var groupTerminateQuestRight = null;
//放棄任務
var groupAbandonQuestLeft = null;
var groupAbandonQuestRight = null;
//完成任務
var groupAccomplishQuestLeft = null;
var groupAccomplishQuestRight = null;
//任務已失敗
var groupQuestUnreachableLeft = null;
var groupQuestUnreachableRight = null;
//重置
var groupReset = null;

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
        point: [view.size.width/4, 100],
        justification: "center",
        content: "A用戶",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 28
    });
    textUserRight = new PointText({
        point: [view.size.width/4, 100],
        justification: "center",
        content: "B用戶",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 28
    });
    //用戶圖示
    rasterUserLeft = new Raster("iconUser");
    rasterUserLeft.position = [100, 100];
    rasterUserRight = new Raster("iconUser");
    rasterUserRight.position = [view.size.width/2 - 100, 100];
    //任務外框
    circleQuest = new Path.Circle({
        center: view.center,
        radius: view.size.height/4,
        strokeColor: "black",
        fillColor: "lightgoldenrodyellow",
        strokeWidth: 2,
    });
    
    //任務文字
    textQuestTitle = new PointText({
        point: view.center-[0, view.size.height/4-20],
        justification: "center",
        content: "任務",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 18
    });
    textQuestState = new PointText({
        point: view.center+[0, view.size.height/4-20],
        justification: "center",
        content: "",
        fillColor: "black",
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 18
    });
    
    //群組
    groupUserLeft = new Group({
        children: [rectUserLeft, textUserLeft, rasterUserLeft],
        position: [view.size.width*1/4, view.size.height/2],
        visible: true,
    });
    groupUserRight = new Group({
        children: [rectUserRight, textUserRight, rasterUserRight],
        position: [view.size.width*3/4, view.size.height/2],
        visible: true,
    });
    groupQuest = new Group({
        children: [circleQuest, textQuestTitle, textQuestState],
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
    //成功達成目標 按鈕
    groupQuestReachedLeft = buildGroupButtonItem("成功達成目標", [view.size.width*1/4, view.size.height/2], false);
    groupQuestReachedRight = buildGroupButtonItem("成功達成目標", [view.size.width*3/4, view.size.height/2], false);
    //終結任務 按鈕
    groupTerminateQuestLeft = buildGroupButtonItem("終結任務", [view.size.width*1/4, view.size.height/2+50], false);
    groupTerminateQuestRight = buildGroupButtonItem("終結任務", [view.size.width*3/4, view.size.height/2+50], false);
    //放棄任務 按鈕
    groupAbandonQuestLeft = buildGroupButtonItem("放棄任務", [view.size.width*1/4, view.size.height/2], false);
    groupAbandonQuestRight = buildGroupButtonItem("放棄任務", [view.size.width*3/4, view.size.height/2], false);
    //完成任務 按鈕
    groupAccomplishQuestLeft = buildGroupButtonItem("完成任務", [view.size.width*1/4, view.size.height/2], false);
    groupAccomplishQuestRight = buildGroupButtonItem("完成任務", [view.size.width*3/4, view.size.height/2], false);
    //任務已失敗 按鈕
    groupQuestUnreachableLeft = buildGroupButtonItem("任務已失敗", [view.size.width*1/4, view.size.height/2], false);
    groupQuestUnreachableRight = buildGroupButtonItem("任務已失敗", [view.size.width*3/4, view.size.height/2], false);
    //重置 按鈕
    groupReset = buildGroupButtonItem("重置", [view.size.width*1/2, view.size.height-50], false);
    //任務圖示
    rasterQuestNew = new Raster("iconQuestStateNew");
    rasterQuestNew.position = view.center;
    rasterQuestNew.visible = false;
    rasterQuestMatching = new Raster("iconQuestStateMatching");
    rasterQuestMatching.position = view.center;
    rasterQuestMatching.visible = false;
    rasterQuestProcessing = new Raster("iconQuestStateProcessing");
    rasterQuestProcessing.position = view.center;
    rasterQuestProcessing.visible = false;
    rasterQuestComplete = new Raster("iconQuestStateComplete");
    rasterQuestComplete.position = view.center;
    rasterQuestComplete.visible = false;
    rasterQuestIncomplete = new Raster("iconQuestStateIncomplete");
    rasterQuestIncomplete.position = view.center;
    rasterQuestIncomplete.visible = false;
    rasterQuestEndSuccess = new Raster("iconQuestStateEndSuccess");
    rasterQuestEndSuccess.position = view.center;
    rasterQuestEndSuccess.visible = false;
    rasterQuestEndFailure = new Raster("iconQuestStateEndFailure");
    rasterQuestEndFailure.position = view.center;
    rasterQuestEndFailure.visible = false;
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
        rasterQuestNew.visible = true;
        textQuestState.content = "尚無人申請";
    };
    //右方按下發起任務
    groupInitQuestRight.onClick = function(event){
        groupQuest.visible = true;
        groupInitQuestLeft.visible = false;
        groupInitQuestRight.visible = false;
        textUserRight.content = "發起人-B用戶";
        groupDeleteQuestRight.visible = true;
        groupApplyQuestLeft.visible = true;
        rasterQuestNew.visible = true;
        textQuestState.content = "尚無人申請";
    };
    //左方按下刪除任務
    groupDeleteQuestLeft.onClick = function(event){
        groupQuest.visible = false;
        groupInitQuestLeft.visible = true;
        groupInitQuestRight.visible = true;
        textUserLeft.content = "A用戶";
        groupDeleteQuestLeft.visible = false;
        groupApplyQuestRight.visible = false;
        rasterQuestNew.visible = false;
        textQuestState.content = "";
    };
    //右方按下刪除任務
    groupDeleteQuestRight.onClick = function(event){
        groupQuest.visible = false;
        groupInitQuestLeft.visible = true;
        groupInitQuestRight.visible = true;
        textUserRight.content = "B用戶";
        groupDeleteQuestRight.visible = false;
        groupApplyQuestLeft.visible = false;
        rasterQuestNew.visible = false;
        textQuestState.content = "";
    };
    //左方按下申請執行任務
    groupApplyQuestLeft.onClick = function(event){
        textUserLeft.content = "A用戶-執行人";
        groupDeleteQuestRight.visible = false;
        groupApplyQuestLeft.visible = false;
        groupAcceptApplicationRight.visible = true;
        groupRejectApplicationRight.visible = true;
        groupCancelApplicationLeft.visible = true;
        rasterQuestNew.visible = false;
        rasterQuestMatching.visible = true;
        textQuestState.content = "配對中";
    };
    //右方按下申請執行任務
    groupApplyQuestRight.onClick = function(event){
        textUserRight.content = "B用戶-執行人";
        groupDeleteQuestLeft.visible = false;
        groupApplyQuestRight.visible = false;
        groupAcceptApplicationLeft.visible = true;
        groupRejectApplicationLeft.visible = true;
        groupCancelApplicationRight.visible = true;
        rasterQuestNew.visible = false;
        rasterQuestMatching.visible = true;
        textQuestState.content = "配對中";
    };
    //左方按下拒絕申請
    groupRejectApplicationLeft.onClick = function(event){
        groupAcceptApplicationLeft.visible = false;
        groupRejectApplicationLeft.visible = false;
        textUserRight.content = "B用戶";
        groupApplyQuestRight.visible = true;
        groupDeleteQuestLeft.visible = true;
        groupCancelApplicationRight.visible = false;
        rasterQuestNew.visible = true;
        rasterQuestMatching.visible = false;
        textQuestState.content = "尚無人申請";
    };
    //右方按下拒絕申請
    groupRejectApplicationRight.onClick = function(event){
        groupAcceptApplicationRight.visible = false;
        groupRejectApplicationRight.visible = false;
        textUserLeft.content = "A用戶";
        groupApplyQuestLeft.visible = true;
        groupDeleteQuestRight.visible = true;
        groupCancelApplicationLeft.visible = false;
        rasterQuestNew.visible = true;
        rasterQuestMatching.visible = false;
        textQuestState.content = "尚無人申請";
    };
    //左方按下取消申請
    groupCancelApplicationLeft.onClick = function(event){
        groupCancelApplicationLeft.visible = false;
        groupAcceptApplicationRight.visible = false;
        groupRejectApplicationRight.visible = false;
        textUserLeft.content = "A用戶";
        groupApplyQuestLeft.visible = true;
        groupDeleteQuestRight.visible = true;
        rasterQuestNew.visible = true;
        rasterQuestMatching.visible = false;
        textQuestState.content = "尚無人申請";
    };
    //右方按下取消申請
    groupCancelApplicationRight.onClick = function(event){
        groupCancelApplicationRight.visible = false;
        groupAcceptApplicationLeft.visible = false;
        groupRejectApplicationLeft.visible = false;
        textUserRight.content = "B用戶";
        groupApplyQuestRight.visible = true;
        groupDeleteQuestLeft.visible = true;
        rasterQuestNew.visible = true;
        rasterQuestMatching.visible = false;
        textQuestState.content = "尚無人申請";
    };
    //左方按下接受申請
    groupAcceptApplicationLeft.onClick = function(event){
        groupAcceptApplicationLeft.visible = false;
        groupRejectApplicationLeft.visible = false;
        groupCancelApplicationRight.visible = false;
        groupAbandonQuestRight.visible = true;
        groupQuestReachedLeft.visible = true;
        groupTerminateQuestLeft.visible = true;
        rasterQuestMatching.visible = false;
        rasterQuestProcessing.visible = true;
        textQuestState.content = "正在執行中";
    };
    //右方按下接受申請
    groupAcceptApplicationRight.onClick = function(event){
        groupAcceptApplicationRight.visible = false;
        groupRejectApplicationRight.visible = false;
        groupCancelApplicationLeft.visible = false;
        groupAbandonQuestLeft.visible = true;
        groupQuestReachedRight.visible = true;
        groupTerminateQuestRight.visible = true;
        rasterQuestMatching.visible = false;
        rasterQuestProcessing.visible = true;
        textQuestState.content = "正在執行中";
    };
    //左方按下放棄任務
    groupAbandonQuestLeft.onClick = function(event){
        groupAbandonQuestLeft.visible = false;
        groupQuestReachedRight.visible = false;
        groupTerminateQuestRight.visible = false;
        textUserLeft.content = "A用戶";
        groupApplyQuestLeft.visible = true;
        groupDeleteQuestRight.visible = true;
        rasterQuestProcessing.visible = false;
        rasterQuestNew.visible = true;
        textQuestState.content = "尚無人申請";
    };
    //右方按下放棄任務
    groupAbandonQuestRight.onClick = function(event){
        groupAbandonQuestRight.visible = false;
        groupQuestReachedLeft.visible = false;
        groupTerminateQuestLeft.visible = false;
        textUserRight.content = "B用戶";
        groupApplyQuestRight.visible = true;
        groupDeleteQuestLeft.visible = true;
        rasterQuestProcessing.visible = false;
        rasterQuestNew.visible = true;
        textQuestState.content = "尚無人申請";
    };
    
    //左方按下成功達成目標
    groupQuestReachedLeft.onClick = function(event){
        groupQuestReachedLeft.visible = false;
        groupTerminateQuestLeft.visible = false;
        groupAbandonQuestRight.visible = false;
        groupAccomplishQuestRight.visible = true;
        rasterQuestProcessing.visible = false;
        rasterQuestComplete.visible = true;
        textQuestState.content = "目標達成";
    };
    //右方按下成功達成目標
    groupQuestReachedRight.onClick = function(event){
        groupQuestReachedRight.visible = false;
        groupTerminateQuestRight.visible = false;
        groupAbandonQuestLeft.visible = false;
        groupAccomplishQuestLeft.visible = true;
        rasterQuestProcessing.visible = false;
        rasterQuestComplete.visible = true;
        textQuestState.content = "目標達成";
    };
    //左方按下終結任務
    groupTerminateQuestLeft.onClick = function(event){
        groupTerminateQuestLeft.visible = false;
        groupQuestReachedLeft.visible = false;
        groupAbandonQuestRight.visible = false;
        groupQuestUnreachableRight.visible = true;
        rasterQuestProcessing.visible = false;
        rasterQuestIncomplete.visible = true;
        textQuestState.content = "目標已無法達成";
    };
    //右方按下終結任務
    groupTerminateQuestRight.onClick = function(event){
        groupTerminateQuestRight.visible = false;
        groupQuestReachedRight.visible = false;
        groupAbandonQuestLeft.visible = false;
        groupQuestUnreachableLeft.visible = true;
        rasterQuestProcessing.visible = false;
        rasterQuestIncomplete.visible = true;
        textQuestState.content = "目標已無法達成";
    };
    //左方按下完成任務
    groupAccomplishQuestLeft.onClick = function(event){
        groupAccomplishQuestLeft.visible = false;
        groupReset.visible = true;
        rasterQuestComplete.visible = false;
        rasterQuestEndSuccess.visible = true;
        textQuestState.content = "已終結-成功";
    };
    //右方按下完成任務
    groupAccomplishQuestRight.onClick = function(event){
        groupAccomplishQuestRight.visible = false;
        groupReset.visible = true;
        rasterQuestComplete.visible = false;
        rasterQuestEndSuccess.visible = true;
        textQuestState.content = "已終結-成功";
    };
    //左方按下任務已失敗
    groupQuestUnreachableLeft.onClick = function(event){
        groupQuestUnreachableLeft.visible = false;
        groupReset.visible = true;
        rasterQuestIncomplete.visible = false;
        rasterQuestEndFailure.visible = true;
        textQuestState.content = "已終結-失敗";
    };
    //右方按下任務已失敗
    groupQuestUnreachableRight.onClick = function(event){
        groupQuestUnreachableRight.visible = false;
        groupReset.visible = true;
        rasterQuestIncomplete.visible = false;
        rasterQuestEndFailure.visible = true;
        textQuestState.content = "已終結-失敗";
    };
    //按下重置
    groupReset.onClick = function(event){
        groupReset.visible = false;
        groupQuest.visible = false;
        groupInitQuestLeft.visible = true;
        groupInitQuestRight.visible = true;
        textUserLeft.content = "A用戶";
        textUserRight.content = "B用戶";
        rasterQuestEndSuccess.visible = false;
        rasterQuestEndFailure.visible = false;
        textQuestState.content = "";
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