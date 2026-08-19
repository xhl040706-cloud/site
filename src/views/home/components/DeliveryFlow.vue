<template>
  <div
    ref="flowRoot"
    class="delivery-flow"
    :class="{ 'is-active': props.active, 'is-dragging': isDragging }"
    :style="deliveryStyle"
    aria-hidden="true"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointercancel="handlePointerUp"
  >
    <div class="delivery-flow-ambient">
      <img :src="deliveryAmbient" alt="" draggable="false" />
    </div>

    <article
      v-for="(stage, index) in stages"
      :key="stage.key"
      class="delivery-stage"
      :class="[`delivery-stage--${stage.key}`, { 'delivery-stage--asset': stage.asset }]"
      :style="getStagePosition(index)"
    >
      <img
        v-if="stage.asset"
        class="delivery-stage-art"
        :src="stage.asset"
        alt=""
        draggable="false"
      />
      <span class="delivery-stage-index">0{{ index + 1 }}</span>
      <h4>{{ stage.title }}</h4>
      <p class="delivery-stage-description">{{ stage.description }}</p>

      <div class="delivery-stage-visual" :class="`delivery-stage-visual--${stage.visual}`">
        <template v-if="stage.visual === 'document'">
          <span v-for="line in documentLines" :key="line.width" :style="line"></span>
        </template>

        <template v-else-if="stage.visual === 'architecture'">
          <span class="architecture-node architecture-node--tall"></span>
          <span class="architecture-node architecture-node--round"></span>
          <span class="architecture-node architecture-node--top"></span>
          <span class="architecture-node architecture-node--bottom"></span>
          <span class="architecture-link architecture-link--a"></span>
          <span class="architecture-link architecture-link--b"></span>
        </template>

        <template v-else-if="stage.visual === 'tdd'">
          <span class="tdd-gutter"></span>
          <span v-for="line in tddLines" :key="line.width" :style="line"></span>
          <i class="tdd-status tdd-status--red"></i>
          <i class="tdd-status tdd-status--green"></i>
        </template>

        <template v-else>
          <span v-for="line in validationLines" :key="line.width" :style="line"></span>
          <i class="validation-check">✓</i>
        </template>
      </div>

      <div class="delivery-stage-roles">
        <div class="delivery-role">
          <span class="delivery-role-label">{{ common.executor }}</span>
          <div class="delivery-role-person">
            <i class="delivery-avatar delivery-avatar--executor">{{ stage.initial }}</i>
            <span>
              <strong>{{ stage.executor }}</strong>
              <small>{{ common.digitalWorker }}</small>
            </span>
          </div>
        </div>
        <div class="delivery-role">
          <span class="delivery-role-label">{{ common.reviewer }}</span>
          <div class="delivery-role-person">
            <i class="delivery-avatar delivery-avatar--reviewer">T</i>
            <span>
              <strong>{{ common.technicalLead }}</strong>
              <small>{{ common.digitalWorker }}</small>
            </span>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, type CSSProperties, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import deliveryAmbient from '@/assets/home/redesign/s5-delivery-ambient.svg'
import requirementCard from '@/assets/home/redesign/s5-delivery-requirement.svg'
import solutionCard from '@/assets/home/redesign/s5-delivery-solution.webp'
import taskBreakdownCard from '@/assets/home/redesign/s5-delivery-task-breakdown.webp'
import tddCard from '@/assets/home/redesign/s5-delivery-tdd.webp'
import validationCard from '@/assets/home/redesign/s5-delivery-validation.webp'

interface Props {
  active?: boolean
}

type StageStyle = CSSProperties & { width: string }
type StagePositionStyle = CSSProperties & {
  '--stage-offset': string
  '--stage-opacity': string
  '--stage-scale': string
}
type DeliveryFlowStyle = CSSProperties & { '--delivery-drag-offset': string }

type StageKey = 'requirement' | 'solution' | 'taskBreakdown' | 'tdd' | 'validation'

interface DeliveryStage {
  key: StageKey
  title: string
  description: string
  executor: string
  initial: string
  visual: 'document' | 'architecture' | 'tdd' | 'validation'
  asset?: string
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
})

defineOptions({
  name: 'DeliveryFlow',
})

const { t } = useI18n()
const stageKeys = ['requirement', 'solution', 'taskBreakdown', 'tdd', 'validation'] as const
const stageMeta: Record<StageKey, Pick<DeliveryStage, 'initial' | 'visual' | 'asset'>> = {
  requirement: { initial: 'P', visual: 'document', asset: requirementCard },
  solution: { initial: 'A', visual: 'architecture', asset: solutionCard },
  taskBreakdown: { initial: 'P', visual: 'document', asset: taskBreakdownCard },
  tdd: { initial: 'D', visual: 'tdd', asset: tddCard },
  validation: { initial: 'D', visual: 'validation', asset: validationCard },
}

