export default function defaultConfig() {
  return {
    collectCoverageFrom: [],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    verbose: true,
    ...(process.env.MAX_WORKERS
      ? { maxWorkers: Number(process.env.MAX_WORKERS) }
      : {})
  }
}
