import jwt from 'jsonwebtoken'

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
