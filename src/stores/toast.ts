import { defineStore } from 'pinia'

type ToastTone = 'success' | 'error' | 'info'

type ToastItem = {
  id: number
  tone: ToastTone
  title: string
  body: string
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as ToastItem[],
  }),

  actions: {
    push(tone: ToastTone, title: string, body: string) {
      const id = Date.now() + Math.floor(Math.random() * 1000)

      this.toasts.push({ id, tone, title, body })

      window.setTimeout(() => {
        this.remove(id)
      }, 4500)
    },

    remove(id: number) {
      this.toasts = this.toasts.filter((toast) => toast.id !== id)
    },

    success(title: string, body: string) {
      this.push('success', title, body)
    },

    error(title: string, body: string) {
      this.push('error', title, body)
    },

    info(title: string, body: string) {
      this.push('info', title, body)
    },
  },
})
