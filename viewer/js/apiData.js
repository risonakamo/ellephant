class _apiData
{

    /*  OTHER VARIABLES
        --- player info ---
        object apiShip: ships of player sorted by api_id, unique id for each ship for each player
        object apiEquip: equipment of player

        --- api Alls ---
        apiAllShip: all ship information sorted by api_sortno
        apiAllEquip: equipment data sorted by ???
        apiAllExpedition: expedition data sorted by ???

        apiIdtoSort: convert an api_id (used for images) to sortno (used by apiAllShip)
    */
    constructor()
    {
        this.pvpRank={"S":6,"A":5,"B":4,"C":3,"D":2};

        this.sTypes=["DE","DD","CL","CLT","CA","CAV","CVL","BB","BB","BBV","CV","超弩級戦艦","SS","SSV","AO","AV","LHA",
                     "CVB","AR","AS","CT","AO"];

        this.sTypeImg=[-1,1,2,3,4,5,6,7,7,8,9,-1,10,11,18,12,-1,14,15,17,-1,18];

        this.expPerLv=[100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500,1600,1700,
              1800,1900,2000,2100,2200,2300,2400,2500,2600,2700,2800,2900,3000,3100,3200,3300,
              3400,3500,3600,3700,3800,3900,4000,4100,4200,4300,4400,4500,4600,4700,4800,4900,5000,
              5200,5400,5600,5800,6000,6200,6400,6600,6800,7000,7300,7600,7900,8200,8500,8800,9100,
              9400,9700,10000,10400,10800,11200,11600,12000,12400,12800,13200,13600,14000,14500,15000,
              15500,16000,16500,17000,17500,18000,18500,19000,20000,22000,25000,30000,40000,60000,90000,148500];
    }

    //remove ship from apiShip with id and equipment from apiEquip
    //returns number of equipment removed
    removeShip(id)
    {
        if (!_apiShip[id])
        {
            return;
        }

        var equipments=0;

        //delete all equipment of the ship
        for (var x=0;x<_apiShip[id].api_slot.length;x++)
        {
            if (_apiShip[id].api_slot[x]>0)
            {
                delete _apiEquip[_apiShip[id].api_slot[x]];
                equipments++;
            }
        }

        delete _apiShip[id];
        return equipments;
    }
}