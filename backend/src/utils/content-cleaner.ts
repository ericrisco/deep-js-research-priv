export function cleanThinkingTags(content: string): string {
    return content
        .replace(/<think>[\s\S]*?<\/think>/g, '')
        .replace(/^```json\s*/, '')
        .replace(/```\s*$/, '')
        .trim();
} 