sap.ui.define([
		"com/sap/sdc/hcp/bootcamp/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"com/sap/sdc/hcp/bootcamp/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/core/routing/History"
	], function (BaseController, JSONModel, formatter, Filter, FilterOperator, History) {
		"use strict";

		return BaseController.extend("com.sap.sdc.hcp.bootcamp.controller.Worklist", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the worklist controller is instantiated.
			 * @public
			 */
			onInit : function () {
				var oViewModel,
					iOriginalBusyDelay,
					oTable = this.byId("table");

				// Put down worklist table's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the table is
				// taken care of by the table itself.
				iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
				this._oTable = oTable;
				// keeps the search state
				this._oTableSearchState = [];

				// Model used to manipulate control states
				oViewModel = new JSONModel({
					worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
					saveAsTileTitle: this.getResourceBundle().getText("worklistViewTitle"),
					shareOnJamTitle: this.getResourceBundle().getText("worklistViewTitle"),
					shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
					shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
					tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
					tableBusyDelay : 0
				});
				this.setModel(oViewModel, "worklistView");

				// Make sure, busy indication is showing immediately so there is no
				// break after the busy indication for loading the view's meta data is
				// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
				oTable.attachEventOnce("updateFinished", function(){
					// Restore original busy indicator delay for worklist's table
					oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
				});
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Triggered by the table's 'updateFinished' event: after new table
			 * data is available, this handler method updates the table counter.
			 * This should only happen if the update was successful, which is
			 * why this handler is attached to 'updateFinished' and not to the
			 * table's list binding's 'dataReceived' method.
			 * @param {sap.ui.base.Event} oEvent the update finished event
			 * @public
			 */
			onUpdateFinished : function (oEvent) {
				// update the worklist's object counter after the table update
				var sTitle,
					oTable = oEvent.getSource(),
					iTotalItems = oEvent.getParameter("total");
				// only update the counter if the length is final and
				// the table is not empty
				if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
				} else {
					sTitle = this.getResourceBundle().getText("worklistTableTitle");
				}
				this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
			},

			/**
			 * Event handler when a table item gets pressed
			 * @param {sap.ui.base.Event} oEvent the table selectionChange event
			 * @public
			 */
			onPress : function (oEvent) {
				// The source is the list item that got pressed
				this._showObject(oEvent.getSource());
			},


			/**
			 * Event handler for navigating back.
			 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
			 * If not, it will navigate to the shell home
			 * @public
			 */
			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash(),
					oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

				if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
					history.go(-1);
				} else {
					oCrossAppNavigator.toExternal({
						target: {shellHash: "#Shell-home"}
					});
				}
			},

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				var oViewModel = this.getModel("worklistView"),
					oShareDialog = sap.ui.getCore().createComponent({
						name: "sap.collaboration.components.fiori.sharing.dialog",
						settings: {
							object:{
								id: location.href,
								share: oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});
				oShareDialog.open();
			},

			onSearch : function (oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {
					// Search field's 'refresh' button has been pressed.
					// This is visible if you select any master list item.
					// In this case no new search is triggered, we only
					// refresh the list binding.
					this.onRefresh();
				} else {
					var oTableSearchState = [];
					var sQuery = oEvent.getParameter("query");

					if (sQuery && sQuery.length > 0) {
						oTableSearchState = [new Filter("DESCRIPTION", FilterOperator.Contains, sQuery)];
					}
					this._applySearch(oTableSearchState);
				}

			},

			/**
			 * Event handler for refresh event. Keeps filter, sort
			 * and group settings and refreshes the list binding.
			 * @public
			 */
			onRefresh : function () {
				this._oTable.getBinding("items").refresh();
			},

			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */

			/**
			 * Shows the selected item on the object page
			 * On phones a additional history entry is created
			 * @param {sap.m.ObjectListItem} oItem selected Item
			 * @private
			 */
			_showObject : function (oItem) {
				this.getRouter().navTo("object", {
					objectId: oItem.getBindingContext().getProperty("JOBID")
				});
			},

			/**
			 * Internal helper method to apply both filter and search state together on the list binding
			 * @param {object} oTableSearchState an array of filters for the search
			 * @private
			 */
			_applySearch: function(oTableSearchState) {
				var oViewModel = this.getModel("worklistView");
				this._oTable.getBinding("items").filter(oTableSearchState, "Application");
				// changes the noDataText of the list in case there are no filter results
				if (oTableSearchState.length !== 0) {
					oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
				}
			}
			// ***************************************************************************************************
		// Start of Custom function code
		// *****************************************************************************************************
		,
		applyPost: function(oEvent) {

			var jobid = oEvent.getSource().getModel().getProperty(oEvent.getSource().getBindingContext().getPath()).JOBID;
			//var selfId = this.getView().getModel("userapi").getProperty("/name");

			var oData = {
				"JOBID": jobid,
				"PERSONID": this.getView().getModel('userapi').getProperty("/name"),
				"CREATED_ON": null,
				"EMAIL": this.getView().getModel('userapi').getProperty("/email"),
				"FIRST_NAME": this.getView().getModel('userapi').getProperty("/firstName"),
				"LAST_NAME": this.getView().getModel('userapi').getProperty("/lastName"),
				"LOCATION": this.getView().getModel('userapi').getProperty("/country")
			};
			this.getView().getModel().create("/Enrollments", oData);

		},
		onExit: function() {
			if (this._oPopover) {
				this._oPopover.destroy();
			}
			if (this._oPopoverR) {
				this._oPopoverR.destroy();
			}
		},
		handleUploadComplete: function(oEvent) {
			var sResponse = oEvent.getParameter("response");
			if (sResponse) {
				sap.m.MessageToast.show("Upload Success");
			}

		},

		handleUploadPress: function(oEvent) {
			var oFileUploader = this.getView().byId("fileUploader");
			oFileUploader.upload();
		},

		handleUploadResumeProfile: function(oEvent) {
			var oFileUploader = sap.ui.getCore().byId('fileUploaderResume');
			var url = oFileUploader.getUploadUrl();
			var newURL = window.oRootPath + url;
			oFileUploader.setUploadUrl(newURL);
			oFileUploader.upload();
			this._oPopoverR.close();
		},

		handleUploadPicPhoto: function(oEvent) {

			var oFileUploader = sap.ui.getCore().byId('fileUploaderPicture');
			var url = oFileUploader.getUploadUrl();
			var newURL = window.oRootPath + url;
			oFileUploader.setUploadUrl(newURL);
			oFileUploader.upload();
			oFileUploader.upload();
			this._oPopover.close();

		},
		handleUploadPicPopover: function(oEvent) {
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("com.sap.sdc.hcp.bootcamp.view.PopoverPic", this);
				this.getView().addDependent(this._oPopover);
			}

			this._oPopover.openBy(oEvent.getSource());
		},
		handleUploadResumePopover: function(oEvent) {
			if (!this._oPopoverR) {
				this._oPopoverR = sap.ui.xmlfragment("com.sap.sdc.hcp.bootcamp.view.PopoverProfile", this);
				this.getView().addDependent(this._oPopoverR);
			}

			this._oPopoverR.openBy(oEvent.getSource());
		},
		handleCloseButton: function(oEvent) {
			this._oPopover.close();
		},
		handleCloseRButton: function(oEvent) {
			this._oPopoverR.close();
		}

		// ***************************************************************************************************
		// End of Custom code  
		// ***************************************************************************************************	

		});
	}
);
