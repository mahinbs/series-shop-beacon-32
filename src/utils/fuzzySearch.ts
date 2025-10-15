/**
 * Calculate Levenshtein distance between two strings
 * This measures how many single-character edits are needed to change one word into another
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill in the matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculate similarity score between two strings (0-1, where 1 is exact match)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  return (longer.length - distance) / longer.length;
}

/**
 * Check if a search query fuzzy matches a target string
 * @param searchQuery - The user's search input
 * @param targetString - The string to match against (e.g., product title)
 * @param threshold - Similarity threshold (0-1), default 0.6
 * @returns true if match is found
 */
export function fuzzyMatch(searchQuery: string, targetString: string, threshold: number = 0.6): boolean {
  if (!searchQuery || !targetString) return false;
  
  const query = searchQuery.toLowerCase().trim();
  const target = targetString.toLowerCase().trim();
  
  // Exact match or substring match
  if (target.includes(query)) return true;
  
  // Split into words and check each word
  const queryWords = query.split(/\s+/);
  const targetWords = target.split(/\s+/);
  
  // Check if any query word fuzzy matches any target word
  for (const queryWord of queryWords) {
    for (const targetWord of targetWords) {
      const similarity = calculateSimilarity(queryWord, targetWord);
      if (similarity >= threshold) {
        return true;
      }
    }
  }
  
  // Check whole string similarity
  const wholeSimilarity = calculateSimilarity(query, target);
  return wholeSimilarity >= threshold;
}

/**
 * Filter and rank items by fuzzy search relevance
 * @param items - Array of items to search through
 * @param searchQuery - The user's search input
 * @param fields - Object fields to search in (e.g., ['title', 'author', 'category'])
 * @param threshold - Minimum similarity threshold (0-1), default 0.6
 * @returns Filtered and sorted array of items with relevance scores
 */
export function fuzzySearchItems<T extends Record<string, any>>(
  items: T[],
  searchQuery: string,
  fields: (keyof T)[],
  threshold: number = 0.6
): T[] {
  if (!searchQuery.trim()) return items;
  
  const query = searchQuery.toLowerCase().trim();
  
  // Score each item
  const scoredItems = items.map(item => {
    let maxScore = 0;
    let hasExactMatch = false;
    
    for (const field of fields) {
      const fieldValue = item[field];
      if (!fieldValue) continue;
      
      const fieldStr = String(fieldValue).toLowerCase();
      
      // Check for exact substring match (highest priority)
      if (fieldStr.includes(query)) {
        hasExactMatch = true;
        maxScore = Math.max(maxScore, 1.0);
        continue;
      }
      
      // Split into words and check fuzzy match
      const queryWords = query.split(/\s+/);
      const targetWords = fieldStr.split(/\s+/);
      
      for (const queryWord of queryWords) {
        for (const targetWord of targetWords) {
          const similarity = calculateSimilarity(queryWord, targetWord);
          maxScore = Math.max(maxScore, similarity);
        }
      }
      
      // Also check whole string similarity
      const wholeSimilarity = calculateSimilarity(query, fieldStr);
      maxScore = Math.max(maxScore, wholeSimilarity);
    }
    
    return {
      item,
      score: maxScore,
      hasExactMatch
    };
  });
  
  // Filter by threshold and sort by relevance
  return scoredItems
    .filter(({ score }) => score >= threshold)
    .sort((a, b) => {
      // Exact matches first
      if (a.hasExactMatch && !b.hasExactMatch) return -1;
      if (!a.hasExactMatch && b.hasExactMatch) return 1;
      // Then by score
      return b.score - a.score;
    })
    .map(({ item }) => item);
}

/**
 * Get search suggestions based on partial input
 */
export function getSearchSuggestions(
  items: any[],
  searchQuery: string,
  field: string,
  maxSuggestions: number = 5
): string[] {
  if (!searchQuery.trim()) return [];
  
  const query = searchQuery.toLowerCase().trim();
  const suggestions = new Set<string>();
  
  items.forEach(item => {
    const fieldValue = item[field];
    if (fieldValue) {
      const fieldStr = String(fieldValue);
      const fieldLower = fieldStr.toLowerCase();
      
      // Add if it starts with query or fuzzy matches
      if (fieldLower.startsWith(query) || fuzzyMatch(query, fieldStr, 0.7)) {
        suggestions.add(fieldStr);
      }
    }
  });
  
  return Array.from(suggestions).slice(0, maxSuggestions);
}

