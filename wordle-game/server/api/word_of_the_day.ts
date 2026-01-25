import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
    const today = new Date().toISOString().split('T')[0]
    const seed = dateToSeed(today)

    // Load word list from file
    let WORD_LIST
    try {
        const filePath = path.join(process.cwd(), 'public/words-small.txt')
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        WORD_LIST = fileContent
            .split('\n')
            .map(w => w.trim().toUpperCase())
            .filter(w => w.length === 5)
    } catch (error) {
        // Fallback word list if file doesn't exist
        WORD_LIST = ['CRANE', 'SLANT', 'STARE', 'SLATE', 'PRANK']
        console.error('Could not load word list:', error)
    }

    const index = seededRandom(seed, WORD_LIST.length)
    const word = WORD_LIST[index]

    return {
        word: word,
        date: today,
        // Optional: return tomorrow's date so client knows when to refresh
        nextDate: getNextDate(today)
    }
})

function dateToSeed(dateString: string): number {
    const date = new Date(dateString)
    return Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
}

function seededRandom(seed: number, max: number): number {
    const x = Math.sin(seed) * 10000
    return Math.floor((x - Math.floor(x)) * max)
}

function getNextDate(dateString: string): string {
    const date = new Date(dateString)
    date.setDate(date.getDate() + 1)  // Fixed this line - was calling setDate twice
    return date.toISOString().split('T')[0]
}