var path = require("path");
var fs = require("fs");
var libxmljs = require("libxmljs");
var swig = require("swig");
var childProcess = require("child_process");
var phantomjs = require("phantomjs");
var phantomBinPath = phantomjs.path;
var _ = require("underscore");

var resumeXml = fs.readFileSync("resume.xml");
var resume = readResume(resumeXml);
console.log("RESUME %j", resume);

var html = swig.renderFile("template.html", resume);
console.log(html);

fs.writeFileSync("resume.html", html);

var phantomArgs = [
	path.join(__dirname, "rasterize.js"),
	"resume.html",
	"resume.pdf",
	"A4"
];
childProcess.execFile(phantomBinPath, phantomArgs, function(err, stdout, stderr) {
	console.log("OK");
});

function readResume(resumeXml) {	
	var xmlDoc = libxmljs.parseXml(resumeXml);

	var personNode = xmlDoc.get("/resume/person");
	var name = personNode.get("name").text();
	var position = personNode.get("position").text();
	var statement = personNode.get("statement").text();

	var highlights = _.map(xmlDoc.find("/resume/highlights/highlight"), function(node) {
		return node.text();
	});

	var projects = _.map(xmlDoc.find("/resume/projects/project"), function(node) {
		return {
			"name": node.get("name").text(),
			"time": node.get("time").text(),
			"url": (function() {
				var url = node.get("url");
				return url && url.text();
			})(),
			"sourceUrl": (function() {
				var sourceUrl = node.get("source-url");
				return sourceUrl && sourceUrl.text();
			})(),
			"description": node.get("description").text(),
			"keywords": node.get("keywords").text(),
			"responsibilities": _.map(node.find("responsibilities/responsibility"), function(node) {
				return node.text();
			})
		};
	});

	return {
		"name": name,
		"position": position,
		"statement": statement,
		"highlights": highlights,
		"projects": projects
	};
};
