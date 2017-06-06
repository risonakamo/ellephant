const {BrowserWindow}=require("electron").remote;

var _gameWindow;

window.onload=main;

function main()
{
    var goBt=document.querySelector(".go-bt");
    var urlBox=document.querySelector(".url-box");

    goBt.addEventListener("click",(e)=>{
        _gameWindow=new BrowserWindow({width:800,height:600});
        _gameWindow.loadURL(urlBox.value);
    });
}
