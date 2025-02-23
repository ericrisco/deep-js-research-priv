import { SummarizeContentBrain } from '../brains/summarize-content';
import { TavilySearchTool } from '../toolbelt/tavily.tool';

const mockSearchPlan = "quantum computing cryptography impact RSA encryption post-quantum cryptography academic research";

async function main() {
    try {
        console.log('Testing Content Pipeline\n');
        
        // First, search and extract content with Tavily
        console.log('1. Searching with Tavily...\n');
        const tavilyTool = new TavilySearchTool();
        const tavilyResult = await tavilyTool.invoke({
            researchQuery: mockSearchPlan,
            searchPlan: mockSearchPlan
        });

        if (!tavilyResult.topicContent) {
            throw new Error('No content found by Tavily');
        }

        console.log(`Found ${tavilyResult.topicContent.sources.length} sources\n`);

        // Then, summarize the content
        console.log('2. Generating summaries...\n');
        const brain = new SummarizeContentBrain();
        const result = await brain.invoke({
            researchQuery: mockSearchPlan,
            searchPlan: mockSearchPlan,
            topicContent: tavilyResult.topicContent
        });

        console.log('Generated Summaries:');
        console.log(JSON.stringify(result.contentSummaries, null, 2));
    } catch (error) {
        console.error('Error in pipeline:', error);
        process.exit(1);
    }
}

main(); 