const vscode = require('vscode');

function checkForEmptyFile(editor) {
    if (!editor || !editor.document) return;

    const document = editor.document;
    if (document.getText().trim() === '') {
        const edit = new vscode.WorkspaceEdit();
        const comment = '// An empty file? This is probably the most error-free file of the project\n';
        
        edit.insert(document.uri, new vscode.Position(0, 0), comment);
        vscode.workspace.applyEdit(edit);
    }
}

function activate(context) {
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(checkForEmptyFile)
    );
}

module.exports = { activate };
