const vscode = require('vscode');

function lateNightReminder() {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 0 && currentHour < 5) { // Between midnight and 5 AM
        vscode.window.showWarningMessage(
            "Still trying to fix that bug? Just sleep, it'll still be broken tomorrow."
        );
    }
}

// Function to register command
function activateReminder(context) {
    // Run check when VS Code starts
    lateNightReminder();

    // Run check every 10 minutes
    setInterval(lateNightReminder, 10 * 60 * 1000);

    // Command to trigger manually
    let disposable = vscode.commands.registerCommand('extension.lateNightReminder', () => {
        lateNightReminder();
    });

    context.subscriptions.push(disposable);
}

module.exports = {
    activateReminder
};