import { readdir, readFile, stat } from 'fs/promises';
import { join, extname } from 'path';
import { z } from 'zod';
export const findRelevantPromptSchema = z.object({
    userInput: z.string(),
    promptsPath: z.string()
});
// Simple text similarity function using word overlap
function calculateSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const words2 = text2.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    if (words1.length === 0 || words2.length === 0)
        return 0;
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set([...set1].filter(word => set2.has(word)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size; // Jaccard similarity
}
export async function findRelevantPrompt(args) {
    try {
        // Check if prompts directory exists
        const promptsStats = await stat(args.promptsPath);
        if (!promptsStats.isDirectory()) {
            throw new Error(`Prompts path is not a directory: ${args.promptsPath}`);
        }
        // Read all files in the prompts directory
        const files = await readdir(args.promptsPath);
        // Filter for text files (common prompt file extensions)
        const promptFiles = files.filter(file => {
            const ext = extname(file).toLowerCase();
            return ['.txt', '.md', '.prompt', '.text'].includes(ext);
        });
        if (promptFiles.length === 0) {
            throw new Error(`No prompt files found in directory: ${args.promptsPath}`);
        }
        // Score each file based on filename and content similarity
        const scores = [];
        for (const file of promptFiles) {
            const filePath = join(args.promptsPath, file);
            try {
                // Read file content
                const content = await readFile(filePath, 'utf8');
                // Calculate similarity scores
                const filenameScore = calculateSimilarity(args.userInput, file);
                const contentScore = calculateSimilarity(args.userInput, content);
                // Weighted combination: filename gets 30%, content gets 70%
                const totalScore = (filenameScore * 0.3) + (contentScore * 0.7);
                scores.push({
                    file,
                    path: filePath,
                    score: totalScore
                });
            }
            catch (error) {
                // Skip files that can't be read
                console.error(`Warning: Could not read file ${filePath}: ${error}`);
                continue;
            }
        }
        if (scores.length === 0) {
            throw new Error(`No readable prompt files found in directory: ${args.promptsPath}`);
        }
        // Sort by score (highest first) and return the best match
        scores.sort((a, b) => b.score - a.score);
        const bestMatch = scores[0];
        return {
            content: [{
                    type: "text",
                    text: `Found most relevant prompt: ${bestMatch.file} (similarity score: ${bestMatch.score.toFixed(3)})`
                }],
            _meta: {
                promptPath: bestMatch.path,
                score: bestMatch.score,
                fileName: bestMatch.file
            }
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
            content: [{
                    type: "text",
                    text: `Error finding relevant prompt: ${errorMessage}`
                }],
            isError: true
        };
    }
}
//# sourceMappingURL=findRelevantPrompt.js.map