/************************************************************/
/** todo: add descriptions to all teh functions             */
/** Done: First step was to organise the jscript functions  */
/**                                                         */
/************************************************************/

var Utility = {
    appendFeedback: function (StartElement, elementToAppend) {
        $(StartElement).append(elementToAppend);
    },
    removeElement: function (timer, elementToRemove) {
        setTimeout(
              function () {
                  $(elementToRemove).remove();
              }, timer);
    },
    loadProfile: function () {
        if (App.debug)
            console.log("Loading profile");


        if (App.currentPerson == null) {
            alert("No profile loaded");
        } else {
            //Plaats de waardes vanuit het currentPersonProfile in de velden.
            $("#profile-firstname").val(App.currentPerson.FirstName);
            $("#profile-lastname").val(App.currentPerson.LastName);

            //Contactinfo.
            $("#profile-telephone").val(App.currentPerson.Telephone);
            $("#profile-mobilephone").val(App.currentPerson.Mobile);
            $("#profile-emailaddress").val(App.currentPerson.EMailAddress);

            var contactswitch = $("#profile-showContactInformation").data("kendoMobileSwitch");
            if (App.currentPerson.ShowMyContactData) {
                contactswitch.check(true);
            } else {
                contactswitch.check(false);
            }

            var ehboswitch = $("#profile-hasEHBO").data("kendoMobileSwitch");
            ehboswitch.check(App.currentPerson.HasEHBO);

            var ontruimerswitch = $("#profile-hasOntruimer").data("kendoMobileSwitch");
            ontruimerswitch.check(App.currentPerson.HasOntruimer);


            var hasReceptieswitch = $("#profile-hasReceptie").data("kendoMobileSwitch");
            hasReceptieswitch.check(App.currentPerson.HasReceptie);

            var hasBHVSVswitch = $("#profile-hasBHVSV").data("kendoMobileSwitch");
            hasBHVSVswitch.check(App.currentPerson.HasBHVSV)

            var hasAdemluchtswitch = $("#profile-hasAdemlucht").data("kendoMobileSwitch");
            hasAdemluchtswitch.check(App.currentPerson.HasAdemlucht);

        }
    },
    saveProfile: function () {
        if (App.debug)
            console.log("Saving profile");

        //Zet de velden van het formulier in de variable currentPerson.
        App.currentPerson.LastName = $("#profile-lastname").val();
        App.currentPerson.FirstName = $("#profile-firstname").val();

        App.currentPerson.Telephone = $("#profile-telephone").val();
        App.currentPerson.Mobile = $("#profile-mobilephone").val();
        App.currentPerson.EMailAddress = $("#profile-emailaddress").val();

        var contactswitch = $("#profile-showContactInformation").data("kendoMobileSwitch");
        if (contactswitch.check() == true) {
            App.currentPerson.ShowMyContactData = true;
        } else {
            App.currentPerson.ShowMyContactData = false;
        }

        //        var guestswitch = $("#profile-showGuestLocations").data("kendoMobileSwitch");
        //        if (guestswitch.check() == true) {
        //            App.currentPerson.ShowGuestBuildings = true;
        //        } else {
        //            App.currentPerson.ShowGuestBuildings = false;
        //        }

        if (App.debug)
            console.log("EHBO");

        var ehboswitch = $("#profile-hasEHBO").data("kendoMobileSwitch");
        if (ehboswitch.check() == true) {
            App.currentPerson.HasEHBO = true;
        } else {
            App.currentPerson.HasEHBO = false;
        }

        if (App.debug)
            console.log("Ontruimer");

        var ontruimerswitch = $("#profile-hasOntruimer").data("kendoMobileSwitch");
        if (ontruimerswitch.check() == true) {
            App.currentPerson.HasOntruimer = true;
        } else {
            App.currentPerson.HasOntruimer = false;
        }

        if (App.debug)
            console.log("Receptie");

        var hasReceptieswitch = $("#profile-hasReceptie").data("kendoMobileSwitch");
        if (hasReceptieswitch.check() == true) {
            App.currentPerson.HasReceptie = true;
        } else {
            App.currentPerson.HasReceptie = false;
        }

        if (App.debug)
            console.log("BHVSV");

        var hasBHVSVswitch = $("#profile-hasBHVSV").data("kendoMobileSwitch");
        if (hasBHVSVswitch.check() == true) {
            App.currentPerson.HasBHVSV = true;
        } else {
            App.currentPerson.HasBHVSV = false;
        }

        if (App.debug)
            console.log("Ademlucht");

        var hasAdemluchtswitch = $("#profile-hasAdemlucht").data("kendoMobileSwitch");
        if (hasAdemluchtswitch.check() == true) {
            App.currentPerson.HasAdemlucht = true;
        } else {
            App.currentPerson.HasAdemlucht = false;
        }

        Utility.saveSettingsToServer();

        //add feedback element next to the safe btn      
        //Utility.appendFeedback(".backbtn-wrapper", "<span class='feedback-right'>Gegevens zijn bewaard.</span>");

        //delete it after 2 seconds
        //Utility.removeElement(2000, ".feedback-right");

    },
    saveSettingsToServer: function () {
        if (App.debug) {
            console.log("Saving setting to server");
            console.log(App.currentPerson);
        }

        $.ajax({

            beforeSend: function (xhr) {
                xhr.setRequestHeader("authenticationToken", App.currentIdentity);
            },
            url: App.webapiurl + "person",
            type: "PUT",
            data: App.currentPerson,
            async: false,
            statusCode: {
                200: function (result) {
                    //alert("Changes saved");
                    App.currentPerson = result;
                    App.reloadData();

                },
                403: function (result) {
                    alert("Not Allowed");
                },
                404: function () {
                    //Zorg er voor dat de settings optie niet kan worden geselcteerd
                    //$("#layout-status").hide();
                },
                405: function () {
                    alert("Not Allowed");
                }
            }
        });
    },
    loadCheckinDataSource: function () {
        if (App.debug)
            console.log("Loading checkin data");


        top.CheckinDataSource = top.kendo.data.DataSource.create({
            schema: App.checkinSchema,
            transport:
        {
            read: {
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("authenticationToken", App.currentIdentity);
                },
                // note: this base url needs to come from a setting
                url: App.webapiurl + "checkin",
                type: "GET",
                async: false,
                dataType: "json"
            }
        },
            group: "checkin",
            error: function () { console.log(arguments); }
        });

        if (App.debug)
            console.log(top.CheckinDataSource);
    },
    // buildings at which we can sign in (let's say if we are within 200m)
    loadCheckinBuildingDataSource: function () {
        if (App.debug)
            console.log("Loading checkin buildings datasource :" + App.webapiurl + "buildings");

        top.CheckinBuildingDataSource = top.kendo.data.DataSource.create({
            schema: App.buildingSchema,
            transport:
        {
            read: {
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("authenticationToken", App.currentIdentity);
                },
                url: App.webapiurl + "buildings",
                data: App.checkinRequestType,
                type: "POST",
                async: false,
                dataType: "json"
            }
        },
            error: function (e) {
                var xhr = e.xhr;
                var status = e.status;
                var errorThrown = e.errorThrown;
                var sender = e.sender;

                alert(xhr + "\n" + status + "\n" + errorThrown + "\n" + sender);
            }
        });

        if (App.debug)
            console.log(top.CheckinBuildingDataSource);

    },
    loadPersonForBuildingDataSource: function () {
        if (App.debug)
            console.log("Loading person for building data");

        top.PersonForBuildingDataSource = top.kendo.data.DataSource.create({
            schema: App.personSchema,
            transport:
        {
            read: {
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("authenticationToken", App.currentIdentity);
                },
                url: App.webapiurl + "persons" + "/1",
                type: "GET",
                async: true,
                dataType: "json"
            }
        },
            error: function () {
                console.log(arguments);
            }
        });
    },
    loadAllPersonDataSource: function () {
        if (App.debug)
            console.log("Loading all person data");

        top.AllPersonDataSource = top.kendo.data.DataSource.create({
            schema: App.personSchema,
            transport:
        {
            read: {
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("authenticationToken", App.currentIdentity);
                },
                url: App.webapiurl + "persons",
                data: App.personRequestType,
                type: "POST",
                async: true,
                dataType: "json"
            }
        },
            error: function () {
                console.log(arguments);
            }
        });

    },
    loadBuildingDataSource: function () {        
        top.AllBuildingDataSource = top.kendo.data.DataSource.create({
            schema: App.buildingSchema,
            transport:
        {
            read: {
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("authenticationToken", App.currentIdentity);
                },
                url: App.webapiurl + "buildings",
                data: App.buildingRequestType,
                type: "POST",
                async: false,
                dataType: "json",
                requestStart: function (e) {
                    LocationService.getLocation();
                }
            }
        },
            error: function () {
                console.log("ERROR: " + arguments);
            }
        });
    },
    readPersons: function () {
        AllPersonDataSource.transport.options.read.url = App.webapiurl + "persons";
        AllPersonDataSource.read();
        AllPersonDataSource.sort([{ field: "Type", dir: "asc" }, { field: "Distance", dir: "asc"}]);
    },
    readBuildings: function () {
        //Lees gebouwen in.
        AllBuildingDataSource.transport.options.read.url = App.webapiurl + "buildings";
        AllBuildingDataSource.read();
        //AllBuildingDataSource.sort([{ field: "Type", dir: "asc" }, { field: "Distance", dir: "asc" }]);
        AllBuildingDataSource.sort([{ field: "Distance", dir: "asc"}]);

        CheckinBuildingDataSource.transport.options.read.url = App.webapiurl + "buildings";
        CheckinBuildingDataSource.read();
        CheckinBuildingDataSource.sort([{ field: "Distance", dir: "asc"}]);

    },
    //Read settings from server.
    readSettingsFromServer: function () {
        if (App.currentIdentity != "") {
            $.ajax({

                beforeSend: function (xhr) {
                    xhr.setRequestHeader("authenticationToken", App.currentIdentity);
                },
                url: App.webapiurl + "person",
                type: "GET",
                async: false,
                statusCode: {
                    200: function (result) {
                        //Prepareer de velden waar de settings kan worden aangepast.
                        //                            $("#profile-firstname").val(result.FirstName);

                        App.currentPerson = result;

                    },
                    403: function (result) {
                        Console.log("not allowed");
                    },
                    404: function () {
                        //Zorg er voor dat de settings optie niet kan worden geselcteerd
                        $("#layout-status").hide();
                    }
                }
            });
        }
    }
}