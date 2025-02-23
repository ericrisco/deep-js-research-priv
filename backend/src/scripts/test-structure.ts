import { GenerateStructureBrain } from '../brains/generate-structure';
import { ContentSummary } from '../types/research.state';

const mockSummaries: ContentSummary[] = [
    {
        topic: "quantum computing cryptography impact",
        summary: "Quantum computing poses a significant threat to current cryptographic systems, particularly RSA. The fundamental security of these systems relies on the computational difficulty of factoring large numbers, which quantum computers could potentially solve efficiently. This capability could render current encryption methods vulnerable."
    },
    {
        topic: "quantum computing cryptography impact",
        summary: "The cryptographic community is developing post-quantum cryptography solutions to address the quantum threat. These new algorithms are designed to be resistant to both quantum and classical computing attacks. NIST is leading standardization efforts for these new methods."
    },
    {
        topic: "quantum computing implementation challenges",
        summary: "Current quantum computers face significant engineering challenges, including maintaining qubit coherence and minimizing error rates. Researchers are exploring various approaches like superconducting circuits and trapped ions to build more stable quantum systems."
    }
];

async function main() {
    try {
        console.log('Testing Structure Generation\n');
        console.log('Input Summaries:');
        console.log(JSON.stringify(mockSummaries, null, 2));
        console.log('\nGenerating structure...\n');

        const brain = new GenerateStructureBrain();
        const result = await brain.invoke({
            researchQuery: "What are the implications of quantum computing on cryptography?",
            contentSummaries: mockSummaries
        });

        if (result.documentStructure) {
            console.log('Generated Structure:');
            console.log(result.documentStructure);
        }
    } catch (error) {
        console.error('Error testing structure generation:', error);
        process.exit(1);
    }
}

main(); 