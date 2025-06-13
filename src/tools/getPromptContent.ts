import { readFile, stat } from 'fs/promises';
import { join, sep } from 'path';
import { z } from 'zod';
import { validatePath } from '../utils/path.js';

export const getPromptContentSchema = z.object({
  promptFileName: z.string().describe("提示词文件名（不含路径）")
});

export type GetPromptContentArgs = z.infer<typeof getPromptContentSchema>;

export async function getPromptContent(args: GetPromptContentArgs, workspacePath: string) {
  try {
    const { promptFileName } = args;
    
    // 安全检查：确保promptFileName不包含路径分隔符
    if (promptFileName.includes('/') || promptFileName.includes('\\') || promptFileName.includes('..')) {
      throw new Error(`Invalid filename: "${promptFileName}" contains path separators or traversal sequences`);
    }
    
    // 验证文件名不包含非法字符
    const illegalChars = /[<>:"|?*]/;
    if (illegalChars.test(promptFileName)) {
      throw new Error(`Invalid filename: "${promptFileName}" contains illegal characters`);
    }
    
    // 尝试的搜索路径
    const searchPaths = [
      join(workspacePath, 'prompts', promptFileName),
      join(workspacePath, promptFileName)
    ];
    
    let foundPath: string | null = null;
    let fileStats: any = null;
    
    // 依次尝试每个路径
    for (const searchPath of searchPaths) {
      try {
        // 验证路径安全性
        const validatedPath = await validatePath(searchPath, workspacePath);
        
        // 检查文件是否存在
        const stats = await stat(validatedPath);
        if (stats.isFile()) {
          foundPath = validatedPath;
          fileStats = stats;
          break;
        }
      } catch {
        // 继续尝试下一个路径
        continue;
      }
    }
    
    if (!foundPath) {
      throw new Error(`Prompt file "${promptFileName}" not found in workspace`);
    }
    
    // 读取文件内容
    const content = await readFile(foundPath, 'utf8');

    return {
      content: [{
        type: "text" as const,
        text: content
      }],
      _meta: {
        promptFileName,
        filePath: foundPath,
        fileSize: fileStats.size,
        workspacePath
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