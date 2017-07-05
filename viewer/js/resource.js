class _resource
{
    constructor()
    {
        this.resourceBox=document.querySelector("resource-box");
    }

    //for port object
    loadPort(data)
    {
        this.resourceBox.loadMaterial(data.api_material);
        this.resourceBox.loadMax(data.api_basic);
        this.resourceBox.ships=data.api_ship.length;
    }

    //requires api_material array from charge object
    //also works for expedition's result.api_get_material array
    //basically requires array of 4 main resources
    loadCharge(data)
    {
        this.resourceBox.gas=data[0];
        this.resourceBox.ammo=data[1];
        this.resourceBox.steel=data[2];
        this.resourceBox.baux=data[3];
    }

    //requires SINGLE OBJECT from ndock's array of dock objects
    loadRepair(data)
    {
        this.resourceBox.gas-=data.api_item1;
        this.resourceBox.ammo-=data.api_item2;
        this.resourceBox.steel-=data.api_item3;
        this.resourceBox.baux-=data.api_item4;
    }

    loadModernise(data)
    {
        for (var x=0;x<data.api_id_items;x++)
        {
            apiData.removeShip(x);
        }

        this.resourceBox.ships=_apiShip.length;
        this.resourceBox.equips=_apiEquip.length;
    }
}