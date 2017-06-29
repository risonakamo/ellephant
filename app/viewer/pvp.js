class _pvp
{
    /*  --- other variables ---
        object pvpIds:

        element lastPvp: element last pvp clicked on
        int pvpCount: number of current pvp opponents*/
    constructor()
    {
        this.pvpFleets=document.querySelectorAll("pvp-fleet"); //element pvp fleets
        this.pvpCountBadge=document.querySelector(".pvp-notif"); //element tab bar count of current opponents
        this.pvpPage=document.querySelector(".pvp-page");
    }

    pvpUpdate(data)
    {
        var newPvpCount=0;
        this.pvpIds={};
        for (var x=0;x<5;x++)
        {
            this.pvpIds[data.api_list[x].api_enemy_id]=x;

            if (!data.api_list[x].api_state)
            {
                newPvpCount++;
            }

            this.pvpFleets[x].initialLoad(data.api_list[x]);
        }

        if (newPvpCount!=this.pvpCount)
        {
            this.pvpCount=newPvpCount;
            this.pvpCountBadge.innerHTML=`${this.pvpCount}&#9873;`;
        }

        this.pvpPage.classList.remove("unload");
    }

    loadPvpFleet(data)
    {
        //loop enemy ships and find ship type
        for (var x=0;x<6;x++)
        {
            if (data.api_deck.api_ships[x].api_id<0)
            {
                break;
            }

            //getting type of enemy ship
            data.api_deck.api_ships[x].type=apiData.sTypes[_apiAllShip[_apiIdtoSort[data.api_deck.api_ships[x].api_ship_id]].api_stype-1];
        }

        this.lastPvp=this.pvpFleets[this.pvpIds[data.api_member_id]];
        this.pvpFleets[this.pvpIds[data.api_member_id]].fleetLoad(data.api_deck.api_ships);
    }
}