const common = computed(() => ({
  executor: t('home.redesign.value.deliveryFlow.common.executor'),
  reviewer: t('home.redesign.value.deliveryFlow.common.reviewer'),
  digitalWorker: t('home.redesign.value.deliveryFlow.common.digitalWorker'),
  technicalLead: t('home.redesign.value.deliveryFlow.common.technicalLead'),
}))

const stages = computed<DeliveryStage[]>(() =>
  stageKeys.map((key) => ({
    key,
    title: t(`home.redesign.value.deliveryFlow.stages.${key}.title`),
    description: t(`home.redesign.value.deliveryFlow.stages.${key}.description`),
    executor: t(`home.redesign.value.deliveryFlow.stages.${key}.executor`),
    ...stageMeta[key],
  })),
)

const flowRoot = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const dragOffset = ref(0)
const isDragging = ref(false)
const deliveryStyle = computed<DeliveryFlowStyle>(() => ({
  '--delivery-drag-offset': `${dragOffset.value}px`,
}))

const DRAG_STEP = 72
let activationTimer: number | undefined
let rotationTimer: number | undefined
let dragPointerId: number | undefined
let dragAnchorX = 0
let rotationResumeAt = 0

const clearRotation = () => {
  if (activationTimer !== undefined) {
    window.clearTimeout(activationTimer)
    activationTimer = undefined
  }

  if (rotationTimer !== undefined) {
    window.clearInterval(rotationTimer)
    rotationTimer = undefined
  }
}

const advanceStages = () => {
  activeIndex.value = (activeIndex.value + 1) % stageKeys.length
}

const moveStages = (direction: 1 | -1) => {
  activeIndex.value = (activeIndex.value + direction + stageKeys.length) % stageKeys.length
}

const canAnimate = () =>
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  !window.matchMedia('(max-width: 1099px)').matches

const startRotation = (delay = 520) => {
  clearRotation()
  if (!props.active || isDragging.value || !canAnimate()) return

  const cooldown = Math.max(0, rotationResumeAt - Date.now())
  const effectiveDelay = Math.max(delay, cooldown)

  activationTimer = window.setTimeout(() => {
    advanceStages()
    rotationTimer = window.setInterval(advanceStages, 1600)
  }, effectiveDelay)
}

const handlePointerDown = (event: PointerEvent) => {
  if (event.button !== 0 || window.matchMedia('(max-width: 1099px)').matches) return

  clearRotation()
  dragPointerId = event.pointerId
  dragAnchorX = event.clientX
  dragOffset.value = 0
  isDragging.value = true
  flowRoot.value?.setPointerCapture(event.pointerId)
  event.preventDefault()
}

const handlePointerMove = (event: PointerEvent) => {
  if (!isDragging.value || event.pointerId !== dragPointerId) return

  let delta = event.clientX - dragAnchorX

  while (delta <= -DRAG_STEP) {
    moveStages(1)
    dragAnchorX -= DRAG_STEP
    delta += DRAG_STEP
  }

  while (delta >= DRAG_STEP) {
    moveStages(-1)
    dragAnchorX += DRAG_STEP
    delta -= DRAG_STEP
  }

  dragOffset.value = delta * 0.72
}

const handlePointerUp = (event: PointerEvent) => {
  if (!isDragging.value || event.pointerId !== dragPointerId) return

  if (flowRoot.value?.hasPointerCapture(event.pointerId)) {
    flowRoot.value.releasePointerCapture(event.pointerId)
  }

  dragPointerId = undefined
  dragOffset.value = 0
  isDragging.value = false
  rotationResumeAt = Date.now() + 2400

  if (props.active) startRotation(2400)
  else activeIndex.value = 0
}

const getRelativeIndex = (index: number) => {
  let distance = index - activeIndex.value
  const wrapPoint = Math.floor(stageKeys.length / 2)

  if (distance > wrapPoint) distance -= stageKeys.length
  if (distance < -wrapPoint) distance += stageKeys.length

  return distance
}

const getStagePosition = (index: number): StagePositionStyle => {
  const relativeIndex = getRelativeIndex(index)
  const isCentered = relativeIndex === 0
  const isAdjacent = Math.abs(relativeIndex) === 1

  return {
    '--stage-offset': `${relativeIndex * (isAdjacent ? 270 : 218)}px`,
    '--stage-opacity': isCentered ? '1' : isAdjacent ? '0.5' : '0',
    '--stage-scale': isCentered ? '1' : isAdjacent ? '0.76' : '0.68',
    zIndex: isCentered ? 3 : isAdjacent ? 2 : 1,
  }
}

