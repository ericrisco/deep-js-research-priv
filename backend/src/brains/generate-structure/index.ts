import { ChatOllama } from '@langchain/ollama';
import { PromptTemplate } from '@langchain/core/prompts';
import { config } from '../../config/config';
import { ResearchState } from '../../types/research.state';
import { cleanThinkingTags } from '../../utils/content-cleaner';

export interface DocumentStructure {
    markdown: string;
}

export class GenerateStructureBrain {
    private model: ChatOllama;
    private prompt: PromptTemplate;

    constructor() {
        this.model = new ChatOllama({
            baseUrl: config.ollamaBaseUrl,
            model: config.thinkingModel,
            temperature: 0
        });

        const templateText = `
            You are a research expert specialized in organizing and structuring academic documents.
            Analyze the research query and available summaries to create a logical document structure.

            <researchQuery>
            {researchQuery}
            </researchQuery>

            <summaries>
            {summaries}
            </summaries>

            Guidelines:
            1. Create a clear hierarchical structure
            2. Use main sections (#) and subsections (##)
            3. Structure should reflect the main topics and subtopics
            4. Include placeholders for content with brief descriptions
            5. Follow academic document organization principles

            Respond ONLY with the markdown structure.
    `;

        this.prompt = new PromptTemplate({
            template: templateText,
            inputVariables: ["researchQuery", "summaries"]
        });
    }

    async invoke(state: ResearchState): Promise<Partial<ResearchState>> {
        if (!state.contentSummaries) {
            throw new Error('No content summaries available in state');
        }

        try {
            console.log('\n📋 Generating Document Structure...');
            console.log(`Using ${state.contentSummaries.length} summaries as input`);

            const summariesText = state.contentSummaries
                .map(s => `${s.topic}:\n${s.summary}`)
                .join('\n\n');

            const formattedPrompt = await this.prompt.format({
                researchQuery: state.researchQuery,
                summaries: summariesText
            });

            const response = await this.model.invoke(formattedPrompt);
            const cleanedContent = cleanThinkingTags(response.content.toString());
            
            console.log('Structure generated successfully');
            console.log('✅ Structure Generation Complete\n');
            
            return {
                documentStructure: cleanedContent
            };
        } catch (error) {
            console.error('Error generating structure:', error);
            throw new Error('Failed to generate document structure');
        }
    }
} 