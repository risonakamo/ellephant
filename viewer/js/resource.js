class _resource
{
    constructor()
    {
        this.resourceBox=document.querySelector("resource-box");
    }

    loadPort(data)
    {
        this.resourceBox.loadMaterial(data.api_material);
        this.resourceBox.loadMax(data.api_basic);
        this.resourceBox.ships=data.api_ship.length;
    }
}