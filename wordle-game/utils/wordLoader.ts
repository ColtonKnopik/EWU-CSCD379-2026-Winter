// Utility to load words from two files:
// - words-small.txt : list of possible target words (answers)
// - words-large.txt : list of valid guesses

const normalizeWords = (text: string): string[] => {
  return [...new Set(
    text
      .split(/\r?\n/)
      .map(w => w.trim().toUpperCase())
      .filter(w => /^[A-Z]{5}$/.test(w))
  )]
}

const fetchWords = async (path: string, fallback: string[]): Promise<string[]> => {
  try {
    const res = await fetch(path)
    const text = await res.text()
    const words = normalizeWords(text)
    return words.length ? words : [...fallback]
  } catch (err) {
    console.error(`Failed to load ${path}:`, err)
    return [...fallback]
  }
}

const SMALL_FALLBACK = [
  'CRANE','SLANT','STARE','SLATE','PRANK','FLASH','TRAIN','PLANT','STORM','SHOUT'
]

const LARGE_FALLBACK = [
  'CRANE','SLANT','STARE','SLATE','PRANK','FLASH','TRAIN','PLANT','STORM','SHOUT',
  'APPLE','BRAVE','CLOUD','DRIVE','EAGER','FOUND','GHOST','HOUSE','INDEX','JELLY'
]

export const loadTargetWords = async (): Promise<string[]> => {
  return fetchWords('/words-small.txt', SMALL_FALLBACK)
}

export const loadValidWords = async (): Promise<string[]> => {
  return fetchWords('/words-large.txt', LARGE_FALLBACK)
}

// Backwards compatible: return the large/valid list
export const loadWordsFromFile = async (): Promise<string[]> => {
  return loadValidWords()
}
