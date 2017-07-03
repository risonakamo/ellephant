void main();

/*-- onetime --*/
void expBoxEvents();

/*-- update event handling functions --*/
void changeUpdate(object data); //handles change data
                                //needs to be given formatted data
void portUpdate(); //handles port object
void rDockUpdate(object data); //handles repair docks
void expeditionUpdate(array data); //expedition elements
void chargeUpdate(object data); //charge object
void deckUpdate(object data); //update after a sortie battle given the ship_deck api data
void equipUpdate(object data); //handles ship3 api object for equipment loadout updates
void equipExchange(object data); //handles equipment exchange api event

/*-- helpers --*/
// void saveFleetShipIds(array ships);
void processApiShip(array apiship);
void updateExpFace(int fleet);
void updateFleetShip(array ships,int fleetContain); //update a fleet
void updateFleetSupply(int fleet,int resupply);

/*-- utility --*/
object genLoadableShip(object ship); //gen fleepship obj for fleetship elements
array genEquip(array apishipEquip); //helper, gens array of equip ids
array findShip(int id); //attempts to find number of fleet of given id ship
object parsePost(string res); //parse api post response which comes in a string
void switchEquipment(int id,int src,int dst); //switch equipment in given index slots of ship
void sortieState(int state);
string genFaceFile(object ship); //gen filepath for image of given apiship object

/*-- moved out --*/
    /*--- pvp object ---*/
void pvpUpdate(object data); //api data of api practice object sent in
void loadPvpFleet(object data); //handle recieve of single enemy fleet

    /*--- viewer object ---*/
void ipcReceivers();
void setupInput();
void setupTabs();
void keyControl();
void EQswitch(char key); //performs tab switching given e or q key
void tabPage(int page); //navigate to specified page