import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
      student: {
        select: {
          id: true,
          teacherId: true
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

  if (!user.active) {
    throw createError({
      statusCode: 403,
      message: 'Usuário bloqueado'
    })
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    active: user.active,
    student: user.student,
    teacher: user.teacher,
    studentId: user.student?.id,
    teacherId: user.teacher?.id
  }
})
