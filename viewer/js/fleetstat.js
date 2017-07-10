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
}