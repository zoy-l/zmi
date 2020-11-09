import { parse } from 'dotenv'
import fs from 'fs'

export default function loadDotEnv(envPath: string) {
  // If the path exists
  // Compare one by one, the existing value will not be overwritten
  if (fs.existsSync(envPath)) {
    const parsed = parse(fs.readFileSync(envPath, 'utf-8')) ?? {}
    Object.keys(parsed).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key]
      }
    })
  }
}
