void main();

/*-- onetime --*/
void setupInput();
void ipcReceivers();
void expBoxEvents();

/*-- update event handling functions --*/
void changeUpdate(object data); //handles change data
                                //needs to be given formatted data
void portUpdate(); //handles port object
void rDockUpdate(object data); //handles repair docks
void expeditionUpdate(array data); //expedition elements
void chargeUpdate(object data); //charge object

/*-- helpers --*/
// void saveFleetShipIds(array ships);
void processApiShip(array apiship);
void updateExpFace(int fleet);
void updateFleetShip(array ships,int fleetContain);

/*-- utility --*/
object genLoadableShip(object ship);
array genEquip(array apishipEquip);
void updateShipData(object update);
