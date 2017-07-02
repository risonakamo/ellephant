window.onload=main;

function main()
{
    var inputArea=document.querySelector(".input-area");
    var pbutton=inputArea.querySelectorAll(".p-button");
    var input=inputArea.querySelector(".input");

    pbutton[0].addEventListener("click",(e)=>{
        inputArea.parentNode.removeChild(inputArea);
        loadIds(input.value,0);
    });

    pbutton[1].addEventListener("click",(e)=>{
        inputArea.parentNode.removeChild(inputArea);
        loadIds(input.value,1);
    });
}

function loadIds(data,damage)
{
    data=JSON.parse(data);

    var ipoint=document.querySelector(".ships");
    var white=0;

    for (var x in data)
    {
        ipoint.insertAdjacentHTML("beforeend",genShip(x,data[x],white,damage));

        white++;

        if (white>1)
        {
            white=0;
        }
    }
}

function genShip(name,data,white,damage)
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
      <div class="name"><p>${name}</p></div>

      ${genImgContain(data,damage)}

    </div>`;
}

function genImgContain(data,damage)
{
    var str="";
    var damagestr="";

    if (damage==1)
    {
        damagestr="-d";
    }

    for (var x=0;x<data.length;x++)
    {
        str+=`
        <div class="img-contain">
            <img src="../face${damagestr}/${data[x]}.png">
            <div class="img-name">${padZero(data[x])}</div>
        </div>`;
    }

    return str;
}

function padZero(number)
{
    if (number>=100)
    {
        return number;
    }

    if (number>=10)
    {
        return "0"+number;
    }

    else
    {
        return "00"+number;
    }
}