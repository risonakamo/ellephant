const {app,BrowserWindow,ipcMain}=require("electron");
const path=require("path");
const url=require("url");
// var flashLoader=require("flash-player-loader");

// flashLoader.addSource("C:\WINDOWS\SysWOW64\Macromed\Flash");
// flashLoader.load();

app.commandLine.appendSwitch("ppapi-flash-path",app.getPath("pepperFlashSystemPlugin"));

var _win;
var _gamewindow;
var _apiLink;

function main()
{
    ipcs();
    _win=new BrowserWindow({width:1280,height:720,webPreferences:{plugins:true}});

    _win.loadURL(`file://${__dirname}/index.html`);
}

function ipcs()
{
    ipcMain.on("requestWindow",(e,args)=>{
        _apiLink=args;
        _gamewindow=new BrowserWindow({width:800,height:600,webPreferences:{plugins:true}});

        _gamewindow.webContents.debugger.attach("1.2");

        var responseCallback=function(err,res){
            console.log(err);

            if (res.body==undefined)
            {
                setTimeout(()=>{responseCallback(err,res)},100);
                return;
            }

            console.log(res.body);
        };        

        _gamewindow.webContents.debugger.on("message",(e,method,par)=>{
            if (method=="Network.responseReceived")
            {
                // if (par.response.url=="https://electron.atom.io/docs/api/debugger/")
                if (par.response.url=="http://203.104.209.39/kcsapi/api_port/port")
                {
                //     console.log(par);
                    setTimeout(()=>{
                        _gamewindow.webContents.debugger.sendCommand("Network.getResponseBody",{requestId:par.requestId},(err,res)=>{
                            _win.webContents.send("portinfo",(JSON.parse(res.body.slice(7)).api_data.api_basic.api_comment));
                        });
                    },1000);
                }
            }
        });

        _gamewindow.webContents.debugger.sendCommand("Network.enable");

        _gamewindow.loadURL(_apiLink);

        // _gamewindow.webContents.openDevTools();
        // _gamewindow.loadURL(`file://${__dirname}/gamewindow.html`);
    });

    ipcMain.on("requestAPI",(e,args)=>{
        e.sender.send("requestAPI",_apiLink);
    });
}

function gameWindowDebugSetup()
{
    _gamewindow.webContents.debugger.attach("1.2");

    _gamewindow.webContents.debugger.on("message",(e,method,par)=>{
        if (method=="Network.responseReceived")
        {
            if (par.reponse.url=="http://203.104.209.39/kcsapi/api_port/port")
            {
                _gamewindow.webContents.debugger.sendCommand("Network.getResponseBody",{requestId:par.requestId},(err,res)=>{
                    console.log(res.body);
                });                
            }
        }
    });

    _gamewindow.webContents.debugger.sendCommand("Network.enable");
}

app.on("ready",main);

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

