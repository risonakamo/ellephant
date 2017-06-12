const {app,BrowserWindow,ipcMain}=require("electron");
const path=require("path");
const url=require("url");

app.commandLine.appendSwitch("ppapi-flash-path",app.getPath("pepperFlashSystemPlugin"));

var _win;
var _gamewindow;
var _apiLink;

function main()
{
    ipcs();
    _win=new BrowserWindow({width:776,height:620});

    _win.loadURL(`file://${__dirname}/index.html`);
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
        _apiLink=args;
        _gamewindow=new BrowserWindow({width:800,height:530,webPreferences:{plugins:true}});

        _gamewindow.webContents.debugger.attach("1.2");

        _gamewindow.webContents.debugger.on("message",(e,method,par)=>{
            if (method=="Network.responseReceived")
            {
                if (par.response.url=="http://203.104.209.39/kcsapi/api_port/port")
                {
                    setTimeout(()=>{receiveArb(par,"portinfo")},500);
                }

                if (par.response.url=="http://203.104.209.39/kcsapi/api_get_member/deck")
                {
                    setTimeout(()=>{receiveArb(par,"deckinfo")},500);
                }

                if (par.response.url=="http://203.104.209.39/kcsapi/api_get_member/require_info")
                {
                    setTimeout(()=>{receiveArb(par,"requireinfo")},500);
                }

                if (par.response.url=="http://203.104.209.39/kcsapi/api_start2")
                {
                    setTimeout(()=>{receiveArb(par,"apistart")},500);
                }
            }
        });

        _gamewindow.webContents.debugger.sendCommand("Network.enable");

        _gamewindow.loadURL(_apiLink);
    });

    ipcMain.on("requestAPI",(e,args)=>{
        e.sender.send("requestAPI",_apiLink);
    });
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

