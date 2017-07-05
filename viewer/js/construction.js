class _construction
{
    constructor()
    {
        this.cships=document.querySelectorAll("construction-ship");
    }

    //load kdock array which contains kdock objects
    //requires size 4 kdock ARRAY
    loadKdock(data)
    {
        if (!_apistart_ready)
        {
            setTimeout(()=>{this.loadKdock(data)},200);
            return;
        }

        var type;
        for (var x=0;x<4;x++)
        {
            type=0;
            if (data[x].api_created_ship_id>0)
            {
                type=apiData.sTypeImg[_apiAllShip[_apiIdtoSort[data[x].api_created_ship_id]]-1];
            }

            this.cships[x].loadShip(data[x],type);
        }
    }

    //complete construction at int dock
    instantCraft(dock)
    {
        this.cships[dock-1].complete();
    }
}