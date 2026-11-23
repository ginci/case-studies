import { connect } from "framer-api"
export const URL = "https://framer.com/projects/Ginci-Portfolio-Iteration-3--vQYX53a0u7he9Kdenr94-7S9HO"
export async function go(fn){ const f = await connect(URL, process.env.FRAMER_API_KEY); try { return await fn(f) } finally { try{ await f.disconnect?.() }catch{} process.exit(0) } }
