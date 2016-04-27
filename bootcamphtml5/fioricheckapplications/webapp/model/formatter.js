sap.ui.define([
	], function () {
		"use strict";

		return {
			/**
			 * Rounds the currency value to 2 digits
			 *
			 * @public
			 * @param {string} sValue value to be formatted
			 * @returns {string} formatted currency value with 2 digits
			 */
			currencyValue : function (sValue) {
				if (!sValue) {
					return "";
				}

				return parseFloat(sValue).toFixed(2);
			}
		// ***************************************************************************************************
		// Start of Custom code 
		// ***************************************************************************************************			
		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		 ,
		numberUnit: function(sValue) {
			if (!sValue) {
				return "0";
			}
			return sValue;
		},
		linkFormat: function(sValue) {
			if (sValue) {
				//return "https://www.ets.org/Media/Tests/TOEFL/pdf/SampleQuestions.pdf"+value;}
				//var oRootPath = this.getView().getModel("device").getProperty("/rootPath");
				return window.oRootPath + "/destinations/BootCampDestination/JobEnrollmentDemo/DocManagement?type=cv&empid=" + sValue;
			}
		}
		// ***************************************************************************************************
		// End of Custom code 
		// ***************************************************************************************************	
		};

	}
);
