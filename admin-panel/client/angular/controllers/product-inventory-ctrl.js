vulusionApp.controller(
	"ProductInventoryController",
	function ProductInventoryController(
		ModalService,
		LookupService,
		InventoryService,
		InventoryDetailService,
		CommonService,
		$timeout,
		$location,
		$cookies,
		$rootScope,
		$scope,
		$http
	) {
		init = function () {
			CommonService.authenticateUser().then(function (response) {
				$rootScope.logout = CommonService.logout;
				if (response.usertype == ADMIN) {
					$scope.isAdmin = true;
				} else {
					$scope.isAdmin = false;
				}
				$scope.getResults();
				$scope.getLocations();
			});

			$scope.itemsByPage = 50;
			$scope.year = 2018;
		};
		$(function () {
			$(".wrapper1").scroll(function () {
				$(".double-scroll").scrollLeft($(".wrapper1").scrollLeft());
			});
			$(".double-scroll").scroll(function () {
				$(".wrapper1").scrollLeft($(".double-scroll").scrollLeft());
			});
		});
		$scope.getLocations = function () {
			LookupService.GetLocations().then(function (response) {
				$scope.locations = response.data;
			});
		};
		var timeoutPromise;
		$scope.updateInventory = function (row, index) {
			$timeout.cancel(timeoutPromise);
			timeoutPromise = $timeout(function (event) {
				var data = {
					ProductId: row.ProductID,
					Notes: row.Notes,
					NextStockDate: row.NextStockDate,
					StockLocation: row.StockLocation,
				};
				if (row.InventoryId > 0) {
					data.InventoryId = row.InventoryId;
				}
				// console.log(data);
				InventoryService.update(data).then(function (response) {
					if (response.data.status) {
						// console.log(response.data.result);
						CommonService.showSuccess(response.data.msg);
						if (data.InventoryId === undefined) {
							$scope.inventories[index].InventoryId =
								response.data.result.insertId;
						}
					} else {
						CommonService.showError(response.data.msg);
					}
				});
			}, 800);
		};
		$scope.newInventory = function (product) {
			$(".modal-backdrop").show();
			
			ModalService.showModal({
				templateUrl: "template/new-inventory.ejs",
				controller: "NewInventoryController",
				inputs: {
					product: product,
				},
				
			}).then(function (modal) {
				setTimeout(function(){ 
					$('#SerialNumber').focus();
				   },1000)
				   modal.element.modal({
					backdrop: 'static',
					keyboard: false
				});
			
				modal.close.then(function (response) {
					$(".modal-backdrop").remove();
					$("body").removeClass("modal-open");
					$scope.getResults();
					// console.log(response);
				});
			});
		};
		
		$scope.viewAllocatedSerials = function (product, status) {
			$(".modal-backdrop").show();
			let allocated = false;
			if (status == "true") allocated = true;
			else allocated = false;

			ModalService.showModal({
				templateUrl: "template/inventory-detail.ejs", // TODO: change template and control
				controller: "ProductSerialViewController",
				inputs: {
					product: product,
					type: "allocated",
				},
			}).then(function (modal) {
				modal.element.modal({ keyboard: false });
				modal.close.then(function (response) {
					$(".modal-backdrop").remove();
					$("body").removeClass("modal-open");
					$scope.getResults();
					// console.log(response);
				});
			});
		};
		$scope.viewUnAllocatedSerials = function (product, status) {
			$(".modal-backdrop").show();

			ModalService.showModal({
				templateUrl: "template/inventory-detail.ejs", // TODO: change template and control
				controller: "ProductSerialViewController",
				inputs: {
					product: product,
					type: "unAllocated",
				},
			}).then(function (modal) {
				modal.element.modal({ keyboard: false });
				modal.close.then(function (response) {
					$(".modal-backdrop").remove();
					$("body").removeClass("modal-open");
					$scope.getResults();
					// console.log(response);
				});
			});
		};

		$scope.viewShippedSerials = function (product) {
			$(".modal-backdrop").show();
			ModalService.showModal({
				templateUrl: "template/inventory-detail.ejs", // TODO: change template and control
				controller: "ProductSerialViewController",
				inputs: {
					product: product,
					type: "shipped",
				},
			}).then(function (modal) {
				modal.element.modal({ keyboard: false });
				modal.close.then(function (response) {
					$(".modal-backdrop").remove();
					$("body").removeClass("modal-open");
					$scope.getResults();
					// console.log(response);
				});
			});
		};

		$scope.getResults = function () {
			CommonService.showLoader();
			InventoryService.list().then(function (response) {
				$scope.inventories = response.data;
				console.log($scope.inventories);
				$scope.itemsByPage = $scope.inventories.length;
				$scope.inventories.forEach(function (elem) {
					if (elem.NextStockDate != null) {
						elem.NextStockDate = new Date(elem.NextStockDate);
					}
					elem.shipped = 0;
					elem.allocated = 0;
					elem.unAllocated = 0;
					InventoryDetailService.list(elem.ProductID,"undefined","count").then(function (response) {
						$scope.inventoryDetails = response.data; // InventoryDetailService.list()
						$scope.inventoryDetails.forEach(function (el) {
							if (el.status === "shipped") {
								elem.shipped += 1;
							} else if (el.status === "allocated") {
								elem.allocated += 1;
							} else elem.unAllocated += 1;
						});
						console.log(response);
					});
				});
				CommonService.hideLoader();
				setTimeout(function () {
					// $('.div1').width( $('.table-responsive')[0].scrollWidth)
					// $('.wrapper1').on('scroll', function (e) {
					// 	$('.table-responsive').scrollLeft($('.wrapper1').scrollLeft());
					// });
					// $('.table-responsive').on('scroll', function (e) {
					// 	$('.wrapper1').scrollLeft($('.table-responsive').scrollLeft());
					// });
				});
			});
		};
		init();
	}
);
