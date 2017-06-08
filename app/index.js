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

    ipcRenderer.on("deckinfo",(err,res)=>{
        expeditionUpdate(res.api_data);
    });
}

function portUpdate(port)
{
    expeditionUpdate(port.api_data.api_deck_port);
}

//needs to be given api_deck_port from the port object, an array
function expeditionUpdate(data)
{
    for (var x=1;x<=3;x++)
    {
        if (data[x].api_mission[0]==0)
        {
            _expFleets[x-1].clearExpedition();
            continue;
        }

        _expFleets[x-1].loadExp({
            expNum:data[x].api_mission[1],
            timeComplete:data[x].api_mission[2]
        });
    }    
}