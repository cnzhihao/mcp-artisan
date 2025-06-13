# MCP-Artisan v2.0.0

A **secure** Model Context Protocol (MCP) tool with workspace sandbox for AI Agents to find prompts, save HTML, and render HTML to images.

## 🚨 Breaking Changes in v2.0.0

This is a **major version update** with breaking changes. All API parameters have been redesigned for enhanced security and usability.

### Key Changes:
- **Workspace Sandbox**: All operations are now restricted to a specified workspace directory
- **Simplified APIs**: Removed complex path parameters, added intelligent file discovery
- **Enhanced Security**: Built-in path validation prevents directory traversal attacks
- **Smart Organization**: Automatic file organization in `output/` subdirectories

## Installation & Usage

```bash
# Install and run with workspace
npx mcp-artisan /path/to/your/workspace

# Example
npx mcp-artisan ./my-project
```

**Required**: You must specify a workspace directory when starting the server.

## New API Reference

### listPrompts
Lists available prompt files automatically.
- **Parameters**: None
- **Behavior**: Searches in `workspace/prompts/` first, falls back to workspace root
- **Returns**: Array of prompt filenames

### getPromptContent  
Reads prompt file content by filename.
- **Parameters**: 
  - `promptFileName` (string): Just the filename, no path needed
- **Behavior**: Automatically searches in prompts directory and workspace root

### saveHtml
Saves HTML with automatic organization.
- **Parameters**:
  - `htmlContent` (string): Complete HTML content
  - `subfolderName` (string, max 20 chars): Descriptive folder name  
  - `fileName` (string): Filename without .html extension
- **Output**: Saves to `workspace/output/{subfolderName}/{fileName}.html`

### renderImageFromHtml
Renders HTML to image using relative paths.
- **Parameters**:
  - `htmlPath` (string): Relative path from workspace (e.g., "output/my-card/index.html")
  - `imageType` (optional): 'png' or 'jpeg'
- **Output**: Image saved alongside HTML file

## Migration from v1.x

| v1.x Parameter | v2.x Parameter | Notes |
|---|---|---|
| `promptsPath` | *(removed)* | Auto-discovery in workspace |
| `promptPath` | `promptFileName` | Just filename, no path |
| `outputPath` | `subfolderName` | Auto-organized in output/ |
| `htmlPath` (absolute) | `htmlPath` (relative) | Relative to workspace |

## Security Features

- **Workspace Sandbox**: All file operations restricted to workspace
- **Path Validation**: Prevents directory traversal (../) attacks  
- **Input Sanitization**: Validates filenames and folder names
- **Symlink Protection**: Resolves real paths to prevent escapes

## Example Workflow

```bash
# Start server with workspace
npx mcp-artisan ./my-project

# Directory structure will be:
# my-project/
# ├── prompts/           # Your prompt files
# │   ├── card.txt
# │   └── banner.md
# └── output/            # Generated files
#     └── my-cards/      # Organized by subfolder
#         ├── card.html
#         └── card.png
```

## Development

```bash
# Clone and install
git clone <repo>
cd mcp-artisan
npm install

# Build
npm run build

# Development with workspace
npm run dev -- ./test-workspace
```

## License

MIT

## Contributing

Issues and pull requests are welcome. Please ensure all tests pass before submitting. 