<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useToastStore } from '@/stores/toast'

const props = defineProps<{
  open: boolean
  response: Record<string, any> | null
}>()

const emit = defineEmits<{
  close: []
}>()

const toast = useToastStore()
const activeTab = ref<'request' | 'response'>('request')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      activeTab.value = 'request'
    }
  },
)

const activePayload = computed(() =>
  activeTab.value === 'request' ? props.response?.request_body : props.response?.response_body,
)

const prettyPayload = computed(() => JSON.stringify(activePayload.value ?? {}, null, 2))

const syntaxHighlighted = computed(() => {
  const safe = prettyPayload.value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return safe.replace(
    /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let type = 'number'

      if (match.startsWith('"')) {
        type = match.endsWith(':') ? 'key' : 'string'
      } else if (match === 'true' || match === 'false') {
        type = 'boolean'
      } else if (match === 'null') {
        type = 'null'
      }

      return `<span class="json-${type}">${match}</span>`
    },
  )
})

const copyPayload = async () => {
  try {
    await navigator.clipboard.writeText(prettyPayload.value)
    toast.success('JSON copied', 'The payload was copied to your clipboard.')
  } catch (error) {
    toast.error('Copy failed', (error as Error).message)
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="viewer" @click.self="emit('close')">
        <div class="viewer__dialog card">
          <div class="card-header">
            <div>
              <p class="eyebrow">Saved API Payload</p>
              <h3>Response #{{ response?.id || '—' }}</h3>
            </div>

            <div class="viewer__actions">
              <button
                type="button"
                :class="['button button--ghost button--sm', { 'viewer__tab--active': activeTab === 'request' }]"
                @click="activeTab = 'request'"
              >
                Request Body
              </button>
              <button
                type="button"
                :class="['button button--ghost button--sm', { 'viewer__tab--active': activeTab === 'response' }]"
                @click="activeTab = 'response'"
              >
                Response Body
              </button>
              <button type="button" class="button button--soft button--sm" @click="copyPayload">
                Copy
              </button>
              <button type="button" class="button button--ghost button--sm" @click="emit('close')">
                Close
              </button>
            </div>
          </div>

          <div class="card-body">
            <pre class="viewer__code"><code v-html="syntaxHighlighted" /></pre>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
