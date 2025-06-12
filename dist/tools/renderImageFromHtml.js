import puppeteer from 'puppeteer';
import { readFile } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { z } from 'zod';
export const renderImageFromHtmlSchema = z.object({
    htmlPath: z.string(),
    imageType: z.enum(['png', 'jpeg']).default('png')
});
export async function renderImageFromHtml(args) {
    let browser;
    try {
        // Check if HTML file exists and read it
        const htmlContent = await readFile(args.htmlPath, 'utf8');
        // Launch browser
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        // Set viewport size for consistent rendering
        await page.setViewport({ width: 1200, height: 800 });
        // Set content and wait for load
        await page.setContent(htmlContent, {
            waitUntil: ['networkidle0', 'domcontentloaded'],
            timeout: 10000
        });
        // Generate image path in same directory as HTML
        const htmlDir = dirname(args.htmlPath);
        const htmlBasename = basename(args.htmlPath, extname(args.htmlPath));
        const imageExtension = args.imageType === 'jpeg' ? 'jpg' : 'png';
        const imagePath = join(htmlDir, `${htmlBasename}.${imageExtension}`);
        // Take screenshot
        await page.screenshot({
            path: imagePath,
            type: args.imageType,
            fullPage: true,
            quality: args.imageType === 'jpeg' ? 90 : undefined
        });
        return {
            content: [{
                    type: "text",
                    text: `Image rendered successfully to: ${imagePath}`
                }],
            _meta: {
                imagePath
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