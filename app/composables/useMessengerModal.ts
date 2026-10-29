export function useMessengerModal() {
  const isOpen = useState('messenger-modal', () => false)
  const { reachGoal } = useAnalytics()

  function open() {
    isOpen.value = true

    reachGoal(GOALS.messengerModal)
  }
  function close() { isOpen.value = false }

  return { isOpen, open, close }
}
