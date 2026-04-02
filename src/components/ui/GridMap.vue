<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    cells: Array<Record<string, any>>
    bbox?: Record<string, any> | null
    activeCellId?: string | number | null
  }>(),
  {
    bbox: null,
    activeCellId: null,
  },
)

const tooltip = ref<{
  cell: Record<string, any>
  x: number
  y: number
} | null>(null)

const latSpan = computed(() => {
  const bbox = props.bbox || {}
  return Math.max(Number(bbox.ne_lat || 0) - Number(bbox.sw_lat || 0), 0.001)
})

const lngSpan = computed(() => {
  const bbox = props.bbox || {}
  return Math.max(Number(bbox.ne_lng || 0) - Number(bbox.sw_lng || 0), 0.001)
})

const aspectRatio = computed(() => `${lngSpan.value} / ${latSpan.value}`)

const normalizedCells = computed(() => {
  const bbox = props.bbox || {}

  return props.cells.map((cell): Record<string, any> => {
    const left = ((Number(cell.sw_lng) - Number(bbox.sw_lng || 0)) / lngSpan.value) * 100
    const width = ((Number(cell.ne_lng) - Number(cell.sw_lng)) / lngSpan.value) * 100
    const top = ((Number(bbox.ne_lat || 0) - Number(cell.ne_lat)) / latSpan.value) * 100
    const height = ((Number(cell.ne_lat) - Number(cell.sw_lat)) / latSpan.value) * 100
    const intensity = Math.min(Math.max(Number(cell.places_found || 0) / 16, 0.25), 1)

    return {
      ...cell,
      left,
      top,
      width,
      height,
      intensity,
    }
  })
})

const showTooltip = (event: MouseEvent, cell: Record<string, any>) => {
  tooltip.value = {
    cell,
    x: event.offsetX + 16,
    y: event.offsetY + 16,
  }
}

const hideTooltip = () => {
  tooltip.value = null
}

const cellClass = (cell: Record<string, any>) => {
  const status = String(cell.status || 'pending').toLowerCase()

  return {
    'grid-map__cell--pending': status === 'pending',
    'grid-map__cell--fetching': status === 'fetching',
    'grid-map__cell--done': status === 'done',
    'grid-map__cell--exhausted': status === 'exhausted',
    'grid-map__cell--active': String(props.activeCellId || '') === String(cell.id),
  }
}
</script>

<template>
  <div class="grid-map card">
    <div class="card-header">
      <div>
        <p class="eyebrow">Geo Grid</p>
        <h3>Coverage canvas</h3>
      </div>
      <span class="badge badge--blue">{{ cells.length }} cells</span>
    </div>

    <div class="card-body">
      <div v-if="!cells.length" class="grid-map__empty">
        Load a session grid to visualize collection progress.
      </div>

      <div
        v-else
        class="grid-map__canvas"
        :style="{ aspectRatio }"
        @mouseleave="hideTooltip"
      >
        <button
          v-for="cell in normalizedCells"
          :key="cell.id"
          type="button"
          :class="['grid-map__cell', cellClass(cell)]"
          :style="{
            left: `${cell.left}%`,
            top: `${cell.top}%`,
            width: `${cell.width}%`,
            height: `${cell.height}%`,
            opacity: cell.status === 'done' ? cell.intensity : 1,
          }"
          @mouseenter="showTooltip($event, cell)"
          @mousemove="showTooltip($event, cell)"
        />

        <div
          v-if="tooltip"
          class="grid-map__tooltip"
          :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
        >
          <strong>Cell #{{ tooltip.cell.cell_index }}</strong>
          <span>Status: {{ tooltip.cell.status }}</span>
          <span>{{ tooltip.cell.places_found || 0 }} places found</span>
          <span>{{ tooltip.cell.pages_fetched || 0 }} pages fetched</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-map__empty {
  display: grid;
  place-items: center;
  min-height: 260px;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  color: var(--text-dim);
}

.grid-map__canvas {
  position: relative;
  min-height: 280px;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background:
    linear-gradient(180deg, rgba(14, 33, 43, 0.8), rgba(7, 18, 24, 0.96)),
    linear-gradient(90deg, rgba(34, 224, 194, 0.05), transparent 30%, rgba(102, 167, 255, 0.05));
}

.grid-map__cell {
  position: absolute;
  border: 1px solid rgba(235, 251, 255, 0.06);
  background: var(--surface2);
  padding: 0;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;
}

.grid-map__cell:hover {
  transform: scale(1.015);
  border-color: rgba(235, 251, 255, 0.18);
  z-index: 2;
}

.grid-map__cell--pending {
  background: rgba(16, 34, 45, 0.94);
}

.grid-map__cell--fetching {
  background: rgba(34, 224, 194, 0.7);
  box-shadow: 0 0 0 1px rgba(34, 224, 194, 0.22);
  animation: pulse 1.5s ease-in-out infinite;
}

.grid-map__cell--done {
  background: var(--accent);
}

.grid-map__cell--exhausted {
  background: rgba(77, 94, 102, 0.7);
}

.grid-map__cell--active {
  box-shadow: inset 0 0 0 2px var(--gold), 0 0 0 1px rgba(242, 191, 93, 0.25);
}

.grid-map__tooltip {
  position: absolute;
  z-index: 4;
  display: grid;
  gap: var(--space-1);
  min-width: 180px;
  padding: var(--space-3);
  border: 1px solid var(--border2);
  border-radius: 14px;
  background: rgba(6, 16, 22, 0.95);
  box-shadow: var(--shadow-soft);
  pointer-events: none;
}

.grid-map__tooltip span {
  color: var(--text-muted);
  font-size: 0.85rem;
}
</style>
