export default defineNuxtRouteMiddleware(async (to, from) => {
  // Executar apenas no client-side
  if (process.server) return

  // Pular verificação na página de login
  if (to.path === '/') return

  const appStorage = useAppStorage()

  const token = appStorage.getToken()
  if (!token) {
    appStorage.clearAuth()
    return navigateTo('/')
  }

  // Verificar se há um usuário logado
  const storedUser = appStorage.getUser<any>()

  if (!storedUser) {
    try {
      const user = await $fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (user.active === false) {
        appStorage.clearAuth()
        return navigateTo('/', { replace: true })
      }

      appStorage.saveUser(user)
      return
    } catch {
      appStorage.clearAuth()
      return navigateTo('/', { replace: true })
    }
  }

  try {
    const user = storedUser
    
    // Verificar se o usuário está ativo
    if (user.active === false) {
      // Limpar dados e redirecionar
      appStorage.clearAuth()
      
      return navigateTo('/', {
        replace: true
      })
    }
  } catch (err) {
    // Se houver erro ao parsear, limpar e redirecionar
    appStorage.clearAuth()
    return navigateTo('/')
  }
})
