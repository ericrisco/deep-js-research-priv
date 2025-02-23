'use client';

interface Source {
    id: string;
    title: string;
    url?: string;
}

interface SourcesListProps {
    sources: Source[];
    isVisible: boolean;
}

export const SourcesList = ({ sources, isVisible }: SourcesListProps) => {
    if (!isVisible || sources.length === 0) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 mb-16">
            <div className="bg-white/10 rounded-xl border-2 border-white/20 p-6">
                <h2 className="text-2xl font-semibold mb-4 text-[#FFE500]">Fuentes</h2>
                <ul className="space-y-3">
                    {sources.map((source) => (
                        <li key={source.id} className="flex items-start">
                            <span className="flex-shrink-0 w-4 h-4 mt-1 mr-3">
                                <svg className="w-4 h-4 text-[#FFE500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                            {source.url ? (
                                <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#FFE500] hover:text-[#FFE500]/80 hover:underline"
                                >
                                    {source.title}
                                </a>
                            ) : (
                                <span className="text-white/90">{source.title}</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}; 