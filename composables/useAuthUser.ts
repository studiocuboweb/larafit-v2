export const useAuthUser = () => {
  const appStorage = useAppStorage()

  // Inicializar com dados do storage se disponível
  const user = useState<any>('authUser', () => {
    return appStorage.getUser()
  })

  const fetchUser = async () => {
    try {
      const token = appStorage.getToken()
      if (!token) {
        user.value = null
        appStorage.clearUser()
        return null
      }

      const response = await $fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      user.value = response
      appStorage.saveUser(response)
      return response
    } catch (error: any) {
      if (error?.statusCode === 401 || error?.statusCode === 403) {
        appStorage.clearAuth()
        user.value = null
        
        if (process.client && window.location.pathname !== '/') {
          navigateTo('/')
        }
      }
      return null
    }
  }

  const getUserInitials = (name: string) => {
    if (!name) return '?'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      ADMIN: 'Administrador',
      TEACHER: 'Professor',
      STUDENT: 'Aluno'
    }
    return roles[role] || role
  }

  return {
    user,
    fetchUser,
    getUserInitials,
    getRoleName
  }
}
