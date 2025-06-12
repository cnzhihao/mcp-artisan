import { z } from 'zod';
export declare const findRelevantPromptSchema: z.ZodObject<{
    userInput: z.ZodString;
    promptsPath: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userInput: string;
    promptsPath: string;
}, {
    userInput: string;
    promptsPath: string;
}>;
export type FindRelevantPromptArgs = z.infer<typeof findRelevantPromptSchema>;
export declare function findRelevantPrompt(args: FindRelevantPromptArgs): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
    _meta: {
        promptPath: string;
        score: number;
        fileName: string;
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
//# sourceMappingURL=findRelevantPrompt.d.ts.map