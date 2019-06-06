# Game_MineSweeper
HTML5扫雷游戏(HTML5 MineSweeper Game)
>## 关键点

>### 界面的居中显示
&emsp;&emsp;界面居中显示使用了absolute或者fixed值的position来实现的，假设元素的宽度为width，高度为height，先让元素的top和left值都为50%，这样元素的左上角就在正中间了，再让元素的margin-top为-height/2和margin-left为-width/2，这样元素就位于正中间了。
>### 后台计时及禁用双击事件
&emsp;&emsp;由于开始计时和结束计时在不同的函数中，所以要把计时的变量地址存为全局变量，开始计时用代码timer=setInterval(function(){代码},时间间隔);而清除计时用clearInterval(timer)函数。只有在第一次鼠标左键点击时开始计时，清除计时的情况有2种，第一种是游戏结束（游戏胜利／失败），第二种是开始游戏时候（或者重新开始游戏）。  
&emsp;&emsp;这里的难点在于双击竟然会触发onclick这个单机事件！！！导致执行了两遍函数也就开了两个计时器，计时时间变两倍，自然在清除计时器的时候还有一个计时器未被清除一直在计时，引发这两个BUG。对于某些手速快的人来说比较致命。Onmouseup和onclick效果一样没有用，貌似不能直接禁用鼠标双击事件，只能通过增加延时的方法来解决，原来就是双击的时候会执行两次单击函数和一次双击函数，单击函数启动两个延时程序，双击函数会清除掉一个延时，那么就剩下一个延时程序，也就只执行一次延时程序里面的代码：  
```
var tmptimer;
function click(){
    clearTimeout(tmptimer);
    tmptimer=setTimeout(function(){
        //单击事件执行的代码
    },250);
}
function dblcilck(){
    clearTimeout(tmptimer);
}
```
>### 阻止默认事件
&emsp;&emsp;在浏览器窗口点击鼠标右键会出现右键菜单,我们需要的效果是单击右键标记／取消标记而且不弹出右键菜单，解决方法是在函数后面加入一个return false。return false可以阻止默认事件，这里阻止原本的鼠标右键事件。
```
<div oncontextmenu=”Mark(height,width);return false;”></div>
```
