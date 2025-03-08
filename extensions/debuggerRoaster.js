const vscode = require('vscode');

// List of roasting messages
const roastMessages = [
    "Oh, setting a breakpoint already? That bad, huh? 😂",
    "Breakpoint added! Looks like we're in for a long night. 😆",
    "You think this breakpoint will help? Cute. 🙃",
    "Ah yes, breakpoints... the universal cry for help. 💀",
    "You set a breakpoint? Good. Now stare at it while nothing makes sense. 🤡",
    "Breakpoint placed! Debugging or just praying? 🙏",
    "Nice breakpoint. Now let's see if you actually understand your code. 🤨",
    "Hitting 'F9' won't fix bad logic, but sure, let’s pretend. 😜",
    "More breakpoints, more problems. You know that, right? 😅",
    "You know what would be faster? Writing bug-free code. 😂",
    "At this point, you're just adding breakpoints for fun, aren't you? 🤡"
];

const runRoastMessages = [
    "Oh wow, using the Run button? Why not just ask ChatGPT to code for you too? 😂",
    "Run button detected! Real coders use the terminal. 😆",
    "Hey there, ever heard of the terminal? Might be time to learn. 🤔",
    "Clicked Run? Let me guess... you have no idea what's gonna happen. 🤡",
    "Real pros hit 'npm start' in the terminal. Just saying. 😜",
    "Oh look, someone’s too scared of the terminal. 😆",
    "Using the Run button? Must be nice to live life on easy mode. 🛠",
    "One day, the Run button won't save you... but today is not that day. 😂",
    "Clicking Run like a casual. Terminal users are judging you right now. 👀",
    "Run button? You must love GUIs. Try 'node yourFile.js' sometime. 😉"
];

function activateDebuggerRoaster(context) {
    // Roast when debugging starts (Triggered by clicking the Run button)
    let lastDebugTimestamp = 0;
    const debounceTime = 1000; // 1 second debounce to prevent duplicate messages

    vscode.debug.onDidStartDebugSession((session) => {
        const now = Date.now();

        // Prevent duplicate triggers within debounce time
        if (now - lastDebugTimestamp > debounceTime) {
            lastDebugTimestamp = now;
            
            const randomRoast = runRoastMessages[Math.floor(Math.random() * runRoastMessages.length)];
            vscode.window.showWarningMessage(randomRoast);
        }
    });

    // Roast when a breakpoint is hit
    vscode.debug.onDidReceiveDebugSessionCustomEvent((event) => {
        if (event.event === "stopped" && event.body.reason === "breakpoint") {
            const randomRoast = roastMessages[Math.floor(Math.random() * roastMessages.length)];
            vscode.window.showWarningMessage(randomRoast);
        }
    });

    // Roast when a breakpoint is set
    vscode.debug.onDidChangeBreakpoints((event) => {
        if (event.added.length > 0) {
            const randomRoast = roastMessages[Math.floor(Math.random() * roastMessages.length)];
            vscode.window.showWarningMessage(randomRoast);
        }
    });
}

module.exports = { activateDebuggerRoaster };