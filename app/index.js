const {ipcRenderer}=require("electron");

window.onload=main;

function main()
{
    var goBt=document.querySelector(".go-bt");
    var urlBox=document.querySelector(".url-box");

    goBt.addEventListener("click",(e)=>{
        ipcRenderer.send("requestWindow",urlBox.value);
    });

    var land=document.querySelector(".land");
    ipcRenderer.on("portinfo",(err,res)=>{
        land.innerHTML=res;
    });
}
