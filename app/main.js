const {app,BrowserWindow}=require("electron");
const path=require("path");
const url=require("url");

var _win;
var _gamewindow;

function main()
{
    _win=new BrowserWindow({width:1280,height:720});

    _win.loadURL(url.format({
        pathname:path.join(__dirname,"index.html"),
        protocol:"file:",
        slashes:true
    }));

    _gamewindow=new BrowserWindow({width:800,height:600});
    

    _gamewindow.webContents.debugger.attach("1.2");

    _gamewindow.webContents.debugger.on("message",(e,met,par)=>{
        if (met=="Network.responseReceived")
        {
            if (par.response.url=="https://electron.atom.io/docs/api/")
            {
                _gamewindow.webContents.debugger.sendCommand("Network.getResponseBody",{requestId:par.requestId},(err,res)=>{
                    console.log(err);
                    console.log(res.body);
                });
            }
        }
    });

    _gamewindow.webContents.debugger.sendCommand("Network.enable");

    _gamewindow.loadURL("https://electron.atom.io/docs/api/");
}

app.on("ready",main);