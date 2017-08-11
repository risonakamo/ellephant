class _fleetstat
{
    constructor()
    {
        this.fleetstat=document.querySelector("fleet-stat");
    }

    //re evaluate fleetstat for single ship, used during equipment
    //updates.  requires FLEETSHIP ELEMENT that would normally
    //be selected during said equipment updates anyway
    equipChangeRemove(ship,ignoreAirPower)
    {
        if (!ignoreAirPower)
        {
            this.fleetstat.airPowerMin-=ship.airPower[0];
            this.fleetstat.airPowerMax-=ship.airPower[1];
        }

        // this.fleetstat.los-=ship.los;
        this.fleetstat.los=(parseFloat(this.fleetstat.los)-ship.los).toFixed(3);
    }

    equipChangeAdd(ship,ignoreAirPower)
    {
        if (!ignoreAirPower)
        {
            this.fleetstat.airPowerMin+=ship.airPower[0];
            this.fleetstat.airPowerMax+=ship.airPower[1];
        }

        // this.fleetstat.los+=ship.los;
        this.fleetstat.los=(parseFloat(this.fleetstat.los)+ship.los).toFixed(3);
    }

    //calculate and add to los a given fleet INDEX
    combinedLOS(fleet)
    {
        fleet*=6;
        var los=0;
        for (var x=fleet;x<=fleet+5;x++)
        {
            if (_fleetShips[x].los)
            {
                los+=_fleetShips[x].los;
            }

            else
            {
                los+=2;
            }
        }
        this.fleetstat.los=(parseFloat(this.fleetstat.los)+(los-Math.ceil(.4*apiData.portLevel))).toFixed(3);
    }
}