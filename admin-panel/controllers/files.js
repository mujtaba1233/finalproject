var express = require('express');
var router = express.Router();
var model = require('../models/product-detail');
var fileModel = require('../models/file');
const utility = require('../helpers/utilities')
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path')
const unzip = require('unzip')
const XLSX = require('xlsx-style');
const { slack } = require('../helpers/slack-helper');

router.delete('/', function (req, res, next) {
	fs.unlink("./uploads/pdfs/" + req.body.URL, function (err) {
		if (err && err.message.indexOf('no such file or directory') === -1) {
			console.log(new Date(), err);
			error = JSON.stringify(err.message)
			slack(`File: files.js, \nAction: delete, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			res.send({
				status: false,
				msg: err.message
			})
		} else {
			model.remove(req.body, function (result) {
				res.send(result);
			});
		}
	});
});
router.post('/', function (req, res, next) {
	var date = new Date()
	var pdfData = []
	req.busboy.on('field', function (fieldName, fieldValue, valTruncated, keyTruncated) {
		pdfData = JSON.parse(fieldValue);
	});
	req.busboy.on('file', function (fieldName, file, fileName) {
		var d = date.getTime();
		fileName = d + "-" + fileName;
		pathName = "./uploads/pdfs/" + fileName;
		var fstream = fs.createWriteStream(pathName);
		file.pipe(fstream);
		fstream.on('close', function () { });
	});
	req.busboy.on('finish', function () {
		model.Save(pdfData, date.getTime(), function (response) {
			res.send(response)
		});
	});
	req.pipe(req.busboy);
});
router.post('/file', function (req, res, next) {
	var date = new Date()
	var pdfData = []
	var dir = ''
	var mkDir = false;
	req.busboy.on('field', function (fieldName, fieldValue, valTruncated, keyTruncated) {
		pdfData = JSON.parse(fieldValue);
	});
	req.busboy.on('file', function (fieldName, file, fileName) {
		var d = date.getTime();
		//excel directory createion
		// console.log(path.join(__dirname,'/../files/excel'))
		dir = __dirname + '/../files/excel';
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}

		//new folder every time for excel save.
		dir = dir + '/' + d;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}

		pathName = dir + '/' + fileName;
		var fstream = fs.createWriteStream(pathName);
		file.pipe(fstream);
		fstream.on('close', function () {
			if (fileName && fileName.split('.').pop() === 'zip') {
				fs.createReadStream(`${dir}/${fileName}`).pipe(unzip.Parse()).on('entry', function (entry) {
					var imageName = entry.path;
					var type = entry.type; // 'Directory' or 'File'
					// var size = entry.size;
					if (type === 'File' && imageName.split('.').pop() === 'png') {
						if (!mkDir && !fs.existsSync(`${dir}/images`)) {
							fs.mkdirSync(`${dir}/images`);
						}
						if (mkDir) {
							entry.pipe(fs.createWriteStream(`${dir}/${imageName}`));
						} else {
							entry.pipe(fs.createWriteStream(`${dir}/images/${imageName}`));
						}
					} else if (type === 'Directory') {
						if (!fs.existsSync(`${dir}/${imageName}`)) {
							fs.mkdirSync(`${dir}/${imageName}`);
						}
						mkDir = true;
					} else {
						entry.autodrain();
					}
					fs.unlink(`${dir}/${fileName}`, function () { });
				});
			}
		});
	});
	req.busboy.on('finish', function () {
		fileModel.Save(pdfData, date, function (response) {
			if (response.status) {
				var sheetCount = 0;
				var TotalSheetCount = 0;
				response.result.forEach(elem => {
					var workbook = XLSX.readFile(path.join(__dirname + '/../files/excel/' + elem.FileURL), {
						cellStyles: true
					});
					var index = 0;
					TotalSheetCount = TotalSheetCount + workbook.SheetNames.length;
					for (const key in workbook.Sheets) {
						index = index + 1;
						var data = {
							DisplayOrder: index,
							SheetName: key,
							FileID: elem.FileID,
							SheetData: JSON.stringify(processDataFromCSV(XLSX.utils.sheet_to_csv(workbook.Sheets[key]), workbook.Sheets[key]['!merges'], processStyle(workbook.Sheets[key]), elem.FileURL)),
						}
						fileModel.saveSheet(data, function (sheetRes) {
							sheetCount = sheetCount + 1;
							if (sheetCount === TotalSheetCount) {
								res.send(response)
							}
						})
					}
				});
			} else {
				fsExtra.remove(dir, function (err) {
					res.send(response)
				});
			}
		});
	});
	req.pipe(req.busboy);
});
router.get('/file/:tableName', function (req, res, next) {
	utility.authenticateUser(req,res, () => {
		fileModel.getFiles(req.params, function (response) {
			res.send(response)
		})
	}, () => {
		res.send('Unathorized access')
	})
})

router.get('/file/sheets-details/:id', function (req, res, next) {
	utility.authenticateUser(req,res, () => {
		fileModel.getSheetsDetails(req.params, function (response) {
			var sheets = []
			response.result.forEach(elem => {
				sheets.push({
					paneId: elem.SheetName.replace(/ /g, '').toLowerCase(),
					title: elem.SheetName,
					active: false,
					disabled: false,
				})
			})
			response.result = sheets;
			res.send(response)
		})
	}, () => {
		res.send('Unathorized access')
	})
})

router.get('/file/sheets-data/:id', function (req, res, next) {
	utility.authenticateUser(req,res, () => {
		fileModel.getSheetsData(req.params, function (response) {
			var sheets = []
			response.result.forEach(elem => {
				sheets.push(JSON.parse(elem.SheetData))
			})
			response.result = sheets;
			res.send(response)
		})
	}, () => {
		res.send('Unathorized access')
	})

})

router.delete('/file/:folder', function (req, res, next) {
	// fs.unlink(`${__dirname}/../files/excel/` + req.body.FileURL, function (err) {
	// });
	var path = `${__dirname}/../../uploads/${req.params.folder}/${req.body.FileURL.split('/').pop()}`;
	if (req.params.folder === 'excel') {
		path = `${__dirname}/../files/excel/${req.params.folder}/${req.body.FileURL.split('/')[0]}`;
	}
	fsExtra.remove(`${path}`, function (err) {
		if (err && err.message.indexOf('no such file or directory') === -1) {
			console.log(new Date(), err);
			res.send({
				status: false,
				msg: err.message
			})
		} else {
			fileModel.remove(req.body, function (result) {
				res.send(result);
			});
		}
	});
});

var processDataFromCSV = function (allText, merges, styles, fileUrl) {
	// split content based on new line
	var allTextLines = allText.split(/\r\n|\n/);
	var headers = allTextLines[0].split(',');
	var lines = [];

	for (var r = 0; r < allTextLines.length; r++) {
		// split content based on comma
		var data = allTextLines[r].split(',');
		if (data.length == headers.length) {
			var col = [];
			for (var c = 0; c < headers.length; c++) {
				var cellStyle = styles[XLSX.utils.encode_cell({
					c: c,
					r: r
				})]
				var cell = {
					d: data[c]
				}
				if (cellStyle) {
					if (cellStyle.border) {
						if (cellStyle.border.left)
							cell.bl = 1 // Is Left Border
						if (cellStyle.border.right)
							cell.br = 1 // Is Right Border
						if (cellStyle.border.top)
							cell.bt = 1 // Is Top Border
						if (cellStyle.border.bottom)
							cell.bb = 1 // Is Bottom Border
					}
					if (cellStyle.font.bold)
						cell.b = 1 //Is Bold
					if (cellStyle.font.sz)
						cell.fs = `${(parseInt(cellStyle.font.sz) + 3)}px`
				}
				if (cell.d.includes('.png')) {
					cell.i = 1; //is Image
					cell.d = `${fileUrl.split('/')[0]}/images/${cell.d}`
				}
				if (merges)
					merges.forEach(function (elem) {
						if (elem.s.r === r && elem.s.c === c) {
							cell.rs = elem.e.r - elem.s.r + 1 //row span
							cell.cs = elem.e.c - elem.s.c + 1 //col span
						}
						if (((r <= elem.e.r && r >= elem.s.r) && (c <= elem.e.c && c > elem.s.c)) || ((r <= elem.e.r && r > elem.s.r) && (c <= elem.e.c && c >= elem.s.c))) {
							cell = {
								d: '',
								s: 1
							} // Is Skip
						}
					})
				col.push(cell);
			}
			lines.push(col);
		}
	}
	return lines;
};

var processStyle = function (sheet) {
	var worksheet = {}
	for (z in sheet) {
		if (z[0] === '!') continue;
		worksheet[z] = sheet[z].s
	}
	return worksheet;
}
router.post('/desc-file', function (req, res, next) {
	// req.pipe(req.busboy);
	var url = utility.getFullUrl(req)
	console.log(url);

	var date = new Date().getTime();
	var insertData = [];
	req.busboy.on('field', function (fieldName, fieldValue, valTruncated, keyTruncated) {
		insertData = JSON.parse(fieldValue);
	});

	req.busboy.on('file', function (fieldName, file, fileName) {
		var dir = './uploads/desc-files';
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		file_path = `${__dirname}/../../uploads/desc-files/${date}-${fileName}`
		var fstream = fs.createWriteStream(file_path);
		file.pipe(fstream);
	});

	req.busboy.on('finish', function () {
		fileModel.SaveDescFile(insertData, url, date, function (response) {
			res.send(response);
		});
	});
	req.pipe(req.busboy);
});

module.exports = router;