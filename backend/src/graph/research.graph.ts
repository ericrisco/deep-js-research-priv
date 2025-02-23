import { END, StateGraph } from "@langchain/langgraph";
import { ResearchState } from "../types/research.state";
import { PlanResearchBrain } from "../brains/plan-research";
import { TavilySearchTool } from "../toolbelt/tavily.tool";
import { SummarizeContentBrain } from "../brains/summarize-content";
import { AnalyzeGapsBrain } from "../brains/analyze-gaps";
import { GenerateStructureBrain } from "../brains/generate-structure";
import { GenerateDocumentBrain } from "../brains/generate-document";
import { makeRunnable } from "../utils/runnable-adapter";
import { config } from "../config/config";

export async function createResearchGraph() {
    const graph = new StateGraph<ResearchState>({
        channels: {
            researchQuery: { value: null },
            searchPlan: { value: null },
            topicContent: { value: null },
            contentSummaries: { value: null },
            gapAnalysis: { value: null },
            documentStructure: { value: null },
            researchDocument: { value: null }
        }
    });

    // Initialize nodes
    const planResearch = makeRunnable(new PlanResearchBrain());
    const tavilySearch = makeRunnable(new TavilySearchTool());
    const summarizeContent = makeRunnable(new SummarizeContentBrain());
    const analyzeGaps = makeRunnable(new AnalyzeGapsBrain());
    const generateStructure = makeRunnable(new GenerateStructureBrain());
    const generateDocument = makeRunnable(new GenerateDocumentBrain());

    // Add nodes to graph
    graph.addNode("planResearch", planResearch);
    graph.addNode("tavilySearch", tavilySearch);
    graph.addNode("summarizeContent", summarizeContent);
    graph.addNode("analyzeGaps", analyzeGaps);
    graph.addNode("generateStructure", generateStructure);
    graph.addNode("generateDocument", generateDocument);

    // Define edges
    // 1. Initial research planning
    graph.addEdge("planResearch", "tavilySearch");

    // 2. First search and summarization
    graph.addEdge("tavilySearch", "summarizeContent");
    graph.addEdge("summarizeContent", "analyzeGaps");

    // 3. Gap analysis and follow-up search
    graph.addConditionalEdges(
        "analyzeGaps",
        (state: ResearchState) => {
            console.log('Gap Analysis:', state.gapAnalysis);
            const hasFollowUp = state.gapAnalysis?.followUpQuery;
            const isUnderLimit = (state.gapAnalysis?.analysisCount ?? 0) < config.maxAnalysisCount;
            
            console.log(`Analysis count: ${state.gapAnalysis?.analysisCount ?? 0}/${config.maxAnalysisCount}`);
            
            return hasFollowUp && isUnderLimit ? "tavilySearch" : "generateStructure";
        },
        {
            tavilySearch: "tavilySearch",
            generateStructure: "generateStructure"
        }
    );

    // 4. Structure and document generation
    graph.addEdge("generateStructure", "generateDocument");
    graph.addEdge("generateDocument", END);

    // Set entry point
    graph.setEntryPoint("planResearch");

    // Compile graph
    return graph.compile();
}