sap.ui.define([
		"sap/ui/model/json/JSONModel",
		"sap/ui/Device"
	], function (JSONModel, Device) {
		"use strict";

		return {

			createDeviceModel : function () {
				var oModel = new JSONModel(Device);
				oModel.setDefaultBindingMode("OneWay");
				return oModel;
			},

			createFLPModel : function () {
				var fnGetUser = jQuery.sap.getObject("sap.ushell.Container.getUser"),
					bIsShareInJamActive = fnGetUser ? fnGetUser().isJamActive() : false,
					oModel = new JSONModel({
						isShareInJamActive: bIsShareInJamActive
					});
				oModel.setDefaultBindingMode("OneWay");
				return oModel;
			}
// ***************************************************************************************************
		// Start of Custom code 
		// User Information Model
// ***************************************************************************************************
			,
			
			createUserModel : function(){
				var oModel = new JSONModel("/destinations/BootCampDestination/JobEnrollmentDemo/GetUserAttributes");
				oModel.setDefaultBindingMode("OneWay");
				return oModel;
			}
// ***************************************************************************************************
		// End of Custom code 
// ***************************************************************************************************			

		};

	}
);