export function formatDate(dateStr: string): string {
  return new Date(dateStr.replace(' ', 'T')).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateRelative(dateStr: string): string {
  const date = new Date(dateStr.replace(' ', 'T'))
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateStr)
}
