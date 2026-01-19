
import React from 'react';
import { SearchResult, GroundingChunk } from '../types';
import { PlatformLogo } from './PlatformLogo';

interface ResultCardProps {
    result: SearchResult;
    sources: GroundingChunk[];
    posterUrl: string | null;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, sources, posterUrl }) => {
    const renderStatusBadge = () => {
        switch (result.status) {
            case 'streaming':
                return <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold uppercase tracking-widest">Streaming Now</span>;
            case 'coming_soon':
                return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-bold uppercase tracking-widest">Coming Soon</span>;
            case 'theaters_only':
                return <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold uppercase tracking-widest">In Theaters Only</span>;
            default:
                return null;
        }
    };

    const content = (
        <div className="flex-grow p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-3">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                    {result.title}
                    {result.year && <span className="text-2xl text-gray-400 font-normal ml-2">({result.year})</span>}
                </h2>
                {renderStatusBadge()}
            </div>
            
            <p className="text-gray-300 mb-6">{result.summary}</p>
            
            {result.status === 'streaming' && (
                <div>
                    <h3 className="text-xl font-semibold text-gray-200 mb-4">Available on:</h3>
                    {result.platforms && result.platforms.length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                            {result.platforms.map((platform, index) => {
                                const platformContent = (
                                    <div className="flex items-center gap-3 bg-gray-700/60 p-3 rounded-lg h-full transition-colors duration-200 group-hover:bg-gray-700">
                                        <PlatformLogo platformName={platform.name} />
                                        <span className="font-medium text-gray-100">{platform.name}</span>
                                    </div>
                                );

                                if (platform.url) {
                                    return (
                                        <a
                                            key={index}
                                            href={platform.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-lg"
                                            aria-label={`Find ${result.title} on ${platform.name}`}
                                        >
                                            {platformContent}
                                        </a>
                                    );
                                }
                                return <div key={index}>{platformContent}</div>;
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-400 italic">No specific platforms identified in our real-time scan.</p>
                    )}
                </div>
            )}

            {(result.status === 'coming_soon' || result.status === 'theaters_only') && (
                <div className="bg-gray-900/40 border border-gray-700 p-5 rounded-xl mb-6">
                    <h3 className="text-lg font-bold text-gray-200 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        OTT Release Info
                    </h3>
                    <div className="space-y-2">
                        {result.expectedPlatform && (
                            <p className="text-gray-300">Expected to stream on: <span className="text-cyan-400 font-semibold">{result.expectedPlatform}</span></p>
                        )}
                        {result.expectedDate && (
                            <p className="text-gray-300">Estimated date: <span className="text-purple-400 font-semibold">{result.expectedDate}</span></p>
                        )}
                        {!result.expectedDate && !result.expectedPlatform && (
                            <p className="text-gray-400 italic">No official streaming announcement yet. Currently exclusive to theaters.</p>
                        )}
                    </div>
                </div>
            )}

            {sources && sources.length > 0 && (
                 <div className="mt-8 pt-6 border-t border-gray-700">
                    <h4 className="text-md font-semibold text-gray-400 mb-3">Grounding Sources:</h4>
                    <ul className="list-disc list-inside space-y-2">
                        {sources.map((source, index) => (
                            <li key={index} className="text-sm">
                                <a 
                                    href={source.web.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                                >
                                    {source.web.title || new URL(source.web.uri).hostname}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-lg overflow-hidden animate-fade-in flex flex-col md:flex-row">
            {posterUrl && (
                <div className="md:w-1/3 flex-shrink-0 bg-gray-900 min-h-[300px]">
                    <img 
                        src={posterUrl} 
                        alt={`Poster for ${result.title}`}
                        className="w-full h-full object-cover" 
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                </div>
            )}
            <div className={posterUrl ? "md:w-2/3" : "w-full"}>
                {content}
            </div>
        </div>
    );
};
