'use strict';

const {window} = require('vscode');
const {lint} = require('../lint');
const {showInformationMessage} = window;

module.exports.commandLint = async () => {
    const editor = window.activeTextEditor;
    
    if (!editor)
        return;
    
    const {document} = editor;
    const source = document.getText();
    
    const name = document.fileName;
    
    if (!/[mc]?[jt]sx?$/.test(name))
        return showInformationMessage('🐊 Only JS/TS file types supported from VS Code.');
    
    const [error, result] = await lint(source, {
        fix: false,
        name,
    });
    
    if (error) {
        showInformationMessage(`🐊 ${error.message}`);
        return [
            source,
            [],
        ];
    }
    
    const {code, places} = result;
    
    return [code, places];
};
