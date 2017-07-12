class _viewerHtml
{
    constructor()
    {
        this.tabs=document.querySelectorAll(".tab");
        this.pages=document.querySelectorAll(".viewer-page");
        this.tabBar=document.querySelector(".tabs");
        this.currentTab=0;

        this.viewer=document.querySelector(".viewer");
        this.loading=document.querySelector(".loading");
        this.loadLog=this.loading.querySelector(".log");

        this.escMenu=document.querySelector(".esc-menu");

        this.setupInput();
        this.setupTabs();
        this.ipcReceivers();
        this.setupEscMenu();
    }

    viewerShow()
    {
        if (this.viewerShown)
        {
            return;
        }

        this.viewerShown=1;
        this.viewer.classList.remove("collapse");
        this.loading.classList.add("slideout");

        setTimeout(()=>{
            this.loading.parentNode.removeChild(this.loading);
        },501);
    }

    loaderLog(message)
    {
        if (this.viewerShown)
        {
            return;
        }

        this.loadLog.insertAdjacentHTML("beforeend",`<p class="slide">${message}</p>`);
    }

    setupInput()
    {
        var goBt=document.querySelector(".go-bt");
        var urlBox=document.querySelector(".url-box");
        var inputWrap=document.querySelector(".input-wrap");

        var that=this;

        var sendWindowRequest=function(e){
            ipcRenderer.send("requestWindow",urlBox.value);

            inputWrap.classList.add("fade");
            that.loading.classList.add("show");
            setTimeout(()=>{
                inputWrap.parentNode.removeChild(inputWrap);
                that.viewer.classList.remove("collapse-dim");
            },501);

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

        document.addEventListener("keydown",(e)=>{
            if (e.key=="Escape")
            {
                this.escMenu.classList.toggle("show");
            }
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
            repair.rDockUpdate(res.api_data);
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
            var removeEquips=apiData.removeShip(parseInt(parsePost(res).api_ship_id))
            console.log(removeEquips);

            resource.resourceBox.equips-=removeEquips;
            resource.resourceBox.ships--;
        });

        ipcRenderer.on("akashiupgrade",(e,res)=>{
            resource.loadAkashi(res.api_data);
        });

        ipcRenderer.on("repairstart",(e,res)=>{
            res=parsePost(res);

            if (res.api_highspeed=="1")
            {
                repair.clearRepair(parseInt(res.api_ship_id));
            }
        });

        ipcRenderer.on("instantrepair",(e,res)=>{
            res=parsePost(res);

            repair.rDocks[res.api_ndock_id-1].complete();
        });

        ipcRenderer.once("requireinfo",(e,res)=>{
            _apiEquip={};
            for (var x=0,l=res.api_data.api_slot_item.length;x<l;x++)
            {
                _apiEquip[res.api_data.api_slot_item[x].api_id]=res.api_data.api_slot_item[x];
            }

            construction.loadKdock(res.api_data.api_kdock);

            resource.resourceBox.equips=res.api_data.api_slot_item.length;
            this.loaderLog("require info ready.");
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
            this.loaderLog("api ships loaded.");

            _apiAllEquip={};
            for (var x=0;x<=228;x++)
            {
                _apiAllEquip[res.api_data.api_mst_slotitem[x].api_sortno]=res.api_data.api_mst_slotitem[x];
            }
            this.loaderLog("api equipment loaded.");

            _apiAllExpedition=res.api_data.api_mst_mission;

            _apistart_ready=1;
            this.loaderLog("api start ready.");
        });
    }

    setupEscMenu()
    {
        var menuItems=this.escMenu.firstElementChild.children;
        var muted=0;

        //resume button
        menuItems[0].addEventListener("click",(e)=>{
            this.escMenu.classList.remove("show");
        });

        //resize button
        menuItems[1].addEventListener("click",(e)=>{
            ipcRenderer.send("optionCommand","resize");
        });

        //mute
        menuItems[2].addEventListener("click",(e)=>{
            ipcRenderer.send("optionCommand","mute");

            if (muted==0)
            {
                menuItems[2].innerHTML="UNMUTE";
                muted=1;
            }

            else
            {
                menuItems[2].innerHTML="MUTE";
                muted=0;
            }
        });

        //quit
        menuItems[3].addEventListener("click",(e)=>{
            ipcRenderer.send("optionCommand","exit");
        });
    }

    //string msg: content field of popup
    notify(msg)
    {
        ipcRenderer.send("viewerNotification",msg);
    }
}