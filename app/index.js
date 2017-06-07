const {ipcRenderer}=require("electron");

window.onload=main;

function main()
{
    setupInput();
    ipcReceivers();
}

function setupInput()
{
    var goBt=document.querySelector(".go-bt");
    var urlBox=document.querySelector(".url-box");
    var inputWrap=document.querySelector(".input-wrap");

    var sendWindowRequest=function(e){
        ipcRenderer.send("requestWindow",urlBox.value);
        inputWrap.parentNode.removeChild(inputWrap);
    };

    goBt.addEventListener("click",sendWindowRequest);

    urlBox.addEventListener("keypress",(e)=>{
        if (e.key=="Enter")
        {
            e.preventDefault();
            sendWindowRequest();
        }
    });
}

function ipcReceivers()
{
    ipcRenderer.on("portinfo",(err,res)=>{
        portUpdate(res);
    });
}

function portUpdate(port)
{

}