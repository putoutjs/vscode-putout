'use strict';

const vscode = require('vscode');

const {commandLint} = require('./commands/command-lint');
const {commandFix} = require('./commands/command-fix');
const {Position, commands} = vscode;
const noop = () => {};

const {
    activeTextEditor,
    onDidChangeActiveTextEditor,
} = vscode.window;

module.exports.deactivate = noop;
/**
 * @param {vscode.ExtensionContext} context
 */
module.exports.activate = async (context) => {
    const disposable = commands.registerCommand('vs-code-putout.putout.fix', async () => {
        await commandFix();
        collection.clear();
    });
    
    context.subscriptions.push(disposable);
    
    const collection = vscode.languages.createDiagnosticCollection('putout');
    
    if (activeTextEditor)
        await updateDiagnostics(activeTextEditor.document, collection);
    
    context.subscriptions.push(onDidChangeActiveTextEditor(async (editor) => {
        if (editor)
            await updateDiagnostics(editor.document, collection);
    }));
};

async function updateDiagnostics(document, collection) {
    if (document && document.uri.fsPath.endsWith('.js')) {
        const places = await commandLint();
        
        for (const {message, position: {line, column}} of places) {
            const position = new Position(line - 1, column);
            
            collection.set(document.uri, [{
                code: '',
                message,
                range: new vscode.Range(position, position),
                severity: vscode.DiagnosticSeverity.Error,
                source: '',
                /*
                relatedInformation: [
                    new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(new vscode.Position(1, 8), new vscode.Position(1, 9))), 'first assignment to `x`'),
                ],
                */
            }]);
        }
        
        return;
    }
    
    collection.clear();
}

