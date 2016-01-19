jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 Jobs in the list
// * All 3 Jobs have at least one EnrollmentDetails

sap.ui.require([
	"sap/ui/test/Opa5",
	"com/sap/sdc/hcp/bootcamp/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"com/sap/sdc/hcp/bootcamp/test/integration/pages/App",
	"com/sap/sdc/hcp/bootcamp/test/integration/pages/Browser",
	"com/sap/sdc/hcp/bootcamp/test/integration/pages/Master",
	"com/sap/sdc/hcp/bootcamp/test/integration/pages/Detail",
	"com/sap/sdc/hcp/bootcamp/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.sap.sdc.hcp.bootcamp.view."
	});

	sap.ui.require([
		"com/sap/sdc/hcp/bootcamp/test/integration/MasterJourney",
		"com/sap/sdc/hcp/bootcamp/test/integration/NavigationJourney",
		"com/sap/sdc/hcp/bootcamp/test/integration/NotFoundJourney",
		"com/sap/sdc/hcp/bootcamp/test/integration/BusyJourney",
		"com/sap/sdc/hcp/bootcamp/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});

