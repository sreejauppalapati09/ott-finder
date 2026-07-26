import React from 'react';
import { FavoriteItem } from '../types';

interface FavoritesListProps {
    favorites: FavoriteItem[];
    onSelect: (item: FavoriteItem) => void;
    onRemove: (title: string, year: number) => void;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onSelect, onRemove }) => {
    if (favorites.length === 0) {
        return (
            <div className="text-center text-gray-400 mt-8 bg-gray-800/50 p-6 rounded-2xl border border-gray-700 animate-fade-in">
                <p className="text-lg">No favorites yet.</p>
                <p className="mt-2 text-sm">Search for a title and tap the heart icon to save it here.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fade-in">
            {favorites.map((item) => (
                <div
                    key={`${item.title.toLowerCase()}-${item.year}`}
                    onClick={() => onSelect(item)}
                    className="group relative bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:border-purple-500 transition-colors duration-200"
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(item.title, item.year);
                        }}
                        aria-label={`Remove ${item.title} from favorites`}
                        className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center bg-gray-900/70 rounded-full text-gray-300 hover:text-red-400 hover:bg-gray-900 transition-colors"
                    >
                        &times;
                    </button>
                    <div className="aspect-[2/3] bg-gray-900 flex items-center justify-center">
                        {item.posterUrl ? (
                            <img
                                src={item.posterUrl}
                                alt={`Poster for ${item.title}`}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                        ) : (
                            <span className="text-gray-600 text-sm p-3 text-center">{item.title}</span>
                        )}
                    </div>
                    <div className="p-3">
                        <p className="font-semibold text-gray-100 truncate" title={item.title}>{item.title}</p>
                        <p className="text-xs text-gray-400">{item.year} &middot; {item.country}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
