vulusionApp.controller('RMAController', function RMAController(CommonService,RMAService,Upload,$cookies,$rootScope,$scope, $http,close = undefined) {

	init = function(){
		$scope.path = '';
		$scope.valid = true;
		CommonService.authenticateUser().then(function(){
			$rootScope.logout = CommonService.logout;
			// console.log(window.location.search);
			if(window.location.search && window.location.search.indexOf('id') > -1){
				CommonService.showLoader();
				// console.log('RMA id',window.location.search.split('?')[1].split('=')[1]);
				$scope.rmaId = window.location.search.split('?')[1].split('=')[1];
				RMAService.getRMA($scope.rmaId).then(function(response){
					// console.log("RMA",response);
					CommonService.hideLoader();
					if(response.data.length > 0){
						$scope.RMAObj = response.data[0]
					}else {
						CommonService.showError("RMA doesn't exist!!")
					}
				},function(err){
					console.log(err);
					CommonService.hideLoader();
					CommonService.showError("Error while getting RMA")
				})
			}else {
				if(close === undefined){
					$scope.getRMAList();
					$scope.itemsByPage = 50;
				}
			}
		});
	}
	$scope.onFileSelect = function(file) {
		$scope.valid = true;
		// console.log(file);
		Upload.upload({
			url: RMAUploadUrl,
			file: file,
		}).progress(function(e) {
			$scope.uploadProgress = parseInt(e.loaded / e.total * 100, 10);
			if($scope.uploadProgress == 100){
				$scope.uploadProgress = undefined;
				$scope.uploadComplete = "Validating..."
			}
		}).then(function(response, status, headers, config) {
			// file is uploaded successfully
			// console.log(response,status,headers,config);
			if(response.data.success){
				$scope.path = response.data.path;
				$scope.valid = false;
				$scope.uploadComplete = "Uploaded!"
				CommonService.showSuccess(response.data.message)
			}else {
				$scope.uploadComplete = "Error while validating!"
				CommonService.showError(response.data.message);
			}
		});
	}
	$scope.importRMA = function(){
		$http({
			method: 'POST',
			url: saveUploadedRMAUrl,
			data: {
				path:$scope.path
			},
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		}).then(function successCallback(response) {
			// console.log(response);
			if(response.data.staus){
				CommonService.showError("Import complete with errors")
			}else {
				CommonService.showSuccess("Import complete successfully");
			}
		},function errorCallback(err) {
			console.log(err);
			CommonService.showError("Error while saving RMA")
		}).catch(function (err) {
			console.log(err);
			CommonService.showError("Error while saving RMA")
		});
	}
	$scope.getRMAList = function(){
		CommonService.showLoader();
		RMAService.getRMAList().then(function(response){
			// console.log("RMA list",response);
			angular.forEach(response.data,function(elem){
				elem.ReceivedDateTime = new Date(elem.ReceivedDateTime.replace(/[^\/\d{2}\/\d{2}\/\d{4} {2}\d:{2}:\d{2}/\/]/g, ""));
				elem.RMAIssuedDate = new Date(elem.RMAIssuedDate);
				if(new Date(elem.FinishedDayTime) == "Invalid Date" && isNaN(new Date(elem.FinishedDayTime))){
					elem.FinishedDayTime = new Date();
				}else {
					elem.FinishedDayTime = new Date(elem.FinishedDayTime);
				}
				if(elem.ReceivedDateTime == "Invalid Date"){
					elem.HoldingTime = "N/A";
					elem.ReceivedDateTime = "N/A"
				}else {
					var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
					var secondDate = elem.ReceivedDateTime
					var firstDate = elem.FinishedDayTime
					elem.HoldingTime = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
					elem.HoldingTime += elem.HoldingTime > 1?" Days": " Day"
				}


				elem.info = "";
				elem.isReady = "N/A";
				if(elem.HavePO == "1"){
					elem.info += "PO: Yes\n"
				}else {
					elem.info += "PO: No\n"
				}
				if(elem.UnitInfo != ""){
					elem.info += "Unit: "+ elem.UnitInfo +"\n"
				}else {
					elem.info += "Unit: No\n"
				}
				if(elem.HaveBoot == "1"){
					elem.info += "Boot: Yes\n"
				}else {
					elem.info += "Boot: No\n"
				}
				if(elem.HaveCables == "1"){
					elem.info += "Cables: Yes\n"
				}else {
					elem.info += "Cables: No\n"
				}
				if(elem.HaveSDCard == "1"){
					elem.info += "SD Card: "+elem.HaveSDcardSize+"\n"
				}else {
					elem.info += "SD Card: No\n"
				}
				if(elem.HaveSimCard == "1"){
					elem.info += "Sim Card: Yes\n"
				}else {
					elem.info += "Sim Card: No\n"
				}
				if(elem.Notes != ""){
					elem.info += "Notes: "+elem.Notes+"\n"
				}else {
					elem.info += "Notes: none\n"
				}
				if(elem.Company != ""){
					elem.info += "Company: "+elem.Company+"\n"
				}else {
					elem.info += "Company: none\n"
				}
				if(elem.Problem != ""){
					elem.info += "Problem: "+elem.Problem+"\n"
				}else {
					elem.info += "Problem: none\n"
				}
				// if(elem.Company != ""){
				// 	elem.info += "Company: "+elem.Company+"\n"
				// }else {
				// 	elem.info += "Company: none\n"
				// }
				// if(elem.Company != ""){
				// 	elem.info += "Company: "+elem.Company+"\n"
				// }else {
				// 	elem.info += "Company: none\n"
				// }
				// if(elem.Company != ""){
				// 	elem.info += "Company: "+elem.Company+"\n"
				// }else {
				// 	elem.info += "Company: none\n"
				// }
			})
			$scope.RMAList = response.data;
			CommonService.hideLoader();
		},function(err){
			console.log("RMA list Error:",err);
			CommonService.hideLoader();
		})
	}
	$scope.yesNo = function(param){
		if(param == 0){
			return "No"
		}else if (param == 1) {
			return "Yes"
		}else {
			return "N/A"
		}
	}
	$scope.checkDateTime = function(date){
		if(new Date(date) == "Invalid Date" && isNaN(new Date(date))){
			return "N/A";
		}else {
			return date;
		}
	}
	$scope.close = function(obj){
		close(obj);
	}
	init();
});
