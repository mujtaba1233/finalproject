vulusionApp.controller(
	"QueryBuilderController",
	function QueryBuilderController(
		ModalService,
		CommonService,
		$scope,
		$timeout,
		$rootScope,
		$http
	) {
		init = function () {
			CommonService.authenticateUser().then(async function (response) {
				$scope.currentUser = response;
				$scope.allReports = []
				$scope.itemsByPage = 8;
				$scope.queries = {
					tableName: "",
					reportName: "Advance Report",
					columns: [],
					createdBy: $scope.currentUser.id,
					createdOn: new Date(),
					isActive: $scope.currentUser.active,
				};
				$scope.ReportId = -1
				$rootScope.logout = CommonService.logout;

				$scope.mode = "new";
				$scope.executeAndSave = false;
				if (window.location.search && window.location.search.indexOf("reportId") > -1) {
					$scope.mode = "update";
					$scope.ReportId = parseInt(window.location.search.split("?")[1].split("=")[1]);
					$scope.queries.reportId = $scope.ReportId;
					if (window.location.search.split("?")[2]) {
						$scope.execute = JSON.parse(
							window.location.search.split("?")[2].split("=")[1]
						);
						$scope.getReport();
						if ($scope.execute) {
							$scope.postQuery();
						}
					} else {
						$scope.getReport();
					}
				}
				$scope.columns = [];
				$scope.heading = "";
				$scope.report = [];
				$scope.fileName = $scope.queries.reportName + new Date().getTime() + '.csv';
			});
		};

		$scope.getTable = async function () {
			if ($scope.queries.tableName === "orders") {
				await $scope.getOrderColumns();

			} else {
				await $scope.getQuoteColumns();
			}

			$scope.columns.push({
				Default: null,
				Extra: "",
				Field: "SelectAll",
				Key: "",
				Null: "YES",
				Type: "varchar(255)"
			})
			$scope.columns.reverse()
			return

		};
		$scope.updateExportFileName = function (needToSave) {
			console.log($scope.queries.reportName + new Date().getTime() + '.csv')
			$scope.fileName = $scope.queries.reportName + new Date().getTime() + '.csv';
		}
		$scope.getOrderColumns = async function () {
			CommonService.showLoader()
			try {
				const response = await $http({
					method: "GET",
					url: getOrderColumnUrl,
					headers: {
						"Content-Type": "application/xml; charset=utf-8",
					},
				})
				$scope.columns = response.data;
				if ($scope.ReportId < 0) {
					$scope.queries.where = [{
						feild: "",
						condition: "",
						value: "",
					},];
				}

				$scope.heading = "Where clauses";
				$timeout(function () {
					$scope.$apply()
				})
				CommonService.hideLoader()

				return
			} catch (error) {
				CommonService.showError(error.message)
				return
			}


		};

		$scope.getQuoteColumns = async function () {

			try {
				const response = await $http({
					method: "GET",
					url: getQuoteColumnUrl,
					headers: {
						"Content-Type": "application/xml; charset=utf-8",
					},
				})
				$scope.columns = response.data;
				if ($scope.ReportId < 0) {
					$scope.queries.where = [{
						feild: "",
						condition: "",
						value: "",
					},];
				}
				$scope.heading = "Condition for quotes";
				$timeout(function () {
					$scope.$apply()
				})
				return

			} catch (error) {
				console.log(error.message);
				return
			}
		};

		$scope.postQuery = function (dataToPost, next) {
			let isReturn = 0;
			if ($scope.queries.columns.length <= 0) {
				CommonService.showError("Select column cannot be empty");
				isReturn = 1
			}
			if ($scope.queries.where) {
				$scope.queries.where.forEach((elem) => {
					if (elem.feild === "SelectAll") {
						CommonService.showError("You can not select *SelectAll* in where clause");
						isReturn = 1
					}

				});
				if (isReturn) {
					return;
				}
				CommonService.showLoader();
				$http({
					method: "POST",
					url: executeQueryForReport,
					header: {
						"Content-Type": "application/xml; charset=utf-8",
					},
					data: $scope.queries,
				}).then(
					function (response) {
						$scope.report = response.data;

						$scope.executedReportColumns = $scope.report.length ? Object.keys($scope.report[0]) : []
						if ($scope.executedReportColumns.length <= 0) {
							CommonService.showError("No result found!");
						}
						CommonService.hideLoader();
					},
					function (response) {
						CommonService.hideLoader();
						CommonService.showError(response.message);
					}
				);
			}
		};

		$scope.addRow = function () {
			$scope.queries.where.push({
				feild: "",
				condition: "",
				value: "",
			});
		};

		$scope.removeRow = function (index) {
			$scope.queries.where.splice(index, 1);
		};

		$scope.saveReportName = function () {
			if ($scope.mode === "new") {
				$(".modal-backdrop").show();
				ModalService.showModal({
					templateUrl: "template/query-builder-modal.ejs",
					controller: "ReportSaveCtrl",
					inputs: {
						reportName: $scope.queries.reportName,
					},
				}).then(function (modal) {
					modal.element.modal({
						keyboard: false
					});
					modal.close.then(function (response) {
						$scope.queries.reportName = response;
						$(".modal-backdrop").remove();
						$("body").removeClass("modal-open");
						if (
							$scope.queries.reportName !== null &&
							$scope.queries.reportName !== "undefined" &&
							$scope.queries.reportName
						) {
							CommonService.showLoader();
							$http({
								method: "POST",
								url: postQueryForReport,
								header: {
									"Content-Type": "application/xml; charset=utf-8",
								},
								data: $scope.queries,
							}).then(
								function (response) {
									$scope.report = response.data.result;
									if (response.data.reportId && $scope.queries.reportName)
										redirectOrder(response.data.reportId);
									CommonService.hideLoader();
								},
								function (response) {
									CommonService.hideLoader();
									CommonService.showError(response.message);
								}
							);
							$scope.executeAndSave = true;
						} else {
							CommonService.showError("No report name is added");
						}
					});
				});
			} else {

				CommonService.showLoader();
				$http({
					method: "POST",
					url: postQueryForReport,
					header: {
						"Content-Type": "application/xml; charset=utf-8",
					},
					data: $scope.queries,
				}).then(
					function (response) {
						$scope.report = response.data.result;
						if (response.data.reportId && $scope.queries.reportName)
							redirectOrder(response.data.reportId);
						CommonService.hideLoader();
					},
					function (response) {
						CommonService.hideLoader();
						CommonService.showError(response.message);
					}
				);
			}
		};

		$scope.newReportName = () => {

			if ($scope.queries.reportId)
				delete $scope.queries.reportId
			$("body").removeClass("modal-open");
			if (
				$scope.queries.reportName !== null &&
				$scope.queries.reportName !== "undefined" &&
				$scope.queries.reportName
			) {
				let isReturn = 0;
				// $scope.queries.where.forEach((elem) => {
				// 	if (
				// 		elem.feild === "" ||
				// 		elem.condition === "" ||
				// 		elem.value === ""
				// 	) {
				// 		CommonService.showError("Where clause is not complete");
				// 		isReturn = 1;
				// 	}
				// });

				if (isReturn) return;
				CommonService.showLoader();
				$http({
					method: "POST",
					url: postQueryForReport,
					header: {
						"Content-Type": "application/xml; charset=utf-8",
					},
					data: $scope.queries,
				}).then(
					function (response) {
						$scope.report = response.data.result;
						if (response.data.reportId && $scope.queries.reportName)
							redirectOrder(response.data.reportId);
						CommonService.hideLoader();
					},
					function (response) {
						CommonService.hideLoader();
						CommonService.showError(response.message);
					}
				);
				$scope.executeAndSave = true;
			} else {
				CommonService.showError("No report name is added");
			}
		}

		var redirectOrder = function (id, next) {
			CommonService.showSuccess("Report is Generated");

			window.location = "/query-builder/?reportId=" + id + "?execute=true";
		};

		$scope.getReport = function () {
			$http({
				method: "GET",
				url: getReportForQueryBuilder + "/" + $scope.ReportId,
				headers: {
					"Content-Type": "application/xml; charset=utf-8",
				},
			}).then(async function (response) {
				if (response.data.tableName === "orders") {
					await $scope.getOrderColumns();
				} else {
					await $scope.getQuoteColumns();
				}
				$scope.columns.push({
					Default: null,
					Extra: "",
					Field: "SelectAll",
					Key: "",
					Null: "YES",
					Type: "varchar(255)"
				})

				$scope.queries = response.data;
				$scope.queries.createdBy = $scope.currentUser.id;
				$scope.queries.isActive = $scope.currentUser.active;
			}).then(function () {
				if (window.location.search.split("?")[2]) {
					$scope.execute = JSON.parse(window.location.search.split("?")[2].split("=")[1]);
					if ($scope.execute) {
						$scope.postQuery();
					}
				}
			});
			return true;
		};

		init();
	}
);