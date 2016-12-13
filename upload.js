// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var http = require('http');
var options = require('./secrets.json');


const APP_ID = options.app_id
const TOKEN = options.token;
const CLIENT_ID = options.client_id;
const FILENAME = options.filename;
const CODE = options.code;
const CLIENT_SECRET = options.client_secret;

var tokenRequest = 'curl "https://accounts.google.com/o/oauth2/token?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&code=' + CODE;
var extensionUpload = 'curl -H "Authorization: Bearer ' + TOKEN + '" -H "x-goog-api-version: 2" -X PUT -T ' + FILENAME + ' -v https://www.googleapis.com/upload/chromewebstore/v1.1/items/' + APP_ID;

console.log('https://accounts.google.com/o/oauth2/token?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&code=' + CODE);

http.get({
	host: 'accounts.google.com',
	path: '/o/oauth2/token?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&code=' + CODE,
}, function (res) {
	console.log(res.body);
});