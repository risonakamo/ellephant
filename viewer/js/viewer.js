class _viewerHtml
{
    constructor()
    {
        this.tabs=document.querySelectorAll(".tab");
        this.pages=document.querySelectorAll(".viewer-page");
        this.tabBar=document.querySelector(".tabs");
        this.currentTab=0;

        this.fleetSlider=document.querySelector(".fleet-slider");
        this.currentFleet=0;

        this.viewer=document.querySelector(".viewer");
        this.loading=document.querySelector(".loading");
        this.loadLog=this.loading.querySelector(".log");

        this.escMenu=document.querySelector(".esc-menu");
        this.muted=0;

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

        ipcRenderer.on("cmdArgs",(e,res)=>{
            urlBox.value=res;
        });
        ipcRenderer.send("requestCmdArgs");;

        var sendWindowRequest=function(e){
            ipcRenderer.send("requestWindow",urlBox.value);

            inputWrap.classList.add("fade");
            that.loading.classList.add("show");
            setTimeout(()=>{
                inputWrap.parentNode.removeChild(inputWrap);
                that.viewer.classList.remove("collapse-dim");
                that.escMenu.classList.remove("collapse-dim");
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
        document.addEventListener("keydown",(e)=>{
            this.vKeyDown(e);
        });
    }

    vKeyDown(e)
    {
        //next tab
        if (e.key=="e")
        {
            var a=this.currentTab+1;

            if (a>=this.pages.length)
            {
                a=0;
            }

            this.tabPage(a);
        }

        //previous tab
        if (e.key=="q")
        {
            var a=this.currentTab-1;

            if (a<0)
            {
                a=this.pages.length-1;
            }

            this.tabPage(a);
        }

        //open menu
        if (e.key=="Escape")
        {
            this.escMenu.classList.toggle("show");
        }

        //switch fleet, ctrl for backwards
        if (e.key=="Tab")
        {
            if (e.ctrlKey)
            {
                this.switchFleet(this.currentFleet-1);
            }

            else
            {
                this.switchFleet(this.currentFleet+1);
            }
        }

        //go to fleet 0, or fleet 1 if on 0 (for combined fleet)
        if (e.key=="Shift")
        {
            if (this.currentFleet==0)
            {
                this.switchFleet(1);
            }

            else
            {
                this.switchFleet(0);
            }
        }

        //reload app
        if (e.key=="r" && e.ctrlKey)
        {
            if (e.preventDefault)
            {
                e.preventDefault();
            }

            ipcRenderer.send("requestRelaunch");
        }

        //close app
        if (e.key=="w" && e.ctrlKey)
        {
            if (e.preventDefault)
            {
                e.preventDefault();
            }

            ipcRenderer.send("closeGame");
        }

        //screenshot
        if (e.key=="s" && e.ctrlKey)
        {
            if (e.preventDefault)
            {
                e.preventDefault();
            }

            ipcRenderer.send("optionCommand","screenshot");
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
            viewer.vKeyDown(res);
        });

        ipcRenderer.on("shipdeck",(e,res)=>{
            deckUpdate(res.api_data);
        });

        ipcRenderer.on("shipEquip",(e,res)=>{
            equipUpdate(res.api_data.api_ship_data[0]);
        });

        ipcRenderer.on("equipExchange",(e,res)=>{
            equipExchange(parsePost(res));
        });

        ipcRenderer.on("ndock",(e,res)=>{
            repair.rDockUpdate(res.api_data);
        });

        ipcRenderer.on("sortiestart",(e,res)=>{
            this.tabState(1);
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

        ipcRenderer.on("fleetCombine",(e,res)=>{
            setCombined(parseInt(parsePost(res).api_combined_type),1);
        });

        ipcRenderer.on("shipRemodel",(e,res)=>{
            _remodelDelay=1;
        });

        ipcRenderer.on("allSlot",(e,res)=>{
            this.loadAllSlot(res.api_data);

            // resource.resourceBox.equips=res.api_data.api_slot_item.length;

            //update all fleetships
            for (var x=0;x<4;x++)
            {
                updateFleetShip(_fleetShipIds[x],x);
            }
        });

        ipcRenderer.on("slotSwitch",(e,res)=>{
            equipUpdate(res.api_data.api_ship_data.api_set_ship);
            equipUpdate(res.api_data.api_ship_data.api_unset_ship);
        });

        ipcRenderer.once("requireinfo",(e,res)=>{
            this.loadAllSlot(res.api_data.api_slot_item);

            construction.loadKdock(res.api_data.api_kdock);

            // resource.resourceBox.equips=res.api_data.api_slot_item.length;
            this.loaderLog("require info ready.");
        });

        ipcRenderer.once("apistart",(e,res)=>{
            // _apistart=res.api_data;

            _apiAllShip={};
            _apiIdtoSort={};

            var x=0;
            while (1)
            {
                if (res.api_data.api_mst_ship[x].api_sortno==undefined)
                {
                    break;
                }

                _apiAllShip[res.api_data.api_mst_ship[x].api_sortno]=res.api_data.api_mst_ship[x];
                _apiIdtoSort[res.api_data.api_mst_ship[x].api_id]=res.api_data.api_mst_ship[x].api_sortno;
                x++;
            }

            this.loaderLog("api ships loaded.");

            _apiAllEquip={};

            x=0;
            while (1)
            {
                if (!res.api_data.api_mst_slotitem[x].api_sortno)
                {
                    break;
                }

                _apiAllEquip[res.api_data.api_mst_slotitem[x].api_sortno]=res.api_data.api_mst_slotitem[x];
                x++;
            }

            this.loaderLog("api equipment loaded.");

            _apiAllExpedition=res.api_data.api_mst_mission;

            this.loaderLog("api start ready.");
            _apistart_ready=1;
        });
    }

    setupEscMenu()
    {
        this.menuItems=this.escMenu.firstElementChild.children;

        //resume button
        this.menuItems[0].addEventListener("click",(e)=>{
            this.escMenu.classList.remove("show");
        });

        //resize button
        this.menuItems[1].addEventListener("click",(e)=>{
            ipcRenderer.send("optionCommand","resize");
        });

        this.menuItems[2].addEventListener("click",(e)=>{
            for (var x=0;x<3;x++)
            {
                _expFleets[x].classList.toggle("min");
            }

            _expFleets[0].parentNode.classList.toggle("min");
        });

        //mute
        this.menuItems[3].addEventListener("click",(e)=>{
            this.toggleMute();
        });

        //quit
        this.menuItems[4].addEventListener("click",(e)=>{
            ipcRenderer.send("optionCommand","exit");
        });
    }

    //string title,body
    //int image: 0=expedition complete image
    notify(title,body,image)
    {
        if (image==0)
        {
            image="../icons/expcomplete.png";
        }

        var a=new Notification(title,{body:body,icon:image,tag:"viewerNotify",renotify:true});
    }

    //0=normal
    //1=sortie
    //2=expedition complete
    tabState(state)
    {
        if (_mFleet.currentState==2 && state==2)
        {
            return;
        }

        this.tabBar.classList.remove("sortie","exp-complete");
        if (state==0)
        {
            if (this.checkExpComplete())
            {
                this.tabBar.classList.add("exp-complete");
            }

            _mFleet.setState(0);
        }

        else if (state==1)
        {
            this.tabBar.classList.add("sortie");
            _mFleet.setState(2);
        }

        else if (state==2)
        {
            if (_mFleet.currentState==2)
            {
                return;
            }

            else
            {
                this.tabBar.classList.add("exp-complete");
            }
        }
    }

    checkExpComplete()
    {
        for (var x=0;x<3;x++)
        {
            if (_expFleets[x].completed==1)
            {
                return 1;
            }
        }

        return 0;
    }

    //fleet needs to be index of fleet
    switchFleet(fleet)
    {
        if (fleet<0)
        {
            fleet=3;
        }

        if (fleet>3)
        {
            fleet=0;
        }

        if (this.currentFleet==fleet)
        {
            return;
        }

        this.fleetSlider.style.transform=`translateY(-${360*fleet}px)`;

        if (fleet==0)
        {
            _mFleet.classList.add("selected");
        }

        else
        {
            _expFleets[fleet-1].classList.add("selected");
        }

        if (this.currentFleet==0)
        {
            _mFleet.classList.remove("selected");
        }

        else
        {
            _expFleets[this.currentFleet-1].classList.remove("selected");
        }

        this.currentFleet=fleet;
    }

    //requires slot item array: array of equipement OBJECTS
    //for slot_item event or require_info first-time all equipment
    //load, where the array is api_slot_item
    loadAllSlot(data)
    {
        _apiEquip={};
        for (var x=0,l=data.length;x<l;x++)
        {
            _apiEquip[data[x].api_id]=data[x];
        }

        resource.resourceBox.equips=data.length;
    }

    toggleMute()
    {
        ipcRenderer.send("optionCommand","mute");

        if (this.muted==0)
        {
            this.menuItems[3].innerHTML="UNMUTE";
            this.muted=1;
        }

        else
        {
            this.menuItems[3].innerHTML="MUTE";
            this.muted=0;
        }
    }
}