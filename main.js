const {app,BrowserWindow,ipcMain,Tray}=require("electron");
const fs=require("fs");
const process=require("process");
// const path=require("path");
// const url=require("url");

// console.log(app.getPath("pepperFlashSystemPlugin"));
// app.commandLine.appendSwitch("ppapi-flash-path",app.getPath("pepperFlashSystemPlugin"));

app.commandLine.appendSwitch("ppapi-flash-path",`${__dirname}/pepperflash/pepflashplayer64_26_0_0_131.dll`);

var _win; //main viewer window
var _gamewindow; //game window

var _apiLink; //string api link
var _appdata;
var _windowLocations;

var ticon;

function main()
{
    ipcs();
    windowRestore();

    var winops={width:760,height:550,useContentSize:true};

    if (_windowLocations.viewer)
    {
        winops.x=_windowLocations.viewer[0];
        winops.y=_windowLocations.viewer[1];
    }

    _win=new BrowserWindow(winops);

    _win.loadURL(`${__dirname}/viewer/index.html`);

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
    //send cmd arguments to viewer
    ipcMain.on("requestCmdArgs",(e,res)=>{
        if (process.argv.length>=3)
        {
            e.sender.send("cmdArgs",process.argv[2]);
        }
    });

    //open game window
    ipcMain.on("requestWindow",(e,args)=>{
        setupGameWindow(args);
    });

    //get current api link (probably not used)
    ipcMain.on("requestAPI",(e,args)=>{
        e.sender.send("requestAPI",_apiLink);
    });

    //game window key combo sent to viewer
    ipcMain.on("gameKey",(e,res)=>{
        _win.webContents.send("gameKey",res);
    });

    ipcMain.on("closeGame",(e,res)=>{
        _gamewindow.close();
    });

    //viewer various commands
    ipcMain.on("optionCommand",(e,res)=>{
        switch (res)
        {
            case "resize":
                _gamewindow.setContentSize(800,480);
                break;

            case "mute":
                if (_gamewindow.webContents.isAudioMuted())
                {
                    _gamewindow.webContents.setAudioMuted(false);
                }

                else
                {
                    _gamewindow.webContents.setAudioMuted(true);
                }
                break;

            case "screenshot":
                _gamewindow.capturePage((img)=>{
                    var d=new Date();
                    fs.writeFile(`kancolle-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}_${d.getHours().toString().padStart(2,"0")}${d.getMinutes().toString().padStart(2,"0")}${d.getSeconds().toString().padStart(2,"0")}.png`,img.toPNG(),(err)=>{});
                });
                break;

            case "exit":
                _gamewindow.close();
                break;
        }
    });

    ipcMain.on("requestRelaunch",(e,res)=>{
        app.relaunch({args:[".",_apiLink]});
        windowClose();
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
    _appdata=`${process.env["appdata"]}/ellephant`;

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

    var winops={width:800,height:480,title:"ellephant - game",useContentSize:true,webPreferences:{plugins:true}};

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

            else if (par.request.url=="http://203.104.209.39/kcsapi/api_req_nyukyo/start")
            {
                _win.webContents.send("repairstart",decodeURIComponent(par.request.postData));
            }

            else if (par.request.url=="http://203.104.209.39/kcsapi/api_req_nyukyo/speedchange")
            {
                _win.webContents.send("instantrepair",decodeURIComponent(par.request.postData));
            }

            else if (par.request.url=="http://203.104.209.39/kcsapi/api_req_hensei/combined")
            {
                _win.webContents.send("fleetCombine",decodeURIComponent(par.request.postData));
            }
        }
    });

    _gamewindow.webContents.debugger.sendCommand("Network.enable");

    _gamewindow.loadURL(_apiLink);

    _gamewindow.webContents.executeJavaScript(`
        const {ipcRenderer}=require("electron");
        window.addEventListener("keydown",(e)=>{
            if (e.code=="KeyW" && e.ctrlKey==1)
            {
                ipcRenderer.send("closeGame");
                return;
            }

            ipcRenderer.send("gameKey",{key:e.key,ctrlKey:e.ctrlKey});
        });
    `);

    _gamewindow.on("close",(e)=>{
        windowClose(e);
    });
}

function windowClose(e)
{
    saveWindow();
    app.quit();
}

app.on("ready",main);