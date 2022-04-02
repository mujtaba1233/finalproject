var Mysql = require('../helpers/database-manager');
const { slack } = require('../helpers/slack-helper');

exports.GetInventories = function (callback) {

	Mysql.query("select p.ProductID,p.ProductName, p.ProductCode, i.InventoryId," +
	" sum(case when ps.IsProduction = 1 then ps.IsProduction else 0 end) as productionCount, " +
	" sum(case when ps.IsStock = 1 then ps.IsStock else 0 end) as stockCount, " +
	" sum(case when ps.IsSold = 1 then ps.IsSold else 0 end) as soldCount, " +
	" i.NextStockDate, i.Notes, i.StockLocation, i.InventoryId " +
	" from products p " +
	" left join inventory i on p.ProductID = i.ProductID " +
	" left join product_serials ps on p.ProductID = ps.ProductID  where p.isCompleted = 1 and IsDeleted = 0 and isSerialAble = 1" +
	" group by p.ProductID order by p.ProductCode asc;")
	.then(function (results) {
		if(results.length > 0){
			callback(results);
		}else {
			callback([])
		}
	})
	.catch(function (err) {
		error = JSON.stringify(err.message)
		slack(`File: inventory.js, \nAction: GetInventories, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(err)
		reject(err);
	});
};

exports.UpdateInventory = function (data,callback) {
	Mysql.insertUpdate('inventory', data, data)
	.then(function (result) {
		if(result.affectedRows == 2 || result.insertId == 0){
			callback({status:true,msg:"Inventory Updated!",result:result});
		}else if(result.insertId > 0) {
			callback({status:true,msg:"Inventory Saved!",result:result});
		}
	})
	.catch(function (err) {
		console.log(new Date(), err);
		error = JSON.stringify(err.message)
		slack(`File: inventory.js, \nAction: UpdateInventory, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		callback({status:false,msg:err.message,result:result});
	});
};


