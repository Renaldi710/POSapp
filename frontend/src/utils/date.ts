export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(iso))

export const formatTime = (iso: string): string =>
  new Intl.DateTimeFormat('id-ID', { timeStyle: 'short' }).format(new Date(iso))
