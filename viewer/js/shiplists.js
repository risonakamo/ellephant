class _shiplists
{
    constructor()
    {
        this.repairlist=document.querySelector(".repair-list");
    }

    loadRepairLists()
    {
        var repairable=[];
        for (var x in _apiShip)
        {
            if (_apiShip[x].api_ndock_time)
            {
                repairable.push(_apiShip[x]);
            }
        }

        repairable.sort((a,b)=>{
            if (a.api_ndock_time>b.api_ndock_time)
            {
                return -1;
            }

            if (a.api_ndock_time<b.api_ndock_time)
            {
                return 1;
            }

            return 0;
        });

        // console.log(repairable);

        var newsl;
        for (var x=0,l=repairable.length;x<l;x++)
        {
            newsl=new shipList(repairable[x]);

            this.repairlist.appendChild(newsl);
        }
    }
}