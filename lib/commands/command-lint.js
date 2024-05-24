'use strict';

const {Range, window} = require('vscode');
const {lint} = require('../lint');
const {showInformationMessage} = window;

module.exports.commandLint = async () => {
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
    
    const [error, result] = await lint(source, {
        fix: false,
        name,
    });
    
    if (error)
        return showInformationMessage(`🐊 ${error.message}`);
    
    const {places} = result;
    
    return places;
};
