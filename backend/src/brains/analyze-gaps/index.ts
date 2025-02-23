import { ChatOllama } from '@langchain/ollama';
import { PromptTemplate } from '@langchain/core/prompts';
import { config } from '../../config/config';
import { ResearchState } from '../../types/research.state';

export interface GapAnalysis {
    knowledgeGap: string;
    followUpQuery: string;
}

export class AnalyzeGapsBrain {
    private model: ChatOllama;
    private prompt: PromptTemplate;

    constructor() {
        this.model = new ChatOllama({
            baseUrl: config.ollamaBaseUrl,
            model: config.generationModel,
            format: 'json',
            temperature: 0
        });

        this.prompt = PromptTemplate.fromTemplate(`
            You are a research expert specialized in identifying knowledge gaps and generating insightful follow-up questions.
            Analyze the summaries and identify areas that need deeper exploration, focusing on technical details, implementation specifics, or emerging trends.

            <researchQuery>
            {researchQuery}
            </researchQuery>

            <summaries>
            {summaries}
            </summaries>

            Consider:
            1. What technical details or implementation specifics are missing?
            2. Which emerging trends or future developments need more exploration?
            3. What practical implications or real-world applications need clarification?
            4. Are there any contradictions or unclear points in the current information?

            Respond ONLY with a JSON object in this exact format:
            {{
                "knowledgeGap": "detailed description of what information is missing or needs clarification",
                "followUpQuery": "specific search query that would help address this gap"
            }}`
        );
    }

    async invoke(state: ResearchState): Promise<Partial<ResearchState>> {
        if (!state.contentSummaries) {
            throw new Error('No content summaries available in state');
        }

        try {
            console.log('\n🔍 Analyzing Knowledge Gaps...');
            console.log(`Analyzing ${state.contentSummaries.length} summaries`);

            const summariesText = state.contentSummaries
                .map(s => `${s.topic}:\n${s.summary}`)
                .join('\n\n');

            const formattedPrompt = await this.prompt.format({
                researchQuery: state.researchQuery,
                summaries: summariesText
            });

            const response = await this.model.invoke(formattedPrompt);
            const analysis = JSON.parse(response.content.toString());
            
            const gapAnalysis = {
                ...analysis,
                analysisCount: (state.gapAnalysis?.analysisCount ?? 0) + 1
            };
            
            console.log('Identified Gap:', gapAnalysis.knowledgeGap);
            console.log('Follow-up Query:', gapAnalysis.followUpQuery);
            console.log('Analysis Count:', gapAnalysis.analysisCount);
            console.log('✅ Gap Analysis Complete\n');
            
            return {
                gapAnalysis
            };
        } catch (error) {
            console.error('Error analyzing gaps:', error);
            throw new Error('Failed to analyze knowledge gaps');
        }
    }
} 