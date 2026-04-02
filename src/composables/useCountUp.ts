import { computed, onBeforeUnmount, onMounted, ref, unref, watch, type Ref } from 'vue'

type CountInput = number | Ref<number>

export function useCountUp(target: CountInput, duration = 900) {
  const value = ref(0)
  const resolvedTarget = computed(() => Math.max(Number(unref(target)) || 0, 0))
  let frameId = 0
  let hasAnimated = false

  const animate = (nextTarget: number) => {
    cancelAnimationFrame(frameId)

    const start = performance.now()
    const from = 0
    const decimals = Number.isInteger(nextTarget) ? 0 : 1

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const nextValue = from + (nextTarget - from) * eased

      value.value = Number(nextValue.toFixed(decimals))

      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      }
    }

    frameId = requestAnimationFrame(tick)
  }

  const maybeStart = () => {
    const nextTarget = resolvedTarget.value

    if (hasAnimated) {
      value.value = nextTarget
      return
    }

    hasAnimated = true
    animate(nextTarget)
  }

  onMounted(maybeStart)

  watch(
    resolvedTarget,
    (nextTarget) => {
      if (!hasAnimated && nextTarget >= 0) {
        maybeStart()
        return
      }

      if (hasAnimated) {
        value.value = nextTarget
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    cancelAnimationFrame(frameId)
  })

  return value
}
