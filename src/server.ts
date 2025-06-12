import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Import tools
import { saveHtml, saveHtmlSchema } from "./tools/saveHtml.js";
import { renderImageFromHtml, renderImageFromHtmlSchema } from "./tools/renderImageFromHtml.js";
import { findRelevantPrompt, findRelevantPromptSchema } from "./tools/findRelevantPrompt.js";

export function createMcpServer() {
  const server = new McpServer({
    name: "mcp-artisan",
    version: "1.0.0"
  });

  // Register findRelevantPrompt tool
  server.tool(
    "findRelevantPrompt",
    findRelevantPromptSchema.shape,
    async (args) => {
      const result = await findRelevantPrompt(args);
      if (result.isError) {
        return {
          content: result.content,
          isError: true
        };
      }
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            promptPath: result._meta?.promptPath
          })
        }]
      };
    }
  );

  // Register saveHtml tool
  server.tool(
    "saveHtml",
    saveHtmlSchema.shape,
    async (args) => {
      const result = await saveHtml(args);
      if (result.isError) {
        return {
          content: result.content,
          isError: true
        };
      }
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            filePath: result._meta?.filePath
          })
        }]
      };
    }
  );

  // Register renderImageFromHtml tool
  server.tool(
    "renderImageFromHtml",
    renderImageFromHtmlSchema.shape,
    async (args) => {
      const result = await renderImageFromHtml(args);
      if (result.isError) {
        return {
          content: result.content,
          isError: true
        };
      }
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            imagePath: result._meta?.imagePath
          })
        }]
      };
    }
  );

  return server;
}

export async function startServer() {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  
  // Log server startup to stderr (not stdout to avoid interfering with JSON-RPC)
  console.error("MCP-Artisan server starting...");
  
  await server.connect(transport);
  
  console.error("MCP-Artisan server connected and ready!");
} 