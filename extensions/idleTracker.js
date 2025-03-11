const {getMode} = require('./modes')

const vscode = require("vscode");
const sound = require('sound-play');
const path = require('path');

const audioFiles = [
    "roast1.mp3",
    "roast2.mp3",
    "roast3.mp3"
];

const roastMessages = [
    "Contemplating your life choices again?",
    "Your code isn’t going to fix itself. Trust me, I checked.",
    "VS Code is now in sleep mode… just like your productivity.",
    "Idle time detected. Do you need me to call a coding tutor?",
    "Go ahead, take your time. The bugs aren’t going anywhere.",
    "If thinking was coding, you’d be done by now.",
    "You’ve been idle for a while… should I submit your resignation letter?"
]

class IdleTracker {
    constructor() {
        this.idleTime = 15000; // 15 seconds
        this.timeout = null;
        this.isTracking = false;
        this.inversionCount = 0;
        this.isWindowFocused = true; // ✅ Tracks window focus state
    }

    startTrackingIdleTime(context) {
        console.log("✅ Idle time tracking started.");

        this.changeTextListener = vscode.workspace.onDidChangeTextDocument((event) => {
            if (this.isFlipping) {
                console.log("🔄 Ignored self-triggered text change.");
                return;
            }

            console.log("🖋 User is typing. Resetting idle timer.");
            if (!this.isTracking) {
                this.isTracking = true;
            }
            this.resetIdleTimer(true);
        });

        this.windowStateListener = vscode.window.onDidChangeWindowState((state) => {
            this.isWindowFocused = state.focused;
            console.log(`🖥️ Window is now ${this.isWindowFocused ? "focused" : "unfocused"}.`);
            if (!this.isWindowFocused) {
                this.stopIdleTimer(); // Stop timer when unfocused
            } else {
                this.resetIdleTimer(); // Resume when focused
            }
        });

        context.subscriptions.push(this.changeTextListener, this.windowStateListener);
        this.resetIdleTimer(); // Start tracking immediately
    }

    resetIdleTimer(resetInversions = false) {
        if (this.timeout) clearTimeout(this.timeout);

        if (resetInversions) {
            console.log("🔄 Resetting inversion count to 0.");
            this.inversionCount = 0;
        }

        if (!this.isWindowFocused) {
            console.log("⏸️ Window is not focused. Not starting idle timer.");
            return;
        }

        console.log(`⏳ Setting idle timeout for ${this.idleTime / 1000} seconds...`);
        this.timeout = setTimeout(() => {
            if (this.isTracking) {
                this.rotateRandomLine();
            }
        }, this.idleTime);
    }

    stopIdleTimer() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
            console.log("⏹️ Idle timer stopped due to window unfocus.");
        }
    }

    async rotateRandomLine() {
        const mode = getMode();
        if (mode === "hard") {
            if (!this.isWindowFocused) {
                console.log("🚫 Skipping flip: Window is unfocused.");
                return;
            }
    
            const editor = vscode.window.activeTextEditor;
            if (!editor || !editor.document) {
                console.log("❌ No active text editor found.");
                return;
            }
    
            const document = editor.document;
            if (document.lineCount === 0) {
                console.log("❌ Document is empty.");
                return;
            }
    
            const lineNum = Math.floor(Math.random() * document.lineCount);
            console.log(`🔄 Rotating line ${lineNum}... `);
    
            const line = document.lineAt(lineNum);
            const flippedText = this.flipText(line.text);
    
            try {
                this.isFlipping = true;
                const success = await editor.edit(editBuilder => {
                    editBuilder.replace(line.range, flippedText);
                });
                this.isFlipping = false;
    
                if (success) {
                    this.inversionCount++;
                    console.log(`✅ Flipped line ${lineNum}`);
                } else {
                    console.log("❌ Edit failed. Not counting inversion.");
                }
            } catch (error) {
                console.error("❌ Error editing the document:", error);
                this.isFlipping = false;
            }
        } else {
            if (Math.random() > 0.5) {
                this.playRandomAudio();
            } else {
                this.showRoastMessage();
            }
            this.resetIdleTimer(); // ✅ Ensures the function triggers again
        }
    }

    playRandomAudio() {
        const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)];
        const audioPath = path.join(__dirname, 'audio', randomAudio);
        
        console.log(`Playing: ${randomAudio}, ${audioPath}`);
    
        sound.play(audioPath).catch(err => {
            console.error("Error playing audio:", err);
            vscode.window.showErrorMessage("Failed to play roast audio!");
        });
    }

    showRoastMessage() {
        const randomMessage = roastMessages[Math.floor(Math.random() * roastMessages.length)];
        vscode.window.showWarningMessage(randomMessage);
    }
    

    flipText(text) {
        const flipTable = { 
            "a": "ɐ", "b": "q", "c": "ɔ", "d": "p", "e": "ǝ", "f": "ɟ", "g": "ƃ",
            "h": "ɥ", "i": "ᴉ", "j": "ɾ", "k": "ʞ", "l": "ʃ", "m": "ɯ", "n": "u", 
            "o": "o", "p": "d", "q": "b", "r": "ɹ", "s": "s", "t": "ʇ", "u": "n", 
            "v": "ʌ", "w": "ʍ", "x": "x", "y": "ʎ", "z": "z",
            "A": "∀", "B": "q", "C": "Ɔ", "D": "p", "E": "Ǝ", "F": "Ⅎ", "G": "פ",
            "H": "H", "I": "I", "J": "ſ", "K": "ʞ", "L": "˥", "M": "W", "N": "N",
            "O": "O", "P": "Ԁ", "Q": "Q", "R": "ɹ", "S": "S", "T": "┴", "U": "∩",
            "V": "Λ", "W": "M", "X": "X", "Y": "⅄", "Z": "Z"
        };

        return text.split("").map(char => flipTable[char] || char).reverse().join("");
    }

    dispose() {
        this.stopIdleTimer(); // ✅ Ensure cleanup

        if (this.changeTextListener) {
            this.changeTextListener.dispose();
        }
        if (this.windowStateListener) {
            this.windowStateListener.dispose();
        }
        
        console.log("🛑 IdleTracker disposed.");
    }
}

module.exports = IdleTracker;
