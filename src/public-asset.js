// Vite supplies the deployment prefix; keep local development at the root.
export function publicAsset(path, base = import.meta.env?.BASE_URL ?? '/') {
  return `${base.replace(/\/*$/, '/')}${path.replace(/^\/+/, '')}`
}
