var Mysql = require("../helpers/database-manager");
const { slack } = require("../helpers/slack-helper");
exports.ImportProducts = function (products, callback) {
  var callbackCount = products.length;
  for (elem of products) {
    var obj = {
      ProductCode: elem.productcode[0],
      // ProductName: elem.productname[0],
      // ProductDescriptionShort: elem.productdescriptionshort[0],
      // ProductDescription: elem.productdescription[0],
      // TechSpecs: elem.techspecs[0],
      // ProductDescription_AbovePricing: elem.productdescription_abovepricing[0],
      // ProductNameShort: elem.productnameshort[0],
      ProductPrice: elem.productprice[0],
      ProductWeight: elem.productweight[0],
      // FreeShippingItem: elem.freeshippingitem[0],
      // Photo_AltText: elem.photo_alttext[0],
      Hide_FreeAccessories: elem.hide_freeaccessories[0],
      TaxableProduct: elem.taxableproduct[0],
      HideProduct: elem.hideproduct[0],
      // ModifyOn: elem.lastmodified[0],
      // StockStatus: elem.stockstatus[0] == '' ? 0 : elem.stockstatus[0],
      Availability: elem.availability[0],
      // ProductPrice_Name: elem.productprice_name[0],
      // ProductManufacturer: elem.productmanufacturer[0],
      // SalePrice_Name: elem.saleprice_name[0],
      // Accessories: elem.accessories[0],
      // ProductPhotoURL: elem.photourl[0], // it will update the local image path with store image path
      // ProductDetailURL: elem.extinfo[0],
      FreeAccessories: elem.freeaccessories[0],
      OptionIDs: elem.optionids[0],
    };
    var where = {
      ProductCode: elem.productcode,
    };
    var status = true;
    Mysql.update("products", where, obj)
      .then(function (info) {
        // console.log(new Date(), "products Info *+*+*+*+**+*+*+*+* ", info.affectedRows, info.message);
        callbackCount--;
        if (callbackCount == 0) callback(status);
      })
      .catch(function (err) {
        error = JSON.stringify(err.message);
        slack(
          `File: product.js, \nAction: ImportProducts, \nError ${error} \n 
				`,
          "J.A.R.V.I.S",
          "C029PF7DLKE"
        );
        console.log(new Date(), "Err =========== ", err.message);
        callbackCount--;
        status = false;
        if (callbackCount == 0) callback(status);
      });

    catArray = elem.categoryids[0].split(",");
    if (catArray[0] !== "") {
      insertCategories(
        catArray,
        undefined,
        elem.productcode,
        function (resulttt) {
          // console.log(resulttt.msg);
        }
      );
    }
    // console.log(catArray[0]);

    // Mysql.record('products', where).then(function (record) {
    // 	console.log(new Date(), record.ProductID);
    // 	Mysql.insert('product_category', insert).then(function (info) {
    // 		console.log(new Date(), 'Success-------->', info.affectedRows);
    // 	}).catch(function (err) {
    // 		console.log(new Date(), 'Error creating new user, mysql error:', err.message);
    // 	});
    // }).catch(function (err) {
    // 	console.log(new Date(), 'Error fetching record, mysql error:', err.message);
    // });
  }
  // Mysql.query('select ProductID,ProductCode from products where IsDeleted = 0 and isCompleted = 1').then(function (proRes) {
  // 	console.log(proRes.length,products.length);

  // 	for (let i = 0; i < proRes.length; i++) {
  // 		for (let j = 0; j < products.length; j++) {
  // 			// if (proRes[i].ProductCode === products[j].productcode[0] && products[j].categoryids[0] && products[j].categoryids[0] != '') {
  // 			// 	var catArray = products[j].categoryids[0].split(',');
  // 			// 	catArray.forEach(function (catId) {
  // 			// 		var catData = {
  // 			// 			ProductID: proRes[i].ProductID,
  // 			// 			CategoryID: parseInt(catId),
  // 			// 			CreatedAt: new Date()
  // 			// 		}
  // 			// 		Mysql.insert('product_category', catData).then(function (info) {
  // 			// 			console.log(new Date(), 'product_category save Success-------->', info.affectedRows);
  // 			// 		}).catch(function (err) {
  // 			// 			console.log(new Date(), 'Error inserint categpries, mysql error:', err.message);
  // 			// 		});

  // 			// 	})
  // 			// }else{
  // 			// 	console.log(new Date(), 'no product categories',products[j].categoryids[0]);
  // 			// }
  // 		}
  // 	}
  // }).catch(function () {
  // 	console.log(new Date(), "Err =========== ", err.message);
  // })
};

