import puppeteer from 'puppeteer';
import { readFile } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { z } from 'zod';
import { validatePath } from '../utils/path.js';

export const renderImageFromHtmlSchema = z.object({
  htmlPath: z.string().describe("HTML文件的相对路径（相对于工作空间）"),
  imageType: z.enum(['png', 'jpeg']).default('png').describe("图片格式")
});

export type RenderImageFromHtmlArgs = z.infer<typeof renderImageFromHtmlSchema>;

export async function renderImageFromHtml(args: RenderImageFromHtmlArgs, workspacePath: string) {
  let browser;
  
  try {
    const { htmlPath, imageType } = args;
    
    // 构建完整的HTML文件路径
    const fullHtmlPath = join(workspacePath, htmlPath);
    
    // 验证HTML文件路径安全性
    const validatedHtmlPath = await validatePath(fullHtmlPath, workspacePath);
    
    // 读取HTML文件内容
    const htmlContent = await readFile(validatedHtmlPath, 'utf8');
    
    // 启动浏览器
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 设置视口大小
    await page.setViewport({ width: 1200, height: 800 });
    
    // 设置内容并等待加载
    await page.setContent(htmlContent, { 
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 10000 
    });
    
    // 生成图片路径（与HTML文件在同一目录）
    const htmlDir = dirname(validatedHtmlPath);
    const htmlBasename = basename(validatedHtmlPath, extname(validatedHtmlPath));
    const imageExtension = imageType === 'jpeg' ? 'jpeg' : 'png';
    const imagePath = join(htmlDir, `${htmlBasename}.${imageExtension}`);
    
    // 验证图片路径安全性
    const validatedImagePath = await validatePath(imagePath, workspacePath);
    
    // 截图
    await page.screenshot({
      path: validatedImagePath as `${string}.png` | `${string}.jpeg` | `${string}.webp`,
      type: imageType,
      fullPage: true,
      quality: imageType === 'jpeg' ? 90 : undefined
    });
    
    return {
      content: [{
        type: "text" as const,
        text: `Image rendered successfully to: ${imagePath}`
      }],
      _meta: {
        imagePath: validatedImagePath,
        htmlPath: validatedHtmlPath,
        imageType,
        workspacePath
      }
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: [{
        type: "text" as const,
        text: `Error rendering image: ${errorMessage}`
      }],
      isError: true
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
} 