/************************************************************/
/** todo: add descriptions to all teh functions             */
/** Done: First step was to organise the jscript functions  */
/**                                                         */
/************************************************************/

var LocationService = {
    getLocation: function () {
        if (App.debug)
            console.log("Start locationservice");              

        //Settings.setPreferences();

        // Laat de laatste bekende locatie
        if (App.debug)
            console.log("Load last location");
        this.loadLastLocation();

        if (navigator.geolocation) {
            // timeout at 60000 milliseconds (60 seconds)
            var options = { timeout: 60000 };
            navigator.geolocation.getCurrentPosition(LocationService.showLocation,
                LocationService.geoErrorHandler,
                options);
        } else {
            alert("Sorry, uw telefoon ondersteunt geen gps!");
        }
    },
    showLocation: function (position) {
        App.latitude = position.coords.latitude;
        App.longitude = position.coords.longitude;

        App.personRequestType.Latitude = position.coords.latitude;
        App.personRequestType.Longitude = position.coords.longitude;
        App.personRequestType.Range = 160000.0;

        App.buildingRequestType.Latitude = position.coords.latitude;
        App.buildingRequestType.Longitude = position.coords.longitude;
        App.buildingRequestType.Range = 160000.0;

        App.checkinRequestType.Latitude = position.coords.latitude;
        App.checkinRequestType.Longitude = position.coords.longitude;
        App.checkinRequestType.Range = 160000.0;

        LocationService.saveLastLocation();

        //We starten de applicatie op. We laden eerst de gebouwen en personen.

        //Bepaal de status van de gebruiker.

        Utility.readSettingsFromServer();
        Utility.readBuildings();
        Utility.readPersons();
        App.context.hideLoading();
    },
    loadLastLocation: function () {
        // note: herschrijf deze default const
        App.longitude = 5;
        App.latitude = 5;
        if (window.localStorage.getItem('latitude') != null) {
            App.latitude = window.localStorage.getItem('latitude');
        }
        if (window.localStorage.getItem('longitude') != null) {
            App.longitude = window.localStorage.getItem('longitude');
        }
    },
    saveLastLocation: function () {
        window.localStorage.setItem('latitude', App.latitude);
        window.localStorage.setItem('longitude', App.longitude);
    },
    geoErrorHandler: function (err) {
        if (err.code == 1) {
            alert("Error: Access is denied!");
        } else if (err.code == 2) {
            alert("Error: Position is unavailable!");
        }
    }
}
