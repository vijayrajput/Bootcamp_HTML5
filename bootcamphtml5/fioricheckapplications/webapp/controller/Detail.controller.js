/*global location */
sap.ui.define([
	"com/sap/sdc/hcp/bootcamp/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/viz/ui5/controls/common/feeds/FeedItem',
	'sap/viz/ui5/data/FlattenedDataset',
	'sap/ui/model/Filter',
	"com/sap/sdc/hcp/bootcamp/model/formatter"
], function(BaseController, JSONModel, FeedItem, FlattenedDataset, Filter, formatter) {
		"use strict";

		return BaseController.extend("com.sap.sdc.hcp.bootcamp.controller.Detail", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading")
				});

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

				this.setModel(oViewModel, "detailView");

				this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
				
				// ***************************************************************************************************
			// Start of Custom code for graph
			// *****************************************************************************************************		

			var oVizFrame = this.getView().byId("idVizFrameDonut");
			oVizFrame.setVizType('donut');
			oVizFrame.setUiConfig({
				"applicationSet": "fiori"
			});

			var oPopOver = this.getView().byId("idPopOver");
			oPopOver.connect(oVizFrame.getVizUid());

			var oDataset = new FlattenedDataset({
				dimensions: [{
					name: "LOCATION",
					value: "{LOCATION}"
				}],
				measures: [{
					name: "COUNT",
					value: "{Count}"
				}],
				data: {
					path: "AnalyticDetails"
				}
			});
			oVizFrame.setVizProperties({
				legend: {
					title: {
						visible: true,
						text: this.getResourceBundle().getText("detailChartlegend")
					}
				},
				title: {
					visible: true,
					text: this.getResourceBundle().getText("detailChartTitle")
				}
			});

			oVizFrame.setDataset(oDataset);
			

			var feedSize = new FeedItem({
					'uid': "size",
					'type': "Measure",
					'values': ["COUNT"]
				}),
				feedColor = new FeedItem({
					'uid': "color",
					'type': "Dimension",
					'values': ["LOCATION"]
				});
			oVizFrame.addFeed(feedSize);
			oVizFrame.addFeed(feedColor);

			// ***************************************************************************************************
			// End of Custom code
			// *****************************************************************************************************
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Event handler when the share by E-Mail button has been clicked
			 * @public
			 */
			onShareEmailPress : function () {
				var oViewModel = this.getModel("detailView");

				sap.m.URLHelper.triggerEmail(
					null,
					oViewModel.getProperty("/shareSendEmailSubject"),
					oViewModel.getProperty("/shareSendEmailMessage")
				);
			},

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				var oViewModel = this.getModel("detailView"),
					oShareDialog = sap.ui.getCore().createComponent({
						name : "sap.collaboration.components.fiori.sharing.dialog",
						settings : {
							object :{
								id : location.href,
								share : oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});

				oShareDialog.open();
			},

			/**
			 * Updates the item count within the line item table's header
			 * @param {object} oEvent an event containing the total number of items in the list
			 * @private
			 */
			onListUpdateFinished : function (oEvent) {
				var sTitle,
					iTotalItems = oEvent.getParameter("total"),
					oViewModel = this.getModel("detailView");

				// only update the counter if the length is final
				if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
					if (iTotalItems) {
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
					} else {
						//Display 'Line Items' instead of 'Line items (0)'
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
					}
					oViewModel.setProperty("/lineItemListTitle", sTitle);
				}
			},

			/**
			 * Event handler  for navigating back.
			 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
			 * If not, it will replace the current entry of the browser history with the master route.
			 * @public
			 */
			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash(),
					oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

				if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
					history.go(-1);
				} else {
					this.getRouter().navTo("master", {}, true);
				}
			},

			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

			/**
			 * Binds the view to the object path and expands the aggregated line items.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("Jobs", {
						JOBID :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},

			/**
			 * Binds the view to the object path. Makes sure that detail view displays
			 * a busy indicator while data for the corresponding element binding is loaded.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound to the view.
			 * @private
			 */
			_bindView : function (sObjectPath) {
				// Set busy indicator during view binding
				var oViewModel = this.getModel("detailView");

				// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
				oViewModel.setProperty("/busy", false);

				this.getView().bindElement({
					path : sObjectPath,
					events: {
						change : this._onBindingChange.bind(this),
						dataRequested : function () {
							oViewModel.setProperty("/busy", true);
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("detailObjectNotFound");
					// if object could not be found, the selection in the master list
					// does not make sense anymore.
					this.getOwnerComponent().oListSelector.clearMasterListSelection();
					return;
				}

				var sPath = oElementBinding.getPath(),
					oResourceBundle = this.getResourceBundle(),
					oObject = oView.getModel().getObject(sPath),
					sObjectId = oObject.JOBID,
					sObjectName = oObject.DESCRIPTION,
					oViewModel = this.getModel("detailView");

				this.getOwnerComponent().oListSelector.selectAListItem(sPath);

				oViewModel.setProperty("/saveAsTileTitle",oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
				oViewModel.setProperty("/shareOnJamTitle", sObjectName);
				oViewModel.setProperty("/shareSendEmailSubject",
					oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
					oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			},

			_onMetadataLoaded : function () {
				// Store original busy indicator delay for the detail view
				var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
					oViewModel = this.getModel("detailView"),
					oLineItemTable = this.byId("lineItemsList"),
					iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

				// Make sure busy indicator is displayed immediately when
				// detail view is displayed for the first time
				oViewModel.setProperty("/delay", 0);
				oViewModel.setProperty("/lineItemTableDelay", 0);

				oLineItemTable.attachEventOnce("updateFinished", function() {
					// Restore original busy indicator delay for line item table
					oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
				});

				// Binding the view will set it to not busy - so the view is always busy if it is not bound
				oViewModel.setProperty("/busy", true);
				// Restore original busy indicator delay for the detail view
				oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
			}
			// ***************************************************************************************************
		// Start of Custom function code
		// *****************************************************************************************************
		,
		linkOnCalenderPress: function(value) {

			var source = value.getSource();
			var personId = source.getCustomData()[0].getValue();
			var jobId = source.getCustomData()[1].getValue();
			// Path Need to change to Java Application.
			var url = 'https://bootcampp1940991767trial.hanatrial.ondemand.com/JobEnrollmentDemo/GoogleAccess?title=Interview%20with%20' + personId;
			var googleWindow = window.open(url, "Google Page", "width=480,height=585,top=100,left=300,location=no");

			//var oRootPath = this.getView().getModel("device").getProperty("/rootPath");
			var url = window.oRootPath +"/BootCampDestination/JobEnrollmentDemo/MailServlet?personid=" + personId + "&jobid=" + jobId;

			$
				.ajax({
					type: "GET",
					url: url,
					data: "",
					async: true,
					datatype: "json",
					contenttype: "application/json",
					success: function(resp) {
						sap.m.MessageToast.show("Email Successfully Sent");

					},
					error: function(e) {
						sap.m.MessageToast.show("Error while sending email");
					}
				});

		}

		});
		
		

	}
);
