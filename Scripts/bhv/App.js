/************************************************************/
/** todo: add descriptions to all teh functions             */
/** Done: First step was to organise the jscript functions  */
/**                                                         */
/************************************************************/

var App = {
    debug: false,
    currentCheckinRecord: null,
    showGuestBuildings: true,
    buildings: null,
    item: null,
    latitude: 0,
    longitude: 0,
    currentIdentity: null,
    showContactData: null,
    webapiurl: null,
    range: 160000.0,
    currentPerson: null,
    schema: { model: { id: "Id"} },
    checkinSchema: { model: { id: "Id"} },
    personSchema: { model: { id: "Id"} },
    buildingSchema: { model: { id: "Id"} },
    context: null,
    buildingRequestType: null,
    checkinRequestType: null,
    personRequestType: null,
    itemDetailsTemplate: null,
    testTemplate: null,
    PersonForBuildingDataSource: null,
    AllPersonDataSource: null,
    AllBuildingDataSource: null,
    CheckinBuildingDataSource: null,
    CheckinDataSource: null,

    init: function () {
        if (App.debug)
            console.log("starting app");

        App.context = new top.kendo.mobile.Application(document.body);
        //start showing loading screen
        $(function () {
            App.context.showLoading();
        });

        //default fillers?
        this.buildingRequestType = { Type: "all", Latitude: 1, Longitude: 1, Range: 160000.0 };
        this.checkinRequestType = { Type: "all", Latitude: 1, Longitude: 1, Range: 160000.0 };
        this.personRequestType = { Type: "all", Latitude: this.latitude, Longitude: this.longitude, Range: 160000.0 };

        // set the templates
        this.itemDetailsTemplate = top.kendo.template($("#buildingDetailTemplate").html());
        this.testTemplate = top.kendo.template($("#ShowPersonDetailViewTest").html());

        //load demo data
        Settings.loadDemoData();

        //start loading locations?         
        LocationService.getLocation();
        //top.getLocation();

        //load all the datasources?        
        Utility.loadBuildingDataSource();
        Utility.loadAllPersonDataSource();
        Utility.loadPersonForBuildingDataSource();
        Utility.loadCheckinBuildingDataSource();
        Utility.loadCheckinDataSource();

        // disable status tab when not user is known
        if (this.currentIdentity == "" || this.currentIdentity == null)
            $("#layout-status").attr("style", "display:none;");

    },
    // for now this function exist for the reason to reload data after checking/checkout
    // untill we've found a better way to do this
    reloadData: function () {
        if (App.debug)
            console.log("reloading data");

        LocationService.getLocation();
        Utility.loadBuildingDataSource();
        Utility.loadAllPersonDataSource();
        Utility.loadPersonForBuildingDataSource();
        Utility.loadCheckinBuildingDataSource();
        Utility.loadCheckinDataSource();

        Utility.readBuildings();
        Utility.readPersons();
    }
}