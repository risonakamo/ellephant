const {ipcRenderer}=require("electron");

window.onload=main;

var _expFleets;

function main()
{
    setupInput();
    ipcReceivers();

    _expFleets=document.querySelectorAll("exp-fleet");
}

function setupInput()
{
    var goBt=document.querySelector(".go-bt");
    var urlBox=document.querySelector(".url-box");
    var inputWrap=document.querySelector(".input-wrap");
    var viewer=document.querySelector(".viewer");

    var sendWindowRequest=function(e){
        ipcRenderer.send("requestWindow",urlBox.value);
        inputWrap.parentNode.removeChild(inputWrap);
        viewer.classList.remove("collapse");
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
    for (var x=1;x<=3;x++)
    {
        if (port.api_data.api_deck_port[x].api_mission[0]==0)
        {
            _expFleets[x-1].clearExpedition();
            continue;
        }

        _expFleets[x-1].loadExp({
            expNum:port.api_data.api_deck_port[x].api_mission[1],
            timeComplete:port.api_data.api_deck_port[x].api_mission[2]
        });
    }
}