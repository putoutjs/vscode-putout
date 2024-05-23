// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const tryCatch = require('try-catch');
const putout = require('putout');
const parseOptions = require('putout/parse-options');

const {Range, commands, window} = vscode;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = commands.registerCommand('vs-code-putout.putout', function () {

	const editor = window.activeTextEditor;

	if (!editor)
		return;

	const document = editor.document;
	const source = document.getText();
	const start = document.positionAt(0);
	const end = document.positionAt(source.length);
	const selection = new vscode.Range(start, end);

	const options = parseOptions({
		name: document.fileName,
	});

	const [error, result]= tryCatch(putout, source, options);

	if (error)
		return vscode.window.showInformationMessage(error.message);

	const {code} = result;

	editor.edit(editBuilder => {
		editBuilder.replace(selection, code);
	});

		vscode.window.showInformationMessage('🐊Putout Linter');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
