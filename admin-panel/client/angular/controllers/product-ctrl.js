vulusionApp.controller(
  "ProductController",
  function ProductController(
    LookupService,
    PackagingBoxService,
    PackagingService,
    ProductService,
    FileService,
    ImageService,
    CommonService,
    $rootScope,
    $scope,
    Upload,
    $filter,
    $timeout
  ) {
    $scope.init = function (mode) {
      CommonService.authenticateUser().then(function () {
        $rootScope.logout = CommonService.logout;
        CommonService.showLoader();
        $scope.options = {
          language: "en",
          allowedContent: true,
          entities: false,
          autoParagraph: false,
        };
        $scope.parsedAccessories = [];
        $scope.productPackaging = [];
        LookupService.getCountries().then(
          function (response) {
            CommonService.hideLoader();
            $scope.countries = response.data;
            // $scope.filteredCountries = $scope.countries.filter(country => {
            //     return country.code != 'CU' && country.code != 'IR' && country.code != 'KP'
            // })
          },
          function (error) {
            CommonService.hideLoader();
            CommonService.showError("Error while retrieving country names");
          }
        );
        if (
          mode == "new" &&
          !window.location.search &&
          window.location.search.indexOf("productId") === -1
        ) {
          // console.log('Add Mode')
          $scope.product = {};
          $scope.mode = "Create";
          $scope.productCodeDisabled = false;
          $scope.product.HideProduct = true;
          $scope.isNew = true;
          $scope.product.IsActive = true;
          $scope.product.isSerialAble = true;
          $scope.product.IsFreeProduct = false;
          $scope.product.HideWhenOutOfStock = false;
          $scope.product.ProductName = "";
          $scope.product.ProductDescriptionShort = "";
          $scope.product.ProductDescription = "";
          $scope.product.TechSpecs = "";
          $scope.product.ProductDescription_AbovePricing = "";
          $scope.ProductCodePattern = "^[a-zA-Z0-9._-]+$";
          $scope.option = {
            allowClear: true,
          };
          getShippingAvailablityStatus();
          getProductsLookup();
          getCategoryLookup();
          getPackagingBox();

          ProductService.savePartial({
            isCompleted: 0,
            IsActive: 0,
            isSerialAble: 0,
            IsFreeProduct: 0,
          }).then(
            function (response) {
              // console.log(response);
              if (response.data.status) {
                CommonService.hideLoader();
                $scope.product.ProductID = response.data.result.insertId;
                $scope.productPackaging = [
                  {
                    dimensions: "",
                    quantity: 0,
                    productId: $scope.product.ProductID,
                  },
                ];
                // console.log("Empty ProductId", $scope.product.ProductID);
                // CommonService.showSuccess(response.data.msg);
              } else {
                CommonService.showError(response.data.msg);
              }
            },
            function (err) {
              if (err.data) {
                console.log(err);
                CommonService.showError(err.data.msg);
              } else {
                console.log(err);
                CommonService.showError("Please wait, reloading in progress!");
                window.location.reload();
              }
            }
          );
        } else if (mode == "search") {
          console.log("Search Mode");
          $scope.itemsByPage = 50;
          $scope.productCodeDisabled = false;
          ProductService.getAllProducts().then(
            function (response) {
              // console.log(response);
              $scope.products = response.data;

              $scope.selectedOption = Object.keys($scope.products[0]);
              $scope.updateExportFileName();
              $scope.products.forEach(function (elem) {
                elem.isPriorityEditMode = false;
                elem.HideProduct = elem.HideProduct === "Y" ? "Y" : "N";
              });
              CommonService.hideLoader();
            },
            function (err) {
              console.log(err);
            }
          );
        } else if (
          window.location.search &&
          window.location.search.indexOf("clone") > -1
        ) {
          console.log("Clone Mode");
          var id = window.location.search.split("?")[1].split("=")[1];
          // console.log('Product ID', id);
          $scope.productCodeDisabled = false;
          $scope.mode = "Clone";
          $scope.product = {};
          $scope.invalidProductCode = false;
          $scope.product.HideProduct = true;
          $scope.isNew = true;
          $scope.product.IsActive = true;
          $scope.product.isSerialAble = true;
          $scope.product.IsFreeProduct = false;
          $scope.product.HideWhenOutOfStock = false;
          $scope.product.ExportDescription = "";
          $scope.product.HarmonizedCode = "";
          $scope.product.ExportControlClassificationNumber = "";
          $scope.product.UnitOfMeasure = "";
          $scope.product.CountryOfOrigin = "";
          $scope.product.ProductName = "";
          $scope.product.ProductDescriptionShort = "";
          $scope.product.ProductDescription = "";
          $scope.product.TechSpecs = "";
          $scope.product.IsFeatured = 0;
          $scope.product.ProductDescription_AbovePricing = "";
          $scope.ProductCodePattern = "^[a-zA-Z0-9._-]+$";
          $scope.product.ExportDescription =
            $scope.product.ProductCode + " - " + $scope.product.ProductName;
          $scope.option = {
            allowClear: true,
          };
          getShippingAvailablityStatus();
          getProductsLookup();
          getCategoryLookup();
          getPackagings(id);
          getPackagingBox();

          ProductService.getProduct(id).then(function (response) {
            if (response.data.length === 0) {
              CommonService.hideLoader();
              CommonService.showError("Product Does Not Exist.");
              return;
            }
            // console.log(response);
            $scope.productArray = response.data;
            $scope.uploadedImages = $filter("unique")(
              $scope.productArray,
              "ID"
            );
            $scope.uploadedPdfs = $filter("unique")(
              $scope.productArray,
              "ProductDetailID"
            );
            $scope.categoriesArray = $filter("unique")(
              $scope.productArray,
              "CategoryID"
            );

            if ($scope.uploadedPdfs[0].ProductDetailID == null) {
              $scope.uploadedPdfs = [];
            }
            if ($scope.uploadedImages[0].ID == null) {
              $scope.uploadedImages = [];
            }
            // console.log('Images', $scope.uploadedImages);
            // console.log('pdfs', $scope.uploadedPdfs);
            $scope.parentCode = response.data[0].ProductCode;
            $scope.product = response.data[0];
            // console.log($scope.product);
            $scope.product.ProductCode = null;
            $scope.product.Categories = [];
            $scope.categoriesArray.forEach(function (cat) {
              $scope.product.Categories.push(cat.CategoryID);
            });
            $scope.product.IsActive = $scope.product.IsActive == 1;
            $scope.product.isSerialAble = $scope.product.isSerialAble == 1;
            $scope.product.IsFreeProduct =
              $scope.mode === "Clone"
                ? false
                : $scope.product.IsFreeProduct == 1;
            $scope.product.IsFeatured =
              $scope.mode === "Clone" ? 0 : $scope.product.IsFeatured == 1;
            $scope.product.HideProduct = $scope.product.HideProduct === "Y";
            $scope.product.HideWhenOutOfStock =
              $scope.product.HideWhenOutOfStock == 1;

            var arr = CommonService.parseFreeAccessories(
              $scope.product.FreeAccessories
            );
            $scope.product.FreeAccessoriesArray = [];
            // console.log('FreeAccessoriesArray', arr);
            $scope.parsedAccessories = arr;
            arr.forEach(function (elem) {
              $scope.product.FreeAccessoriesArray.push(elem.code);
            });
            // console.log($scope.product);
            ProductService.savePartial({
              isCompleted: 0,
              IsActive: 0,
              isSerialAble: 0,
              IsFreeProduct: 0,
            }).then(
              function (response) {
                // console.log(response);

                if (response.data.status) {
                  CommonService.hideLoader();
                  $scope.product.ProductID = response.data.result.insertId;
                  if ($scope.productPackaging.length > 0) {
                    $scope.productPackaging.map((elem) => {
                      if (elem) {
                        delete elem.id;
                        elem.productId = $scope.product.ProductID;
                      }
                    });
                  }
                  // console.log($scope.productPackaging);
                  // $scope.productPackaging = [{
                  //     dimensions: '',
                  //     quantity: 0,
                  //     productId: $scope.product.ProductID
                  // }]
                  // console.log("Empty ProductId", $scope.product.ProductID);
                  // CommonService.showSuccess(response.data.msg);
                } else {
                  CommonService.showError(response.data.msg);
                }
              },
              function (err) {
                if (err.data) {
                  console.log(err);
                  CommonService.showError(err.data.msg);
                } else {
                  console.log(err);
                  CommonService.showError(
                    "Please wait, reloading in progress!"
                  );
                  window.location.reload();
                }
              }
            );
            CommonService.hideLoader();
          });
        } else if (
          window.location.search &&
          window.location.search.indexOf("productId") > -1
        ) {
          // console.log("Update Mode");
          var id = window.location.search.split("?")[1].split("=")[1];
          // console.log('Product ID', id);
          $scope.mode = "Update";
          $scope.productCodeDisabled = true;
          $scope.isNew = false;
          $scope.ProductCodePattern = "^[a-zA-Z0-9._-]+$";
          $scope.option = {
            allowClear: true,
          };
          getShippingAvailablityStatus();
          getProductsLookup();
          getCategoryLookup();
          getPackagings(id);
          getPackagingBox();

          ProductService.getProduct(id).then(function (response) {
            if (response.data.length === 0) {
              CommonService.hideLoader();
              CommonService.showError("Product Does Not Exist.");
              return;
            }
            $scope.productArray = response.data;
            $scope.uploadedImages = $filter("unique")(
              $scope.productArray,
              "ID"
            );
            $scope.uploadedImages.sort(function(a, b) {
              return parseFloat(a.DisplayOrder) - parseFloat(b.DisplayOrder);
            });
            $scope.uploadedPdfs = $filter("unique")(
              $scope.productArray,
              "ProductDetailID"
            );
            $scope.categoriesArray = $filter("unique")(
              $scope.productArray,
              "CategoryID"
            );

            if ($scope.uploadedPdfs[0].ProductDetailID == null) {
              $scope.uploadedPdfs = [];
            }
            if ($scope.uploadedImages[0].ID == null) {
              $scope.uploadedImages = [];
            }
            // console.log('Images', $scope.uploadedImages);
            // console.log('pdfs', $scope.uploadedPdfs);
            // console.log(response.data);

            $scope.product = response.data[0];
            $scope.product.Categories = [];
            $scope.categoriesArray.forEach(function (cat) {
              $scope.product.Categories.push(cat.CategoryID);
            });
            $scope.product.IsActive = $scope.product.IsActive == 1;
            $scope.product.isSerialAble = $scope.product.isSerialAble == 1;
            $scope.product.IsFreeProduct = $scope.product.IsFreeProduct == 1;
            $scope.product.HideProduct = $scope.product.HideProduct === "Y";
            $scope.product.HideWhenOutOfStock =
              $scope.product.HideWhenOutOfStock == 1;
            $scope.product.TitleImage = $scope.product.TitleImage;
            // $scope.product.ExportDescription = $scope.product.ProductCode + ' - ' + $scope.product.ProductName
            // console.log($scope.product);
            var arr = CommonService.parseFreeAccessories(
              $scope.product.FreeAccessories
            );
            $scope.product.FreeAccessoriesArray = [];
            // console.log('FreeAccessoriesArray', arr);
            $scope.parsedAccessories = arr;
            arr.forEach(function (elem) {
              $scope.product.FreeAccessoriesArray.push(elem.code);
            });
            // console.log($scope.product);
            CommonService.hideLoader();
          });
        } else {
          window.location.href = "/home";
        }
      });
    };
    $scope.upload = function ($invalidFiles, files) {
      // console.log($invalidFiles);
      // console.log(files);
      if ($invalidFiles) {
        $invalidFiles.map((file) => {
          if (file.$error == "dimensions") {
            $scope.invalidImage = true;
          } else {
            $scope.invalidImage = false;
          }
        });
      }
      if ($scope.invalidImage) {
        CommonService.showError("Kindly Select an image with 900x900.");
      }
    };
    $scope.$watch("files", function (changed) {
      // console.log(changed);
      // console.log($scope.files);
      // console.log($scope.uploadedImages);
    });

    $scope.$watch("product.FreeAccessoriesArray", function (changed) {
      // console.log('FreeAccessoriesArray changed to ', changed);
      $scope.freeAccessories = {};
      if (changed && ($scope.isNew || $scope.parsedAccessories.length === 0)) {
        changed.forEach(function (code) {
          $scope.freeAccessories[code] = {
            code: code,
            qty: 1,
          };
        });
      } else {
        changed &&
          changed.forEach(function (code) {
            $scope.freeAccessories[code] = {
              code: code,
              qty: 1,
            };
            $scope.parsedAccessories.forEach(function (acsQty) {
              if ($scope.freeAccessories[acsQty.code])
                $scope.freeAccessories[acsQty.code] = acsQty;
            });
          });
      }
      // console.log($scope.freeAccessories);
    });
    $scope.fileSelect = function () {
      $scope.pdfs = [];
      $scope.pdfFiles.forEach((elem) => {
        $scope.pdfs.push({
          file: elem,
          URL: elem.name,
          Name: "",
          ProductID: $scope.product.ProductID,
        });
      });
    };
    $scope.removeImage = function (src, index) {
      let images = $scope.uploadedImages.filter(function (el) {
        return el.IsThumb == 0;
      });
      CommonService.confirm(
        "Are you sure you want to delete this image?",
        function () {
          if (src === "local") {
            $scope.files.splice(index, 1);
          } else {
            var data = {
              ImageURL: $scope.uploadedImages[index].ImageURL,
              ID: $scope.uploadedImages[index].ID,
              ProductID: $scope.product.ProductID,
            };
            // console.log(images[index]);
            ImageService.remove(data).then(function (response) {
              // console.log(images[index]);
              if (response.data.status) {
                $scope.uploadedImages.splice(index, 1);
                if (
                  $scope.product.TitleImage ===
                  $scope.uploadedImages[index].ImageURL
                ) {
                  $scope.product.TitleImage = null;
                }
                CommonService.showSuccess(response.data.msg);
              } else {
                CommonService.showError(response.data.msg);
              }
            });
          }
          $timeout(function () {
            $scope.$apply();
          });
        }
      );
    };
    $scope.removePdf = function (src, index) {
      CommonService.confirm(
        "Are you sure you want to delete this PDF?",
        function () {
          if (src === "local") {
            $scope.pdfs.splice(index, 1);
            $scope.pdfFiles.splice(index, 1);
          } else {
            var data = {
              URL: $scope.uploadedPdfs[index].URL,
              ProductDetailID: $scope.uploadedPdfs[index].ProductDetailID,
            };
            FileService.remove(data).then(function (response) {
              if (response.data.status) {
                $scope.uploadedPdfs.splice(index, 1);
                CommonService.showSuccess(response.data.msg);
              } else {
                CommonService.showError(response.data.msg);
              }
            });
          }
          $timeout(function () {
            $scope.$apply();
          });
        }
      );
    };
    $scope.updatePriorityIndex = function (product) {
      // console.log('====================================');
      // console.log(product);
      CommonService.showLoader();
      ProductService.simpleUpdate({
        ProductID: product.ProductID,
        PriorityIndex: product.PriorityIndex,
      }).then(function (response) {
        CommonService.hideLoader();
        if (response.data.status) {
          product.isPriorityEditMode = false;
          CommonService.showSuccess(response.data.msg);
        } else {
          CommonService.showError(response.data.msg);
        }
      });
      // console.log('====================================');
    };
    $scope.validateImageDimensions = function () {
      let dimensions = [];
      let images = document.querySelectorAll("#image");
      let array = Object.entries(images);
      // console.log(array);
      array.map((elem) => {
        dimensions.push(elem[1].naturalHeight, elem[1].naturalWidth);
        if (elem[1].naturalHeight !== 900 || elem[1].naturalWidth !== 900)
          elem[1].className = elem[1].className + " border-danger";
      });
      let check = (list) => list.every((item) => item === 900);
      if (!check(dimensions)) {
        $scope.invalidImage = true;
      } else {
        $scope.invalidImage = false;
      }
    };
    $scope.saveProduct = function () {
      if ($scope.uploadedImages != undefined) {
        let images = $scope.uploadedImages.filter(function (el) {
          return el.IsThumb == 0;
        });
        if ($scope.product.TitleImage && images.length > 0) {
          let filterimages = images.filter(function (el) {
            return el.ImageURL === $scope.product.TitleImage;
          });
          if (!filterimages.length) {
            $scope.product.TitleImage = images[0].ImageURL;
          }
        }
        if (!$scope.product.TitleImage && images.length > 0) {
          $scope.product.TitleImage = images[0].ImageURL;
        }
        if (!(images.length > 0)) {
          $scope.product.TitleImage = null;
        }
      }
      // console.log($scope.product.TitleImage);
      if ($scope.mode == "Clone" || $scope.mode == "Update") {
        var id = window.location.search.split("?")[1].split("=")[1];
        const images = $scope.uploadedImages.map((image) => {
          return image.ID;
        });
        ImageService.update(images).then(function (response) {
          if (response.data.status) {
            // console.log(response)
          } else {
            console.log(response);
          }
        });
        ProductService.getProduct(id).then(function (response) {
          if (response.data.length === 0) {
            CommonService.hideLoader();
            CommonService.showError("Product Does Not Exist.");
            return;
          }
        });
      }
      if (
        $scope.parentCode == $scope.product.ProductCode &&
        $scope.mode == "Clone"
      ) {
        CommonService.showError("Product Code should be unique");
        return;
      }
      if (!$scope.product.ProductCode) {
        CommonService.showError("Product Code required");
        return;
      }
      if (
        $scope.product.ProductPrice === undefined ||
        $scope.product.ProductPrice < 0 ||
        $scope.product.ProductPrice == null
      ) {
        CommonService.showError("Product Price required");
        return;
      }
      if(!$scope.product.Categories || $scope.product.Categories.length <=0 ||  $scope.product.Categories === "undefined" || $scope.product.Categories === null){
        CommonService.showError("Select lease 1 product category");
        return
      }
      CommonService.showLoader();
      var finalFreeAccessories = [];
      for (const key in $scope.freeAccessories) {
        finalFreeAccessories.push($scope.freeAccessories[key]);
      }
      // console.log("images", $scope.files);

      // console.log("pdfData", $scope.pdfs);

      // console.log("Product Hash: ", $scope.product);
      $scope.product.FreeAccessories = finalFreeAccessories
        ? finalFreeAccessories
            .map(function (elem) {
              return `${elem.code}(${elem.qty})`;
            })
            .join(",")
        : "";
      if ($scope.product.FreeAccessories != "") {
        $scope.product.FreeAccessories += "(1)";
      }
      var data = angular.copy($scope.product);
      delete data.FreeAccessoriesArray;
      for (var d in data) {
        // data[d] = typeof (data[d]) == 'string' ? data[d].replace(/\\/g, '').replace(/[\n\r]/g, '<br />') : data[d];
        // console.log(data[d]);
      }
      delete data.DisplayOrder;
      delete data.ImageURL;
      delete data.IsThumb;
      delete data.IsDeleted;
      delete data.Name;
      delete data.URL;
      delete data.ProductDetailID;
      delete data.TableID;
      delete data.CategoryID;
      delete data.ID;
      data.ProductDescriptionShort = data.ProductDescriptionShort.replace(
        /&nbsp;/g,
        ""
      )
        .replace(/<br\s*[\/]?>/gi, "")
        .replace(/<br>/g, "");
      // data.ProductDescription = data.ProductDescription.replace(/&nbsp;/g, '').replace(/<br\s*[\/]?>/gi, '').replace(/<br>/g, '')
      // data.TechSpecs = data.TechSpecs.replace(/&nbsp;/g, '').replace(/<br\s*[\/]?>/gi, '').replace(/<br>/g, '')
      // data.ProductDetailURL = data.ProductDetailURL.replace(/&nbsp;/g, '').replace(/<br\s*[\/]?>/gi, '').replace(/<br>/g, '')
      data.ProductDescription_AbovePricing =
        data.ProductDescription_AbovePricing.replace(/&nbsp;/g, "");
      data.ProductCode = data.ProductCode.toUpperCase();
      data.isCompleted = true;
      data.HideProduct = data.HideProduct ? "Y" : "N";
      // return console.log('Product Ready to save: ', data.TitleImage);
      // console.log($scope.productPackaging);
      let isBoxSaved = $scope.savePackaging();
      
      if (isBoxSaved)
        ProductService.save(data, $scope.files).then(
          function (response) {
            // console.log(response);
            if (response.data.status) {
              if ($scope.pdfs && $scope.pdfs.length > 0) {
                $scope.pdfs.forEach(function (elem) {
                  delete elem.file;
                });
                var pdfData = {
                  pdfs: $scope.pdfs,
                  productId: $scope.product.ProductID,
                };
                FileService.savePDF(pdfData, $scope.pdfFiles).then(function (
                  response
                ) {
                  // console.log(response);
                  CommonService.hideLoader();
                  CommonService.showSuccess(response.data.msg);
                  redirect();
                  getProduct();
                });
              } else {
                CommonService.hideLoader();
                CommonService.showSuccess(response.data.msg);
                redirect();
                getProduct();
              }
            } else {
              CommonService.hideLoader();
              CommonService.showError(response.data.msg);
                let productImages = response.data;
                $scope.uploadedImages = $filter('unique')(productImages, 'ID');
                $scope.uploadedImages.sort(function(a, b) {
                    return parseFloat(a.DisplayOrder) - parseFloat(b.DisplayOrder);
                });
                $scope.files = [];
                console.log($scope.uploadedImages);

            }
          },
          function (err) {
            if (err.data) {
              console.log(err.data.msg);
              CommonService.hideLoader();
              CommonService.showError(err.data.msg);
            } else {
              console.log(err.message);
              CommonService.hideLoader();
              CommonService.showError(ererr.messager);
            }
          }
        );
    };
    var getProduct = function () {
      // console.log($scope.product);
      ProductService.getProduct($scope.product.ProductID).then(function (
        response
      ) {
        if (response.data.length === 0) {
          CommonService.hideLoader();
          CommonService.showError("Product Does Not Exist.");
          return;
        } else {
          let productImages = response.data;
          $scope.uploadedImages = $filter("unique")(productImages, "ID");
          $scope.uploadedImages.sort(function(a, b) {
            return parseFloat(a.DisplayOrder) - parseFloat(b.DisplayOrder);
        });
          $scope.files = [];
          // console.log($scope.uploadedImages);
        }
      });
    };
    var redirect = function () {
      // window.location.reload();
    };
    $scope.removeProduct = function (id, index) {
      CommonService.confirm(
        "Are you sure you want to delete this product?",
        function () {
          ProductService.remove(id).then(
            function (response) {
              if (response.data.status) {
                ProductService.getAllProducts().then(
                  function (response) {
                    // console.log(response);
                    $scope.products = response.data;
                    $scope.selectedOption = Object.keys($scope.products[0]);
                    $scope.updateExportFileName();
                    $scope.products.forEach(function (elem) {
                      elem.isPriorityEditMode = false;
                      elem.HideProduct = elem.HideProduct === "Y" ? "Y" : "N";
                    });
                    CommonService.hideLoader();
                  },
                  function (err) {
                    console.log(err);
                  }
                );
                // $scope.products.splice(index, 1);
                CommonService.showSuccess(response.data.msg);
              } else {
                CommonService.showError(response.data.msg);
              }
            },
            function () {
              CommonService.showError(
                "Whoops! Something went wrong, check your internet connection."
              );
            }
          );
        }
      );
    };
    var getShippingAvailablityStatus = function () {
      CommonService.showLoader();
      LookupService.GetShippingAvailablityStatus().then(
        function (response) {
          $scope.shippingAvailablity = response.data;
          // console.log($scope.shippingAvailablity);
          CommonService.hideLoader();
        },
        function (err) {
          console.log(err);
          CommonService.hideLoader();
        }
      );
    };
    var getProductsLookup = function () {
      CommonService.showLoader();
      LookupService.GetProducts().then(
        function (response) {
          $scope.products = response.data;
          // console.log("products lookup",$scope.products);
          CommonService.hideLoader();
        },
        function (err) {
          console.log(err);
          CommonService.hideLoader();
        }
      );
    };
    var getCategoryLookup = function () {
      CommonService.showLoader();
      LookupService.GetCategories().then(
        function (response) {
          $scope.categories = response.data;
          // console.log($scope.categories);
          CommonService.hideLoader();
        },
        function (err) {
          console.log(err);
          CommonService.hideLoader();
        }
      );
    };
    $scope.updateExportFileName = function () {
      $scope.filename = `Products_${new Date().getTime()}.csv`;
    };
    var getPackagings = function (id) {
      PackagingService.list(id).then(function (response) {
        if (!response.data.status)
          return CommonService.showError(response.data.msg);
        if (!response.data.result.length > 0)
          return $scope.productPackaging.push({
            dimensions: "",
            quantity: 0,
            productId: id,
          });
        $scope.productPackaging = response.data.result;
        // console.log( $scope.productPackaging, 'productPackaging');
      });
    };
    var getPackagingBox = function (id) {
      PackagingBoxService.list().then(function (response) {
        // console.log(response)
        if (!response.data.status)
          return CommonService.showError(response.data.msg);
        if (!response.data.result.length > 0)
          return $scope.productPackaging.push({
            dimensions: "",
            quantity: 0,
            productId: id,
          });
        $scope.productPackagingBox = response.data.result;
        // console.log($scope.productPackagingBox)
      });
    };
    $scope.addModeBoxes = function () {
      $scope.productPackaging.push({
        dimensions: "",
        quantity: 0,
        productId: $scope.product.ProductID,
      });
    };
    $scope.savePackaging = function (params) {
      let productPackaging = $scope.productPackaging.filter((elem) => {
        return !!elem.quantity && !!elem.dimensions;
      });
      if (!productPackaging.length) {
        return true;
      }
      // if ($scope.productPackaging.length === 1 && $scope.productPackaging[0].quantity === 0) {
      //     return true
      // }
      // console.log($scope.product, $scope.productPackaging);
      let invalid = false;
      $scope.productPackaging.map((elem, index) => {
        if (elem.quantity * $scope.product.ProductWeight > 150) {
          invalid = true;
        }
      });

      if (invalid) {
        CommonService.showError(
          "Invalid quantity! Max quantity in one box for this product is " +
            Math.floor(150 / $scope.product.ProductWeight)
        );
        return false;
      }
      PackagingService.save($scope.productPackaging).then(function (response) {
        // console.log(response);
        if (!response.data.status) {
          CommonService.showError(response.data.msg);
          return false;
        }
        if (response.data.result.length > 0) {
          $scope.productPackaging = response.data.result;
        }
      });
      return true;
    };
    $scope.removeBox = function (index) {
      if ($scope.productPackaging[index].id) {
        CommonService.confirm(
          "Are you sure you want to delete this packaging? it will be permanent.",
          function () {
            //api call will be here for deletion
            PackagingService.delete({
              id: $scope.productPackaging[index].id,
            }).then((response) => {
              if (!response.data.status)
                return CommonService.showError(response.data.msg);
              CommonService.showSuccess(response.data.msg);
              $scope.productPackaging.splice(index, 1);
            });
          }
        );
      } else {
        $scope.productPackaging.splice(index, 1);
      }
    };
    $scope.maxTenNumericValidation = function () {
      let reg = new RegExp(/^[0-9]*$/);
      let value = $scope.product.HarmonizedCode;

      if (!reg.test(value)) {
        $scope.product.HarmonizedCode = value.substring(0, value.length - 1);
      }
      let reg2 = new RegExp(/^.{1,10}$/);
      if (!reg2.test($scope.product.HarmonizedCode))
        $scope.product.HarmonizedCode = value.substring(0, value.length - 1);
    };

    $scope.maxFiveAlphaNumericValidation = function () {
      let reg = new RegExp(/^[a-z0-9]+$/i);
      let value = $scope.product.ExportControlClassificationNumber;

      if (!reg.test(value)) {
        $scope.product.ExportControlClassificationNumber = value.substring(
          0,
          value.length - 1
        );
      }
      let reg2 = new RegExp(/^.{1,5}$/);
      if (!reg2.test($scope.product.ExportControlClassificationNumber))
        $scope.product.ExportControlClassificationNumber = value.substring(
          0,
          value.length - 1
        );
    };
    $(".btnNext").click(function () {
      $(".nav-item > .active").parent().next("li").find("a").trigger("click");
    });
    $(".btnPrevious").click(function () {
      $(".nav-item > .active").parent().prev("li").find("a").trigger("click");
    });
  }
);
