void main();

/*-- onetime --*/
void expBoxEvents();

/*-- update event handling functions --*/
void changeUpdate(object data); //handles change data
                                //needs to be given formatted data
void portUpdate(); //handles port object
void expeditionUpdate(array data); //expedition elements
void chargeUpdate(object data); //charge object
void deckUpdate(object data); //update after a sortie battle given the ship_deck api data
void equipUpdate(object data); //give ship object to update ship in fleet if there
                               //used mainly for ship3 event and equipment changes
void equipExchange(object data); //handles equipment exchange api event
void setCombined(int state,bool postChange);

/*-- helpers --*/
// void saveFleetShipIds(array ships);
void processApiShip(array apiship);
void updateExpFace(int fleet);
void updateFleetShip(array ships,int fleetContain); //update a fleet
void updateFleetSupply(int fleet,int resupply);

/*-- utility --*/
array findShip(int id); //attempts to find number of fleet of given id ship
object parsePost(string res); //parse api post response which comes in a string
void switchEquipment(int id,int src,int dst); //switch equipment in given index slots of ship
string genFaceFile(object ship); //gen filepath for image of given apiship object

/*-- moved out --*/
object genLoadableShip(object ship); //gen fleepship obj for fleetship elements
array genEquip(array apishipEquip); //helper, gens array of equip ids
void sortieState(int state);