var fs = require('fs');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var request = require('request');

var SCOPES = ['https://www.googleapis.com/auth/drive'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

var Uploadfile = function (folder, quoteId, callbackUrl, callback) {
    // console.log('uploadFile',folder, quoteId, callbackUrl);
    fs.readFile('/var/www/intrepidcs/client_secret.json', function processClientSecrets(err, content) {

        if (err) {
            console.log('Error loading client secret file: ', err);
            return;
        }
        let cred = {}
        cred.installed = JSON.parse(content)
        authorize(cred, quoteId, callbackUrl, function (auth) {
            uploadFiles(folder, auth, quoteId, callback);
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
function authorize(credentials, quoteId, callbackUrl, callback) {
    // console.log('authorize',credentials, quoteId, callbackUrl);
    var clientSecret = credentials.installed.web.client_secret;
    var clientId = credentials.installed.web.client_id;
    var redirectUrl = callbackUrl;
    var auth = new googleAuth();
    // console.log(clientSecret,clientId,redirectUrl,credentials.installed.web.client_secret);
    
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            console.log('while geting token err',err);
            getNewToken(oauth2Client, quoteId, callback);
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
function getNewToken(oauth2Client, quoteId, callback) {
    // console.log('getNewToken',oauth2Client, quoteId);
    
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        state: quoteId
    });
    var opt = {
        url: authUrl
    };
    var callback = function(error, result, body){
        // console.log('error------------',error,'result-------------',result,'body-------------',body);
        
    }
    request(opt, callback)
    // routerResponse.redirect(authUrl);
}

exports.retrieveNewToken = function (code, callbackUrl, callback) {
    fs.readFile('/var/www/intrepidcs/client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            // console.log('Error loading client secret file: ', err);
            return;
        }
        var credentials = {}
        credentials.installed = JSON.parse(content);

        var clientSecret = credentials.installed.web.client_secret;
        var clientId = credentials.installed.web.client_id;
        var redirectUrl = callbackUrl;
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        oauth2Client.getToken(code, function (err, token) {
            if (err) {
                // console.log('Error while trying to retrieve access token', err);
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


function uploadFiles(folder, auth, file, callback) {
    // console.log('uploadFiles',folder, auth, file);
    
    var drive = google.drive({
        version: 'v3',
        auth: auth
    });
    var d = new Date();
    var fileName = d.getFullYear() +
        ("0" + (d.getMonth() + 1)).slice(-2) +
        ("0" + d.getDate()).slice(-2) + "_" + file.toString();
    drive.files.create({
        resource: {
            name: fileName + '.sql',
            mimeType: 'application/sql',
            parents: folder
        },
        media: {
            mimeType: 'application/sql',
            body: fs.createReadStream('/home/webdev/dev_db_backup/' + file + '.sql') // read str$
        }
    }, function (err, response) {
        if (err) {
            console.log(err);
        }
        callback();
    });
}

var callbackUrl = 'https://bluesky.intrepidcs.net/api/quote/driveCallback';
Uploadfile(['1Z5ssJvadJVANpoSgh3mRBYB_aywusuMM'], 'intrepidcs_backup', callbackUrl, function () {
    // out.stream.pipe(response);
    console.log("done");

});
