class _fleetstat
{
    constructor()
    {
        this.fleetstat=document.querySelector("fleet-stat");
    }

    //re evaluate fleetstat for single ship, used during equipment
    //updates.  requires FLEETSHIP ELEMENT that would normally
    //be selected during said equipment updates anyway
    equipChangeRemove(ship)
    {
        this.fleetstat.airPowerMin-=ship.airPower[0];
        this.fleetstat.airPowerMax-=ship.airPower[1];
        this.fleetstat.los-=ship.los;
    }

    equipChangeAdd(ship)
    {
        this.fleetstat.airPowerMin+=ship.airPower[0];
        this.fleetstat.airPowerMax+=ship.airPower[1];
        this.fleetstat.los+=ship.los;
    }

    //calculates 2nd fleet los and adds to main los
    combinedLOS()
    {
        var los=0;
        for (var x=6;x<=11;x++)
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