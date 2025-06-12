import { readFile, stat } from 'fs/promises';
import { z } from 'zod';

export const getPromptContentSchema = z.object({
  promptPath: z.string()
});

export type GetPromptContentArgs = z.infer<typeof getPromptContentSchema>;

export async function getPromptContent(args: GetPromptContentArgs) {
  try {
    // Check if file exists and is accessible
    const fileStats = await stat(args.promptPath);
    if (!fileStats.isFile()) {
      throw new Error(`Prompt path is not a file: ${args.promptPath}`);
    }

    // Read file content
    const content = await readFile(args.promptPath, 'utf8');

    return {
      content: [{
        type: "text" as const,
        text: content
      }],
      _meta: {
        promptPath: args.promptPath,
        fileSize: fileStats.size
      }
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: [{
        type: "text" as const,
        text: `Error reading prompt content: ${errorMessage}`
      }],
      isError: true
    };
  }
} 