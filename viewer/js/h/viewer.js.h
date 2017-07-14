//viewer object handles html display ect related things

/*--- initialised variables ---*/
element tabs;
element-array pages;
element tabBar;
int currentTab;

element fleetSlider;
int currentFleet;

element viewer;
element loading;
element loadLog;

element escMenu;

/*--- one times ---*/
void ipcReceivers(); //main process listeners
void setupInput(); //setup input page
void setupTabs(); //setup tab system
void keyControl(); //setup key control system for viewer page only (not input)
void setupEscMenu();

/*--- utility ---*/
void EQswitch(char key); //performs tab switching given e or q key
void vKeyDown(event e); //event handler for keydown document events
void tabPage(int page); //navigate to specified page
void notify(string msg); //requests popup
void tabState(int state); //change tab state colours
int checkExpComplete(); //returns 1 if there is a completed exp waiting, 0 otherwise
void switchFleet(int fleet); //switch to specified fleet, reuqires index value of fleet