watch(
  () => props.active,
  (isActive) => {
    clearRotation()

    if (!isActive) {
      rotationResumeAt = 0
      if (!isDragging.value) activeIndex.value = 0
      return
    }

    startRotation()
  },
)

onBeforeUnmount(clearRotation)

const documentLines: StageStyle[] = [
  { width: '18%', background: '#cf78f2' },
  { width: '48%', background: '#20c9a7' },
  { width: '31%', background: '#e4d35b' },
  { width: '64%', background: '#78dfc7' },
  { width: '36%', background: '#e87d86' },
  { width: '54%', background: '#a87ce8' },
  { width: '72%', background: '#55d6ae' },
]

const tddLines: StageStyle[] = [
  { width: '58%', background: '#7a8fa7' },
  { width: '76%', background: '#55d6ae' },
  { width: '46%', background: '#889bb1' },
  { width: '68%', background: '#37c7e8' },
  { width: '52%', background: '#8092a7' },
]

const validationLines: StageStyle[] = [
  { width: '64%', background: '#7489a1' },
  { width: '82%', background: '#55d6ae' },
  { width: '48%', background: '#8799ad' },
  { width: '72%', background: '#37c7e8' },
]
</script>

<style scoped lang="less">
.delivery-flow {
  position: absolute;
  z-index: 2;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(180deg, #12131a 0%, #090a0c 100%);
  cursor: grab;
  pointer-events: auto;
  touch-action: pan-y;
  user-select: none;

  &::before {
    position: absolute;
    z-index: 0;
    inset: -16%;
    background:
      radial-gradient(ellipse at 48% 36%, rgba(126, 167, 255, 0.36), transparent 40%),
      radial-gradient(ellipse at 62% 58%, rgba(55, 199, 232, 0.24), transparent 48%);
    content: '';
    filter: blur(34px);
    opacity: 0.48;
    animation: delivery-glow-breathe 5.8s ease-in-out infinite;
    will-change: transform, opacity;
  }

  &::after {
    position: absolute;
    z-index: 4;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      transparent 84%,
      rgba(9, 10, 12, 0.38) 90%,
      #090a0c 100%
    );
    content: '';
    pointer-events: none;
  }
}

.delivery-flow.is-dragging {
  cursor: grabbing;
}

.delivery-flow-ambient {
  position: absolute;
  z-index: 1;
  inset: -2%;
  opacity: 0.92;
  transform: translate3d(-4px, 2px, 0) scale(1.015);
  transform-origin: 52% 28%;
  animation: delivery-ambient-breathe 8.6s ease-in-out infinite;
  transition: opacity 500ms ease;
  will-change: transform, opacity;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: fill;
    user-select: none;
  }
}

.delivery-stage {
  position: absolute;
  top: calc(51.5% + 2px);
  left: 50%;
  width: 286px;
  height: 292px;
  overflow: hidden;
  padding: 28px 28px 22px;
  border: 1px solid rgba(132, 169, 204, 0.2);
  border-radius: 15px;
  color: #eaf1f7;
  background: linear-gradient(145deg, rgba(31, 42, 54, 0.98), rgba(15, 22, 31, 0.97));
  box-shadow:
    0 22px 52px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  opacity: var(--stage-opacity);
  transform: translate(calc(-50% + var(--stage-offset) + var(--delivery-drag-offset, 0px)), -50%)
    scale(var(--stage-scale));
  transform-origin: center;
  transition:
    opacity 680ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 680ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, opacity;

  h4 {
    position: relative;
    z-index: 1;
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    line-height: 22px;
    letter-spacing: 0;
  }
}

.delivery-stage--asset {
  width: 288px;
  height: 319px;
  overflow: hidden;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: transparent;
  box-shadow: none;

  > :not(.delivery-stage-art) {
    display: none;
  }
}

.delivery-stage-art {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0.91) saturate(0.9) contrast(0.98);
  user-select: none;
}

.delivery-stage-index {
  position: absolute;
  top: 16px;
  right: 18px;
  color: rgba(163, 184, 204, 0.46);
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
}

.delivery-stage-description {
  position: relative;
  z-index: 1;
  overflow: hidden;
  margin: 4px 0 0;
  color: #8fa1b5;
  font-size: 11px;
  line-height: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delivery-stage-visual {
  position: absolute;
  top: 82px;
  right: 28px;
  left: 28px;
  height: 94px;
  overflow: hidden;
}

.delivery-stage-visual--document,
.delivery-stage-visual--tdd,
.delivery-stage-visual--validation {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 7px;
  padding: 8px 10px;

  span {
    display: block;
    height: 5px;
    border-radius: 999px;
    opacity: 0.92;
  }
}

.delivery-stage-visual--document span:nth-child(even) {
  margin-left: 16px;
}

.delivery-stage-visual--architecture {
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.035);
}

