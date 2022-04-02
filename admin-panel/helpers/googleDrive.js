var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var utills = require('../helpers/utilities');

var SCOPES = ['https://www.googleapis.com/auth/drive'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

exports.Uploadfile = function (folder, localFolder, quoteId, routerResponse, req, callbackUrl, callback) {
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log(new Date(), 'Error loading client secret file: ', err);
      return;
    }
    authorize(JSON.parse(content), routerResponse, quoteId, callbackUrl, function (auth) {
      uploadFiles(folder, localFolder, auth, quoteId, routerResponse, req, callback);
    });
  });
};

exports.UploadFileWithCode = function (quoteId, code) {
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log(new Date(), 'Error loading client secret file: ', err);
      return;
    }
    authorize(JSON.parse(content), routerResponse, callbackUrl, function (auth) {
      uploadFiles(auth, quoteId, callback);
    });
  });
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, routerResponse, quoteId, callbackUrl, callback) {
  var clientSecret = credentials.web.client_secret;
  var clientId = credentials.web.client_id;
  var redirectUrl = callbackUrl;
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function (err, token) {
    if (err) {
      getNewToken(oauth2Client, routerResponse, quoteId, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, routerResponse, quoteId, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state: quoteId
  });
  // routerResponse.redirect(authUrl);
  // callback(oauth2Client)
}

exports.retrieveNewToken = function (code, callbackUrl, callback) {
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log(new Date(), 'Error loading client secret file: ', err);
      return;
    }

    var credentials = JSON.parse(content);

    var clientSecret = credentials.web.client_secret;
    var clientId = credentials.web.client_id;
    var redirectUrl = callbackUrl;
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        console.log(new Date(), 'Error while trying to retrieve access token', err);
        callback();
      }
      oauth2Client.credentials = token;
      storeToken(token, callback);
    });

  });

}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token, callback) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
  callback();
}


function uploadFiles(folder, localFolder, auth, quoteId, routerResponse, req, callback) {
  var drive = google.drive({ version: 'v3', auth: auth });
  var d = new Date();
  console.log(quoteId, "quoteId");
  if (quoteId > 200000) {
    var pdfname = 'Order_';
  } else {
    var pdfname = '';
  }
  pdfname = pdfname +
    d.getFullYear() +
    ("0" + (d.getMonth() + 1)).slice(-2) +
    ("0" + d.getDate()).slice(-2) + "_" +
    ("00000" + quoteId.toString()).slice(-6);
  drive.files.create({
    resource: {
      name: pdfname + '.pdf',
      mimeType: 'application/pdf',
      parents: folder || ['1VcSwG8zniX1xpl3HPWBTQgxMUnx-_dzy']
    },
    media: {
      mimeType: 'application/pdf',
      body: fs.createReadStream('./admin-panel/files/' + localFolder + '/' + quoteId + '.pdf') // read streams are awesome!
    }
  }, function (err, response) {
    if (err) {
      console.log(new Date(), err);
      // if(err == 'Error: invalid_request'){
      //   fs.unlink(TOKEN_PATH, (err) => {
      //       console.log(new Date(), 'unlinking...');
      //       if (err) throw err;
      //       console.log(new Date(), 'unlinked without error');
      //       var url  = utills.getProtocol() + utills.getBaseUrl(req) + '/GeneratePDF/' + quoteId;
      //       routerResponse.redirect(url);
      //   });
      // }
      // callback();
    }
    callback();
  });
}
