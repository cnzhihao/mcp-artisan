import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';
import { z } from 'zod';
import { validatePath } from '../utils/path.js';

export const listPromptsSchema = z.object({});

export type ListPromptsArgs = z.infer<typeof listPromptsSchema>;

export async function listPrompts(args: ListPromptsArgs, workspacePath: string) {
  try {
    const supportedExtensions = ['.txt', '.md', '.prompt', '.text'];
    let searchPath = workspacePath;
    
    // 优先检查prompts目录
    const promptsDir = join(workspacePath, 'prompts');
    try {
      const promptsStats = await stat(promptsDir);
      if (promptsStats.isDirectory()) {
        searchPath = promptsDir;
      }
    } catch {
      // prompts目录不存在，使用工作空间根目录
    }
    
    // 验证搜索路径安全性
    const validatedPath = await validatePath(searchPath, workspacePath);
    
    // 读取目录内容
    const files = await readdir(validatedPath);
    
    // 过滤提示词文件
    const promptFiles = files.filter(file => {
      const ext = extname(file).toLowerCase();
      return supportedExtensions.includes(ext);
    });

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ 
          fileList: promptFiles,
          searchPath: searchPath === promptsDir ? 'prompts/' : './'
        })
      }],
      _meta: {
        fileList: promptFiles,
        searchPath,
        workspacePath
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