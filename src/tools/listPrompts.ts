import { readdir, stat } from 'fs/promises';
import { extname } from 'path';
import { z } from 'zod';

export const listPromptsSchema = z.object({
  promptsPath: z.string()
});

export type ListPromptsArgs = z.infer<typeof listPromptsSchema>;

export async function listPrompts(args: ListPromptsArgs) {
  try {
    // Check if prompts directory exists
    const promptsStats = await stat(args.promptsPath);
    if (!promptsStats.isDirectory()) {
      throw new Error(`Prompts path is not a directory: ${args.promptsPath}`);
    }

    // Read all files in the prompts directory
    const files = await readdir(args.promptsPath);
    
    // Filter for text files (common prompt file extensions)
    const promptFiles = files.filter(file => {
      const ext = extname(file).toLowerCase();
      return ['.txt', '.md', '.prompt', '.text'].includes(ext);
    });

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ fileList: promptFiles })
      }],
      _meta: {
        fileList: promptFiles,
        promptsPath: args.promptsPath
      }
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: [{
        type: "text" as const,
        text: `Error listing prompts: ${errorMessage}`
      }],
      isError: true
    };
  }
} 