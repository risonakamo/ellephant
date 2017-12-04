const packager=require("electron-packager");

packager({
    dir:`${__dirname}/..`,
    tmpdir:`${__dirname}/temp`,
    icon:"eicon.ico",
    electronVersion:"1.7.9",
    ignore:["build","face-check",/(.*)\.h$/,"ref",/(.*)\.md$/,"viewer/js/h"]
},(err,path)=>{});