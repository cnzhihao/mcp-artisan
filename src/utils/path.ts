import { resolve, relative, isAbsolute, normalize } from 'path';
import { realpath } from 'fs/promises';

/**
 * 验证目标路径是否在工作空间内，防止目录遍历攻击
 * @param targetPath 要验证的目标路径（可以是相对或绝对路径）
 * @param workspacePath 工作空间根目录的绝对路径
 * @returns 验证通过的绝对路径
 * @throws Error 如果路径在工作空间外
 */
export async function validatePath(targetPath: string, workspacePath: string): Promise<string> {
  try {
    // 规范化工作空间路径
    const normalizedWorkspace = normalize(resolve(workspacePath));
    
    // 解析目标路径（如果是相对路径，则相对于工作空间）
    const resolvedTarget = resolve(normalizedWorkspace, targetPath);
    
    // 获取真实路径以处理符号链接
    let realTarget: string;
    try {
      realTarget = await realpath(resolvedTarget);
    } catch {
      // 如果文件不存在，使用解析后的路径
      realTarget = resolvedTarget;
    }
    
    // 检查是否在工作空间内
    const relativePath = relative(normalizedWorkspace, realTarget);
    if (relativePath.startsWith('..') || isAbsolute(relativePath)) {
      throw new Error(`Access denied: Path "${targetPath}" is outside workspace`);
    }
    
    return realTarget;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Access denied')) {
      throw error;
    }
    throw new Error(`Path validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 同步版本的路径验证（用于不需要处理符号链接的场景）
 * @param targetPath 要验证的目标路径
 * @param workspacePath 工作空间根目录的绝对路径
 * @returns 验证通过的绝对路径
 * @throws Error 如果路径在工作空间外
 */
export function validatePathSync(targetPath: string, workspacePath: string): string {
  try {
    // 规范化工作空间路径
    const normalizedWorkspace = normalize(resolve(workspacePath));
    
    // 解析目标路径
    const resolvedTarget = resolve(normalizedWorkspace, targetPath);
    
    // 检查是否在工作空间内
    const relativePath = relative(normalizedWorkspace, resolvedTarget);
    if (relativePath.startsWith('..') || isAbsolute(relativePath)) {
      throw new Error(`Access denied: Path "${targetPath}" is outside workspace`);
    }
    
    return resolvedTarget;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Access denied')) {
      throw error;
    }
    throw new Error(`Path validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 