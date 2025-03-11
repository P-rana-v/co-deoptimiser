const { getMode } = require("./modes")

const vscode = require('vscode');
let pasteRoasts = [
    "Wow, another paste? Ever heard of typing?",
    "Ctrl + V is your best friend, huh?",
    "At this rate, your keyboard is just for decoration.",
    "You copy more than my college assignments!",
    "You'd win a copy-pasting championship, no doubt.",
    "Paste again, and I'll start charging you royalties.",
    "Your copy-paste skills are unmatched... and not in a good way.",
    "Do you even code, or just Ctrl+C and Ctrl+V?",
    "Paste limit exceeded. Time to flex those typing muscles!",
    "You're the reason we can't have nice things."
];

let totalErrors = 0;
let pasteCount = 0;
let deletedLines = 0;
let sessionStartTime;
let statusBarButton;
let previousLineCount = 0;
let saveTimeout;
const pasteLimit = 5;

function startTracking(context) {
    sessionStartTime = Date.now();

    function countErrors(document) {
        const diagnostics = vscode.languages.getDiagnostics(document.uri);
        const currentErrors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
        
        totalErrors += currentErrors; // Accumulate errors instead of resetting
        console.log(`Total accumulated errors: ${totalErrors}`);
    }

    vscode.workspace.onDidOpenTextDocument((document) => {
        previousLineCount = document.lineCount;
    });

    vscode.workspace.onWillSaveTextDocument((event) => {
        const document = event.document;
        const currentLineCount = document.lineCount;
        const autoSaveMode = vscode.workspace.getConfiguration('files').get('autoSave');

        if (currentLineCount < previousLineCount) {
            deletedLines += (previousLineCount - currentLineCount);
        }
        previousLineCount = currentLineCount;

        if (event.reason === vscode.TextDocumentSaveReason.Manual) {
            // If it's a manual save, count errors immediately
            if (saveTimeout) clearTimeout(saveTimeout); // Clear any pending AutoSave timeout
            countErrors(document);
        } else if (autoSaveMode === 'afterDelay') {
            // If it's AutoSave, wait for the timeout
            if (saveTimeout) clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => countErrors(document), 60000);
        }
    });

    async function trackPaste() {
        pasteCount++;
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        if (pasteCount>=pasteLimit) {
            const mode=getMode()
            console.log(mode)
            if (mode=='chill') {
                vscode.window.showInformationMessage(pasteRoasts[Math.floor(Math.random() * pasteRoasts.length)])
                const clipboardText = await vscode.env.clipboard.readText();
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, clipboardText);
                });
            }
            else {
                if (Math.random() < 1/6) {
                    editor.edit(editBuilder => {
                        const fullRange = new vscode.Range(
                            editor.document.positionAt(0),
                            editor.document.positionAt(editor.document.getText().length)
                        );
                        editBuilder.delete(fullRange);
                    });
                    vscode.window.showWarningMessage("Oops! Looks like your code just vanished. Better luck next time!");
                } 
                else if (Math.random() < 1/6) {
                    const clipboardText = await vscode.env.clipboard.readText();
                    editor.edit(editBuilder => {
                        editBuilder.insert(editor.selection.active, clipboardText.split('').sort(() => 0.5 - Math.random()).join(''));
                    });
                } 
                else {
                    vscode.window.showInformationMessage(pasteRoasts[Math.floor(Math.random() * pasteRoasts.length)])
                    const clipboardText = await vscode.env.clipboard.readText();
                    editor.edit(editBuilder => {
                        editBuilder.insert(editor.selection.active, clipboardText);
                    });
                }
            }
        }
        else {
            const clipboardText = await vscode.env.clipboard.readText();
            editor.edit(editBuilder => {
                editBuilder.insert(editor.selection.active, clipboardText);
            });

        }
    }

    function showSummaryPanel() {
        let sessionTime = ((Date.now() - sessionStartTime) / 60000).toFixed(2);
    
        const panel = vscode.window.createWebviewPanel(
            'sessionSummary',
            'Coding Session Summary',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );
    
        panel.webview.html = `
            <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Coding Session Summary</h2>
                <p><strong>Time Wasted:</strong> ${sessionTime} minutes</p>
                <p><strong>Bugs Created:</strong> ${totalErrors}</p>
                <p><strong>Copy Pastes made:</strong> ${pasteCount}</p>
                <p><strong>Lines Deleted:</strong> ${deletedLines}</p>
                <button id="closeBtn" style="padding: 10px; background-color: red; color: white; border: none;">Close</button>
                <script>
                    const vscode = acquireVsCodeApi();
                    document.getElementById('closeBtn').addEventListener('click', () => {
                        vscode.postMessage({ command: 'closePanel' });
                    });
                </script>
            </body>
            </html>
        `;
    
        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(
            message => {
                if (message.command === 'closePanel') {
                    panel.dispose(); // ✅ Closes the panel properly
                }
            },
            undefined
        );
    }

    // Add status bar button
    statusBarButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarButton.text = `$(flame) Show Roast`;
    statusBarButton.command = 'extension.showSummary';
    statusBarButton.tooltip = "Click to see how bad your coding session was";
    statusBarButton.show();
    context.subscriptions.push(statusBarButton);

    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("editor.action.clipboardPasteAction", trackPaste),
        vscode.commands.registerCommand('extension.showSummary', () => showSummaryPanel()),
    )
}

module.exports = { startTracking }
