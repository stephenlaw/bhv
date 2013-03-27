/************************************************************/
/** todo: add descriptions to all teh functions             */
/** Done: First step was to organise the jscript functions  */
/**                                                         */
/************************************************************/

var Settings = {
    loadPreferences: function () {
        if (App.debug)
            console.log("Prefenties wordt aangeroepen");
    },
    loadDemoData: function () {
        if (App.debug)
            console.log("Loading demo data");

        var webApiURL = "http://bhvapi.seigers.nl/api/";
        if(App.debug)
            webApiURL = "http://localhost/bhv.api/api/";

        window.localStorage.setItem('guestSwitch', true);
        window.localStorage.setItem('currentIdentity', true);
        window.localStorage.setItem('webapiurl', webApiURL);

        window.localStorage.setItem('currentIdentity', "law002");


        //App.showGuestBuildings = true;
        //App.currentIdentity = "law002";
        App.webapiurl = webApiURL;

        if (window.localStorage.getItem('guestSwitch') != null) {
            App.showGuestBuildings = window.localStorage.getItem('guestSwitch');
        }

        if (window.localStorage.getItem('currentIdentity') != null) {
            App.currentIdentity = window.localStorage.getItem('currentIdentity');
            $("#identity_label").val(App.currentIdentity);
            $("#preferences-identity").val(App.currentIdentity);
        } else {
            App.currentIdentity = null;
            $("#identity_label").val("Not Set");
            $("#preferences-identity").val(App.currentIdentity);
        }

        if (window.localStorage.getItem('webapiurl') != null) {
            App.webapiurl = window.localStorage.getItem('webapiurl');
            $("#preference-webapiurl").val(App.webapiurl);
        }

        App.showContactData = true;
        if (window.localStorage.getItem('show-contactdata') != null) {
            var contactData = window.localStorage.getItem('show-contactdata');
            if (contactData == "true") {
                App.showContactData = true;
                $("#preferences-show-contactdata").attr("checked", "checked");
            } else {
                App.showContactData = false;
                $("#preferences-show-contactdata").attr("checked", "unchecked");
            }
        }


        App.reloadData();
    },
    savePreferences: function () {
        window.localStorage.setItem('guestSwitch', true);

        var contactData = $("#preferences-show-contactdata").data("kendoMobileSwitch").check();
        window.localStorage.setItem('currentIdentity', contactData);

        var webapiData = $("#preference-webapiurl").val();
        window.localStorage.setItem('webapiurl', webapiData);

        var identity = $("#preferences-identity").val();
        window.localStorage.setItem('currentIdentity', identity);

        //add feedback element next to the safe btn      
        Utility.appendFeedback(".backbtn-wrapper", "<span class='feedback-right'>Voorkeuren zijn bewaard.</span>");

        //delete it after 2 seconds
        Utility.removeElement(2000, ".feedback-right");

        if (App.debug) {
            console.log("Start refreshing all data");
        }

        App.reloadData();
    },
    // saveidentity doesn't have any reference. Is it going to be used? Ask gerrit
    saveIdentity: function () {
        var identityValue = $("#identity_label").val();
        window.localStorage.setItem('currentIdentity', identityValue);
        App.currentIdentity = identityValue;
        //Reset van de applicatie moet eigenlijk plaatsvinden.
    },
    setPreferences: function () {
        App.showGuestBuildings = true;
        App.currentIdentity = "law002";
        App.webapiurl = "http://localhost/bhv.api/api/";
        //App.webapiurl = "http://bhvapi.seigers.nl/api/";

        if (window.localStorage.getItem('guestSwitch') != null) {
            App.showGuestBuildings = window.localStorage.getItem('guestSwitch');
        }

        if (window.localStorage.getItem('currentIdentity') != null) {
            App.currentIdentity = window.localStorage.getItem('currentIdentity');
            $("#identity_label").val(App.currentIdentity);
            $("#preferences-identity").val(App.currentIdentity);
        } else {
            App.currentIdentity = null;
            $("#identity_label").val("Not Set");
            $("#preferences-identity").val(App.currentIdentity);
        }

        if (window.localStorage.getItem('webapiurl') != null) {
            App.webapiurl = window.localStorage.getItem('webapiurl');
            $("#preference-webapiurl").val(App.webapiurl);
        }

        App.showContactData = true;
        if (window.localStorage.getItem('show-contactdata') != null) {
            var contactData = window.localStorage.getItem('show-contactdata');
            if (contactData == "true") {
                App.showContactData = true;
                $("#preferences-show-contactdata").attr("checked", "checked");
            } else {
                App.showContactData = false;
                $("#preferences-show-contactdata").attr("checked", "unchecked");
            }
        }
    }
}