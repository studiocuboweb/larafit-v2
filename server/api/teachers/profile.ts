import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const method = event.method
  const auth = requireAuth(event)

  if (auth.role !== 'TEACHER' || !auth.teacherId) {
    throw createError({
      statusCode: 403,
      message: 'Acesso negado'
    })
  }

  if (method === 'GET') {
    const teacher = await prisma.teacher.findUnique({
      where: { id: auth.teacherId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            active: true
          }
        }
      }
    })

    if (!teacher) {
      throw createError({
        statusCode: 404,
        message: 'Professor não encontrado'
      })
    }

    return teacher
  }

  if (method === 'PUT') {
    const body = await readBody(event)

    const teacher = await prisma.teacher.findUnique({
      where: { id: auth.teacherId }
    })

    if (!teacher) {
      throw createError({
        statusCode: 404,
        message: 'Professor não encontrado'
      })
    }

    const userUpdateData: any = {
      name: body.name
    }

    if (typeof body.password === 'string' && body.password.trim()) {
      userUpdateData.password = body.password.trim()
    }

    const updatedTeacher = await prisma.$transaction(async (tx) => {
      await tx.teacher.update({
        where: { id: auth.teacherId! },
        data: {
          phone: body.phone ?? null,
          cref: body.cref ?? null,
          specialties: Array.isArray(body.specialties) ? body.specialties : []
        }
      })

      await tx.user.update({
        where: { id: teacher.userId },
        data: userUpdateData
      })

      return tx.teacher.findUnique({
        where: { id: auth.teacherId! },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              active: true
            }
          }
        }
      })
    })

    return updatedTeacher
  }

  throw createError({
    statusCode: 405,
    message: 'Método não permitido'
  })
})
