/**
 * Dictionary API response types
 */
interface Phonetic {
    text?: string;
    audio?: string;
}

interface Definition {
    definition: string;
    example?: string;
    synonyms?: string[];
    antonyms?: string[];
}

interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
    synonyms?: string[];
    antonyms?: string[];
}

interface DictionaryEntry {
    word: string;
    phonetic?: string;
    phonetics: Phonetic[];
    meanings: Meaning[];
    origin?: string;
}

interface HintResult {
    text: string;
    type: 'definition' | 'letter' | 'structure' | 'phonetic';
    severity: 'subtle' | 'medium' | 'strong';
}

/**
 * Main hint generator with progressive difficulty
 * @param word - The target word to generate hints for
 * @param guessCount - Number of guesses made (for context)
 * @param previousGuesses - Array of previous guess attempts
 * @param hintCount - Number of hints already shown (controls progression)
 */
export async function generateHint(
    word: string,
    guessCount: number = 0,
    previousGuesses: string[] = [],
    hintCount: number = 0  // FIXED: Track hint progression separately
): Promise<HintResult> {
    // Validate input
    if (!word || word.trim().length === 0) {
        console.error('generateHint called with empty word');
        return {
            text: 'Unable to generate hint - no word provided',
            type: 'structure',
            severity: 'medium'
        };
    }

    const cleanWord = word.trim().toLowerCase();
    console.log('=== HINT GENERATION START ===');
    console.log('Word:', cleanWord);
    console.log('Guess count:', guessCount);
    console.log('Hint count:', hintCount);  // FIXED: Log hint count
    console.log('Previous guesses:', previousGuesses);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`;
        console.log('Fetching from URL:', url);

        const response = await fetch(url, {
            signal: controller.signal,
            mode: 'cors',
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        clearTimeout(timeoutId);

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.warn(`Dictionary API failed with status ${response.status}`);
            console.warn('Error response:', errorText);
            return getFallbackHint(cleanWord, hintCount, previousGuesses);  // FIXED: Use hintCount
        }

        const data: DictionaryEntry[] = await response.json();
        console.log('Dictionary data received:', JSON.stringify(data, null, 2));

        if (data && Array.isArray(data) && data.length > 0 && data[0]) {
            const hint = generateProgressiveHint(data[0], cleanWord, hintCount, previousGuesses);  // FIXED: Use hintCount
            console.log('Generated hint:', hint);
            console.log('=== HINT GENERATION SUCCESS ===');
            return hint;
        }

        console.warn('Invalid data structure from dictionary API');
        return getFallbackHint(cleanWord, hintCount, previousGuesses);  // FIXED: Use hintCount
    } catch (error) {
        console.error('=== HINT GENERATION ERROR ===');
        console.error('Error:', error);
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return getFallbackHint(cleanWord, hintCount, previousGuesses);  // FIXED: Use hintCount
    }
}

/**
 * Generates progressive hints based on hint count (not guess count)
 */
function generateProgressiveHint(
    entry: DictionaryEntry,
    word: string,
    hintCount: number,  // FIXED: Use hintCount instead of guessCount
    previousGuesses: string[]
): HintResult {
    // Hint 0: Very subtle hints (part of speech, category)
    if (hintCount === 0) {
        if (entry.meanings && entry.meanings.length > 0 && entry.meanings[0]) {
            const partOfSpeech = entry.meanings[0].partOfSpeech;
            const category = getCategoryFromMeaning(entry.meanings[0]);

            return {
                text: category
                    ? `This ${partOfSpeech} relates to ${category}.`
                    : `This word is a ${partOfSpeech}.`,
                type: 'definition',
                severity: 'subtle'
            };
        }
    }

    // Hint 1-2: Medium hints (vague definition or synonyms)
    if (hintCount >= 1 && hintCount <= 2) {
        if (entry.meanings && entry.meanings.length > 0 && entry.meanings[0]) {
            const meaning = entry.meanings[0];

            // Try synonyms first
            if (meaning.synonyms && meaning.synonyms.length > 0 && meaning.synonyms[0]) {
                const synonym = meaning.synonyms[0];
                return {
                    text: `Similar to: ${synonym}`,
                    type: 'definition',
                    severity: 'medium'
                };
            }

            // Otherwise use vague definition
            if (meaning.definitions && meaning.definitions.length > 0 && meaning.definitions[0]) {
                const def = meaning.definitions[0].definition;
                const vagueClue = getVagueClue(def);
                return {
                    text: `It relates to ${vagueClue}.`,
                    type: 'definition',
                    severity: 'medium'
                };
            }
        }
    }

    // Hint 3: Letter position hint
    if (hintCount === 3) {
        const letterHint = getSmartLetterHint(word, previousGuesses);
        return {
            text: letterHint,
            type: 'letter',
            severity: 'medium'
        };
    }

    // Hint 4+: Strong hints (definition or structure)
    if (entry.meanings && entry.meanings.length > 0 && entry.meanings[0]) {
        const meaning = entry.meanings[0];
        if (meaning.definitions && meaning.definitions.length > 0 && meaning.definitions[0]) {
            const def = meaning.definitions[0].definition;
            const shortDef = truncateDefinition(def, 70);
            return {
                text: `Definition: ${shortDef}`,
                type: 'definition',
                severity: 'strong'
            };
        }
    }

    // Ultimate fallback
    return getStructureHint(word, hintCount, previousGuesses);
}

/**
 * Gets category from meaning definitions
 */
function getCategoryFromMeaning(meaning: Meaning): string | null {
    if (!meaning.definitions || meaning.definitions.length === 0 || !meaning.definitions[0]) {
        return null;
    }

    const def = meaning.definitions[0].definition.toLowerCase();

    const categories: Array<{ keywords: string[]; label: string }> = [
        { keywords: ['animal', 'creature', 'beast'], label: 'animals' },
        { keywords: ['bird', 'avian', 'feather'], label: 'birds' },
        { keywords: ['tool', 'instrument', 'device', 'equipment'], label: 'tools' },
        { keywords: ['food', 'dish', 'meal', 'edible'], label: 'food' },
        { keywords: ['plant', 'flower', 'tree', 'vegetation'], label: 'nature' },
        { keywords: ['building', 'structure', 'construction'], label: 'structures' },
        { keywords: ['emotion', 'feeling', 'sentiment'], label: 'emotions' },
        { keywords: ['color', 'colour', 'shade', 'hue'], label: 'colors' },
        { keywords: ['vehicle', 'transport'], label: 'transportation' },
        { keywords: ['sport', 'game', 'athletic'], label: 'sports' },
        { keywords: ['music', 'musical', 'sound'], label: 'music' },
        { keywords: ['body', 'anatomical', 'organ'], label: 'anatomy' }
    ];

    for (const category of categories) {
        if (category.keywords.some(keyword => def.includes(keyword))) {
            return category.label;
        }
    }

    return null;
}

/**
 * Extracts a vague clue from a definition
 */
function getVagueClue(definition: string): string {
    const lowerDef = definition.toLowerCase();

    // Pattern matching for common concepts
    const patterns: Array<{ regex: RegExp; clue: string }> = [
        { regex: /animal|creature|beast/i, clue: 'living creatures' },
        { regex: /bird|avian/i, clue: 'birds or flight' },
        { regex: /tool|device|instrument/i, clue: 'tools or equipment' },
        { regex: /machine|mechanical/i, clue: 'machinery' },
        { regex: /building|structure|construction/i, clue: 'structures' },
        { regex: /person|people|human/i, clue: 'people or roles' },
        { regex: /food|edible|dish/i, clue: 'food or cuisine' },
        { regex: /plant|tree|vegetation/i, clue: 'plants or nature' },
        { regex: /water|liquid|fluid/i, clue: 'liquids or water' },
        { regex: /move|motion|travel/i, clue: 'movement or action' },
        { regex: /color|colour|shade/i, clue: 'colors or appearance' },
        { regex: /sound|noise|audio/i, clue: 'sounds or music' },
        { regex: /time|period|duration/i, clue: 'time or timing' },
        { regex: /place|location|area/i, clue: 'places or locations' }
    ];

    for (const pattern of patterns) {
        if (pattern.regex.test(lowerDef)) {
            return pattern.clue;
        }
    }

    // Extract key words from definition
    const words = definition
        .replace(/[.,;:()]/g, ' ')
        .split(' ')
        .filter(w => w.length > 3)
        .filter(w => !['the', 'and', 'that', 'this', 'with', 'from', 'have', 'been', 'were'].includes(w.toLowerCase()));

    if (words.length >= 2 && words[0] && words[1]) {
        return `${words[0].toLowerCase()} and ${words[1].toLowerCase()}`;
    } else if (words.length === 1 && words[0]) {
        return words[0].toLowerCase();
    }

    return 'something interesting';
}

/**
 * Truncates definition intelligently
 */
function truncateDefinition(definition: string, maxLength: number): string {
    // Remove parenthetical remarks
    const cleaned = definition.replace(/\([^)]*\)/g, '').trim();

    // Get first sentence
    const sentences = cleaned.split(/[.!?]/);
    const firstSentence = sentences[0] || cleaned;

    if (firstSentence.length <= maxLength) {
        return firstSentence + '...';
    }

    // Truncate at word boundary
    const truncated = firstSentence.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 0) {
        return truncated.substring(0, lastSpace) + '...';
    }

    return truncated + '...';
}

/**
 * Smart letter hint based on previous guesses
 */
function getSmartLetterHint(word: string, previousGuesses: string[]): string {
    const knownPositions = new Set<number>();
    const knownLetters = new Set<string>();

    // Analyze what the player already knows
    for (const guess of previousGuesses) {
        for (let i = 0; i < guess.length && i < word.length; i++) {
            const guessChar = guess[i];
            const wordChar = word[i];

            if (guessChar && wordChar && guessChar === wordChar) {
                knownPositions.add(i);
            }
            if (guessChar && word.includes(guessChar)) {
                knownLetters.add(guessChar);
            }
        }
    }

    // Find an unknown position to reveal
    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (char && !knownPositions.has(i) && !knownLetters.has(char)) {
            return `The ${getOrdinal(i + 1)} letter is "${char}".`;
        }
    }

    // If all letters are known, reveal a position
    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (char && !knownPositions.has(i)) {
            return `Position ${i + 1} is "${char}".`;
        }
    }

    // Fallback to vowel hint
    const vowels = word.split('').filter(c => c && 'AEIOU'.includes(c));
    return `The word contains ${vowels.length} vowel(s).`;
}

/**
 * Structure-based hint (fallback)
 */
function getStructureHint(word: string, hintCount: number, previousGuesses: string[]): HintResult {
    const uniqueLetters = new Set(word.split('')).size;
    const vowels = word.split('').filter(c => c && 'AEIOU'.includes(c)).length;
    const consonants = word.length - vowels;

    const firstChar = word[0] || '?';
    const lastChar = word[word.length - 1] || '?';

    const hints: string[] = [
        `This word has ${uniqueLetters} unique letters.`,
        `It contains ${vowels} vowel(s) and ${consonants} consonant(s).`,
        `The word starts with "${firstChar}" and ends with "${lastChar}".`,
        getSmartLetterHint(word, previousGuesses)
    ];

    const index = Math.min(hintCount, hints.length - 1);
    const hintText = hints[index];

    return {
        text: hintText || 'No hint available',
        type: 'structure',
        severity: hintCount > 2 ? 'strong' : 'medium'
    };
}

/**
 * Fallback hints when API fails
 */
function getFallbackHint(word: string, hintCount: number, previousGuesses: string[]): HintResult {
    return getStructureHint(word, hintCount, previousGuesses);
}

/**
 * Helper to get ordinal numbers (1st, 2nd, 3rd, etc.)
 */
function getOrdinal(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    const suffix = s[(v - 20) % 10] || s[v] || s[0];
    return n + (suffix || 'th');
}

/**
 * Quick letter-based hint generator (legacy support)
 */
export function generateLetterHint(word: string, guessCount: number): string {
    const firstChar = word[0];
    const lastChar = word[word.length - 1];
    const middleChar = word[Math.floor(word.length / 2)];

    if (guessCount < 2) {
        return `First letter: ${firstChar || '?'}`;
    } else if (guessCount < 4) {
        return `Letters include: ${firstChar || '?'} and ${lastChar || '?'}`;
    } else {
        return `Middle letter: ${middleChar || '?'}`;
    }
}