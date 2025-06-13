import { writeFile, mkdir } from 'fs/promises';
import { join, relative } from 'path';
import { z } from 'zod';
import { validatePath } from '../utils/path.js';

export const saveHtmlSchema = z.object({
  htmlContent: z.string().describe("The complete, valid HTML content string to be saved."),
  subfolderName: z.string().nonempty().max(20)
    .describe("A descriptive, URL-safe name for the output subfolder (e.g., 'profile-cards', 'weekly-reports'). This helps organize files."),
  fileName: z.string().nonempty()
    .describe("The base name for the file, without the .html extension (e.g., 'self-intro-v2', 'report-2025-06').")
}).describe(
  "Saves a string of HTML content to a file in the workspace's 'output' directory. It returns the relative path of the saved file, which is required for the 'renderImageFromHtml' tool."
);

export type SaveHtmlArgs = z.infer<typeof saveHtmlSchema>;

export async function saveHtml(args: SaveHtmlArgs, workspacePath: string) {
  try {
    const { htmlContent, subfolderName, fileName } = args;
    
    // 验证文件名不包含非法字符
    const illegalChars = /[<>:"/\\|?*]/;
    if (illegalChars.test(fileName) || illegalChars.test(subfolderName)) {
      throw new Error(`Filename or subfolder contains illegal characters`);
    }

    // 构建输出目录路径
    const outputDir = join(workspacePath, 'output', subfolderName);
    
    // 验证输出目录路径安全性
    const validatedOutputDir = await validatePath(outputDir, workspacePath);
    
    // 确保输出目录存在
    await mkdir(validatedOutputDir, { recursive: true });

    // 创建完整文件路径
    const fullFileName = fileName.endsWith('.html') 
      ? fileName 
      : `${fileName}.html`;
    
    const filePath = join(validatedOutputDir, fullFileName);
    
    // 验证文件路径安全性
    const validatedFilePath = await validatePath(filePath, workspacePath);

    // 写入HTML内容
    await writeFile(validatedFilePath, htmlContent, 'utf8');

    // 计算相对路径
    const relativeFilePath = relative(workspacePath, validatedFilePath);

    return {
      content: [{
        type: "text" as const,
        text: `HTML saved successfully to: ${relativeFilePath}`
      }],
      _meta: {
        absolutePath: validatedFilePath,
        relativePath: relativeFilePath,
        subfolderName,
        fileName: fullFileName,
        workspacePath
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