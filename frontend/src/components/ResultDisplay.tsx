'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ResultDisplayProps {
    result: string;
    isVisible: boolean;
}

export const ResultDisplay = ({ result, isVisible }: ResultDisplayProps) => {
    if (!isVisible) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mt-8">
            <div className="bg-white/10 rounded-xl border-2 border-white/20 p-6">
                <h2 className="text-2xl font-semibold mb-4 text-[#FFE500]">Resultado del Análisis</h2>
                <div className="prose prose-lg prose-invert max-w-none">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 text-white" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-3 text-white" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-xl font-bold mb-2 text-white" {...props} />,
                            p: ({node, ...props}) => <p className="mb-4 text-white/90" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4" {...props} />,
                            li: ({node, ...props}) => <li className="mb-2 text-white/90" {...props} />,
                            a: ({node, ...props}) => (
                                <a 
                                    className="text-[#FFE500] hover:text-[#FFE500]/80 hover:underline" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    {...props}
                                />
                            ),
                            code: ({node, className, ...props}) => (
                                className?.includes('language-')
                                    ? <code className="block bg-white/10 rounded p-4 mb-4 overflow-x-auto" {...props} />
                                    : <code className="bg-white/10 rounded px-1 py-0.5" {...props} />
                            ),
                            blockquote: ({node, ...props}) => (
                                <blockquote 
                                    className="border-l-4 border-[#FFE500] pl-4 italic mb-4 text-white/70"
                                    {...props}
                                />
                            ),
                            hr: ({node, ...props}) => <hr className="border-white/20 my-8" {...props} />,
                        }}
                    >
                        {result}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}; 