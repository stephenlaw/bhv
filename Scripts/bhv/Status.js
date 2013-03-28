/************************************************************/
/** todo: add descriptions to all teh functions             */
/** Done: First step was to organise the jscript functions  */
/**                                                         */
/************************************************************/

var Status = {
    // ask gerrit: are we going to use this? no reference found
    DoCheckInFromDetail: function (e) {
        var button = e.button, building = top.ds.get(button.data("itemId"));
        App.currentCheckinRecord.BuildingId = building.id;
        Status.CheckIn();
    },
    PrepareCheckin: function (e) {
        if (App.debug)
            console.log("preparing a checkin");
        var view = e.view;

        var buildingId = view.params.id;
        App.currentCheckinRecord.BuildingId = buildingId;
        App.currentCheckinRecord.CheckinDevice = "Mobile";
        App.currentCheckinRecord.CheckinMethode = "Manual";
        Status.CheckIn();
    },

    PrepareCheckOut: function () {
        App.currentCheckinRecord.CheckoutDevice = "Mobile";
        App.currentCheckinRecord.CheckoutMethode = "Manual";
        Status.CheckOut();
    },
    CheckIn: function () {
        $.ajax({

            beforeSend: function (xhr) {
                xhr.setRequestHeader("authenticationToken", App.currentIdentity);
            },
            url: App.webapiurl + "checkin",
            type: "POST",
            data: App.currentCheckinRecord,
            async: false,
            error: function (xhr) {
                console.log('Error:' + xhr.statusText);
            },
            statusCode: {
                200: function (result) {
                    //Laad de gebouwen en personen opnieuw
                    //                    Utility.readBuildings();
                    //                    Utility.readPersons();
                    App.reloadData();
                    Status.GetStatus();
                },
                403: function (result) {
                    alert("No Key specified");
                }
            },
            succes: function () {

            }

        });
    },
    CheckOut: function () {
        if (App.debug)
            console.log("We are going to logout " + App.currentIdentity);
        App.currentCheckinRecord.CheckinServiceMode = "checkout";
        $.ajax({

            beforeSend: function (xhr) {
                xhr.setRequestHeader("authenticationToken", App.currentIdentity);
            },
            //is het niet netter om een checkout controller te maken?
            // er zat een bug in dat we eerst uitchecken en daarna weer inchecken -_-
            url: App.webapiurl + "checkin",
            type: "POST",
            data: App.currentCheckinRecord,
            async: false,
            error: function (xhr) {
                console.log('Error:' + xhr.statusText);
                // for now: totdat we de checkinviewmodel hebben aangepast
                App.reloadData();
                Status.GetStatus();                                
            },
            statusCode:
            {
                200: function (result) {
                    if (App.debug)
                        console.log("checkout without error");
                    //Lees gebouwen en personen opnieuw in.
                    App.reloadData();
                    Status.GetStatus();
                    //top.document.location.href = "Index.html#tabstrip-status";
                    //$(window.location).attr('href', 'Index.html#tabstrip-status');
                },
                403: function (result) {
                    console.log("No Key specified");
                }
            },
            succes: function (result) {
                if (App.debug)
                    console.log('succes function');

            }
        });
    },
    doCheckin: function (id) {
        //alert("do checkin :" + id);
        var buildingId = id;
        App.currentCheckinRecord.BuildingId = buildingId;
        App.currentCheckinRecord.CheckinDevice = "Mobile";
        App.currentCheckinRecord.CheckinMethode = "Manual";
        Status.CheckIn();
        Status.GetStatus();
    },
    GetStatus: function () {
        if (App.debug)
            console.log("getting status for: " + App.currentIdentity);

        if (App.currentIdentity == "") {
            // what are we going to do here? it seems to be a guest account
        } else {
            $.ajax({

                beforeSend: function (xhr) {
                    xhr.setRequestHeader("authenticationToken", App.currentIdentity);
                },
                url: App.webapiurl + "checkin",
                type: "GET",
                async: false,
                statusCode: {
                    200: function (result) {
                        App.currentCheckinRecord = result;
                        if (result.IsCheckedIn) {
                            $("#CheckinOut").text('Afmelden');
                            $("#StatusMessage").html('<h3>U bent op dit moment aangemeld in het ' + result.BuildingName + ' <br/>U kunt zich afmelden door voor de optie afmelden te kiezen</h3>');
                            //Zorg er voor dat de andere controls niet meer zichtbaar zijn.
                            $("#MyAssignedBuildings").hide();
                            $("#thisBuilding").show();
                        } else {
                            //Controleer of er moet worden gekozen uit meerdere gebouwen.
                            if (App.currentCheckinRecord.KnownCheckinStatus) {
                                App.currentCheckinRecord.BuildingId = App.currentCheckinRecord.KnownBuildingId;
                                $("#CheckinOut").text('Aanmelden in ' + top.cApp.urrentCheckinRecord.KnownBuildingName).attr("href", "#checkin?id=" + App.currentCheckinRecord.BuildingId);
                                $("#thisBuilding").show();
                                $("#MyAssignedBuildings").hide();
                                $("#StatusMessage").text('Hallo aanmelden');
                            } else {
                                $("#thisBuilding").hide();
                                if (App.debug)
                                    console.log("check if there are buildings nearby. if no, show a response");


                                //check if there are buildings nearby. if no, show a response
                                if (top.CheckinBuildingDataSource._total > 0) {
                                    top.CheckinBuildingDataSource.read();
                                    $("#MyAssignedBuildings").show();
                                    $("#StatusMessage").html('<h3>Aanmelden kan in 1 of meerdere gebouwen</h3>');
                                } else {
                                    $("#MyAssignedBuildings").hide();
                                    $("#StatusMessage").html('<h3>Er zijn geen gebouwen in de buurt waar je je kan aanmelden</h3>');
                                }

                            }
                        }
                    },
                    403: function (result) {
                        $("#ger").html("Access was denied");
                    }
                }
            });
        }
    }
}