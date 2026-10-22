// Static demo build (no api): the same steps as `npm run build` (web → insights → app web export into apps/web/dist),
// with demo mode switched on, so web, Insights and app keep their state in the browser (packages/shared/src/localClient.js).
// Used by Vercel (vercel.json). Usage: npm run build:demo
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const env = { ...process.env, VITE_DEMO_MODE: 'true', EXPO_PUBLIC_DEMO_MODE: 'true' }
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const steps = [
  ['run', 'build', '-w', '@kbc-loop/web'],
  ['run', 'build', '-w', '@kbc-loop/insights'],
  ['run', 'export:web', '-w', '@kbc-loop/app'],
]

for (const args of steps) {
  console.log(`\n> npm ${args.join(' ')} (demo mode)`)
  // shell is needed for npm.cmd on Windows; the arguments are fixed strings above, never user input.
  const result = spawnSync(npm, args, { cwd: root, env, stdio: 'inherit', shell: process.platform === 'win32' })
  if (result.status !== 0) {
    console.error(`Demo build failed at: npm ${args.join(' ')}`)
    process.exit(result.status ?? 1)
  }
}
console.log('\nDemo build ready in apps/web/dist (web at /, Insights at /kbc/, app at /app/)')
