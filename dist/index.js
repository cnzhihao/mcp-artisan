#!/usr/bin/env node
import { startServer } from "./server.js";
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
startServer().catch((error) => {
    console.error('Failed to start MCP-Artisan server:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map