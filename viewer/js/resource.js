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

    //requires api_material array from charge object (int array with first
    //4 numbers being the standard resources)
    //also used for: scrap ship,akashi upgrade
    loadCharge(data)
    {
        this.resourceBox.gas=data[0];
        this.resourceBox.ammo=data[1];
        this.resourceBox.steel=data[2];
        this.resourceBox.baux=data[3];

        if (data.length>4)
        {
            this.resourceBox.bucket=data[5];
            this.resourceBox.dev=data[6];
            this.resourceBox.screw=data[7];
        }
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
        var usedShips=data.api_id_items.split(",");
        var usedShipsLength=usedShips.length;
        var removedEquipments=0;

        for (var x=0;x<usedShipsLength;x++)
        {
            removedEquipments+=apiData.removeShip(parseInt(usedShips[x]));
        }

        this.resourceBox.ships-=usedShipsLength;
        this.resourceBox.equips-=removedEquipments;
    }

    loadNewShip(newEquips)
    {
        this.resourceBox.ships++;
        this.resourceBox.equips+=newEquips;
    }

    //requires api get material, which gives addative value
    //for 4 main resources in an array
    //usable for: scrap equipment
    loadGetMaterial(data)
    {
        this.resourceBox.gas+=data[0];
        this.resourceBox.ammo+=data[1];
        this.resourceBox.steel+=data[2];
        this.resourceBox.baux+=data[3];
    }

    loadScrapEquips(data)
    {
        data=data.api_slotitem_ids.split(",");
        var removedEquips=data.length;

        for (var x=0;x<removedEquips;x++)
        {
            delete _apiEquip[parseInt(data[x])];
        }

        this.resourceBox.equips-=removedEquips;
    }

    //handles whole api data object from crafting an item
    loadCraftItem(data)
    {
        this.loadCharge(data.api_material);

        this.resourceBox.dev=data.api_material[6];

        if (data.api_slot_item)
        {
            this.resourceBox.equips++;

            _apiEquip[data.api_slot_item.api_id]=data.api_slot_item;
        }
    }

    //handles whole akashi upgrade api object
    loadAkashi(data)
    {
        this.loadCharge(data.api_after_material);

        if (data.api_use_slot_id)
        {
            for (var x=0;x<data.api_use_slot_id.length;x++)
            {
                delete _apiEquip[data.api_use_slot_id[x]];
            }

            this.resourceBox.equips-=data.api_use_slot_id.length;
        }
    }
}