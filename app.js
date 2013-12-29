var path = require("path");
var fs = require("fs");
var swig = require("swig");
var childProcess = require("child_process");
var phantomjs = require("phantomjs");
var phantomBinPath = phantomjs.path;
var _ = require("underscore");

var cvJson = fs.readFileSync("cv.json");
var cv = JSON.parse(cvJson);
console.log("CV %j", cv);

var html = swig.renderFile("cv.template", cv);
console.log(html);

fs.writeFileSync("cv.html", html);

var phantomArgs = [
	path.join(__dirname, "rasterize.js"),
	"cv.html",
	"cv.pdf",
	"A4"
];
childProcess.execFile(phantomBinPath, phantomArgs, function(err, stdout, stderr) {
	console.log("OK");
});
