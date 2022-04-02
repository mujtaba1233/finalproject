var express = require("express");
var router = express.Router();
var request = require("request");
var parseString = require("xml2js").parseString;
var xml2js = require("xml2js");
var model = require("../models/product");
var orderModel = require("../models/order");
var image = require("../models/image");
var productDetailModel = require("../models/product-detail");
var uttils = require("../helpers/utilities");
var mailHelper = require("../helpers/mailHelper");
var Jimp = require("jimp");
fs = require("fs");

router.get("/list", function (req, res, next) {
  // uttils.authenticateUser(req,res, () => {
  model.GetAllProductsActive(function (records) {
    res.send(JSON.stringify(records));
  });
  // }, () => {
  // 	res.send('Unathorized access')
  // })
});
router.get("/list-comp", function (req, res, next) {
  uttils.authenticateUser(
    req,
    res,
    () => {
      model.GetAllProducts(function (records) {
        res.send(JSON.stringify(records));
      });
    },
    () => {
      res.send("Unathorized access");
    }
  );
});
router.get("/list/:id", function (req, res, next) {
  var id = req.params.id;
  uttils.authenticateUser(
    req,
    res,
    () => {
      model.GetProduct(id, function (records) {
        res.send(JSON.stringify(records));
      });
    },
    () => {
      res.send("Unathorized access");
    }
  );
});
router.post("/upload", function (req, res, next) {
  req.pipe(req.busboy);
  req.busboy.on("file", function (fieldName, file, fileName) {
    var d = new Date().getTime();
    var dir = "./admin-panel/files/product-xml-files";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    path =
      "./admin-panel/files/product-xml-files/" + "file-" + d + "-" + fileName;
    var fstream = fs.createWriteStream(path);
    file.pipe(fstream);
    fstream.on("close", function () {
      var parser = new xml2js.Parser();
      fs.readFile(path, function (err, data) {
        console.log(new Date(), err);
        if (err == null) {
          parser.parseString(data, function (err, result) {
            // res.send({
            // 	success: true,
            // 	message: "Valid file, Press import!",
            // 	path: result
            // });
            if (
              result &&
              result.Export &&
              result.Export.Products_Joined &&
              result.Export.Products_Joined.length > 0
            ) {
              res.send({
                success: true,
                message: "Valid product XML file, Press import!",
                path: path,
              });
            } else if (
              result &&
              result.Export &&
              result.Export.OptionCategories &&
              result.Export.OptionCategories &&
              result.Export.OptionCategories.length > 0
            ) {
              res.send({
                success: true,
                message: "Valid file option category XML, Press import!",
                path: path,
              });
            } else if (
              result &&
              result.Export &&
              result.Export.Options &&
              result.Export.Options.length > 0
            ) {
              res.send({
                success: true,
                message: "Valid file options XML, Press import!",
                path: path,
              });
            } else if (
              result &&
              result.Export &&
              result.Export.TrackingNumbers &&
              result.Export.TrackingNumbers.length > 0
            ) {
              res.send({
                success: true,
                message: "Valid file TrackingNumbers XML, Press import!",
                path: path,
              });
            } else {
              res.send({
                success: false,
                message: "Invalid file or XML.",
                path: fileName,
              });
            }
          });
        } else {
          res.send({
            success: false,
            message: "Invalid XML format.",
            path: fileName,
          });
        }
      });
    });
  });
});
router.post("/save-xml-product", function (req, res, next) {
  var path = req.body.path;
  var parser = new xml2js.Parser();
  fs.readFile(path, function (err, data) {
    parser.parseString(data, function (err, result) {
      if (result.Export.hasOwnProperty("Products_Joined")) {
        var results = result.Export.Products_Joined;
        model.ImportProducts(results, function (status) {
          res.send({
            success: status,
            path: path,
          });
        });
      } else if (result.Export.hasOwnProperty("OptionCategories")) {
        var results = result.Export.OptionCategories;
        model.ImportOptionCategory(results, function (status) {
          res.send({
            success: status,
            path: path,
          });
        });
      } else if (result.Export.hasOwnProperty("Options")) {
        var results = result.Export.Options;
        model.ImportOptions(results, function (status) {
          res.send({
            success: status,
            path: path,
          });
        });
      } else if (result.Export.hasOwnProperty("TrackingNumbers")) {
        var results = result.Export.TrackingNumbers;
        orderModel.importOrderFile(results, function (status) {
          res.send({
            success: status,
            path: path,
          });
        });
      }
    });
  });
});
router.post("/save", function (req, res, next) {
  var fileNames = [];
  var data = {};
  req.busboy.on(
    "field",
    function (fieldName, fieldValue, valTruncated, keyTruncated) {
      data = JSON.parse(fieldValue);
    }
  );
  req.busboy.on("file", function (fieldName, file, fileName) {
    // console.log(data.ProductCode, fileName);

    var date = new Date();
    var d = date.getTime();
    fileExt = fileName.split(".").pop();
    fileName = d + "-" + fileName;

    path = "./uploads/images/" + fileName;
    if (!fs.existsSync("./uploads/")) {
      fs.mkdirSync("./uploads/");
    }
    if (!fs.existsSync("./uploads/images/")) {
      fs.mkdirSync("./uploads/images/");
    }
    fileNames.push(fileName);
    var fstream = fs.createWriteStream(path);
    file.pipe(fstream);
    fstream.on("close", function () {
      Jimp.read(path)
        .then((img) => {
          fileNames.push(
            "$$-" + fileName.split(".").slice(0, -1).join(".") + "S." + fileExt
          );
          // console.log(`${path.split(" .").slice(0, -1).join('.')}S.${fileExt}`)
          return (
            img
              .resize(50, 50) // resize
              // .quality(60) // set JPEG quality
              // .greyscale() // set greyscale
              .write(`${path.split(".").slice(0, -1).join(".")}S.${fileExt}`)
          ); // save
        })
        .catch((err) => {
          console.error(err);
        });
    });
  });
  req.busboy.on("finish", function () {
    // return console.log(data.TitleImage, "TitleImage")
    // data.IsActive = (data.IsActive.toLowerCase() === 'true')
    // data.HideProduct = (data.HideProduct.toLowerCase() === 'true')
    // data.HideWhenOutOfStock = (data.HideWhenOutOfStock.toLowerCase() === 'true')
    if (data.TitleImage && data.TitleImage !== "") {
      var fileExt = data.TitleImage.split(".").pop();
      var path = `./uploads/images/${data.TitleImage}`;
      Jimp.read(path)
        .then((img) => {
          return img
            .resize(150, 150) // resize
            .write(`./uploads/images/${data.ProductCode}.${fileExt}`); // save
        })
        .catch((err) => {
          console.error(err);
        });
      // delete data.TitleImage;
      data.ProductPhotoURL = `${data.ProductCode}.${fileExt}`;
    }
    if (data.TitleImage == null) {
      data.ProductPhotoURL = null;
    }
    model.SaveProduct(data, function (result) {
      if (result.status) {
        image.Save(fileNames, result.result.insertId, function (response) {
          if (response.status) {
            res.send(result);
          } else {
            res.send(response);
          }
        });
      } else {
        res.send(result);
      }
    });
  });
  req.pipe(req.busboy);
});
router.get("/sync", function (req, res, next) {
  uttils.authenticateUser(
    req,
    res,
    () => {
      var productUrl =
        "http://quggv.lmprq.servertrust.com/net/WebService.aspx?Login=developer@intrepidcs.com&EncryptedPassword=" +
        process.env.VOLUSION_PASSWORD +
        "&EDI_Name=Generic\\Products&SELECT_Columns=p.HideProduct,pm.METATAG_Keywords,pe.METATAG_Description,pm.ProductDescription_AbovePricing,pm.ExtInfo,pd.ProductDescription,p.IsChildOfProductCode,p.IsChildOfProductCode_ProductID,p.Options_Cloned_From,p.Options_Cloned_From_ProductID,p.ProductCode,p.ProductID,p.ProductName,p.StockStatus,pd.ProductDescriptionShort,pe.Availability,pe.Fixed_ShippingCost,pe.FreeShippingItem,pe.Hide_FreeAccessories,pe.ListPrice,pe.ListPrice_Name,pe.Photo_AltText,pe.PhotoURL_Large,pe.PhotoURL_Small,pe.ProductCategory,pe.ProductManufacturer,pe.ProductNameShort,pe.ProductPrice,pe.ProductPrice_Name,pe.ProductWeight,pe.SalePrice,pe.SalePrice_Name,pe.SelectedOptionIDs,pe.TaxableProduct,pe.UPC_code,pe.Vendor_Price,pm.TechSpecs";
      var opt = {
        url: productUrl,
      };

      function callback(error, result, body) {
        console.log(new Date(), error);
        parseString(body, function (err, result) {
          console.log(new Date(), err);
          if (!err && result && result.xmldata != undefined) {
            if (
              result.xmldata.Products != undefined &&
              result.xmldata.Products.length > 0
            ) {
              console.log(
                new Date(),
                "Products Length: ",
                result.xmldata.Products.length
              );
              model.InsertProducts(result.xmldata.Products, function () {
                // res.send(JSON.stringify({
                // 	status: 'updated'
                // }));
              });
              request(opt, callback);
            } else {
              res.send(
                JSON.stringify({
                  status: "update complete",
                })
              );
            }
          } else {
            mailHelper.errorReport({
              subject: "RMA Import Status",
              error: uttils.ERROR_STRING(),
            });
            res.send(
              JSON.stringify({
                status: "volusion password expired",
              })
            );
            console.log(new Date(), new Date(), "volusion Password Exp");
          }
        });
      }
      request(opt, callback);
    },
    () => {
      res.send("Unathorized access");
    }
  );
});
router.post("/save-partial", function (req, res, next) {
  var productChk = false;
  var productImagesChk = false;
  var productDetailChk = false;
  var productData = {
    IsActive: 0,
    isCompleted: 0,
  };
  var productDetail = req.body.productDetail;
  var productImages = req.body.productImages;
  if (productData) {
    model.SaveProduct(productData, function (response) {
      if (response.status) {
        productChk = true;
        if (productDetailChk && productImagesChk && productChk) {
          res.send(response);
        }
      } else {
        console.log(new Date(), "Error while product partial saving");
      }
    });
  } else {
    productChk = true;
  }
  if (productDetail && productDetail.length > 0) {
    detCounter = 0;
    for (var i = 0; i < productDetail.length; i++) {
      var productDetailData = {
        ProductID: productDetail[i].productId,
        Name: productDetail[i].name,
        URL: productDetail[i].fileName,
        CreatedAt: new Date(),
      };
      productDetailModel.Save(productDetailData, function (response) {
        detCounter += 1;
        if (detCounter == productDetail.length) {
          productDetailChk = true;
          if (productDetailChk && productImagesChk && productChk) {
            res.send(response);
          }
        }
      });
    }
  } else {
    productDetailChk = true;
  }
  if (productImages && productImages.length > 0) {
    for (var i = 0; i < productImages.length; i++) {
      var imageData = {
        TableID: productImages[i].productId,
        TableName: "Product",
        ImageURL: productImages[i].fileName,
        CreatedAt: new Date(),
      };
      image.Save(imageData, function (response) {
        imgCounter += 1;
        if (imgCounter == productDetail.length) {
          productImagesChk = true;
          if (productDetailChk && productImagesChk && productChk) {
            res.send(response);
          }
        }
      });
    }
  } else {
    productImagesChk = true;
  }
  if (productDetailChk && productImagesChk && productChk) {
    res.send({
      status: false,
      msg: "Invalid data object passed.",
    });
  }
});
router.delete("/remove", function (req, res, next) {
  var data = req.body;
  data.IsDeleted = true;
  model.RemoveProduct(data, function (response) {
    res.send(response);
  });
});

router.post("/simple-update", function (req, res, next) {
  var data = req.body;
  model.SimpleUpdateProduct(data, function (response) {
    res.send(response);
  });
});

module.exports = router;
