
export interface Platform {
  name: string;
  url?: string;
}

export interface SearchResult {
  title: string;
  summary: string;
  year: number;
  platforms: Platform[];
  status: 'streaming' | 'coming_soon' | 'theaters_only' | 'unknown';
  expectedDate?: string;
  expectedPlatform?: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  }
}

export interface FavoriteItem {
  title: string;
  year: number;
  country: string;
  posterUrl: string | null;
  status: SearchResult['status'];
  addedAt: number;
}
