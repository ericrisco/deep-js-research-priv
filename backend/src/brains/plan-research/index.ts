import { ChatOllama } from '@langchain/ollama';
import { PromptTemplate } from '@langchain/core/prompts';
import { config } from '../../config/config';
import { ResearchState } from '../../types/research.state';
import { cleanThinkingTags } from '../../utils/content-cleaner';

export class PlanResearchBrain {
    private model: ChatOllama;
    private prompt: PromptTemplate;

    constructor() {
        this.model = new ChatOllama({
            baseUrl: config.ollamaBaseUrl,
            model: config.thinkingModel,
            temperature: 0
        });

        this.prompt = PromptTemplate.fromTemplate(`
            You are a research expert specialized in creating optimized search queries.
            Given a research query, you need to create a search query that will help find the most relevant and comprehensive information.
            
            Consider:
            1. Use specific technical terms related to the topic
            2. Include key concepts that must be covered
            3. Focus on academic and professional sources
            4. Think about what would make an excellent, in-depth research document
            
            <query>
            {researchQuery}
            </query>
            
            Respond ONLY with the search query, nothing else.
        `);
    }

    async invoke(state: ResearchState): Promise<Partial<ResearchState>> {
        try {
            console.log('\n🧠 Planning Research...');
            console.log('Input Query:', state.researchQuery);

            const formattedPrompt = await this.prompt.format({ 
                researchQuery: state.researchQuery 
            });
            const response = await this.model.invoke(formattedPrompt);
            const searchPlan = response.content.toString();

            const cleanedContent = cleanThinkingTags(searchPlan);
            
            console.log('Generated Search Plan:', cleanedContent);
            console.log('✅ Planning Complete\n');
            
            return {
                searchPlan: cleanedContent
            };
        } catch (error) {
            console.error('Error generating search plan:', error);
            throw new Error('Failed to generate search plan');
        }
    }
} 