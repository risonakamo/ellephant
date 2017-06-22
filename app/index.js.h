void main();

/*-- onetime --*/
void setupInput();
void ipcReceivers();
void expBoxEvents();
void setupTabs();
void keyControl();

/*-- update event handling functions --*/
void changeUpdate(object data); //handles change data
                                //needs to be given formatted data
void portUpdate(); //handles port object
void rDockUpdate(object data); //handles repair docks
void expeditionUpdate(array data); //expedition elements
void chargeUpdate(object data); //charge object

void pvpUpdate(object data); //api data of api practice object sent in
void loadPvpFleet(object data); //handle recieve of single enemy fleet

/*-- helpers --*/
// void saveFleetShipIds(array ships);
void processApiShip(array apiship);
void updateExpFace(int fleet);
void updateFleetShip(array ships,int fleetContain);
void updateFleetSupply(int fleet,int resupply);
void EQswitch(char key); //performs tab switching given e or q key

/*-- utility --*/
object genLoadableShip(object ship); //gen fleepship obj for fleetship elements                                     
array genEquip(array apishipEquip); //helper, gens array of equip ids
void updateShipData(object update);
void tabPage(int page); //navigate to specified page
