const { activateReminder } = require("./extensions/lateNightReminder")
const IdleTracker = require('./extensions/idleTracker');
const vscode = require('vscode');
const { startTracking } = require("./extensions/tracker");
const { setMode, getMode, initialize } = require('./extensions/modes');
const { generateRoast } = require('./extensions/callRoasts');
const { activateDebuggerRoaster } = require('./extensions/debuggerRoaster')
const newFile = require('./extensions/newFile');
const { roastAndRestartFile } = require('./extensions/crash')
const { registerAutofillProvider } = require('./extensions/autofillProvider');

let lastRoastTime = 0;
const ROAST_TIMEOUT = 2 * 60 * 1000; // 2 minutes

async function onFileSave(document, isManual = false) {
    // console.log("File saved:", document.fileName);
    // const diagnostics = vscode.languages.getDiagnostics(document.uri);
    // const now = Date.now();

    // if (diagnostics.length > 0) {
    //     if (isManual || now - lastRoastTime >= ROAST_TIMEOUT) {
    //         lastRoastTime = now;
    //         const roastMessage = await generateRoast(diagnostics);
    //         vscode.window.showErrorMessage(roastMessage);
    //     }
    // }
}

function activate(context) {
    initialize(context); // Initialize storage access

    let modeCommand = vscode.commands.registerCommand('extension.setRoasterMode', async () => {
        const mode = await vscode.window.showQuickPick(['chill', 'hard'], {
            placeHolder: 'Select roaster mode'
        });

        if (mode) setMode(mode);
    });

    context.subscriptions.push(modeCommand);

    context.subscriptions.push(modeCommand);

    // Hook into manual and auto save events
    context.subscriptions.push(
        vscode.workspace.onWillSaveTextDocument((event) => {
            if (event.reason === vscode.TextDocumentSaveReason.Manual) {
                onFileSave(event.document, true); // Manual save triggers instantly
            }
        }),
        vscode.workspace.onDidSaveTextDocument((document) => {
            onFileSave(document, false); // AutoSave uses timeout
        })
    );
    vscode.debug.onDidStartDebugSession((u) => {
        console.log("🚀 Debugging started! Roasting file...");
        roastAndRestartFile();
      });
    
      // Listen for "Run Without Debugging" (Ctrl+F5 / ▶ Button)
      let disposable = vscode.commands.registerCommand(
        "workbench.action.debug.run",
        () => {
          console.log("▶ Run button clicked! Roasting file...");
          roastAndRestartFile();
        }
      );
    registerAutofillProvider(context);
    activateDebuggerRoaster(context);
    startTracking(context);
    activateReminder(context)
    newFile.activate(context);
    const idleTracker = new IdleTracker()
    idleTracker.startTrackingIdleTime(context);
}

function deactivate() {
    vscode.window.showInformationMessage("Extension deactivated. Hope your debugging skills improved!");
}

module.exports = { activate, deactivate };
