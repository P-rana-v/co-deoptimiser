const vscode = require("vscode");

function roastAndRestartFile() {
  const editor = vscode.window.activeTextEditor;
  console.log("Entering here...");
  // Only proceed if a file is open
  if (editor) {
    const filePath = editor.document.uri.fsPath;
    const x = Math.random();
    console.log("x:", x);
    // 50% probability of triggering a crash
    if (x < 1/6) {
      vscode.window.showErrorMessage(
        "Oops, looks like you don’t deserve to run this masterpiece right now. See ya! 💀",
        { modal: true }
      );

      // Close the file
      vscode.commands.executeCommand("workbench.action.closeActiveEditor");

      // Reopen it after 5 seconds
      setTimeout(() => {
        vscode.commands.executeCommand(
          "vscode.open",
          vscode.Uri.file(filePath)
        );
      }, 15000);
    }
  }
}

module.exports = { roastAndRestartFile };