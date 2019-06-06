var map=new Array(),
    timer="",
    map_height=20,
    map_width=20,
    mine_count=40,
    clean_count=0,
    sign_count=0,
    second_count=0;

function CreateMapData(){
    if(mine_count>(map_height*map_width))
        return false;
    for(var i=0;i<map_height;i++){
        map[i]=new Array();
        for(var j=0;j<map_width;j++){
            map[i][j]=0;
        }
    }
    var x=[0,0,1,1,1,-1,-1,-1],
        y=[1,-1,1,0,-1,1,0,-1];
    for(var i=0;i<mine_count;i++){
        do{
            var h=Math.floor(Math.random()*map_height),
                w=Math.floor(Math.random()*map_width);
        }while(map[h][w]==-1);
        map[h][w]=-1;
        for(var j=0;j<8;j++){
            var _h=h+x[j],_w=w+y[j];
            if(0<=_h&&_h<map_height&&0<=_w&&_w<map_width){
                if(map[_h][_w]!=-1){
                    map[_h][_w]++;
                }
            }
        }
    }
    return true;
}
function InitUI(){
    $("#map").empty();
    var height=map_height*31+1,
        width=map_width*31+1;
    $("#map").css("height",height);
    $("#map").css("width",width);
    $("#content").css("height",height);
    $("#content").css("width",width+305);
    $("#content").css("margin-top",-height/2);
    $("#content").css("margin-left",-(width+305)/2);
    for(var height=0;height<map_height;height++){
        for(var width=0;width<map_width;width++){
            $("#map").append("<div class=\"grid\" id=\""+height+"_"+width+"\"\
            onclick=\"Clean("+height+","+width+");\" \
            ondblclick=\"clearTimeout(tmptimer);\" \
            oncontextmenu=\"Mark("+height+","+width+");return false;\"></div>");
        }
    }
}
function InitData(){
    clean_count=0;
    sign_count=0;
    second_count=0;
    $("#mine_count").html(mine_count);
    $("#sign_count").html(sign_count);
    $("#second_count").html(second_count+" S");
}
function GameStart(){
    if(timer){
        clearInterval(timer);
    }
    if(CreateMapData()==false){
        alert("失败，mine_count数据太大");
        return;
    }
    InitUI();
    InitData();
}
var tmptimer;
function Clean(height,width){
    clearTimeout(tmptimer);
    tmptimer = setTimeout(function() {
        if(map[height][width]==-1){
            GameOver();
            return;
        }
        if(second_count==0){
            timer=setInterval(function(){
                second_count++;
                $("#second_count").html(second_count+" S");
            },1000);
        }
        _Clean(height,width);
    }, 250);
}
function _Clean(height,width){
    var grid=height.toString()+"_"+width.toString();
    if("none"!=$("#"+grid).css("background-image")){
        sign_count--;
        $("#sign_count").html(sign_count);
    }
    if("rgb(255, 255, 255)"==$("#"+grid).css("background-color")){
        return;
    }
    clean_count++;
    if(clean_count==(map_height*map_width-mine_count)){
        GameOver();
        return;
    }
    $("#"+grid).css("background-image","none");
    $("#"+grid).css("background-color","white");
    if(map[height][width]>0){
        _CleanNumColor(height,width,grid);
    }else if(map[height][width]==0){
        var x=[0,0,1,1,1,-1,-1,-1],
            y=[1,-1,1,0,-1,1,0,-1];
        for(var i=0;i<8;i++){
            if((0<=height+x[i])&&(height+x[i]<map_height)&&(0<=width+y[i])&&(width+y[i]<map_width)){
                _Clean(height+x[i],width+y[i]);
            }
        }
    }
}
function _CleanNumColor(height,width,grid){
    var color="";
    switch(map[height][width]){
        case 1:color="blue";break;
        case 2:color="green";break;
        case 3:color="red";break;
        case 4:color="cyan";break;
        case 5:color="darkred";break;
        case 6:color="yellow";break;
        case 7:color="orange";break;
        case 8:color="olive";break;
    }
    $("#"+grid).css("color",color);
    $("#"+grid).html(map[height][width]);
}
function SetNewData(){
    var height=parseInt($("#map_height").val(),10),
        width=parseInt($("#map_width").val(),10),
        mine=parseInt($("#mine").val(),10);
    if(width<12||width>100){
        alert("宽度应在12-100范围内!");
        return;
    }else if(height<12||height>100){
        alert("高度应在12-100范围内!");
        return;
    }else if(mine<=0||mine>(height*width)){
        alert("地雷数量不正确!");
        return;
    }
    $('#option').hide();
    map_height=height;
    map_width=width;
    mine_count=mine;
    GameStart();
}
function Mark(height,width){
    var grid=height.toString()+"_"+width.toString();
    if("rgb(255, 255, 255)"!=$("#"+grid).css("background-color")){
        if("none"==$("#"+grid).css("background-image")){
            $("#"+grid).css("background-image","url(./images/flag.png)");
            sign_count++;
        }else{
            $("#"+grid).css("background-image","none");
            sign_count--;
        }
        $("#sign_count").html(sign_count);
    }
}
function GameOver(){
    clearInterval(timer);
    for(var height=0;height<map_height;height++){
        for(var width=0;width<map_width;width++){
            var grid=height.toString()+"_"+width.toString();
            $("#"+grid).css("background-image","none");
            $("#"+grid).css("background-color","white");
            if(map[height][width]>0){
                _CleanNumColor(height,width,grid);
            }else if(map[height][width]==-1){
                $("#"+grid).css("background-image","url(./images/mine.png)");
            }
        }
    }
    if(clean_count==(map_height*map_width-mine_count)){
        alert("你赢了!");
    }else{
        alert("你失败了!");
    }
}

$(function(){
    $(document).ready(function(){
        GameStart();
    });
});