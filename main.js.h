void main();

void ipcs(); //setup icpcs

void receiveArb(object par,string channel); //receive and parse api data object and send to viewer
void setupGameWindow(object args); //creates/does stuff for game window

void viewerEvents(); //viewer events
void windowRestore();
void saveWindow();
void windowClose(); //any window close event handler