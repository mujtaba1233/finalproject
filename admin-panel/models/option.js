var Mysql = require("../helpers/database-manager");
const { slack } = require("../helpers/slack-helper");

exports.Get = async function (id) {
  try {
    var query =
      "select * from options where optionCatId = " + id + " order by id desc;";
    const results = await Mysql.query(query);
    if (results.length > 0) {
      return { status: true, msg: "Categories Fetched", result: results };
    } else {
      return { status: true, msg: "Categories Not Found", result: [] };
    }
  } catch (err) {
    error = JSON.stringify(err.message);
    slack(
      `File: category.js, \nAction: Get, \nError ${error} \n 
		`,
      "J.A.R.V.I.S",
      "C029PF7DLKE"
    );
    return { status: false, msg: err.message, result: [] };
  }
};

exports.Save = async function (data, callback) {
  try {
    const results = await Mysql.insertUpdate("options", data, data);
    console.log(results);
    return {
      status: true,
      msg: "Option Saved",
      result: results,
    };
  } catch (error) {
    err = JSON.stringify(error);
    slack(
      `File: option.js, \nAction: Save, \nError ${err.message} \n 
				`,
      "J.A.R.V.I.S",
      "C029PF7DLKE"
    );
    console.log("*+*+*+*+**+*+*", error);
    return {
      status: false,
      msg: "error: " + error.message,
    };
  }
};

exports.delete = function (id, callback) {
  try {
    const response = Mysql.delete("options", { id: id });
    return {
      status: true,
      msg: "Option Successfully Deleted.",
      result: response,
    };
  } catch (error) {
    err = JSON.stringify(error.message);
    slack(
      `File: inventory-detail.js, \nAction: delete, \nError ${err} \n 
			`,
      "J.A.R.V.I.S",
      "C029PF7DLKE"
    );
    console.log(
      new Date(),
      "Error deleting record, mysql error:",
      error.message
    );
    return { status: false, msg: error.message };
  }
};
