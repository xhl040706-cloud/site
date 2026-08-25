import { onMounted, onUnmounted, reactive, ref, type Ref } from 'vue'
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Box3,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Timer,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Material,
} from 'three'
import { SVGLoader, type SVGResult } from 'three/examples/jsm/loaders/SVGLoader.js'
import type { LogoPngCaptureOptions, LogoSceneControls, LogoTransformAxis } from '../types'

const DEFAULT_ROTATION: LogoTransformAxis = { x: -0.28, y: 0.14, z: 0.2 }
const DEFAULT_POSITION: LogoTransformAxis = { x: 0, y: 0, z: 0 }
const DEFAULT_SCALE: LogoTransformAxis = { x: 1, y: 1, z: 1 }
const MOBILE_BREAKPOINT = 768
const AUTO_ROTATION_SPEED = 0.3

interface UseLogoSceneOptions {
  container: Ref<HTMLElement | null>
  canvas: Ref<HTMLCanvasElement | null>
  sourceUrl: string
  autoRotate?: boolean
  floating?: boolean
  pointerParallax?: boolean
}

interface LogoMaterials {
  blue: Material
  cyan: Material
}

function assignAxis(target: LogoTransformAxis, source: LogoTransformAxis) {
  target.x = source.x
  target.y = source.y
  target.z = source.z
}

function createControls(): LogoSceneControls {
  const rotation = reactive<LogoTransformAxis>({ ...DEFAULT_ROTATION })
  const position = reactive<LogoTransformAxis>({ ...DEFAULT_POSITION })
  const scale = reactive<LogoTransformAxis>({ ...DEFAULT_SCALE })
  const motion = reactive({ travelProgress: 0 })

  return {
    rotation,
    position,
    scale,
    motion,
    setRotation(x, y, z) {
      assignAxis(rotation, { x, y, z })
    },
    setPosition(x, y, z) {
      assignAxis(position, { x, y, z })
    },
    setScale(x, y = x, z = x) {
      assignAxis(scale, { x, y, z })
    },
    setTravelProgress(progress) {
      motion.travelProgress = MathUtils.clamp(progress, 0, 1)
    },
    reset() {
      assignAxis(rotation, DEFAULT_ROTATION)
      assignAxis(position, DEFAULT_POSITION)
      assignAxis(scale, DEFAULT_SCALE)
      motion.travelProgress = 0
    },
  }
}

function getTokenColor(token: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim()
  return value || fallback
}

function createMaterials(isMobile: boolean): LogoMaterials {
  const blue = new Color(getTokenColor('--color-home-brand-blue', '#3e8dff'))
  const cyan = new Color(getTokenColor('--color-home-brand-cyan', '#37c7e8'))

  if (isMobile) {
    return {
      blue: new MeshStandardMaterial({
        color: blue,
        roughness: 0.26,
        metalness: 0.06,
        emissive: blue,
        emissiveIntensity: 0.035,
      }),
      cyan: new MeshStandardMaterial({
        color: cyan,
        roughness: 0.2,
        metalness: 0.04,
        emissive: cyan,
        emissiveIntensity: 0.04,
      }),
    }
  }

  return {
    blue: new MeshPhysicalMaterial({
      color: blue,
      roughness: 0.22,
      metalness: 0.05,
      clearcoat: 0.72,
      clearcoatRoughness: 0.18,
      transmission: 0.035,
      thickness: 2.4,
      ior: 1.42,
      emissive: blue,
      emissiveIntensity: 0.035,
    }),
    cyan: new MeshPhysicalMaterial({
      color: cyan,
      roughness: 0.2,
      metalness: 0.04,
      clearcoat: 0.78,
      clearcoatRoughness: 0.14,
      transmission: 0.025,
      thickness: 2.2,
      ior: 1.4,
      emissive: cyan,
      emissiveIntensity: 0.04,
    }),
  }
}

function getUniqueLogoPaths(data: SVGResult) {
  const nodes = Array.from(data.xml.querySelectorAll('path'))
  const pathData = nodes.map((node) => node.getAttribute('d') ?? '')
  return data.paths.filter((_, index) => pathData.lastIndexOf(pathData[index]) === index)
}

function createLogo(data: SVGResult, isMobile: boolean) {
  const paths = getUniqueLogoPaths(data)
  if (paths.length !== 2)
    throw new Error(`Expected two unique logo paths, received ${paths.length}.`)

  const materials = createMaterials(isMobile)
  const shapeEntries = paths.map((path) => {
    const shapes = path.toShapes()
    const geometry = new ExtrudeGeometry(shapes, {
      depth: 38,
      steps: 1,
      curveSegments: isMobile ? 8 : 12,
      bevelEnabled: true,
      bevelThickness: 2.6,
      bevelSize: 1.4,
      bevelOffset: 0,
      bevelSegments: isMobile ? 1 : 3,
    })

    geometry.scale(1, -1, 1)
    geometry.computeBoundingBox()
    geometry.computeVertexNormals()
    const size = geometry.boundingBox?.getSize(new Vector3()) ?? new Vector3()
    return { geometry, area: size.x * size.y }
  })

  shapeEntries.sort((a, b) => b.area - a.area)
  const artwork = new Group()
  const blueMesh = new Mesh(shapeEntries[0].geometry, materials.blue)
  const cyanMesh = new Mesh(shapeEntries[1].geometry, materials.cyan)
  cyanMesh.position.z = 3
  artwork.add(blueMesh, cyanMesh)

  const bounds = new Box3().setFromObject(artwork)
  const center = bounds.getCenter(new Vector3())
  const size = bounds.getSize(new Vector3())
  artwork.position.set(-center.x, -center.y, -center.z)

  const root = new Group()
  root.add(artwork)

  return {
    root,
    size: Math.max(size.x, size.y),
    dispose() {
      shapeEntries.forEach(({ geometry }) => geometry.dispose())
      materials.blue.dispose()
      materials.cyan.dispose()
    },
  }
}

