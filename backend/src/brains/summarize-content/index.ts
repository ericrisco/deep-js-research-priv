import { ChatOllama } from '@langchain/ollama';
import { PromptTemplate } from '@langchain/core/prompts';
import { config } from '../../config/config';
import { ResearchState, TopicContent, ContentSummary } from '../../types/research.state';

export class SummarizeContentBrain {
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
            Generate a high-quality summary of the web search results and keep it concise / related to the user topic.

            When creating a NEW summary:
            1. Highlight the most relevant information related to the user topic from the search results
            2. Ensure a coherent flow of information

            When EXTENDING an existing summary:                                                                                                                 
            1. Read the existing summary and new search results carefully.                                                    
            2. Compare the new information with the existing summary.                                                         
            3. For each piece of new information:                                                                             
                a. If it's related to existing points, integrate it into the relevant paragraph.                               
                b. If it's entirely new but relevant, add a new paragraph with a smooth transition.                            
                c. If it's not relevant to the user topic, skip it.                                                            
            4. Ensure all additions are relevant to the user's topic.                                                         
            5. Verify that your final output differs from the input summary. 

            <topic>
            {topic}
            </topic>

            <content>
            {content}
            </content>

            Respond ONLY with a JSON object in this exact format:
            {{
                "topic": "{topic}",
                "summary": "a comprehensive summary focused on the topic"
            }}`
        );
    }

    private async summarizeSource(topic: string, content: string): Promise<ContentSummary> {
        const formattedPrompt = await this.prompt.format({ 
            topic,
            content
        });
        const response = await this.model.invoke(formattedPrompt);
        return JSON.parse(response.content.toString());
    }

    async invoke(state: ResearchState): Promise<Partial<ResearchState>> {
        if (!state.topicContent) {
            throw new Error('No topic content available in state');
        }

        try {
            console.log('\n📝 Generating Summaries...');
            console.log(`Processing ${state.topicContent.sources.length} sources`);

            // Process each source in parallel
            const summaryPromises = state.topicContent.sources.map(source => 
                this.summarizeSource(state.topicContent!.topic, source.content)
            );

            const summaries = await Promise.all(summaryPromises);
            console.log(`Generated ${summaries.length} summaries`);
            console.log('✅ Summarization Complete\n');

            return {
                contentSummaries: summaries
            };
        } catch (error) {
            console.error('Error generating summaries:', error);
            throw new Error('Failed to generate content summaries');
        }
    }
} 