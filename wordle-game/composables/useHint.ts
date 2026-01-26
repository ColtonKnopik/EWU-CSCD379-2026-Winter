export const useHint = () => {
    const hintCallback = useState<(() => void) | null>('hint-callback', () => null)
    const hintDisabled = useState<boolean>('hint-disabled', () => true)
    const showHintButton = useState<boolean>('show-hint-button', () => false)

    const registerHintHandler = (callback: () => void) => {
        hintCallback.value = callback
        hintDisabled.value = false
        showHintButton.value = true
    }

    const unregisterHintHandler = () => {
        hintCallback.value = null
        hintDisabled.value = true
        showHintButton.value = false
    }

    const triggerHint = () => {
        if (hintCallback.value) {
            hintCallback.value()
        }
    }

    const setHintDisabled = (disabled: boolean) => {
        hintDisabled.value = disabled
    }

    return {
        registerHintHandler,
        unregisterHintHandler,
        triggerHint,
        setHintDisabled,
        hintDisabled,
        showHintButton
    }
}