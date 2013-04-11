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

    var name = (className.match(/\w+$/)[0] + '.ojst').toLowerCase();

    var resultStr= '<% @require ojster %>\n\n' +
        '<% @template ' + className + ' %>\n' +

        '<% @inherits ojster.Template %>\n\n\n' +

        '<% @block main { %>\n\n' +
        '<% @block main } %>';

    fs.writeFile(path.join(opt_destination, name), resultStr, function (err) {
        if (err) {
            throw err;
        }
        console.log('Template generated');
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

    if (params.withTemplate) {
        templatePath = path.join(destination, TEMPLATES);
		templatePath = templatePath.toLowerCase();
		templateClassName = className.toLowerCase() + '.templates.' + ctrName;

		createDomFuncBody = '\t/** @type {ojster.Template} */\n' +
			'\tvar template = new ' + templateClassName + '();\n' +
			'\t/** @type {Element} */\n' +
			'\tvar element = ojster.createElement(template);\n' +
			'\tthis.setElementInternal(element);';

		fs.mkdir(templatePath, function (err) {
			ojsterTemplateCreator(
				className.toLowerCase() + '.' + TEMPLATES + '.' + ctrName,
				templatePath
			);
		});


		resultStr += getRequireStr(templateClassName);
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
		'\tgoog.base(this)\n' +
		'};\n' +
		'goog.inherits(' + className + ', ' + extendsClass + ');' +
		'\n' +
		'\n' +
		generateMethodStr(className, 'createDom', createDomFuncBody) + '\n\n' +
		generateMethodStr(className, 'enterDocument', "\tgoog.base(this, 'enterDocument')") + '\n\n' +
		generateMethodStr(className, 'disposeInternal', "\tgoog.base(this, 'disposeInternal')") + '\n\n';

	fs.writeFile(path.join(destination, ctrName.toLowerCase() + '.js'), resultStr, function (err) {
		if (err) {
			throw err;
		}

		console.log(className + ' generated');
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

var closureCreator = {
	create: create
};

exports.closureCreator = closureCreator;
