class _construction
{
    constructor()
    {
        this.cships=document.querySelectorAll("construction-ship");
    }

    //load kdock array which contains kdock objects
    //requires size 4 kdock ARRAY
    loadKdock(data)
    {
        for (var x=0;x<4;x++)
        {
            this.cships[x].loadShip(data[x]);
        }
    }
}