#!/usr/bin/env node

import { resolve } from 'path';
import { stat } from 'fs/promises';
import { startServer } from "./server.js";

async function main() {
  // 获取命令行参数
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Error: Workspace directory is required');
    console.error('Usage: mcp-artisan <workspace-directory>');
    console.error('');
    console.error('Examples:');
    console.error('  mcp-artisan ./my-project');
    console.error('  mcp-artisan /path/to/workspace');
    process.exit(1);
  }
  
  const workspacePath = resolve(args[0]);
  
  // 验证工作空间目录存在
  try {
    const stats = await stat(workspacePath);
    if (!stats.isDirectory()) {
      console.error(`Error: ${workspacePath} is not a directory`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error: Cannot access workspace directory ${workspacePath}`);
    console.error(`Make sure the directory exists and you have permission to access it.`);
    process.exit(1);
  }
  
  console.error(`Starting MCP-Artisan v2.0.0 with workspace: ${workspacePath}`);
  
  // 启动服务器
  await startServer(workspacePath);
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Start the MCP server
main().catch((error) => {
  console.error('Failed to start MCP-Artisan server:', error);
  process.exit(1);
}); 