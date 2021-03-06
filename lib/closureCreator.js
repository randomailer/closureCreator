var fs = require('fs'),
    path = require('path');

/**
 *
 * @param className
 * @param opt_destination
 */
function ojsterTemplateCreator (className, opt_destination) {
    className = className || 'templateName';
    opt_destination = opt_destination || process.cwd();

    var name = generateFileName(className.match(/\w+$/)[0]) + '.ojst';
	var templatePath = path.join(opt_destination, name);

    var resultStr= '<% @require ojster %>\n\n' +
        '<% @template ' + className + ' %>\n' +

        '<% @inherits ojster.Template %>\n\n\n' +

        '<% @block main { %>\n\n' +
        '<% @block main } %>';

	fs.exists(templatePath, function (exists) {
		if (exists) {
			return;
		}

		fs.writeFile(templatePath, resultStr, function (err) {
			if (err) {
				throw err;
			}
			console.log('Template generated');
		});
	});

}

/**
 *
 * @param {Object} params
 */
function create (params) {
	if (!params.className) {
		console.log('params className is required');
		return;
	}

    var TEMPLATES = 'templates';
	var extendsClass = params.extends || 'goog.ui.Component';
	var className = params.className;
    var resultStr = "goog.provide('" + className + "');\n\n";
    var ctrName = className.match(/\w+$/)[0];
    var templatePath;
    var templateClassName;
	var createDomFuncBody = '';
    var destination = path.normalize(params.destination || process.cwd());
	var scriptPath = path.join(destination, generateFileName(ctrName) + '.js');

    if (params.withTemplate) {
        templatePath = path.join(destination, TEMPLATES);
		templatePath = templatePath.toLowerCase();
		templateClassName =
			className.substr(0, className.indexOf(ctrName)) +
			ctrName.charAt(0).toLowerCase() + ctrName.slice(1) +
			'.' + TEMPLATES + '.' + ctrName;

		createDomFuncBody = '\t/** @type {ojster.Template} */\n' +
			'\tvar template = new ' + templateClassName + '();\n' +
			'\t/** @type {Element} */\n' +
			'\tvar element = ojster.createElement(template);\n' +
			'\tthis.setElementInternal(element);';

		fs.mkdir(templatePath, function (err) {
			ojsterTemplateCreator(
				templateClassName,
				templatePath
			);
		});


		resultStr += getRequireStr(templateClassName);
    }

	if (params.onlyTemplate) {
		return;
	}

    resultStr += getRequireStr(extendsClass);
	if (params.withTemplate) {
		resultStr += getRequireStr('ojster');
	}

	resultStr += '\n\n' +
		'/**\n' +
		' *\n' +
		' * @constructor\n' +
		' * @extends {' + extendsClass + '}\n' +
		' **/\n' +
		className + ' = function () {\n' +
		'\tgoog.base(this);\n' +
		'};\n' +
		'goog.inherits(' + className + ', ' + extendsClass + ');' +
		'\n' +
		'\n' +
		generateMethodStr(className, 'createDom', createDomFuncBody) + '\n\n' +
		generateMethodStr(className, 'enterDocument', "\tgoog.base(this, 'enterDocument');") + '\n\n' +
		'/**\n' +
		' *\n' +
		' * @inheritDoc\n' +
		' */\n' +
		generateMethodStr(className, 'disposeInternal', "\tgoog.base(this, 'disposeInternal');") + '\n\n';

	fs.exists(scriptPath, function (exists) {
		if (exists) {
			return;
		}

		fs.writeFile(scriptPath, resultStr, function (err) {
			if (err) {
				throw err;
			}

			console.log(className + ' generated');
		});
	});

}

/**
 *
 * @param className
 * @return {string}
 */
function getRequireStr (className) {
    return "goog.require('" + className + "');\n";
}

/**
 *
 * @param {string} className
 * @param {string} method
 * @param {string=} opt_bodyFunction
 * @return {string}
 */
function generateMethodStr (className, method, opt_bodyFunction) {
	return className + '.prototype.' + method + ' = function () {\n' +
		(opt_bodyFunction || '') + '\n' +
		'};';
}

function generateFileName (fileName) {
	var resultStr = fileName.replace(/[A-Z]/g, function (subStr) {
		return '_' + subStr.toLowerCase();
	});

	return resultStr.slice(1);
}

var closureCreator = {
	create: create
};

exports.closureCreator = closureCreator;

