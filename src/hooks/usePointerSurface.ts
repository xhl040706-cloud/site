import { onBeforeUnmount, onMounted, type Ref } from 'vue'

interface PointerSurfaceOptions {
  surfaceSelector?: string
  lerp?: number
  disabled?: () => boolean
}

interface PointerCoordinates {
  x: number
  y: number
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function usePointerSurface(
  root: Ref<HTMLElement | null>,
  { surfaceSelector, lerp = 0.075, disabled }: PointerSurfaceOptions = {},
) {
  let frame = 0
  let activeSurface: HTMLElement | null = null
  let current: PointerCoordinates = { x: 0, y: 0 }
  let target: PointerCoordinates = { x: 0, y: 0 }

  const writeCoordinates = (surface: HTMLElement, coordinates: PointerCoordinates) => {
    const percentX = (coordinates.x + 1) * 50
    const percentY = (coordinates.y + 1) * 50
    surface.style.setProperty('--pointer-nx', coordinates.x.toFixed(4))
    surface.style.setProperty('--pointer-ny', coordinates.y.toFixed(4))
    surface.style.setProperty('--pointer-x', `${percentX.toFixed(2)}%`)
    surface.style.setProperty('--pointer-y', `${percentY.toFixed(2)}%`)
    ;[1, 2, 3, 4, 5, 8, 12, 18, 20].forEach((distance) => {
      surface.style.setProperty(`--pointer-x-${distance}`, `${coordinates.x * distance}px`)
      surface.style.setProperty(`--pointer-y-${distance}`, `${coordinates.y * distance}px`)
    })
    surface.style.setProperty('--pointer-rotate-x', `${coordinates.y * -0.8}deg`)
    surface.style.setProperty('--pointer-rotate-y', `${coordinates.x * 1.1}deg`)
  }

  const stopFrame = () => {
    if (frame) window.cancelAnimationFrame(frame)
    frame = 0
  }

  const animate = () => {
    if (!activeSurface) {
      frame = 0
      return
    }

    current.x += (target.x - current.x) * lerp
    current.y += (target.y - current.y) * lerp
    writeCoordinates(activeSurface, current)

    const settled = Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001
    if (settled) {
      current = { ...target }
      writeCoordinates(activeSurface, current)
      frame = 0
      return
    }

    frame = window.requestAnimationFrame(animate)
  }

  const startFrame = () => {
    if (!frame) frame = window.requestAnimationFrame(animate)
  }

  const resetSurface = (surface: HTMLElement | null) => {
    surface?.classList.remove('is-pointer-active')
    if (surface) writeCoordinates(surface, { x: 0, y: 0 })
  }

  const resolveSurface = (event: PointerEvent) => {
    const rootElement = root.value
    if (!rootElement) return null
    if (!surfaceSelector) return rootElement
    if (!(event.target instanceof Element)) return null
    const surface = event.target.closest<HTMLElement>(surfaceSelector)
    return surface && rootElement.contains(surface) ? surface : null
  }

  const handlePointerMove = (event: PointerEvent) => {
    if (
      disabled?.() ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      return
    }
    const surface = resolveSurface(event)
    if (!surface) return

    if (surface !== activeSurface) {
      resetSurface(activeSurface)
      activeSurface = surface
      current = { x: 0, y: 0 }
      activeSurface.classList.add('is-pointer-active')
    }

    const bounds = surface.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return
    target = {
      x: clamp(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -1, 1),
      y: clamp(((event.clientY - bounds.top) / bounds.height) * 2 - 1, -1, 1),
    }
    startFrame()
  }

  const handlePointerLeave = () => {
    resetSurface(activeSurface)
    activeSurface = null
    current = { x: 0, y: 0 }
    target = { x: 0, y: 0 }
    stopFrame()
  }

  onMounted(() => {
    const rootElement = root.value
    if (!rootElement) return
    writeCoordinates(rootElement, current)
    rootElement.addEventListener('pointermove', handlePointerMove, { passive: true })
    rootElement.addEventListener('pointerleave', handlePointerLeave)
  })

  onBeforeUnmount(() => {
    const rootElement = root.value
    stopFrame()
    rootElement?.removeEventListener('pointermove', handlePointerMove)
    rootElement?.removeEventListener('pointerleave', handlePointerLeave)
    resetSurface(activeSurface)
  })
}
