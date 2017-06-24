/*requires api_start2's api_mst_ship*/
function parseShipIds(data)
{
    var res={};
    for (var x=0,l=data.length;x<=l;x++)
    {
        if (data[x].api_yomi=="-")
        {
            break;
        }

        if (!res[data[x].api_yomi])
        {
            res[data[x].api_yomi]=[];
        }

        res[data[x].api_yomi].push(data[x].api_id);
    }

    return JSON.stringify(res);
}