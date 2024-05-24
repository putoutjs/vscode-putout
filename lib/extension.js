'use strict';

const {
    Range,
    commands,
    window,
} = require('vscode');

const {lint} = require('./lint');
const noop = () => {};
const {showInformationMessage} = window;

module.exports.deactivate = noop;
/**
 * @param {vscode.ExtensionContext} context
 */
module.exports.activate = (context) => {
    const disposable = commands.registerCommand('vs-code-putout.putout', async () => {
        const editor = window.activeTextEditor;
        
        if (!editor)
            return;
        
        const {document} = editor;
        const source = document.getText();
        const start = document.positionAt(0);
        const end = document.positionAt(source.length);
        const selection = new Range(start, end);
        
        const name = document.fileName;
        
        if (!/[mc]?[jt]sx?$/.test(name))
            return showInformationMessage('🐊 Only JS/TS file types supported from VS Code.');
        
        const [error, result] = await lint(name, source);
        
        if (error)
            return showInformationMessage(`🐊 ${error.message}`);
        
        const {code} = result;
        
        if (code === source)
            return showInformationMessage('🐊 No changes applied.');
        
        editor.edit((editBuilder) => {
            editBuilder.replace(selection, code);
        });
    });
    
    context.subscriptions.push(disposable);
};
