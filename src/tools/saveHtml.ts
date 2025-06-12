import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { z } from 'zod';

export const saveHtmlSchema = z.object({
  htmlContent: z.string(),
  outputPath: z.string(),
  fileName: z.string()
});

export type SaveHtmlArgs = z.infer<typeof saveHtmlSchema>;

export async function saveHtml(args: SaveHtmlArgs) {
  try {
    // Validate fileName doesn't contain illegal characters
    const illegalChars = /[<>:"/\\|?*]/;
    if (illegalChars.test(args.fileName)) {
      throw new Error(`Filename contains illegal characters: ${args.fileName}`);
    }

    // Ensure output directory exists
    await mkdir(args.outputPath, { recursive: true });

    // Create full file path with .html extension
    const fullFileName = args.fileName.endsWith('.html') 
      ? args.fileName 
      : `${args.fileName}.html`;
    
    const filePath = join(args.outputPath, fullFileName);

    // Write HTML content to file
    await writeFile(filePath, args.htmlContent, 'utf8');

    return {
      content: [{
        type: "text" as const,
        text: `HTML saved successfully to: ${filePath}`
      }],
      _meta: {
        filePath
      }
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: [{
        type: "text" as const,
        text: `Error saving HTML: ${errorMessage}`
      }],
      isError: true
    };
  }
} 