import { AnalyzeGapsBrain } from '../brains/analyze-gaps';
import { ContentSummary } from '../types/research.state';

const mockSummaries: ContentSummary[] = [
    {
        topic: "quantum computing cryptography impact",
        summary: "Quantum computing poses a significant threat to current cryptographic systems, particularly RSA. The fundamental security of these systems relies on the computational difficulty of factoring large numbers, which quantum computers could potentially solve efficiently. This capability could render current encryption methods vulnerable."
    },
    {
        topic: "quantum computing cryptography impact",
        summary: "The cryptographic community is developing post-quantum cryptography solutions to address the quantum threat. These new algorithms are designed to be resistant to both quantum and classical computing attacks. NIST is leading standardization efforts for these new methods."
    }
];

async function main() {
    try {
        console.log('Testing Gap Analysis\n');
        console.log('Input Summaries:');
        console.log(JSON.stringify(mockSummaries, null, 2));
        console.log('\nAnalyzing gaps...\n');

        const brain = new AnalyzeGapsBrain();
        const result = await brain.invoke({
            researchQuery: "What are the implications of quantum computing on cryptography?",
            contentSummaries: mockSummaries
        });

        console.log('Gap Analysis:');
        console.log(JSON.stringify(result.gapAnalysis, null, 2));
    } catch (error) {
        console.error('Error testing gap analysis:', error);
        process.exit(1);
    }
}

main(); 