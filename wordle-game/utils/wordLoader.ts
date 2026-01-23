// Utility to load words from words.txt file
export const loadWordsFromFile = async (): Promise<string[]> => {
  try {
    const response = await fetch('/words.txt')
    const text = await response.text()
    
    // Split by newlines, trim whitespace, filter empty lines, and convert to uppercase
    const words = text
      .split('\n')
      .map(word => word.trim().toUpperCase())
      .filter(word => word.length === 5) // Only 5-letter words for Wordle
      .filter(word => word.length > 0) // Remove empty strings
    
    return [...new Set(words)] // Remove duplicates
  } catch (error) {
    console.error('Failed to load words from file:', error)
    // Fallback to default words if file loading fails
    return [
      'CRANE',
      'SLANT',
      'STARE',
      'SLATE',
      'PRANK',
      'FLASH',
      'TRAIN',
      'PLANT',
      'STORM',
      'SHOUT'
    ]
  }
}
