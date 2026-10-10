import type { APIRoute } from 'astro'

// Keep existing clients working without publishing the previous owner's identity.
export const GET: APIRoute = ({ redirect }) => redirect('/.well-known/site-manifest.json', 308)
export { OPTIONS } from './site-manifest.json'
