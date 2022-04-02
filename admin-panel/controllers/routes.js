var express = require("express");
var router = express.Router();
var utility = require("../helpers/utilities");
var db = require("../models/db");
var order = require("../models/order");
var request = require("request");
var fs = require("fs");
var path = require("path");
var lookup = require("../models/lookup");

var googleDrive = require("../helpers/googleDrive");
var fileModel = require("../models/file");
const fetch = require("node-fetch");
const fsP = require("fs").promises;
const { convert } = require("../helpers/generate-pdf");
const GenerateDOC = require("../helpers/generate-word");
// const {wordCreate} = require('../helpers/generate-word')
// const HtmlDocx = require('html-docx-js');
const HTMLtoDOCX = require("html-to-docx");
// console.log(fs.promises);
router.get("/", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("dashboard", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login`);
    },
    () => {
      res.sendFile(path.join(__dirname, "../../external-app/build/index.html"));
    }
  );
});

router.get(
  [
    "/login",
    "/quote-list",
    "/quote-create/:QuoteId?",
    "/recover-password",
    "/reset-password/:token",
    "/external-quotes",
  ],
  function (req, res) {
    res.sendFile(path.join(__dirname, "../../external-app/build/index.html"));
  }
);
router.get("/auth/:token", function (req, res) {
  var token = req.params.token;
  db.verifyUser(token, function (result) {
    if (result && result.dberror) {
      res.send(result.dberror);
    } else {
      if (result.email)
        res.sendFile(
          path.join(__dirname, "../../external-app/build/index.html")
        );
      else
        res.sendFile(
          path.join(__dirname, "../../external-app/build/index.html")
        );
    }
  });
});

router.get("/verify-user/:token", function (req, res) {
  var token = req.params.token;
  db.verifyUser(token, function (result) {
    if (result && result.dberror) {
      res.send(result.dberror);
    } else {
      if (result.email)
        res.sendFile(
          path.join(__dirname, "../../external-app/build/index.html")
        );
      else
        res.sendFile(
          path.join(__dirname, "../../external-app/build/index.html")
        );
    }
  });
});

// router.get('/quote-list', function (req, res) {
//     res.sendFile(path.join(__dirname, '../../external-app/build/index.html'));
// });
// router.get('/quote-create', function (req, res) {
//     res.sendFile(path.join(__dirname, '../../external-app/build/index.html'));
// });
// router.get('/recover-password', function (req, res, next) {
//     res.sendFile(path.join(__dirname, '../../external-app/build/index.html'));
// });
// router.get('/reset-password/:token', function (req, res) {
//     var token = req.params.token;
//     db.verifyUser(token, function (result) {
//         if (result && result.dberror) {
//             res.send(result.dberror)
//         } else {
//             if (result.email)
//                 res.render("setPassword", {
//                     baseUrl: __dirname
//                 });
//             else
//                 res.render("invalidUser", {
//                     baseUrl: __dirname
//                 });
//         }
//     });
// });

router.get("/quote-search", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("search", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});

router.get("/query-builder", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("query-builder", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/list-reports", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("list-reports", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});

router.get("/external-quote-search", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("searchExternalQuote", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});

router.get("/report", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("reports", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});

router.get("/home", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("dashboard", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});

router.get("/insertion", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("qoutes-insertion", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});

router.get("/edit", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("index", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/activity-log", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("activity-log", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});

router.get("/quote-new", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("index", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});

router.get("/settings", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("settings", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/user-management", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("user", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/customer-management", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("customer", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/end-user-management", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("end-user", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/description-files", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("description-files", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});

router.get("/order-search", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("order-search", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});

router.get("/order-new", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("order-new", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});

router.get("/rma-search", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("rma-search", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/rma-view", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("rma-view", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
// router.get("/profile", function (req, res) {
//   utility.authenticateUser(
//     req,
//     res,
//     () => {
//       res.render("profile", {
//         baseUrl: __dirname,
//       });
//     },
//     () => {
//       res.redirect(`/login?next=${req.url}`);
//     }
//   );
// });
router.get("/category-management", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("category", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/options", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("options", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/option-categories", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("options-categories", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/product-sales", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("product-sales", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/product-inventory", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("product-inventory", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/product", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("product-new", {
        baseUrl: __dirname,
        frontStoreUrl: process.env.STORE_URL,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/product-search", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("product-search", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/product-featured", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("product-featured", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/excel-handler", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("excel-handler", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/tax-exemption", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      res.render("tax-exemption", {
        baseUrl: __dirname,
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/excel-view/:id", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      fileModel.getSheetsData(req.params, function (response) {
        var sheets = [];
        response.result.forEach((elem) => {
          sheets.push({
            paneId: elem.SheetName.replace(/ /g, "").toLowerCase(),
            title: elem.SheetName,
            active: true,
            disabled: false,
            tabData: JSON.parse(elem.SheetData),
          });
          // sheets.push(JSON.parse(elem.SheetData))
        });
        response.result = sheets;
        // res.send(response)
        res.render("excel-view", { sheets: response.result });
      });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/quote/:quoteId", function (req, res) {
  var quoteId = req.params.quoteId;
  db.GetQuote(quoteId, function (result) {
    if (result && result.length > 0) {
      var taxAbleTotal = 0;
      try {
        taxAbleTotal = result.reduce(
          (accum, item) =>
            item.isTaxable
              ? accum +
                item.Qty * (item.Price - (item.Discount / 100) * item.Price)
              : accum + 0,
          0
        );
      } catch (error) {
        // console.log('error agya',error);
      }
      res.render("pdf-quote", {
        quote: result,
        taxAbleTotal,
        currency: req.app.get("currency"),
      });
    } else res.send("");
  });
});

router.get("/quote", function (req, res) {
  var quoteId = req.query.quoteId;
  db.GetQuote(quoteId, function (result) {
    if (result && result.length > 0)
      res.render("view", {
        quote: result,
      });
    else res.send("");
  });
});
// router.get('/forgot-password', function (req, res, next) {
//     res.render('forgot-password', {});
// });
// router.get('/reset-password/:token', function (req, res) {
//     var token = req.params.token;
//     db.verifyUser(token, function (result) {
//         if (result && result.dberror) {
//             res.send(result.dberror)
//         } else {
//             if (result.email)
//                 res.render("setPassword", {
//                     baseUrl: __dirname
//                 });
//             else
//                 res.render("invalidUser", {
//                     baseUrl: __dirname
//                 });
//         }
//     });
// });

// router.get('/auth/:token', function (req, res) {
//     var token = req.params.token;
//     db.verifyUser(token, function (result) {
//         if (result && result.dberror) {
//             res.send(result.dberror)
//         } else {
//             if (result.email)
//                 res.render("setPassword", {
//                     baseUrl: __dirname
//                 });
//             else
//                 res.render("invalidUser", {
//                     baseUrl: __dirname
//                 });
//         }
//     });
// });

router.get("/GeneratePDF/:quoteId", function (req, res) {
  // console.log(utility.getProtocol(req), "getProtocol")
  utility.authenticateUser(
    req,
    res,
    () => {
      var quoteId = req.params.quoteId;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-disposition", "inline;");

      if (quoteId.indexOf("-") !== -1 && quoteId.indexOf(".") !== -1)
        quoteId = parseInt(req.params.quoteId.split("-")[1].split(".")[0]);
      else quoteId = -1;
      console.log(quoteId,"quote id generate pdf")
      var url =
        utility.getProtocol(req) +
        utility.getBaseUrl(req) +
        "/quote/" +
        quoteId;

      var opt = {
        url:
          utility.getProtocol(req) +
          utility.getBaseUrl(req) +
          "/quote/" +
          quoteId,
      };

      async function callback(error, result, body) {
        if (!error) {
          var dir = process.cwd() + "/admin-panel/files/quotePDF";
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          var fileName =
            process.cwd() + "/admin-panel/files/quotePDF/" + quoteId + ".pdf";
          var callbackUrl =
            utility.getProtocol(req) +
            utility.getBaseUrl(req) +
            "/api/quote/driveCallback";
          const pdf = await convert(body.toString(), {
            format: "A4",
            margin: { top: 50, right: 50, left: 50, bottom: 50 },
          });
          fs.writeFileSync(fileName, pdf);
          if (!process.env.DEV_MODE)
            googleDrive.Uploadfile(
              undefined,
              "quotePDF",
              quoteId,
              res,
              req,
              callbackUrl,
              function () {
                // out.stream.pipe(res);
              }
            );
          res.send(pdf);
        }
      }
      request(opt, callback);
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});

router.get("/view-quote/:quoteId", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      var quoteId = req.params.quoteId;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-disposition", "inline;");
      if (quoteId.indexOf("-") !== -1 && quoteId.indexOf(".") !== -1)
        quoteId = parseInt(req.params.quoteId.split("-")[1].split(".")[0]);
      else quoteId = -1;
      var url =
        utility.getProtocol(req) +
        utility.getBaseUrl(req) +
        "/quote/" +
        quoteId;
      fetch(url)
        .then((res) => res.text())
        .then(async (body) => {
          const pdf = await convert(body.toString(), {
            format: "A4",
            margin: { top: 50, right: 50, left: 50, bottom: 50 },
          });
          res.send(pdf);
        });
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});

router.get("/order/:orderId", function (req, res) {
  var orderId = req.params.orderId;

  order.GetOrder(orderId, function (result) {
    // console.log(result)
    if (result && result.length > 0) {
      var taxAbleTotal = 0;
      var cc = JSON.parse(result[0].CreditCardAuthorizationHash);
      if (cc !== null) {
        var accountNo = cc.transactionResponse
          ? cc.transactionResponse.accountNumber
          : "";
        var accountType = cc.transactionResponse
          ? cc.transactionResponse.accountType
          : "";
      }
      var shippingId = result[0].ShippingMethodID;
      var shippingMethod;
      // try {
      //     taxAbleTotal = result.reduce((accum, item) => item.TaxableProduct.toLowerCase() === 'y' ? accum + (item.Qty * (item.Price - ((item.CurrentCustomerDiscount/100) * item.Price))): accum + 0, 0)
      // } catch (error) {
      //     console.log(error);
      // }
      if (shippingId > 0) {
        lookup.GetShippingMethhods(function (records) {
          let found = records.data.find((elem) => elem.id == shippingId);
          shippingMethod = "N/A";
          if (found) shippingMethod = found.name;
          res.render("pdf-order", {
            quote: result,
            taxAbleTotal,
            accountNo,
            accountType,
            shippingMethod,
            currency: req.app.get("currency"),
          });
          // for (var i = 0; i < records.data.length; i++) {
          //     if (records.data[i].id == shippingId) {
          //         shippingMethod = records.data[i].name
          //         res.render('pdf-order', {
          //             quote: result,
          //             taxAbleTotal,
          //             accountNo,
          //             accountType,
          //             shippingMethod,
          //             currency: req.app.get('currency'),
          //         });
          //     }
          // }
        });
      } else {
        res.render("pdf-order", {
          quote: result,
          taxAbleTotal,
          accountNo,
          accountType,
          shippingMethod,
          currency: req.app.get("currency"),
        });
      }
    } else res.send("error");
  });
});

router.get("/order-word/:orderId", function (req, res) {
  var orderId = req.params.orderId;

  order.GetOrder(orderId, function (result) {
    // console.log(result)
    if (result && result.length > 0) {
      var taxAbleTotal = 0;
      var cc = JSON.parse(result[0].CreditCardAuthorizationHash);
      if (cc !== null) {
        var accountNo = cc.transactionResponse
          ? cc.transactionResponse.accountNumber
          : "";
        var accountType = cc.transactionResponse
          ? cc.transactionResponse.accountType
          : "";
      }
      var shippingId = result[0].ShippingMethodID;
      var shippingMethod;
      // try {
      //     taxAbleTotal = result.reduce((accum, item) => item.TaxableProduct.toLowerCase() === 'y' ? accum + (item.Qty * (item.Price - ((item.CurrentCustomerDiscount/100) * item.Price))): accum + 0, 0)
      // } catch (error) {
      //     console.log(error);
      // }
      if (shippingId > 0) {
        lookup.GetShippingMethhods(function (records) {
          let found = records.data.find((elem) => elem.id == shippingId);
          shippingMethod = "N/A";
          if (found) shippingMethod = found.name;
          res.send({
            order: result,
            taxAbleTotal,
            accountNo,
            accountType,
            shippingMethod,
            currency: req.app.get("currency"),
          });

          // for (var i = 0; i < records.data.length; i++) {
          //     if (records.data[i].id == shippingId) {
          //         shippingMethod = records.data[i].name
          //         res.send({
          //             order: result,
          //             taxAbleTotal,
          //             accountNo,
          //             accountType,
          //             shippingMethod,
          //             currency: req.app.get('currency'),
          //         });
          //     }
          // }
        });
      } else {
        res.send({
          order: result,
          taxAbleTotal,
          accountNo,
          accountType,
          shippingMethod,
          currency: req.app.get("currency"),
        });
      }
      console.log("word-order");
    } else res.send("error");
  });
});

router.get("/packing-slip/:orderId", function (req, res) {
  var orderId = req.params.orderId;
  order.GetOrder(orderId, function (result) {
    if (result && result.length > 0)
      res.render("pdf-packing-slip", {
        quote: result,
      });
    else res.send("error");
  });
});
router.get("/packing-slip-shipping/:orderId/:shippingId", function (req, res) {
  var orderId = req.params.orderId;
  var shippingId = req.params.shippingId;
  order.GetTrackShipping(orderId,shippingId, function (result) {
    console.log(result)
    if (result && result.length > 0)
      res.render("pdf-packing-slip", {
        quote: result,
      });
    else res.send("error");
  });
});

router.get("/genrate-order-pdf/:orderId", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      var orderId = req.params.orderId;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-disposition", "inline;");
      if (orderId.indexOf("_") !== -1 && orderId.indexOf(".") !== -1)
        orderId = parseInt(req.params.orderId.split("_")[1].split(".")[0]);
      else orderId = -1;
      var opt = {
        url:
          utility.getProtocol(req) +
          utility.getBaseUrl(req) +
          "/order/" +
          orderId,
      };
      async function callback(error, result, body) {
        if (!error) {
          var dir = process.cwd() + "/admin-panel/files/orderPDF";
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          var fileName =
            process.cwd() + "/admin-panel/files/orderPDF/" + orderId + ".pdf";
          var callbackUrl =
            utility.getProtocol(req) +
            utility.getBaseUrl(req) +
            "/api/quote/driveCallback";
          const pdf = await convert(body.toString(), {
            format: "A4",
            margin: { top: 50, right: 50, left: 50, bottom: 50 },
          });
          fs.writeFileSync(fileName, pdf);
          if (!process.env.DEV_MODE)
            googleDrive.Uploadfile(
              ["1TD87Afe1D4c66izSdltxETBM6zSzBXOi"],
              "orderPDF",
              orderId,
              res,
              req,
              callbackUrl,
              function () {
                // out.stream.pipe(res);
              }
            );
          res.send(pdf);
        }
      }
      request(opt, callback);
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/genrate-packing-slip/:orderId", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      var orderId = req.params.orderId;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-disposition", "inline;");
      if (orderId.indexOf("_") !== -1 && orderId.indexOf(".") !== -1)
        orderId = parseInt(req.params.orderId.split("_")[1].split(".")[0]);
      else orderId = -1;
      var url =
        utility.getProtocol(req) +
        utility.getBaseUrl(req) +
        "/packing-slip/" +
        orderId;
      var opt = {
        url: url,
      };
      async function callback(error, result, body) {
        if (!error) {
          var dir = process.cwd() + "/admin-panel/files/packing-slip";
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          var fileName =
            process.cwd() +
            "/admin-panel/files/packing-slip/" +
            orderId +
            ".pdf";
          var callbackUrl =
            utility.getProtocol(req) +
            utility.getBaseUrl(req) +
            "/api/quote/driveCallback";
          const pdf = await convert(body.toString(), {
            format: "A4",
            margin: { top: 50, right: 50, left: 50, bottom: 50 },
          });
          fs.writeFileSync(fileName, pdf);
          if (!process.env.DEV_MODE) {
            googleDrive.Uploadfile(
              ["13gSgI0c-hGY9vMqCJvGZwcGhR86I0VB-"],
              "packing-slip",
              orderId,
              res,
              req,
              callbackUrl,
              function () {
                // out.stream.pipe(res);
              }
            );
          }
          res.send(pdf);
        }
      }
      request(opt, callback);
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});
router.get("/genrate-packing-slip-shipping", function (req, res) {
   utility.authenticateUser(req,res, () => {
     let orderId = req.query.orderId
     let shippingId = req.query.shippingId 
     shippingId = shippingId.split('.').slice(0, -1).join('.')

     console.log(shippingId)
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-disposition", "inline;");
      if (orderId.indexOf("_") !== -1)
      orderId = parseInt(orderId.split("_")[1]);
        else orderId = -1;
      console.log(orderId,)
      var url = utility.getProtocol(req) + utility.getBaseUrl(req) + "/packing-slip-shipping/" + orderId + "/" + shippingId;
      var opt = {
        url: url,
      };
      async function callback(error, result, body) {
        if (!error) {
          var dir = process.cwd() + "/admin-panel/files/packing-slip";
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          var fileName =
            process.cwd() +
            "/admin-panel/files/packing-slip/" +
            orderId +
            ".pdf";
          var callbackUrl =
            utility.getProtocol(req) +
            utility.getBaseUrl(req) +
            "/api/quote/driveCallback";
          const pdf = await convert(body.toString(), {
            format: "A4",
            margin: { top: 50, right: 50, left: 50, bottom: 50 },
          });
          fs.writeFileSync(fileName, pdf);
          if (!process.env.DEV_MODE) {
            googleDrive.Uploadfile(
              ["13gSgI0c-hGY9vMqCJvGZwcGhR86I0VB-"],
              "packing-slip",
              orderId,
              res,
              req,
              callbackUrl,
              function () {
                // out.stream.pipe(res);
              }
            );
          }
          res.send(pdf);
        }
      }
      request(opt, callback);
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});

router.get("/view-order/:orderId", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      var orderId = req.params.orderId;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-disposition", "inline;");
      if (orderId.indexOf("_") !== -1 && orderId.indexOf(".") !== -1)
        orderId = parseInt(req.params.orderId.split("_")[1].split(".")[0]);
      else orderId = -1;
      var url =
        utility.getProtocol(req) +
        utility.getBaseUrl(req) +
        "/order/" +
        orderId;

      var opt = {
        url:
          utility.getProtocol(req) +
          utility.getBaseUrl(req) +
          "/order/" +
          orderId,
      };

      async function callback(error, result, body) {
        if (!error) {
          var dir = process.cwd() + "/admin-panel/files/orderPDF";
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          var fileName =
            process.cwd() + "/admin-panel/files/orderPDF/" + orderId + ".pdf";
          const pdf = await convert(body.toString(), {
            format: "A4",
            margin: { top: 50, right: 50, left: 50, bottom: 50 },
          });
          fs.writeFileSync(fileName, pdf);
          res.send(pdf);
        }
      }
      request(opt, callback);
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});

router.get("/view-order-docs/:orderId", function (req, res) {
  utility.authenticateUser(
    req,
    res,
    () => {
      var orderId = req.params.orderId;
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingm"
      );
      res.setHeader("Content-disposition", "inline;");
      if (orderId.indexOf("_") !== -1 && orderId.indexOf(".") !== -1)
        orderId = parseInt(req.params.orderId.split("_")[1].split(".")[0]);
      else orderId = -1;
      var opt = {
        url:
          utility.getProtocol(req) +
          utility.getBaseUrl(req) +
          "/order-word/" +
          orderId,
      };

      async function callback(error, result, body) {
        if (!error) {
          var dir = process.cwd() + "/admin-panel/files/orderWord";
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          // var fileName = process.cwd() + '/admin-panel/files/packing-slip/' + orderId + '.pdf';
          // var callbackUrl = utility.getProtocol(req) + utility.getBaseUrl(req) + '/api/quote/driveCallback';
          // const documentCreator = new DocumentCreator();
          // const doc = documentCreator.create([experiences, education, skills, achievements]);
          console.log(body);
          const fileString = await GenerateDOC(body);
          fs.writeFile(
            dir + "/" + orderId + ".docx",
            fileString,
            (err, data) => {
              if (!err) {
                res.setHeader(
                  "Content-Disposition",
                  "attachment; filename=My Document.docx"
                );
                res.download(dir + "/" + orderId + ".docx");
              } else {
                console.log(err);
                res.send("Word Error: " + err);
              }
            }
          );
        }
      }
      request(opt, callback);
    },
    () => {
      res.redirect(`/login?next=${req.url}`);
    }
  );
});

router.get("/drive-call-back-db-backup", function (req, res) {
  var code = req.query.code;
  var callbackUrl =
    utility.getProtocol(req) +
    utility.getBaseUrl(req) +
    "api/quote/driveCallback";
  googleDrive.retrieveNewToken(code, callbackUrl, function () {
    res.send({
      status: true,
    });
  });
});

// Return router
module.exports = router;