export function useLogoScene({
  container,
  canvas,
  sourceUrl,
  autoRotate = true,
  floating = true,
  pointerParallax = true,
}: UseLogoSceneOptions) {
  const controls = createControls()
  const isLoading = ref(true)
  const errorMessage = ref('')
  const pointerTarget = new Vector2()
  const pointerCurrent = new Vector2()

  let renderer: WebGLRenderer | null = null
  let animationFrame = 0
  let resizeObserver: ResizeObserver | null = null
  let reducedMotionQuery: MediaQueryList | null = null
  let logoRoot: Group | null = null
  let logoSize = 350
  let disposeLogo: (() => void) | null = null
  let isDisposed = false
  let timer: Timer | null = null
  let activeScene: Scene | null = null
  let activeCamera: PerspectiveCamera | null = null
  let renderRequested = true
  let pageVisible = true
  let autoRotationAngle = 0

  const setPointerNormalized = (x: number, y: number) => {
    pointerTarget.set(MathUtils.clamp(x, -1, 1), MathUtils.clamp(y, -1, 1))
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!container.value || !pointerParallax || reducedMotionQuery?.matches) return
    const bounds = container.value.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return
    setPointerNormalized(
      ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
      ((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
    )
  }

  const onPointerLeave = () => setPointerNormalized(0, 0)

  const capturePng = ({ size = 2048, rotation = {} }: LogoPngCaptureOptions = {}) => {
    if (!renderer || !logoRoot || !activeScene || !activeCamera || !canvas.value) return null

    const outputSize = MathUtils.clamp(Math.round(size), 512, 4096)
    const previousRendererSize = renderer.getSize(new Vector2())
    const previousPixelRatio = renderer.getPixelRatio()
    const previousCameraPosition = activeCamera.position.clone()
    const previousCameraAspect = activeCamera.aspect
    const previousPosition = logoRoot.position.clone()
    const previousRotation = logoRoot.rotation.clone()
    const previousScale = logoRoot.scale.clone()

    renderer.setPixelRatio(1)
    renderer.setSize(outputSize, outputSize, false)
    activeCamera.aspect = 1
    activeCamera.position.z =
      (logoSize / (2 * Math.tan(MathUtils.degToRad(activeCamera.fov) / 2))) * 1.16
    activeCamera.updateProjectionMatrix()
    logoRoot.position.set(0, 0, 0)
    logoRoot.rotation.set(rotation.x ?? 0, rotation.y ?? 0, rotation.z ?? 0)
    logoRoot.scale.set(1, 1, 1)
    renderer.render(activeScene, activeCamera)
    const dataUrl = canvas.value.toDataURL('image/png')

    renderer.setPixelRatio(previousPixelRatio)
    renderer.setSize(previousRendererSize.x, previousRendererSize.y, false)
    activeCamera.position.copy(previousCameraPosition)
    activeCamera.aspect = previousCameraAspect
    activeCamera.updateProjectionMatrix()
    logoRoot.position.copy(previousPosition)
    logoRoot.rotation.copy(previousRotation)
    logoRoot.scale.copy(previousScale)
    renderer.render(activeScene, activeCamera)
    return dataUrl
  }

  const render = (timestamp: number) => {
    animationFrame = 0
    if (
      !renderRequested ||
      !pageVisible ||
      !renderer ||
      !logoRoot ||
      !timer ||
      !activeScene ||
      !activeCamera
    ) {
      return
    }

    timer.update(timestamp)
    const reducedMotion = reducedMotionQuery?.matches ?? false
    const delta = timer.getDelta()
    const elapsed = timer.getElapsed()
    const progress = controls.motion.travelProgress
    const autoRotateWeight = reducedMotion ? 0 : 1 - MathUtils.smoothstep(progress, 0.04, 0.72)
    const floatingWeight = reducedMotion ? 0 : 1 - MathUtils.smoothstep(progress, 0, 0.58)
    const pointerWeight = reducedMotion ? 0 : 1 - MathUtils.smoothstep(progress, 0, 0.65)
    const smoothing = reducedMotion ? 1 : 0.065

    pointerCurrent.lerp(pointerTarget, smoothing)
    autoRotationAngle += autoRotate ? delta * AUTO_ROTATION_SPEED * autoRotateWeight : 0
    const floatY = floating ? Math.sin(elapsed * 0.78) * 4.5 * floatingWeight : 0
    const floatRotation = floating ? Math.sin(elapsed * 0.42) * 0.014 * floatingWeight : 0
    const pointerX = pointerParallax ? pointerCurrent.x * pointerWeight : 0
    const pointerY = pointerParallax ? pointerCurrent.y * pointerWeight : 0

    logoRoot.position.set(controls.position.x, controls.position.y + floatY, controls.position.z)
    logoRoot.rotation.set(
      controls.rotation.x - pointerY * 0.045,
      controls.rotation.y + autoRotationAngle * autoRotateWeight + pointerX * 0.075,
      controls.rotation.z + floatRotation,
    )
    logoRoot.scale.set(controls.scale.x, controls.scale.y, controls.scale.z)
    renderer.render(activeScene, activeCamera)
    animationFrame = window.requestAnimationFrame(render)
  }

  const startRendering = () => {
    if (animationFrame || !renderRequested || !pageVisible || !renderer || !logoRoot) return
    canvas.value?.setAttribute('data-render-state', 'running')
    animationFrame = window.requestAnimationFrame(render)
  }

  const stopRendering = () => {
    if (animationFrame) window.cancelAnimationFrame(animationFrame)
    animationFrame = 0
    canvas.value?.setAttribute('data-render-state', 'paused')
  }

  const setRenderEnabled = (enabled: boolean) => {
    renderRequested = enabled
    if (enabled) startRendering()
    else stopRendering()
  }

  const handleVisibilityChange = () => {
    pageVisible = !document.hidden
    if (pageVisible) startRendering()
    else stopRendering()
  }

  onMounted(async () => {
    if (!container.value || !canvas.value) return

    try {
      const host = container.value
      const scene = new Scene()
      const camera = new PerspectiveCamera(32, 1, 0.1, 5000)
      activeScene = scene
      activeCamera = camera
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT
      const loader = new SVGLoader()

      renderer = new WebGLRenderer({
        canvas: canvas.value,
        alpha: true,
        antialias: !isMobile,
        powerPreference: 'high-performance',
      })
      canvas.value.dataset.webglRenderer = 'costrict-logo'
      renderer.outputColorSpace = SRGBColorSpace
      renderer.toneMapping = ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.02

      scene.add(new AmbientLight(0xffffff, 0.54))
      const keyLight = new DirectionalLight(0xe8f2ff, 2.15)
      keyLight.position.set(-260, 320, 460)
      scene.add(keyLight)
      const fillLight = new DirectionalLight(0x287fff, 0.78)
      fillLight.position.set(280, -140, 300)
      scene.add(fillLight)
      const rimLight = new DirectionalLight(0x82fff0, 1.5)
      rimLight.position.set(260, 180, -360)
      scene.add(rimLight)

      const data = await loader.loadAsync(sourceUrl)
      if (isDisposed) return
      const logo = createLogo(data, isMobile)
      logoRoot = logo.root
      logoSize = logo.size
      disposeLogo = logo.dispose
      scene.add(logoRoot)

      const resize = () => {
        if (!renderer || !container.value) return
        const width = Math.max(container.value.clientWidth, 1)
        const height = Math.max(container.value.clientHeight, 1)
        const aspect = width / height
        const verticalFov = MathUtils.degToRad(camera.fov)
        const fitHeightDistance = logoSize / (2 * Math.tan(verticalFov / 2))
        const fitWidthDistance = fitHeightDistance / aspect

        camera.aspect = aspect
        camera.position.z = Math.max(fitHeightDistance, fitWidthDistance) * 1.16
        camera.updateProjectionMatrix()
        renderer.setPixelRatio(
          Math.min(window.devicePixelRatio, window.innerWidth < MOBILE_BREAKPOINT ? 1.25 : 1.75),
        )
        renderer.setSize(width, height, false)
        canvas.value?.setAttribute('data-render-width', `${canvas.value.width}`)
        canvas.value?.setAttribute('data-render-height', `${canvas.value.height}`)
      }

      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(host)
      resize()
      reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      timer = new Timer()
      timer.connect(document)
      pageVisible = !document.hidden
      document.addEventListener('visibilitychange', handleVisibilityChange)
      isLoading.value = false
      startRendering()
    } catch (error) {
      if (isDisposed) return
      errorMessage.value = error instanceof Error ? error.message : 'Unable to create the 3D logo.'
      isLoading.value = false
      console.error('Failed to initialize CoStrict 3D logo:', error)
    }
  })

  onUnmounted(() => {
    isDisposed = true
    stopRendering()
    resizeObserver?.disconnect()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    timer?.dispose()
    timer = null
    disposeLogo?.()
    renderer?.dispose()
    renderer = null
    activeScene = null
    activeCamera = null
    canvas.value?.setAttribute('data-render-state', 'disposed')
  })

  return {
    controls,
    isLoading,
    errorMessage,
    capturePng,
    onPointerMove,
    onPointerLeave,
    setPointerNormalized,
    setRenderEnabled,
  }
}
