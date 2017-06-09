const {ipcRenderer}=require("electron");

window.onload=main;

var _expFleets;
var _fleetShips;
var _apiShip;

function main()
{
    setupInput();
    ipcReceivers();

    _expFleets=document.querySelectorAll("exp-fleet");
    _fleetShips=document.querySelectorAll("fleet-ship");
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

    if (_apiShip==undefined)
    {
        processApiShip(port.api_data.api_ship);
    }

    updateFleetShip(port.api_data.api_deck_port[0].api_ship);
}

function processApiShip(apiship)
{
    _apiShip={};

    for (var x=0,l=apiship.length;x<l;x++)
    {
        _apiShip[apiship[x].api_id]=apiship[x];
    }
}

//ships is array of 6 from fleet
function updateFleetShip(ships)
{
    for (var x=0;x<6;x++)
    {
        ships[x]=_apiShip[ships[x]];
    }

    for (var x=0;x<6;x++)
    {
        _fleetShips[x].loadShip({
            maxHp:ships[x].api_maxhp,
            curHp:ships[x].api_nowhp,
            level:ships[x].api_lv,
            face:`face/${ships[x].api_ship_id}.png`,
            morale:ships[x].api_cond
        });
    }
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