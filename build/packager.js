const packager=require("electron-packager");

packager({
    dir:`${__dirname}/..`,
    tmpdir:`${__dirname}/temp`,
    electronVersion:"1.6.11",
    ignore:["build","face-check",/(.*)\.h$/,"ref",/(.*)\.md$/]
},(err,path)=>{});