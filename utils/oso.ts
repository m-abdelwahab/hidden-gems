import { Oso } from "oso"

const loadPolarFileCache: Record<string, Promise<void>> = {}

export const loadPolarFile = async (oso: Oso, polarFilePath: string): Promise<void> => {
  const cacheHit = loadPolarFileCache[polarFilePath]
  if (cacheHit) return cacheHit

  const loadingPolarFile = oso.loadFile(polarFilePath)
  loadPolarFileCache[polarFilePath] = loadingPolarFile

  await loadingPolarFile
}
