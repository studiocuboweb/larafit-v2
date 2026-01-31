import jwt from 'jsonwebtoken'
import prisma from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export const requireAuth = (event: any) => {
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Token não fornecido'
    })
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: string
      studentId?: string
      teacherId?: string
    }

    event.context.auth = decoded
    return decoded
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Token inválido ou expirado'
    })
  }
}

export const requireAdmin = (event: any) => {
  const auth = requireAuth(event)
  
  if (auth.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      message: 'Acesso negado. Apenas administradores.'
    })
  }
  
  return auth
}

export const requireTeacherOrAdmin = (event: any) => {
  const auth = requireAuth(event)
  
  if (auth.role !== 'TEACHER' && auth.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      message: 'Acesso negado. Apenas professores e administradores.'
    })
  }
  
  return auth
}

// Função auxiliar para verificar se um usuário pode acessar um aluno
export const canAccessStudent = async (auth: any, studentId: string) => {
  if (auth.role === 'ADMIN') return true
  
  if (auth.role === 'TEACHER') {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { teacherId: true }
    })
    return student?.teacherId === auth.teacherId
  }
  
  if (auth.role === 'STUDENT') {
    return auth.studentId === studentId
  }
  
  return false
}
