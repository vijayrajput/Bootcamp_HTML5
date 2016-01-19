sap.ui.define([
		"com/sap/sdc/hcp/bootcamp/model/GroupSortState",
		"sap/ui/model/json/JSONModel",
		"sap/ui/thirdparty/sinon",
		"sap/ui/thirdparty/sinon-qunit"
	], function (GroupSortState, JSONModel) {
	"use strict";

	QUnit.module("GroupSortState - grouping and sorting", {
		beforeEach: function () {
			this.oModel = new JSONModel({});
			// System under test
			this.oGroupSortState = new GroupSortState(this.oModel, function() {});
		}
	});

	QUnit.test("Should always return a sorter when sorting", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.sort("RemainingTime").length, 1, "The sorting by RemainingTime returned a sorter");
		assert.strictEqual(this.oGroupSortState.sort("DESCRIPTION").length, 1, "The sorting by DESCRIPTION returned a sorter");
	});

	QUnit.test("Should return a grouper when grouping", function (assert) {
		// Act + Assert
		assert.strictEqual(this.oGroupSortState.group("RemainingTime").length, 1, "The group by RemainingTime returned a sorter");
		assert.strictEqual(this.oGroupSortState.group("None").length, 0, "The sorting by None returned no sorter");
	});


	QUnit.test("Should set the sorting to RemainingTime if the user groupes by RemainingTime", function (assert) {
		// Act + Assert
		this.oGroupSortState.group("RemainingTime");
		assert.strictEqual(this.oModel.getProperty("/sortBy"), "RemainingTime", "The sorting is the same as the grouping");
	});

	QUnit.test("Should set the grouping to None if the user sorts by DESCRIPTION and there was a grouping before", function (assert) {
		// Arrange
		this.oModel.setProperty("/groupBy", "RemainingTime");

		this.oGroupSortState.sort("DESCRIPTION");

		// Assert
		assert.strictEqual(this.oModel.getProperty("/groupBy"), "None", "The grouping got reset");
	});
});