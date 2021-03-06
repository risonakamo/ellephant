const {ipcRenderer}=require("electron");

window.onload=main;

//objects
var pvp;
var construction;
var apiData=new _apiData;
var viewer;
var repair;
var fleetstat;
var shiplists;

//html element globals
var _expFleets; //array
var _fleetShips; //array
var _mFleet; //mainfleet
var _combineBox; //element

//array of arrays of ids of currently loaded fleetships and pvp opponents
//can be used to reload a fleetship
var _fleetShipIds;

//player api (from require info)
var _apiShip; //ships of player sorted by api id
var _apiShip_ready;
var _apiEquip; //equipment of player

//api Alls (from api start)
var _apistart_ready;
var _apiAllShip; //sorted by sort_no
var _apiAllEquip;
var _apiIdtoSort; //sorted by api_id, data is api_sort_no usable for apiAllShip

//please move this somewhere else...
var _combinedState;
var _remodelDelay;

function main()
{
    pvp=new _pvp;
    construction= new _construction;
    resource=new _resource;
    viewer= new _viewerHtml;
    repair=new _repair;
    fleetstat= new _fleetstat;
    shiplists=new _shiplists;

    _expFleets=document.querySelectorAll("exp-fleet");
    _fleetShips=document.querySelectorAll("fleet-ship");
    _mFleet=document.querySelector("m-fleet");
    _combineBox=document.querySelector(".combined-box");

    expBoxEvents();
}

function changeUpdate(data)
{
    var fleet=parseInt(data.api_id)-1;
    var idx=parseInt(data.api_ship_idx);
    var newShip=parseInt(data.api_ship_id);

    if (newShip==-1)
    {
        for (var x=idx;x<=4;x++)
        {
            _fleetShipIds[fleet][x]=_fleetShipIds[fleet][x+1];
        }

        _fleetShipIds[fleet][5]=-1;
    }

    else if (newShip==-2)
    {
        for (var x=1;x<6;x++)
        {
            _fleetShipIds[fleet][x]=-1;
        }
    }

    else
    {
        var oldShip=_fleetShipIds[fleet][idx];

        if (oldShip>=0)
        {
            (()=>{
                for (var x=0;x<4;x++)
                {
                    for (var y=0;y<6;y++)
                    {
                        if (_fleetShipIds[x][y]==newShip)
                        {
                            _fleetShipIds[x][y]=oldShip;
                            return;
                        }
                    }
                }
            })();
        }

        _fleetShipIds[fleet][idx]=newShip;
    }

    for (var x=0;x<4;x++)
    {
        updateFleetShip(_fleetShipIds[x],x);
    }
}

//main port update function to handle port requests
function portUpdate(port)
{
    if (_apistart_ready!=1)
    {
        setTimeout(()=>{portUpdate(port)},500);
        return;
    }

    apiData.portLevel=port.api_data.api_basic.api_level;

    viewer.tabState(0);

    expeditionUpdate(port.api_data.api_deck_port);

    processApiShip(port.api_data.api_ship);

    resource.loadPort(port.api_data);

    if (port.api_data.api_combined_flag!=undefined)
    {
        setCombined(port.api_data.api_combined_flag);
    }

    _fleetShipIds=[];
    for (var x=0;x<4;x++)
    {
        _fleetShipIds.push(port.api_data.api_deck_port[x].api_ship.slice());
        updateFleetShip(port.api_data.api_deck_port[x].api_ship,x);
    }

    repair.rDockUpdate(port.api_data.api_ndock);

    viewer.viewerShow();
}

//change combined state to something 0=not combined, 1,2,3=various combined formes
//set postchange to 1 to do some extra stuff that should happen when combinestate changes
//from a post call
function setCombined(state,postChange)
{
    _combinedState=state;
    _mFleet.setCombined(state);

    if (!state)
    {
        if (postChange)
        {
            fleetstat.fleetstat.los=0;
            fleetstat.combinedLOS(0);
        }

        _combineBox.classList.remove("carrier","surface","transport","show");
        _expFleets[0].classList.remove("combined");
    }

    else
    {
        if (postChange)
        {
            fleetstat.combinedLOS(1);
        }

        _expFleets[0].classList.add("combined");

        switch (state)
        {
            case 1:
            _combineBox.classList.add("carrier","show");
            break;

            case 2:
            _combineBox.classList.add("surface","show");
            break;

            case 3:
            _combineBox.classList.add("transport","show");
            break;

        }
    }
}

// function saveFleetShipIds(ships)
// {
//     var newfleet={};
//     for (var x=0;x<ships.length;x++)
//     {
//         if (ships[x]>=0)
//         {
//             newfleet[ships[x]]=0;
//         }
//     }

//     _fleetShipIds.push(newfleet);
// }

