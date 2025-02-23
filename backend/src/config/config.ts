import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || '/api/v1',
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    tavilyApiKey: process.env.TAVILY_API_KEY,
    generationModel: process.env.GENERATION_MODEL || 'mistral-small:22b',
    thinkingModel: process.env.THINKING_MODEL || 'deepseek-r1:8b',
    maxAnalysisCount: Number(process.env.MAX_ANALYSIS_COUNT || 2),
    maxResults: Number(process.env.MAX_RESULTS || 5)
} as const;
