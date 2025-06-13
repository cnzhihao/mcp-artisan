import puppeteer from 'puppeteer';
import { readFile } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { z } from 'zod';
import { validatePath } from '../utils/path.js';
export const renderImageFromHtmlSchema = z.object({
    htmlPath: z.string().describe("The relative path to the HTML file within the workspace, e.g., 'output/profile-cards/self-intro-v2.html'. This path is obtained from the output of the 'saveHtml' tool."),
    imageType: z.enum(['png', 'jpeg']).default('png').describe("The desired output image format. Defaults to 'png'.")
}).describe("Renders an existing HTML file into an image (PNG or JPEG). Use this tool after you have successfully saved an HTML file with 'saveHtml'.");
export async function renderImageFromHtml(args, workspacePath) {
    let browser;
    try {
        const { htmlPath, imageType } = args;
        const fullHtmlPath = join(workspacePath, htmlPath);
        const validatedHtmlPath = await validatePath(fullHtmlPath, workspacePath);
        const htmlContent = await readFile(validatedHtmlPath, 'utf8');
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        // 步骤1: 在一个足够大的临时视口中加载，让所有样式生效
        await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0',
            timeout: 10000
        });
        // 等待异步CSS（如Tailwind JIT）完成渲染
        await new Promise(resolve => setTimeout(resolve, 300));
        // 步骤2: ✨ 双重测量，同时获取核心内容尺寸和body的padding
        const dimensions = await page.evaluate(() => {
            const body = document.body;
            const contentEl = body.firstElementChild;
            if (!contentEl)
                return null;
            const contentRect = contentEl.getBoundingClientRect();
            const bodyStyle = window.getComputedStyle(body);
            const padding = {
                top: parseFloat(bodyStyle.paddingTop),
                right: parseFloat(bodyStyle.paddingRight),
                bottom: parseFloat(bodyStyle.paddingBottom),
                left: parseFloat(bodyStyle.paddingLeft),
            };
            return {
                width: contentRect.width + padding.left + padding.right,
                height: contentRect.height + padding.top + padding.bottom
            };
        });
        if (!dimensions || dimensions.width <= 0 || dimensions.height <= 0) {
            throw new Error('Could not determine valid content dimensions. Page might be empty.');
        }
        // 步骤3: ✨ 将视口精确设置为"内容+画框"的完美尺寸
        await page.setViewport({
            width: Math.ceil(dimensions.width),
            height: Math.ceil(dimensions.height),
            deviceScaleFactor: 2
        });
        const htmlDir = dirname(validatedHtmlPath);
        const htmlBasename = basename(validatedHtmlPath, extname(validatedHtmlPath));
        const imageExtension = imageType === 'jpeg' ? 'jpeg' : 'png';
        const imagePath = join(htmlDir, `${htmlBasename}.${imageExtension}`);
        const validatedImagePath = await validatePath(imagePath, workspacePath);
        // 步骤4: ✨ 对这个完美尺寸的视口进行最终截图
        await page.screenshot({
            path: validatedImagePath,
            type: imageType,
            quality: imageType === 'jpeg' ? 90 : undefined,
        });
        return {
            content: [{
                    type: "text",
                    text: `Image rendered successfully to: ${imagePath}`
                }],
            _meta: {
                imagePath: validatedImagePath,
                htmlPath: validatedHtmlPath,
                imageType,
                workspacePath
            }
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
            content: [{
                    type: "text",
                    text: `Error rendering image: ${errorMessage}`
                }],
            isError: true
        };
    }
    finally {
        if (browser) {
            await browser.close();
        }
    }
}
//# sourceMappingURL=renderImageFromHtml.js.map