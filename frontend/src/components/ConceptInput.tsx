'use client';

import { useState } from 'react';

interface ConceptInputProps {
    onSubmit: (concept: string) => void;
    isProcessing: boolean;
}

export const ConceptInput = ({ onSubmit, isProcessing }: ConceptInputProps) => {
    const [concept, setConcept] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (concept.trim() && !isProcessing) {
            onSubmit(concept.trim());
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-20">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        value={concept}
                        onChange={(e) => setConcept(e.target.value)}
                        placeholder="Introduce el concepto a investigar..."
                        disabled={isProcessing}
                        className="w-full px-6 py-4 text-lg rounded-lg bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:border-[#FFE500] focus:outline-none transition-colors disabled:bg-white/5 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={!concept.trim() || isProcessing}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#FFE500] text-black font-bold rounded-lg hover:bg-[#FFE500]/90 transition-colors disabled:bg-white/20 disabled:text-white/50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Procesando...' : 'Investigar'}
                    </button>
                </div>
            </form>
        </div>
    );
}; 