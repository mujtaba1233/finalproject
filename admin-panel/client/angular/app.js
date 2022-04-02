var vulusionApp =
	angular.module('vulusionApp', [
		'ngclipboard',
		'ui.select',
		'ngSanitize',
		'smart-table',
		'angularModalService',
		'ngRoute',
		'ngCookies',
		'ui.tinymce',
		'localytics.directives',
		'ngFileUpload',
		'ngCsv',
		'mj.scrollingTabs',
		'ngMask',
		'ckeditor',
		'ui.mask',
		// 'credit-cards',
		// 'ng-sortable'
		'as.sortable'
	]);
vulusionApp.constant("moment", moment);
vulusionApp.run(function ($rootScope,ModalService,CommonService,ActivityLogService,$http,$location,$injector) {
	let currentUrl = $location.$$absUrl.replace(/^.*\/\/[^\/]+/, '')
	$http.get("https://api.ipify.org/?format=json").then(function (response) 
		{
		let ip = response.data.ip;
		CommonService.authenticateUser().then(function (user) {
			let currentUser = user;
			$rootScope.userData = {firstname: currentUser.firstname, lastname: currentUser.lastname, email: currentUser.email, userId: currentUser.id, ipAddress: ip, lastModifyOn: new Date, url: currentUrl, type: 'BlueSky'} 
			ActivityLogService.save({data: $rootScope.userData}).then(function(response) {
				// CommonService.hideLoader();
				// CommonService.showSuccess("Record Updated in activity log.");
			}, function(response) {
				// CommonService.showError("Error while updateding Record");
			});
		})
	}).catch(function (err) {
		let ip = null;
		CommonService.authenticateUser().then(function (user) {
			let currentUser = user;
			console.log(currentUser)
			console.log(ip)
			console.log(currentUrl)
			$rootScope.userData = {firstname: currentUser.firstname, lastname: currentUser.lastname, email: currentUser.email, userId: currentUser.id, ipAddress: ip, lastModifyOn: new Date, url: currentUrl} 
			console.log($rootScope.userData)
			ActivityLogService.save({data: $rootScope.userData}).then(function(response) {
			}, function(response) {
				console.log(response)
			});
		})
		console.log(err,"sd");
	});
	$('.btnNext').click(function () {
		$('.nav-tabs > .active').next('li').find('a').trigger('click');
	});
	$('.btnPrevious').click(function () {
		$('.nav-tabs > .active').prev('li').find('a').trigger('click');
	});
	$(".angular-content").removeClass('hidden')
	$rootScope.uploadProducts = function () {
		$('.modal-backdrop').show();
		ModalService.showModal({
			templateUrl: "template/product-upload-form.ejs",
			controller: "ProductModalController"
		}).then(function (modal) {
			modal.element.modal({ backdrop: 'static', keyboard: false });
			modal.close.then(function (response) {
				$('.modal-backdrop').remove();
				$('body').removeClass('modal-open');
				console.log(response);
			});
		});
	}
	$rootScope.uploadRMA = function () {
		$('.modal-backdrop').show();
		ModalService.showModal({
			templateUrl: "template/rma-db-upload-form.ejs",
			controller: "RMAController"
		}).then(function (modal) {
			modal.element.modal({ backdrop: 'static', keyboard: false });
			modal.close.then(function (response) {
				$('.modal-backdrop').remove();
				$('body').removeClass('modal-open');
				console.log(response);
			});
		});
	}

	$rootScope.syncWithVolusion = function () {
		// var CommonService = $injector.get('CommonService');
		// var SyncService = $injector.get('SyncService');
		// if (CommonService.isProduction()) {
		// 	CommonService.showLoader(3);
		// 	SyncService.customer().then(function (response) {
		// 		CommonService.hideLoader();
		// 		CommonService.showSuccess("Customer sync complete!");
		// 	}, function (response) {
		// 		CommonService.hideLoader();
		// 		console.log(response);
		// 		if (response.status != -1) {
		// 			CommonService.showError(response.data.status);
		// 		} else {
		// 			CommonService.showError("Customer sync failed");
		// 		}
		// 	});
		// 	SyncService.product().then(function (response) {
		// 		CommonService.hideLoader();
		// 		CommonService.showSuccess("Product sync complete!");
		// 	}, function (response) {
		// 		CommonService.hideLoader();
		// 		console.log(response);
		// 		if (response.status != -1) {
		// 			CommonService.showError(response.data.status);
		// 		} else {
		// 			CommonService.showError("Product sync failed");
		// 		}
		// 	});
		// 	SyncService.order().then(function (response) {
		// 		CommonService.hideLoader();
		// 		CommonService.showSuccess("Order sync complete!");
		// 	}, function (response) {
		// 		CommonService.hideLoader();
		// 		console.log(response);
		// 		if (response.status != -1) {
		// 			CommonService.showError(response.data.status);
		// 		} else {
		// 			CommonService.showError("Order sync failed");
		// 		}
		// 	});
		// } else {
		// 	CommonService.showError('Sync not available here!')
		// }
	}

});
