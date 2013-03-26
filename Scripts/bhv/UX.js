/************************************************************/
/** todo: add descriptions to all teh functions             */
/** Done: First step was to organise the jscript functions  */
/**                                                         */
/************************************************************/

var UX = {
    ShowCheckinPersons: function (e) {
        var view = e.view;
        var buildingId = view.params.id;
        top.PersonForBuildingDataSource.transport.options.read.url = App.webapiurl + "persons/" + buildingId;
        top.PersonForBuildingDataSource.read();
    },
    ShowPersonDetailViewTest: function (e) {

        var view = e.view;

        AllPersonDataSource.fetch(function () {
            App.item = top.AllPersonDataSource.get(view.params.id);

            if (App.item.Telephone != null) {
                $("#Personcontactview-telephone-ref").attr("href", "tel:" + App.item.Telephone);
            } else {
                $("#Personcontactview-telephone").hide();
            }
            if (App.item.EMailAddress != null) {
                $("#Personcontactview-mail-ref").attr("href", "mailto:" + App.item.EMailAddress);
            } else {
                $("#Personcontactview-mail").hide();
            }

            // also set the header nav bar subtitle
            $("#PersonDetailsTest .view-title").html(App.item.FullName);

            view.scrollerContent.html(App.testTemplate(App.item));

            top.kendo.mobile.init(view.content);
        });
    },
    ShowAllBuildingsView: function (e) {
        // Toon de gebouwen in een bepaalde straal. 
        e.view.content.find(".item-list").data("kendoMobileListView").refresh();
    },
    ShowAllPersonsView: function (e) {
        e.view.content.find(".item-list").data("kendoMobileListView").refresh();
    },
    closeModalViewContact: function () {
        $("#PersonContactView").kendoMobileModalView("close");
    },
    /********************************************
    / detail page of a building with some basic info
    / todo: add some more details to it?             
    /********************************************/
    showBuildingDetailsView: function (e) {

        var view = e.view;

        top.AllBuildingDataSource.fetch(function () {
            App.item = AllBuildingDataSource.get(view.params.id);

            if (App.item.EMailAddress != null) {
                $("#Buildingcontactview-telephone-ref").attr("href", "tel:" + App.item.Telephone);
            } else {
                $("#Buildingcontactview-telephone").hide();
            }
            if (App.item.EMailAddress != null) {
                $("#Buildingcontactview-mail-ref").attr("href", "mailto:" + App.item.EMailAddress);
            } else {
                $("#Buildingcontactview-mail").hide();
            }

            // also set the header nav bar subtitle
            $("#buildingDetails .view-subtitle").html(App.item.Name);

            view.scrollerContent.html(App.itemDetailsTemplate(App.item));
            top.kendo.mobile.init(view.content);
        });
    },
    //remark: this one is not used?
    showBuildingView: function (e) {
        e.view.content.find(".item-list").data("kendoMobileListView").refresh();
    }
}
