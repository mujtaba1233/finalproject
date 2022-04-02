var Mysql = require("../helpers/database-manager");
const { slack } = require("../helpers/slack-helper");

exports.Get = function (callback) {
  var query = "select * from option_categories order by id desc;";
  Mysql.query(query)
    .then(function (results) {
      if (results.length > 0) {
        callback({ status: true, msg: "Categories Fetched", result: results });
      } else {
        slack(
          `File: category.js, \nAction: Get, \nError Categories Not Found \n 
			`,
          "J.A.R.V.I.S",
          "C029PF7DLKE"
        );
        callback({ status: true, msg: "Categories Not Found", result: [] });
      }
    })
    .catch(function (err) {
      error = JSON.stringify(err.message);
      slack(
        `File: category.js, \nAction: Get, \nError ${error} \n 
			`,
        "J.A.R.V.I.S",
        "C029PF7DLKE"
      );
      callback({ status: false, msg: err.message, result: [] });
    });
};

exports.Save = async function (data, callback) {
  try {
    delete data.isActive;
    data.lastModified = new Date();
    const results = await Mysql.insertUpdate("option_categories", data, data);
    console.log(results);
    return {
      status: true,
      msg: "Category Saved",
      result: results,
    };
  } catch (error) {
    err = JSON.stringify(error);
    slack(
      `File: option-category.js, \nAction: Save, \nError ${err.message} \n 
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
    const response = Mysql.delete("option_categories", { id: id });
    return { status: true, msg: "Category Deleted.", result: response };
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
