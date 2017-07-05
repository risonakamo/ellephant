const {app,BrowserWindow,ipcMain}=require("electron");
const fs=require("fs");
const process=require("process");
// const path=require("path");
// const url=require("url");

app.commandLine.appendSwitch("ppapi-flash-path",app.getPath("pepperFlashSystemPlugin"));

var _win; //main viewer window
var _gamewindow; //game window

var _apiLink; //string api link
var _appdata;
var _windowLocations;

function main()
{
    ipcs();
    windowRestore();

    var winops={width:776,height:620};

    if (_windowLocations.viewer)
    {
        winops.x=_windowLocations.viewer[0];
        winops.y=_windowLocations.viewer[1];
    }

    _win=new BrowserWindow(winops);

    _win.loadURL(`file://${__dirname}/viewer/index.html`);

    viewerEvents();
}

function receiveArb(par,channel)
{
    _gamewindow.webContents.debugger.sendCommand("Network.getResponseBody",{requestId:par.requestId},(err,res)=>{
        if (res.body==undefined)
        {
            setTimeout(()=>{receiveArb(par,channel)},500);
            return;
        }

        _win.webContents.send(channel,(JSON.parse(res.body.slice(7))));
    });
}

function ipcs()
{
    ipcMain.on("requestWindow",(e,args)=>{
        setupGameWindow(args);
    });

    ipcMain.on("requestAPI",(e,args)=>{
        e.sender.send("requestAPI",_apiLink);
    });

    ipcMain.on("gameKey",(e,res)=>{
        _win.webContents.send("gameKey",res);
    });
}

function viewerEvents()
{
    _win.on("close",(e)=>{
        windowClose(e);
    });
}

function windowRestore()
{
    _appdata=`${process.env["appdata"]}/kancollectron`;

    _windowLocations={};

    if (!fs.existsSync(`${_appdata}/User`) || !fs.existsSync(`${_appdata}/User/settings.json`))
    {
        fs.mkdirSync(`${_appdata}/User`);
    }

    else
    {
        _windowLocations=JSON.parse(fs.readFileSync(`${_appdata}/User/settings.json`));
    }
}

function saveWindow()
{
    var locations=_win.getBounds();

    _windowLocations.viewer=[];
    _windowLocations.viewer[0]=locations.x;
    _windowLocations.viewer[1]=locations.y;

    if (_gamewindow)
    {
        locations=_gamewindow.getBounds();
        _windowLocations.game=[];
        _windowLocations.game[0]=locations.x;
        _windowLocations.game[1]=locations.y;
    }

    else if (!_windowLocations.game)
    {
        _windowLocations.game=[];
        _windowLocations.game[0]=_windowLocations.viewer[0]+100;
        _windowLocations.game[1]=_windowLocations.viewer[1];
    }

    fs.writeFileSync(`${_appdata}/User/settings.json`,JSON.stringify(_windowLocations));
}

