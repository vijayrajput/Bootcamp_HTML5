sap.ui.define([
		"com/sap/sdc/hcp/bootcamp/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("com.sap.sdc.hcp.bootcamp.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);