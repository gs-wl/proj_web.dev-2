import fs from 'fs';
import path from 'path';

const CACHE_FILE_PATH = path.join(process.cwd(), 'src/data/news-cache.json');
const CACHE_EXPIRY_HOURS = 24;

interface CachedNewsData {
  twitterPosts: any[];
  aiNews: any[];
  lastUpdated: string;
  version: number;
}

// Function to check and clean expired cache
export function cleanupExpiredCache(): { cleaned: boolean; message: string } {
  try {
    if (!fs.existsSync(CACHE_FILE_PATH)) {
      return {
        cleaned: false,
        message: 'No cache file found'
      };
    }

    const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
    const cachedData: CachedNewsData = JSON.parse(fileContent);

    // Check if cache is expired
    if (cachedData.lastUpdated) {
      const cacheAge = Date.now() - new Date(cachedData.lastUpdated).getTime();
      const isExpired = cacheAge > (CACHE_EXPIRY_HOURS * 60 * 60 * 1000);
      
      if (isExpired) {
        fs.unlinkSync(CACHE_FILE_PATH);
        return {
          cleaned: true,
          message: `Expired cache file deleted (age: ${Math.round(cacheAge / (60 * 60 * 1000))} hours)`
        };
      }
    }

    return {
      cleaned: false,
      message: 'Cache is still valid'
    };
  } catch (error) {
    console.error('Error during cache cleanup:', error);
    return {
      cleaned: false,
      message: `Error during cleanup: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export { CACHE_FILE_PATH, CACHE_EXPIRY_HOURS };
export type { CachedNewsData };