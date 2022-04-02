var Mysql = require('../helpers/database-manager');
const { slack } = require('../helpers/slack-helper');

exports.Save = async function (fileNames, productId, callback) {
	var counter = 0;
	if (fileNames && fileNames.length > 0) {
		for (var i = 0; i < fileNames.length; i++) {
			var imageData = {
				TableID: productId,
				TableName: 'Product',
				ImageURL: fileNames[i].replace('$$-', ''),
				IsThumb: fileNames[i].indexOf('$$-') !== -1,
				CreatedAt: new Date(),
				displayOrder: i
			};
			Mysql.insertUpdate('images', imageData, imageData).then(function (result) {
				counter += 1;
				if (counter == fileNames.length) {
					callback({ status: true, msg: "Image uploaded.", result: result });
				}
			}).catch(function (err) {
				error = JSON.stringify(err.message)
			slack(`File: image.js, \nAction: save, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
				console.log(new Date(), err.message);
				callback({ status: false, msg: err.message });
			});
		}
	} else {
		callback({ status: true, msg: "No Image uploaded", result: result });
	}
}
exports.update = async function (data, callback) {
	try{
		await Promise.all(data.map(async (imageId, index) => {
          var result =   await Mysql.update('images', { ID: imageId }, { DisplayOrder: index })
        }));
		return { status: true, msg: "Image Updated Succesfully",result:result };
	}
	catch(err){
		error = JSON.stringify(err.message)
		slack(`File: image.js, \nAction: update, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		return { status: false, msg: err.message};

	}
}

exports.remove = async function (data, callback) {
	var where = {
        ProductID: data.ProductID
	};
	var product = await Mysql.record("products", where);
	if(product.TitleImage == data.ImageURL){
		Mysql.update("products", where, { ProductPhotoURL: null });
	}
	Mysql.delete('images', { ID: data.ID }).then(function (result) {
		callback({ status: true, msg: "Image Deleted Succesfully", result: result });
	}).catch(function (err) {
		error = JSON.stringify(err.message)
		slack(`File: image.js, \nAction: remove, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), 'Error deleting record, mysql error:', err.message);
		console.log(new Date(), Mysql.getLastQuery());
		callback({ status: false, msg: err.message });
	});
}
