var express = require("express");
var router = express.Router();
var model = require("../models/option-category");
const {
	slack
} = require("../helpers/slack-helper");
var uttils = require("../helpers/utilities");

router.get("/", function (req, res, next) {
	uttils.authenticateUser(
		req,
		res,
		() => {
			model.Get(function (response) {
				res.send(response);
			});
		},
		() => {
			res.send("Unathorized access");
		}
	);
});
router.post("/", function (req, res, next) {
	uttils.authenticateUser(
		req,
		res,
		async () => {
				var data = req.body;
				const response = await model.Save(data)

				res.send(response);
			},
			() => {
				res.send("Unathorized access");
			}
	);
});


router.delete('/', function (req, res, next) {
	var id = req.body.id;
	uttils.authenticateUser(req,res,
		async () => {
			const result = await model.delete(id)
			res.send(result);
			() => {
				res.send("Unathorized access");
			}
		});

})
module.exports = router;
