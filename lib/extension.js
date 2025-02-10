'use strict';

const vscode = require('vscode');

const {lint} = require('./lint');
const {commandLint} = require('./commands/command-lint');
const {commandFix} = require('./commands/command-fix');

const {
    Range,
    Position,
    commands,
} = vscode;

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
    
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(async (editor) => {
        if (editor)
            await updateDiagnostics(editor.document, collection);
    }));
    
    vscode.languages.registerCodeActionsProvider('javascript', new Linter(), {
        providedCodeActionKinds: Linter.providedCodeActionKinds,
    });
};

async function updateDiagnostics(document, collection) {
    const regexp = /[mc]?[jt]sx?$/;
    const name = document.uri.fsPath;
    
    if (document && regexp.test(name)) {
        const [, places] = await commandLint();
        
        if (!places.length)
            collection.clear();
        
        for (const place of places) {
            const {
                rule,
                message,
                position: {
                    line,
                    column,
                },
            } = place;
            
            const position = new Position(line - 1, column);
            
            collection.set(document.uri, [{
                code: '',
                message: `🐊 ${message} // ${rule}`,
                range: new vscode.Range(position, position),
                severity: vscode.DiagnosticSeverity.Error,
                source: '',
            }]);
        }
        
        return;
    }
    
    collection.clear();
}

class Linter {
    providedCodeActionKinds = [vscode.CodeActionKind.SourceFixAll];
    async provideCodeActions(document) {
        const putoutFix = await this.createFix(document);
        
        return [putoutFix];
    }
    
    async createFix(document) {
        const fix = new vscode.CodeAction(`Putout Fix`, vscode.CodeActionKind.SourceFixAll);
        
        const source = document.getText();
        const start = document.positionAt(0);
        const end = document.positionAt(source.length);
        const selection = new Range(start, end);
        
        const [, {code}] = await lint(source, {
            name: document.uri.path,
            fix: true,
        });
        
        fix.edit = new vscode.WorkspaceEdit();
        fix.edit.replace(document.uri, selection, code);
        
        return fix;
    }
}
