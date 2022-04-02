//Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
require('dotenv').config()
var compression = require('compression')
var utility = require('./admin-panel/helpers/utilities');
// console.log(process.env.BASE_URL);
require('./scripts/cron')();

// use it before all route definitions
//PORT
var PORT = "3004";

// Express
const app = express();
app.use(compression());
app.set("currency", utility.currencySymbol("USD"));
// Middleware
var busboy = require("connect-busboy");
const { slack } = require("./admin-panel/helpers/slack-helper");
const { PM2_LOGS } = require("./admin-panel/helpers/constants");
app.use(busboy());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
console.log(new Date(), "Allowed Store URL", process.env.STORE_URL);

// app.use(cors({ origin: process.env.STORE_URL }));
app.use((req, res, next) => {
    // if (req.headers.origin)
    //     console.log('Origin: ', req.headers.origin);
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Strict-Transport-Security', 'max-age=63072000');
    res.header('X-Frame-Options', 'SAMEORIGIN');
    res.header('Referrer-Policy', 'no-referrer');
    res.header('X-XSS-Protection', '1; mode=block');

    res.header('Access-Control-Allow-X-Content-Type-Options', 'nosniff');
    // if ('OPTIONS' == req.method) {
    //   res.send(200);
    // }
    // else {
    next();
});
// Routes
app.use("/api/external", require("./admin-panel/controllers/external-app"));
app.use("/api/quote", require("./admin-panel/controllers/quotes"));
app.use("/api/customer", require("./admin-panel/controllers/customers"));
app.use("/api/end-user", require("./admin-panel/controllers/end-user"));
app.use("/api/product", require("./admin-panel/controllers/products"));
app.use("/api/rma", require("./admin-panel/controllers/RMA"));
app.use("/api/order", require("./admin-panel/controllers/orders"));
app.use(
	"/api/query-builder",
	require("./admin-panel/controllers/query-builder")
);
app.use("/api/user", require("./admin-panel/controllers/users"));
app.use("/api/report", require("./admin-panel/controllers/reports"));
app.use("/api/dashboard", require("./admin-panel/controllers/dashboard"));
app.use("/api/profile", require("./admin-panel/controllers/profile"));
app.use("/api/lookup", require("./admin-panel/controllers/lookup"));
app.use("/api/inventory", require("./admin-panel/controllers/inventory"));
app.use(
	"/api/inventory-detail",
	require("./admin-panel/controllers/inventory-detail")
);
app.use("/api/image", require("./admin-panel/controllers/images"));
app.use("/api/file", require("./admin-panel/controllers/files"));
app.use("/api/category", require("./admin-panel/controllers/category"));
app.use("/api/option", require("./admin-panel/controllers/option"));
app.use(
	"/api/option-category",
	require("./admin-panel/controllers/option-category")
);
app.use("/api/package-box", require("./admin-panel/controllers/packaging-box"));
app.use(
	"/api/tax-exemption",
	require("./admin-panel/controllers/tax-exemptions")
);
app.use("/api/settings", require("./admin-panel/controllers/settings"));
app.use("/api/payment", require("./admin-panel/controllers/payment"));
app.use("/api/dhl", require("./admin-panel/controllers/dhl"));
app.use("/api/packaging", require("./admin-panel/controllers/packaging"));
app.use("/api/blue-sky", require("./admin-panel/controllers/front-store"));
app.use("/api/*", function (req, res) {
	res.send({ status: 404, message: "API not found" });
});

// app.use(express.static(path.join(__dirname ,'/front-store/client/build/')));
// console.log(path.join(__dirname ,'/front-store/client/build/'));

app.use("/", require("./admin-panel/controllers/routes"));
// app.use('/store', require('./front-store/server/routes'));

// Static Dir
// app.use(express.static(__dirname + '/admin-panel/client/'));
app.use("/angular", express.static(__dirname + "/admin-panel/client/angular"));
app.use("/files", express.static(__dirname + "/uploads"));
app.use("/bs-files", express.static(__dirname + "/uploads/desc-files"));
app.use("/css", express.static(__dirname + "/admin-panel/client/css"));
app.use("/images", express.static(__dirname + "/admin-panel/client/images"));
app.use(
	"/bower",
	express.static(__dirname + "/admin-panel/client/bower_components")
);
app.use("/template", express.static(__dirname + "/admin-panel/views"));
app.use(
	"/quote-pdf",
	express.static(__dirname + "/admin-panel/files/quotePDF")
);
app.use("/excel", express.static(__dirname + "/admin-panel/files/excel"));
app.use("/static", express.static(__dirname + "/external-app/build/static"));
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render("error", {
		message: err.message,
		error: err,
	});
});
app.use(function (req, res) {
	res.render("404");
});

// Templeting engine
app.set("views", __dirname + "/admin-panel/views");
app.set("view engine", "ejs");
// utility.errorReport('Server Restart', 'PM2', PM2_LOGS)
slack("Server Restart", "PM2", PM2_LOGS);
// Start Server
app.listen(PORT, function () {
	console.log("Server started on port " + PORT);
	if (!process.env.DEV_MODE && process.env.ENV_MODE === "PRODUCTION") {
		console.log("Production Envirment");
	} else if (!process.env.DEV_MODE && process.env.ENV_MODE === "STAGGING") {
		console.log("Statgging Envirment");
	} else {
		console.log("Dev Mode");
	}
});
