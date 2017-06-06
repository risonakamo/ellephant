const {app,BrowserWindow,session}=require("electron");
const path=require("path");
const url=require("url");

var _win;

function main()
{
    _win=new BrowserWindow({width:1280,height:720});

    _win.loadURL(url.format({
        pathname:path.join(__dirname,"index.html"),
        protocol:"file:",
        slashes:true
    }));

    session.defaultSession.webRequest.onCompleted({urls:["https://electron.atom.io/*"]},(detail)=>{
        console.log(detail.responseBody);

    });    
}

app.on("ready",main);