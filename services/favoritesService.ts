import { FavoriteItem } from '../types';

const STORAGE_KEY = 'ott-finder:favorites';

const makeKey = (title: string, year: number): string => `${title.trim().toLowerCase()}::${year}`;

const readAll = (): FavoriteItem[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error("Error reading favorites from localStorage:", error);
        return [];
    }
};

const writeAll = (items: FavoriteItem[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
        console.error("Error writing favorites to localStorage:", error);
    }
};

export const getFavorites = (): FavoriteItem[] => {
    return readAll().sort((a, b) => b.addedAt - a.addedAt);
};

export const isFavorite = (title: string, year: number): boolean => {
    const key = makeKey(title, year);
    return readAll().some(f => makeKey(f.title, f.year) === key);
};

export const addFavorite = (item: Omit<FavoriteItem, 'addedAt'>): FavoriteItem[] => {
    const items = readAll();
    const key = makeKey(item.title, item.year);
    if (items.some(f => makeKey(f.title, f.year) === key)) {
        return getFavorites();
    }
    writeAll([...items, { ...item, addedAt: Date.now() }]);
    return getFavorites();
};

export const removeFavorite = (title: string, year: number): FavoriteItem[] => {
    const key = makeKey(title, year);
    writeAll(readAll().filter(f => makeKey(f.title, f.year) !== key));
    return getFavorites();
};

export const toggleFavorite = (item: Omit<FavoriteItem, 'addedAt'>): FavoriteItem[] => {
    return isFavorite(item.title, item.year)
        ? removeFavorite(item.title, item.year)
        : addFavorite(item);
};
