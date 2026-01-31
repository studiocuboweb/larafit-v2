import prisma from '../../utils/prisma'
import { requireAuth, canAccessStudent, requireTeacherOrAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const method = event.method
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID is required'
    })
  }

  const auth = requireAuth(event)

  if (method === 'GET') {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            active: true
          }
        },
        teacher: {
          include: {
            user: { select: { name: true } }
          }
        }
      }
    })

    if (!student) {
      throw createError({
        statusCode: 404,
        message: 'Student not found'
      })
    }

    const hasAccess = await canAccessStudent(auth, id)
    if (!hasAccess) {
      throw createError({
        statusCode: 403,
        message: 'Acesso negado'
      })
    }

    return student
  }

  if (method === 'PUT') {
    requireTeacherOrAdmin(event)
    
    const hasAccess = await canAccessStudent(auth, id)
    if (!hasAccess) {
      throw createError({
        statusCode: 403,
        message: 'Acesso negado'
      })
    }
    
    const body = await readBody(event)
    
    const updateData: any = {
      phone: body.phone,
      birthDate: body.birthDate ? new Date(body.birthDate) : null,
      observations: body.observations,
      user: {
        update: {
          name: body.name,
          active: body.active
        }
      }
    }

    if (auth.role === 'ADMIN' && body.teacherId) {
      updateData.teacherId = body.teacherId
    }
    
    const student = await prisma.student.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        teacher: {
          include: {
            user: { select: { name: true } }
          }
        }
      }
    })

    return student
  }

  if (method === 'DELETE') {
    requireTeacherOrAdmin(event)
    
    const hasAccess = await canAccessStudent(auth, id)
    if (!hasAccess) {
      throw createError({
        statusCode: 403,
        message: 'Acesso negado'
      })
    }

    await prisma.student.delete({
      where: { id }
    })

    return { success: true }
  }

  return { error: 'Method not allowed' }
})
