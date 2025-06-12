import { z } from 'zod';
export declare const saveHtmlSchema: z.ZodObject<{
    htmlContent: z.ZodString;
    outputPath: z.ZodString;
    fileName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    htmlContent: string;
    outputPath: string;
    fileName: string;
}, {
    htmlContent: string;
    outputPath: string;
    fileName: string;
}>;
export type SaveHtmlArgs = z.infer<typeof saveHtmlSchema>;
export declare function saveHtml(args: SaveHtmlArgs): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
    _meta: {
        filePath: string;
    };
    isError?: undefined;
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError: boolean;
    _meta?: undefined;
}>;
//# sourceMappingURL=saveHtml.d.ts.map