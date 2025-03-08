const vscode = require('vscode');

let globalState;
let currentMode = 'chill'; // In-memory cache

function initialize(context) {
    globalState = context.globalState;
    currentMode = globalState.get('roaster.mode', 'chill'); // Load stored mode into memory
}

function setMode(mode) {
    if (mode !== 'chill' && mode !== 'hard') {
        vscode.window.showErrorMessage("Invalid mode! Choose either 'chill' or 'hard'.");
        return;
    }

    currentMode = mode; // Update in-memory cache
    globalState.update('roaster.mode', mode); // Store mode persistently
    vscode.window.showInformationMessage(`Roaster mode set to: ${mode}`);
}

function getMode() {
    return currentMode; // Return in-memory value for quick access
}

module.exports = { initialize, setMode, getMode };
