type JsonValue = string | number | boolean | null | JsonObject | JsonValue[]

type JsonObject = {
  [key: string]: JsonValue
}

const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  WORKOUT_PREFIX: 'workoutProgress:'
} as const

export const useAppStorage = () => {
  const isClient = () => process.client && typeof window !== 'undefined'

  const getItem = (key: string): string | null => {
    if (!isClient()) return null
    return localStorage.getItem(key)
  }

  const setItem = (key: string, value: string) => {
    if (!isClient()) return
    localStorage.setItem(key, value)
  }

  const removeItem = (key: string) => {
    if (!isClient()) return
    localStorage.removeItem(key)
  }

  const getJson = <T = JsonObject>(key: string): T | null => {
    const rawValue = getItem(key)
    if (!rawValue) return null

    try {
      return JSON.parse(rawValue) as T
    } catch {
      return null
    }
  }

  const setJson = (key: string, value: JsonValue | Record<string, unknown>) => {
    setItem(key, JSON.stringify(value))
  }

  const getWorkoutKey = (workoutId: string | number) => {
    return `${STORAGE_KEYS.WORKOUT_PREFIX}${String(workoutId)}`
  }

  const saveToken = (token: string) => setItem(STORAGE_KEYS.TOKEN, token)
  const getToken = () => getItem(STORAGE_KEYS.TOKEN)
  const clearToken = () => removeItem(STORAGE_KEYS.TOKEN)

  const saveUser = (user: Record<string, unknown>) => setJson(STORAGE_KEYS.USER, user)
  const getUser = <T = Record<string, unknown>>() => getJson<T>(STORAGE_KEYS.USER)
  const clearUser = () => removeItem(STORAGE_KEYS.USER)

  const clearAuth = () => {
    clearToken()
    clearUser()
  }

  const saveWorkoutProgress = (workoutId: string | number, progress: Record<string, unknown>) => {
    setJson(getWorkoutKey(workoutId), progress)
  }

  const getWorkoutProgress = <T = Record<string, unknown>>(workoutId: string | number) => {
    return getJson<T>(getWorkoutKey(workoutId))
  }

  const clearWorkoutProgress = (workoutId: string | number) => {
    removeItem(getWorkoutKey(workoutId))
  }

  return {
    keys: STORAGE_KEYS,
    getItem,
    setItem,
    removeItem,
    getJson,
    setJson,
    saveToken,
    getToken,
    clearToken,
    saveUser,
    getUser,
    clearUser,
    clearAuth,
    saveWorkoutProgress,
    getWorkoutProgress,
    clearWorkoutProgress
  }
}
