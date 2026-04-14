export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

type ToastListener = (toast: ToastMessage) => void

const listeners = new Set<ToastListener>()

export function subscribeToast(listener: ToastListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function pushToast(input: Omit<ToastMessage, 'id'>): void {
  const toast: ToastMessage = {
    id: crypto.randomUUID(),
    ...input,
  }
  listeners.forEach((listener) => listener(toast))
}
