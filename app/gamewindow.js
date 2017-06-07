const {ipcRenderer}=require("electron");

window.onload=main;

function main()
{
    ipcRenderer.send("requestAPI");

    ipcRenderer.on("requestAPI",(e,arg)=>{
        var player=document.querySelector(".player");
        
        player.innerHTML=`<embed name="plugin" id="plugin" type="application/x-shockwave-flash" width="100%" height="100%" src=${arg}>`;
    });
}