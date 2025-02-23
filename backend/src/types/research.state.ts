export interface TopicContent {
    topic: string;
    sources: Array<{
        url: string;
        content: string;
    }>;
}

export interface ContentSummary {
    topic: string;
    summary: string;
}

export interface GapAnalysis {
    knowledgeGap: string;
    followUpQuery: string;
    analysisCount: number;
}

export type ResearchState = {
    researchQuery: string;
    searchPlan?: string;
    topicContent?: TopicContent;
    contentSummaries?: ContentSummary[];
    gapAnalysis?: GapAnalysis;
    documentStructure?: string;
    researchDocument?: string;
};

export const InputStateSchema = {
    researchQuery: "string"
} as const;

export const OutputStateSchema = {
    searchPlan: "object",
    topicContent: "object",
    contentSummaries: "array",
    gapAnalysis: "object",
    documentStructure: "object",
    researchDocument: "object"
} as const;

export const ResearchStateSchema = {
    ...InputStateSchema,
    ...OutputStateSchema
} as const; 