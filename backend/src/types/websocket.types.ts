export type ResearchStep = 
    | "planResearch" 
    | "tavilySearch" 
    | "summarizeContent" 
    | "analyzeGaps" 
    | "generateStructure" 
    | "generateDocument";

export interface ResearchStepMessage {
    step: ResearchStep;
    data: any;
    timestamp: number;
}

export interface ResearchCompleteMessage {
    type: 'complete';
    document: string;
    timestamp: number;
} 