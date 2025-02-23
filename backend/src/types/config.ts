import { RunnableConfig } from "@langchain/core/runnables";

export interface BrainConfig extends RunnableConfig {
    ollamaBaseUrl: string;
    baseUrl?: string;
    thinkingModel: string;
    model?: string;
} 