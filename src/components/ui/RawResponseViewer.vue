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

<style scoped>
.viewer {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: grid;
  place-items: center;
  padding: var(--space-5);
  background: rgba(2, 8, 12, 0.84);
  backdrop-filter: blur(10px);
}

.viewer__dialog {
  width: min(980px, 100%);
  max-height: 88vh;
  overflow: auto;
}

.viewer__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.viewer__tab--active {
  border-color: rgba(34, 224, 194, 0.3);
  color: var(--accent);
}

.viewer__code {
  overflow: auto;
  max-height: 62vh;
  margin: 0;
  padding: var(--space-5);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: rgba(5, 13, 18, 0.92);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 0.88rem;
  line-height: 1.65;
}

:deep(.json-key) {
  color: var(--accent);
}

:deep(.json-string) {
  color: #b7f59e;
}

:deep(.json-number) {
  color: var(--gold);
}

:deep(.json-boolean) {
  color: var(--blue);
}

:deep(.json-null) {
  color: var(--danger);
}
</style>
