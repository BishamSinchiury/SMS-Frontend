import { api } from '@/api/index'

let _cache = null

export async function getOrgProfile() {
    if (_cache) return _cache
    const res = await api.get('/org/public/')
    _cache = res.data

    applyOrgColors(_cache.primary_color, _cache.secondary_color)

    return _cache
}
    
function applyOrgColors(primary, secondary) {
  const root = document.documentElement
  if (primary) root.style.setProperty('--color-primary', primary)
  if (secondary) root.style.setProperty('--color-secondary', secondary)
}