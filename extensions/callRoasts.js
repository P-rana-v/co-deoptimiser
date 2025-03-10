require("dotenv");
const vscode = require("vscode")
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");


const fileExtensions = {
    // Web Development
    ".html": "HTML",
    ".htm": "HTML",
    ".css": "CSS",
    ".scss": "SCSS",
    ".sass": "SASS",
    ".js": "JavaScript",
    ".mjs": "JavaScript (ES Modules)",
    ".cjs": "JavaScript (CommonJS)",
    ".jsx": "JavaScript (React JSX)",
    ".ts": "TypeScript",
    ".tsx": "TypeScript (React TSX)",
    ".json": "JSON",

    // Backend & Scripting
    ".py": "Python",
    ".rb": "Ruby",
    ".php": "PHP",
    ".java": "Java",
    ".kt": "Kotlin",
    ".swift": "Swift",
    ".cs": "C#",
    ".vb": "Visual Basic",
    ".sh": "Shell Script",
    ".bat": "Batch Script",
    ".ps1": "PowerShell",
    ".pl": "Perl",
    ".lua": "Lua",
    ".r": "R",
    ".groovy": "Groovy",

    // C-family
    ".c": "C",
    ".h": "C Header",
    ".cpp": "C++",
    ".hpp": "C++ Header",
    ".cc": "C++",
    ".cxx": "C++",
    ".csx": "C# Script",

    // Data & Markup
    ".xml": "XML",
    ".yml": "YAML",
    ".yaml": "YAML",
    ".toml": "TOML",
    ".ini": "INI",
    ".csv": "CSV",
    ".md": "Markdown",
    ".rst": "reStructuredText",

    // Database & Query
    ".sql": "SQL",
    ".psql": "PostgreSQL",
    ".mysql": "MySQL",
    ".sqlite": "SQLite",

    // Miscellaneous
    ".dockerfile": "Dockerfile",
    ".makefile": "Makefile",
    ".env": "Environment Config",
    ".gitignore": "Git Ignore",
    ".gitattributes": "Git Attributes",
    ".editorconfig": "EditorConfig",
    ".log": "Log File",
    ".config": "Configuration File"
};

function getActiveFileLanguage() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return "Unknown";

    const filename = editor.document.fileName;
    const ext = path.extname(filename).toLowerCase();

    return fileExtensions[ext] || "Unknown";
}

const genAI = new GoogleGenerativeAI(GEMINI_API);
console.log("Gemini Api:", GEMINI_API);
async function generateRoast(diagnostics) {
    const language = getActiveFileLanguage();
  console.log("Diagnostics:", diagnostics);
  const errorMessages = diagnostics.map((d) => d.message).join("; ");
  const prompt = `Roast this coder for the errors in the following ${language==="Unknown"?"file":language+" file" } in a sarcastic, mean yet funny way in one line in simple words, also specific to the errors: "${errorMessages}"`;
  console.log(prompt);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const roastText = response.text();

    return roastText
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I was going to roast you, but even Gemini couldn't process this disaster.";
  }
}

module.exports = { generateRoast };
