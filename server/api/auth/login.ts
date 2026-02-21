import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../utils/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email e senha são obrigatórios'
    })
  }

  // Buscar usuário por email
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      student: true,
      teacher: true
    }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Email ou senha inválidos'
    })
  }

  // Verificar se o usuário está ativo
  if (!user.active) {
    throw createError({
      statusCode: 403,
      message: 'Seu usuário está bloqueado, favor entrar em contato'
    })
  }

  // Verificar senha (temporário - sem bcrypt ainda)
  // TODO: Implementar verificação com bcrypt quando as senhas estiverem hashadas
  const isPasswordValid = password === user.password

  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      message: 'Email ou senha inválidos'
    })
  }

  const tokenExpiresIn = user.role === 'STUDENT' ? '180d' : '7d'

  // Gerar token JWT
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      studentId: user.student?.id,
      teacherId: user.teacher?.id
    },
    JWT_SECRET,
    { expiresIn: tokenExpiresIn }
  )

  // Retornar dados do usuário (sem senha) e token
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      active: user.active,
      studentId: user.student?.id,
      teacherId: user.teacher?.id
    }
  }
})
