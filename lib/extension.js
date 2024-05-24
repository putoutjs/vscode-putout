'use strict';

const {commands} = require('vscode');
const {commandFix} = require('./commands/command-fix');
const noop = () => {};

module.exports.deactivate = noop;
/**
 * @param {vscode.ExtensionContext} context
 */
module.exports.activate = (context) => {
    const disposable = commands.registerCommand('vs-code-putout.putout.fix', commandFix);
    context.subscriptions.push(disposable);
};

