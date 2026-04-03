<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  place: Record<string, any>
  index: number
}>()

const emit = defineEmits<{
  reviews: [place: Record<string, any>]
}>()

const typeChips = computed(() => {
  const types = props.place.types

  if (Array.isArray(types)) {
    return types.slice(0, 4)
  }

  if (typeof types === 'string') {
    return types
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 4)
  }

  return []
})
</script>

<template>
  <tr>
    <td>{{ index }}</td>
    <td>
      <strong>{{ place.name || 'Unnamed place' }}</strong>
      <div class="chip-row">
        <span v-for="type in typeChips" :key="type" class="chip">
          {{ type }}
        </span>
      </div>
    </td>
    <td class="place-row__address">{{ place.formatted_address || 'No address' }}</td>
    <td>
      <a v-if="place.phone" :href="`tel:${place.phone}`">{{ place.phone }}</a>
      <span v-else class="dim">Unavailable</span>
    </td>
    <td>
      <a
        v-if="place.website"
        :href="place.website"
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit site
      </a>
      <span v-else class="dim">Unavailable</span>
    </td>
    <td>
      <strong>{{ place.rating ?? '—' }}</strong>
      <div class="dim">{{ place.rating_count || 0 }} reviews</div>
    </td>
    <td>
      <div class="place-row__status">
        <span :class="['badge', place.business_status === 'OPERATIONAL' ? 'badge--accent' : 'badge--gold']">
          {{ place.business_status || 'Unknown' }}
        </span>
        <span
          v-if="typeof place.is_open === 'boolean'"
          :class="['badge', place.is_open ? 'badge--accent' : 'badge--danger']"
        >
          {{ place.is_open ? 'Open now' : 'Closed now' }}
        </span>
      </div>
    </td>
    <td>
      <div class="place-row__actions">
        <a
          v-if="place.google_maps_uri"
          class="button button--soft button--sm"
          :href="place.google_maps_uri"
          target="_blank"
          rel="noopener noreferrer"
        >
          🗺 Maps
        </a>
        <button
          type="button"
          class="button button--ghost button--sm"
          :disabled="!place.reviews?.length"
          @click="emit('reviews', place)"
        >
          💬 Reviews
          <span v-if="place.reviews?.length" class="place-row__badge">{{ place.reviews.length }}</span>
        </button>
      </div>
    </td>
  </tr>
</template>
