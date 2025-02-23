import { WebSocket } from 'ws';
import { createResearchGraph } from '../graph/research.graph';
import { ResearchStepMessage } from '../types/websocket.types';

export class ResearchService {
    private ws: WebSocket;

    constructor(ws: WebSocket) {
        this.ws = ws;
    }

    private sendStepUpdate(step: string, data: any) {
        const message: ResearchStepMessage = {
            step: step as any,
            data,
            timestamp: Date.now()
        };
        this.ws.send(JSON.stringify(message));
    }

    async startResearch(query: string) {
        try {
            const graph = await createResearchGraph();
            let currentStep = "planResearch";

            // Override console.log to capture steps
            const originalConsoleLog = console.log;
            console.log = (...args) => {
                originalConsoleLog(...args);
                
                // Update current step based on log content
                if (typeof args[0] === 'string') {
                    if (args[0].includes('Planning Research')) currentStep = 'planResearch';
                    else if (args[0].includes('Searching with Tavily')) currentStep = 'tavilySearch';
                    else if (args[0].includes('Generating Summaries')) currentStep = 'summarizeContent';
                    else if (args[0].includes('Analyzing Knowledge Gaps')) currentStep = 'analyzeGaps';
                    else if (args[0].includes('Generating Document Structure')) currentStep = 'generateStructure';
                    else if (args[0].includes('Generating Final Document')) currentStep = 'generateDocument';
                }

                this.sendStepUpdate(currentStep, args);
            };

            const result = await graph.invoke({
                researchQuery: query
            });

            // Restore original console.log
            console.log = originalConsoleLog;

            // Send final document
            if (result.researchDocument) {
                this.ws.send(JSON.stringify({
                    step: 'complete',
                    document: result.researchDocument,
                    timestamp: Date.now()
                }));
            }

            return result;
        } catch (error) {
            console.error('Error in research process:', error);
            throw error;
        }
    }
} 