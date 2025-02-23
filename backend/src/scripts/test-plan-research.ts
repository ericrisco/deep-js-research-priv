import { PlanResearchBrain } from '../brains/plan-research';

const researchQuery = process.argv[2] || "What are the main implications of quantum computing in cybersecurity?";

async function main() {
    try {
        console.log(`Planning research for: "${researchQuery}"\n`);
        
        const brain = new PlanResearchBrain();
        const result = await brain.invoke({ researchQuery });

        console.log('Search Plan:');
        console.log(JSON.stringify(result.searchPlan, null, 2));
    } catch (error) {
        console.error('Error testing plan research:', error);
        process.exit(1);
    }
}

main(); 