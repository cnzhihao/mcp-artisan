import { z } from 'zod';
export declare const renderImageFromHtmlSchema: z.ZodObject<{
    htmlPath: z.ZodString;
    imageType: z.ZodDefault<z.ZodEnum<["png", "jpeg"]>>;
}, "strip", z.ZodTypeAny, {
    htmlPath: string;
    imageType: "png" | "jpeg";
}, {
    htmlPath: string;
    imageType?: "png" | "jpeg" | undefined;
}>;
export type RenderImageFromHtmlArgs = z.infer<typeof renderImageFromHtmlSchema>;
export declare function renderImageFromHtml(args: RenderImageFromHtmlArgs): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
    _meta: {
        imagePath: string;
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
//# sourceMappingURL=renderImageFromHtml.d.ts.map