.architecture-node,
.architecture-link {
  position: absolute;
  display: block;
}

.architecture-node {
  border-radius: 4px;
}

.architecture-node--tall {
  top: 16px;
  left: 20px;
  width: 11px;
  height: 50px;
  background: #cf78f2;
}

.architecture-node--round {
  top: 24px;
  left: 48px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #20c9bd;
}

.architecture-node--top {
  top: 15px;
  left: 114px;
  width: 40px;
  height: 31px;
  background: #e4d35b;
}

.architecture-node--bottom {
  top: 55px;
  left: 114px;
  width: 34px;
  height: 26px;
  background: #df7785;
}

.architecture-link {
  height: 4px;
  border-radius: 999px;
  background: #55d6ae;
}

.architecture-link--a {
  top: 21px;
  right: 22px;
  width: 43px;
}

.architecture-link--b {
  bottom: 15px;
  left: 20px;
  width: 68px;
  background: #cf78f2;
}

.delivery-stage-visual--tdd {
  padding-left: 28px;
  border-radius: 9px;
  background: #171c27;

  span {
    min-width: 26px;
  }
}

.tdd-gutter {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 16px !important;
  height: auto !important;
  border-radius: 0 !important;
  background: rgba(255, 255, 255, 0.055) !important;
}

.tdd-status {
  position: absolute;
  right: 12px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.tdd-status--red {
  top: 19px;
  background: #e87d86;
}

.tdd-status--green {
  top: 42px;
  background: #55d6ae;
}

.delivery-stage-visual--validation {
  padding-right: 42px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.035);
}

.validation-check {
  position: absolute;
  top: 29px;
  right: 12px;
  display: grid;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  color: #12372f;
  background: #55d6ae;
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  place-items: center;
}

.delivery-stage-roles {
  position: absolute;
  right: 28px;
  bottom: 20px;
  left: 28px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding-top: 10px;
  border-top: 1px solid rgba(171, 194, 216, 0.12);
}

.delivery-role-label {
  display: block;
  margin-bottom: 7px;
  color: #73869b;
  font-size: 9px;
  font-weight: 700;
  line-height: 13px;
}

.delivery-role-person {
  display: flex;
  align-items: center;
  gap: 7px;

  > span {
    min-width: 0;
  }

  strong,
  small {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: #d8e2ed;
    font-size: 10px;
    font-weight: 700;
    line-height: 14px;
  }

  small {
    color: #75889c;
    font-size: 8px;
    line-height: 12px;
  }
}

.delivery-avatar {
  display: grid;
  flex: 0 0 auto;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  color: #10262b;
  font-size: 11px;
  font-style: normal;
  font-weight: 700;
  place-items: center;
}

.delivery-avatar--executor {
  background: #20bad5;
}

.delivery-avatar--reviewer {
  color: #183107;
  background: #73d11f;
}

.is-active {
  .delivery-flow-ambient {
    opacity: 0.96;
  }
}

.is-dragging {
  .delivery-stage {
    transition:
      opacity 180ms ease,
      transform 110ms linear;
  }
}

@keyframes delivery-ambient-breathe {
  0%,
  100% {
    opacity: 0.78;
    transform: translate3d(-7px, 4px, 0) scale(1.015);
  }

  50% {
    opacity: 1;
    transform: translate3d(8px, -5px, 0) scale(1.06);
  }
}

@keyframes delivery-glow-breathe {
  0%,
  100% {
    opacity: 0.34;
    transform: translate3d(-9px, 6px, 0) scale(0.94);
  }

  50% {
    opacity: 0.7;
    transform: translate3d(12px, -8px, 0) scale(1.12);
  }
}

@media (max-width: 1099px) {
  .delivery-flow {
    cursor: default;
    pointer-events: none;
  }

  .delivery-stage--validation,
  .delivery-stage--solution,
  .delivery-stage--taskBreakdown,
  .delivery-stage--tdd {
    display: none;
  }

  .delivery-stage--requirement,
  .is-active .delivery-stage--requirement {
    width: min(286px, calc(100% - 40px));
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .delivery-flow-ambient {
    animation: none;
  }

  .delivery-flow::before {
    animation: none;
    opacity: 0.28;
    transform: none;
  }

  .delivery-stage {
    transition: none;
  }
}
</style>
