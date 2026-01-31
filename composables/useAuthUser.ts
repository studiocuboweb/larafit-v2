export const useAuthUser = () => {
  const user = useState<any>('authUser', () => null)

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        user.value = null
        return null
      }

      const response = await $fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      user.value = response
      return response
    } catch (error: any) {
      // Se for erro 401, token inválido - limpar e redirecionar
      if (error?.statusCode === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        user.value = null
        
        // Só redireciona se não estiver na página de login
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
