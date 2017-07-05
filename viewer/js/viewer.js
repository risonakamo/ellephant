class _viewerHtml
{
    constructor()
    {
        this.tabs=document.querySelectorAll(".tab");
        this.pages=document.querySelectorAll(".viewer-page");
        this.tabBar=document.querySelector(".tabs");
        this.currentTab=0;

        this.setupInput();
        this.setupTabs();
        this.ipcReceivers();
    }

    setupInput()
    {
        var goBt=document.querySelector(".go-bt");
        var urlBox=document.querySelector(".url-box");
        var inputWrap=document.querySelector(".input-wrap");
        var viewer=document.querySelector(".viewer");
        var that=this;

        var sendWindowRequest=function(e){
            ipcRenderer.send("requestWindow",urlBox.value);
            inputWrap.parentNode.removeChild(inputWrap);
            viewer.classList.remove("collapse");
            that.keyControl();
        };

        goBt.addEventListener("click",sendWindowRequest);

        urlBox.addEventListener("keypress",(e)=>{
            if (e.key=="Enter")
            {
                e.preventDefault();
                sendWindowRequest();
            }
        });
    }

    setupTabs()
    {
        var tabs=document.querySelectorAll(".tab");
        var pages=document.querySelectorAll(".viewer-page");

        tabs.forEach((x,i,a)=>{
            x.addEventListener("click",(e)=>{
                this.tabPage(i);
            });
        });
    }

    tabPage(page)
    {
        if (page==this.currentTab)
        {
            return;
        }

        this.currentTab=page;

        for (var x=0;x<this.pages.length;x++)
        {
            if (x==page)
            {
                this.pages[x].classList.add("current");
                this.tabs[x].classList.add("selected");
            }

            else
            {
                this.pages[x].classList.remove("current");
                this.tabs[x].classList.remove("selected");
            }
        }
    }

    keyControl()
    {
        document.addEventListener("keypress",(e)=>{
            this.EQswitch(e.key);
        });
    }

    EQswitch(key)
    {
        if (key=="e")
        {
            var a=this.currentTab+1;

            if (a>=this.pages.length)
            {
                a=0;
            }

            this.tabPage(a);
        }

        else if (key=="q")
        {
            var a=this.currentTab-1;

            if (a<0)
            {
                a=this.pages.length-1;
            }

            this.tabPage(a);
        }
    }

    //receives from main process
    ipcReceivers()
    {
        ipcRenderer.on("portinfo",(e,res)=>{
            portUpdate(res);
        });

        ipcRenderer.on("deckinfo",(e,res)=>{
            expeditionUpdate(res.api_data);
        });

        ipcRenderer.on("charge",(e,res)=>{
            chargeUpdate(res);
        });

        ipcRenderer.on("change",(e,res)=>{
            changeUpdate(parsePost(res));
        });

        ipcRenderer.on("presetLoad",(e,res)=>{
            updateFleetShip(res.api_data.api_ship,res.api_data.api_id-1);
            _fleetShipIds[res.api_data.api_id-1]=res.api_data.api_ship.slice();
        });

        ipcRenderer.on("pvpUpdate",(e,res)=>{
            pvp.pvpUpdate(res.api_data);
        });

        ipcRenderer.on("pvpFleet",(e,res)=>{
            pvp.loadPvpFleet(res.api_data);
        });

        ipcRenderer.on("pvpResult",(e,res)=>{
            pvp.lastPvp.setState(apiData.pvpRank[res.api_data.api_win_rank]);

            pvp.pvpCount--;
            pvp.pvpCountBadge.innerHTML=`${pvp.pvpCount}&#9873;`;
        });

        ipcRenderer.on("gameKey",(e,res)=>{
            viewer.EQswitch(res);
        });

        ipcRenderer.on("shipdeck",(e,res)=>{
            deckUpdate(res.api_data);
        });

        ipcRenderer.on("shipEquip",(e,res)=>{
            equipUpdate(res.api_data);
        });

        ipcRenderer.on("equipExchange",(e,res)=>{
            equipExchange(parsePost(res));
        });

        ipcRenderer.on("ndock",(e,res)=>{
            rDockUpdate(res.api_data);
        });

        ipcRenderer.on("sortiestart",(e,res)=>{
            sortieState(1);
        });

        ipcRenderer.on("constructiondock",(e,res)=>{
            construction.loadKdock(res.api_data);
        });

        ipcRenderer.on("getship",(e,res)=>{
            res=res.api_data;
            construction.loadKdock(res.api_kdock);

            _apiShip[res.api_id]=res.api_ship;

            var newEquips=res.api_slotitem.length;
            for (var x=0;x<newEquips;x++)
            {
                _apiEquip[res.api_slotitem[x].api_id]=res.api_slotitem[x];
            }

            resource.loadNewShip(newEquips);
        });

        ipcRenderer.on("modernise",(e,res)=>{
            resource.loadModernise(parsePost(res));
        });

        ipcRenderer.on("scrapitem",(e,res)=>{
            resource.loadGetMaterial(res.api_data.api_get_material);
        });

        ipcRenderer.on("scrapitemPost",(e,res)=>{
            resource.loadScrapEquips(parsePost(res));
        });

        ipcRenderer.on("createitem",(e,res)=>{
            resource.loadCraftItem(res.api_data);
        });

        ipcRenderer.on("generalmaterial",(e,res)=>{
            resource.resourceBox.loadMaterial(res.api_data);
        });

        ipcRenderer.on("instantcraft",(e,res)=>{
            construction.instantCraft(parseInt(parsePost(res).api_kdock_id));
        });

        ipcRenderer.on("scrapship",(e,res)=>{
            resource.loadCharge(res.api_data.api_material);
        });

        ipcRenderer.on("scrapshipPost",(e,res)=>{
            resource.resourceBox.equips-=apiData.removeShip(parseInt(parsePost(res).api_ship_id));
            resource.resourceBox.ships--;
        });

        ipcRenderer.on("akashiupgrade",(e,res)=>{
            resource.loadAkashi(res.api_data);
        });

        ipcRenderer.once("requireinfo",(e,res)=>{
            _apiEquip={};
            for (var x=0,l=res.api_data.api_slot_item.length;x<l;x++)
            {
                _apiEquip[res.api_data.api_slot_item[x].api_id]=res.api_data.api_slot_item[x];
            }

            construction.loadKdock(res.api_data.api_kdock);

            resource.resourceBox.equips=res.api_data.api_slot_item.length;
        });

        ipcRenderer.once("apistart",(e,res)=>{
            // _apistart=res.api_data;

            _apiAllShip={};
            _apiIdtoSort={};
            for (var x=0;x<=465;x++)
            {
                _apiAllShip[res.api_data.api_mst_ship[x].api_sortno]=res.api_data.api_mst_ship[x];
                _apiIdtoSort[res.api_data.api_mst_ship[x].api_id]=res.api_data.api_mst_ship[x].api_sortno;
            }

            _apiAllEquip={};
            for (var x=0;x<=228;x++)
            {
                _apiAllEquip[res.api_data.api_mst_slotitem[x].api_sortno]=res.api_data.api_mst_slotitem[x];
            }

            _apiAllExpedition=res.api_data.api_mst_mission;

            _apistart_ready=1;
        });
    }
}