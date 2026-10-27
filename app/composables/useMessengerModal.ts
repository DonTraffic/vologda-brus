/**
 * Состояние окна выбора мессенджера.
 *
 * На текущем сайте все 15 кнопок-призывов сделаны через
 * href="javascript:openMessengers()" — они не работают без JavaScript,
 * не открываются в новой вкладке и не видны поисковику. Здесь кнопки
 * остаются настоящими ссылками на форму расчёта, а окно — надстройка
 * поверх, которая лишь перехватывает клик при доступном JavaScript.
 */
export function useMessengerModal() {
  const isOpen = useState('messenger-modal', () => false)
  const { reachGoal } = useAnalytics()

  function open() {
    isOpen.value = true
    // Окно открывают кнопки-призывы и лид-магниты — это ближайший к заявке
    // шаг, который видно до перехода в сам мессенджер.
    reachGoal(GOALS.messengerModal)
  }
  function close() { isOpen.value = false }

  return { isOpen, open, close }
}
