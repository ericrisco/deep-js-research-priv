import { TavilySearchTool } from '../toolbelt/tavily.tool';

const mockSearchPlan = "quantum computing cryptography impact RSA encryption post-quantum cryptography academic research";

async function main() {
    try {
        console.log('Testing Tavily Search with search plan\n');
        console.log('Search Plan:');
        console.log(JSON.stringify(mockSearchPlan, null, 2));
        console.log('\nSearching and extracting content...\n');

        const tavilyTool = new TavilySearchTool();
        const result = await tavilyTool.invoke({
            researchQuery: mockSearchPlan,
            searchPlan: mockSearchPlan
        });

        console.log('Topic Content:');
        console.log(JSON.stringify(result.topicContent, null, 2));
    } catch (error) {
        console.error('Error testing Tavily:', error);
        process.exit(1);
    }
}

main(); 