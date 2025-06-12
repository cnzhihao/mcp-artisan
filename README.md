# MCP-Artisan

A Model Context Protocol (MCP) tool for AI Agents to find prompts, save HTML, and render HTML to images.

## Overview

MCP-Artisan is a command-line tool built on the Model Context Protocol that provides three essential tools for AI Agents:

1. **findRelevantPrompt** - Search for the most relevant prompt file based on user input
2. **saveHtml** - Save HTML content to a file
3. **renderImageFromHtml** - Render HTML files as images using Puppeteer

## Installation

Install and run directly with npx:

```bash
npx mcp-artisan
```

## System Requirements

- Node.js 18 or higher
- Compatible with Linux, macOS, and Windows

## Tools

### findRelevantPrompt

Searches a directory of prompt files and returns the most relevant match based on semantic similarity.

**Parameters:**
- `userInput` (string, required): Keywords or description to match against
- `promptsPath` (string, required): Absolute path to the prompts directory

**Supported file extensions:** `.txt`, `.md`, `.prompt`, `.text`

**Returns:** Path to the most matching prompt file

### saveHtml

Saves HTML content to a specified file location.

**Parameters:**
- `htmlContent` (string, required): Complete HTML code to save
- `outputPath` (string, required): Directory where the file should be saved
- `fileName` (string, required): Filename (without .html extension)

**Returns:** Absolute path to the saved HTML file

### renderImageFromHtml

Renders an HTML file as an image using Puppeteer.

**Parameters:**
- `htmlPath` (string, required): Absolute path to the HTML file
- `imageType` (string, optional): Image format - 'png' or 'jpeg' (default: 'png')

**Returns:** Absolute path to the generated image file

## Usage Example

Here's how an AI Agent would typically use MCP-Artisan:

1. **Find a relevant prompt:**
   ```json
   {
     "tool": "findRelevantPrompt",
     "arguments": {
       "userInput": "cyberpunk cat illustration",
       "promptsPath": "/path/to/prompts"
     }
   }
   ```

2. **Save generated HTML:**
   ```json
   {
     "tool": "saveHtml",
     "arguments": {
       "htmlContent": "<html><body><h1>Cyberpunk Cat</h1></body></html>",
       "outputPath": "/path/to/output",
       "fileName": "cyberpunk-cat"
     }
   }
   ```

3. **Render HTML to image:**
   ```json
   {
     "tool": "renderImageFromHtml",
     "arguments": {
       "htmlPath": "/path/to/output/cyberpunk-cat.html",
       "imageType": "png"
     }
   }
   ```

## Communication Protocol

MCP-Artisan communicates via standard input/output using JSON-RPC. All logging and error messages are sent to stderr to avoid interfering with the protocol communication on stdout.

## Development

To build from source:

```bash
git clone <repository-url>
cd mcp-artisan
npm install
npm run build
```

To run in development mode:
```bash
npm run dev
```

## License

MIT

## Contributing

Issues and pull requests are welcome. Please ensure all tests pass before submitting. 