//parse array of raw api_ships into api ship object, where keys are ship id
function processApiShip(apiship)
{
    _apiShip_ready=0;
    _apiShip={};

    for (var x=0,l=apiship.length;x<l;x++)
    {
        _apiShip[apiship[x].api_id]=apiship[x];
    }

    _apiShip_ready=1;
}

//give face image id and fleet INDEX number (0-3)
function updateExpFace(fleet)
{
    if (fleet==0)
    {
        _mFleet.face=_fleetShips[0].face;
        return;
    }

    _expFleets[fleet-1].face=_fleetShips[fleet*6].face;
}

//ships is array of 6 ints from fleet,
//fleetcontain is the fleet number to be updated as index number
function updateFleetShip(ships,fleetContain)
{
    if (_apiShip_ready!=1)
    {
        setTimeout(()=>{updateFleetShip(ships,fleetContain)},100);
        return;
    }

    ships=ships.slice();
    for (var x=0;x<6;x++)
    {
        if (ships[x]==-1)
        {
            continue;
        }

        ships[x]=_apiShip[ships[x]];
    }

    var fleetNumber=fleetContain; //index fleet number
    fleetContain*=6; //index number fleetShip in fleetShip array

    var resupply=0;
    var maxFatigue=0;
    var fleetAirPower=[0,0];
    var los=0;

    for (var x=0;x<6;x++)
    {
        if (ships[x]==-1)
        {
            _fleetShips[fleetContain].unload();

            if (fleetNumber==0)
            {
                los+=2;
            }
        }

        else
        {
            _fleetShips[fleetContain].loadShip(ships[x]);

            //set resupply flag if ship needs resupply, skip check if resupply
            //flag already set
            if (resupply==0 &&
                (_fleetShips[fleetContain].curAmmo<_fleetShips[fleetContain].maxAmmo
                || _fleetShips[fleetContain].curGas<_fleetShips[fleetContain].maxGas))
            {
                resupply=1;
            }

            //save max fatigue (difference from 49)
            if (49-_fleetShips[fleetContain].morale>maxFatigue)
            {
                maxFatigue=49-_fleetShips[fleetContain].morale;
            }

            if (fleetNumber==0)
            {
                fleetAirPower[0]+=_fleetShips[fleetContain].airPower[0];
                fleetAirPower[1]+=_fleetShips[fleetContain].airPower[1];
                los+=_fleetShips[fleetContain].los;
            }
        }

        //next ship
        fleetContain++;
    }

    //if first fleet, actions
    if (fleetNumber==0)
    {
        _mFleet.oldMoraleVal=_mFleet.moraleVal;
        _mFleet.moraleVal=maxFatigue;

        fleetstat.fleetstat.airPowerMin=fleetAirPower[0];
        fleetstat.fleetstat.airPowerMax=fleetAirPower[1];
        fleetstat.fleetstat.los=(los-Math.ceil(.4*apiData.portLevel)).toFixed(3);
    }

    if (_combinedState && fleetNumber==1)
    {
        fleetstat.combinedLOS(1);
    }

    updateFleetSupply(fleetNumber,resupply);
    updateExpFace(fleetNumber);
}

//needs to be given api_deck_port from the port object, an array
function expeditionUpdate(data)
{
    var foundComplete=0;
    for (var x=1;x<=3;x++)
    {
        if (data[x].api_mission[0]==0)
        {
            _expFleets[x-1].clearExpedition();
            continue;
        }

        _expFleets[x-1].loadExp({
            expNum:data[x].api_mission[1],
            timeComplete:data[x].api_mission[2],
            maxTime:apiData.apiAllExpedition[data[x].api_mission[1]].api_time
        });

        if (_expFleets[x-1].completed==1)
        {
            viewer.tabState(2);
            foundComplete=1;
        }
    }

    if (foundComplete==0)
    {
        viewer.tabState(0);
    }
}

function chargeUpdate(data)
{
    //for every ship given by data, update corresponding ship in
    //player api object _apiShip
    for (var x=0,l=data.api_data.api_ship.length;x<l;x++)
    {
        //loop over properties since charge object only provides bullet and
        //ammo and not whole object (cannot set)
        for (var y in data.api_data.api_ship[x])
        {
            if (y=="api_id")
            {
                continue;
            }

            _apiShip[data.api_data.api_ship[x].api_id][y]=data.api_data.api_ship[x][y];
        }
    }

    var fleet=findShip(data.api_data.api_ship[0].api_id);

    if (fleet[0]>=0)
    {
        updateFleetShip(_fleetShipIds[fleet[0]],fleet[0]);
    }

    resource.loadCharge(data.api_data.api_material);

    // var update=[-1,-1,-1,-1,-1,-1];
    // for (var x=0,l=data.api_data.api_ship.length;x<l;x++)
    // {
    //     update[x]=data.api_data.api_ship[x].api_id;
    // }

    // for (var x=0;x<=24;x+=6)
    // {
    //     if (_fleetShips[x].shipId==data.api_data.api_ship[0].api_id)
    //     {
    //         updateFleetShip(update,x/6);
    //         return;
    //     }
    // }
}


