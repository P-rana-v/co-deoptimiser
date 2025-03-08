const vscode = require('vscode');

const uselessAutofills = {
    javascript: [
        { trigger: "for", replacement: "foreach (int i = 0; i < -1; i--) { }" }, // Infinite loop warning 🚨
        { trigger: "console.log", replacement: "console.warn('ERROR: All data lost forever!');" },
        { trigger: "return", replacement: "throw new Error('Function disabled due to laziness.');" },
        { trigger: "fetch", replacement: "alert('Fetching is overrated. Try guessing the data instead.');" },
        { trigger: "let", replacement: "const variableThatWontChange = 'Oops, too late!';" },
        { trigger: "while", replacement: "while (true) { console.log('Infinite wisdom acquired.'); }" },
        { trigger: "if", replacement: "if (Math.random() > 0.5) { /* Maybe execute? */ }" },
        { trigger: "function", replacement: "function doNothing() { return 'Absolutely nothing accomplished.'; }" },
        { trigger: "try", replacement: "try { } catch (error) { console.log('Ignoring problems like a pro.'); }" },
        { trigger: "setTimeout", replacement: "setTimeout(() => alert('You forgot about this, didn’t you?'), 999999);" },
        { trigger: "JSON.parse", replacement: "JSON.parse('{}'); // Just pretend it works." },
        { trigger: "require", replacement: "require('deprecated-package'); // Hope you like breaking changes!" },
        { trigger: "switch", replacement: "switch(variable) { case undefined: default: alert('What even is logic?'); }" },
        { trigger: "document.querySelector", replacement: "document.querySelectorAll('nothing').forEach(el => el.remove());" },
        { trigger: "import", replacement: "import { undefinedFunction } from 'broken-module';" },
        { trigger: "new", replacement: "new Error('You shouldn’t have done that.');" },
        { trigger: "Math.random", replacement: "Math.floor(Math.random() * 1000) % 0; // Always zero!" },
        { trigger: "addEventListener", replacement: "window.addEventListener('click', () => { location.reload(); });" }
    ],
    python: [
        { trigger: "for", replacement: "for i in range(-1, -100, -1): print('Infinite loop engaged!')" },
        { trigger: "print", replacement: "print('WARNING: System meltdown imminent!')" },
        { trigger: "return", replacement: "raise RuntimeError('Returning is overrated!')" },
        { trigger: "while", replacement: "while True:\n    print('Waiting for divine inspiration...')" },
        { trigger: "if", replacement: "if random.choice([True, False]): print('Let fate decide')" },
        { trigger: "def", replacement: "def useless_function():\n    return 'Achievement: Nothing accomplished!'" },
        { trigger: "try", replacement: "try:\n    pass\nexcept Exception:\n    print('Error ignored. Proceeding with chaos!')" }
    ]
};

function registerAutofillProvider(context) {
    ["javascript", "python"].forEach(language => {
        let provider = vscode.languages.registerCompletionItemProvider(
            { scheme: "file", language: language },
            {
                provideCompletionItems(document, position) {
                    let completions = uselessAutofills[language].map(({ trigger, replacement }) => {
                        let item = new vscode.CompletionItem(trigger, vscode.CompletionItemKind.Snippet);
                        item.insertText = new vscode.SnippetString(replacement);
                        item.documentation = new vscode.MarkdownString("🚀 **Useless Suggestion:**\n" + replacement);
                        return item;
                    });
                    return completions;
                }
            },
            ...uselessAutofills[language].map(a => a.trigger[0]) // Triggered by the first letter
        );

        context.subscriptions.push(provider);
    });
}

module.exports = { registerAutofillProvider };
