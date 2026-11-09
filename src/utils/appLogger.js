// Captures every console.log/info/warn/error/debug call plus uncaught errors
// and unhandled promise rejections into an in-memory ring buffer, from the
// moment this module is evaluated (must be imported first in main.js).
const MAX_LOGS = 5000
const logs = []

function record(level, args) {
  const timestamp = new Date().toISOString()
  const message = args
    .map((arg) => {
      if (typeof arg === 'string') return arg
      if (arg instanceof Error) return arg.stack || arg.message
      try {
        return JSON.stringify(arg)
      } catch {
        return String(arg)
      }
    })
    .join(' ')

  logs.push(`[${timestamp}] [${level.toUpperCase()}] ${message}`)
  if (logs.length > MAX_LOGS) logs.shift()
}

;['log', 'info', 'warn', 'error', 'debug'].forEach((level) => {
  const original = console[level].bind(console)
  console[level] = (...args) => {
    record(level, args)
    original(...args)
  }
})

window.addEventListener('error', (event) => {
  record('error', [`Uncaught error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`])
})

window.addEventListener('unhandledrejection', (event) => {
  record('error', [`Unhandled promise rejection: ${event.reason?.stack || event.reason}`])
})

record('info', ['App logger initialized'])

export function getLogsAsText() {
  return logs.join('\n')
}
