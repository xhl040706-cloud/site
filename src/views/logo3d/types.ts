export interface LogoTransformAxis {
  x: number
  y: number
  z: number
}

export interface LogoSceneMotionState {
  travelProgress: number
}

export interface LogoSceneControls {
  rotation: LogoTransformAxis
  position: LogoTransformAxis
  scale: LogoTransformAxis
  motion: LogoSceneMotionState
  setRotation: (x: number, y: number, z: number) => void
  setPosition: (x: number, y: number, z: number) => void
  setScale: (x: number, y?: number, z?: number) => void
  setTravelProgress: (progress: number) => void
  reset: () => void
}

export interface LogoPngCaptureOptions {
  size?: number
  rotation?: Partial<LogoTransformAxis>
}
