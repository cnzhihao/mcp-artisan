import { z } from 'zod';
export declare const saveHtmlSchema: z.ZodObject<{
    htmlContent: z.ZodString;
    subfolderName: z.ZodString;
    fileName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    htmlContent: string;
    subfolderName: string;
    fileName: string;
}, {
    htmlContent: string;
    subfolderName: string;
    fileName: string;
}>;
export type SaveHtmlArgs = z.infer<typeof saveHtmlSchema>;
export declare function saveHtml(args: SaveHtmlArgs, workspacePath: string): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
    _meta: {
        absolutePath: string;
        relativePath: string;
        subfolderName: string;
        fileName: string;
        workspacePath: string;
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