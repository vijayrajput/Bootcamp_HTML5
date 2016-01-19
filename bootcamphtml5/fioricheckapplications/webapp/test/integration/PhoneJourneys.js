jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"com/sap/sdc/hcp/bootcamp/test/integration/NavigationJourneyPhone",
		"com/sap/sdc/hcp/bootcamp/test/integration/NotFoundJourneyPhone",
		"com/sap/sdc/hcp/bootcamp/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});

