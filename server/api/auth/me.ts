import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const userId = event.context.userId

  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Não autenticado'
    })
  }

  // Buscar usuário
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
      student: {
        select: {
          id: true
        }
      },
      teacher: {
        select: {
          id: true
        }
      }
    }
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'Usuário não encontrado'
    })
  }

  // Verificar se o usuário está ativo
  if (!user.active) {
    throw createError({
      statusCode: 403,
      message: 'Seu usuário está bloqueado, favor entrar em contato'
    })
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    active: user.active,
    studentId: user.student?.id,
    teacherId: user.teacher?.id
  }
})