exports.ImportOptionCategory = function (products, callback) {
  var callbackCount = products.length;
  for (elem of products) {
    var obj = {
      id: elem.id[0],
      headingGroup: elem.headinggroup[0],
      optionCategoriesDesc: elem.optioncategoriesdesc[0],
      isRequired: elem.isrequired[0] === "Y" ? 1 : 0,
      displayType: elem.displaytype[0],
      arrangeOptionCategoriesBy: elem.arrangeoptioncategoriesby[0],
      lastModified: elem.lastmodified[0],
      lastModBy: elem.lastmodby[0],
      hideOptionCategoriesDesc:
        elem.hide_optioncategoriesdesc[0] === "Y" ? 1 : 0,
      includeInSearchRefinement:
        elem.include_in_search_refinement[0] === "Y" ? 1 : 0,
      aboutOptionCategories: elem.aboutoptioncategories[0],
      useGoogleSize: elem.use_google_size[0] === "Y" ? 1 : 0,
      useGoogleColor: elem.use_google_color[0] === "Y" ? 1 : 0,
      useGoogleMaterial: elem.use_google_material[0] === "Y" ? 1 : 0,
      useGooglePattern: elem.use_google_pattern[0] === "Y" ? 1 : 0,
    };
    var status = true;
    Mysql.insertUpdate("option_categories", obj, obj)
      .then(function (info) {
        callbackCount--;
        if (callbackCount == 0) callback(status);
      })
      .catch(function (err) {
        error = JSON.stringify(err.message);
        slack(
          `File: product.js, \nAction: ImportOptionCategory, \nError ${error} \n 
				`,
          "J.A.R.V.I.S",
          "C029PF7DLKE"
        );
        console.log(new Date(), "Err =========== ", err.message);
        callbackCount--;
        status = false;
        if (callbackCount == 0) callback(status);
      });
  }
};

exports.ImportOptions = function (products, callback) {
  var callbackCount = products.length;
  for (elem of products) {
    var obj = {
      id: elem.id[0],
      optionCatId: elem.optioncatid[0],
      replacesOptionId: elem.replacesoptionid[0],
      optionsDesc: elem.optionsdesc[0],
      priceDiff: elem.pricediff[0],
      productWeight: elem.productweight[0],
      recurringPriceDiff: elem.recurringpricediff[0],
      jumpToProductCode: elem.jumptoproductcode[0],
      noValue: elem.novalue[0] === "Y" ? 1 : 0,
      arrangeOptionsBy: elem.arrangeoptionsby[0],
      defaultSelected: elem.defaultselected[0] === "Y" ? 1 : 0,
      textboxSize: elem.textbox_size[0],
      textboxRows: elem.textbox_rows[0],
      validateRegExpression: elem.validate_regexpression[0],
      validateErrorMessage: elem.validate_errormessage[0],
      validateOptionId: elem.validate_optionid[0],
      validateOptionCatId: elem.validate_optioncatid[0],
      lastModified: elem.lastmodified[0],
      isProductCode: elem.isproductcode[0],
      vendorPriceDiff: elem.vendorpricediff[0],
      onlyAvailableWithOptionIds: elem.only_available_with_optionids[0],
      notAvailableWithOptionIds: elem.not_available_with_optionids[0],
      isProductPrice: elem.isproductprice[0] === "Y" ? 1 : 0,
      isProductQuantity: elem.isproductquantity[0] === "Y" ? 1 : 0,
      isFixedShippingCost: elem.isfixedshippingcost[0] === "Y" ? 1 : 0,
      isProductCodeQty: elem.isproductcode_qty[0],
      setupCostDiff: elem.setupcostdiff[0],
      lastModBy: elem.lastmodby[0],
      optionsDescSideNote: elem.optionsdesc_sidenote[0],
      textboxMaxLength: elem.textbox_max_length[0],
      fixedShippingCost: elem.fixedshippingcost[0],
      applyToProductCodes: elem.applytoproductcodes[0],
    };
    var status = true;
    Mysql.insertUpdate("options", obj, obj)
      .then(function (info) {
        callbackCount--;
        if (callbackCount == 0) callback(status);
      })
      .catch(function (err) {
        error = JSON.stringify(err.message);
        slack(
          `File: product.js, \nAction: ImportOptions, \nError ${error} \n 
				`,
          "J.A.R.V.I.S",
          "C029PF7DLKE"
        );
        console.log(new Date(), "Err =========== ", err.message);
        callbackCount--;
        status = false;
        if (callbackCount == 0) callback(status);
      });
  }
};