function setupGameWindow(args)
{
    _apiLink=args;

    var winops={width:816,height:539,webPreferences:{plugins:true}};

    if (_windowLocations.game)
    {
        winops.x=_windowLocations.game[0];
        winops.y=_windowLocations.game[1];
    }

    _gamewindow=new BrowserWindow(winops);

    _gamewindow.webContents.debugger.attach("1.2");

    _gamewindow.webContents.debugger.on("message",(e,method,par)=>{
        if (method=="Network.responseReceived")
        {
            if (par.response.url=="http://203.104.209.39/kcsapi/api_port/port")
            {
                setTimeout(()=>{receiveArb(par,"portinfo")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_get_member/deck")
            {
                setTimeout(()=>{receiveArb(par,"deckinfo")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_get_member/require_info")
            {
                setTimeout(()=>{receiveArb(par,"requireinfo")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_start2")
            {
                setTimeout(()=>{receiveArb(par,"apistart")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_req_hokyu/charge")
            {
                setTimeout(()=>{receiveArb(par,"charge")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_req_hensei/preset_select")
            {
                setTimeout(()=>{receiveArb(par,"presetLoad")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_get_member/practice")
            {
                setTimeout(()=>{receiveArb(par,"pvpUpdate")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_req_member/get_practice_enemyinfo")
            {
                setTimeout(()=>{receiveArb(par,"pvpFleet")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_req_practice/battle_result")
            {
                setTimeout(()=>{receiveArb(par,"pvpResult")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_get_member/ship_deck")
            {
                setTimeout(()=>{receiveArb(par,"shipdeck")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_get_member/ship3")
            {
                setTimeout(()=>{receiveArb(par,"shipEquip")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_get_member/ndock")
            {
                setTimeout(()=>{receiveArb(par,"ndock")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_req_map/start")
            {
                setTimeout(()=>{receiveArb(par,"sortiestart")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_get_member/kdock")
            {
                setTimeout(()=>{receiveArb(par,"constructiondock")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_req_kousyou/getship")
            {
                setTimeout(()=>{receiveArb(par,"getship")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_req_sortie/battleresult")
            {
                setTimeout(()=>{receiveArb(par,"sortieresult")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_req_kousyou/destroyitem2")
            {
                setTimeout(()=>{receiveArb(par,"scrapitem")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_req_kousyou/createitem")
            {
                setTimeout(()=>{receiveArb(par,"createitem")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_get_member/material")
            {
                setTimeout(()=>{receiveArb(par,"generalmaterial")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_req_kousyou/destroyship")
            {
                setTimeout(()=>{receiveArb(par,"scrapship")},500);
            }

            else if (par.response.url=="http://203.104.209.39/kcsapi/api_req_kousyou/remodel_slot")
            {
                setTimeout(()=>{receiveArb(par,"akashiupgrade")},500);
            }
        }

        else if (method=="Network.requestWillBeSent")
        {
            if (par.request.url=="http://203.104.209.39/kcsapi/api_req_hensei/change")
            {
                _win.webContents.send("change",decodeURIComponent(par.request.postData));
            }

            else if (par.request.url=="http://203.104.209.39/kcsapi/api_req_kaisou/slot_exchange_index")
            {
                _win.webContents.send("equipExchange",decodeURIComponent(par.request.postData));
            }

            else if (par.request.url=="http://203.104.209.39/kcsapi/api_req_kaisou/powerup")
            {
                _win.webContents.send("modernise",decodeURIComponent(par.request.postData));
            }

            else if (par.request.url=="http://203.104.209.39/kcsapi/api_req_kousyou/destroyitem2")
            {
                _win.webContents.send("scrapitemPost",decodeURIComponent(par.request.postData));
            }

            else if (par.request.url=="http://203.104.209.39/kcsapi/api_req_kousyou/createship_speedchange")
            {
                _win.webContents.send("instantcraft",decodeURIComponent(par.request.postData));
            }

            else if (par.request.url=="http://203.104.209.39/kcsapi/api_req_kousyou/destroyship")
            {
                _win.webContents.send("scrapshipPost",decodeURIComponent(par.request.postData));
            }

        }
    });

    _gamewindow.webContents.debugger.sendCommand("Network.enable");

    _gamewindow.loadURL(_apiLink);

    _gamewindow.webContents.executeJavaScript(`
        const {ipcRenderer}=require("electron");
        window.addEventListener("keypress",(e)=>{
            ipcRenderer.send("gameKey",e.key);
        });

        var flash=document.querySelector("embed");
        flash.width="800px";
        flash.height="480px";
    `);

    _gamewindow.on("close",(e)=>{
        windowClose(e);
    });
}

function windowClose(e)
{
    // e.preventDefault();
    saveWindow();
    app.quit();
}

app.on("ready",main);

// function receivePort(par)
// {
//     _gamewindow.webContents.debugger.sendCommand("Network.getResponseBody",{requestId:par.requestId},(err,res)=>{
//         if (res.body==undefined)
//         {
//             setTimeout(()=>{receivePort(par)},500);
//             return;
//         }

//         _win.webContents.send("portinfo",(JSON.parse(res.body.slice(7))));
//     });
// }

// function receiveDeck(par)
// {
//     _gamewindow.webContents.debugger.sendCommand("Network.getResponseBody",{requestId:par.requestId},(err,res)=>{
//         if (res.body==undefined)
//         {
//             setTimeout(()=>{receivePort(par)},500);
//             return;
//         }

//         _win.webContents.send("deckinfo",(JSON.parse(res.body.slice(7))));
//     });
// }

// function gameWindowDebugSetup()
// {
//     _gamewindow.webContents.debugger.attach("1.2");

//     _gamewindow.webContents.debugger.on("message",(e,method,par)=>{
//         if (method=="Network.responseReceived")
//         {
//             if (par.reponse.url=="http://203.104.209.39/kcsapi/api_port/port")
//             {
//                 _gamewindow.webContents.debugger.sendCommand("Network.getResponseBody",{requestId:par.requestId},(err,res)=>{
//                     console.log(res.body);
//                 });
//             }
//         }
//     });

//     _gamewindow.webContents.debugger.sendCommand("Network.enable");
// }

// function testDebug()
// {
//     _gamewindow=new BrowserWindow({width:800,height:600});

//     _gamewindow.webContents.debugger.attach("1.2");

//     _gamewindow.webContents.debugger.on("message",(e,met,par)=>{
//         if (met=="Network.responseReceived")
//         {
//             if (par.response.url=="https://electron.atom.io/docs/api/")
//             {
//                 _gamewindow.webContents.debugger.sendCommand("Network.getResponseBody",{requestId:par.requestId},(err,res)=>{
//                     console.log(err);
//                     console.log(res.body);
//                 });
//             }
//         }
//     });

//     _gamewindow.webContents.debugger.sendCommand("Network.enable");

//     _gamewindow.loadURL("https://electron.atom.io/docs/api/");
// }

