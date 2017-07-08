class _repair
{
    constructor()
    {
        this.rDocks=document.querySelectorAll("repair-box");

        this.rDockEvents();
    }

    rDockEvents()
    {
        for (var x=0;x<this.rDocks.length;x++)
        {
            this.rDocks[x].addEventListener("complete",(e)=>{
                this.clearRepair(e.detail);
            });
        }
    }

    clearRepair(ship)
    {
        delete _apiShip[ship].inRepair;

        _apiShip[ship].api_nowhp=_apiShip[ship].api_maxhp;

        var shipfind=findShip(ship);

        if (shipfind[0]>=0)
        {
            _fleetShips[(4*shipfind[0])+shipfind[1]].loadShip(genLoadableShip(_apiShip[ship]));
        }
    }

    //requires api ndock (array) directly from port api
    rDockUpdate(data)
    {
        if (_apiShip_ready!=1)
        {
            setTimeout(()=>{this.rDockUpdate(data)},100);
            return;
        }

        for (var x=0;x<this.rDocks.length;x++)
        {
            if (data[x].api_state<=0 || this.rDocks[x].loaded==1)
            {
                continue;
            }

            this.rDocks[x].loadShip({
                // face:`../face/${_apiShip[data[x].api_ship_id].api_ship_id}.png`,
                face: genFaceFile(_apiShip[data[x].api_ship_id]),
                timeComplete:data[x].api_complete_time,
                maxTime:_apiShip[data[x].api_ship_id].api_ndock_time,
                name:_apiAllShip[_apiShip[data[x].api_ship_id].api_sortno].api_name,
                shipId:data[x].api_ship_id
            });

            _apiShip[data[x].api_ship_id].inRepair=1;
            var shipfind=findShip(data[x].api_ship_id);

            if (shipfind[0]>=0)
            {
                _fleetShips[(4*shipfind[0])+shipfind[1]].setRepair(1);
            }

            if (!this.rDocks[x].initialLoad)
            {
                resource.loadRepair(data[x]);
            }

            this.rDocks[x].initialLoad=1;
        }
    }
}