exports.GetAllProducts = function (callback) {
  Mysql.query(
    "SELECT ProductID,ProductCode,ProductName,ExportDescription,CountryOfOrigin,UnitOfMeasure,ExportControlClassificationNumber,HarmonizedCode, ProductPhotoURL, ProductDescriptionShort,ProductPrice,ProductWeight,HideProduct,CreatedOn,Discount,PriorityIndex,IsActive,isSerialAble,IsFeatured,FreeAccessories FROM products where IsDeleted = 0 and isCompleted = 1 order by PriorityIndex,ProductID asc",
    {}
  )
    .then(function (records) {
      callback(records);
    })
    .catch(function (err) {
      error = JSON.stringify(err.message);
      slack(
        `File: product.js, \nAction: GetAllProducts, \nError ${error} \n 
				`,
        "J.A.R.V.I.S",
        "C029PF7DLKE"
      );
      console.log(
        new Date(),
        "Error fetching record, mysql error:",
        err.message
      );
    });
};
exports.GetAllProductsActive = function (callback) {
  Mysql.query(
    "SELECT ProductID,ProductCode,ProductName,ExportDescription,CountryOfOrigin,UnitOfMeasure,ExportControlClassificationNumber,HarmonizedCode, ProductPhotoURL, ProductDescriptionShort,ProductPrice,ProductWeight,HideProduct,CreatedOn,Discount,PriorityIndex,IsActive,IsFeatured,FreeAccessories FROM products where IsDeleted = 0 and isCompleted = 1 and IsActive = 1 order by PriorityIndex,ProductID asc",
    {}
  )
    .then(function (records) {
      callback(records);
    })
    .catch(function (err) {
      error = JSON.stringify(err.message);
      slack(
        `File: product.js, \nAction: GetAllProductsActive, \nError ${error} \n 
				`,
        "J.A.R.V.I.S",
        "C029PF7DLKE"
      );
      console.log(
        new Date(),
        "Error fetching record, mysql error:",
        err.message
      );
    });
};

exports.GetProduct = function (id, callback) {
  Mysql.query(
    "SELECT p.*, pc.CategoryID, i.ImageURL,i.IsThumb,i.ID,i.DisplayOrder, i.TableID, pd.Name, pd.ProductDetailID, pd.URL FROM products p left join product_category pc on pc.ProductID = p.ProductID  left join images i on p.ProductID = i.TableID and i.TableName = 'Product' left join product_details pd on pd.ProductID = p.ProductID where p.IsDeleted = 0 and p.isCompleted = 1 and p.ProductID = " +
      id +
      " order by i.DisplayOrder asc",
    {}
  )
    .then(function (records) {
      callback(records);
    })
    .catch(function (err) {
      error = JSON.stringify(err.message);
      slack(
        `File: product.js, \nAction: GetProduct, \nError ${error} \n 
				`,
        "J.A.R.V.I.S",
        "C029PF7DLKE"
      );
      console.log(
        new Date(),
        "Error fetching record, mysql error:",
        err.message
      );
    });
};

exports.InsertProducts = function (products, insertEndCallback) {
  if (products != undefined) {
    var callbackCount = products.length;
    for (var i = 0; i < products.length; i++) {
      if (products[i].ProductCode === "AE6900R-105") {
        delete products[i].ListPrice_Name;
      }
      Mysql.insertUpdate("products", products[i], {
        ProductCode: products[i].ProductCode,
        ProductID: products[i].ProductID,
        // HideProduct:products[i].HideProduct,
      })
        .then(function (info) {
          console.log(new Date(), "Info *+*+*+*+**+*+*+*+*", info.affectedRows);
          callbackCount--;
          if (callbackCount == 0) insertEndCallback();
        })
        .catch(function (err) {
          error = JSON.stringify(err.message);
          slack(
            `File: product.js, \nAction: InsertProducts, \nError ${error} \n 
					`,
            "J.A.R.V.I.S",
            "C029PF7DLKE"
          );
          console.log(
            new Date(),
            "Err =========== ",
            err.message,
            Mysql.getLastQuery()
          );
          callbackCount--;
          if (callbackCount == 0) insertEndCallback();
        });
    }
  } else {
    console.log(new Date(), "Products undefined");
    insertEndCallback();
  }
};

