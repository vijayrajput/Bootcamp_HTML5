jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
		"sap/ui/test/Opa5",
		"com/sap/sdc/hcp/bootcamp/test/integration/pages/Common",
		"sap/ui/test/opaQunit",
		"com/sap/sdc/hcp/bootcamp/test/integration/pages/Worklist",
		"com/sap/sdc/hcp/bootcamp/test/integration/pages/Object",
		"com/sap/sdc/hcp/bootcamp/test/integration/pages/NotFound",
		"com/sap/sdc/hcp/bootcamp/test/integration/pages/Browser",
		"com/sap/sdc/hcp/bootcamp/test/integration/pages/App"
	], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.sap.sdc.hcp.bootcamp.view."
	});

	sap.ui.require([
		"com/sap/sdc/hcp/bootcamp/test/integration/WorklistJourney",
		"com/sap/sdc/hcp/bootcamp/test/integration/ObjectJourney",
		"com/sap/sdc/hcp/bootcamp/test/integration/NavigationJourney",
		"com/sap/sdc/hcp/bootcamp/test/integration/NotFoundJourney",
		"com/sap/sdc/hcp/bootcamp/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});