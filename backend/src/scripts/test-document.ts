import { GenerateDocumentBrain } from '../brains/generate-document';
import { ContentSummary } from '../types/research.state';

const mockStructure = `# Implications of Quantum Computing on Cryptography

## Overview of Quantum Computing and Cryptography
- **Quantum Computing Basics**: Brief introduction to quantum computing, including its potential advantages over classical computing.
- **Cryptography Basics**: Explanation of traditional cryptographic methods and their reliance on mathematical problems.

## Impact of Quantum Computing on Current Cryptographic Systems
- **Vulnerability of RSA and ECC**: Detailed discussion on how quantum computers threaten existing encryption algorithms due to their ability to solve certain mathematical problems efficiently.

## Development of Post-Quantum Cryptography
- **Emerging Algorithms**: Overview of new cryptographic methods designed to withstand quantum computing attacks.
- **Standardization Efforts**: Mention of organizations like NIST and their role in promoting the adoption of post-quantum cryptography.

## Challenges in Quantum Computer Implementation
- **Technical Hurdles**: Explanation of engineering challenges faced by researchers, such as qubit coherence and error rates.
- **Research Approaches**: Description of different methods being explored to build stable quantum systems, including superconducting circuits and trapped ions.`;

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
        console.log('Testing Document Generation\n');
        console.log('Input Summaries:');
        console.log(JSON.stringify(mockSummaries, null, 2));
        console.log('\nDocument Structure:');
        console.log(mockStructure);
        console.log('\nGenerating document...\n');

        const brain = new GenerateDocumentBrain();
        const result = await brain.invoke({
            researchQuery: "What are the implications of quantum computing on cryptography?",
            contentSummaries: mockSummaries,
            documentStructure: mockStructure
        });

        if (result.researchDocument) {
            console.log('Generated Document:');
            console.log(result.researchDocument);
        }
    } catch (error) {
        console.error('Error testing document generation:', error);
        process.exit(1);
    }
}

main(); 