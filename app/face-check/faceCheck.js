window.onload=main;

function main()
{

}

function loadIds(data)
{
    data=JSON.parse(data);

    var ipoint=document.querySelector(".ships");
    var white=0;
    for (var x in data)
    {
        ipoint.insertAdjacentHTML("beforeend",genShip(x,data[x],white));

        white++;

        if (white>1)
        {
            white=0;
        }
    }
}

function genShip(name,data,white)
{
    if (white==0)
    {
        white="";
    }

    else
    {
        white="white";
    }

    return `
    <div class="ship ${white}">
      <div class="name">${name}</div>

      ${genImgContain(data)}

    </div>`;
}

function genImgContain(data)
{
    var str="";

    for (var x=0;x<data.length;x++)
    {
        str+=`
        <div class="img-contain">
            <img src="../face/${data[x]}.png">
            <div class="img-name">${data[x]}</div>
        </div>`;
    }

    return str;
}