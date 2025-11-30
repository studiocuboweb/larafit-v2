export default defineNuxtRouteMiddleware((to, from) => {
  // Executar apenas no client-side
  if (process.server) return

  // Pular verificação na página de login
  if (to.path === '/') return

  // Verificar se há um usuário logado
  const userString = localStorage.getItem('user')
  if (!userString) {
    // Se não houver usuário, redirecionar para login
    return navigateTo('/')
  }

  try {
    const user = JSON.parse(userString)
    
    // Verificar se o usuário está ativo
    if (user.active === false) {
      // Limpar dados e redirecionar
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      return navigateTo('/', {
        replace: true
      })
    }
  } catch (err) {
    // Se houver erro ao parsear, limpar e redirecionar
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return navigateTo('/')
  }
})
