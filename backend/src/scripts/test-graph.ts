import { createResearchGraph } from '../graph/research.graph';

async function main() {
    try {
        console.log('Testing Research Graph\n');
        
        const graph = await createResearchGraph();
        
        console.log('Executing research workflow...\n');
        const result = await graph.invoke({
            researchQuery: "What are the implications of quantum computing on cryptography?"
        });

        console.log('Research Results:\n');
        
        if (result.searchPlan) {
            console.log('Search Plan:');
            console.log(JSON.stringify(result.searchPlan, null, 2));
            console.log();
        }

        if (result.contentSummaries) {
            console.log('Content Summaries:');
            console.log(JSON.stringify(result.contentSummaries, null, 2));
            console.log();
        }

        if (result.gapAnalysis) {
            console.log('Gap Analysis:');
            console.log(JSON.stringify(result.gapAnalysis, null, 2));
            console.log();
        }

        if (result.documentStructure) {
            console.log('Document Structure:');
            console.log(result.documentStructure);
            console.log();
        }

        if (result.researchDocument) {
            console.log('Final Document:');
            console.log(result.researchDocument);
        }
    } catch (error) {
        console.error('Error testing research graph:', error);
        process.exit(1);
    }
}

main(); 