function expBoxEvents()
{
    var slider=document.querySelector(".fleet-slider");
    _expFleets.forEach((x,i)=>{
        x.addEventListener("click",(e)=>{
            viewer.switchFleet(i+1);
        });

        x.addEventListener("complete",(e)=>{
            viewer.tabState(2);
        });
    });

    _mFleet.addEventListener("click",(e)=>{
        viewer.switchFleet(0);
    });
}

function updateFleetSupply(fleet,resupply)
{
    if (fleet==0)
    {
        _mFleet.setState(resupply);
    }

    else
    {
        _expFleets[fleet-1].supplyState(resupply);
    }
}

function deckUpdate(data)
{
    for (var x=0;x<data.api_ship_data.length;x++)
    {
        _apiShip[data.api_ship_data[x].api_id]=data.api_ship_data[x];
    }

    for (var x=0;x<data.api_deck_data.length;x++)
    {
        updateFleetShip(data.api_deck_data[x].api_ship,data.api_deck_data[x].api_id-1);
    }
}

//requires ship object (object that has all ship stats and api_id directly in it)
//for ship3 its going to be (ship3 response)api_data.api_ship_data[0]
function equipUpdate(data)
{
    _apiShip[data.api_id]=data;

    //if a remodel occured, don't update anything because there
    //will be missing equipment.
    if (_remodelDelay)
    {
        _remodelDelay=0;
        return;
    }

    var shipfind=findShip(data.api_id);

    if (shipfind[0]<0)
    {
        return;
    }

    var fleet=shipfind[0];
    shipfind=(6*shipfind[0])+shipfind[1];

    if (shipfind<6 || (_combinedState>0 && shipfind<12))
    {
        fleetstat.equipChangeRemove(_fleetShips[shipfind],fleet);
    }

    _fleetShips[shipfind].loadShip(data);

    if (shipfind<6 || (_combinedState>0 && shipfind<12))
    {
        fleetstat.equipChangeAdd(_fleetShips[shipfind],fleet);
    }
}

//attempts to find give api_id (player ship id) in current loaded fleets
//returns fleet number (index) and position (index) in fleet as [array]
function findShip(id)
{
    id=parseInt(id);
    for (var x=0;x<4;x++)
    {
        for (var y=0;y<_fleetShipIds[x].length;y++)
        {
            if (_fleetShipIds[x][y]==id)
            {
                return [x,y];
            }
        }
    }

    return [-1,-1];
}

function equipExchange(data)
{
    data.api_id=parseInt(data.api_id);
    switchEquipment(data.api_id,parseInt(data.api_src_idx),parseInt(data.api_dst_idx));

    var shipfind=findShip(data.api_id);

    if (shipfind[0]==-1)
    {
        return;
    }

    var fleet=shipfind[0];
    shipfind=(6*shipfind[0])+shipfind[1];

    if (shipfind<6 || (_combinedState>0 && shipfind<12))
    {
        fleetstat.equipChangeRemove(_fleetShips[shipfind],fleet);
    }

    _fleetShips[shipfind].loadShip(_apiShip[data.api_id]);

    if (shipfind<6 || (_combinedState>0 && shipfind<12))
    {
        fleetstat.equipChangeAdd(_fleetShips[shipfind],fleet);
    }
}

//parse api post data into object, give it the
//full unsplit string
function parsePost(res)
{
    res=res.split("&");
    var data={};
    var t;

    for (var x=0;x<res.length;x++)
    {
        t=res[x].split("=");
        data[t[0]]=t[1];
    }

    return data;
}

function switchEquipment(id,src,dst)
{
    var t=_apiShip[id].api_slot[src];
    _apiShip[id].api_slot[src]=_apiShip[id].api_slot[dst];
    _apiShip[id].api_slot[dst]=t;
}

// function sortieState(state)
// {
//     if (state==0)
//     {
//         viewer.tabBar.classList.remove("sortie");
//         _mFleet.setState(0);
//     }

//     else
//     {
//         viewer.tabBar.classList.add("sortie");
//         _mFleet.setState(2);
//     }
// }

//requires entire ship object (needs to see hp values)
function genFaceFile(ship)
{
    if (ship.api_nowhp/ship.api_maxhp>.5)
    {
        return `../face/${ship.api_ship_id}.png`;
    }

    return `../face-d/${ship.api_ship_id}.png`;
}