import { ChatOllama } from '@langchain/ollama';
import { PromptTemplate } from '@langchain/core/prompts';
import { config } from '../../config/config';
import { ResearchState } from '../../types/research.state';
import { cleanThinkingTags } from '../../utils/content-cleaner';

export class GenerateDocumentBrain {
    private model: ChatOllama;
    private prompt: PromptTemplate;

    constructor() {
        this.model = new ChatOllama({
            baseUrl: config.ollamaBaseUrl,
            model: config.generationModel,
            temperature: 0
        });

        const templateText = `
            You are a distinguished research document expert tasked with creating a comprehensive and academically rigorous document.
            Your goal is to synthesize the provided information into a detailed research paper that follows academic standards.

            <query>
            {researchQuery}
            </query>

            <summaries>
            {summaries}
            </summaries>

            <structure>
            {structure}
            </structure>

            Follow these academic writing guidelines to create a thorough research document:

            1. Document Organization:
            - Begin with an engaging abstract summarizing the key findings
            - Include a clear introduction stating the research objectives
            - Follow the provided document structure precisely
            - End with a strong conclusion and future research directions

            2. Content Development:
            - Provide in-depth explanations of all technical concepts
            - Include relevant equations, diagrams, or technical specifications
            - Support all claims with evidence from the research
            - Compare and contrast different approaches or methodologies
            - Discuss real-world applications and implications
            - Address potential limitations and challenges

            3. Academic Rigor:
            - Use precise technical terminology consistently
            - Maintain a formal, scholarly tone throughout
            - Cite specific findings and developments from the sources
            - Present balanced arguments with multiple perspectives
            - Discuss the broader impact on the field
            - Identify areas needing further research

            4. Writing Excellence:
            - Provide clear topic sentences for each paragraph
            - Create smooth transitions between sections
            - Use academic language and proper terminology
            - Include detailed examples and case studies
            - Explain complex concepts in a clear, logical manner
            - Ensure each section has sufficient depth and detail

            5. Critical Analysis:
            - Evaluate the strengths and weaknesses of different approaches
            - Discuss potential controversies or debates in the field
            - Analyze the implications of new developments
            - Consider future trends and their impact
            - Provide reasoned recommendations for practitioners

            Respond with a comprehensive markdown document that follows these guidelines and the provided structure.
            Make sure to include all relevant technical details while maintaining readability.`;

        this.prompt = new PromptTemplate({
            template: templateText,
            inputVariables: ["researchQuery", "summaries", "structure"]
        });
    }

    async invoke(state: ResearchState): Promise<Partial<ResearchState>> {
        if (!state.contentSummaries) {
            throw new Error('No content summaries available in state');
        }

        if (!state.documentStructure) {
            throw new Error('No document structure available in state');
        }

        try {
            console.log('\n📄 Generating Final Document...');
            console.log(`Using ${state.contentSummaries.length} summaries and structure as input`);

            const summariesText = state.contentSummaries
                .map(s => `${s.topic}:\n${s.summary}`)
                .join('\n\n');

            const formattedPrompt = await this.prompt.format({
                researchQuery: state.researchQuery,
                summaries: summariesText,
                structure: state.documentStructure
            });

            const response = await this.model.invoke(formattedPrompt);
            const cleanedContent = cleanThinkingTags(response.content.toString());
            
            console.log('Document generated successfully');
            console.log('✅ Document Generation Complete\n');
            
            return {
                researchDocument: cleanedContent
            };
        } catch (error) {
            console.error('Error generating document:', error);
            throw new Error('Failed to generate research document');
        }
    }
} 