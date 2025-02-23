'use client';

import { useState, useEffect } from 'react';

interface ThinkingProcessProps {
    isVisible: boolean;
    currentStep: string;
}

const steps = {
    planResearch: '🤔 Planificando la investigación...',
    tavilySearch: '🔍 Buscando información relevante...',
    summarizeContent: '📝 Generando resúmenes...',
    analyzeGaps: '🧩 Analizando brechas de conocimiento...',
    generateStructure: '🏗️ Generando estructura del documento...',
    generateDocument: '📄 Generando documento final...',
    complete: '✅ Investigación completada'
};

export const ThinkingProcess = ({ isVisible, currentStep }: ThinkingProcessProps) => {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isVisible && currentStep !== 'complete') {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isVisible, currentStep]);

    useEffect(() => {
        if (!isVisible) {
            setElapsedTime(0);
        }
    }, [isVisible]);

    if (!isVisible) return null;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getMessage = () => {
        if (!currentStep) return 'Procesando tu concepto...';
        
        if (currentStep === 'complete') {
            return steps.complete;
        }

        // Si el currentStep ya viene con el mensaje completo del servidor
        if (currentStep.includes('...')) {
            return `${currentStep} (${formatTime(elapsedTime)})`;
        }

        // Si no, usamos nuestro mapping predefinido
        return `${steps[currentStep as keyof typeof steps] || 'Procesando tu concepto...'} (${formatTime(elapsedTime)})`;
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white/10 rounded-xl border-2 border-white/20">
            <div className="flex items-center justify-center space-x-4">
                <div className="w-3 h-3 bg-[#FFE500] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-[#FFE500] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-[#FFE500] rounded-full animate-bounce"></div>
            </div>
            <p className="text-center mt-4 text-white/70">
                {getMessage()}
            </p>
        </div>
    );
}; 