exports.SaveProduct = function (product, callback) {
  Mysql.query("SELECT max(ProductID) as id FROM products", {})
    .then(function (record) {
      if (product.ProductID === undefined) {
        var id = parseInt(record[0].id);
        console.log(new Date(), product, "ProductID Not Found");
        if (id < 200000) {
          id = 200001;
        } else {
          id = id + 1;
        }
        product.ProductID = id;
      } else {
        var id = product.ProductID;
        console.log(new Date(), "Product id Found");
      }
      var categories = product.Categories;
      delete product.Categories;
      Mysql.insertUpdate("products", product, product)
        .then(function (result) {
          insertCategories(categories, id, undefined, function (catRes) {
            result.insertId = id;
            if (catRes.status) {
              if (result.affectedRows == 2) {
                callback({
                  status: true,
                  msg: "Product Saved.",
                  result: result,
                });
              } else {
                callback({
                  status: true,
                  msg: "Product Saved.",
                  result: result,
                });
              }
            } else {
              callback(catRes);
            }
          });
        })
        .catch(function (err) {
          console.log(new Date(), err.message, Mysql.getLastQuery());
          error = JSON.stringify(err.message);
          slack(
            `File: product.js, \nAction: SaveProduct, \nError ${error} \n 
				`,
            "J.A.R.V.I.S",
            "C029PF7DLKE"
          );
          callback({
            status: false,
            msg: err.message,
          });
        });
    })
    .catch(function (err) {
      console.log(new Date(), " SaveProduct Error , mysql error:", err.message);
    });
};

exports.RemoveProduct = function (data, callback) {
  Mysql.update(
    "products",
    {
      ProductID: data.ProductID,
    },
    data
  )
    .then(function (result) {
      if (result.affectedRows == 1) {
        callback({
          status: true,
          msg: "Product Deleted Successfully.",
          result: result,
        });
      } else {
        callback({
          status: true,
          msg: "Success!",
          result: result,
        });
      }
    })
    .catch(function (err) {
      error = JSON.stringify(err.message);
      slack(
        `File: product.js, \nAction: RemoveProduct, \nError ${error} \n 
			`,
        "J.A.R.V.I.S",
        "C029PF7DLKE"
      );
      console.log(new Date(), err.message);
      callback({
        status: false,
        msg: err.message,
      });
    });
};

exports.SimpleUpdateProduct = function (data, callback) {
  Mysql.update(
    "products",
    {
      ProductID: data.ProductID,
    },
    data
  )
    .then(function (result) {
      if (result.affectedRows == 1) {
        callback({
          status: true,
          msg: "Updated Successfully.",
          result: result,
        });
      } else {
        callback({
          status: true,
          msg: "Success!",
          result: result,
        });
      }
    })
    .catch(function (err) {
      error = JSON.stringify(err.message);
      slack(
        `File: product.js, \nAction: SimpleUpdateProduct, \nError ${error} \n 
			`,
        "J.A.R.V.I.S",
        "C029PF7DLKE"
      );
      console.log(new Date(), err.message);
      callback({
        status: false,
        msg: err.message,
      });
    });
};

var insertCategories = function (categories, productId, productCode, callback) {
  if (productCode) {
    where = {
      ProductCode: productCode,
    };
  } else {
    where = {
      ProductID: productId,
    };
  }
  Mysql.record("products", where)
    .then(function (product_data) {
      if (product_data) {
        productId = product_data.ProductID;
        Mysql.delete("product_category", {
          ProductID: productId,
        })
          .then(function (res) {
            insertCategoryOp(categories, productId, callback);
          })
          .catch(function (err) {
            error = JSON.stringify(err.message);
            slack(
              `File: product.js, \nAction: insertCategories, \nError ${error} \n 
					`,
              "J.A.R.V.I.S",
              "C029PF7DLKE"
            );
            console.log(new Date(), err.message);
            callback({
              status: false,
              msg: err.message,
            });
          });
      } else {
        insertCategoryOp(categories, productId, callback);
      }
    })
    .catch(function (err) {
      error = JSON.stringify(err.message);
      slack(
        `File: product.js, \nAction: insertCategories, \nError ${error} \n 
			`,
        "J.A.R.V.I.S",
        "C029PF7DLKE"
      );
      console.log(new Date(), "Err =========== ", err.message);
    });
};

var insertCategoryOp = function (categories, productId, callback) {
  var catCount = 0;
  if (categories) {
    categories.forEach(function (categoryId) {
      var data = {
        ProductID: productId,
        CategoryID: categoryId,
        CreatedAt: new Date(),
      };
      Mysql.insert("product_category", data)
        .then(function (result) {
          catCount += 1;
          if (catCount === categories.length) {
            // console.log(new Date(), 'Product Categories Saved.');
            callback({
              status: true,
              msg: "Product Categories Saved",
              result: result,
            });
          } else {
            // console.log(new Date(), 'Product Categories Saving.');
          }
        })
        .catch(function (err) {
          error = JSON.stringify(err.message);
          slack(
            `File: product.js, \nAction: insertCategoryOp, \nError ${error} \n 
					`,
            "J.A.R.V.I.S",
            "C029PF7DLKE"
          );
          console.log(new Date(), err.message);
          callback({
            status: false,
            msg: err.message,
          });
        });
    });
  } else {
    callback({
      status: true,
      msg: "Product Categories Saved",
      result: [],
    });
  }
};
