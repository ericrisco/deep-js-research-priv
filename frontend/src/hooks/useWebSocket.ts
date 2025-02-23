import { useState, useEffect, useCallback } from 'react';

interface ResearchStepMessage {
    step: 'planResearch' | 'tavilySearch' | 'summarizeContent' | 'analyzeGaps' | 'generateStructure' | 'generateDocument' | 'complete';
    data: any;
    timestamp: number;
}

export const useWebSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [sources, setSources] = useState<any[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000');

        ws.onopen = () => {
            setIsConnected(true);
            setError(null);
        };

        ws.onclose = () => {
            setIsConnected(false);
            setIsProcessing(false);
        };

        ws.onerror = (error) => {
            setError('Error en la conexión WebSocket');
            setIsProcessing(false);
            console.error('WebSocket error:', error);
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                
                if (message.type === 'error') {
                    setError(message.message);
                    setIsProcessing(false);
                    return;
                }

                if (message.type === 'connected') {
                    console.log('Connected to research server');
                    return;
                }

                // Handle research step messages
                if (message.step) {
                    // Si el mensaje viene con un texto personalizado, lo usamos directamente
                    if (typeof message.data === 'string' && message.data.includes('...')) {
                        setCurrentStep(message.data);
                    } else {
                        setCurrentStep(message.step);
                    }

                    if (message.step === 'complete') {
                        setResult(typeof message.document === 'string' ? message.document : JSON.stringify(message.document, null, 2));
                        setIsProcessing(false);
                    }
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    const startResearch = useCallback((query: string) => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            setError('No hay conexión con el servidor');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setResult('');
        setSources([]);
        setCurrentStep('');

        socket.send(JSON.stringify({
            type: 'startResearch',
            query
        }));
    }, [socket]);

    return {
        isConnected,
        error,
        currentStep,
        result,
        sources,
        isProcessing,
        startResearch
    };
}; 